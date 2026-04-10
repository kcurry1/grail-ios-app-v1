import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'
import { authTables } from '@convex-dev/auth/server'

export default defineSchema({
  ...authTables,

  users: defineTable({
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    image: v.optional(v.string()),
    isAnonymous: v.optional(v.boolean()),
    onboardingComplete: v.optional(v.boolean()),
    plan: v.optional(v.union(v.literal('free'), v.literal('pro'))),
    trialStarted: v.optional(v.number()),
  }).index('email', ['email']),

  // NBA products (e.g. "2025-26 Topps Chrome")
  products: defineTable({
    name: v.string(),
    fullName: v.optional(v.string()),
    year: v.optional(v.string()),
    season: v.optional(v.string()),
    brand: v.optional(v.string()),
    sport: v.optional(v.string()),
    sortOrder: v.optional(v.number()),
  }).index('by_name', ['name']),

  // Subsets within a product (e.g. "Base", "Refractor", "Autograph")
  subsets: defineTable({
    productId: v.id('products'),
    name: v.string(),
    type: v.optional(v.string()),
    cardType: v.optional(v.string()),
    cardCount: v.optional(v.number()),
    printRun: v.optional(v.number()),
    serialed: v.optional(v.boolean()),
    sortOrder: v.optional(v.number()),
  })
    .index('by_product', ['productId'])
    .index('by_product_name', ['productId', 'name']),

  // Parallel tiers within a subset (e.g. "Gold /50", "Orange /25")
  parallelTiers: defineTable({
    productId: v.id('products'),
    subsetId: v.id('subsets'),
    name: v.string(),
    printRun: v.optional(v.number()),
    numberedTo: v.optional(v.number()),
    color: v.optional(v.string()),
    sortOrder: v.optional(v.number()),
  })
    .index('by_subset', ['subsetId'])
    .index('by_product', ['productId']),

  // Players a user tracks
  trackedPlayers: defineTable({
    userId: v.id('users'),
    playerName: v.string(),
    bdlPlayerId: v.optional(v.number()),
    teamAbbr: v.optional(v.string()),
    position: v.optional(v.string()),
    headshotUrl: v.optional(v.string()),
    sortOrder: v.optional(v.number()),
  })
    .index('by_user', ['userId'])
    .index('by_user_player', ['userId', 'playerName']),

  // Cards a user owns
  cards: defineTable({
    userId: v.id('users'),
    playerName: v.string(),
    productId: v.id('products'),
    subsetId: v.id('subsets'),
    parallelTierId: v.optional(v.id('parallelTiers')),
    parallelName: v.optional(v.string()),
    cardNumber: v.optional(v.string()),
    pricePaid: v.optional(v.number()),
    currentValue: v.optional(v.number()),
    imageUrl: v.optional(v.string()),
    notes: v.optional(v.string()),
    acquiredAt: v.optional(v.number()),
    gradingCompany: v.optional(v.string()),
    grade: v.optional(v.string()),
  })
    .index('by_userId', ['userId'])
    .index('by_userId_product', ['userId', 'productId'])
    .index('by_userId_subset', ['userId', 'subsetId'])
    .index('by_userId_player', ['userId', 'playerName']),

  // Checklist: which cards in a set the user is chasing
  checklist: defineTable({
    userId: v.id('users'),
    playerName: v.string(),
    productId: v.id('products'),
    subsetId: v.id('subsets'),
    parallelTierId: v.optional(v.id('parallelTiers')),
    have: v.boolean(),
  })
    .index('by_user', ['userId'])
    .index('by_user_product', ['userId', 'productId'])
    .index('by_user_subset', ['userId', 'subsetId'])
    .index('by_user_player', ['userId', 'playerName']),

  // Cached player stats from BallDontLie
  playerStats: defineTable({
    bdlPlayerId: v.number(),
    playerName: v.string(),
    season: v.string(),
    pts: v.optional(v.number()),
    reb: v.optional(v.number()),
    ast: v.optional(v.number()),
    gamesPlayed: v.optional(v.number()),
    teamAbbr: v.optional(v.string()),
    lastUpdated: v.number(),
  })
    .index('by_player', ['bdlPlayerId'])
    .index('by_player_season', ['bdlPlayerId', 'season']),

  // Cached card prices from eBay
  cardPrices: defineTable({
    searchKey: v.string(),
    playerName: v.string(),
    subsetName: v.string(),
    recentSales: v.array(v.object({
      price: v.number(),
      soldDate: v.string(),
      title: v.string(),
    })),
    avgPrice: v.optional(v.number()),
    lastUpdated: v.number(),
  }).index('by_key', ['searchKey']),
})
