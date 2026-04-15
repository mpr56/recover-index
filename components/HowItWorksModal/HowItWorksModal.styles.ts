import type React from 'react';

export const howItWorksStyles = {
  backdrop: {
    position: 'fixed' as const,
    inset: 0,
    background: 'rgba(0,0,0,0.6)',
    backdropFilter: 'blur(4px)',
    zIndex: 60,
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center',
    padding: '0 12px',
  } satisfies React.CSSProperties,

  sheetWrap: {
    width: '100%',
    maxWidth: 480,
  } satisfies React.CSSProperties,

  sheet: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    padding: '24px 24px 48px',
    maxHeight: '75vh',
    overflowY: 'auto' as const,
  } satisfies React.CSSProperties,

  logoRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  } satisfies React.CSSProperties,

  logoMark: {
    width: 28, height: 28, borderRadius: 9,
    background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 13,
    fontWeight: 900,
    color: '#fff',
  } satisfies React.CSSProperties,

  logoLabel: {
    fontSize: 11,
    fontWeight: 700,
    color: 'rgba(255,255,255,0.3)',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.1em',
  } satisfies React.CSSProperties,

  title: {
    fontSize: 20,
    fontWeight: 800,
    color: '#fff',
    letterSpacing: '-0.02em',
    marginBottom: 6,
    marginTop: 12,
  } satisfies React.CSSProperties,

  subtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.4)',
    marginBottom: 24,
    lineHeight: 1.5,
  } satisfies React.CSSProperties,

  item: {
    marginBottom: 18,
    padding: '14px 16px',
    borderRadius: 14,
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.07)',
  } satisfies React.CSSProperties,

  itemTitle: {
    fontSize: 13,
    fontWeight: 700,
    color: '#fff',
    marginBottom: 6,
  } satisfies React.CSSProperties,

  itemDesc: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.45)',
    lineHeight: 1.6,
  } satisfies React.CSSProperties,

  projectionItem: {
    marginBottom: 20,
    padding: '14px 16px',
    borderRadius: 14,
    background: 'rgba(99,102,241,0.08)',
    border: '1px solid rgba(99,102,241,0.2)',
  } satisfies React.CSSProperties,

  projectionTitle: {
    fontSize: 13,
    fontWeight: 700,
    color: '#818cf8',
    marginBottom: 6,
  } satisfies React.CSSProperties,

  projectionDesc: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.45)',
    lineHeight: 1.6,
  } satisfies React.CSSProperties,

  closeBtn: {
    width: '100%',
    padding: 13,
    borderRadius: 12,
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: 'rgba(255,255,255,0.7)',
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: 'inherit',
  } satisfies React.CSSProperties,
};
