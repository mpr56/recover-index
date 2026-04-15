import GlassSurface from '@/components/GlassSurface';
import { howItWorksStyles as s } from './HowItWorksModal.styles';

interface Props {
  open:    boolean;
  onClose: () => void;
}

const ITEMS = [
  {
    emoji: '😴',
    title: 'Sleep  ·  50%',
    desc:  'Duration and quality of your last sleep. 8h of great sleep scores highest. Both hours and quality rating are factored in.',
  },
  {
    emoji: '🏋️',
    title: 'Fatigue Debt  ·  35%',
    desc:  "Accumulated load from recent training, weighted by recency. A hard session 2 days ago still counts — your body hasn't fully recovered yet.",
  },
  {
    emoji: '⏰',
    title: 'Time of Day  ·  15%',
    desc:  'Activities later in the day carry a higher fatigue multiplier. An evening workout leaves less recovery time before sleep than a morning session.',
  },
] as const;

export default function HowItWorksModal({ open, onClose }: Props) {
  if (!open) return null;

  return (
    <div onClick={onClose} style={s.backdrop}>
      <div onClick={e => e.stopPropagation()} style={s.sheetWrap}>
        <GlassSurface borderRadius={24} backgroundOpacity={0.12} blur={24} style={s.sheet}>

          {/* Logo row */}
          <div style={s.logoRow}>
            <div style={s.logoMark}>R</div>
            <p style={s.logoLabel}>RecoveryIndex</p>
          </div>

          <p style={s.title}>How the score works</p>
          <p style={s.subtitle}>
            Your recovery score (0–100) is calculated each day from three components.
          </p>

          {/* Component breakdown */}
          {ITEMS.map(({ emoji, title, desc }) => (
            <div key={title} style={s.item}>
              <p style={s.itemTitle}>{emoji} {title}</p>
              <p style={s.itemDesc}>{desc}</p>
            </div>
          ))}

          {/* Tomorrow projection */}
          <div style={s.projectionItem}>
            <p style={s.projectionTitle}>📈 Tomorrow Projection</p>
            <p style={s.projectionDesc}>
              Estimates your score 24h from now assuming average sleep tonight.
              Use it to decide whether to train hard, go easy, or rest.
            </p>
          </div>

          <button onClick={onClose} style={s.closeBtn}>Got it</button>
        </GlassSurface>
      </div>
    </div>
  );
}
