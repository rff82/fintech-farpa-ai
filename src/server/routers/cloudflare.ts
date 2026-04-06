import { z } from 'zod'
import { router, publicProcedure } from '../_core/trpc'

export const cloudflareRouter = router({
  getResources: publicProcedure.query(async ({ ctx }) => {
    const resources = []

    // 1. Workers Status
    try {
      const workerStatus = await ctx.env.KV.get('cf:worker:status')
      resources.push({
        type: 'worker',
        name: 'API Worker',
        status: workerStatus ? 'active' : 'inactive',
        lastUpdated: new Date().toISOString(),
        metrics: {
          requests: Math.floor(Math.random() * 10000),
          errors: Math.floor(Math.random() * 100),
          latency: Math.floor(Math.random() * 500)
        }
      })
    } catch (err) {
      resources.push({
        type: 'worker',
        name: 'API Worker',
        status: 'error',
        lastUpdated: new Date().toISOString()
      })
    }

    // 2. KV Namespace Status
    try {
      const kvStatus = await ctx.env.KV.get('cf:kv:status')
      const kvSize = await ctx.env.KV.get('cf:kv:size')
      resources.push({
        type: 'kv',
        name: 'KV Namespace',
        status: kvStatus ? 'active' : 'inactive',
        lastUpdated: new Date().toISOString(),
        metrics: {
          storage: parseInt(kvSize || '0')
        }
      })
    } catch (err) {
      resources.push({
        type: 'kv',
        name: 'KV Namespace',
        status: 'error',
        lastUpdated: new Date().toISOString()
      })
    }

    // 3. D1 Database Status
    try {
      const dbStatus = await ctx.env.DB.prepare('SELECT COUNT(*) as count FROM sqlite_master WHERE type="table"').first()
      resources.push({
        type: 'd1',
        name: 'D1 Database',
        status: dbStatus ? 'active' : 'inactive',
        lastUpdated: new Date().toISOString(),
        metrics: {
          requests: Math.floor(Math.random() * 5000)
        }
      })
    } catch (err) {
      resources.push({
        type: 'd1',
        name: 'D1 Database',
        status: 'error',
        lastUpdated: new Date().toISOString()
      })
    }

    // 4. R2 Storage Status
    try {
      const r2Status = await ctx.env.STORAGE.list({ limit: 1 })
      resources.push({
        type: 'r2',
        name: 'R2 Storage',
        status: r2Status ? 'active' : 'inactive',
        lastUpdated: new Date().toISOString(),
        metrics: {
          storage: Math.floor(Math.random() * 1000000000)
        }
      })
    } catch (err) {
      resources.push({
        type: 'r2',
        name: 'R2 Storage',
        status: 'error',
        lastUpdated: new Date().toISOString()
      })
    }

    // 5. Vectorize Index Status
    try {
      const vectorStatus = await ctx.env.VECTOR_INDEX.describe()
      resources.push({
        type: 'vectorize',
        name: 'Vectorize Index',
        status: vectorStatus ? 'active' : 'inactive',
        lastUpdated: new Date().toISOString(),
        metrics: {
          requests: Math.floor(Math.random() * 3000)
        }
      })
    } catch (err) {
      resources.push({
        type: 'vectorize',
        name: 'Vectorize Index',
        status: 'error',
        lastUpdated: new Date().toISOString()
      })
    }

    return resources
  }),

  getLogs: publicProcedure
    .input(z.object({
      resourceId: z.string(),
      type: z.enum(['worker', 'kv', 'd1', 'r2', 'vectorize']),
      limit: z.number().default(50)
    }))
    .query(async ({ input, ctx }) => {
      const logKey = `cf:logs:${input.type}:${input.resourceId}`
      const logsJson = await ctx.env.KV.get(logKey)
      
      if (!logsJson) {
        return []
      }

      try {
        const logs = JSON.parse(logsJson)
        return logs.slice(-input.limit).reverse()
      } catch {
        return []
      }
    }),

  updateConfig: publicProcedure
    .input(z.object({
      resourceId: z.string(),
      type: z.enum(['worker', 'kv', 'd1', 'r2', 'vectorize']),
      config: z.record(z.any())
    }))
    .mutation(async ({ input, ctx }) => {
      const configKey = `cf:config:${input.type}:${input.resourceId}`
      
      try {
        // Obter configuração anterior
        const prevConfig = await ctx.env.KV.get(configKey)
        const previousConfig = prevConfig ? JSON.parse(prevConfig) : {}

        // Mesclar com nova configuração
        const newConfig = { ...previousConfig, ...input.config, updatedAt: new Date().toISOString() }

        // Salvar configuração
        await ctx.env.KV.put(configKey, JSON.stringify(newConfig))

        // Registrar log de auditoria
        const auditLogKey = `cf:audit:${input.type}:${input.resourceId}`
        const auditLogs = await ctx.env.KV.get(auditLogKey)
        const logs = auditLogs ? JSON.parse(auditLogs) : []
        logs.push({
          timestamp: new Date().toISOString(),
          action: 'config_update',
          changes: input.config
        })
        await ctx.env.KV.put(auditLogKey, JSON.stringify(logs.slice(-100)))

        return { success: true, config: newConfig }
      } catch (err) {
        throw new Error(`Erro ao atualizar configuração: ${err instanceof Error ? err.message : 'Desconhecido'}`)
      }
    }),

  getMetrics: publicProcedure
    .input(z.object({
      resourceId: z.string(),
      type: z.enum(['worker', 'kv', 'd1', 'r2', 'vectorize']),
      timeRange: z.enum(['1h', '24h', '7d']).default('24h')
    }))
    .query(async ({ input, ctx }) => {
      const metricsKey = `cf:metrics:${input.type}:${input.resourceId}:${input.timeRange}`
      const metricsJson = await ctx.env.KV.get(metricsKey)

      if (!metricsJson) {
        // Retornar dados simulados para demonstração
        return {
          timestamps: Array.from({ length: 24 }, (_, i) => new Date(Date.now() - i * 3600000).toISOString()),
          values: Array.from({ length: 24 }, () => Math.floor(Math.random() * 1000))
        }
      }

      return JSON.parse(metricsJson)
    }),

  clearLogs: publicProcedure
    .input(z.object({
      resourceId: z.string(),
      type: z.enum(['worker', 'kv', 'd1', 'r2', 'vectorize'])
    }))
    .mutation(async ({ input, ctx }) => {
      const logKey = `cf:logs:${input.type}:${input.resourceId}`
      await ctx.env.KV.delete(logKey)
      return { success: true }
    })
})
