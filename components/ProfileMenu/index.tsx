import { useState, useRef, useEffect } from 'react';
import { signOut } from 'next-auth/react';
import GlassSurface from '@/components/GlassSurface';
import { profileMenuStyles as s } from './ProfileMenu.styles';

interface Props { name?: string | null; email?: string | null; }

export default function ProfileMenu({ name, email }: Props) {
  const [open,    setOpen]    = useState(false);
  const [signing, setSigning] = useState(false);
  const wrapperRef            = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const handleSignOut = async () => {
    setSigning(true);
    setOpen(false);
    await signOut({ callbackUrl: '/auth/login', redirect: true });
  };

  return (
    <div ref={wrapperRef} style={s.wrapper}>
      <button onClick={() => setOpen(o => !o)} style={s.avatar}>
        {name?.[0]?.toUpperCase() ?? '?'}
      </button>

      {open && (
        <div style={s.dropdown}>
          <GlassSurface width="200px" borderRadius={16} backgroundOpacity={0.12} blur={20} style={s.dropdownInner}>
            <div style={s.userInfo}>
              <p style={s.userName}>{name}</p>
              <p style={s.userEmail}>{email}</p>
            </div>
            <button
              onClick={handleSignOut}
              disabled={signing}
              style={{ ...s.signOutBtn, opacity: signing ? 0.5 : 1, cursor: signing ? 'not-allowed' : 'pointer' }}
            >
              {signing ? 'Signing out…' : 'Sign out'}
            </button>
          </GlassSurface>
        </div>
      )}
    </div>
  );
}
