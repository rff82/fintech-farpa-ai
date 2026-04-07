import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <section className="hero">
      <div className="container">
        <div className="hero-content">
          <h2>Inteligência de Mercado em Fintech</h2>
          <p>
            Plataforma de análise financeira especializada em tendências de mercado,
            com foco em ativos digitais e inovação bancária. Dados de bolsas,
            relatórios setoriais e indicadores macroeconômicos em uma interface unificada.
          </p>

          <div className="cta-buttons">
            <Link to="/search" className="btn btn-primary">
              Busca Avançada
            </Link>
            <Link to="/museum" className="btn btn-secondary">
              Museu Financeiro
            </Link>
          </div>

          <section className="features">
            <h3>O que você encontrará aqui</h3>
            <div className="feature-grid">
              <div className="feature-card">
                <h4>🔍 Busca Avançada</h4>
                <p>
                  Pesquise relatórios financeiros com filtros por setor, ativo,
                  tipo de análise, ano e instituição. Dados de mercado em tempo real.
                </p>
              </div>
              <div className="feature-card">
                <h4>📈 Banco de Ativos</h4>
                <p>
                  Catálogo de ativos financeiros com foco em inovação. Performance
                  histórica, volatilidade e correlações de mercado.
                </p>
              </div>
              <div className="feature-card">
                <h4>🚀 Tendências</h4>
                <p>
                  Movimentações ativas no setor de fintech, integradas com as
                  principais fontes de dados financeiros globais.
                </p>
              </div>
              <div className="feature-card">
                <h4>📊 Analytics</h4>
                <p>
                  Tendências de investimentos ao longo do tempo, setores mais
                  promissores e rede de fluxos de capital internacionais.
                </p>
              </div>
              <div className="feature-card">
                <h4>🏛️ Museu Financeiro</h4>
                <p>
                  Aprenda sobre a evolução das fintechs e como as novas tecnologias
                  estão transformando o sistema financeiro global.
                </p>
              </div>
              <div className="feature-card">
                <h4>📉 Simulador de Mercado</h4>
                <p>
                  Visualize como a volatilidade e eventos macroeconômicos afetam
                  seu portfólio usando modelos matemáticos de risco.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </section>
  )
}
