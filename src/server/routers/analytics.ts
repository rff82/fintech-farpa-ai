import { drizzle } from 'drizzle-orm/d1'
import { sql, desc } from 'drizzle-orm'
import { router, publicProcedure } from '../_core/trpc'
import { articles, genes } from '../../../drizzle/schema'

export const analyticsRouter = router({
  publicationsByYear: publicProcedure.query(async ({ ctx }) => {
    const db = drizzle(ctx.env.DB)
    return db
      .select({
        year: articles.year,
        count: sql<number>`count(*)`.as('count'),
      })
      .from(articles)
      .groupBy(articles.year)
      .orderBy(articles.year)
  }),

  topGenes: publicProcedure.query(async ({ ctx }) => {
    const db = drizzle(ctx.env.DB)
    return db.select().from(genes).orderBy(desc(genes.articleCount)).limit(10)
  }),

  syncStatus: publicProcedure.query(async ({ ctx }) => {
    const lastSync = await ctx.env.KV.get('sync:last_run')
    const totalArticles = await ctx.env.KV.get('sync:total_articles')
    return { lastSync, totalArticles: totalArticles ? Number(totalArticles) : 0 }
  }),
})
