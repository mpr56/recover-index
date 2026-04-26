import { useState } from 'react';
import { signIn } from 'next-auth/react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import GlassSurface from '@/components/GlassSurface';

const Silk = dynamic(() => import('@/components/Silk'), { ssr: false });

export default function Login() {
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState('');
  const [debugOpen, setDebugOpen] = useState(false);
  const [email,     setEmail]     = useState('');
  const [password,  setPassword]  = useState('');

  const handleGoogle = async () => {
    setError('');
    setLoading(true);
    try {
      await signIn('google', { callbackUrl: '/' });
    } catch {
      setError('Sign-in failed. Please try again.');
      setLoading(false);
    }
  };

  const handleDebug = async () => {
    setError('');
    setLoading(true);
    const res = await signIn('debug-credentials', {
      email, password, redirect: false,
    });
    if (res?.error) {
      setError('Invalid credentials.');
      setLoading(false);
    } else {
      window.location.href = '/';
    }
  };

  return (
    <>
      <Head><title>Sign in to Rejuvenate</title></Head>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <div style={{ position: 'fixed', inset: 0 }}>
        <Silk speed={3.5} scale={1.0} color="#0f1a2e" noiseIntensity={1.75} rotation={0.8} />
      </div>

      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 16px', position: 'relative', zIndex: 10 }}>
        <GlassSurface width="400px" borderRadius={28} backgroundOpacity={0.07} blur={18}
          style={{ padding: '44px 36px 40px' }}>

          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32 }}>
            <img src="/Rejuvenate.png" alt="Rejuvenate" style={{ height: 50, display: 'block', filter: 'drop-shadow(0 0 1px rgba(0,0,0,0.1))' }} />
            <span style={{ fontWeight: 700, fontSize: 16, color: 'rgba(255,255,255,0.9)', letterSpacing: '-0.02em' }}>Rejuvenate</span>
          </div>

          <h1 style={{ fontSize: 28, fontWeight: 800, color: '#fff', letterSpacing: '-0.03em', marginBottom: 8 }}>Welcome back</h1>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 32, lineHeight: 1.5 }}>
            Sign in with your Google account to track and improve your recovery.
          </p>

          {error && (
            <p style={{ color: '#f87171', fontSize: 13, textAlign: 'center', marginBottom: 16,
              background: 'rgba(248,113,113,0.1)', padding: '10px 14px', borderRadius: 10,
              border: '1px solid rgba(248,113,113,0.2)' }}>
              {error}
            </p>
          )}

          {/* Google button */}
          {!debugOpen && (
            <button
              onClick={handleGoogle}
              disabled={loading}
              style={{
                width: '100%', padding: '14px 20px', borderRadius: 12,
                background: loading ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.92)',
                color: loading ? 'rgba(255,255,255,0.3)' : '#0f1a2e',
                border: 'none', fontSize: 14, fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: 'inherit', letterSpacing: '-0.01em',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                transition: 'all 0.15s',
              }}
            >
              {loading ? (
                <span style={{ width: 18, height: 18, border: '2px solid rgba(15,26,46,0.2)', borderTopColor: '#0f1a2e', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />
              ) : (
                <><GoogleIcon />Continue with Google</>
              )}
            </button>
          )}

          {/* Debug credentials form */}
          {debugOpen && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <input
                type="email" placeholder="Email" value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleDebug()}
                style={inputStyle}
              />
              <input
                type="password" placeholder="Password" value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleDebug()}
                style={inputStyle}
              />
              <button
                onClick={handleDebug}
                disabled={loading || !email || !password}
                style={{
                  width: '100%', padding: '13px', borderRadius: 12,
                  background: loading || !email || !password ? 'rgba(255,255,255,0.08)' : 'rgba(99,102,241,0.8)',
                  color: loading || !email || !password ? 'rgba(255,255,255,0.3)' : '#fff',
                  border: 'none', fontSize: 14, fontWeight: 700,
                  cursor: loading || !email || !password ? 'not-allowed' : 'pointer',
                  fontFamily: 'inherit', transition: 'all 0.15s',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                {loading
                  ? <span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.2)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />
                  : 'Sign in'}
              </button>
            </div>
          )}

          {/* Understated toggle */}
          <button
            onClick={() => { setDebugOpen(o => !o); setError(''); }}
            style={{
              display: 'block', margin: '20px auto 0', background: 'none',
              border: 'none', cursor: 'pointer', fontFamily: 'inherit',
              fontSize: 11, color: 'rgba(255,255,255,0.15)',
              textDecoration: 'underline', textUnderlineOffset: 3,
            }}
          >
            {debugOpen ? '← back to Google sign in' : 'sign in with email'}
          </button>

          {!debugOpen && (
            <p style={{ textAlign: 'center', fontSize: 11, color: 'rgba(255,255,255,0.2)', marginTop: 20, lineHeight: 1.6 }}>
              By continuing, you agree to our terms of service.<br />
              Your data is stored securely and never shared.
            </p>
          )}
        </GlassSurface>
      </div>
    </>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '12px 14px', borderRadius: 12,
  background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
  color: '#fff', fontSize: 14, outline: 'none', fontFamily: 'inherit',
};

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.35-8.16 2.35-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
    </svg>
  );
}