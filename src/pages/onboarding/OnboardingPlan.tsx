import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from 'convex/react'
import { api } from '../../../convex/_generated/api'

const PRO_FEATURES = [
  'Unlimited players',
  'Collection valuation',
  'Player performance alerts',
  'Price movement alerts',
]

const FREE_FEATURES = [
  'Collect 3 players',
  'Unlimited cards',
  'Basic search',
]

export default function OnboardingPlan() {
  const navigate = useNavigate()
  const setPlan = useMutation(api.users.setPlan)
  const [annual, setAnnual] = useState(false)
  const [loading, setLoading] = useState<'pro' | 'free' | null>(null)

  async function choosePlan(plan: 'pro' | 'free') {
    setLoading(plan)
    try {
      await setPlan({ plan })
      navigate('/onboarding/first-card')
    } finally {
      setLoading(null)
    }
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      background: 'var(--bg)',
      overflowY: 'auto',
      padding: '24px 24px 40px',
    }}>
      <button
        onClick={() => navigate('/onboarding/players')}
        style={{ color: 'var(--text-secondary)', fontSize: 14, alignSelf: 'flex-start', marginBottom: 24 }}
      >
        ← Back
      </button>

      {/* Hero */}
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <div style={{ fontSize: 48, marginBottom: 8 }}>👑</div>
        <h1 style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: 48,
          color: 'var(--gold)',
          margin: 0,
          letterSpacing: 2,
        }}>PRO</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginTop: 6 }}>
          The collector's edge
        </p>
      </div>

      {/* Billing toggle */}
      <div style={{
        display: 'flex',
        background: 'var(--bg-card)',
        borderRadius: 10,
        padding: 4,
        marginBottom: 20,
        gap: 4,
      }}>
        {['Monthly', 'Annual'].map((label, i) => {
          const isAnnual = i === 1
          const active = annual === isAnnual
          return (
            <button
              key={label}
              onClick={() => setAnnual(isAnnual)}
              style={{
                flex: 1,
                padding: '8px 0',
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 600,
                background: active ? 'var(--bg-elevated)' : 'transparent',
                color: active ? 'var(--text-primary)' : 'var(--text-muted)',
                transition: 'all 0.15s',
              }}
            >
              {label}
              {isAnnual && (
                <span style={{
                  marginLeft: 6,
                  fontSize: 9,
                  fontWeight: 700,
                  padding: '2px 5px',
                  borderRadius: 4,
                  background: 'rgba(52,199,89,0.15)',
                  color: '#34c759',
                }}>SAVE 17%</span>
              )}
            </button>
          )
        })}
      </div>

      {/* Pro card */}
      <div style={{
        background: 'var(--bg-card)',
        border: '2px solid var(--gold)',
        borderRadius: 16,
        padding: 20,
        marginBottom: 12,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
          <div style={{ fontWeight: 700, fontSize: 14, letterSpacing: 1 }}>PRO</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
            <span style={{ fontSize: 32, fontWeight: 800, color: 'var(--text-primary)' }}>
              {annual ? '$10' : '$12'}
            </span>
            <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>/ month</span>
          </div>
        </div>
        <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16 }}>
          🎁 30-day free trial — no credit card required
        </p>
        <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {PRO_FEATURES.map(f => (
            <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14 }}>
              <span style={{ color: 'var(--gold)', fontWeight: 700 }}>✓</span>
              {f}
            </li>
          ))}
        </ul>
        <button
          onClick={() => choosePlan('pro')}
          disabled={loading !== null}
          style={{
            width: '100%',
            padding: '15px 0',
            borderRadius: 12,
            background: 'var(--gold)',
            color: '#000',
            fontWeight: 700,
            fontSize: 15,
            opacity: loading === 'free' ? 0.5 : 1,
          }}
        >
          {loading === 'pro' ? 'Starting trial…' : 'Start 30-Day Free Trial'}
        </button>
        <p style={{ textAlign: 'center', fontSize: 11, color: 'var(--text-muted)', marginTop: 8 }}>
          No credit card required
        </p>
      </div>

      {/* Free card */}
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 16,
        padding: 20,
      }}>
        <div style={{ fontWeight: 700, fontSize: 14, letterSpacing: 1, marginBottom: 16 }}>FREE</div>
        <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {FREE_FEATURES.map(f => (
            <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: 'var(--text-secondary)' }}>
              <span style={{ color: 'var(--text-muted)', fontWeight: 700 }}>✓</span>
              {f}
            </li>
          ))}
        </ul>
        <button
          onClick={() => choosePlan('free')}
          disabled={loading !== null}
          style={{
            width: '100%',
            padding: '15px 0',
            borderRadius: 12,
            background: 'var(--bg-elevated)',
            color: 'var(--text-secondary)',
            border: '1px solid var(--border)',
            fontWeight: 600,
            fontSize: 14,
            opacity: loading === 'pro' ? 0.5 : 1,
          }}
        >
          {loading === 'free' ? 'Continuing…' : 'Continue with Free'}
        </button>
      </div>
    </div>
  )
}
