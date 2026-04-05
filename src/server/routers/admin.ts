import { z } from 'zod'
import { router, publicProcedure } from '../_core/trpc'

export const adminRouter = router({
  createArticle: publicProcedure
    .input(
      z.object({
        pmid: z.string(),
        title: z.string(),
        abstract: z.string().optional(),
        authors: z.array(z.string()),
        journal: z.string(),
        year: z.number(),
        doi: z.string().optional(),
        url: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      // 1. Inserir no D1
      await ctx.env.DB.prepare(
        `INSERT INTO articles (pmid, title, abstract, authors, journal, year, doi, url, source_database)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'manual')`
      )
      .bind(
        input.pmid,
        input.title,
        input.abstract || '',
        JSON.stringify(input.authors),
        input.journal,
        input.year,
        input.doi || null,
        input.url
      )
      .run()

      // 2. Gerar Resumo IA
      if (ctx.env.AI) {
        try {
          const aiResponse = await ctx.env.AI.run('@cf/meta/llama-3-8b-instruct', {
            prompt: `Resuma este título científico de forma simples e acessível para pacientes: ${input.title}`
          })
          if (aiResponse?.response) {
            await ctx.env.KV.put(`ai:summary:${input.pmid}`, aiResponse.response)
          }
        } catch (err) {
          console.error('Erro IA Summary:', err)
        }

        // 3. Gerar Embedding e Vectorize
        try {
          const embeddingRes = await ctx.env.AI.run('@cf/baai/bge-base-en-v1.5', {
            text: [`${input.title} ${input.abstract || ''}`]
          })
          const embedding = embeddingRes.data[0]
          await ctx.env.VECTOR_INDEX.upsert([{
            id: input.pmid,
            values: embedding,
            metadata: { title: input.title, type: 'article' }
          }])
        } catch (err) {
          console.error('Erro Vectorize:', err)
        }
      }

      return { success: true }
    }),

  getUploadUrl: publicProcedure
    .input(z.object({ filename: z.string(), contentType: z.string() }))
    .mutation(async ({ input, ctx }) => {
      // Nota: Cloudflare R2 não tem presigned URLs nativos via binding direto no Worker sem S3 API
      // Mas podemos retornar um endpoint que o Worker processa o PUT
      return { 
        uploadUrl: `/api/admin/upload?file=${encodeURIComponent(input.filename)}&type=${encodeURIComponent(input.contentType)}`,
        method: 'PUT'
      }
    }),
})
