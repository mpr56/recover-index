import type {
  DayRecord, Activity, ActivitySubType, ActivityIntensity,
  SleepQuality, SleepEntry, RecoveryResult, ActivityBreakdown,
  WorkloadStatus,
} from './types';
import { timeToHours } from './dateUtils';

/* ═══════════════════════════════════════════════════════════════════════════
 * RECOVERY ALGORITHM — v2 (Banister FFM + ACWR + load-adjusted sleep)
 *
 * What changed from v1:
 *   - Fatigue now decays on a realistic two-timescale model (Banister 1975):
 *       ATL (acute / fatigue)    τ = 7 days   — "how cooked am I right now"
 *       CTL (chronic / fitness)  τ = 42 days  — "what's my usual training level"
 *   - Adds ACWR (Gabbett) = ATL / CTL. Spike-detector for injury risk.
 *   - Sleep target now scales with training load — higher CTL → higher target.
 *   - Tracks 7-day sleep debt, not just last night.
 *   - Optional session-RPE (1–10) overrides the 3-bucket intensity for users
 *     who want finer control (Foster method, correlates with HR-TRIMP).
 *   - Duration is soft-saturated rather than hard-clamped at 2.5h.
 *
 * The score is a blend of three signals, each 0–100:
 *     0.45 × sleepComponent
 *   + 0.35 × acuteFatigueComponent   (ATL relative to CTL)
 *   + 0.20 × workloadRatioComponent  (ACWR penalty, mostly zero in the sweet spot)
 * ═══════════════════════════════════════════════════════════════════════════ */


/* ─── Sub-type & intensity weights (unchanged from v1) ─────────────────────── */

const SUBTYPE_WEIGHT: Record<ActivitySubType, number> = {
  // Sports
  football: 1.35, cricket: 0.75, hockey: 1.25, tennis: 1.05, volleyball: 0.85,
  table_tennis: 0.55, basketball: 1.20, baseball: 0.70, rugby: 1.50, golf: 0.45,
  // Gym
  push: 1.00, pull: 1.00, legs: 1.35, upper: 1.10, lower: 1.25,
  arms: 0.65, full_body: 1.20, cardio: 0.85, hiit: 1.30, powerlifting: 1.40,
  // Hobby
  hiking: 0.75, cycling: 0.85, swimming: 0.80, yoga: 0.30, pilates: 0.45,
  martial_arts: 1.15, dancing: 0.65, rock_climbing: 0.95, rowing: 1.00, skateboarding: 0.55,
};

const INTENSITY_WEIGHT: Record<ActivityIntensity, number> = {
  easy: 0.55, moderate: 1.00, hard: 1.65,
};

/* ─── Time-of-day multiplier (unchanged) ───────────────────────────────────── */

export function timeOfDayMultiplier(timeStr: string): number {
  const h = Math.max(5, Math.min(23, timeToHours(timeStr)));
  return 0.80 + ((h - 6) / 16) * 0.55;
}


/* ─── Per-activity load ────────────────────────────────────────────────────────
 *
 * Two paths:
 *   1. User provided RPE (1–10) → use Foster session-RPE: RPE × minutes × subtype.
 *      Rescaled so a "moderate 60min push" lands on roughly the same value
 *      as the old intensity-based calc, keeping historical data comparable.
 *   2. No RPE → fall back to intensity bucket × duration × subtype, same shape
 *      as v1 but with soft duration saturation instead of a hard 2.5h clamp.
 * ─────────────────────────────────────────────────────────────────────────── */

/**
 * Soft saturation on duration. A 3h session is genuinely more load than a 2h
 * session, but not twice as much — diminishing returns as you get fatigued.
 * At 60min → ~0.86, 120min → ~1.5, 180min → ~2.0, 240min → ~2.4, asymptote at 6h.
 */
function durationFactor(mins: number): number {
  const hours = mins / 60;
  return hours / (1 + hours / 6);
}

