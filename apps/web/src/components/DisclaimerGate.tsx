"use client";

import { useState } from "react";
import { LiveRegion } from "./LiveRegion";

interface DisclaimerGateProps {
  onAccept: () => void;
  locale?: "en" | "pt";
}

const copy = {
  en: {
    title: "Medical Disclaimer",
    body: "This platform provides informational health insights and is NOT a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider.",
    label: "I understand — this is not medical advice",
    cta: "Continue",
    required: "You must accept to continue.",
  },
  pt: {
    title: "Isenção de Responsabilidade Médica",
    body: "Esta plataforma fornece informações de saúde e NÃO substitui aconselhamento médico profissional, diagnóstico ou tratamento. Consulte sempre seu médico ou profissional de saúde qualificado.",
    label: "Entendo — isto não é aconselhamento médico",
    cta: "Continuar",
    required: "Você deve aceitar para continuar.",
  },
};

export function DisclaimerGate({ onAccept, locale = "pt" }: DisclaimerGateProps) {
  const t = copy[locale];
  const [checked, setChecked] = useState(false);
  const [error, setError] = useState("");
  const checkboxId = "disclaimer-checkbox";
  const errorId = "disclaimer-error";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checked) {
      setError(t.required);
      return;
    }
    setError("");
    onAccept();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="disclaimer-title"
      aria-describedby="disclaimer-body"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.7)" }}
    >
      <LiveRegion message={error} politeness="assertive" />

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg rounded-2xl p-8 space-y-6 shadow-2xl"
        style={{ background: "var(--color-bg)", border: "2px solid var(--color-border)" }}
        noValidate
      >
        <h2 id="disclaimer-title" className="text-xl font-bold" style={{ color: "var(--color-text)" }}>
          {t.title}
        </h2>

        <p id="disclaimer-body" className="text-sm leading-relaxed" style={{ color: "var(--color-muted)" }}>
          {t.body}
        </p>

        <div className="flex items-start gap-3">
          <input
            id={checkboxId}
            type="checkbox"
            checked={checked}
            onChange={(e) => {
              setChecked(e.target.checked);
              if (e.target.checked) setError("");
            }}
            aria-required="true"
            aria-describedby={error ? errorId : undefined}
            className="mt-0.5 h-5 w-5 rounded"
            style={{ accentColor: "var(--color-primary)" }}
          />
          <label htmlFor={checkboxId} className="text-sm font-medium cursor-pointer" style={{ color: "var(--color-text)" }}>
            {t.label}
          </label>
        </div>

        {error && (
          <p id={errorId} role="alert" className="text-sm font-semibold" style={{ color: "var(--color-danger)" }}>
            {error}
          </p>
        )}

        <button
          type="submit"
          className="w-full rounded-lg py-3 font-semibold text-sm transition-colors"
          style={{ background: "var(--color-primary)", color: "#fff" }}
        >
          {t.cta}
        </button>
      </form>
    </div>
  );
}
