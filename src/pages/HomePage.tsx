import { useQuery } from 'convex/react'
import { useNavigate } from 'react-router-dom'
import { api } from '../../convex/_generated/api'

const NBA_IMG = 'https://cdn.nba.com/headshots/nba/latest/1040x760/'

export default function HomePage() {
  const navigate = useNavigate()
  const trackedPlayers = useQuery(api.players.getTracked) ?? []
  const products = useQuery(api.products.list) ?? []
  const me = useQuery(api.users.getMe)

  const cardCount = 0 // will be real once cards are added
  const portfolioValue = 0

  return (
    <div style={{ paddingBottom: 20 }}>
      {/* Top bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 20px 0' }}>
        <div>
          <h2 style={{ fontFamily: "'Bebas Neue'", fontSize: 28, color: 'var(--text-primary)', margin: 0, letterSpacing: 1 }}>
            COLLECTION
          </h2>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>
            {cardCount} cards · {trackedPlayers.length} players
          </p>
        </div>
        <div style={{
          width: 36, height: 36, borderRadius: '50%',
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18, cursor: 'pointer',
        }}>
          {me?.name ? me.name[0].toUpperCase() : '👤'}
        </div>
      </div>

      {/* Portfolio value hero */}
      <div style={{
        margin: '16px 20px',
        padding: '20px',
        background: 'var(--bg-card)',
        borderRadius: 16,
        border: '1px solid var(--border)',
      }}>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', letterSpacing: 0.5, marginBottom: 4 }}>
          Total Portfolio Value
        </div>
        <div style={{ fontSize: 36, fontWeight: 800, color: 'var(--text-primary)' }}>
          ${portfolioValue.toLocaleString()}
        </div>
        {cardCount === 0 && (
          <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
            Add cards to see your collection value
          </div>
        )}
      </div>

      {/* Quick add */}
      <div style={{ padding: '0 20px', marginBottom: 24 }}>
        <button
          onClick={() => navigate('/collection')}
          style={{
            width: '100%',
            padding: '14px 0',
            borderRadius: 12,
            background: 'var(--gold-dim)',
            border: '1px solid rgba(201,168,76,0.3)',
            color: 'var(--gold)',
            fontWeight: 700,
            fontSize: 14,
            letterSpacing: 0.5,
          }}
        >
          + Add Cards
        </button>
      </div>

      {/* My Players */}
      <div style={{ padding: '0 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <h3 style={{ fontFamily: "'Bebas Neue'", fontSize: 20, color: 'var(--text-primary)', margin: 0, letterSpacing: 0.5 }}>
            MY PLAYERS
          </h3>
          <button
            style={{ fontSize: 13, color: 'var(--gold)' }}
            onClick={() => {/* open add player overlay */}}
          >
            + Add
          </button>
        </div>

        {trackedPlayers.length === 0 ? (
          <div style={{
            padding: '32px 20px',
            background: 'var(--bg-card)',
            borderRadius: 14,
            border: '1px dashed var(--border)',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>🏀</div>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14, margin: 0 }}>
              No players tracked yet
            </p>
            <button
              onClick={() => navigate('/onboarding/players')}
              style={{
                marginTop: 16,
                padding: '10px 20px',
                borderRadius: 10,
                background: 'var(--gold)',
                color: '#000',
                fontWeight: 700,
                fontSize: 13,
              }}
            >
              Pick Players
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 8 }}>
            {trackedPlayers.map(p => (
              <div
                key={p._id}
                style={{
                  flexShrink: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 8,
                  cursor: 'pointer',
                }}
              >
                <div style={{
                  width: 64, height: 64, borderRadius: '50%',
                  background: 'var(--bg-card)',
                  border: '2px solid var(--border)',
                  overflow: 'hidden',
                  display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
                }}>
                  <img
                    src={p.headshotUrl ?? `${NBA_IMG}${p.bdlPlayerId}.png`}
                    alt={p.playerName}
                    style={{ width: 74, height: 'auto', objectFit: 'cover', objectPosition: 'top' }}
                    onError={e => {
                      (e.target as HTMLImageElement).style.display = 'none'
                      const par = (e.target as HTMLImageElement).parentElement
                      if (par) par.innerHTML = '<div style="font-size:24px;padding:12px">🏀</div>'
                    }}
                  />
                </div>
                <div style={{ fontSize: 11, fontWeight: 600, textAlign: 'center', maxWidth: 64 }}>
                  {p.playerName.split(' ').pop()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Active sets */}
      <div style={{ padding: '24px 20px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <h3 style={{ fontFamily: "'Bebas Neue'", fontSize: 20, color: 'var(--text-primary)', margin: 0, letterSpacing: 0.5 }}>
            ACTIVE SETS
          </h3>
          <button style={{ fontSize: 13, color: 'var(--gold)' }}>See All</button>
        </div>

        {products.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>Loading sets…</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {products.slice(0, 5).map(product => (
              <div
                key={product._id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 16px',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: 12,
                  cursor: 'pointer',
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>
                    {product.fullName ?? product.name}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                    {product.season ?? product.year} · 0 cards
                  </div>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
