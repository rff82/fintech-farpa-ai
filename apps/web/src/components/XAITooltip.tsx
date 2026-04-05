"use client";

import { useState } from "react";

interface XAITooltipProps {
  note: string;
}

/**
 * XAI (eXplainable AI) tooltip — ícone "i" com memória de cálculo.
 * WCAG 2.2 AAA: keyboard accessible, role="tooltip", aria-describedby.
 */
export function XAITooltip({ note }: XAITooltipProps) {
  const [open, setOpen] = useState(false);
  const id = `xai-${Math.random().toString(36).slice(2, 8)}`;

  return (
    <div className="relative inline-block">
      <button
        type="button"
        aria-label="Explicação do cálculo"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((v) => !v)}
        onBlur={() => setOpen(false)}
        className="w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center border-2 transition-colors"
        style={{
          borderColor: "var(--color-muted)",
          color: "var(--color-muted)",
          background: "transparent",
        }}
      >
        i
      </button>

      {open && (
        <div
          id={id}
          role="tooltip"
          className="absolute right-0 top-7 z-50 w-72 rounded-lg p-3 text-xs shadow-lg"
          style={{
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            color: "var(--color-text)",
          }}
        >
          <p className="font-semibold mb-1" style={{ color: "var(--color-primary)" }}>
            Como foi calculado
          </p>
          <p>{note}</p>
        </div>
      )}
    </div>
  );
}
