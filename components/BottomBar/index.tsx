import { bottomBarStyles as s } from './BottomBar.styles';

interface Props {
  hasSleep:   boolean;
  onSleep:    () => void;
  onActivity: () => void;
  onHistory:  () => void;
}

export default function BottomBar({ hasSleep, onSleep, onActivity, onHistory }: Props) {
  return (
    <div style={s.bar}>
      <button onClick={onSleep}    style={s.btn(hasSleep, true)}>
        {hasSleep ? '😴 Sleep ✓' : '😴 Log Sleep'}
      </button>
      <button onClick={onActivity} style={s.btn(true, true)}>
        + Activity
      </button>
      <button onClick={onHistory}  style={s.btn(false)}>
        History
      </button>
    </div>
  );
}
