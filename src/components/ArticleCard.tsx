interface Article {
  pmid?: string | null
  title: string
  authors?: string | string[] | null
  journal?: string | null
  year?: number | null
  doi?: string | null
  url?: string | null
  abstract?: string | null
  sourceDatabase?: string | null
  aiSummary?: string | null
}

interface Props {
  article: Article
}

export default function ArticleCard({ article }: Props) {
  const authorsList: string[] = !article.authors
    ? []
    : Array.isArray(article.authors)
      ? article.authors
      : (JSON.parse(article.authors) as string[])

  const authors = authorsList.slice(0, 3).join(', ')
  const hasMore = authorsList.length > 3

  return (
    <article className="article-card">
      <a
        href={article.url ?? `https://pubmed.ncbi.nlm.nih.gov/${article.pmid}/`}
        className="article-title"
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Abrir artigo: ${article.title}`}
      >
        {article.title}
      </a>

      <div className="article-meta">
        {authors && (
          <span>
            {authors}
            {hasMore ? ' et al.' : ''}
          </span>
        )}
        {article.journal && <span> · {article.journal}</span>}
        {article.year && <span> · {article.year}</span>}
        {article.doi && (
          <span>
            {' · '}
            <a
              href={`https://doi.org/${article.doi}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              DOI
            </a>
          </span>
        )}
      </div>

      {article.aiSummary ? (
        <div className="ai-summary-box">
          <strong>✨ Resumo Acessível (IA):</strong>
          <p>{article.aiSummary}</p>
        </div>
      ) : (
        article.abstract && (
          <p className="article-abstract">{article.abstract}</p>
        )
      )}

      <div style={{ marginTop: '0.75rem' }}>
        {article.sourceDatabase && (
          <span className="article-badge">{article.sourceDatabase}</span>
        )}
        {article.pmid && (
          <span className="article-badge">PMID {article.pmid}</span>
        )}
      </div>
    </article>
  )
}
