import type { Metadata } from "next";
import "./globals.css";
import { SkipLink } from "@/components/SkipLink";
import { HighContrastToggle } from "@/components/HighContrastToggle";

export const metadata: Metadata = {
  title: "HealthTech CDHR1 | health.farpa.ai",
  description: "Plataforma de saúde personalizada para distrofia retiniana CDHR1.",
  metadataBase: new URL("https://health.farpa.ai"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        {/* WCAG 2.2 AAA — Skip Link */}
        <SkipLink />

        {/* Top navigation bar */}
        <header role="banner" className="flex items-center justify-between px-6 py-3" style={{ borderBottom: "1px solid var(--color-border)", background: "var(--color-surface)" }}>
          <a href="/" className="text-base font-bold" style={{ color: "var(--color-text)" }} aria-label="HealthTech CDHR1 — página inicial">
            HealthTech CDHR1
          </a>
          <nav aria-label="Navegação principal">
            <ul className="flex items-center gap-4 text-sm font-medium" style={{ listStyle: "none", margin: 0, padding: 0 }}>
              <li><a href="/simulator" style={{ color: "var(--color-text)" }}>Simulador</a></li>
              <li><a href="/admin" style={{ color: "var(--color-text)" }}>Admin</a></li>
            </ul>
          </nav>
          <HighContrastToggle />
        </header>

        {/* Main content */}
        {children}

        {/* Footer */}
        <footer role="contentinfo" className="px-6 py-4 text-xs text-center" style={{ color: "var(--color-muted)", borderTop: "1px solid var(--color-border)" }}>
          <p>
            health.farpa.ai — Plataforma informacional. Não substitui aconselhamento médico.{" "}
            <a href="/disclaimer" style={{ color: "var(--color-primary)" }}>
              Isenção Médica
            </a>
          </p>
        </footer>
      </body>
    </html>
  );
}
