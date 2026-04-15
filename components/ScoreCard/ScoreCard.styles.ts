import type React from 'react';

export const scoreCardStyles = {
  card: {
    padding: '28px 24px 20px',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
  } satisfies React.CSSProperties,

  dateLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.3)',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.08em',
    marginBottom: 12,
  } satisfies React.CSSProperties,

  recommendation: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center' as const,
    maxWidth: 260,
    marginTop: 10,
    marginBottom: 8,
  } satisfies React.CSSProperties,

  chipRow: {
    display: 'flex',
    gap: 8,
    marginTop: 10,
    flexWrap: 'wrap' as const,
    justifyContent: 'center',
  } satisfies React.CSSProperties,
};
