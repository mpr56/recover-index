import { STATUS_CONFIG, type WeekDay } from '@/lib/types';
import { fmtDay } from '@/lib/dateUtils';
import { W, H, PX, PY, pw, ph, weekChartStyles as s } from './WeekChart.styles';

interface Props { week: WeekDay[]; }

export default function WeekChart({ week }: Props) {
  const pts = week.map((d, i) => ({
    x: PX + (i / (week.length - 1)) * pw,
    y: d.score != null ? PY + ph - (d.score / 100) * ph : null,
    ...d,
  }));

  const valid = pts.filter(p => p.y != null);
  const line  = valid.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
  const area  = valid.length > 1
    ? `${line} L${valid[valid.length - 1].x},${PY + ph} L${valid[0].x},${PY + ph} Z`
    : '';

  return (
    <svg viewBox={`0 0 ${W} ${H + 16}`} style={s.svg}>
      <defs>
        <linearGradient id="wcg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#818cf8" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#818cf8" stopOpacity="0"    />
        </linearGradient>
      </defs>
      {area && <path d={area} fill="url(#wcg)" />}
      {line && <path d={line} fill="none" stroke="#818cf8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />}
      {pts.map((p, i) => (
        <g key={i}>
          {p.y != null
            ? <circle cx={p.x} cy={p.y!} r="3.5"
                fill={p.status ? STATUS_CONFIG[p.status].hex : '#818cf8'}
                stroke="rgba(0,0,0,0.4)" strokeWidth="1.5" />
            : <circle cx={p.x} cy={PY + ph / 2} r="2" fill="rgba(255,255,255,0.1)" />}
          <text x={p.x} y={H + 10} fontSize="8" fill="rgba(255,255,255,0.3)" textAnchor="middle">
            {fmtDay(p.date)}
          </text>
        </g>
      ))}
    </svg>
  );
}
