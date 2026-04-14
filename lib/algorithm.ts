import type {
  DayRecord, Activity, ActivitySubType, ActivityIntensity,
  SleepQuality, RecoveryResult, ActivityBreakdown,
} from './types';
import { timeToHours } from './dateUtils';

// ─── Sleep Score ──────────────────────────────────────────────────────────────
const SLEEP_QUALITY_BONUS: Record<SleepQuality, number> = { poor: -12, okay: 0, great: 9 };

export function sleepScore(hours: number, quality: SleepQuality): number {
  let score: number;
  if (hours >= 7.5 && hours <= 9)  score = 100;
  else if (hours < 7.5)            score = 100 - (7.5 - hours) * 14;
  else                             score = 100 + Math.min(hours - 9, 1) * 4;
  score += SLEEP_QUALITY_BONUS[quality];
  return Math.max(0, Math.min(110, score));
}

// ─── Sub-type load weights ────────────────────────────────────────────────────
// Reflects real-world CNS demand and recovery cost per activity type.
// Scale: 0.3 (yoga) → 1.5 (rugby). Multiplied by intensity + duration.
const SUBTYPE_WEIGHT: Record<ActivitySubType, number> = {
  // Sports
  football:     1.35, // high running volume, 90min game demand
  cricket:      0.75, // lots of standing, variable intensity
  hockey:       1.25, // continuous high-intensity movement
  tennis:       1.05, // explosive, stop-start, lateral load
  volleyball:   0.85, // explosive jumps, lots of rest
  table_tennis: 0.55, // upper body only, low CNS demand
  basketball:   1.20, // explosive, high intensity
  baseball:     0.70, // explosive bursts, lots of standing
  rugby:        1.50, // highest demand — contact, sprint, tackle
  golf:         0.45, // mostly walking, minimal muscle stress

  // Gym
  push:         1.00, // chest/shoulders/triceps
  pull:         1.00, // back/biceps — similar volume to push
  legs:         1.35, // squats/RDL — highest CNS demand in gym
  upper:        1.10, // push + pull combined
  lower:        1.25, // legs + posterior chain
  arms:         0.65, // isolation only, low systemic fatigue
  full_body:    1.20, // everything hit, moderate demand each
  cardio:       0.85, // steady state, aerobic not CNS
  hiit:         1.30, // metabolic conditioning, very taxing
  powerlifting: 1.40, // max CNS output on compound movements

  // Hobby
  hiking:        0.75, // steady state, terrain dependent
  cycling:       0.85, // cadence-based, low impact
  swimming:      0.80, // full body, no impact, recovers faster
  yoga:          0.30, // parasympathetic — actually aids recovery
  pilates:       0.45, // core focus, light systemic load
  martial_arts:  1.15, // technical + physical, high demand
  dancing:       0.65, // cardio + skill, moderate load
  rock_climbing: 0.95, // full body, grip strength intensive
  rowing:        1.00, // full body aerobic, moderate CNS
  skateboarding: 0.55, // skill-based, variable effort
};

const INTENSITY_WEIGHT: Record<ActivityIntensity, number> = {
  easy:     0.55,
  moderate: 1.00,
  hard:     1.65,
};

// ─── Time-of-day multiplier ───────────────────────────────────────────────────
// Evening sessions leave less recovery time before sleep → hit harder.
// 06:00 → 0.80 | 12:00 → 1.00 | 18:00 → 1.20 | 22:00 → 1.35
export function timeOfDayMultiplier(timeStr: string): number {
  const h = Math.max(5, Math.min(23, timeToHours(timeStr)));
  return 0.80 + ((h - 6) / 16) * 0.55;
}

export function activityBaseLoad(a: Activity): number {
  const dur = Math.min(a.durationMins / 60, 2.5);
  return SUBTYPE_WEIGHT[a.subType] * INTENSITY_WEIGHT[a.intensity] * dur * 40;
}

export function activityWeightedLoad(a: Activity): number {
  return activityBaseLoad(a) * timeOfDayMultiplier(a.timeOfDay);
}

export function totalDayLoad(activities: Activity[]): number {
  return activities.reduce((sum, a) => sum + activityWeightedLoad(a), 0);
}

// ─── Recovery Score ───────────────────────────────────────────────────────────
const DECAY = 0.65;

export function calculateRecovery(today: DayRecord, history: DayRecord[]): RecoveryResult {
  const sleep = today.sleep ? sleepScore(today.sleep.hours, today.sleep.quality) : 50;

  let debt = 0;
  [...history]
    .filter(r => r.date < today.date)
    .sort((a, b) => b.date.localeCompare(a.date))
    .forEach((record, i) => {
      debt += totalDayLoad(record.activities) * Math.pow(DECAY, i + 1);
    });

  const todayLoad = totalDayLoad(today.activities);
  debt += todayLoad * 0.5;

  const activityBreakdown: ActivityBreakdown[] = today.activities.map(a => ({
    activity:   a,
    load:       Math.round(activityBaseLoad(a)),
    timeWeight: Math.round(timeOfDayMultiplier(a.timeOfDay) * 100) / 100,
  }));

  const score = Math.round(Math.max(0, Math.min(100, sleep - debt * 0.6)));

  const tomorrowDebt       = (debt + todayLoad * 0.5) * DECAY;
  const tomorrowProjection = Math.round(Math.max(0, Math.min(100, sleep - tomorrowDebt * 0.6)));

  let status: RecoveryResult['status'];
  let recommendation: string;
  let trainingAdvice: string;

  if (score >= 85)      { status = 'excellent'; recommendation = 'Peak condition — push hard today.';        trainingAdvice = 'Great day for a PB attempt, heavy lifts, or high-intensity training.'; }
  else if (score >= 70) { status = 'good';      recommendation = 'Well recovered — normal training day.';   trainingAdvice = "Train as planned. You can go hard but don't force a PR."; }
  else if (score >= 55) { status = 'moderate';  recommendation = 'Partially recovered — dial it back.';    trainingAdvice = 'Keep intensity moderate. Focus on technique over load.'; }
  else if (score >= 35) { status = 'poor';      recommendation = 'Under-recovered — light activity only.'; trainingAdvice = 'Stick to a walk, light mobility, or yoga. Avoid anything taxing.'; }
  else                  { status = 'rest';      recommendation = 'Your body needs rest today.';             trainingAdvice = 'Skip training. Sleep, hydrate, and let your body repair.'; }

  return { score, sleepComponent: Math.round(sleep), fatigueDebt: Math.round(debt), todayLoad: Math.round(todayLoad), activityBreakdown, tomorrowProjection, status, recommendation, trainingAdvice };
}
