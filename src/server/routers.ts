import { router } from './_core/trpc'
import { searchRouter } from './routers/search'
import { genesRouter } from './routers/genes'
import { analyticsRouter } from './routers/analytics'
import { trialsRouter } from './routers/trials'
import { adminRouter } from './routers/admin'
import { cloudflareRouter } from './routers/cloudflare'
import { healthDataRouter } from './routers/health-data'

export const appRouter = router({
  search: searchRouter,
  genes: genesRouter,
  analytics: analyticsRouter,
  trials: trialsRouter,
  admin: adminRouter,
  cloudflare: cloudflareRouter,
  healthData: healthDataRouter,
})

export type AppRouter = typeof appRouter
