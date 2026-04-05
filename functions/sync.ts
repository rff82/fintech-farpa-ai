import { searchPubMed } from '../src/server/external-apis/pubmed'
import { searchClinicalTrials } from '../src/server/external-apis/clinical-trials'
import type { CloudflareEnv } from '../src/server/_core/context'

const SYNC_QUERY = 'CDHR1 OR "retinal dystrophy"'

async function runSync(env: CloudflareEnv): Promise<{ articles: number; trials: number }> {
  let articleCount = 0
  let trialCount = 0

  // ── PubMed ──────────────────────────────────
  const pubmedArticles = await searchPubMed(SYNC_QUERY, env.KV)
  for (const article of pubmedArticles) {
    try {
      // Usando D1 nativo para inserção com ON CONFLICT (SQLite nativo)
      const result = await env.DB.prepare(
        \`INSERT OR IGNORE INTO articles (
          pmid, title, abstract, authors, journal, year, doi, url, source_database
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)\`
      )
      .bind(
        article.pmid,
        article.title,
        article.abstract || '',
        JSON.stringify(article.authors),
        article.journal,
        article.year,
        article.doi || null,
        article.url,
        'pubmed'
      )
      .run()

      if (result.meta.changes > 0) {
        articleCount++
        
        // INTEGRAÇÃO NATIVA: Cloudflare Workers AI para gerar resumo acessível
        // Se o Workers AI estiver disponível no env (precisa de binding AI)
        if ((env as any).AI) {
          try {
            const aiResponse = await (env as any).AI.run('@cf/meta/llama-3-8b-instruct', {
              prompt: \`Resuma este título científico de forma simples e acessível para pacientes: \${article.title}\`
            })
            if (aiResponse?.response) {
              await env.KV.put(\`ai:summary:\${article.pmid}\`, aiResponse.response)
            }
          } catch (aiErr) {
            console.error('Erro no Workers AI:', aiErr)
          }
        }
      }
    } catch (err) {
      console.error('Erro ao inserir artigo:', err)
    }
  }

  // ── ClinicalTrials ───────────────────────────
  const trials = await searchClinicalTrials(SYNC_QUERY, env.KV)
  for (const trial of trials) {
    try {
      const result = await env.DB.prepare(
        \`INSERT OR IGNORE INTO clinical_trials (
          nct_id, title, status, phase, sponsor_name, locations, start_date, url
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)\`
      )
      .bind(
        trial.nctId,
        trial.title,
        trial.status,
        trial.phase,
        trial.sponsor,
        JSON.stringify(trial.locations),
        trial.startDate,
        trial.url
      )
      .run()

      if (result.meta.changes > 0) trialCount++
    } catch (err) {
      console.error('Erro ao inserir trial:', err)
    }
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
