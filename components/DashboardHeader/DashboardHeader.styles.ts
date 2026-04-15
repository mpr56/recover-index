import type React from 'react';

export const dashboardHeaderStyles = {
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '20px 0 16px',
  } satisfies React.CSSProperties,

  greeting: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.3)',
    marginBottom: 1,
  } satisfies React.CSSProperties,

  name: {
    fontSize: 14,
    fontWeight: 700,
    color: '#fff',
  } satisfies React.CSSProperties,
};
