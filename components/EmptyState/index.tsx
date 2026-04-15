import GlassSurface from '@/components/GlassSurface';
import { emptyStateStyles as s } from './EmptyState.styles';

interface Props {
  onLogSleep:    () => void;
  onAddActivity: () => void;
}

export default function EmptyState({ onLogSleep, onAddActivity }: Props) {
  return (
    <div style={s.container}>
      <GlassSurface
        width="150px" height="150px"
        borderRadius={28} backgroundOpacity={0.07} blur={12}
        style={s.iconBox}
      >
        <span style={s.icon}>💤</span>
        <span style={s.iconLabel}>Nothing logged</span>
      </GlassSurface>

      <p style={s.title}>Start logging today</p>
      <p style={s.subtitle}>
        Add your sleep and activities to calculate your recovery score.
      </p>

      <div style={s.actions}>
        <button onClick={onLogSleep}    style={s.btn(true)}>😴 Log Sleep</button>
        <button onClick={onAddActivity} style={s.btn(false)}>🏋️ Add Activity</button>
      </div>
    </div>
  );
}
