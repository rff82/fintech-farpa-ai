import { useState, type FormEvent } from 'react'

interface Props {
  onSearch: (query: string) => void
  loading?: boolean
  defaultValue?: string
}

export default function SearchBar({ onSearch, loading, defaultValue = '' }: Props) {
  const [value, setValue] = useState(defaultValue)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (value.trim()) onSearch(value.trim())
  }

  return (
    <form role="search" onSubmit={handleSubmit} className="search-bar-wrapper">
      <label htmlFor="main-search" className="sr-only">
        Buscar artigos científicos
      </label>
      <input
        id="main-search"
        type="search"
        className="search-input"
        placeholder="Buscar por gene, fenótipo, autor, instituição..."
        value={value}
        onChange={e => setValue(e.target.value)}
        aria-label="Campo de busca"
        autoComplete="off"
      />
      <button type="submit" className="search-btn" disabled={loading}>
        {loading ? 'Buscando...' : 'Buscar'}
      </button>
    </form>
  )
}
