import { z } from 'zod'
import { drizzle } from 'drizzle-orm/d1'
import { eq, desc } from 'drizzle-orm'
import { router, publicProcedure } from '../_core/trpc'
import { genes } from '../../../drizzle/schema'

export const genesRouter = router({
  list: publicProcedure.query(async ({ ctx }) => {
    const db = drizzle(ctx.env.DB)
    return db.select().from(genes).orderBy(desc(genes.articleCount)).limit(50)
  }),

  bySymbol: publicProcedure
    .input(z.object({ symbol: z.string() }))
    .query(async ({ input, ctx }) => {
      const db = drizzle(ctx.env.DB)
      const [gene] = await db
        .select()
        .from(genes)
        .where(eq(genes.symbol, input.symbol.toUpperCase()))
        .limit(1)
      return gene ?? null
    }),
})
