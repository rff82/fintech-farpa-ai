"use client";

import { useEffect, useState } from "react";

/* ── Phosphene orb descriptors ─────────────────────────────────────────── */
const PHOSPHENES = [
  { id: 1, top: "8%",  left: "6%",  size: 140, o: 0.14, dur: 9,  del: 0,   c: "245,158,11" },
  { id: 2, top: "62%", left: "3%",  size: 90,  o: 0.09, dur: 14, del: 1.5, c: "34,211,238" },
  { id: 3, top: "22%", left: "78%", size: 180, o: 0.11, dur: 11, del: 3,   c: "245,158,11" },
  { id: 4, top: "80%", left: "70%", size: 110, o: 0.10, dur: 16, del: 0.8, c: "34,211,238" },
  { id: 5, top: "44%", left: "42%", size: 230, o: 0.06, dur: 19, del: 2,   c: "245,158,11" },
  { id: 6, top: "17%", left: "52%", size: 65,  o: 0.15, dur: 7,  del: 4,   c: "34,211,238" },
  { id: 7, top: "88%", left: "28%", size: 150, o: 0.08, dur: 13, del: 1,   c: "245,158,11" },
  { id: 8, top: "3%",  left: "38%", size: 100, o: 0.12, dur: 10, del: 3.5, c: "34,211,238" },
  { id: 9, top: "55%", left: "88%", size: 75,  o: 0.10, dur: 8,  del: 2.5, c: "245,158,11" },
  { id: 10,top: "35%", left: "16%", size: 55,  o: 0.13, dur: 12, del: 5,   c: "34,211,238" },
];

/* ERC decay table — computed from model ERC(t) = 0.82 × e^(−0.035 × t) */
const ERC_ROWS = [1, 5, 10, 20].map((t) => ({
  t,
  erc: (0.82 * Math.exp(-0.035 * t)).toFixed(3),
  pct: ((0.82 * Math.exp(-0.035 * t)) / 0.82),
}));

const STATS = [
  { value: "347",      label: "Artigos Indexados",    note: "PubMed + Europe PMC" },
  { value: "0.035/ano",label: "Taxa de Declínio CDHR1",note: "r_G padrão validado" },
  { value: "0%",       label: "PII Armazenada",       note: "Apenas hash SHA-256" },
  { value: "AAA",      label: "Conformidade WCAG",    note: "Acessibilidade 2.2" },
];

const MUSEUM_FEATURES = [
  "Galeria do Simulador de Visão",
  "Feed de Artigos Científicos (RAG)",
  "Modelo Matemático Explicado",
];

const LAB_FEATURES = [
  "Simulador Pessoal com suas fotos",
  "Gêmeo Digital Sintético",
  "Auditoria de Intervenções (IA)",
  "Chat com Meu Corpo",
];

/* ── Inline styles (no Tailwind deps beyond what's certain) ─────────────── */
const S = {
  mono: { fontFamily: "'Space Mono', 'Fira Code', monospace" } as React.CSSProperties,
  display: { fontFamily: "'Cormorant Garamond', 'Cormorant', Georgia, serif" } as React.CSSProperties,
  body: { fontFamily: "'Outfit', 'DM Sans', system-ui, sans-serif" } as React.CSSProperties,
};

function reveal(loaded: boolean, delay = 0): React.CSSProperties {
  return {
    opacity: loaded ? 1 : 0,
    transform: loaded ? "translateY(0)" : "translateY(20px)",
    transition: `opacity 0.75s ease ${delay}s, transform 0.75s ease ${delay}s`,
  };
}

