import type React from 'react';

export const activitiesSectionStyles = {
  card: {
    padding: '16px 18px',
  } satisfies React.CSSProperties,

  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  } satisfies React.CSSProperties,

  addBtn: {
    fontSize: 11,
    color: '#818cf8',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontFamily: 'inherit',
    fontWeight: 600,
  } satisfies React.CSSProperties,

  list: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 6,
  } satisfies React.CSSProperties,

  item: {
    padding: '12px 16px',
    borderRadius: 12,
    background: 'rgba(255,255,255,0.03)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  } satisfies React.CSSProperties,

  itemLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  } satisfies React.CSSProperties,

  itemIcon: {
    fontSize: 20,
    width: 36, height: 36,
    borderRadius: 10,
    background: 'rgba(255,255,255,0.06)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  } satisfies React.CSSProperties,

  itemName: {
    fontSize: 13,
    fontWeight: 600,
    color: '#fff',
  } satisfies React.CSSProperties,

  itemMeta: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.35)',
    marginTop: 1,
  } satisfies React.CSSProperties,

  itemRight: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    flexShrink: 0,
  } satisfies React.CSSProperties,

  loadBadge: {
    fontSize: 13,
    fontWeight: 700,
    color: '#818cf8',
  } satisfies React.CSSProperties,

  editBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#818cf8',
    fontSize: 11,
    fontWeight: 600,
    fontFamily: 'inherit',
    padding: '2px 6px',
    lineHeight: 1,
  } satisfies React.CSSProperties,

  removeBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: 'rgba(255,255,255,0.2)',
    fontSize: 16,
    fontFamily: 'inherit',
    padding: '0 4px',
    lineHeight: 1,
  } satisfies React.CSSProperties,

  empty: {
    padding: '20px',
    textAlign: 'center' as const,
    fontSize: 12,
    color: 'rgba(255,255,255,0.25)',
  } satisfies React.CSSProperties,

  totalRow: {
    marginTop: 10,
    paddingTop: 10,
    borderTop: '1px solid rgba(255,255,255,0.06)',
    display: 'flex',
    justifyContent: 'space-between',
  } satisfies React.CSSProperties,

  totalLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.3)',
  } satisfies React.CSSProperties,

  totalValue: {
    fontSize: 11,
    fontWeight: 700,
    color: '#818cf8',
  } satisfies React.CSSProperties,
};
