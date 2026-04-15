import GlassSurface from '@/components/GlassSurface';
import { getSubTypeIcon, getSubTypeLabel, type Activity, type RecoveryResult } from '@/lib/types';
import { activityWeightedLoad } from '@/lib/algorithm';
import { shared } from '@/components/shared.styles';
import { activitiesSectionStyles as s } from './ActivitiesSection.styles';

interface Props {
  activities:   Activity[];
  result:       RecoveryResult | null;
  onAdd:        () => void;
  onEdit:       (act: Activity) => void;
  onRemove:     (id: string) => void;
}

export default function ActivitiesSection({
  activities, result, onAdd, onEdit, onRemove,
}: Props) {
  const sorted = [...activities].sort((a, b) => a.timeOfDay.localeCompare(b.timeOfDay));

  return (
    <GlassSurface borderRadius={20} backgroundOpacity={0.07} blur={14} style={s.card}>
      {/* Header */}
      <div style={s.header}>
        <p style={shared.cardLabel}>Activities today</p>
        <button onClick={onAdd} style={s.addBtn}>+ Add</button>
      </div>

      {/* List or empty message */}
      {sorted.length === 0 ? (
        <p style={s.empty}>No activities logged yet</p>
      ) : (
        <div style={s.list}>
          {sorted.map(act => {
            const icon  = getSubTypeIcon(act.subType);
            const label = getSubTypeLabel(act.subType);
            const load  = Math.round(activityWeightedLoad(act));

            return (
              <div key={act.id} style={s.item}>
                <div style={s.itemLeft}>
                  <div style={s.itemIcon}>{icon}</div>
                  <div>
                    <p style={s.itemName}>{label}</p>
                    <p style={s.itemMeta}>
                      {act.intensity} · {act.durationMins}min · 🕐 {act.timeOfDay}
                    </p>
                  </div>
                </div>
                <div style={s.itemRight}>
                  <span style={s.loadBadge}>{load} pts</span>
                  <button onClick={() => onEdit(act)}   style={s.editBtn}>✎</button>
                  <button onClick={() => onRemove(act.id)} style={s.removeBtn}>×</button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Total load footer */}
      {result && sorted.length > 0 && (
        <div style={s.totalRow}>
          <p style={s.totalLabel}>Total load today</p>
          <p style={s.totalValue}>{result.todayLoad} pts</p>
        </div>
      )}
    </GlassSurface>
  );
}
