import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <section className="hero">
      <div className="container">
        <div className="hero-content">
          <h2>Ciência Aberta em Distrofias Retinianas</h2>
          <p>
            Plataforma de pesquisa especializada em genética oftalmológica, com foco
            em CDHR1 e distrofias retinianas hereditárias. Dados de PubMed, Europe
            PMC, ClinicalTrials.gov e OMIM em uma interface unificada.
          </p>

          <div className="cta-buttons">
            <Link to="/search" className="btn btn-primary">
              Busca Avançada
            </Link>
            <Link to="/museum" className="btn btn-secondary">
              Museu Educacional
            </Link>
          </div>

          <section className="features">
            <h3>O que você encontrará aqui</h3>
            <div className="feature-grid">
              <div className="feature-card">
                <h4>🔍 Busca Avançada</h4>
                <p>
                  Pesquise artigos científicos com filtros por gene, fenótipo,
                  tipo de estudo, ano de publicação e periódico. Dados do PubMed
                  em tempo real.
                </p>
              </div>
              <div className="feature-card">
                <h4>🧬 Banco de Genes</h4>
                <p>
                  Catálogo de genes oftalmológicos com foco no CDHR1. Localização
                  cromossômica, mutações conhecidas e fenótipos associados.
                </p>
              </div>
              <div className="feature-card">
                <h4>🏥 Ensaios Clínicos</h4>
                <p>
                  Ensaios clínicos ativos em distrofias retinianas, integrados
                  com ClinicalTrials.gov com filtros por fase, status e gene.
                </p>
              </div>
              <div className="feature-card">
                <h4>📊 Analytics</h4>
                <p>
                  Tendências de publicações ao longo do tempo, genes mais
                  estudados e rede de colaborações internacionais.
                </p>
              </div>
              <div className="feature-card">
                <h4>🏛️ Museu Educacional</h4>
                <p>
                  Aprenda sobre o gene CDHR1 e como as distrofias retinianas
                  afetam a visão ao longo do tempo com modelo matemático.
                </p>
              </div>
              <div className="feature-card">
                <h4>🔬 Simulador de Visão</h4>
                <p>
                  Visualize como a progressão da doença afeta a percepção
                  visual usando o modelo exponencial de degradação retiniana.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </section>
  )
}
