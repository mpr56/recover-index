import GlassSurface from '@/components/GlassSurface';
import { Section, SliderField, SheetActions, sharedStyles as shared } from '@/components/ui';
import {
  CATEGORY_OPTIONS, INTENSITIES,
  getSubTypeOptions,
  type Activity,
} from '@/lib/types';
import { getLast7Days, fmtDay, fmtDateShort, todayStr } from '@/lib/dateUtils';
import { useActivityForm } from './useActivityForm';
import { activitySheetStyles as s } from './ActivitySheet.styles';
import { useRef, useEffect } from 'react';

interface Props {
  open:        boolean;
  onClose:     () => void;
  onSave:      (activity: Omit<Activity, 'id'>, date: string) => Promise<void>;
  editActivity?: Activity | null;
  editDate?:    string | null;
}

export default function ActivitySheet({ open, onClose, onSave, editActivity, editDate }: Props) {
  const form    = useActivityForm(editActivity ?? null);
  const days    = getLast7Days();
  const rowRef  = useRef<HTMLDivElement>(null);

  // Scroll date row to today (last item) when opened
  useEffect(() => {
    if (open && rowRef.current) {
      rowRef.current.scrollLeft = rowRef.current.scrollWidth;
    }
  }, [open]);

  // Populate form when editing an existing activity
  useEffect(() => {
    if (open && editActivity) {
      form.handleCategoryChange(editActivity.category);
      form.setSubType(editActivity.subType);
      form.setIntensity(editActivity.intensity);
      form.setDurationMins(editActivity.durationMins);
      form.setTimeOfDay(editActivity.timeOfDay);
      if (editDate) form.setDate(editDate);
    } else if (!open) {
      form.reset();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, editActivity]);

  const isEdit = !!editActivity;

  const save = async () => {
    form.setSaving(true);
    await onSave(form.buildPayload(), form.date);
    form.reset();
    form.setSaving(false);
  };

  const subTypeOptions = getSubTypeOptions(form.category);

  const hour = parseInt(form.timeOfDay.split(':')[0]);
  const timeHint =
    hour < 10 ? '🌅 Morning — good recovery window ahead' :
    hour < 14 ? '☀️  Midday — moderate recovery time'      :
    hour < 19 ? '🌆 Afternoon — less recovery before sleep' :
                '🌙 Evening — highest fatigue impact';

  return (
    <>
      {open && <div onClick={onClose} style={shared.backdrop} />}

      <div style={shared.sheetOuter(open)}>
        <div style={{ width: '100%', maxWidth: 480 }}>
          <GlassSurface
            borderRadius={24} backgroundOpacity={0.1} blur={24}
            style={{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0, maxHeight: '90vh', overflowY: 'auto', padding: '12px 20px 32px' }}
          >
            <div style={shared.sheetHandle}><div style={shared.sheetHandleBar} /></div>

            <p style={s.title}>{isEdit ? 'Edit Activity' : 'Log Activity'}</p>
            <p style={s.subtitle}>{isEdit ? 'Update the details below' : 'Select a day, then fill in the details'}</p>

            {/* ── Date picker ── */}
            <Section label="Day">
              <div ref={rowRef} style={s.dateRow}>
                {days.map(d => {
                  const isToday = d === todayStr();
                  const label   = isToday ? 'Today' : fmtDay(d);
                  const sub     = isToday ? '' : fmtDateShort(d);
                  return (
                    <button key={d} onClick={() => form.setDate(d)} style={s.dateChip(form.date === d)}>
                      {label}{sub ? ` · ${sub}` : ''}
                    </button>
                  );
                })}
              </div>
            </Section>

            {/* ── Category tabs ── */}
            <Section label="Category">
              <div style={s.categoryRow}>
                {CATEGORY_OPTIONS.map(cat => (
                  <button
                    key={cat.value}
                    onClick={() => form.handleCategoryChange(cat.value)}
                    style={s.categoryBtn(form.category === cat.value)}
                  >
                    <span style={s.categoryIcon}>{cat.icon}</span>
                    <span>{cat.label}</span>
                  </button>
                ))}
              </div>
            </Section>

            {/* ── Sub-type grid ── */}
            <Section label={
              form.category === 'sports' ? 'Sport' :
              form.category === 'gym'    ? 'Session Type' : 'Activity'
            }>
              <div style={s.subTypeGrid}>
                {subTypeOptions.map(opt => {
                  const active = form.subType === opt.value;
                  return (
                    <button key={opt.value} onClick={() => form.setSubType(opt.value)} style={s.subTypeBtn(active)}>
                      <div style={s.subTypeIcon}>{opt.icon}</div>
                      <div style={s.subTypeTextWrap}>
                        <span style={s.subTypeName(active)}>{opt.label}</span>
                        <span style={s.subTypeDesc}>{opt.description}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </Section>

            {/* ── Intensity ── */}
            <Section label="Intensity">
              <div style={s.intensityRow}>
                {INTENSITIES.map(it => (
                  <button key={it.value} onClick={() => form.setIntensity(it.value)} style={s.intensityBtn(form.intensity === it.value)}>
                    <span>{it.label}</span>
                    <span style={s.intensitySub}>{it.sub}</span>
                  </button>
                ))}
              </div>
            </Section>

            {/* ── Duration ── */}
            <Section label="Duration">
              <SliderField
                label="Time"
                value={form.durationMins}
                display={`${form.durationMins}min`}
                min={10} max={180} step={5}
                minLabel="10min" maxLabel="3h"
                onChange={form.setDurationMins}
              />
            </Section>

            {/* ── Time of day ── */}
            <Section label="Time of Day">
              <div style={s.timeRow}>
                <div style={s.timeField}>
                  <span style={s.timeLabel}>When did you train?</span>
                  <input type="time" value={form.timeOfDay}
                    onChange={e => form.setTimeOfDay(e.target.value)}
                    style={s.timeInput} />
                </div>
              </div>
              <p style={s.timeHint}>{timeHint}</p>
            </Section>

            {/* ── Load preview ── */}
            <div style={s.loadPreview}>
              <div style={s.loadLabelCol}>
                <p style={s.loadLabel}>Estimated fatigue impact</p>
                <p style={s.loadBreakdown}>
                  Base {form.preview.baseLoad} × {form.preview.timeMult}× time = {form.preview.weightedLoad}
                </p>
              </div>
              <p style={s.loadValue}>{form.preview.weightedLoad} pts</p>
            </div>

            <SheetActions
              onCancel={onClose}
              onSave={save}
              saving={form.saving}
              saveLabel={isEdit ? 'Update Activity' : 'Add Activity'}
            />
          </GlassSurface>
        </div>
      </div>
    </>
  );
}
