import { useState } from 'react'
import { trpc } from '../lib/trpc'

export default function Admin() {
  const [formData, setFormData] = useState({
    pmid: '',
    title: '',
    abstract: '',
    authors: '',
    journal: '',
    year: new Date().getFullYear(),
    doi: '',
    url: '',
  })
  const [file, setFile] = useState<File | null>(null)
  const [status, setStatus] = useState('')

  const createArticle = trpc.admin.createArticle.useMutation({
    onSuccess: () => {
      setStatus('✅ Artigo cadastrado com sucesso! IA e Vectorize processados.')
      setFormData({ pmid: '', title: '', abstract: '', authors: '', journal: '', year: 2024, doi: '', url: '' })
    },
    onError: (err) => setStatus(`❌ Erro: ${err.message}`)
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('⏳ Processando cadastro e IA...')
    createArticle.mutate({
      ...formData,
      authors: formData.authors.split(',').map(a => a.trim()),
    })
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return
    setFile(selectedFile)
    setStatus(`📂 Arquivo selecionado: ${selectedFile.name}`)
  }

  return (
    <div className="admin-page container">
      <h2>⚙️ Painel de Gerenciamento</h2>
      <p>Cadastre novas informações e faça upload de documentos para a base de conhecimento.</p>

      <div className="admin-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '2rem' }}>
        {/* Formulário de Cadastro */}
        <section className="card">
          <h3>📄 Cadastrar Novo Artigo</h3>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <input 
              type="text" placeholder="PMID (ex: 12345678)" required 
              value={formData.pmid} onChange={e => setFormData({...formData, pmid: e.target.value})}
            />
            <input 
              type="text" placeholder="Título do Artigo" required 
              value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
            />
            <textarea 
              placeholder="Resumo / Abstract" rows={4}
              value={formData.abstract} onChange={e => setFormData({...formData, abstract: e.target.value})}
            />
            <input 
              type="text" placeholder="Autores (separados por vírgula)" 
              value={formData.authors} onChange={e => setFormData({...formData, authors: e.target.value})}
            />
            <div style={{ display: 'flex', gap: '1rem' }}>
              <input 
                type="text" placeholder="Revista / Journal" style={{ flex: 2 }}
                value={formData.journal} onChange={e => setFormData({...formData, journal: e.target.value})}
              />
              <input 
                type="number" placeholder="Ano" style={{ flex: 1 }}
                value={formData.year} onChange={e => setFormData({...formData, year: parseInt(e.target.value)})}
              />
            </div>
            <input 
              type="text" placeholder="URL do Artigo" 
              value={formData.url} onChange={e => setFormData({...formData, url: e.target.value})}
            />
            <button type="submit" className="btn btn-primary" disabled={createArticle.isPending}>
              {createArticle.isPending ? 'Processando...' : 'Cadastrar e Gerar IA'}
            </button>
          </form>
        </section>

        {/* Upload de Arquivos */}
        <section className="card">
          <h3>☁️ Upload de Documentos (R2)</h3>
          <div style={{ border: '2px dashed #ccc', padding: '2rem', textAlign: 'center', borderRadius: '8px' }}>
            <input type="file" id="file-upload" hidden onChange={handleFileUpload} />
            <label htmlFor="file-upload" style={{ cursor: 'pointer' }}>
              <div style={{ fontSize: '3rem' }}>📤</div>
              <p>Clique para selecionar ou arraste arquivos</p>
              <small>PDF, Imagens ou Datasets</small>
            </label>
          </div>
          {file && (
            <div style={{ marginTop: '1rem' }}>
              <button className="btn btn-secondary" onClick={() => setStatus('⚠️ Funcionalidade de upload direto via R2 requer configuração de endpoint PUT.')}>
                Fazer Upload de {file.name}
              </button>
            </div>
          )}
        </section>
      </div>

      {status && (
        <div className="status-message" style={{ marginTop: '2rem', padding: '1rem', borderRadius: '8px', backgroundColor: '#f0f4f8', borderLeft: '4px solid #0070f3' }}>
          {status}
        </div>
      )}
    </div>
  )
}
