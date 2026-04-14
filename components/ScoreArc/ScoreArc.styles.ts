import type React from 'react';

export const scoreArcStyles = {
  container: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  } satisfies React.CSSProperties,

  svg: {
    width: 180,
    height: 180,
    transform: 'rotate(-90deg)',
  } satisfies React.CSSProperties,

  labelContainer: {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  } satisfies React.CSSProperties,

  scoreNumber: (hex: string): React.CSSProperties => ({
    fontSize: 52,
    fontWeight: 900,
    lineHeight: 1,
    fontVariantNumeric: 'tabular-nums',
    color: hex,
  }),

  statusLabel: (hex: string): React.CSSProperties => ({
    fontSize: 14,
    fontWeight: 600,
    color: hex,
    marginTop: 2,
  }),
};
