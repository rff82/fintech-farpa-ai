"use client";

import { useEffect, useState } from "react";

export function HighContrastToggle() {
  const [isHC, setIsHC] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    if (stored === "high-contrast") {
      document.documentElement.setAttribute("data-theme", "high-contrast");
      setIsHC(true);
    }
  }, []);

  const toggle = () => {
    const next = !isHC;
    setIsHC(next);
    if (next) {
      document.documentElement.setAttribute("data-theme", "high-contrast");
      localStorage.setItem("theme", "high-contrast");
    } else {
      document.documentElement.removeAttribute("data-theme");
      localStorage.setItem("theme", "default");
    }
  };

  return (
    <button
      onClick={toggle}
      aria-pressed={isHC}
      aria-label={isHC ? "Desativar alto contraste" : "Ativar alto contraste"}
      className="flex items-center gap-2 rounded px-3 py-1.5 text-sm font-semibold border-2 transition-colors"
      style={{
        borderColor: "var(--color-border)",
        color: "var(--color-text)",
        background: "var(--color-surface)",
      }}
    >
      <span aria-hidden="true">{isHC ? "◐" : "◑"}</span>
      {isHC ? "Alto Contraste: ON" : "Alto Contraste: OFF"}
    </button>
  );
}
