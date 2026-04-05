import { Suspense } from "react";
import { DashboardSkeleton } from "@/components/Skeleton";

export const metadata = {
  title: "Admin | HealthTech CDHR1",
};

const TABS = [
  { id: "simulator-audit", label: "Simulator Audit" },
  { id: "rag-explorer", label: "RAG Explorer" },
  { id: "sync-monitor", label: "Sync Monitor" },
  { id: "anomalias", label: "Anomalias" },
];

export default function AdminPage() {
  return (
    <main id="main-content" className="p-6 max-w-6xl mx-auto space-y-6">
      <header>
        <h1 className="text-2xl font-bold" style={{ color: "var(--color-text)" }}>
          Painel Administrativo
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--color-muted)" }}>
          Acesso restrito — somente administradores autorizados.
        </p>
      </header>

      <nav aria-label="Seções de administração">
        <ul className="flex flex-wrap gap-2" role="tablist">
          {TABS.map((tab) => (
            <li key={tab.id} role="presentation">
              <a
                href={`#${tab.id}`}
                role="tab"
                className="px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                style={{
                  background: "var(--color-surface)",
                  color: "var(--color-text)",
                  border: "1px solid var(--color-border)",
                }}
                aria-label={`Ir para ${tab.label}`}
              >
                {tab.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* ── Simulator Audit ─────────────────────────────── */}
      <section id="simulator-audit" aria-labelledby="sim-audit-title" className="space-y-4">
        <h2 id="sim-audit-title" className="text-lg font-semibold" style={{ color: "var(--color-text)" }}>
          Simulator Audit
        </h2>
        <Suspense fallback={<DashboardSkeleton />}>
          <AuditTable />
        </Suspense>
      </section>

      {/* ── RAG Explorer ────────────────────────────────── */}
      <section id="rag-explorer" aria-labelledby="rag-title" className="space-y-4">
        <h2 id="rag-title" className="text-lg font-semibold" style={{ color: "var(--color-text)" }}>
          RAG Explorer — CDHR1
        </h2>
        <div
          className="rounded-xl p-5"
          style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}
        >
          <p className="text-sm" style={{ color: "var(--color-muted)" }}>
            Artigos indexados do PubMed sobre CDHR1. Última sincronização disponível no Sync Monitor.
          </p>
          <div className="mt-3 grid gap-3">
            {MOCK_ARTICLES.map((a) => (
              <article
                key={a.pmid}
                className="rounded-lg p-4"
                style={{ background: "var(--color-bg)", border: "1px solid var(--color-border)" }}
              >
                <h3 className="text-sm font-semibold" style={{ color: "var(--color-text)" }}>
                  {a.title}
                </h3>
                <p className="text-xs mt-1" style={{ color: "var(--color-muted)" }}>
                  PMID: {a.pmid} · {a.date}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Sync Monitor ────────────────────────────────── */}
      <section id="sync-monitor" aria-labelledby="sync-title" className="space-y-4">
        <h2 id="sync-title" className="text-lg font-semibold" style={{ color: "var(--color-text)" }}>
          Sync Monitor
        </h2>
        <div
          className="rounded-xl p-5 grid grid-cols-1 gap-4 sm:grid-cols-3"
          style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}
        >
          {MOCK_SYNC.map((s) => (
            <div key={s.name} className="space-y-1">
              <p className="text-xs font-semibold" style={{ color: "var(--color-muted)" }}>{s.name}</p>
              <p className="text-lg font-bold tabular-nums" style={{ color: s.ok ? "var(--color-success)" : "var(--color-danger)" }}>
                {s.value}
              </p>
              <p className="text-xs" style={{ color: "var(--color-muted)" }}>{s.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Anomalias ───────────────────────────────────── */}
      <section id="anomalias" aria-labelledby="anomalias-title" className="space-y-4">
        <h2 id="anomalias-title" className="text-lg font-semibold" style={{ color: "var(--color-text)" }}>
          Anomalias Clínicas
        </h2>
        <div
          className="rounded-xl p-5"
          style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}
          role="log"
          aria-live="polite"
          aria-label="Log de anomalias clínicas"
        >
          {MOCK_ANOMALIAS.length === 0 ? (
            <p className="text-sm" style={{ color: "var(--color-success)" }}>
              Nenhuma anomalia detectada.
            </p>
          ) : (
            <ul className="space-y-2">
              {MOCK_ANOMALIAS.map((a, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 rounded-lg p-3"
                  style={{ background: "var(--color-bg)", border: "1px solid var(--color-danger)" }}
                >
                  <span aria-hidden="true" style={{ color: "var(--color-danger)" }}>⚠</span>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: "var(--color-text)" }}>{a.title}</p>
                    <p className="text-xs" style={{ color: "var(--color-muted)" }}>{a.detail}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </main>
  );
}

function AuditTable() {
  return (
    <div className="overflow-x-auto rounded-xl" style={{ border: "1px solid var(--color-border)" }}>
      <table className="w-full text-sm">
        <thead>
          <tr style={{ background: "var(--color-surface)" }}>
            <th scope="col" className="px-4 py-3 text-left font-semibold">ID</th>
            <th scope="col" className="px-4 py-3 text-left font-semibold">Usuário (hash)</th>
            <th scope="col" className="px-4 py-3 text-left font-semibold">ERC Baseline</th>
            <th scope="col" className="px-4 py-3 text-left font-semibold">Decay Rate</th>
            <th scope="col" className="px-4 py-3 text-left font-semibold">Executado em</th>
          </tr>
        </thead>
        <tbody>
          {MOCK_AUDIT.map((row) => (
            <tr key={row.id} style={{ borderTop: "1px solid var(--color-border)" }}>
              <td className="px-4 py-2 font-mono text-xs">{row.id}</td>
              <td className="px-4 py-2 font-mono text-xs truncate max-w-[120px]">{row.userHash}</td>
              <td className="px-4 py-2 tabular-nums">{row.baseline}</td>
              <td className="px-4 py-2 tabular-nums">{row.decayRate}</td>
              <td className="px-4 py-2 text-xs">{row.ts}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Mock data (replace with D1 queries in production) ────────────────────────
const MOCK_AUDIT = [
  { id: "sim_001", userHash: "a3f4b5c6d7e8f9a0", baseline: "1.000", decayRate: "0.035", ts: "2026-04-01 10:32" },
  { id: "sim_002", userHash: "b1c2d3e4f5a6b7c8", baseline: "0.920", decayRate: "0.035", ts: "2026-04-02 14:11" },
];

const MOCK_ARTICLES = [
  { pmid: "38901234", title: "CDHR1 variants in autosomal recessive retinal dystrophy", date: "2025" },
  { pmid: "38712345", title: "Photoreceptor degeneration mechanisms in CDHR1 mutations", date: "2024" },
];

const MOCK_SYNC = [
  { name: "Última Sync RAG", value: "2026-04-01", ok: true, description: "PubMed CDHR1 atualizado" },
  { name: "Artigos Indexados", value: "42", ok: true, description: "Artigos no D1" },
  { name: "Status Binding D1", value: "OK", ok: true, description: "health-db respondendo" },
];

const MOCK_ANOMALIAS: Array<{ title: string; detail: string }> = [];
