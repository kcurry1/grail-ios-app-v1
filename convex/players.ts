import { v } from 'convex/values'
import { action, mutation, query } from './_generated/server'
import { getAuthUserId } from '@convex-dev/auth/server'

const BDL_API_KEY = process.env.BDL_API_KEY ?? ''
const NBA_IMG_BASE = 'https://cdn.nba.com/headshots/nba/latest/1040x760/'

// Search BallDontLie for players by name
export const searchPlayers = action({
  args: { query: v.string() },
  handler: async (_ctx, { query }) => {
    if (!query || query.length < 2) return []
    const url = `https://api.balldontlie.io/v1/players?search=${encodeURIComponent(query)}&per_page=20`
    const res = await fetch(url, {
      headers: { Authorization: BDL_API_KEY },
    })
    if (!res.ok) throw new Error(`BDL error: ${res.status}`)
    const data = await res.json() as { data: BdlPlayer[] }
    return data.data.map(formatPlayer)
  },
})

type BdlPlayer = {
  id: number
  first_name: string
  last_name: string
  position: string
  team?: { abbreviation: string; full_name: string }
}

function formatPlayer(p: BdlPlayer) {
  return {
    bdlId: p.id,
    name: `${p.first_name} ${p.last_name}`,
    position: p.position ?? '',
    teamAbbr: p.team?.abbreviation ?? '',
    teamName: p.team?.full_name ?? '',
    headshotUrl: `${NBA_IMG_BASE}${p.id}.png`,
  }
}

// Track a player for the current user
export const trackPlayer = mutation({
  args: {
    playerName: v.string(),
    bdlPlayerId: v.optional(v.number()),
    teamAbbr: v.optional(v.string()),
    position: v.optional(v.string()),
    headshotUrl: v.optional(v.string()),
    nbaId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) throw new Error('Not authenticated')

    // Check if already tracking
    const existing = await ctx.db
      .query('trackedPlayers')
      .withIndex('by_user_player', q => q.eq('userId', userId).eq('playerName', args.playerName))
      .first()
    if (existing) return existing._id

    // Get sort order (append to end)
    const all = await ctx.db
      .query('trackedPlayers')
      .withIndex('by_user', q => q.eq('userId', userId))
      .collect()

    return ctx.db.insert('trackedPlayers', {
      userId,
      playerName: args.playerName,
      bdlPlayerId: args.bdlPlayerId,
      teamAbbr: args.teamAbbr,
      position: args.position,
      headshotUrl: args.headshotUrl ?? (args.nbaId ? `${NBA_IMG_BASE}${args.nbaId}.png` : undefined),
      sortOrder: all.length,
    })
  },
})

// Untrack a player
export const untrackPlayer = mutation({
  args: { trackedPlayerId: v.id('trackedPlayers') },
  handler: async (ctx, { trackedPlayerId }) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) throw new Error('Not authenticated')
    const doc = await ctx.db.get(trackedPlayerId)
    if (!doc || doc.userId !== userId) throw new Error('Not found')
    await ctx.db.delete(trackedPlayerId)
  },
})

// Get all tracked players for current user
export const getTracked = query({
  args: {},
  handler: async ctx => {
    const userId = await getAuthUserId(ctx)
    if (!userId) return []
    return ctx.db
      .query('trackedPlayers')
      .withIndex('by_user', q => q.eq('userId', userId))
      .collect()
  },
})
