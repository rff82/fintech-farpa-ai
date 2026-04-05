import { z } from 'zod'
import { drizzle } from 'drizzle-orm/d1'
import { eq } from 'drizzle-orm'
import { router, publicProcedure } from '../_core/trpc'
import { clinicalTrials } from '../../../drizzle/schema'
import { searchClinicalTrials } from '../external-apis/clinical-trials'

export const trialsRouter = router({
  list: publicProcedure
    .input(
      z.object({
        status: z.string().optional(),
        phase: z.string().optional(),
        page: z.number().default(1),
        limit: z.number().max(50).default(20),
      }),
    )
    .query(async ({ input, ctx }) => {
      const db = drizzle(ctx.env.DB)
      const offset = (input.page - 1) * input.limit

      let dbResults = await db
        .select()
        .from(clinicalTrials)
        .limit(input.limit)
        .offset(offset)

      if (dbResults.length === 0) {
        const apiResults = await searchClinicalTrials('CDHR1 OR retinal dystrophy', ctx.env.KV)
        return { results: apiResults, source: 'api' as const }
      }

      if (input.status) {
        dbResults = dbResults.filter(t => t.status === input.status)
      }

      return { results: dbResults, source: 'db' as const }
    }),

  byNctId: publicProcedure
    .input(z.object({ nctId: z.string() }))
    .query(async ({ input, ctx }) => {
      const db = drizzle(ctx.env.DB)
      const [trial] = await db
        .select()
        .from(clinicalTrials)
        .where(eq(clinicalTrials.nctId, input.nctId))
        .limit(1)
      return trial ?? null
    }),
})
