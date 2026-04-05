interface Filters {
  gene?: string
  yearMin?: number
  yearMax?: number
  studyType?: string
}

interface Props {
  filters: Filters
  onChange: (filters: Filters) => void
}

const STUDY_TYPES = [
  { value: '', label: 'Todos os tipos' },
  { value: 'review', label: 'Revisão' },
  { value: 'original', label: 'Original' },
  { value: 'case-report', label: 'Case Report' },
  { value: 'meta-analysis', label: 'Meta-análise' },
]

const GENE_OPTIONS = [
  { value: '', label: 'Todos os genes' },
  { value: 'CDHR1', label: 'CDHR1' },
  { value: 'PCDH21', label: 'PCDH21' },
  { value: 'CNGB1', label: 'CNGB1' },
  { value: 'CNGA3', label: 'CNGA3' },
  { value: 'RPGR', label: 'RPGR' },
]

const CURRENT_YEAR = new Date().getFullYear()

export default function FilterPanel({ filters, onChange }: Props) {
  return (
    <div className="filters-row" role="search" aria-label="Filtros de busca">
      <label>
        <span className="sr-only">Filtrar por gene</span>
        <select
          className="filter-select"
          value={filters.gene ?? ''}
          onChange={e => onChange({ ...filters, gene: e.target.value || undefined })}
          aria-label="Filtrar por gene"
        >
          {GENE_OPTIONS.map(o => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </label>

      <label>
        <span className="sr-only">Tipo de estudo</span>
        <select
          className="filter-select"
          value={filters.studyType ?? ''}
          onChange={e => onChange({ ...filters, studyType: e.target.value || undefined })}
          aria-label="Tipo de estudo"
        >
          {STUDY_TYPES.map(o => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </label>

      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span>Ano:</span>
        <input
          type="number"
          className="filter-select"
          style={{ width: '90px' }}
          min={1990}
          max={CURRENT_YEAR}
          placeholder="De"
          value={filters.yearMin ?? ''}
          onChange={e =>
            onChange({ ...filters, yearMin: e.target.value ? Number(e.target.value) : undefined })
          }
          aria-label="Ano mínimo"
        />
        <span>–</span>
        <input
          type="number"
          className="filter-select"
          style={{ width: '90px' }}
          min={1990}
          max={CURRENT_YEAR}
          placeholder="Até"
          value={filters.yearMax ?? ''}
          onChange={e =>
            onChange({ ...filters, yearMax: e.target.value ? Number(e.target.value) : undefined })
          }
          aria-label="Ano máximo"
        />
      </label>

      <button
        className="btn btn-secondary"
        style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}
        onClick={() => onChange({})}
        type="button"
      >
        Limpar filtros
      </button>
    </div>
  )
}
