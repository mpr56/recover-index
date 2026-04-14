import type React from 'react';

export const sleepSheetStyles = {
  title: {
    fontSize: 18,
    fontWeight: 800,
    color: '#fff',
    letterSpacing: '-0.02em',
    marginBottom: 4,
  } satisfies React.CSSProperties,

  subtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.35)',
    marginBottom: 20,
  } satisfies React.CSSProperties,

  optionalRow: {
    display: 'flex',
    gap: 12,
    marginTop: 12,
  } satisfies React.CSSProperties,

  timeField: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 6,
  } satisfies React.CSSProperties,

  timeLabel: {
    fontSize: 11,
    fontWeight: 600,
    color: 'rgba(255,255,255,0.35)',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.06em',
  } satisfies React.CSSProperties,

  timeInput: {
    width: '100%',
    padding: '10px 12px',
    borderRadius: 10,
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: '#fff',
    fontSize: 13,
    outline: 'none',
    fontFamily: 'inherit',
    colorScheme: 'dark' as const,
  } satisfies React.CSSProperties,

  qualityRow: {
    display: 'flex',
    gap: 8,
  } satisfies React.CSSProperties,
};
