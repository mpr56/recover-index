import { useState, useRef, useEffect } from 'react';
import { signOut } from 'next-auth/react';
import GlassSurface from '@/components/GlassSurface';
import { profileMenuStyles as s } from './ProfileMenu.styles';

interface Props {
  name?:  string | null;
  email?: string | null;
  image?: string | null;
}

export default function ProfileMenu({ name, email, image }: Props) {
  const [open,    setOpen]    = useState(false);
  const [signing, setSigning] = useState(false);
  const [imgError, setImgError] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

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

  const showPhoto = image && !imgError;

  return (
    <div ref={wrapperRef} style={s.wrapper}>
      <button onClick={() => setOpen(o => !o)} style={{ ...s.avatar, padding: 0, overflow: 'hidden' }}>
        {showPhoto ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt={name ?? ''}
            onError={() => setImgError(true)}
            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
          />
        ) : (
          name?.[0]?.toUpperCase() ?? '?'
        )}
      </button>

      {open && (
        <div style={s.dropdown}>
          <GlassSurface width="220px" borderRadius={16} backgroundOpacity={0.12} blur={20} style={s.dropdownInner}>
            <div style={{ ...s.userInfo, display: 'flex', alignItems: 'center', gap: 10 }}>
              {showPhoto && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={image}
                  alt={name ?? ''}
                  onError={() => setImgError(true)}
                  style={{ width: 32, height: 32, borderRadius: '50%', flexShrink: 0, objectFit: 'cover' }}
                />
              )}
              <div style={{ minWidth: 0 }}>
                <p style={s.userName}>{name}</p>
                <p style={s.userEmail}>{email}</p>
              </div>
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
