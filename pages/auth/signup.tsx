import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import GlassSurface from '@/components/GlassSurface';

const Silk = dynamic(() => import('@/components/Silk'), { ssr: false });

export default function Signup() {
  const router = useRouter();
  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  const handle = async () => {
    setError('');
    if (password.length < 8) { setError('Password must be at least 8 characters'); return; }
    setLoading(true);
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? 'Signup failed');
      setLoading(false);
      return;
    }
    await signIn('credentials', { email, password, redirect: false });
    setLoading(false);
    router.push('/');
  };

  return (
    <>
      <Head><title>Create Account — RecoveryIndex</title></Head>
      <div style={{ position: 'fixed', inset: 0 }}>
        <Silk speed={3.5} scale={1.0} color="#0f1a2e" noiseIntensity={3.8} rotation={-0.5} />
      </div>

      <div className="min-h-screen flex items-center justify-center px-4 relative z-10">
        <GlassSurface width="420px" borderRadius={28} backgroundOpacity={0.07} blur={18}
          style={{ padding: '40px 36px 36px' }}>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
            <div style={{ width: 30, height: 30, borderRadius: 10, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 14, color: '#fff' }}>R</div>
            <span style={{ fontWeight: 700, fontSize: 15, color: 'rgba(255,255,255,0.9)', letterSpacing: '-0.02em' }}>RecoveryIndex</span>
          </div>

          <h1 style={{ fontSize: 30, fontWeight: 800, color: '#fff', letterSpacing: '-0.03em', marginBottom: 6 }}>Create account</h1>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 28 }}>Start tracking your recovery today.</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <Field label="Name">
              <Input type="text" value={name} onChange={setName} placeholder="Your name" />
            </Field>
            <Field label="Email">
              <Input type="email" value={email} onChange={setEmail} placeholder="you@example.com" />
            </Field>
            <Field label="Password">
              <Input type="password" value={password} onChange={setPassword} placeholder="Min. 8 characters" onEnter={handle} />
            </Field>

            {error && <p style={{ color: '#f87171', fontSize: 13, textAlign: 'center' }}>{error}</p>}

            <PrimaryButton onClick={handle} disabled={loading || !name || !email || !password}>
              {loading ? <Spinner /> : 'Create Account'}
            </PrimaryButton>
          </div>

          <p style={{ textAlign: 'center', fontSize: 13, color: 'rgba(255,255,255,0.35)', marginTop: 24 }}>
            Already have an account?{' '}
            <Link href="/auth/login" style={{ color: '#818cf8', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
          </p>
        </GlassSurface>
      </div>
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
    <label style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</label>
    {children}
  </div>;
}

function Input({ type, value, onChange, placeholder, onEnter }: { type: string; value: string; onChange: (v: string) => void; placeholder: string; onEnter?: () => void }) {
  return <input type={type} value={value} placeholder={placeholder}
    onChange={e => onChange(e.target.value)}
    onKeyDown={e => e.key === 'Enter' && onEnter?.()}
    style={{ width: '100%', padding: '12px 14px', borderRadius: 12, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: 14, outline: 'none', fontFamily: 'inherit' }}
    onFocus={e => (e.target.style.borderColor = 'rgba(129,140,248,0.6)')}
    onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
  />;
}

function PrimaryButton({ children, onClick, disabled }: { children: React.ReactNode; onClick: () => void; disabled?: boolean }) {
  return <button onClick={onClick} disabled={disabled}
    style={{ width: '100%', padding: 13, borderRadius: 12, marginTop: 4, background: disabled ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.92)', color: disabled ? 'rgba(255,255,255,0.3)' : '#0f1a2e', border: 'none', fontSize: 14, fontWeight: 700, cursor: disabled ? 'not-allowed' : 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    {children}
  </button>;
}

function Spinner() {
  return <span style={{ width: 16, height: 16, border: '2px solid rgba(15,26,46,0.2)', borderTopColor: '#0f1a2e', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />;
}
