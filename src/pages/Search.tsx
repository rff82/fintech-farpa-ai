import { useState } from 'react'
import { trpc } from '../lib/trpc'
import SearchBar from '../components/SearchBar'
import FilterPanel from '../components/FilterPanel'
import ArticleCard from '../components/ArticleCard'

interface Filters {
  gene?: string
  yearMin?: number
  yearMax?: number
  studyType?: string
}

export default function Search() {
  const [query, setQuery] = useState('CDHR1')
  const [filters, setFilters] = useState<Filters>({})
  const [page, setPage] = useState(1)

  const { data, isFetching, isError } = trpc.search.advanced.useQuery(
    { query, ...filters, page, limit: 20 },
    { enabled: query.length > 0 },
  )

  function handleSearch(q: string) {
    setQuery(q)
    setPage(1)
  }

  function handleFilters(f: Filters) {
    setFilters(f)
    setPage(1)
  }

  const results = (data?.results ?? []) as any[]
  const source = data?.source

  return (
    <div className="search-page">
      <div className="container">
        <h2>🔍 Busca Avançada</h2>
        <SearchBar onSearch={handleSearch} loading={isFetching} defaultValue={query} />
        <FilterPanel filters={filters} onChange={handleFilters} />

        {isError && (
          <p className="empty-state" role="alert">
            Erro ao carregar resultados. Tente novamente.
          </p>
        )}

        {!isError && (
          <>
            {results.length > 0 && (
              <p className="results-info">
                {results.length} resultado(s)
                {source === 'pubmed' && ' — via PubMed API'}
                {source === 'db' && ' — via banco de dados local'}
              </p>
            )}

            {isFetching && results.length === 0 && (
              <p className="loading-text" aria-live="polite">
                Buscando...
              </p>
            )}

            {!isFetching && results.length === 0 && query && (
              <p className="empty-state">
                Nenhum resultado para <strong>{query}</strong>. Tente outros termos.
              </p>
            )}

            <div className="results-grid" aria-live="polite" aria-label="Resultados da busca">
              {results.map((article: any) => (
                <ArticleCard key={article.pmid ?? article.title} article={article} />
              ))}
            </div>

            {results.length === 20 && (
              <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                <button
                  className="btn btn-primary"
                  onClick={() => setPage(p => p + 1)}
                  disabled={isFetching}
                >
                  Carregar mais
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
