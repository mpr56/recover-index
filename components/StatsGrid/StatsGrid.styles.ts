import type React from 'react';

export const statsGridStyles = {
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 12,
  } satisfies React.CSSProperties,

  adviceCard: {
    padding: '16px 18px',
  } satisfies React.CSSProperties,

  adviceText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.65)',
    lineHeight: 1.5,
  } satisfies React.CSSProperties,

  tomorrowValue: (hex: string): React.CSSProperties => ({
    fontSize: 32,
    fontWeight: 900,
    lineHeight: 1,
    color: hex,
  }),

  statCardCol: {
    padding: '16px 18px',
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'space-between',
  } satisfies React.CSSProperties,
};
