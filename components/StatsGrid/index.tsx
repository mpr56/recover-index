import GlassSurface from '@/components/GlassSurface';
import { STATUS_CONFIG, type RecoveryResult } from '@/lib/types';
import { shared } from '@/components/shared.styles';
import { statsGridStyles as s } from './StatsGrid.styles';

interface Props {
  result: RecoveryResult;
}

export default function StatsGrid({ result }: Props) {
  const tomorrowColor =
    STATUS_CONFIG[
      result.tomorrowProjection >= 70 ? 'good'
      : result.tomorrowProjection >= 50 ? 'moderate'
      : 'poor'
    ].hex;

  return (
    <>
      {/* Two-column stat cards */}
      <div style={s.grid}>
        <GlassSurface borderRadius={20} backgroundOpacity={0.07} blur={14} style={shared.cardPad}>
          <p style={shared.cardLabel}>Fatigue Debt</p>
          <p style={shared.statValue}>{result.fatigueDebt}</p>
          <p style={shared.statSub}>accumulated load</p>
        </GlassSurface>

        <GlassSurface borderRadius={20} backgroundOpacity={0.07} blur={14} style={s.statCardCol}>
          <p style={shared.cardLabel}>Tomorrow</p>
          <p style={s.tomorrowValue(tomorrowColor)}>{result.tomorrowProjection}</p>
          <p style={shared.statSub}>projected score</p>
        </GlassSurface>
      </div>

      {/* Training advice */}
      <GlassSurface borderRadius={20} backgroundOpacity={0.07} blur={14} style={s.adviceCard}>
        <p style={shared.cardLabel}>Training Advice</p>
        <p style={s.adviceText}>{result.trainingAdvice}</p>
      </GlassSurface>
    </>
  );
}
