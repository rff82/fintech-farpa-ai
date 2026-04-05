import { z } from 'zod'
import { router, publicProcedure } from '../_core/trpc'

export const genesRouter = router({
  list: publicProcedure
    .input(z.object({ limit: z.number().default(50) }))
    .query(async ({ input, ctx }) => {
      const { results } = await ctx.env.DB.prepare(
        'SELECT * FROM genes ORDER BY article_count DESC LIMIT ?'
      )
      .bind(input.limit)
      .all()
      
      return results || []
    }),

  get: publicProcedure
    .input(z.object({ symbol: z.string() }))
    .query(async ({ input, ctx }) => {
      const result = await ctx.env.DB.prepare(
        'SELECT * FROM genes WHERE symbol = ?'
      )
      .bind(input.symbol)
      .first()
      
      return result
    }),
})
