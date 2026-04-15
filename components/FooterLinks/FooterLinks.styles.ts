import type React from 'react';

export const footerLinksStyles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: 6,
    paddingBottom: 8,
  } satisfies React.CSSProperties,

  editBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: 12,
    color: 'rgba(255,255,255,0.55)',
    textDecoration: 'underline',
    textUnderlineOffset: 3,
    fontFamily: 'inherit',
    textAlign: 'center' as const,
    padding: '4px 0',
  } satisfies React.CSSProperties,

  howLink: {
    fontSize: 11.5,
    color: 'rgba(255,255,255,0.55)',
    textDecoration: 'underline',
    textUnderlineOffset: 3,
    fontFamily: 'inherit',
    cursor: 'pointer',
    background: 'none',
    border: 'none',
  } satisfies React.CSSProperties,
};
