import GlassSurface from '@/components/GlassSurface';
import WeekChart from '@/components/WeekChart';
import { sharedStyles as shared } from '@/components/ui';
import { STATUS_CONFIG, type WeekDay } from '@/lib/types';
import { fmtDate, todayStr } from '@/lib/dateUtils';
import { historySheetStyles as s } from './HistorySheet.styles';

interface Props {
  open:    boolean;
  onClose: () => void;
  week:    WeekDay[];
}

export default function HistorySheet({ open, onClose, week }: Props) {
  return (
    <>
      {open && <div onClick={onClose} style={shared.backdrop} />}

      <div style={shared.sheetOuter(open)}>
        <div style={{ width: '100%', maxWidth: 480 }}>
          <GlassSurface
            borderRadius={24}
            backgroundOpacity={0.1}
            blur={24}
            style={{
              borderBottomLeftRadius: 0,
              borderBottomRightRadius: 0,
              maxHeight: '80vh',
              overflowY: 'auto',
              padding: '12px 20px 32px',
            }}
          >
            <div style={shared.sheetHandle}>
              <div style={shared.sheetHandleBar} />
            </div>

            <p style={s.title}>7-Day History</p>

            {week.some(d => d.score != null) && (
              <GlassSurface borderRadius={16} backgroundOpacity={0.05} blur={0} style={s.chartPanel}>
                <WeekChart week={week} />
              </GlassSurface>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[...week].reverse().map(d => {
                const cfg = d.status ? STATUS_CONFIG[d.status] : null;
                return (
                  <GlassSurface
                    key={d.date}
                    borderRadius={14}
                    backgroundOpacity={0.05}
                    blur={0}
                    style={s.dayRow}
                  >
                    <div>
                      <p style={s.dayLabel}>{fmtDate(d.date)}</p>
                      {d.date === todayStr() && (
                        <span style={s.todayBadge}>Today</span>
                      )}
                    </div>
                    {d.score != null && cfg
                      ? <span style={s.score(cfg.hex)}>{d.score}</span>
                      : <span style={s.noLog}>No log</span>}
                  </GlassSurface>
                );
              })}
            </div>
          </GlassSurface>
        </div>
      </div>
    </>
  );
}