export function activityBaseLoad(a: Activity): number {
  const dur = durationFactor(a.durationMins);
  const sub = SUBTYPE_WEIGHT[a.subType];

  if (typeof a.rpe === 'number' && a.rpe >= 1 && a.rpe <= 10) {
    // RPE path. Calibrated so that RPE=5 ≈ intensity 'moderate'. The intensity
    // buckets (0.55 / 1.00 / 1.65) map roughly to RPE (3, 5, 8), so we use 0.2
    // as the per-point multiplier — that puts RPE=3 ≈ 0.6 (close to 'easy'),
    // RPE=5 = 1.0 (exactly 'moderate'), RPE=8 = 1.6 (close to 'hard').
    return sub * a.rpe * dur * 40 * 0.20;
  }

  return sub * INTENSITY_WEIGHT[a.intensity] * dur * 40;
}

export function activityWeightedLoad(a: Activity): number {
  return activityBaseLoad(a) * timeOfDayMultiplier(a.timeOfDay);
}

export function totalDayLoad(activities: Activity[]): number {
  return activities.reduce((sum, a) => sum + activityWeightedLoad(a), 0);
}


/* ─── Banister Fitness-Fatigue Model ───────────────────────────────────────────
 *
 * Standard formulation used by TrainingPeaks, Strava, Elevate, GoldenCheetah:
 *
 *   ATL(t) = ATL(t-1) · e^(-1/τ₁) + load(t) · (1 - e^(-1/τ₁))    τ₁ = 7 days
 *   CTL(t) = CTL(t-1) · e^(-1/τ₂) + load(t) · (1 - e^(-1/τ₂))    τ₂ = 42 days
 *
 * Fatigue (ATL) decays ~3× faster than fitness (CTL) — this is the whole point,
 * it's why a hard block leaves you tired but fitter a week later.
 * ─────────────────────────────────────────────────────────────────────────── */

const TAU_ATL = 7;   // days — acute / fatigue time constant
const TAU_CTL = 42;  // days — chronic / fitness time constant

const ALPHA_ATL = 1 - Math.exp(-1 / TAU_ATL);  // ≈ 0.1331
const ALPHA_CTL = 1 - Math.exp(-1 / TAU_CTL);  // ≈ 0.0236

interface LoadState { atl: number; ctl: number; }

/**
 * Walk daily loads oldest → newest and compute the final ATL/CTL.
 *
 * `dailyLoads` must be in chronological order: earliest first, today last.
 * Missing days should be included as 0-load days — rest is part of the signal.
 *
 * Seeding: naïvely starting ATL=CTL=0 produces an artificially inflated
 * ACWR for months, because ATL (τ=7d) converges much faster than CTL (τ=42d).
 * To fix this we seed BOTH to the mean of the first 7 days' loads, which
 * treats the observation window as beginning from an equilibrium state.
 * This is the same approach TrainingPeaks and GoldenCheetah use.
 */
function computeLoadState(dailyLoads: number[]): LoadState {
  if (dailyLoads.length === 0) return { atl: 0, ctl: 0 };

  const seedWindow = dailyLoads.slice(0, Math.min(7, dailyLoads.length));
  const seed = seedWindow.reduce((a, b) => a + b, 0) / seedWindow.length;

  let atl = seed, ctl = seed;
  for (const load of dailyLoads) {
    atl = atl * (1 - ALPHA_ATL) + load * ALPHA_ATL;
    ctl = ctl * (1 - ALPHA_CTL) + load * ALPHA_CTL;
  }
  return { atl, ctl };
}

/**
 * Build a chronological array of daily loads covering [start, end] inclusive,
 * using 0 for days with no record. This is what the Banister EWMA needs.
 */
function dailyLoadSeries(records: DayRecord[], startDate: string, endDate: string): number[] {
  const byDate = new Map(records.map(r => [r.date, totalDayLoad(r.activities)]));
  const out: number[] = [];
  const cursor = new Date(startDate + 'T00:00:00Z');
  const end    = new Date(endDate   + 'T00:00:00Z');
  while (cursor <= end) {
    const key = cursor.toISOString().split('T')[0];
    out.push(byDate.get(key) ?? 0);
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }
  return out;
}


