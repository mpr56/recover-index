import GlassSurface from '@/components/GlassSurface';
import WeekChart from '@/components/WeekChart';
import { type WeekDay } from '@/lib/types';
import { shared } from '@/components/shared.styles';
import { trendSectionStyles as s } from './TrendSection.styles';

interface Props {
  week:       WeekDay[];
  onViewAll:  () => void;
}

export default function TrendSection({ week, onViewAll }: Props) {
  return (
    <GlassSurface borderRadius={20} backgroundOpacity={0.07} blur={14} style={s.card}>
      <div style={s.header}>
        <p style={shared.cardLabel}>7-Day Trend</p>
        <button onClick={onViewAll} style={s.viewAllBtn}>View all →</button>
      </div>
      <WeekChart week={week} />
    </GlassSurface>
  );
}
