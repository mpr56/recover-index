import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import GlassSurface from '@/components/GlassSurface';

const Silk = dynamic(() => import('@/components/Silk'), { ssr: false });

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handle = async () => {
    setError('');
    setLoading(true);
    const res = await signIn('credentials', { email, password, redirect: false });
    setLoading(false);
    if (res?.error) setError('Invalid email or password');
    else router.push('/');
  };

  return (
    <>
      <Head><title>Sign In — RecoveryIndex</title></Head>
      <div style={{ position: 'fixed', inset: 0 }}>
        <Silk speed={3.5} scale={1.0} color="#0f1a2e" noiseIntensity={3.8} rotation={0.8} />
      </div>

      <div className="min-h-screen flex items-center justify-center px-4 relative z-10">
        <GlassSurface width="420px" borderRadius={28} backgroundOpacity={0.07} blur={18}
          style={{ padding: '40px 36px 36px' }}>

          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
            <div style={{ width: 30, height: 30, borderRadius: 10, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 14, color: '#fff' }}>R</div>
            <span style={{ fontWeight: 700, fontSize: 15, color: 'rgba(255,255,255,0.9)', letterSpacing: '-0.02em' }}>RecoveryIndex</span>
          </div>

          <h1 style={{ fontSize: 30, fontWeight: 800, color: '#fff', letterSpacing: '-0.03em', marginBottom: 6 }}>Sign in</h1>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 28 }}>Welcome back. Let&apos;s check your recovery.</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <Field label="Email">
              <Input type="email" value={email} onChange={setEmail} placeholder="you@example.com" onEnter={handle} />
            </Field>
            <Field label="Password">
              <Input type="password" value={password} onChange={setPassword} placeholder="••••••••" onEnter={handle} />
            </Field>

            {error && <p style={{ color: '#f87171', fontSize: 13, textAlign: 'center' }}>{error}</p>}

            <GlassButton onClick={handle} disabled={loading || !email || !password}>
              {loading ? <Spinner /> : 'Sign In'}
            </GlassButton>

            <a href="#" style={{ textAlign: 'center', fontSize: 13, color: 'rgba(255,255,255,0.35)', textDecoration: 'underline', textDecorationColor: 'rgba(255,255,255,0.15)', textUnderlineOffset: 3 }}>
              Forgot your password?
            </a>

            <Divider />

            <OAuthButton icon={<GoogleIcon />}>Sign in with Google</OAuthButton>
            <OAuthButton icon={<FacebookIcon />}>Sign in with Facebook</OAuthButton>
          </div>

          <p style={{ textAlign: 'center', fontSize: 13, color: 'rgba(255,255,255,0.35)', marginTop: 24 }}>
            No account?{' '}
            <Link href="/auth/signup" style={{ color: '#818cf8', fontWeight: 600, textDecoration: 'none' }}>Create one</Link>
          </p>
        </GlassSurface>
      </div>
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</label>
      {children}
    </div>
  );
}

function Input({ type, value, onChange, placeholder, onEnter }: { type: string; value: string; onChange: (v: string) => void; placeholder: string; onEnter?: () => void }) {
  return (
    <input type={type} value={value} placeholder={placeholder}
      onChange={e => onChange(e.target.value)}
      onKeyDown={e => e.key === 'Enter' && onEnter?.()}
      style={{
        width: '100%', padding: '12px 14px', borderRadius: 12,
        background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
        color: '#fff', fontSize: 14, outline: 'none', fontFamily: 'inherit',
        transition: 'border-color 0.15s',
      }}
      onFocus={e => (e.target.style.borderColor = 'rgba(129,140,248,0.6)')}
      onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
    />
  );
}

function GlassButton({ children, onClick, disabled }: { children: React.ReactNode; onClick: () => void; disabled?: boolean }) {
  return (
    <button onClick={onClick} disabled={disabled}
      style={{
        width: '100%', padding: '13px', borderRadius: 12, marginTop: 4,
        background: disabled ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.92)',
        color: disabled ? 'rgba(255,255,255,0.3)' : '#0f1a2e',
        border: 'none', fontSize: 14, fontWeight: 700, cursor: disabled ? 'not-allowed' : 'pointer',
        fontFamily: 'inherit', letterSpacing: '-0.01em', transition: 'all 0.15s',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
      {children}
    </button>
  );
}

function OAuthButton({ children, icon }: { children: React.ReactNode; icon: React.ReactNode }) {
  return (
    <button style={{
      width: '100%', padding: '12px 14px', borderRadius: 12,
      background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
      color: 'rgba(255,255,255,0.8)', fontSize: 13, fontWeight: 500,
      cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center',
      justifyContent: 'center', gap: 9, transition: 'all 0.15s',
    }}>
      {icon}{children}
    </button>
  );
}

function Divider() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }} />
      <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)' }}>or</span>
      <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }} />
    </div>
  );
}

function Spinner() {
  return <span style={{ width: 16, height: 16, border: '2px solid rgba(15,26,46,0.2)', borderTopColor: '#0f1a2e', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />;
}

function GoogleIcon() {
  return <svg width="17" height="17" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.35-8.16 2.35-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>;
}
function FacebookIcon() {
  return <svg width="17" height="17" viewBox="0 0 24 24"><path fill="#1877F2" d="M24 12.073C24 5.406 18.627 0 12 0S0 5.406 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.971h-1.513c-1.491 0-1.956.93-1.956 1.886v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/></svg>;
}
