import type React from 'react';

export const activitySheetStyles = {
  title: {
    fontSize: 18, fontWeight: 800, color: '#fff',
    letterSpacing: '-0.02em', marginBottom: 4,
  } satisfies React.CSSProperties,

  subtitle: {
    fontSize: 12, color: 'rgba(255,255,255,0.35)', marginBottom: 16,
  } satisfies React.CSSProperties,

  // Date picker row
  dateRow: {
    display: 'flex', gap: 6, marginBottom: 20, overflowX: 'auto' as const,
    paddingBottom: 4,
    scrollbarWidth: 'none' as const,
  } satisfies React.CSSProperties,

  dateChip: (active: boolean): React.CSSProperties => ({
    flexShrink: 0,
    padding: '7px 12px', borderRadius: 20, border: 'none', cursor: 'pointer',
    fontFamily: 'inherit', fontSize: 11, fontWeight: 600,
    transition: 'all 0.15s',
    background: active ? 'rgba(99,102,241,0.8)' : 'rgba(255,255,255,0.07)',
    color:      active ? '#fff' : 'rgba(255,255,255,0.45)',
    whiteSpace: 'nowrap' as const,
  }),

  // Category tabs
  categoryRow: {
    display: 'flex', gap: 8, marginBottom: 16,
  } satisfies React.CSSProperties,

  categoryBtn: (active: boolean): React.CSSProperties => ({
    flex: 1, padding: '12px 4px', borderRadius: 12, border: 'none',
    cursor: 'pointer', fontFamily: 'inherit', fontSize: 12, fontWeight: 700,
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
    transition: 'all 0.15s',
    background: active ? 'rgba(99,102,241,0.75)' : 'rgba(255,255,255,0.06)',
    color:      active ? '#fff' : 'rgba(255,255,255,0.4)',
  }),

  categoryIcon: { fontSize: 20 } satisfies React.CSSProperties,

  // Sub-type grid — revealed after category selected
  subTypeGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8, marginBottom: 4,
  } satisfies React.CSSProperties,

  subTypeBtn: (active: boolean): React.CSSProperties => ({
    padding: '12px 10px', borderRadius: 12, cursor: 'pointer',
    fontFamily: 'inherit', transition: 'all 0.15s',
    display: 'flex', alignItems: 'center', gap: 10,
    background: active ? 'rgba(99,102,241,0.75)' : 'rgba(255,255,255,0.05)',
    border: active ? '1px solid rgba(99,102,241,0.4)' : '1px solid rgba(255,255,255,0.06)',
  }),

  subTypeIcon: {
    fontSize: 20, flexShrink: 0,
    width: 36, height: 36, borderRadius: 8,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'rgba(255,255,255,0.05)',
  } satisfies React.CSSProperties,

  subTypeTextWrap: {
    display: 'flex', flexDirection: 'column' as const, alignItems: 'flex-start',
    minWidth: 0,
  } satisfies React.CSSProperties,

  subTypeName: (active: boolean): React.CSSProperties => ({
    fontSize: 12, fontWeight: 700,
    color: active ? '#fff' : 'rgba(255,255,255,0.7)',
    whiteSpace: 'nowrap',
  }),

  subTypeDesc: {
    fontSize: 10, color: 'rgba(255,255,255,0.3)',
    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
    maxWidth: 100,
  } satisfies React.CSSProperties,

  // Intensity
  intensityRow: {
    display: 'flex', gap: 8, marginBottom: 4,
  } satisfies React.CSSProperties,

  intensityBtn: (active: boolean): React.CSSProperties => ({
    flex: 1, padding: '10px 4px', borderRadius: 10, border: 'none',
    cursor: 'pointer', fontFamily: 'inherit', fontSize: 12, fontWeight: 600,
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
    transition: 'all 0.15s',
    background: active ? 'rgba(99,102,241,0.75)' : 'rgba(255,255,255,0.06)',
    color:      active ? '#fff' : 'rgba(255,255,255,0.4)',
  }),

  intensitySub: {
    fontSize: 10, opacity: 0.6,
  } satisfies React.CSSProperties,

  // Time fields
  timeRow: {
    display: 'flex', gap: 12,
  } satisfies React.CSSProperties,

  timeField: {
    flex: 1, display: 'flex', flexDirection: 'column' as const, gap: 6,
  } satisfies React.CSSProperties,

  timeLabel: {
    fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.35)',
    textTransform: 'uppercase' as const, letterSpacing: '0.06em',
  } satisfies React.CSSProperties,

  timeInput: {
    width: '100%', padding: '10px 12px', borderRadius: 10,
    background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
    color: '#fff', fontSize: 13, outline: 'none', fontFamily: 'inherit',
    colorScheme: 'dark' as const,
  } satisfies React.CSSProperties,

  timeHint: {
    fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 6,
  } satisfies React.CSSProperties,

  // Load preview
  loadPreview: {
    marginTop: 16, padding: '12px 14px', borderRadius: 12,
    background: 'rgba(99,102,241,0.08)',
    border: '1px solid rgba(99,102,241,0.2)',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
  } satisfies React.CSSProperties,

  loadLabelCol: {
    display: 'flex', flexDirection: 'column' as const, gap: 2,
  } satisfies React.CSSProperties,

  loadLabel: {
    fontSize: 11, color: 'rgba(255,255,255,0.4)',
  } satisfies React.CSSProperties,

  loadBreakdown: {
    fontSize: 10, color: 'rgba(255,255,255,0.25)',
  } satisfies React.CSSProperties,

  loadValue: {
    fontSize: 20, fontWeight: 900, color: '#818cf8',
  } satisfies React.CSSProperties,
};
