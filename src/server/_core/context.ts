export interface CloudflareEnv {
  DB: D1Database
  KV: KVNamespace
  STORAGE: R2Bucket
}

export interface CreateContext {
  env: CloudflareEnv
}
