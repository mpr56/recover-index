import GlassSurface from '@/components/GlassSurface';
import { Section, SliderField, SheetActions, sharedStyles as shared } from '@/components/ui';
import type { SleepEntry, SleepQuality } from '@/lib/types';
import { getLast7Days, fmtDay, fmtDateShort, fmtDate, todayStr } from '@/lib/dateUtils';
import { useSleepForm } from './useSleepForm';
import { sleepSheetStyles as s } from './SleepSheet.styles';
import { useRef, useEffect } from 'react';

interface Props {
  open:           boolean;
  onClose:        () => void;
  onSave:         (entry: SleepEntry, date: string) => Promise<void>;
  existing:       SleepEntry | null;
  onHowItWorks?:  () => void;
}

const QUALITY_OPTIONS: { value: SleepQuality; emoji: string; label: string }[] = [
  { value: 'poor',  emoji: '😴', label: 'Poor'  },
  { value: 'okay',  emoji: '😐', label: 'Okay'  },
  { value: 'great', emoji: '😊', label: 'Great' },
];

const dateChip = (active: boolean): React.CSSProperties => ({
  flexShrink: 0, padding: '7px 12px', borderRadius: 20,
  border: 'none', cursor: 'pointer', fontFamily: 'inherit',
  fontSize: 11, fontWeight: 600, transition: 'all 0.15s',
  whiteSpace: 'nowrap',
  background: active ? 'rgba(99,102,241,0.8)' : 'rgba(255,255,255,0.07)',
  color:      active ? '#fff' : 'rgba(255,255,255,0.45)',
});

const dateRow: React.CSSProperties = {
  display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4,
  scrollbarWidth: 'none',
};

export default function SleepSheet({ open, onClose, onSave, existing, onHowItWorks }: Props) {
  const form    = useSleepForm({ existing, open });
  const days    = getLast7Days();
  const rowRef  = useRef<HTMLDivElement>(null);

  // Scroll the date row so "today" (last item) is visible on open
  useEffect(() => {
    if (open && rowRef.current) {
      rowRef.current.scrollLeft = rowRef.current.scrollWidth;
    }
  }, [open]);

  const save = async () => {
    form.setSaving(true);
    await onSave(form.buildPayload(), form.date);
    form.setSaving(false);
  };

  return (
    <>
      {open && <div onClick={onClose} style={shared.backdrop} />}

      <div style={shared.sheetOuter(open)}>
        <div style={{ width: '100%', maxWidth: 480 }}>
          <GlassSurface
            borderRadius={24} backgroundOpacity={0.1} blur={24}
            style={{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0, maxHeight: '88vh', overflowY: 'auto', padding: '12px 20px 32px' }}
          >
            <div style={shared.sheetHandle}><div style={shared.sheetHandleBar} /></div>

            <p style={s.title}>Log Sleep</p>
            <p style={s.subtitle}>
              {form.date === todayStr() ? 'Last night' : `Night of ${fmtDate(form.date)}`}
            </p>

            {/* ── Date picker ── */}
            <Section label="Which night?">
              <div ref={rowRef} style={dateRow}>
                {days.map(d => {
                  const isToday = d === todayStr();
                  return (
                    <button key={d} onClick={() => form.setDate(d)} style={dateChip(form.date === d)}>
                      {isToday ? 'Last night' : fmtDay(d)}{!isToday ? ` · ${fmtDateShort(d)}` : ''}
                    </button>
                  );
                })}
              </div>
            </Section>

            {/* ── Hours ── */}
            <Section label="Hours Slept">
              <SliderField
                label="Duration"
                value={form.hours}
                display={`${form.hours}h`}
                min={2} max={12} step={0.5}
                minLabel="2h" maxLabel="12h"
                onChange={v => form.setHours(v)}
              />
            </Section>

            {/* ── Quality ── */}
            <Section label="Sleep Quality">
              <div style={s.qualityRow}>
                {QUALITY_OPTIONS.map(q => (
                  <button key={q.value} onClick={() => form.setQuality(q.value)}
                    style={shared.pill(form.quality === q.value)}>
                    {q.emoji} {q.label}
                  </button>
                ))}
              </div>
            </Section>

            {/* ── Optional times — stack vertically on mobile ── */}
            <Section label="Times (optional)">
              <div style={s.optionalRow}>
                <div style={s.timeField}>
                  <span style={s.timeLabel}>Bedtime</span>
                  <input type="time" value={form.bedtime}
                    onChange={e => form.setBedtime(e.target.value)}
                    style={s.timeInput} />
                </div>
                <div style={s.timeField}>
                  <span style={s.timeLabel}>Wake time</span>
                  <input type="time" value={form.wakeTime}
                    onChange={e => form.setWakeTime(e.target.value)}
                    style={s.timeInput} />
                </div>
              </div>
              {form.bedtime && form.wakeTime && (
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 8 }}>
                  ↳ Computed {form.hours}h from bedtime → wake time
                </p>
              )}
            </Section>

            <SheetActions
              onCancel={onClose}
              onSave={save}
              saving={form.saving}
              saveLabel={existing ? 'Update Sleep' : 'Save Sleep'}
            />

            {/* ── How does this work ── */}
            <p style={{ textAlign: 'center', marginTop: 18 }}>
              <a
                href="#"
                onClick={e => { e.preventDefault(); onHowItWorks?.(); }}
                style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', textDecoration: 'underline', textUnderlineOffset: 3, fontFamily: 'inherit', cursor: 'pointer' }}
              >
                How does the sleep score work?
              </a>
            </p>
          </GlassSurface>
        </div>
      </div>
    </>
  );
}
