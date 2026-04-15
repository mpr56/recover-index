import type React from 'react';

export const sleepCardStyles = {
  card: {
    padding: '16px 18px',
  } satisfies React.CSSProperties,

  row: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  } satisfies React.CSSProperties,

  right: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'flex-end',
    gap: 4,
  } satisfies React.CSSProperties,

  emoji: {
    fontSize: 28,
  } satisfies React.CSSProperties,

  editBtn: {
    fontSize: 11,
    color: '#818cf8',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontFamily: 'inherit',
  } satisfies React.CSSProperties,

  scoreRow: {
    marginTop: 10,
    paddingTop: 10,
    borderTop: '1px solid rgba(255,255,255,0.06)',
  } satisfies React.CSSProperties,

  scoreText: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.3)',
  } satisfies React.CSSProperties,

  scoreValue: {
    color: '#fff',
    fontWeight: 700,
  } satisfies React.CSSProperties,
};
