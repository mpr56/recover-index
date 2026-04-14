import { STATUS_CONFIG, type RecoveryStatus } from '@/lib/types';
import { scoreArcStyles as s } from './ScoreArc.styles';

interface Props { score: number; status: RecoveryStatus; }

export default function ScoreArc({ score, status }: Props) {
  const { hex, label } = STATUS_CONFIG[status];
  const r    = 72, cx = 90, cy = 90;
  const circ = 2 * Math.PI * r;
  const arc  = (score / 100) * circ;

  return (
    <div style={s.container}>
      <svg viewBox="0 0 180 180" style={s.svg}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={hex} strokeWidth="10"
          strokeDasharray={`${arc} ${circ}`} strokeLinecap="round"
          style={{ transition: 'stroke-dasharray 1.1s cubic-bezier(0.4,0,0.2,1)', filter: `drop-shadow(0 0 8px ${hex}88)` }} />
      </svg>
      <div style={s.labelContainer}>
        <span style={s.scoreNumber(hex)}>{score}</span>
        <span style={s.statusLabel(hex)}>{label}</span>
      </div>
    </div>
  );
}
