import { Link } from 'react-router-dom'

export default function Museum() {
  return (
    <div className="content-page">
      <div className="container">
        <h2>🏛️ Museu Educacional</h2>
        <p className="subtitle">Compreenda o gene CDHR1 e as distrofias retinianas</p>

        <section className="museum-section">
          <h3>O que é CDHR1?</h3>
          <p>
            O gene CDHR1 (Cadherin Related 1) codifica uma proteína crucial para a
            manutenção da estrutura e função da retina. Mutações neste gene podem
            levar a distrofias retinianas hereditárias, afetando principalmente os
            cones e bastonetes responsáveis pela visão.
          </p>
          <ul style={{ marginTop: '1rem', paddingLeft: '1.5rem' }}>
            <li><strong>Localização cromossômica:</strong> 10q24.31</li>
            <li><strong>Proteína:</strong> Protocadherina 21 (PCDH21)</li>
            <li><strong>Função:</strong> Manutenção de discos dos fotorreceptores</li>
            <li><strong>Herança:</strong> Autossômica recessiva</li>
          </ul>
        </section>

        <section className="museum-section">
          <h3>Progressão da Doença</h3>
          <p>
            A atrofia retiniana externa (ERC) segue um modelo exponencial de
            degradação. A fórmula matemática que descreve esse processo é:
          </p>
          <div className="formula-box">
            <code>ERC(t) = ERC₀ · e^(−r_G · t)</code>
          </div>
          <p>Onde:</p>
          <ul>
            <li>
              <strong>ERC(t)</strong> = Espessura da retina no tempo t
            </li>
            <li>
              <strong>ERC₀</strong> = Espessura inicial (baseline = 1.0)
            </li>
            <li>
              <strong>r_G</strong> = Taxa de degradação por ano (≈ 0.035)
            </li>
            <li>
              <strong>t</strong> = Tempo em anos
            </li>
          </ul>
        </section>

        <section className="museum-section">
          <h3>Sintomas e Manifestações</h3>
          <div className="symptom-grid">
            <div className="symptom-card">
              <h4>Fase Inicial (0–5 anos)</h4>
              <p>Dificuldade em visão noturna, fotopsia (flashes de luz)</p>
            </div>
            <div className="symptom-card">
              <h4>Fase Intermediária (5–10 anos)</h4>
              <p>Redução do campo visual, dificuldade em atividades diárias</p>
            </div>
            <div className="symptom-card">
              <h4>Fase Avançada (10–20 anos)</h4>
              <p>Perda significativa de visão, possível cegueira legal</p>
            </div>
          </div>
        </section>

        <section className="museum-section">
          <h3>Pesquisa Atual</h3>
          <p>
            A comunidade científica está investigando várias abordagens terapêuticas,
            incluindo:
          </p>
          <ul>
            <li>Terapia gênica para restaurar a função do gene CDHR1</li>
            <li>Suplementação com antioxidantes para retardar a progressão</li>
            <li>Uso de células-tronco para regeneração retiniana</li>
            <li>Dispositivos de amplificação visual e reabilitação</li>
          </ul>
        </section>

        <div className="navigation-buttons">
          <Link to="/simulator" className="btn btn-primary">
            Ir para Simulador →
          </Link>
          <Link to="/search" className="btn btn-secondary">
            Buscar Pesquisas →
          </Link>
        </div>
      </div>
    </div>
  )
}
