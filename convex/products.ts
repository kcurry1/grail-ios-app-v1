import { query } from './_generated/server'

export const list = query({
  args: {},
  handler: async ctx => {
    return ctx.db.query('products').collect()
  },
})

export const listWithSubsets = query({
  args: {},
  handler: async ctx => {
    const products = await ctx.db.query('products').collect()
    const result = await Promise.all(
      products.map(async product => {
        const subsets = await ctx.db
          .query('subsets')
          .withIndex('by_product', q => q.eq('productId', product._id))
          .collect()
        return { ...product, subsets }
      }),
    )
    return result
  },
})