/* ─── ACWR classification ──────────────────────────────────────────────────────
 *
 * Gabbett's "sweet spot" (2016): 0.8–1.3. Above 1.5 = ~2-3× injury risk in
 * multiple sport studies. Below 0.8 = detraining. Thresholds are approximate
 * and the literature is contested on exact values — treat as a coaching signal.
 *
 * Edge case: when CTL is very low (new users, or after a long break), the ratio
 * becomes meaningless — one hard session can easily push it to 5.0. We return
 * 'optimal' in that case and let the absolute ATL drive the score.
 * ─────────────────────────────────────────────────────────────────────────── */

function classifyWorkloadRatio(atl: number, ctl: number): {
  ratio: number;
  status: WorkloadStatus;
} {
  if (ctl < 10) return { ratio: 1, status: 'optimal' }; // insufficient baseline
  const ratio = atl / ctl;
  let status: WorkloadStatus;
  if      (ratio < 0.80)  status = 'detraining';
  else if (ratio <= 1.30) status = 'optimal';
  else if (ratio <= 1.50) status = 'elevated';
  else                    status = 'danger';
  return { ratio, status };
}


/* ─── Sleep scoring ────────────────────────────────────────────────────────────
 *
 * Four parts:
 *   1. Load-adjusted nightly target. Base 7.5h; adds up to +1.5h as CTL climbs.
 *      Grounded in athlete-sleep research showing 8–10h needed during heavy
 *      training blocks.
 *   2. Duration score vs that target.
 *   3. 7-day rolling sleep debt penalty (chronic debt hurts more than one bad
 *      night — sleep debt takes days to weeks to clear).
 *   4. Quality self-report bonus, reduced weight because 1+3 do more work now.
 * ─────────────────────────────────────────────────────────────────────────── */

const SLEEP_QUALITY_BONUS: Record<SleepQuality, number> = { poor: -6, okay: 0, great: 5 };

/** Target sleep hours scales with chronic training load. */
export function targetSleepHours(ctl: number): number {
  // CTL 0 → 7.5h, CTL 80 → 8.5h. Caps at 9h.
  const extra = Math.min(ctl / 80, 1.5);
  return Math.min(7.5 + extra, 9);
}

/** Score for last night's sleep, 0–105. */
export function sleepDurationScore(hours: number, target: number): number {
  if (hours >= target && hours <= target + 1.5) return 100;
  if (hours < target) {
    // -14 pts per hour below target, matching v1's slope
    return Math.max(0, 100 - (target - hours) * 14);
  }
  // Oversleep: small bonus up to +5, then flat
  return Math.min(105, 100 + (hours - target - 1.5) * 2);
}

/** Total hours of sleep owed over the last 7 days (>= 0). */
function computeSleepDebt(history: DayRecord[], today: DayRecord, target: number): number {
  const all = [...history, today]
    .filter(r => r.sleep)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 7);
  let debt = 0;
  for (const r of all) {
    const deficit = target - (r.sleep as SleepEntry).hours;
    if (deficit > 0) debt += deficit;
  }
  return Math.round(debt * 10) / 10;
}

/** Full sleep component — returns 0–110. */
function sleepComponent(
  sleep: SleepEntry | null,
  sleepDebt7d: number,
  target: number,
): number {
  if (!sleep) return 55; // neutral-ish when no data

  let score = sleepDurationScore(sleep.hours, target);
  score += SLEEP_QUALITY_BONUS[sleep.quality];

  // Debt penalty: -3 pts per hour of 7-day debt, capped at -15.
  // One bad night (~1-2h debt) barely hurts; a full week of short sleep
  // (~7h debt) costs ~15 pts on top of that night's direct duration hit.
  score -= Math.min(sleepDebt7d * 3, 15);

  return Math.max(0, Math.min(110, score));
}


