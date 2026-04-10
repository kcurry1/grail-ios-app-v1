import { useNavigate } from 'react-router-dom'

export default function SplashPage() {
  const navigate = useNavigate()

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: '100%',
      background: 'var(--bg)',
      padding: '0 24px',
    }}>
      {/* Center logo */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
        <h1 style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: 80,
          letterSpacing: 8,
          color: 'var(--gold)',
          margin: 0,
          lineHeight: 1,
          background: 'linear-gradient(135deg, var(--gold) 0%, var(--gold-light) 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          GRAIL
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 16, textAlign: 'center', lineHeight: 1.5, margin: 0 }}>
          Build your collection,<br />card by card.
        </p>
        <p style={{ color: 'var(--text-muted)', fontSize: 13, margin: 0 }}>
          Built by collectors, for collectors.
        </p>
      </div>

      {/* Bottom buttons */}
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 12, paddingBottom: 48 }}>
        <button
          onClick={() => navigate('/auth')}
          style={{
            width: '100%',
            padding: '16px 24px',
            border: 'none',
            borderRadius: 14,
            fontFamily: "'Inter', sans-serif",
            fontSize: 16,
            fontWeight: 600,
            cursor: 'pointer',
            background: 'linear-gradient(135deg, var(--gold) 0%, #c49a3e 50%, var(--gold-light) 100%)',
            color: '#000',
            boxShadow: '0 4px 20px rgba(212,168,83,0.3), 0 0 40px rgba(212,168,83,0.1)',
          }}
        >
          Get Started
        </button>
        <button
          onClick={() => navigate('/auth')}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            fontSize: 15,
            fontWeight: 500,
            padding: '12px 20px',
            cursor: 'pointer',
          }}
        >
          Already have an account? Log in
        </button>
        <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-muted)', margin: 0 }}>
          By continuing, you agree to our Terms & Privacy Policy
        </p>
      </div>
    </div>
  )
}
