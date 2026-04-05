import { searchPubMed } from '../src/server/external-apis/pubmed'
import { searchClinicalTrials } from '../src/server/external-apis/clinical-trials'
import type { CloudflareEnv } from '../src/server/_core/context'

const SYNC_QUERY = 'CDHR1 OR "retinal dystrophy"'

async function generateEmbedding(env: CloudflareEnv, text: string): Promise<number[]> {
  const response = await env.AI.run('@cf/baai/bge-base-en-v1.5', {
    text: [text]
  })
  return response.data[0]
}

async function runSync(env: CloudflareEnv): Promise<{ articles: number; trials: number }> {
  let articleCount = 0
  let trialCount = 0

  // ── PubMed ──────────────────────────────────
  const pubmedArticles = await searchPubMed(SYNC_QUERY, env.KV)
  for (const article of pubmedArticles) {
    try {
      const result = await env.DB.prepare(
        `INSERT OR IGNORE INTO articles (
          pmid, title, abstract, authors, journal, year, doi, url, source_database
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
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
        
        // 1. Gerar Resumo com IA
        if (env.AI) {
          try {
            const aiResponse = await env.AI.run('@cf/meta/llama-3-8b-instruct', {
              prompt: `Resuma este título científico de forma simples e acessível para pacientes: ${article.title}`
            })
            if (aiResponse?.response) {
              await env.KV.put(`ai:summary:${article.pmid}`, aiResponse.response)
            }
          } catch (aiErr) {
            console.error('Erro no Workers AI (Summary):', aiErr)
          }

          // 2. Gerar Embedding e Salvar no Vectorize
          try {
            const embedding = await generateEmbedding(env, `${article.title} ${article.abstract || ''}`)
            await env.VECTOR_INDEX.upsert([{
              id: article.pmid,
              values: embedding,
              metadata: { title: article.title, type: 'article' }
            }])
          } catch (vecErr) {
            console.error('Erro no Vectorize:', vecErr)
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
        `INSERT OR IGNORE INTO clinical_trials (
          nct_id, title, status, phase, sponsor_name, locations, start_date, url
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
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

      if (result.meta.changes > 0) {
        trialCount++
        
        // Gerar Embedding para Trials
        if (env.AI) {
          try {
            const embedding = await generateEmbedding(env, trial.title)
            await env.VECTOR_INDEX.upsert([{
              id: trial.nctId,
              values: embedding,
              metadata: { title: trial.title, type: 'trial' }
            }])
          } catch (vecErr) {
            console.error('Erro no Vectorize (Trial):', vecErr)
          }
        }
      }
    } catch (err) {
      console.error('Erro ao inserir trial:', err)
    }
  }

  await env.KV.put('sync:last_run', new Date().toISOString())
  
  return { articles: articleCount, trials: trialCount }
}

export const onScheduled: ExportedHandlerScheduledHandler<CloudflareEnv> = async (
  _event,
  env,
) => {
  await runSync(env)
}

export const onRequestGet: PagesFunction<CloudflareEnv> = async ctx => {
  const stats = await runSync(ctx.env)
  return Response.json({ ok: true, ...stats })
}
