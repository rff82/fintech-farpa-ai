/**
 * RAG Multi-Gene Cron Worker — CDHR1 PubMed fetcher.
 * Executa quinzenalmente (a cada 14 dias) via Cloudflare Cron Trigger.
 * Usa ctx.waitUntil() para não bloquear a response.
 *
 * Scheduled trigger: "0 3 1,15 * *" (1st and 15th of each month at 03:00 UTC)
 */

interface Env {
  DB: D1Database;
  VECTOR_STORE: VectorizeIndex;
  KV: KVNamespace;
  PUBMED_API_KEY?: string;
}

interface PubMedArticle {
  pmid: string;
  title: string;
  abstract: string;
  authors: string[];
  publishedDate: string;
  doi?: string;
}

const GENE_QUERIES = [
  "CDHR1 retinal dystrophy",
  "CDHR1 photoreceptor degeneration",
  "CDHR1 mutation vision loss",
];

const PUBMED_BASE = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils";

async function searchPubMed(query: string, apiKey?: string): Promise<string[]> {
  const params = new URLSearchParams({
    db: "pubmed",
    term: query,
    retmax: "20",
    retmode: "json",
    sort: "relevance",
    ...(apiKey ? { api_key: apiKey } : {}),
  });

  const res = await fetch(`${PUBMED_BASE}/esearch.fcgi?${params}`);
  if (!res.ok) throw new Error(`PubMed search failed: ${res.status}`);

  const data = (await res.json()) as { esearchresult: { idlist: string[] } };
  return data.esearchresult.idlist;
}

async function fetchArticleDetails(
  pmids: string[],
  apiKey?: string
): Promise<PubMedArticle[]> {
  if (pmids.length === 0) return [];

  const params = new URLSearchParams({
    db: "pubmed",
    id: pmids.join(","),
    retmode: "json",
    rettype: "abstract",
    ...(apiKey ? { api_key: apiKey } : {}),
  });

  const res = await fetch(`${PUBMED_BASE}/efetch.fcgi?${params}`);
  if (!res.ok) throw new Error(`PubMed fetch failed: ${res.status}`);

  const data = (await res.json()) as Record<string, unknown>;
  const articles = (data as any).PubmedArticleSet?.PubmedArticle ?? [];

  return articles.map((a: any) => {
    const citation = a.MedlineCitation;
    const article = citation?.Article;
    return {
      pmid: citation?.PMID?._text ?? "",
      title: article?.ArticleTitle ?? "",
      abstract: article?.Abstract?.AbstractText ?? "",
      authors: (article?.AuthorList?.Author ?? []).map(
        (au: any) => `${au.LastName ?? ""} ${au.ForeName ?? ""}`.trim()
      ),
      publishedDate: `${citation?.DateCompleted?.Year ?? ""}`,
      doi: article?.ELocationID?._text ?? undefined,
    } as PubMedArticle;
  });
}

async function upsertToVectorStore(
  articles: PubMedArticle[],
  vectorStore: VectorizeIndex,
  db: D1Database
): Promise<void> {
  for (const article of articles) {
    if (!article.pmid || !article.abstract) continue;

    // Store metadata in D1
    await db
      .prepare(
        `INSERT OR REPLACE INTO rag_articles
         (pmid, title, abstract, authors, published_date, doi, fetched_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(
        article.pmid,
        article.title,
        article.abstract,
        JSON.stringify(article.authors),
        article.publishedDate,
        article.doi ?? null,
        new Date().toISOString()
      )
      .run();
  }
}

async function runRAGSync(env: Env): Promise<void> {
  console.log("[RAG CRON] Starting CDHR1 PubMed sync…");

  const allPmids = new Set<string>();

  for (const query of GENE_QUERIES) {
    try {
      const pmids = await searchPubMed(query, env.PUBMED_API_KEY);
      pmids.forEach((id) => allPmids.add(id));
      // Respect PubMed rate limits (10 req/s without key, 3 req/s with)
      await new Promise((r) => setTimeout(r, env.PUBMED_API_KEY ? 110 : 350));
    } catch (err) {
      console.error(`[RAG CRON] Query failed: "${query}"`, err);
    }
  }

  const articles = await fetchArticleDetails([...allPmids], env.PUBMED_API_KEY);
  await upsertToVectorStore(articles, env.VECTOR_STORE, env.DB);

  // Update last sync timestamp in KV
  await env.KV.put("rag:last_sync", new Date().toISOString());
  await env.KV.put("rag:article_count", String(articles.length));

  console.log(`[RAG CRON] Sync complete — ${articles.length} articles processed.`);
}

export default {
  async scheduled(
    _event: ScheduledEvent,
    env: Env,
    ctx: ExecutionContext
  ): Promise<void> {
    ctx.waitUntil(runRAGSync(env));
  },
} satisfies ExportedHandler<Env>;
