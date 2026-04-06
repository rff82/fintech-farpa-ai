import { useState } from 'react'
import { trpc } from '../lib/trpc'

interface HealthRecord {
  id: string
  patientId: string
  condition: string
  geneMarker: string
  visionLoss: number
  retinalThickness: number
  notes: string
  createdAt: string
}

interface SearchResult {
  id: string
  patientId: string
  condition: string
  similarity: number
  visionLoss: number
  retinalThickness: number
}

export default function HealthDataManagement() {
  const [activeTab, setActiveTab] = useState<'crud' | 'search'>('crud')
  const [records, setRecords] = useState<HealthRecord[]>([])
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [formData, setFormData] = useState({
    patientId: '',
    condition: 'CDHR1',
    geneMarker: '',
    visionLoss: 0,
    retinalThickness: 1.0,
    notes: ''
  })
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRecord, setSelectedRecord] = useState<HealthRecord | null>(null)
  const [loading, setLoading] = useState(false)

  const createRecord = trpc.healthData.createRecord.useMutation({
    onSuccess: (data: any) => {
      const newRecord: HealthRecord = {
        id: data.id,
        patientId: data.patientId,
        condition: data.condition,
        geneMarker: data.geneMarker || '',
        visionLoss: data.visionLoss,
        retinalThickness: data.retinalThickness,
        notes: data.notes || '',
        createdAt: data.createdAt
      }
      setRecords(prev => [...prev, newRecord])
      setFormData({ patientId: '', condition: 'CDHR1', geneMarker: '', visionLoss: 0, retinalThickness: 1.0, notes: '' })
      alert('✅ Registro criado com sucesso!')
    },
    onError: (err) => alert(`❌ Erro: ${err.message}`)
  })

  const updateRecord = trpc.healthData.updateRecord.useMutation({
    onSuccess: (data: any) => {
      const updated: HealthRecord = {
        id: data.id,
        patientId: data.patientId,
        condition: data.condition,
        geneMarker: data.geneMarker || '',
        visionLoss: data.visionLoss,
        retinalThickness: data.retinalThickness,
        notes: data.notes || '',
        createdAt: data.createdAt
      }
      setRecords(prev => prev.map(r => r.id === updated.id ? updated : r))
      setSelectedRecord(null)
      alert('✅ Registro atualizado com sucesso!')
    },
    onError: (err) => alert(`❌ Erro: ${err.message}`)
  })

  const deleteRecord = trpc.healthData.deleteRecord.useMutation({
    onSuccess: (id) => {
      setRecords(prev => prev.filter(r => r.id !== id))
      alert('✅ Registro deletado com sucesso!')
    },
    onError: (err) => alert(`❌ Erro: ${err.message}`)
  })

  // Usando query em vez de mutation para busca vetorial se for GET, ou mantendo mutation se for POST
  // No tRPC, queries são para leitura, mutations para escrita. Busca vetorial pode ser query.
  const vectorSearch = trpc.healthData.vectorSearch.useQuery(
    { query: searchQuery, topK: 10 },
    { enabled: false }
  )

  const handleCreateRecord = (e: React.FormEvent) => {
    e.preventDefault()
    createRecord.mutate(formData)
  }

  const handleUpdateRecord = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedRecord) return
    updateRecord.mutate({
      id: selectedRecord.id,
      ...formData
    })
  }

  const handleVectorSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return
    setLoading(true)
    try {
      const results = await vectorSearch.refetch()
      if (results.data) {
        setSearchResults(results.data as SearchResult[])
      }
    } catch (err) {
      alert('Erro na busca')
    } finally {
      setLoading(false)
    }
  }

  const handleSelectRecord = (record: HealthRecord) => {
    setSelectedRecord(record)
    setFormData({
      patientId: record.patientId,
      condition: record.condition,
      geneMarker: record.geneMarker,
      visionLoss: record.visionLoss,
      retinalThickness: record.retinalThickness,
      notes: record.notes
    })
  }

  return (
    <div className="health-data-management container">
      <h2>🏥 Gestão de Dados de Saúde</h2>
      <div className="tabs" style={{ display: 'flex', gap: '1rem', marginTop: '2rem', borderBottom: '2px solid #ddd' }}>
        <button className={`tab-button ${activeTab === 'crud' ? 'active' : ''}`} onClick={() => setActiveTab('crud')}>📝 CRUD</button>
        <button className={`tab-button ${activeTab === 'search' ? 'active' : ''}`} onClick={() => setActiveTab('search')}>🔍 Busca</button>
      </div>

      {activeTab === 'crud' && (
        <div className="crud-section" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '2rem' }}>
          <section className="card">
            <h3>{selectedRecord ? '✏️ Editar' : '➕ Novo'}</h3>
            <form onSubmit={selectedRecord ? handleUpdateRecord : handleCreateRecord} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input placeholder="ID Paciente" value={formData.patientId} onChange={e => setFormData({...formData, patientId: e.target.value})} required />
              <select value={formData.condition} onChange={e => setFormData({...formData, condition: e.target.value})}>
                <option value="CDHR1">CDHR1</option>
                <option value="RPE65">RPE65</option>
              </select>
              <input placeholder="Marcador" value={formData.geneMarker} onChange={e => setFormData({...formData, geneMarker: e.target.value})} />
              <input type="range" min="0" max="100" value={formData.visionLoss} onChange={e => setFormData({...formData, visionLoss: parseInt(e.target.value)})} />
              <input type="number" step="0.1" value={formData.retinalThickness} onChange={e => setFormData({...formData, retinalThickness: parseFloat(e.target.value)})} />
              <textarea placeholder="Notas" value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} />
              <button type="submit" className="btn btn-primary">{selectedRecord ? 'Atualizar' : 'Criar'}</button>
            </form>
          </section>
          <section className="card">
            <h3>📋 Registros</h3>
            {records.map(r => (
              <div key={r.id} onClick={() => handleSelectRecord(r)} style={{ padding: '1rem', border: '1px solid #ddd', marginBottom: '0.5rem', cursor: 'pointer' }}>
                {r.patientId} - {r.condition}
                <button onClick={(e) => { e.stopPropagation(); deleteRecord.mutate(r.id); }}>🗑️</button>
              </div>
            ))}
          </section>
        </div>
      )}

      {activeTab === 'search' && (
        <div className="search-section" style={{ marginTop: '2rem' }}>
          <section className="card">
            <form onSubmit={handleVectorSearch} style={{ display: 'flex', gap: '1rem' }}>
              <input placeholder="Busca semântica..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ flex: 1 }} />
              <button type="submit" className="btn btn-primary" disabled={loading}>Buscar</button>
            </form>
            <div style={{ marginTop: '2rem' }}>
              {searchResults.map(res => (
                <div key={res.id} style={{ padding: '1rem', border: '1px solid #ddd', marginBottom: '0.5rem' }}>
                  <strong>{res.patientId}</strong> ({(res.similarity * 100).toFixed(1)}%)
                </div>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  )
}
