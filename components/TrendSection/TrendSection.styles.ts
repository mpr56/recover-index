import type React from 'react';

export const trendSectionStyles = {
  card: {
    padding: '16px 18px',
  } satisfies React.CSSProperties,

  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  } satisfies React.CSSProperties,

  viewAllBtn: {
    fontSize: 11,
    color: '#818cf8',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontFamily: 'inherit',
  } satisfies React.CSSProperties,
};
