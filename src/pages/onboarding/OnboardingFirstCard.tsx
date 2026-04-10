import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import type { Id } from '../../../convex/_generated/dataModel'

const NBA_IMG = 'https://cdn.nba.com/headshots/nba/latest/1040x760/'

type Step = 'player' | 'collection' | 'cards'

export default function OnboardingFirstCard() {
  const navigate = useNavigate()
  const trackedPlayers = useQuery(api.players.getTracked) ?? []
  const products = useQuery(api.products.list) ?? []
  const completeOnboarding = useMutation(api.users.completeOnboarding)

  const [step, setStep] = useState<Step>('player')
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null)
  const [selectedProductId, setSelectedProductId] = useState<Id<'products'> | null>(null)
  const [finishing, setFinishing] = useState(false)

  const selectedPlayer = trackedPlayers.find(p => p._id === selectedPlayerId)
  const selectedProduct = products.find(p => p._id === selectedProductId)

  async function finish() {
    setFinishing(true)
    try {
      await completeOnboarding()
      navigate('/home')
    } finally {
      setFinishing(false)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg)' }}>
      {/* Header */}
      <div style={{ padding: '20px 24px 0' }}>
        <button
          onClick={() => {
            if (step === 'player') navigate('/onboarding/plan')
            else if (step === 'collection') setStep('player')
            else setStep('collection')
          }}
          style={{ color: 'var(--text-secondary)', fontSize: 14, display: 'block', marginBottom: 20 }}
        >
          ← Back
        </button>

        {step === 'player' && (
          <>
            <h1 style={{ fontFamily: "'Bebas Neue'", fontSize: 36, color: 'var(--text-primary)', margin: '0 0 8px' }}>
              ADD YOUR<br />FIRST CARD
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 20 }}>
              Pick a player to start with
            </p>
          </>
        )}
        {step === 'collection' && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <div style={{
                width: 48, height: 48, borderRadius: '50%',
                background: 'var(--bg-elevated)', overflow: 'hidden',
                display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
              }}>
                <img
                  src={selectedPlayer?.headshotUrl ?? `${NBA_IMG}${selectedPlayer?.bdlPlayerId}.png`}
                  alt={selectedPlayer?.playerName}
                  style={{ width: 55, height: 'auto', objectFit: 'cover', objectPosition: 'top' }}
                  onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
                />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 16 }}>{selectedPlayer?.playerName}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{selectedPlayer?.teamAbbr}</div>
              </div>
            </div>
            <h2 style={{ fontFamily: "'Bebas Neue'", fontSize: 28, color: 'var(--text-primary)', margin: '0 0 16px' }}>
              PICK A COLLECTION
            </h2>
          </>
        )}
        {step === 'cards' && (
          <>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontWeight: 700, fontSize: 16 }}>{selectedPlayer?.playerName}</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>
                {selectedProduct?.fullName ?? selectedProduct?.name}
              </div>
            </div>
            <h2 style={{ fontFamily: "'Bebas Neue'", fontSize: 28, color: 'var(--text-primary)', margin: '0 0 4px' }}>
              YOU'RE ALL SET
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 20 }}>
              Head to your collection to start adding cards
            </p>
          </>
        )}
      </div>

      {/* Step: Pick player */}
      {step === 'player' && (
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 24px' }}>
          {trackedPlayers.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: 14, textAlign: 'center', paddingTop: 40 }}>
              No players tracked yet. Go back and add some!
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingBottom: 100 }}>
              {trackedPlayers.map(p => (
                <button
                  key={p._id}
                  onClick={() => { setSelectedPlayerId(p._id); setStep('collection') }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    padding: '14px 16px',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    borderRadius: 14,
                    textAlign: 'left',
                    transition: 'border-color 0.15s',
                  }}
                >
                  <div style={{
                    width: 44, height: 44, borderRadius: '50%',
                    background: 'var(--bg-elevated)', overflow: 'hidden',
                    display: 'flex', alignItems: 'flex-end', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <img
                      src={p.headshotUrl ?? `${NBA_IMG}${p.bdlPlayerId}.png`}
                      alt={p.playerName}
                      style={{ width: 50, height: 'auto', objectFit: 'cover', objectPosition: 'top' }}
                      onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 15 }}>{p.playerName}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                      {p.teamAbbr} · {p.position}
                    </div>
                  </div>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Step: Pick collection */}
      {step === 'collection' && (
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 24px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingBottom: 100 }}>
            {products.map(product => (
              <button
                key={product._id}
                onClick={() => { setSelectedProductId(product._id); setStep('cards') }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: 14,
                  textAlign: 'left',
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: 15 }}>{product.fullName ?? product.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{product.season ?? product.year}</div>
                </div>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step: Cards (celebration / completion) */}
      {step === 'cards' && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 24px' }}>
          <div style={{
            width: 80, height: 80, borderRadius: '50%',
            background: 'var(--bg-card)', border: '2px solid var(--gold)',
            overflow: 'hidden', display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
            marginBottom: 24,
          }}>
            <img
              src={selectedPlayer?.headshotUrl ?? `${NBA_IMG}${selectedPlayer?.bdlPlayerId}.png`}
              alt={selectedPlayer?.playerName}
              style={{ width: 90, height: 'auto', objectFit: 'cover', objectPosition: 'top' }}
              onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
            />
          </div>
          <h2 style={{ fontFamily: "'Bebas Neue'", fontSize: 36, color: 'var(--gold)', margin: '0 0 12px', textAlign: 'center' }}>
            LET'S GO!
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 15, textAlign: 'center', maxWidth: 280 }}>
            Your collection is set up. Add cards from the{' '}
            <strong style={{ color: 'var(--text-primary)' }}>
              {selectedProduct?.fullName ?? selectedProduct?.name}
            </strong>{' '}
            in the Collection tab.
          </p>
        </div>
      )}

      {/* Bottom CTA */}
      <div style={{
        padding: '16px 24px',
        paddingBottom: 'max(16px, env(safe-area-inset-bottom))',
        background: 'var(--bg)',
        borderTop: '1px solid var(--border)',
      }}>
        {step === 'player' && (
          <button
            onClick={finish}
            disabled={finishing}
            style={{
              width: '100%', padding: '16px 0', borderRadius: 14,
              background: 'var(--bg-card)', color: 'var(--text-secondary)',
              border: '1px solid var(--border)', fontWeight: 600, fontSize: 14,
            }}
          >
            Skip for Now
          </button>
        )}
        {step === 'cards' && (
          <button
            onClick={finish}
            disabled={finishing}
            style={{
              width: '100%', padding: '16px 0', borderRadius: 14,
              background: 'var(--gold)', color: '#000',
              fontWeight: 700, fontSize: 15,
              opacity: finishing ? 0.6 : 1,
            }}
          >
            {finishing ? 'Setting up…' : 'Go to My Collection'}
          </button>
        )}
      </div>
    </div>
  )
}
