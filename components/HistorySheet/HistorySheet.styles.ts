import type React from 'react';

export const historySheetStyles = {
  title: {
    fontSize: 18,
    fontWeight: 800,
    color: '#fff',
    letterSpacing: '-0.02em',
    marginBottom: 20,
  } satisfies React.CSSProperties,

  chartPanel: {
    padding: '16px 12px',
    marginBottom: 16,
  } satisfies React.CSSProperties,

  dayRow: {
    padding: '12px 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  } satisfies React.CSSProperties,

  dayLabel: {
    fontSize: 13,
    fontWeight: 600,
    color: '#fff',
  } satisfies React.CSSProperties,

  todayBadge: {
    fontSize: 11,
    color: '#818cf8',
  } satisfies React.CSSProperties,

  score: (hex: string): React.CSSProperties => ({
    fontSize: 24,
    fontWeight: 900,
    color: hex,
    fontVariantNumeric: 'tabular-nums',
  }),

  noLog: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.2)',
  } satisfies React.CSSProperties,
};