export function LandingPage() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setLoaded(true));
    document.body.setAttribute("data-landing", "dark");
    return () => {
      cancelAnimationFrame(raf);
      document.body.removeAttribute("data-landing");
    };
  }, []);

  return (
    <div
      style={{
        ...S.body,
        background: "#070B14",
        color: "#E8EDFF",
        position: "relative",
        overflowX: "hidden",
      }}
    >

      {/* ────────────────────── HERO ─────────────────────────────── */}
      <section
        aria-labelledby="hero-title"
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          overflow: "hidden",
          padding: "6rem 2rem 5rem",
        }}
      >
        {/* Phosphene field */}
        <div aria-hidden="true" style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          {PHOSPHENES.map((p) => (
            <div
              key={p.id}
              className="lp-phosphene"
              style={{
                position: "absolute",
                top: p.top,
                left: p.left,
                width: p.size,
                height: p.size,
                borderRadius: "50%",
                background: `radial-gradient(circle at 38% 38%, rgba(${p.c},${p.o}) 0%, rgba(${p.c},${p.o * 0.25}) 55%, transparent 72%)`,
                animationDuration: `${p.dur}s`,
                animationDelay: `${p.del}s`,
                filter: `blur(${p.size > 100 ? 3 : 1}px)`,
              }}
            />
          ))}

          {/* Perspective grid */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "linear-gradient(rgba(34,211,238,0.022) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.022) 1px, transparent 1px)",
              backgroundSize: "80px 80px",
            }}
          />

          {/* Radial vignette */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(ellipse 85% 80% at center, transparent 30%, #070B14 90%)",
            }}
          />
        </div>

        {/* Content */}
        <div style={{ position: "relative", zIndex: 1, maxWidth: 780, textAlign: "center" }}>
          <p
            style={{
              ...S.mono,
              ...reveal(loaded, 0.1),
              fontSize: "0.7rem",
              letterSpacing: "0.22em",
              color: "#22D3EE",
              textTransform: "uppercase",
              marginBottom: "1.75rem",
            }}
          >
            Ciência Aberta · Distrofia Retiniana CDHR1
          </p>

          <h1
            id="hero-title"
            style={{
              ...S.display,
              ...reveal(loaded, 0.25),
              fontSize: "clamp(2.8rem, 7.5vw, 5.75rem)",
              fontWeight: 300,
              lineHeight: 1.06,
              letterSpacing: "-0.01em",
              marginBottom: "1.75rem",
              color: "#E8EDFF",
            }}
          >
            Veja o futuro{" "}
            <br />
            <em style={{ color: "#F59E0B", fontStyle: "italic" }}>
              com clareza científica.
            </em>
          </h1>

          <p
            style={{
              ...reveal(loaded, 0.4),
              fontSize: "1.1rem",
              color: "#A0AACC",
              maxWidth: 540,
              margin: "0 auto 2.75rem",
              lineHeight: 1.78,
            }}
          >
            Uma plataforma de Ciência Aberta que modela matematicamente a progressão
            da distrofia retiniana CDHR1 — com privacidade absoluta e
            transparência científica total.
          </p>

          <div
            style={{
              ...reveal(loaded, 0.55),
              display: "flex",
              gap: "1rem",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <a
              href="#museum"
              className="lp-btn-amber"
              style={{
                ...S.body,
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.9rem 1.875rem",
                background: "#F59E0B",
                color: "#070B14",
                borderRadius: "6px",
                fontWeight: 700,
                fontSize: "0.9375rem",
                textDecoration: "none",
              }}
            >
              Entrar no Museu
              <span aria-hidden="true">→</span>
            </a>
            <a
              href="/login"
              className="lp-btn-ghost"
              style={{
                ...S.body,
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.9rem 1.875rem",
                border: "1px solid rgba(34,211,238,0.35)",
                color: "#22D3EE",
                borderRadius: "6px",
                fontWeight: 500,
                fontSize: "0.9375rem",
                textDecoration: "none",
              }}
            >
              Laboratório do Paciente
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            bottom: "2.25rem",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.5rem",
            opacity: loaded ? 0.45 : 0,
            transition: "opacity 1s ease 1.2s",
          }}
        >
          <span
            style={{
              ...S.mono,
              fontSize: "0.6rem",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#8B9CC8",
            }}
          >
            Explorar
          </span>
          <div className="lp-scroll-dot" />
        </div>
      </section>

      {/* ────────────────────── FORMULA ──────────────────────────── */}
      <section
        aria-labelledby="formula-title"
        style={{
          padding: "7rem 2rem",
          borderTop: "1px solid #141E30",
          background: "linear-gradient(180deg, #070B14 0%, #0A1020 100%)",
        }}
      >
        <div style={{ maxWidth: 920, margin: "0 auto" }}>
          <div className="lp-formula-grid">
            {/* Left: explanation */}
            <div>
              <p
                style={{
                  ...S.mono,
                  fontSize: "0.68rem",
                  letterSpacing: "0.2em",
                  color: "#F59E0B",
                  textTransform: "uppercase",
                  marginBottom: "1rem",
                }}
              >
                O Modelo Matemático
              </p>
              <h2
                id="formula-title"
                style={{
                  ...S.display,
                  fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)",
                  fontWeight: 400,
                  lineHeight: 1.2,
                  marginBottom: "1.25rem",
                  color: "#E8EDFF",
                }}
              >
                A progressão da visão,<br />
                expressa com precisão.
              </h2>
              <p
                style={{
                  color: "#A0AACC",
                  lineHeight: 1.78,
                  fontSize: "0.9375rem",
                  marginBottom: "1.75rem",
                }}
              >
                O modelo ERC quantifica como a sensibilidade ao contraste declina ao longo
                do tempo para portadores da mutação CDHR1, usando uma função de decaimento
                exponencial calibrada por dados genéticos.
              </p>
              <dl
                style={{
                  display: "grid",
                  gridTemplateColumns: "auto 1fr",
                  gap: "0.6rem 1.25rem",
                  fontSize: "0.875rem",
                }}
              >
                {([
                  ["ERC(t)", "Sensibilidade ao contraste no tempo t"],
                  ["ERC₀", "Sensibilidade basal inicial (pré-sintomática)"],
                  ["r_G", "Taxa de declínio genética — 0.035/ano para CDHR1"],
                  ["t", "Tempo em anos desde o diagnóstico"],
                ] as const).map(([term, def]) => (
                  <div key={term} style={{ display: "contents" }}>
                    <dt
                      style={{
                        ...S.mono,
                        color: "#22D3EE",
                        whiteSpace: "nowrap",
                        alignSelf: "start",
                      }}
                    >
                      {term}
                    </dt>
                    <dd style={{ color: "#A0AACC", margin: 0, lineHeight: 1.55 }}>{def}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Right: formula card */}
            <div
              style={{
                background: "#0D1525",
                border: "1px solid #1E2D4A",
                borderRadius: "12px",
                padding: "2.75rem 2.25rem",
              }}
            >
              <p
                className="lp-formula-glow"
                style={{
                  ...S.mono,
                  fontSize: "clamp(1rem, 2.5vw, 1.4rem)",
                  color: "#F59E0B",
                  textAlign: "center",
                  lineHeight: 1.7,
                  marginBottom: "2.25rem",
                }}
                aria-label="Fórmula ERC: ERC no tempo t igual a ERC zero vezes e elevado a menos r_G vezes t"
              >
                ERC(t) =<br />
                ERC₀ &times; e
                <sup style={{ fontSize: "0.62em" }}>−r_G &times; t</sup>
              </p>

              <div role="list" aria-label="Progressão do ERC por ano">
                {ERC_ROWS.map(({ t, erc, pct }) => (
                  <div
                    key={t}
                    role="listitem"
                    aria-label={`${t} ano${t > 1 ? "s" : ""}: ERC ${erc}`}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "1rem",
                      marginBottom: "0.8rem",
                      fontSize: "0.8rem",
                    }}
                  >
                    <span
                      style={{
                        ...S.mono,
                        color: "#22D3EE",
                        width: "3.5rem",
                        textAlign: "right",
                        flexShrink: 0,
                      }}
                    >
                      t={t}
                    </span>
                    <div
                      aria-hidden="true"
                      style={{
                        flex: 1,
                        height: "5px",
                        background: "#1E2D4A",
                        borderRadius: "3px",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          width: `${pct * 100}%`,
                          background: "linear-gradient(90deg, #F59E0B, #FCD34D)",
                          borderRadius: "3px",
                        }}
                      />
                    </div>
                    <span
                      style={{
                        ...S.mono,
                        color: "#C0CBDF",
                        width: "3.25rem",
                        flexShrink: 0,
                      }}
                    >
                      {erc}
                    </span>
                  </div>
                ))}
              </div>

              <p
                style={{
                  ...S.mono,
                  marginTop: "1.25rem",
                  fontSize: "0.7rem",
                  color: "#3D5070",
                  textAlign: "center",
                  lineHeight: 1.6,
                }}
              >
                ERC₀ = 0.82 &nbsp;·&nbsp; r_G = 0.035/ano (CDHR1)
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ────────────────────── TWO ZONES ────────────────────────── */}
      <section
        id="museum"
        aria-labelledby="zones-title"
        style={{ padding: "7rem 2rem", borderTop: "1px solid #141E30" }}
      >
        <div style={{ maxWidth: 920, margin: "0 auto" }}>
          <header style={{ textAlign: "center", marginBottom: "4rem" }}>
            <p
              style={{
                ...S.mono,
                fontSize: "0.68rem",
                letterSpacing: "0.2em",
                color: "#22D3EE",
                textTransform: "uppercase",
                marginBottom: "0.75rem",
              }}
            >
              Dois Ambientes
            </p>
            <h2
              id="zones-title"
              style={{
                ...S.display,
                fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)",
                fontWeight: 400,
                color: "#E8EDFF",
              }}
            >
              Para todos — e para você.
            </h2>
          </header>

          <div className="lp-zones-grid">
            {/* Zone 1 — Museum */}
            <article
              aria-labelledby="zone-museum-title"
              style={{
                background: "#0D1525",
                border: "1px solid #1E2D4A",
                borderRadius: "12px",
                padding: "2.5rem",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  top: "-40px",
                  right: "-40px",
                  width: "130px",
                  height: "130px",
                  borderRadius: "50%",
                  background: "radial-gradient(circle, rgba(34,211,238,0.07) 0%, transparent 70%)",
                  pointerEvents: "none",
                }}
              />
              <p
                style={{
                  ...S.mono,
                  fontSize: "0.68rem",
                  letterSpacing: "0.17em",
                  color: "#22D3EE",
                  textTransform: "uppercase",
                  marginBottom: "1rem",
                }}
              >
                Zona 1 · Público · Gratuito
              </p>
              <h3
                id="zone-museum-title"
                style={{
                  ...S.display,
                  fontSize: "1.6rem",
                  fontWeight: 400,
                  color: "#E8EDFF",
                  marginBottom: "0.75rem",
                }}
              >
                Museu Educacional
              </h3>
              <p
                style={{
                  color: "#A0AACC",
                  fontSize: "0.9rem",
                  lineHeight: 1.75,
                  marginBottom: "1.75rem",
                }}
              >
                Acesso livre, sem login. Explore como a CDHR1 afeta a visão ao longo do tempo
                e conheça a ciência por trás da plataforma.
              </p>
              <ul
                role="list"
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: "0 0 2rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.65rem",
                }}
              >
                {MUSEUM_FEATURES.map((f) => (
                  <li
                    key={f}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "0.65rem",
                      fontSize: "0.875rem",
                      color: "#C0CBDF",
                    }}
                  >
                    <span aria-hidden="true" style={{ color: "#22D3EE", flexShrink: 0, marginTop: "0.1rem" }}>
                      ◇
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href="/museum"
                className="lp-btn-ghost-cyan"
                style={{
                  ...S.body,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.75rem 1.25rem",
                  border: "1px solid rgba(34,211,238,0.3)",
                  color: "#22D3EE",
                  borderRadius: "6px",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  textDecoration: "none",
                }}
              >
                Explorar o Museu
                <span aria-hidden="true">→</span>
              </a>
            </article>

            {/* Zone 2 — Laboratory */}
            <article
              aria-labelledby="zone-lab-title"
              style={{
                background: "#0D1525",
                border: "1px solid #2C2A18",
                borderRadius: "12px",
                padding: "2.5rem",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  top: "-40px",
                  right: "-40px",
                  width: "130px",
                  height: "130px",
                  borderRadius: "50%",
                  background: "radial-gradient(circle, rgba(245,158,11,0.09) 0%, transparent 70%)",
                  pointerEvents: "none",
                }}
              />
              <p
                style={{
                  ...S.mono,
                  fontSize: "0.68rem",
                  letterSpacing: "0.17em",
                  color: "#F59E0B",
                  textTransform: "uppercase",
                  marginBottom: "1rem",
                }}
              >
                Zona 2 · Autenticado
              </p>
              <h3
                id="zone-lab-title"
                style={{
                  ...S.display,
                  fontSize: "1.6rem",
                  fontWeight: 400,
                  color: "#E8EDFF",
                  marginBottom: "0.75rem",
                }}
              >
                Laboratório do Paciente
              </h3>
              <p
                style={{
                  color: "#A0AACC",
                  fontSize: "0.9rem",
                  lineHeight: 1.75,
                  marginBottom: "1.75rem",
                }}
              >
                Sua visão. Seus dados. Login com Google, Apple ou Microsoft. Zero PII
                armazenada — apenas um hash SHA-256 anônimo identifica você.
              </p>
              <ul
                role="list"
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: "0 0 2rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.65rem",
                }}
              >
                {LAB_FEATURES.map((f) => (
                  <li
                    key={f}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "0.65rem",
                      fontSize: "0.875rem",
                      color: "#C0CBDF",
                    }}
                  >
                    <span aria-hidden="true" style={{ color: "#F59E0B", flexShrink: 0, marginTop: "0.1rem" }}>
                      ◇
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href="/login"
                className="lp-btn-amber"
                style={{
                  ...S.body,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.75rem 1.25rem",
                  background: "#F59E0B",
                  color: "#070B14",
                  borderRadius: "6px",
                  fontSize: "0.875rem",
                  fontWeight: 700,
                  textDecoration: "none",
                }}
              >
                Acessar o Laboratório
                <span aria-hidden="true">→</span>
              </a>
            </article>
          </div>
        </div>
      </section>

      {/* ────────────────────── STATS / OPEN SCIENCE ─────────────── */}
      <section
        aria-labelledby="stats-title"
        style={{
          padding: "7rem 2rem",
          borderTop: "1px solid #141E30",
          background: "linear-gradient(180deg, #0A1020 0%, #070B14 100%)",
        }}
      >
        <div style={{ maxWidth: 920, margin: "0 auto", textAlign: "center" }}>
          <p
            style={{
              ...S.mono,
              fontSize: "0.68rem",
              letterSpacing: "0.2em",
              color: "#F59E0B",
              textTransform: "uppercase",
              marginBottom: "0.75rem",
            }}
          >
            Ciência Aberta
          </p>
          <h2
            id="stats-title"
            style={{
              ...S.display,
              fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)",
              fontWeight: 400,
              color: "#E8EDFF",
              marginBottom: "1rem",
            }}
          >
            Transparência em cada decisão.
          </h2>
          <p
            style={{
              color: "#A0AACC",
              maxWidth: 520,
              margin: "0 auto 4rem",
              lineHeight: 1.78,
              fontSize: "0.9375rem",
            }}
          >
            Todos os modelos, algoritmos e fontes são auditáveis. Cada insight de IA
            expõe a memória de cálculo e o link do estudo PubMed que o fundamenta.
          </p>

          <dl
            role="list"
            aria-label="Métricas da plataforma"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
              gap: "1.5rem",
              textAlign: "left",
            }}
          >
            {STATS.map(({ value, label, note }) => (
              <div
                key={label}
                role="listitem"
                style={{
                  padding: "1.75rem",
                  background: "#0D1525",
                  border: "1px solid #1E2D4A",
                  borderRadius: "8px",
                }}
              >
                <dt
                  style={{
                    ...S.mono,
                    fontSize: "1.75rem",
                    fontWeight: 500,
                    color: "#F59E0B",
                    lineHeight: 1,
                    marginBottom: "0.6rem",
                  }}
                >
                  {value}
                </dt>
                <dd style={{ margin: 0 }}>
                  <p
                    style={{
                      fontSize: "0.875rem",
                      color: "#E8EDFF",
                      fontWeight: 500,
                      marginBottom: "0.25rem",
                      lineHeight: 1.4,
                    }}
                  >
                    {label}
                  </p>
                  <p style={{ fontSize: "0.75rem", color: "#4A5C78", lineHeight: 1.4 }}>{note}</p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ────────────────────── FINAL CTA ────────────────────────── */}
      <section
        aria-labelledby="cta-title"
        style={{
          padding: "9rem 2rem",
          borderTop: "1px solid #141E30",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "700px",
            height: "700px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(245,158,11,0.045) 0%, transparent 60%)",
            pointerEvents: "none",
          }}
        />
        <div style={{ position: "relative", zIndex: 1 }}>
          <h2
            id="cta-title"
            style={{
              ...S.display,
              fontSize: "clamp(2.25rem, 6vw, 4.25rem)",
              fontWeight: 300,
              color: "#E8EDFF",
              lineHeight: 1.08,
              marginBottom: "1.25rem",
            }}
          >
            Comece a explorar.
            <br />
            <em style={{ color: "#F59E0B" }}>Hoje.</em>
          </h2>
          <p
            style={{
              color: "#A0AACC",
              maxWidth: 420,
              margin: "0 auto 2.75rem",
              lineHeight: 1.75,
              fontSize: "0.9375rem",
            }}
          >
            O Museu Educacional está sempre aberto. Sem cadastro, sem custo, sem rastreamento.
          </p>
          <div
            style={{
              display: "flex",
              gap: "1rem",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <a
              href="/museum"
              className="lp-btn-amber"
              style={{
                ...S.body,
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "1rem 2rem",
                background: "#F59E0B",
                color: "#070B14",
                borderRadius: "6px",
                fontWeight: 700,
                fontSize: "1rem",
                textDecoration: "none",
              }}
            >
              Entrar no Museu
            </a>
            <a
              href="/login"
              style={{
                ...S.body,
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "1rem 2rem",
                border: "1px solid #2A3A50",
                color: "#8B9CC8",
                borderRadius: "6px",
                fontWeight: 400,
                fontSize: "1rem",
                textDecoration: "none",
              }}
            >
              Criar conta gratuita
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
