import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

const ERC_BASELINE = 1.0
const DECAY_RATE = 0.035

const STAGES = [
  { year: 0, text: 'Visão Normal', opacity: 0 },
  { year: 5, text: 'Sintomas Noturnos', opacity: 0.2 },
  { year: 10, text: 'Redução Periférica', opacity: 0.5 },
  { year: 15, text: 'Perda Significativa', opacity: 0.8 },
  { year: 20, text: 'Visão Tubular', opacity: 0.95 },
] as const

function calcStats(year: number) {
  const erc = ERC_BASELINE * Math.exp(-DECAY_RATE * year)
  const ercPercent = Math.round(erc * 100)
  const degradation = Math.round((1 - erc) * 100)
  const fieldRemaining = Math.max(0, Math.round((1 - degradation / 100) * 100))
  return { ercPercent, degradation, fieldRemaining }
}

type Stage = (typeof STAGES)[number]

function getStage(year: number): Stage {
  let current: Stage = STAGES[0]
  for (const stage of STAGES) {
    if (year >= stage.year) current = stage
  }
  return current
}

function getStageOpacity(year: number, degradation: number): number {
  const stage = getStage(year)
  return Math.min(stage.opacity + (degradation / 100) * 0.2, 1)
}

function getStageText(year: number): string {
  return getStage(year).text
}

export default function Simulator() {
  const [year, setYear] = useState(0)
  const liveRef = useRef<HTMLDivElement>(null)

  const { ercPercent, degradation, fieldRemaining } = calcStats(year)
  const stageOpacity = getStageOpacity(year, degradation)
  const stageText = getStageText(year)
  const previewOpacity = 1 - stageOpacity * 0.7

  useEffect(() => {
    if (liveRef.current) {
      liveRef.current.textContent = `Ano ${year}: Espessura retiniana ${ercPercent}%, Degradação ${degradation}%, Campo visual ${fieldRemaining}%`
    }
  }, [year, ercPercent, degradation, fieldRemaining])

  return (
    <div className="content-page">
      <div className="container">
        <h2>🔬 Simulador de Visão</h2>
        <p className="subtitle">
          Visualize a progressão da distrofia retiniana ao longo do tempo
        </p>

        <div className="simulator-container">
          <div className="slider-group">
            <label htmlFor="yearSlider">
              Progresso temporal (Anos): <strong>{year}</strong>
            </label>
            <input
              id="yearSlider"
              type="range"
              min={0}
              max={20}
              step={1}
              value={year}
              onChange={e => setYear(Number(e.target.value))}
              aria-label="Deslize para ajustar os anos de progressão"
            />
            <div className="year-display">Ano {year}</div>
          </div>

          <div
            className="vision-preview"
            role="img"
            aria-label={`Visualização da visão: ${stageText}`}
            style={{ opacity: previewOpacity }}
          >
            <span>{stageText}</span>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-label">Espessura Retiniana (ERC)</div>
              <div className="stat-value">{ercPercent}%</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Taxa de Degradação</div>
              <div className="stat-value">{degradation}%</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Campo Visual Restante</div>
              <div className="stat-value">{fieldRemaining}%</div>
            </div>
          </div>

          <div ref={liveRef} aria-live="polite" aria-atomic="true" className="sr-only" />
        </div>

        <section className="museum-section">
          <h3>Como Funciona o Simulador</h3>
          <p>
            Este simulador utiliza o modelo matemático de degradação exponencial{' '}
            <code>ERC(t) = ERC₀ · e^(−r_G · t)</code> para mostrar como a
            espessura da retina diminui ao longo do tempo.
          </p>
          <ul>
            <li>
              <strong>Ano 0–5:</strong> Visão praticamente normal, com início de
              sintomas noturnos
            </li>
            <li>
              <strong>Ano 5–10:</strong> Redução gradual do campo visual periférico
            </li>
            <li>
              <strong>Ano 10–15:</strong> Perda significativa de visão periférica
            </li>
            <li>
              <strong>Ano 15–20:</strong> Possível visão tubular ou cegueira legal
            </li>
          </ul>
        </section>

        <div className="navigation-buttons">
          <Link to="/museum" className="btn btn-secondary">
            ← Voltar para Museu
          </Link>
          <Link to="/search" className="btn btn-primary">
            Buscar Pesquisas →
          </Link>
        </div>
      </div>
    </div>
  )
}
