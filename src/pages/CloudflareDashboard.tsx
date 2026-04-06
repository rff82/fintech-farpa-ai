import { useState, useEffect } from 'react'
import { trpc } from '../lib/trpc'

interface CloudflareResource {
  type: 'worker' | 'kv' | 'd1' | 'r2' | 'vectorize'
  name: string
  status: 'active' | 'inactive' | 'error'
  lastUpdated: string
  metrics?: {
    requests?: number
    errors?: number
    latency?: number
    storage?: number
  }
}

export default function CloudflareDashboard() {
  const [resources, setResources] = useState<CloudflareResource[]>([])
  const [selectedResource, setSelectedResource] = useState<CloudflareResource | null>(null)
  const [error, setError] = useState<string | null>(null)

  const getCloudflareResources = trpc.cloudflare.getResources.useQuery()

  useEffect(() => {
    if (getCloudflareResources.data) {
      setResources(getCloudflareResources.data as CloudflareResource[])
    }
    if (getCloudflareResources.error) {
      setError(getCloudflareResources.error.message)
    }
  }, [getCloudflareResources.data, getCloudflareResources.error])

  const updateResourceConfig = trpc.cloudflare.updateConfig.useMutation({
    onSuccess: () => {
      setError(null)
      getCloudflareResources.refetch()
    },
    onError: (err) => setError(`Erro ao atualizar: ${err.message}`)
  })

  const getResourceLogs = trpc.cloudflare.getLogs.useQuery(
    selectedResource ? { resourceId: selectedResource.name, type: selectedResource.type } : { resourceId: '', type: 'worker' },
    { enabled: !!selectedResource }
  )

  const handleConfigUpdate = (config: any) => {
    if (selectedResource) {
      updateResourceConfig.mutate({
        resourceId: selectedResource.name,
        type: selectedResource.type,
        config
      })
    }
  }

  if (getCloudflareResources.isLoading) {
    return <div className="container"><p>Carregando recursos Cloudflare...</p></div>
  }

  return (
    <div className="cloudflare-dashboard container">
      <h2>☁️ Dashboard Cloudflare</h2>
      <div className="dashboard-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem', marginTop: '2rem' }}>
        <section className="resources-panel card">
          <h3>Recursos</h3>
          {error && <div style={{ color: 'red' }}>⚠️ {error}</div>}
          {resources.map((resource) => (
            <button
              key={`${resource.type}-${resource.name}`}
              onClick={() => setSelectedResource(resource)}
              style={{
                width: '100%',
                padding: '1rem',
                marginBottom: '0.5rem',
                backgroundColor: selectedResource?.name === resource.name ? '#e3f2fd' : 'white',
                border: '1px solid #ddd',
                textAlign: 'left'
              }}
            >
              <strong>{resource.type.toUpperCase()}</strong>: {resource.name}
            </button>
          ))}
        </section>

        {selectedResource && (
          <section className="details-panel card">
            <h3>{selectedResource.name}</h3>
            {selectedResource.metrics && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>Requisições: {selectedResource.metrics.requests}</div>
                <div>Erros: {selectedResource.metrics.errors}</div>
              </div>
            )}
            <div style={{ marginTop: '2rem' }}>
              <h4>Logs</h4>
              <div style={{ backgroundColor: '#f5f5f5', padding: '1rem', maxHeight: '200px', overflowY: 'auto' }}>
                {getResourceLogs.data?.map((log: any, idx: number) => (
                  <div key={idx}>{log.message}</div>
                )) || 'Sem logs'}
              </div>
            </div>
            <button className="btn btn-primary" onClick={() => handleConfigUpdate({})} style={{ marginTop: '1rem' }}>Salvar</button>
          </section>
        )}
      </div>
    </div>
  )
}
