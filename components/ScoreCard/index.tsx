import GlassSurface from '@/components/GlassSurface';
import ScoreArc from '@/components/ScoreArc';
import { Chip } from '@/components/ui';
import { type RecoveryResult, type SleepEntry } from '@/lib/types';
import { fmtDate } from '@/lib/dateUtils';
import { useTimezone } from '@/lib/timezoneContext';
import { scoreCardStyles as s } from './ScoreCard.styles';

interface Props {
  result: RecoveryResult;
  sleep:  SleepEntry | null;
}

export default function ScoreCard({ result, sleep }: Props) {
  const { todayStr } = useTimezone();

  return (
    <GlassSurface borderRadius={24} backgroundOpacity={0.08} blur={16} style={s.card}>
      <p style={s.dateLabel}>{fmtDate(todayStr())}</p>

      <ScoreArc score={result.score} status={result.status} />

      <p style={s.recommendation}>{result.recommendation}</p>

      <div style={s.chipRow}>
        {sleep && (
          <Chip onRemove={undefined}>
            😴 {sleep.hours}h · {sleep.quality}
          </Chip>
        )}
      </div>
    </GlassSurface>
  );
}
