import { v } from 'convex/values'
import { mutation, query } from './_generated/server'
import { getAuthUserId } from '@convex-dev/auth/server'

export const getMe = query({
  args: {},
  handler: async ctx => {
    const userId = await getAuthUserId(ctx)
    if (!userId) return null
    return ctx.db.get(userId)
  },
})

export const completeOnboarding = mutation({
  args: {},
  handler: async ctx => {
    const userId = await getAuthUserId(ctx)
    if (!userId) throw new Error('Not authenticated')
    await ctx.db.patch(userId, { onboardingComplete: true })
  },
})

export const setPlan = mutation({
  args: { plan: v.union(v.literal('free'), v.literal('pro')) },
  handler: async (ctx, { plan }) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) throw new Error('Not authenticated')
    await ctx.db.patch(userId, {
      plan,
      trialStarted: plan === 'pro' ? Date.now() : undefined,
    })
  },
})