/* ─── Main recovery calculation ────────────────────────────────────────────── */

export function calculateRecovery(today: DayRecord, history: DayRecord[]): RecoveryResult {
  /* 1. Compute Banister load state through yesterday (history only — today's
        sessions affect tomorrow's ATL, not today's recovery score). */
  const priorRecords = history
    .filter(r => r.date < today.date)
    .sort((a, b) => a.date.localeCompare(b.date));

  const priorLoads = priorRecords.length > 0
    ? dailyLoadSeries(priorRecords, priorRecords[0].date, priorRecords[priorRecords.length - 1].date)
    : [];
  const { atl: priorATL, ctl: priorCTL } = computeLoadState(priorLoads);

  /* 2. Apply today's load to project what ATL/CTL will look like after today.
        Today's load hurts today's score too (you can't train hard this morning
        and be "recovered" by afternoon), but weighted less than yesterday's. */
  const todayLoad = totalDayLoad(today.activities);
  const atlAfterToday = priorATL * (1 - ALPHA_ATL) + todayLoad * ALPHA_ATL;
  const ctlAfterToday = priorCTL * (1 - ALPHA_CTL) + todayLoad * ALPHA_CTL;

  // The "current" ATL that affects today's recovery blends prior + some of today.
  // 0.5 weight on today matches v1's behaviour and reflects that morning sessions
  // are felt harder by evening than a session finished yesterday morning.
  const effectiveATL = priorATL + (atlAfterToday - priorATL) * 0.5;

  const { ratio: workloadRatio, status: workloadStatus } =
    classifyWorkloadRatio(effectiveATL, ctlAfterToday);

  /* 3. Sleep component — target scales with chronic load. */
  const sleepTargetHours = Math.round(targetSleepHours(ctlAfterToday) * 10) / 10;
  const sleepDebt7d = computeSleepDebt(priorRecords, today, sleepTargetHours);
  const sleepScoreVal = sleepComponent(today.sleep, sleepDebt7d, sleepTargetHours);

  /* 4. Acute-fatigue component — ATL relative to CTL.
        If ATL is at or below CTL, you're fresh: full 100.
        As ATL climbs above CTL, you get tired: 100 → 0 as "excess fatigue" grows.
        We measure excess as ATL−CTL, normalised against CTL (or 30 for new users).
        This makes "tired" a relative concept — someone with CTL 80 tolerates an
        ATL of 90 much better than a beginner would. */
  const referenceCapacity = Math.max(ctlAfterToday, 30);
  const excessFatigue = Math.max(0, effectiveATL - ctlAfterToday);
  const fatigueComponent = Math.max(0, 100 - (excessFatigue / referenceCapacity) * 180);

  /* 5. Workload-ratio component — a nudge, not the main event.
        Inside the sweet spot → no penalty. Outside → progressively worse. */
  const ratioComponent = workloadToComponent(workloadStatus);

  /* 6. Blend. */
  const rawScore = 0.45 * sleepScoreVal + 0.35 * fatigueComponent + 0.20 * ratioComponent;
  const score = Math.round(Math.max(0, Math.min(100, rawScore)));

  /* 7. Tomorrow's projection — decay ATL one more day, assume neutral sleep. */
  const atlTomorrow = atlAfterToday * (1 - ALPHA_ATL);
  const ctlTomorrow = ctlAfterToday * (1 - ALPHA_CTL);
  const excessTomorrow = Math.max(0, atlTomorrow - ctlTomorrow);
  const fatigueTomorrow = Math.max(0, 100 - (excessTomorrow / Math.max(ctlTomorrow, 30)) * 180);
  const { status: wsTomorrow } = classifyWorkloadRatio(atlTomorrow, ctlTomorrow);
  const ratioTomorrow = workloadToComponent(wsTomorrow);
  const tomorrowProjection = Math.round(Math.max(0, Math.min(100,
    0.45 * 85 + 0.35 * fatigueTomorrow + 0.20 * ratioTomorrow
  )));

  /* 8. Per-activity breakdown for the UI. */
  const activityBreakdown: ActivityBreakdown[] = today.activities.map(a => ({
    activity:   a,
    load:       Math.round(activityBaseLoad(a)),
    timeWeight: Math.round(timeOfDayMultiplier(a.timeOfDay) * 100) / 100,
  }));

  /* 9. Status bucket & coaching copy — informed by workload ratio too,
        so a "danger zone" ACWR bumps the advice down even if sleep was fine. */
  const { status, recommendation, trainingAdvice } =
    coachingCopy(score, workloadStatus, sleepDebt7d);

  return {
    score,
    sleepComponent: Math.round(sleepScoreVal),
    fatigueDebt:    Math.round(effectiveATL),     // alias of acuteLoad for UI compat
    todayLoad:      Math.round(todayLoad),
    activityBreakdown,
    tomorrowProjection,
    status,
    recommendation,
    trainingAdvice,

    acuteLoad:        Math.round(effectiveATL),
    chronicLoad:      Math.round(ctlAfterToday),
    workloadRatio:    Math.round(workloadRatio * 100) / 100,
    workloadStatus,
    sleepDebt7d,
    sleepTargetHours,
  };
}

