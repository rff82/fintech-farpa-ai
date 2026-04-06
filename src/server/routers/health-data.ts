import { z } from 'zod'
import { router, publicProcedure } from '../_core/trpc'

const HealthRecordSchema = z.object({
  patientId: z.string().min(1),
  condition: z.string(),
  geneMarker: z.string().optional(),
  visionLoss: z.number().min(0).max(100),
  retinalThickness: z.number().min(0),
  notes: z.string().optional()
})

export const healthDataRouter = router({
  createRecord: publicProcedure
    .input(HealthRecordSchema)
    .mutation(async ({ input, ctx }) => {
      const id = `rec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

      await ctx.env.DB.prepare(
        `INSERT INTO health_records (id, patient_id, condition, gene_marker, vision_loss, retinal_thickness, notes, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(
        id,
        input.patientId,
        input.condition,
        input.geneMarker || null,
        input.visionLoss,
        input.retinalThickness,
        input.notes || '',
        new Date().toISOString()
      )
      .run()

      if (ctx.env.AI && ctx.env.VECTOR_INDEX) {
        try {
          const textToEmbed = `Paciente ${input.patientId} com ${input.condition}. Perda de visão ${input.visionLoss}%. Espessura retiniana ${input.retinalThickness}mm.`

          const embeddingRes = await ctx.env.AI.run('@cf/baai/bge-base-en-v1.5', {
            text: [textToEmbed]
          })

          const embedding = embeddingRes.data[0]

          await ctx.env.VECTOR_INDEX.upsert([{
            id: id,
            values: embedding,
            metadata: {
              patientId: input.patientId,
              condition: input.condition,
              visionLoss: input.visionLoss,
              retinalThickness: input.retinalThickness,
              type: 'health_record'
            }
          }])
        } catch (err) {
          console.error('Erro ao gerar embedding:', err)
        }
      }

      return {
        id,
        ...input,
        createdAt: new Date().toISOString()
      }
    }),

  updateRecord: publicProcedure
    .input(z.object({
      id: z.string(),
      patientId: z.string().min(1),
      condition: z.string(),
      geneMarker: z.string().optional(),
      visionLoss: z.number().min(0).max(100),
      retinalThickness: z.number().min(0),
      notes: z.string().optional()
    }))
    .mutation(async ({ input, ctx }) => {
      const { id, ...data } = input

      await ctx.env.DB.prepare(
        `UPDATE health_records 
         SET patient_id = ?, condition = ?, gene_marker = ?, vision_loss = ?, retinal_thickness = ?, notes = ?, updated_at = ?
         WHERE id = ?`
      )
      .bind(
        data.patientId,
        data.condition,
        data.geneMarker || null,
        data.visionLoss,
        data.retinalThickness,
        data.notes || '',
        new Date().toISOString(),
        id
      )
      .run()

      if (ctx.env.AI && ctx.env.VECTOR_INDEX) {
        try {
          const textToEmbed = `Paciente ${data.patientId} com ${data.condition}. Perda de visão ${data.visionLoss}%. Espessura retiniana ${data.retinalThickness}mm.`

          const embeddingRes = await ctx.env.AI.run('@cf/baai/bge-base-en-v1.5', {
            text: [textToEmbed]
          })

          const embedding = embeddingRes.data[0]

          await ctx.env.VECTOR_INDEX.upsert([{
            id: id,
            values: embedding,
            metadata: {
              patientId: data.patientId,
              condition: data.condition,
              visionLoss: data.visionLoss,
              retinalThickness: data.retinalThickness,
              type: 'health_record'
            }
          }])
        } catch (err) {
          console.error('Erro ao atualizar embedding:', err)
        }
      }

      return {
        id,
        ...data,
        createdAt: new Date().toISOString()
      }
    }),

  deleteRecord: publicProcedure
    .input(z.string())
    .mutation(async ({ input: id, ctx }) => {
      await ctx.env.DB.prepare('DELETE FROM health_records WHERE id = ?').bind(id).run()
      return id
    }),

  vectorSearch: publicProcedure
    .input(z.object({
      query: z.string(),
      topK: z.number().default(10)
    }))
    .query(async ({ input, ctx }) => {
      if (!ctx.env.AI || !ctx.env.VECTOR_INDEX) {
        throw new Error('Serviços de IA ou Vectorize não disponíveis')
      }

      try {
        const embeddingRes = await ctx.env.AI.run('@cf/baai/bge-base-en-v1.5', {
          text: [input.query]
        })

        const queryVector = embeddingRes.data[0]

        const vectorResults = await ctx.env.VECTOR_INDEX.query(queryVector, {
          topK: input.topK,
          returnMetadata: true
        })

        const results = vectorResults.matches || []

        const enrichedResults = await Promise.all(
          results.map(async (match) => {
            const record = await ctx.env.DB.prepare('SELECT * FROM health_records WHERE id = ?').bind(match.id).first() as any
            return {
              id: match.id,
              similarity: match.score || 0,
              patientId: record?.patient_id || (match.metadata?.patientId as string) || 'Unknown',
              condition: record?.condition || (match.metadata?.condition as string) || 'Unknown',
              visionLoss: record?.vision_loss || (match.metadata?.visionLoss as number) || 0,
              retinalThickness: record?.retinal_thickness || (match.metadata?.retinalThickness as number) || 0
            }
          })
        )

        return enrichedResults
      } catch (err) {
        console.error('Erro na busca vetorial:', err)
        throw new Error(`Erro na busca vetorial: ${err instanceof Error ? err.message : 'Desconhecido'}`)
      }
    })
})
