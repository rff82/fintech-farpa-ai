import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import { appRouter } from '../../src/server/routers'
import type { CloudflareEnv } from '../../src/server/_core/context'

export const onRequest: PagesFunction<CloudflareEnv> = ctx => {
  return fetchRequestHandler({
    endpoint: '/api',
    req: ctx.request,
    router: appRouter,
    createContext: () => ({ env: ctx.env as import('../../src/server/_core/context').CloudflareEnv }),
    onError:
      process.env.NODE_ENV === 'development'
        ? ({ path, error }) => console.error(`tRPC error [${path}]:`, error)
        : undefined,
  })
}
