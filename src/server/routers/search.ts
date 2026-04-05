import { z } from 'zod'
import { router, publicProcedure } from '../_core/trpc'
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
      const offset = (input.page - 1) * input.limit
      
      // Consulta nativa ao Cloudflare D1
      const { results } = await ctx.env.DB.prepare(
        'SELECT * FROM articles WHERE title LIKE ? ORDER BY year DESC LIMIT ? OFFSET ?'
      )
      .bind(`%${input.query}%`, input.limit, offset)
      .all()

      if (results && results.length > 0) {
        return { results, source: 'db' as const, total: results.length }
      }

      // Fallback para PubMed se não houver resultados no banco
      const pubmedResults = await searchPubMed(input.query, ctx.env.KV)
      return { results: pubmedResults, source: 'pubmed' as const, total: pubmedResults.length }
    }),

  autocomplete: publicProcedure
    .input(z.object({ query: z.string().min(2) }))
    .query(async ({ input, ctx }) => {
      const { results } = await ctx.env.DB.prepare(
        'SELECT title, pmid FROM articles WHERE title LIKE ? LIMIT 5'
      )
      .bind(`%${input.query}%`)
      .all()
      
      return results || []
    }),
})
