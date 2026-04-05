import { router } from './_core/trpc'
import { searchRouter } from './routers/search'
import { genesRouter } from './routers/genes'
import { analyticsRouter } from './routers/analytics'
import { trialsRouter } from './routers/trials'
import { adminRouter } from './routers/admin'

export const appRouter = router({
  search: searchRouter,
  genes: genesRouter,
  analytics: analyticsRouter,
  trials: trialsRouter,
  admin: adminRouter,
})

export type AppRouter = typeof appRouter
