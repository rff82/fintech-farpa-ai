import { z } from 'zod'
import { router, publicProcedure } from '../_core/trpc'

export const trialsRouter = router({
  list: publicProcedure
    .input(z.object({ limit: z.number().default(20), offset: z.number().default(0) }))
    .query(async ({ input, ctx }) => {
      const { results } = await ctx.env.DB.prepare(
        'SELECT * FROM clinical_trials ORDER BY created_at DESC LIMIT ? OFFSET ?'
      )
      .bind(input.limit, input.offset)
      .all()
      
      return results || []
    }),

  get: publicProcedure
    .input(z.object({ nctId: z.string() }))
    .query(async ({ input, ctx }) => {
      const result = await ctx.env.DB.prepare(
        'SELECT * FROM clinical_trials WHERE nct_id = ?'
      )
      .bind(input.nctId)
      .first()
      
      return result
    }),
})
