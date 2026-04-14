import { useState } from 'react';
import { signOut } from 'next-auth/react';
import GlassSurface from '@/components/GlassSurface';
import { profileMenuStyles as s } from './ProfileMenu.styles';

interface Props { name?: string | null; email?: string | null; }

export default function ProfileMenu({ name, email }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div style={s.wrapper}>
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
            <button onClick={() => signOut({ callbackUrl: '/auth/login' })} style={s.signOutBtn}>
              Sign out
            </button>
          </GlassSurface>
        </div>
      )}
    </div>
  );
}
