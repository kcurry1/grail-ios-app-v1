import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthActions } from '@convex-dev/auth/react'

const DEMO_EMAIL = 'demo@grail.app'
const DEMO_PASSWORD = 'grail-demo-2025'

export default function AuthPage() {
  const navigate = useNavigate()
  const { signIn } = useAuthActions()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(true)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [demoLoading, setDemoLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await signIn('password', { email, password, flow: isSignUp ? 'signUp' : 'signIn' })
      navigate('/onboarding/players')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  async function handleDemo() {
    setDemoLoading(true)
    setError('')
    try {
      // Try sign in first, fall back to sign up
      try {
        await signIn('password', { email: DEMO_EMAIL, password: DEMO_PASSWORD, flow: 'signIn' })
      } catch {
        await signIn('password', { email: DEMO_EMAIL, password: DEMO_PASSWORD, flow: 'signUp' })
      }
      navigate('/onboarding/players')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Demo sign-in failed')
    } finally {
      setDemoLoading(false)
    }
  }

  const busy = loading || demoLoading

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      padding: '48px 24px 40px',
      background: 'var(--bg)',
      overflowY: 'auto',
    }}>
      <button
        onClick={() => navigate('/')}
        style={{ color: 'var(--text-secondary)', fontSize: 14, alignSelf: 'flex-start', marginBottom: 32 }}
      >
        ← Back
      </button>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 28 }}>
        <div>
          <h1 style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 42,
            letterSpacing: 2,
            lineHeight: 1,
            color: 'var(--text)',
            margin: '0 0 10px',
          }}>
            {isSignUp ? 'CREATE YOUR\nACCOUNT' : 'WELCOME\nBACK'}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 15, lineHeight: 1.5 }}>
            Track your NBA card collection. Every set, every card, all in one place.
          </p>
        </div>

        {/* Demo shortcut */}
        <button
          onClick={handleDemo}
          disabled={busy}
          style={{
            width: '100%',
            padding: '16px 24px',
            borderRadius: 14,
            background: 'linear-gradient(135deg, var(--gold) 0%, #c49a3e 50%, var(--gold-light) 100%)',
            color: '#000',
            fontWeight: 700,
            fontSize: 16,
            boxShadow: '0 4px 20px rgba(212,168,83,0.3)',
            opacity: busy ? 0.6 : 1,
          }}
        >
          {demoLoading ? 'Opening demo…' : '⚡ Try Demo — No Account Needed'}
        </button>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>or sign up with email</span>
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '16px 18px',
              background: 'var(--bg-card)',
              border: '1.5px solid var(--border)',
              borderRadius: 14,
              color: 'var(--text)',
              fontSize: 16,
              outline: 'none',
            }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '16px 18px',
              background: 'var(--bg-card)',
              border: '1.5px solid var(--border)',
              borderRadius: 14,
              color: 'var(--text)',
              fontSize: 16,
              outline: 'none',
            }}
          />
          {error && <p style={{ color: 'var(--red)', fontSize: 13 }}>{error}</p>}
          <button
            type="submit"
            disabled={busy}
            style={{
              width: '100%',
              padding: '16px 24px',
              borderRadius: 14,
              background: 'var(--bg-card)',
              border: '1.5px solid var(--border)',
              color: 'var(--text)',
              fontWeight: 600,
              fontSize: 16,
              opacity: busy ? 0.6 : 1,
              marginTop: 4,
            }}
          >
            {loading ? 'Please wait…' : isSignUp ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <button
          onClick={() => setIsSignUp(!isSignUp)}
          style={{ color: 'var(--text-muted)', fontSize: 14, textAlign: 'center' }}
        >
          {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
        </button>
      </div>
    </div>
  )
}
