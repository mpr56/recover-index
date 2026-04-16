import type React from 'react';

export const timezoneOnboardingStyles = {
  overlay: {
    position: 'fixed' as const,
    inset: 0,
    background: 'rgba(0,0,0,0.75)',
    backdropFilter: 'blur(6px)',
    zIndex: 100,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0 20px',
  } satisfies React.CSSProperties,

  card: {
    width: '100%',
    maxWidth: 420,
    padding: '36px 32px 32px',
  } satisfies React.CSSProperties,

  logoRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    marginBottom: 28,
  } satisfies React.CSSProperties,

  logoMark: {
    width: 32, height: 32,
    borderRadius: 10,
    background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 900,
    fontSize: 15,
    color: '#fff',
    flexShrink: 0,
  } satisfies React.CSSProperties,

  logoLabel: {
    fontWeight: 700,
    fontSize: 15,
    color: 'rgba(255,255,255,0.9)',
    letterSpacing: '-0.02em',
  } satisfies React.CSSProperties,

  title: {
    fontSize: 22,
    fontWeight: 800,
    color: '#fff',
    letterSpacing: '-0.02em',
    marginBottom: 8,
  } satisfies React.CSSProperties,

  subtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.45)',
    lineHeight: 1.6,
    marginBottom: 28,
  } satisfies React.CSSProperties,

  detectedBox: {
    padding: '14px 16px',
    borderRadius: 14,
    background: 'rgba(99,102,241,0.1)',
    border: '1px solid rgba(99,102,241,0.25)',
    marginBottom: 16,
  } satisfies React.CSSProperties,

  detectedLabel: {
    fontSize: 10,
    fontWeight: 700,
    color: 'rgba(255,255,255,0.3)',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.1em',
    marginBottom: 4,
  } satisfies React.CSSProperties,

  detectedValue: {
    fontSize: 14,
    fontWeight: 600,
    color: '#fff',
  } satisfies React.CSSProperties,

  detectedIana: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.35)',
    marginTop: 2,
  } satisfies React.CSSProperties,

  changeRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    marginBottom: 24,
  } satisfies React.CSSProperties,

  changeLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.35)',
    flexShrink: 0,
  } satisfies React.CSSProperties,

  select: {
    flex: 1,
    padding: '9px 12px',
    borderRadius: 10,
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.12)',
    color: '#fff',
    fontSize: 12,
    outline: 'none',
    fontFamily: 'inherit',
    cursor: 'pointer',
    colorScheme: 'dark' as const,
  } satisfies React.CSSProperties,

  confirmBtn: {
    width: '100%',
    padding: '13px',
    borderRadius: 12,
    background: 'rgba(255,255,255,0.92)',
    color: '#0f1a2e',
    border: 'none',
    fontSize: 14,
    fontWeight: 700,
    cursor: 'pointer',
    fontFamily: 'inherit',
    letterSpacing: '-0.01em',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  } satisfies React.CSSProperties,

  confirmBtnDisabled: {
    background: 'rgba(255,255,255,0.1)',
    color: 'rgba(255,255,255,0.3)',
    cursor: 'not-allowed',
  } satisfies React.CSSProperties,

  errorText: {
    fontSize: 12,
    color: '#f87171',
    marginTop: 10,
    textAlign: 'center' as const,
  } satisfies React.CSSProperties,
};
