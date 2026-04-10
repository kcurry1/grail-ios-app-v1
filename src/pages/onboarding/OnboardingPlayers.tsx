import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAction, useMutation, useQuery } from 'convex/react'
import { api } from '../../../convex/_generated/api'

const NBA_IMG = 'https://cdn.nba.com/headshots/nba/latest/1040x760/'

// Curated default list matching the prototype
const CURATED_PLAYERS = [
  { name: 'Cooper Flagg', team: 'Mavericks', nbaId: '1642843', badge: 'rookie' as const, pos: 'SF' },
  { name: 'Ace Bailey', team: 'Nets', nbaId: '1642846', badge: 'rookie' as const, pos: 'SF' },
  { name: 'Kon Knueppel', team: 'Bucks', nbaId: '1642851', badge: 'rookie' as const, pos: 'SG' },
  { name: 'VJ Edgecombe', team: '76ers', nbaId: '1642845', badge: 'rookie' as const, pos: 'SG' },
  { name: 'Jeremiah Fears', team: 'Thunder', nbaId: '1642847', badge: 'rookie' as const, pos: 'PG' },
  { name: 'Tre Johnson', team: 'Pelicans', nbaId: '1642848', badge: 'rookie' as const, pos: 'SG' },
  { name: 'Dylan Harper', team: 'Pistons', nbaId: '1642844', badge: 'rookie' as const, pos: 'PG' },
  { name: 'Matas Buzelis', team: 'Bulls', nbaId: '1641824', badge: 'hot' as const, pos: 'SF' },
  { name: 'Stephon Castle', team: 'Spurs', nbaId: '1642264', badge: 'hot' as const, pos: 'PG' },
  { name: 'Luka Dončić', team: 'Lakers', nbaId: '1629029', badge: null, pos: 'PG' },
  { name: 'Shai Gilgeous-Alexander', team: 'Thunder', nbaId: '1628983', badge: 'hot' as const, pos: 'SG' },
  { name: 'Anthony Edwards', team: 'Timberwolves', nbaId: '1630162', badge: 'hot' as const, pos: 'SG' },
  { name: 'Nikola Jokić', team: 'Nuggets', nbaId: '203999', badge: null, pos: 'C' },
  { name: 'Devin Booker', team: 'Suns', nbaId: '1626164', badge: null, pos: 'SG' },
  { name: 'Victor Wembanyama', team: 'Spurs', nbaId: '1641705', badge: 'hot' as const, pos: 'C' },
  { name: 'LeBron James', team: 'Lakers', nbaId: '2544', badge: null, pos: 'SF' },
  { name: 'Stephen Curry', team: 'Warriors', nbaId: '201939', badge: null, pos: 'PG' },
  { name: 'Jayson Tatum', team: 'Celtics', nbaId: '1628369', badge: null, pos: 'SF' },
  { name: 'Ja Morant', team: 'Grizzlies', nbaId: '1629630', badge: null, pos: 'PG' },
  { name: 'Giannis Antetokounmpo', team: 'Bucks', nbaId: '203507', badge: null, pos: 'PF' },
]

type BdlResult = {
  bdlId: number
  name: string
  position: string
  teamAbbr: string
  headshotUrl: string
}

type PlayerItem = {
  key: string
  name: string
  team: string
  nbaId?: string
  badge?: 'rookie' | 'hot' | null
  pos?: string
  headshotUrl: string
}