function workloadToComponent(status: WorkloadStatus): number {
  switch (status) {
    case 'detraining': return 90;   // mild — still "off the sweet spot"
    case 'optimal':    return 100;
    case 'elevated':   return 70;
    case 'danger':     return 40;
  }
}


/* ─── Coaching copy ────────────────────────────────────────────────────────── */

function coachingCopy(
  score: number,
  workload: WorkloadStatus,
  sleepDebt: number,
): { status: RecoveryResult['status']; recommendation: string; trainingAdvice: string } {
  // Danger zone overrides everything — this is the injury-risk case.
  if (workload === 'danger') {
    return {
      status: 'poor',
      recommendation: 'Big spike in load this week — ease off.',
      trainingAdvice: 'Your acute load is well above your usual. Drop intensity or take a rest day; this is the window where injuries happen.',
    };
  }

  if (score >= 85) {
    return {
      status: 'excellent',
      recommendation: 'Peak condition — push hard today.',
      trainingAdvice: workload === 'detraining'
        ? 'Fresh, but chronic load is dropping. Good day to reintroduce volume, not just intensity.'
        : 'Great day for a PB attempt, heavy lifts, or high-intensity training.',
    };
  }
  if (score >= 70) {
    return {
      status: 'good',
      recommendation: sleepDebt > 4
        ? 'Recovered, but carrying sleep debt — prioritise rest tonight.'
        : 'Well recovered — normal training day.',
      trainingAdvice: "Train as planned. You can go hard but don't force a PR.",
    };
  }
  if (score >= 55) {
    return {
      status: 'moderate',
      recommendation: workload === 'elevated'
        ? 'Partial recovery, load is climbing — dial it back.'
        : 'Partially recovered — dial it back.',
      trainingAdvice: 'Keep intensity moderate. Focus on technique over load.',
    };
  }
  if (score >= 35) {
    return {
      status: 'poor',
      recommendation: 'Under-recovered — light activity only.',
      trainingAdvice: 'Stick to a walk, light mobility, or yoga. Avoid anything taxing.',
    };
  }
  return {
    status: 'rest',
    recommendation: 'Your body needs rest today.',
    trainingAdvice: 'Skip training. Sleep, hydrate, and let your body repair.',
  };
}


/* ─── Legacy export for UI components that use v1 sleepScore directly ──────── */

/** @deprecated — retained only because a few UI components may import it directly.
 *  Prefer `sleepDurationScore(hours, targetSleepHours(ctl))`. */
export function sleepScore(hours: number, quality: SleepQuality): number {
  const base = sleepDurationScore(hours, 8);
  return Math.max(0, Math.min(110, base + SLEEP_QUALITY_BONUS[quality]));
}
