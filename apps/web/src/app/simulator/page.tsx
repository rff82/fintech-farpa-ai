import { simulateVision, generateSimulationSummary } from "@/lib/vision-simulator";
import { XAITooltip } from "@/components/XAITooltip";

export const metadata = {
  title: "Simulador de Visão CDHR1 | HealthTech CDHR1",
  description: "Projeção da progressão da distrofia retiniana CDHR1 ao longo do tempo.",
};

export default function SimulatorPage() {
  const points = simulateVision({ years: 20 });
  const summary = generateSimulationSummary(points);

  return (
    <main id="main-content" className="p-6 max-w-4xl mx-auto space-y-8">
      <header className="space-y-2">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold" style={{ color: "var(--color-text)" }}>
            Simulador de Visão CDHR1
          </h1>
          <XAITooltip note="ERC(t) = ERC_baseline × e^(−r_G × t). Modelo baseado em estudos de progressão de distrofia retiniana CDHR1 em literatura científica (PubMed)." />
        </div>
        <p className="text-sm" style={{ color: "var(--color-muted)" }}>
          Projeção da sensibilidade ao contraste ao longo do tempo.
        </p>
      </header>

      {/* Screen reader summary */}
      <p className="sr-only">{summary}</p>

      {/* Visual summary card */}
      <div
        className="rounded-xl p-5"
        style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}
        aria-label="Resumo da simulação"
      >
        <p className="text-sm font-medium" style={{ color: "var(--color-muted)" }}>
          {summary}
        </p>
      </div>

      {/* Data table — accessible */}
      <section aria-labelledby="sim-table-title">
        <h2 id="sim-table-title" className="text-lg font-semibold mb-3" style={{ color: "var(--color-text)" }}>
          Dados de Progressão
        </h2>
        <div className="overflow-x-auto rounded-xl" style={{ border: "1px solid var(--color-border)" }}>
          <table className="w-full text-sm" aria-describedby="sim-table-title">
            <thead>
              <tr style={{ background: "var(--color-surface)" }}>
                <th scope="col" className="px-4 py-3 text-left font-semibold">Ano</th>
                <th scope="col" className="px-4 py-3 text-left font-semibold">ERC</th>
                <th scope="col" className="px-4 py-3 text-left font-semibold">% Retida</th>
                <th scope="col" className="px-4 py-3 text-left font-semibold">Nível</th>
              </tr>
            </thead>
            <tbody>
              {points.map((p) => (
                <tr
                  key={p.year}
                  aria-label={p.altText}
                  style={{ borderTop: "1px solid var(--color-border)" }}
                >
                  <td className="px-4 py-2 tabular-nums">{p.year}</td>
                  <td className="px-4 py-2 tabular-nums">{p.erc}</td>
                  <td className="px-4 py-2 tabular-nums">{p.percentRetained}%</td>
                  <td className="px-4 py-2">
                    <span
                      className="inline-block rounded-full px-2 py-0.5 text-xs font-semibold"
                      style={{
                        background:
                          p.visualImpairmentLevel === "normal"
                            ? "var(--color-success)"
                            : p.visualImpairmentLevel === "mild"
                            ? "var(--color-warning)"
                            : "var(--color-danger)",
                        color: "#fff",
                      }}
                    >
                      {p.visualImpairmentLevel}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
