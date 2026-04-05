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
        useVector: z.boolean().default(true),
      }),
    )
    .query(async ({ input, ctx }) => {
      const offset = (input.page - 1) * input.limit
      let finalResults: any[] = []
      let source = 'db'

      if (input.useVector && ctx.env.VECTOR_INDEX) {
        try {
          // 1. Gerar Embedding da Query
          const embeddingRes = await ctx.env.AI.run('@cf/baai/bge-base-en-v1.5', {
            text: [input.query]
          })
          const queryVector = embeddingRes.data[0]

          // 2. Buscar no Vectorize
          const vectorResults = await ctx.env.VECTOR_INDEX.query(queryVector, {
            topK: input.limit,
            returnMetadata: true
          })

          // 3. Buscar detalhes no D1 para os IDs encontrados
          const ids = vectorResults.matches.map(m => m.id)
          if (ids.length > 0) {
            const placeholders = ids.map(() => '?').join(',')
            const { results } = await ctx.env.DB.prepare(
              `SELECT * FROM articles WHERE pmid IN (${placeholders})`
            )
            .bind(...ids)
            .all()
            finalResults = results || []
            source = 'vectorize'
          }
        } catch (err) {
          console.error('Erro na busca vetorial:', err)
        }
      }

      // Fallback para busca textual no D1 se vetor falhar ou não retornar nada
      if (finalResults.length === 0) {
        const { results } = await ctx.env.DB.prepare(
          'SELECT * FROM articles WHERE title LIKE ? OR abstract LIKE ? ORDER BY year DESC LIMIT ? OFFSET ?'
        )
        .bind(`%${input.query}%`, `%${input.query}%`, input.limit, offset)
        .all()
        finalResults = results || []
      }

      // Fallback para PubMed se ainda não houver resultados
      if (finalResults.length === 0) {
        finalResults = await searchPubMed(input.query, ctx.env.KV)
        source = 'pubmed'
      }

      // Enriquecer com resumos da IA do KV
      const resultsWithAI = await Promise.all(
        finalResults.map(async (article: any) => {
          const aiSummary = await ctx.env.KV.get(`ai:summary:${article.pmid}`)
          return {
            ...article,
            aiSummary: aiSummary || null
          }
        })
      )

      return { 
        results: resultsWithAI, 
        source, 
        total: resultsWithAI.length 
      }
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
