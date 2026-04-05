/**
 * Cloudflare Pages Scheduled Function — sincronização semanal
 * Ativado pelo cron definido em wrangler.toml: "0 6 * * 0" (todo domingo às 06:00 UTC)
 *
 * Para disparar manualmente em desenvolvimento:
 *   GET /sync  →  apenas para fins de teste
 */
import { drizzle } from 'drizzle-orm/d1'
import { searchPubMed } from '../src/server/external-apis/pubmed'
import { searchClinicalTrials } from '../src/server/external-apis/clinical-trials'
import { articles, clinicalTrials } from '../src/drizzle/schema'
import type { CloudflareEnv } from '../src/server/_core/context'

const SYNC_QUERY = 'CDHR1 OR "retinal dystrophy"'

async function runSync(env: CloudflareEnv): Promise<{ articles: number; trials: number }> {
  const db = drizzle(env.DB)
  let articleCount = 0
  let trialCount = 0

  // ── PubMed ──────────────────────────────────
  const pubmedArticles = await searchPubMed(SYNC_QUERY, env.KV)
  for (const article of pubmedArticles) {
    const result = await db
      .insert(articles)
      .values({
        pmid: article.pmid,
        title: article.title,
        abstract: article.abstract,
        authors: JSON.stringify(article.authors),
        journal: article.journal,
        year: article.year,
        doi: article.doi,
        url: article.url,
        sourceDatabase: 'pubmed',
      })
      .onConflictDoNothing()
    if ((result as { rowsAffected?: number }).rowsAffected) articleCount++
  }

  // ── ClinicalTrials ───────────────────────────
  const trials = await searchClinicalTrials(SYNC_QUERY, env.KV)
  for (const trial of trials) {
    const result = await db
      .insert(clinicalTrials)
      .values({
        nctId: trial.nctId,
        title: trial.title,
        status: trial.status,
        phase: trial.phase,
        sponsorName: trial.sponsor,
        locations: JSON.stringify(trial.locations),
        startDate: trial.startDate,
        url: trial.url,
      })
      .onConflictDoNothing()
    if ((result as { rowsAffected?: number }).rowsAffected) trialCount++
  }

  // ── Metadata ─────────────────────────────────
  await env.KV.put('sync:last_run', new Date().toISOString())
  await env.KV.put('sync:total_articles', String(articleCount))

  return { articles: articleCount, trials: trialCount }
}

// Triggered by cron schedule
export const onScheduled: ExportedHandlerScheduledHandler<CloudflareEnv> = async (
  _event,
  env,
) => {
  await runSync(env)
}

// Manual trigger via GET /sync (development/testing)
export const onRequestGet: PagesFunction<CloudflareEnv> = async ctx => {
  const stats = await runSync(ctx.env)
  return Response.json({ ok: true, ...stats })
}
