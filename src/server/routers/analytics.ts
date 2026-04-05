import { router, publicProcedure } from '../_core/trpc'

export const analyticsRouter = router({
  getOverview: publicProcedure.query(async ({ ctx }) => {
    const articlesCount = await ctx.env.DB.prepare('SELECT COUNT(*) as count FROM articles').first('count')
    const genesCount = await ctx.env.DB.prepare('SELECT COUNT(*) as count FROM genes').first('count')
    
    const recentArticles = await ctx.env.DB.prepare(
      'SELECT * FROM articles ORDER BY created_at DESC LIMIT 5'
    ).all()

    return {
      totalArticles: articlesCount || 0,
      totalGenes: genesCount || 0,
      recentArticles: recentArticles.results || [],
    }
  }),

  getTopGenes: publicProcedure.query(async ({ ctx }) => {
    const { results } = await ctx.env.DB.prepare(
      'SELECT symbol, article_count FROM genes ORDER BY article_count DESC LIMIT 10'
    ).all()
    
    return results || []
  }),
})