export default function OnboardingPlayers() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [searchResults, setSearchResults] = useState<BdlResult[]>([])
  const [searching, setSearching] = useState(false)
  const [saving, setSaving] = useState(false)

  const searchPlayersFn = useAction(api.players.searchPlayers)
  const trackPlayer = useMutation(api.players.trackPlayer)
  const alreadyTracked = useQuery(api.players.getTracked) ?? []
  const trackedNames = new Set(alreadyTracked.map(p => p.playerName))

  // Debounced search
  const [debounceTimer, setDebounceTimer] = useState<ReturnType<typeof setTimeout> | null>(null)
  function handleSearch(val: string) {
    setSearch(val)
    if (debounceTimer) clearTimeout(debounceTimer)
    if (val.trim().length < 2) { setSearchResults([]); return }
    const t = setTimeout(async () => {
      setSearching(true)
      try {
        const results = await searchPlayersFn({ query: val.trim() })
        setSearchResults(results as BdlResult[])
      } catch {
        setSearchResults([])
      } finally {
        setSearching(false)
      }
    }, 400)
    setDebounceTimer(t)
  }

  const displayPlayers: PlayerItem[] = useMemo(() => {
    if (search.trim().length >= 2 && searchResults.length > 0) {
      return searchResults.map(r => ({
        key: `bdl-${r.bdlId}`,
        name: r.name,
        team: r.teamAbbr,
        nbaId: String(r.bdlId),
        headshotUrl: r.headshotUrl,
        pos: r.position,
      }))
    }
    const filtered = search.trim()
      ? CURATED_PLAYERS.filter(p =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.team.toLowerCase().includes(search.toLowerCase()),
        )
      : CURATED_PLAYERS
    return filtered.map(p => ({
      key: p.nbaId,
      name: p.name,
      team: p.team,
      nbaId: p.nbaId,
      badge: p.badge,
      pos: p.pos,
      headshotUrl: `${NBA_IMG}${p.nbaId}.png`,
    }))
  }, [search, searchResults])

  function toggle(key: string) {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  async function handleNext() {
    if (selected.size === 0) {
      navigate('/onboarding/plan')
      return
    }
    setSaving(true)
    try {
      const toSave = displayPlayers.filter(p => selected.has(p.key))
      await Promise.all(
        toSave.map(p =>
          trackPlayer({
            playerName: p.name,
            bdlPlayerId: p.nbaId ? Number(p.nbaId) : undefined,
            teamAbbr: p.team,
            position: p.pos,
            headshotUrl: p.headshotUrl,
            nbaId: p.nbaId,
          }),
        ),
      )
      navigate('/onboarding/plan')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg)' }}>
      {/* Header */}
      <div style={{ padding: '20px 24px 0' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <h1 style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 40,
            color: 'var(--text-primary)',
            margin: 0,
            lineHeight: 1,
          }}>
            WHO DO YOU<br />COLLECT?
          </h1>
          <button
            onClick={() => navigate('/onboarding/plan')}
            style={{ color: 'var(--text-muted)', fontSize: 14, paddingTop: 4 }}
          >
            Skip
          </button>
        </div>

        {/* Search bar */}
        <div style={{
          marginTop: 16,
          marginBottom: 12,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
        }}>
          <svg
            style={{ position: 'absolute', left: 14, color: 'var(--text-muted)' }}
            width="18" height="18" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Search players..."
            value={search}
            onChange={e => handleSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 14px 12px 42px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 12,
              color: 'var(--text-primary)',
              fontSize: 14,
            }}
          />
        </div>
      </div>

      {/* Player grid */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '0 24px',
      }}>
        {searching && (
          <p style={{ color: 'var(--text-muted)', fontSize: 13, textAlign: 'center', padding: '20px 0' }}>
            Searching…
          </p>
        )}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 12,
          paddingBottom: 120,
        }}>
          {displayPlayers.map(p => {
            const isSelected = selected.has(p.key)
            const alreadyAdded = trackedNames.has(p.name)
            return (
              <div
                key={p.key}
                onClick={() => !alreadyAdded && toggle(p.key)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '16px 8px 14px',
                  background: 'var(--bg-card)',
                  border: `2px solid ${isSelected || alreadyAdded ? 'var(--gold)' : 'transparent'}`,
                  borderRadius: 12,
                  cursor: alreadyAdded ? 'default' : 'pointer',
                  position: 'relative',
                  transition: 'all 0.15s',
                  backgroundColor: isSelected || alreadyAdded ? 'rgba(212,168,83,0.08)' : 'var(--bg-card)',
                }}
              >
                {/* Checkmark */}
                <div style={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  width: 22,
                  height: 22,
                  borderRadius: '50%',
                  background: 'var(--gold)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: isSelected || alreadyAdded ? 1 : 0,
                  transform: isSelected || alreadyAdded ? 'scale(1)' : 'scale(0.5)',
                  transition: 'all 0.2s',
                }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="3">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </div>

                {/* Avatar */}
                <div style={{
                  width: 72,
                  height: 72,
                  borderRadius: '50%',
                  background: 'var(--bg-elevated)',
                  overflow: 'hidden',
                  marginBottom: 10,
                  display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: 'center',
                }}>
                  <img
                    src={p.headshotUrl}
                    alt={p.name}
                    style={{ width: 90, height: 'auto', objectFit: 'cover', objectPosition: 'top' }}
                    onError={e => {
                      (e.target as HTMLImageElement).style.display = 'none'
                      const parent = (e.target as HTMLImageElement).parentElement
                      if (parent) parent.innerHTML = '<div style="font-size:28px;padding:16px">🏀</div>'
                    }}
                    loading="lazy"
                  />
                </div>

                <div style={{ fontSize: 12, fontWeight: 600, textAlign: 'center', lineHeight: 1.2 }}>
                  {p.name}
                </div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>
                  {p.team}
                </div>
                {p.badge === 'rookie' && (
                  <span style={{
                    display: 'inline-block',
                    padding: '2px 6px',
                    borderRadius: 4,
                    fontSize: 9,
                    fontWeight: 700,
                    marginTop: 4,
                    background: 'rgba(52,199,89,0.15)',
                    color: '#34c759',
                  }}>RC</span>
                )}
                {p.badge === 'hot' && (
                  <span style={{
                    display: 'inline-block',
                    padding: '2px 6px',
                    borderRadius: 4,
                    fontSize: 9,
                    fontWeight: 700,
                    marginTop: 4,
                    background: 'rgba(255,149,0,0.15)',
                    color: '#ff9500',
                  }}>🔥 HOT</span>
                )}
                {alreadyAdded && (
                  <span style={{ fontSize: 9, color: 'var(--gold)', marginTop: 2 }}>Tracking</span>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Bottom CTA */}
      <div style={{
        padding: '16px 24px',
        paddingBottom: 'max(16px, env(safe-area-inset-bottom))',
        background: 'var(--bg)',
        borderTop: '1px solid var(--border)',
      }}>
        <button
          onClick={handleNext}
          disabled={saving}
          style={{
            width: '100%',
            padding: '16px 0',
            borderRadius: 14,
            background: 'var(--gold)',
            color: '#000',
            fontWeight: 700,
            fontSize: 15,
            opacity: saving ? 0.6 : 1,
          }}
        >
          {saving
            ? 'Saving…'
            : selected.size > 0
              ? `Next (${selected.size} selected)`
              : 'Next'}
        </button>
      </div>
    </div>
  )
}
