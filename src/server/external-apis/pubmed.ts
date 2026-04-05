const EUTILS_BASE = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils'
const CACHE_TTL = 86400 // 24h

export interface PubMedArticle {
  pmid: string
  title: string
  abstract: string
  authors: string[]
  journal: string
  year: number
  doi?: string
  url: string
  sourceDatabase: 'pubmed'
}

interface ESummaryResult {
  uid: string
  title: string
  authors: Array<{ name: string }>
  source: string
  pubdate: string
  elocationid: string
}

export async function searchPubMed(
  query: string,
  kv: KVNamespace,
): Promise<PubMedArticle[]> {
  const cacheKey = `pubmed:${query.toLowerCase().trim()}`
  const cached = await kv.get(cacheKey)
  if (cached) return JSON.parse(cached) as PubMedArticle[]

  // Step 1: Get PMIDs via esearch
  const searchUrl =
    `${EUTILS_BASE}/esearch.fcgi` +
    `?db=pubmed&term=${encodeURIComponent(query)}&retmax=20&retmode=json&sort=relevance`
  const searchRes = await fetch(searchUrl)
  if (!searchRes.ok) return []

  const searchData = (await searchRes.json()) as {
    esearchresult: { idlist: string[] }
  }
  const ids = searchData.esearchresult.idlist
  if (ids.length === 0) return []

  // Step 2: Fetch summaries via esummary
  const summaryUrl =
    `${EUTILS_BASE}/esummary.fcgi` +
    `?db=pubmed&id=${ids.join(',')}&retmode=json`
  const summaryRes = await fetch(summaryUrl)
  if (!summaryRes.ok) return []

  const summaryData = (await summaryRes.json()) as {
    result: Record<string, ESummaryResult>
  }

  const results: PubMedArticle[] = ids
    .filter(id => summaryData.result[id])
    .map(id => {
      const item = summaryData.result[id]
      const year = parseInt(item.pubdate?.split(' ')[0] ?? '0')
      const doiRaw = item.elocationid ?? ''
      const doi = doiRaw.startsWith('doi:')
        ? doiRaw.replace('doi: ', '').trim()
        : undefined
      return {
        pmid: id,
        title: item.title,
        abstract: '',
        authors: item.authors?.map(a => a.name) ?? [],
        journal: item.source,
        year,
        doi,
        url: `https://pubmed.ncbi.nlm.nih.gov/${id}/`,
        sourceDatabase: 'pubmed' as const,
      }
    })

  await kv.put(cacheKey, JSON.stringify(results), { expirationTtl: CACHE_TTL })
  return results
}
