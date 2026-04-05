export interface CloudflareEnv {
  DB: D1Database
  KV: KVNamespace
  STORAGE: R2Bucket
  AI: any // Cloudflare Workers AI binding
  VECTOR_INDEX: VectorizeIndex
}

export interface CreateContext {
  env: CloudflareEnv
}
