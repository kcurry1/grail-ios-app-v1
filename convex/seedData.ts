import { mutation } from "./_generated/server";
import { CARD_CATALOG } from "./cardCatalog";

export const clearAll = mutation({
  args: {},
  handler: async (ctx) => {
    const tiers = await ctx.db.query("parallelTiers").collect();
    for (const t of tiers) await ctx.db.delete(t._id);
    const subsets = await ctx.db.query("subsets").collect();
    for (const s of subsets) await ctx.db.delete(s._id);
    const products = await ctx.db.query("products").collect();
    for (const p of products) await ctx.db.delete(p._id);
    const checks = await ctx.db.query("checklist").collect();
    for (const c of checks) await ctx.db.delete(c._id);
    return {
      deleted: {
        products: products.length,
        subsets: subsets.length,
        tiers: tiers.length,
        checks: checks.length,
      },
    };
  },
});

export const seedAll = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("products").first();
    if (existing) return { status: "already_seeded" };

    let totalProducts = 0;
    let totalSubsets = 0;
    let totalTiers = 0;

    for (const [productName, productData] of Object.entries(CARD_CATALOG)) {
      const productId = await ctx.db.insert("products", {
        name: productName,
        fullName: productData.fullName,
        season: productData.season,
        sortOrder: productData.sortOrder,
      });
      totalProducts++;

      for (const [subsetIdx, subset] of productData.subsets.entries()) {
        const subsetId = await ctx.db.insert("subsets", {
          productId,
          name: subset.name,
          type: subset.type,
          cardCount: subset.cardCount,
          sortOrder: subsetIdx,
        });
        totalSubsets++;

        for (const [tierIdx, tier] of subset.tiers.entries()) {
          const tierName = typeof tier === "string" ? tier : tier[0];
          const numberedTo =
            typeof tier === "string" ? undefined : (tier[1] as number);

          await ctx.db.insert("parallelTiers", {
            subsetId,
            productId,
            name: tierName as string,
            numberedTo,
            sortOrder: tierIdx,
          });
          totalTiers++;
        }
      }
    }

    return { status: "seeded", products: totalProducts, subsets: totalSubsets, tiers: totalTiers };
  },
});

// Batch seeder — one product at a time (avoids Convex 10s mutation limit)
export const seedProduct = mutation({
  args: {},
  handler: async (ctx) => {
    const existingProducts = await ctx.db.query("products").collect();
    const existingNames = new Set(existingProducts.map((p) => p.name));

    for (const [productName, productData] of Object.entries(CARD_CATALOG)) {
      if (existingNames.has(productName)) continue;

      const productId = await ctx.db.insert("products", {
        name: productName,
        fullName: productData.fullName,
        season: productData.season,
        sortOrder: productData.sortOrder,
      });

      let subsetCount = 0;
      let tierCount = 0;

      for (const [subsetIdx, subset] of productData.subsets.entries()) {
        const subsetId = await ctx.db.insert("subsets", {
          productId,
          name: subset.name,
          type: subset.type,
          cardCount: subset.cardCount,
          sortOrder: subsetIdx,
        });
        subsetCount++;

        for (const [tierIdx, tier] of subset.tiers.entries()) {
          const tierName = typeof tier === "string" ? tier : tier[0];
          const numberedTo =
            typeof tier === "string" ? undefined : (tier[1] as number);

          await ctx.db.insert("parallelTiers", {
            subsetId,
            productId,
            name: tierName as string,
            numberedTo,
            sortOrder: tierIdx,
          });
          tierCount++;
        }
      }

      return {
        status: "seeded_product",
        product: productName,
        subsets: subsetCount,
        tiers: tierCount,
        remaining: Object.keys(CARD_CATALOG).length - existingNames.size - 1,
      };
    }

    return { status: "all_seeded" };
  },
});
