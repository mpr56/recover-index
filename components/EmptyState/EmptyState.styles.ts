import type React from 'react';

export const emptyStateStyles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: 14,
    marginTop: 48,
    textAlign: 'center' as const,
  } satisfies React.CSSProperties,

  iconBox: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  } satisfies React.CSSProperties,

  icon: {
    fontSize: 48,
  } satisfies React.CSSProperties,

  iconLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.3)',
  } satisfies React.CSSProperties,

  title: {
    fontSize: 20,
    fontWeight: 800,
    color: '#fff',
    letterSpacing: '-0.02em',
  } satisfies React.CSSProperties,

  subtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.4)',
    maxWidth: 260,
  } satisfies React.CSSProperties,

  actions: {
    display: 'flex',
    gap: 10,
    marginTop: 4,
  } satisfies React.CSSProperties,

  btn: (accent: boolean): React.CSSProperties => ({
    padding: '12px 20px',
    borderRadius: 14,
    border: 'none',
    cursor: 'pointer',
    fontFamily: 'inherit',
    fontSize: 13,
    fontWeight: 700,
    background: accent ? 'rgba(99,102,241,0.8)' : 'rgba(255,255,255,0.08)',
    color: '#fff',
  }),
};
