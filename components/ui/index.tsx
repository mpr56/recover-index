import React from 'react';

export const sharedStyles = {
  label: {
    fontSize: 10, fontWeight: 700,
    color: 'rgba(255,255,255,0.3)',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.1em',
    marginBottom: 10,
  } satisfies React.CSSProperties,

  input: {
    width: '100%', padding: '11px 13px', borderRadius: 10,
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: '#fff', fontSize: 13, outline: 'none',
    fontFamily: 'inherit', transition: 'border-color 0.15s',
  } satisfies React.CSSProperties,

  pill: (active: boolean): React.CSSProperties => ({
    flex: 1, padding: '10px 4px', borderRadius: 10, border: 'none',
    cursor: 'pointer', fontFamily: 'inherit', fontSize: 12, fontWeight: 600,
    transition: 'all 0.15s',
    background: active ? 'rgba(99,102,241,0.75)' : 'rgba(255,255,255,0.06)',
    color:      active ? '#fff' : 'rgba(255,255,255,0.4)',
  }),

  sheetHandle: {
    display: 'flex', justifyContent: 'center', paddingBottom: 8,
  } satisfies React.CSSProperties,

  sheetHandleBar: {
    width: 36, height: 4, borderRadius: 2,
    background: 'rgba(255,255,255,0.2)',
  } satisfies React.CSSProperties,

  backdrop: {
    position: 'fixed' as const, inset: 0,
    background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', zIndex: 40,
  } satisfies React.CSSProperties,

  sheetOuter: (open: boolean): React.CSSProperties => ({
    position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50,
    display: 'flex', justifyContent: 'center', padding: '0 12px',
    transition: 'transform 0.3s ease',
    transform: open ? 'translateY(0)' : 'translateY(110%)',
  }),
};

export function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <p style={sharedStyles.label}>{label}</p>
      {children}
    </div>
  );
}

export function Chip({ children, onRemove }: { children: React.ReactNode; onRemove?: () => void }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '5px 10px', borderRadius: 20,
      background: 'rgba(255,255,255,0.07)',
      border: '1px solid rgba(255,255,255,0.1)',
      fontSize: 11, color: 'rgba(255,255,255,0.6)',
    }}>
      {children}
      {onRemove && (
        <button onClick={onRemove} style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: 'rgba(255,255,255,0.3)', fontSize: 13, lineHeight: 1,
          padding: 0, display: 'flex', alignItems: 'center',
        }}>×</button>
      )}
    </div>
  );
}

// ─── Slider field ─────────────────────────────────────────────────────────────
export function SliderField({
  label, value, display, min, max, step, minLabel, maxLabel, onChange,
}: {
  label: string; value: number; display: string;
  min: number; max: number; step: number;
  minLabel: string; maxLabel: string;
  onChange: (v: number) => void;
}) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
        <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)' }}>{label}</span>
        <span style={{ fontSize: 22, fontWeight: 800, color: '#fff' }}>{display}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(+e.target.value)}
        style={{ width: '100%', accentColor: '#6366f1', cursor: 'pointer' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'rgba(255,255,255,0.2)', marginTop: 4 }}>
        <span>{minLabel}</span><span>{maxLabel}</span>
      </div>
    </div>
  );
}

// ─── Sheet action buttons ─────────────────────────────────────────────────────
export function SheetActions({ onCancel, onSave, saving, saveLabel = 'Save' }: {
  onCancel: () => void; onSave: () => void; saving: boolean; saveLabel?: string;
}) {
  return (
    <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
      <button onClick={onCancel} style={{
        flex: 1, padding: 13, borderRadius: 12, cursor: 'pointer', fontFamily: 'inherit',
        background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
        color: 'rgba(255,255,255,0.5)', fontSize: 13, fontWeight: 600,
      }}>Cancel</button>
      <button onClick={onSave} disabled={saving} style={{
        flex: 2, padding: 13, borderRadius: 12, border: 'none', cursor: saving ? 'not-allowed' : 'pointer',
        fontFamily: 'inherit', fontSize: 13, fontWeight: 700, color: '#fff',
        background: saving ? 'rgba(99,102,241,0.4)' : 'rgba(99,102,241,0.85)',
      }}>{saving ? 'Saving…' : saveLabel}</button>
    </div>
  );
}
