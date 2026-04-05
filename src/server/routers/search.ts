import { z } from 'zod'
import { drizzle } from 'drizzle-orm/d1'
import { like, desc } from 'drizzle-orm'
import { router, publicProcedure } from '../_core/trpc'
import { articles } from '../../../drizzle/schema'
import { searchPubMed } from '../external-apis/pubmed'

export const searchRouter = router({
  advanced: publicProcedure
    .input(
      z.object({
        query: z.string().min(1),
        gene: z.string().optional(),
        yearMin: z.number().optional(),
        yearMax: z.number().optional(),
        studyType: z.string().optional(),
        page: z.number().default(1),
        limit: z.number().max(50).default(20),
      }),
    )
    .query(async ({ input, ctx }) => {
      const db = drizzle(ctx.env.DB)
      const offset = (input.page - 1) * input.limit

      const dbResults = await db
        .select()
        .from(articles)
        .where(like(articles.title, `%${input.query}%`))
        .orderBy(desc(articles.year))
        .limit(input.limit)
        .offset(offset)

      if (dbResults.length > 0) {
        return { results: dbResults, source: 'db' as const, total: dbResults.length }
      }

      const pubmedResults = await searchPubMed(input.query, ctx.env.KV)
      return { results: pubmedResults, source: 'pubmed' as const, total: pubmedResults.length }
    }),

  autocomplete: publicProcedure
    .input(z.object({ query: z.string().min(2) }))
    .query(async ({ input, ctx }) => {
      const db = drizzle(ctx.env.DB)
      return db
        .select({ title: articles.title, pmid: articles.pmid })
        .from(articles)
        .where(like(articles.title, `%${input.query}%`))
        .limit(5)
    }),
})
