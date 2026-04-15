import GlassSurface from '@/components/GlassSurface';
import { type SleepEntry, type RecoveryResult } from '@/lib/types';
import { shared } from '@/components/shared.styles';
import { sleepCardStyles as s } from './SleepCard.styles';

interface Props {
  sleep:    SleepEntry;
  result:   RecoveryResult | null;
  onEdit:   () => void;
}

const qualityEmoji = (q: SleepEntry['quality']) =>
  q === 'great' ? '😊' : q === 'okay' ? '😐' : '😴';

export default function SleepCard({ sleep, result, onEdit }: Props) {
  return (
    <GlassSurface borderRadius={20} backgroundOpacity={0.07} blur={14} style={s.card}>
      <div style={s.row}>
        <div>
          <p style={shared.cardLabel}>Sleep</p>
          <p style={shared.statValue}>{sleep.hours}h</p>
          <p style={shared.statSub}>
            {sleep.quality}
            {sleep.bedtime  && ` · 🛏 ${sleep.bedtime}`}
            {sleep.wakeTime && ` → ${sleep.wakeTime}`}
          </p>
        </div>

        <div style={s.right}>
          <span style={s.emoji}>{qualityEmoji(sleep.quality)}</span>
          <button onClick={onEdit} style={s.editBtn}>Edit</button>
        </div>
      </div>

      {result && (
        <div style={s.scoreRow}>
          <p style={s.scoreText}>
            Sleep score:{' '}
            <span style={s.scoreValue}>{result.sleepComponent}</span>
          </p>
        </div>
      )}
    </GlassSurface>
  );
}
