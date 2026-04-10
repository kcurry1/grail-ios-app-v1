import { useNavigate } from 'react-router-dom'

export default function OnboardingPage() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col h-full px-6 py-8" style={{ background: 'var(--bg)' }}>
      <h1 style={{ fontFamily: "'Bebas Neue'", fontSize: 40, color: 'var(--text-primary)' }}>
        WHO DO YOU<br />COLLECT?
      </h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 24 }}>
        Pick your favorite NBA players to get started.
      </p>
      {/* Player picker — coming next */}
      <div className="flex-1" />
      <button
        onClick={() => navigate('/home')}
        className="w-full py-4 rounded-xl font-semibold text-sm"
        style={{ background: 'var(--gold)', color: '#000' }}
      >
        Continue
      </button>
    </div>
  )
}
