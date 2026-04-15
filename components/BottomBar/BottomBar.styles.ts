import type React from 'react';

export const bottomBarStyles = {
  bar: {
    position: 'fixed' as const,
    bottom: 0, left: 0, right: 0,
    zIndex: 30,
    display: 'flex',
    transform: 'translateZ(0)',
    willChange: 'transform',
    WebkitBackfaceVisibility: 'hidden' as const,
  } satisfies React.CSSProperties,

  btn: (accent: boolean, withRightBorder = false): React.CSSProperties => ({
    flex: 1,
    padding: '17px 0',
    background: 'rgba(10,12,20,0.82)',
    backdropFilter: 'blur(16px)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderBottom: 'none',
    borderRight: withRightBorder ? '1px solid rgba(255,255,255,0.08)' : undefined,
    color: accent ? '#fff' : 'rgba(255,255,255,0.5)',
    fontSize: 13,
    fontWeight: accent ? 700 : 600,
    cursor: 'pointer',
    fontFamily: 'inherit',
    letterSpacing: accent ? '-0.01em' : 'normal',
  }),
};
