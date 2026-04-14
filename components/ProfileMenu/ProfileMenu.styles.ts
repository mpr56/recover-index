import type React from 'react';

export const profileMenuStyles = {
  wrapper: { position: 'relative' } satisfies React.CSSProperties,

  avatar: {
    width: 36, height: 36, borderRadius: '50%', border: 'none',
    cursor: 'pointer', color: '#fff', fontWeight: 900, fontSize: 14,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
  } satisfies React.CSSProperties,

  dropdown: { position: 'absolute', right: 0, top: 44, zIndex: 100 } satisfies React.CSSProperties,

  dropdownInner: { padding: 0, overflow: 'hidden' } satisfies React.CSSProperties,

  userInfo: {
    padding: '12px 16px',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
  } satisfies React.CSSProperties,

  userName: { fontSize: 13, fontWeight: 600, color: '#fff' } satisfies React.CSSProperties,

  userEmail: {
    fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 1,
    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
  } satisfies React.CSSProperties,

  signOutBtn: {
    width: '100%', padding: '12px 16px', background: 'none',
    border: 'none', color: '#f87171', fontSize: 13,
    cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit',
  } satisfies React.CSSProperties,
};
