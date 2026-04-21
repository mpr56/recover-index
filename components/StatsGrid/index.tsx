import GlassSurface from '@/components/GlassSurface';
import { STATUS_CONFIG, type RecoveryResult, type WorkloadStatus } from '@/lib/types';
import { shared } from '@/components/shared.styles';
import { statsGridStyles as s } from './StatsGrid.styles';

interface Props {
  result: RecoveryResult;
}

/**
 * Human-readable label + accent colour for each ACWR bucket.
 * The hex values match the STATUS_CONFIG palette so the dashboard feels cohesive.
 */
const WORKLOAD_DISPLAY: Record<WorkloadStatus, { label: string; hex: string; sub: string }> = {
  detraining: { label: 'Detraining', hex: '#60a5fa', sub: 'load dropping' },
  optimal:    { label: 'Sweet Spot', hex: '#4ade80', sub: 'well balanced'  },
  elevated:   { label: 'Elevated',   hex: '#facc15', sub: 'load climbing'  },
  danger:     { label: 'Danger',     hex: '#f87171', sub: 'injury risk'    },
};

export default function StatsGrid({ result }: Props) {
  const tomorrowColor =
    STATUS_CONFIG[
      result.tomorrowProjection >= 70 ? 'good'
      : result.tomorrowProjection >= 50 ? 'moderate'
      : 'poor'
    ].hex;

  const workload = WORKLOAD_DISPLAY[result.workloadStatus];

  const sleepDebtLabel = result.sleepDebt7d === 0
    ? 'on target'
    : `${result.sleepDebt7d}h owed`;

  return (
    <>
      {/* ── Fitness vs Fatigue (Banister CTL/ATL) ── */}
      <div style={s.grid}>
        <GlassSurface borderRadius={20} backgroundOpacity={0.07} blur={14} style={shared.cardPad}>
          <p style={shared.cardLabel}>Fitness</p>
          <p style={shared.statValue}>{result.chronicLoad}</p>
          <p style={shared.statSub}>42-day training base</p>
        </GlassSurface>

        <GlassSurface borderRadius={20} backgroundOpacity={0.07} blur={14} style={shared.cardPad}>
          <p style={shared.cardLabel}>Fatigue</p>
          <p style={shared.statValue}>{result.acuteLoad}</p>
          <p style={shared.statSub}>7-day acute load</p>
        </GlassSurface>
      </div>

      {/* ── Workload ratio & sleep debt ── */}
      <div style={{ ...s.grid, marginTop: 12 }}>
        <GlassSurface borderRadius={20} backgroundOpacity={0.07} blur={14} style={shared.cardPad}>
          <p style={shared.cardLabel}>Workload Ratio</p>
          <p style={{ ...shared.statValue, color: workload.hex }}>
            {result.workloadRatio.toFixed(2)}
          </p>
          <p style={shared.statSub}>
            {workload.label} · {workload.sub}
          </p>
        </GlassSurface>

        <GlassSurface borderRadius={20} backgroundOpacity={0.07} blur={14} style={shared.cardPad}>
          <p style={shared.cardLabel}>Sleep Debt (7d)</p>
          <p style={shared.statValue}>
            {result.sleepDebt7d.toFixed(1)}
            <span style={{ fontSize: 16, fontWeight: 700, color: 'rgba(255,255,255,0.4)', marginLeft: 4 }}>h</span>
          </p>
          <p style={shared.statSub}>
            target {result.sleepTargetHours}h · {sleepDebtLabel}
          </p>
        </GlassSurface>
      </div>

      {/* ── Tomorrow projection ── */}
      <div style={{ marginTop: 12 }}>
        <GlassSurface borderRadius={20} backgroundOpacity={0.07} blur={14} style={s.statCardCol}>
          <p style={shared.cardLabel}>Tomorrow</p>
          <p style={s.tomorrowValue(tomorrowColor)}>{result.tomorrowProjection}</p>
          <p style={shared.statSub}>projected score · assumes a decent sleep</p>
        </GlassSurface>
      </div>

      {/* ── Training advice ── */}
      <GlassSurface borderRadius={20} backgroundOpacity={0.07} blur={14} style={{ ...s.adviceCard, marginTop: 12 }}>
        <p style={shared.cardLabel}>Training Advice</p>
        <p style={s.adviceText}>{result.trainingAdvice}</p>
      </GlassSurface>
    </>
  );
}
