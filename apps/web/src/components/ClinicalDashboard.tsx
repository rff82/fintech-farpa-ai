"use client";

import { Suspense, useState } from "react";
import { DashboardSkeleton } from "./Skeleton";
import { LiveRegion } from "./LiveRegion";
import { XAITooltip } from "./XAITooltip";

interface MetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
  trend?: "stable" | "improving" | "declining";
  xaiNote?: string;
}

function MetricCard({ label, value, unit, trend, xaiNote }: MetricCardProps) {
  const trendColor = {
    stable: "var(--color-primary)",
    improving: "var(--color-success)",
    declining: "var(--color-danger)",
  }[trend ?? "stable"];

  const trendLabel = {
    stable: "Estável",
    improving: "Melhorando",
    declining: "Atenção necessária",
  }[trend ?? "stable"];

  return (
    <article
      className="rounded-xl p-5 space-y-2"
      style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}
      aria-label={`${label}: ${value}${unit ? " " + unit : ""}`}
    >
      <header className="flex items-center justify-between">
        <h3 className="text-sm font-medium" style={{ color: "var(--color-muted)" }}>
          {label}
        </h3>
        {xaiNote && <XAITooltip note={xaiNote} />}
      </header>
      <p className="text-3xl font-bold tabular-nums" style={{ color: "var(--color-text)" }}>
        {value}
        {unit && <span className="text-base font-normal ml-1" style={{ color: "var(--color-muted)" }}>{unit}</span>}
      </p>
      {trend && (
        <p className="text-xs font-semibold" style={{ color: trendColor }}>
          <span aria-hidden="true">● </span>
          <span>{trendLabel}</span>
        </p>
      )}
    </article>
  );
}

export function ClinicalDashboard() {
  const [announcement, setAnnouncement] = useState("");

  const handleSync = () => {
    setAnnouncement("Sincronizando dados de saúde…");
    setTimeout(() => setAnnouncement("Sincronização concluída com sucesso."), 2000);
  };

  return (
    <section aria-labelledby="dashboard-title" className="space-y-6 p-6">
      <LiveRegion message={announcement} />

      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 id="dashboard-title" className="text-2xl font-bold" style={{ color: "var(--color-text)" }}>
            Painel Clínico
          </h2>
          <p className="text-sm mt-1" style={{ color: "var(--color-muted)" }}>
            Seus dados de saúde, analisados com cuidado e respeito.
          </p>
        </div>
        <button
          onClick={handleSync}
          className="rounded-lg px-4 py-2 text-sm font-semibold transition-colors"
          style={{ background: "var(--color-primary)", color: "#fff" }}
          aria-label="Sincronizar dados de saúde agora"
        >
          Sincronizar
        </button>
      </header>

      <Suspense fallback={<DashboardSkeleton />}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3" role="list" aria-label="Métricas clínicas">
          <div role="listitem">
            <MetricCard
              label="Sensibilidade ao Contraste"
              value="0.82"
              unit="ERC"
              trend="stable"
              xaiNote="ERC(t) = ERC_baseline × e^(−r_G × t). Calculado com base na progressão CDHR1."
            />
          </div>
          <div role="listitem">
            <MetricCard
              label="Projeção 5 anos"
              value="0.69"
              unit="ERC"
              trend="declining"
              xaiNote="Projeção aplicando fórmula ERC com decay rate padrão de 0.035/ano."
            />
          </div>
          <div role="listitem">
            <MetricCard
              label="Qualidade do Sono"
              value="7.2"
              unit="h/noite"
              trend="improving"
              xaiNote="Média dos últimos 30 dias extraída do Apple Health XML."
            />
          </div>
        </div>
      </Suspense>

      <div
        className="rounded-xl p-6"
        style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}
        aria-label="Área de simulação visual"
      >
        <h3 className="font-semibold mb-3" style={{ color: "var(--color-text)" }}>
          Simulador de Visão CDHR1
        </h3>
        <p className="text-sm" style={{ color: "var(--color-muted)" }}>
          Acesse o simulador completo para visualizar a progressão estimada da acuidade visual ao longo do tempo.
        </p>
        <a
          href="/simulator"
          className="mt-4 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold"
          style={{ background: "var(--color-primary)", color: "#fff" }}
          aria-label="Abrir simulador de visão CDHR1"
        >
          Abrir Simulador
        </a>
      </div>
    </section>
  );
}
