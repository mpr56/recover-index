import type React from 'react';

/**
 * Shared style tokens used by multiple dashboard components.
 * Import from here rather than duplicating across files.
 */
export const shared = {
  // ── Layout ────────────────────────────────────────────────────────────────
  page: {
    position: 'relative' as const,
    zIndex: 1,
    minHeight: '100vh',
    color: '#fff',
  } satisfies React.CSSProperties,

  inner: {
    maxWidth: 440,
    margin: '0 auto',
    padding: '0 16px',
  } satisfies React.CSSProperties,

  silkLayer: {
    position: 'fixed' as const,
    inset: 0,
    zIndex: 0,
  } satisfies React.CSSProperties,

  // ── Loading spinner ───────────────────────────────────────────────────────
  spinner: {
    width: 36, height: 36,
    border: '2px solid rgba(99,102,241,0.2)',
    borderTopColor: '#6366f1',
    borderRadius: '50%',
    animation: 'spin 0.7s linear infinite',
  } satisfies React.CSSProperties,

  // ── Card label hierarchy ──────────────────────────────────────────────────
  /** Small all-caps section label used at the top of every card */
  cardLabel: {
    fontSize: 10,
    fontWeight: 700,
    color: 'rgba(255,255,255,0.28)',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.08em',
    marginBottom: 6,
  } satisfies React.CSSProperties,

  /** Large numeric value inside a stat card */
  statValue: {
    fontSize: 32,
    fontWeight: 900,
    color: '#fff',
    lineHeight: 1,
  } satisfies React.CSSProperties,

  /** Small muted subtitle beneath a stat value */
  statSub: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.3)',
    marginTop: 4,
  } satisfies React.CSSProperties,

  /** Generic card padding, reused on every stat/info card */
  cardPad: {
    padding: '16px 18px',
  } satisfies React.CSSProperties,

  // ── Accent link / button ──────────────────────────────────────────────────
  accentLink: {
    fontSize: 11,
    color: '#818cf8',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontFamily: 'inherit',
    fontWeight: 600,
  } satisfies React.CSSProperties,
};

/** Global CSS injected once at the app root */
export const GLOBAL_CSS = `
  @keyframes spin { to { transform: rotate(360deg); } }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    -webkit-font-smoothing: antialiased;
  }
  input[type=range] {
    appearance: none; height: 4px; border-radius: 2px;
    background: rgba(255,255,255,0.12); outline: none;
  }
  input[type=range]::-webkit-slider-thumb {
    appearance: none; width: 18px; height: 18px; border-radius: 50%;
    background: #6366f1; cursor: pointer; box-shadow: 0 0 6px rgba(99,102,241,0.5);
  }
  input::placeholder, textarea::placeholder { color: rgba(255,255,255,0.2); }
`;
