/**
 * Vision Simulator — CDHR1 Retinal Dystrophy
 *
 * Model: ERC(t) = ERC_baseline × e^(−r_G × t)
 *
 * Where:
 *  - ERC(t)       = Electro-Retinogram Contrast sensitivity at year t
 *  - ERC_baseline = Baseline sensitivity (default: 1.0)
 *  - r_G          = Gene-specific decay rate (default: 0.035/year for CDHR1)
 *  - t            = Time in years
 *
 * Alt-text: Generated programmatically from the computed values.
 */

export interface SimulatorInput {
  ercBaseline?: number; // default 1.0
  decayRate?: number;   // default 0.035 (3.5%/year for CDHR1)
  years?: number;       // projection horizon (default 20)
}

export interface SimulatorPoint {
  year: number;
  erc: number;
  percentRetained: number;
  visualImpairmentLevel: VisualImpairmentLevel;
  altText: string;
}

export type VisualImpairmentLevel =
  | "normal"
  | "mild"
  | "moderate"
  | "severe"
  | "profound";

function classifyImpairment(percentRetained: number): VisualImpairmentLevel {
  if (percentRetained >= 85) return "normal";
  if (percentRetained >= 70) return "mild";
  if (percentRetained >= 50) return "moderate";
  if (percentRetained >= 30) return "severe";
  return "profound";
}

const impairmentDescriptions: Record<VisualImpairmentLevel, string> = {
  normal: "Visão dentro dos parâmetros normais para CDHR1.",
  mild: "Redução leve na sensibilidade ao contraste. Adapta-se facilmente em ambientes bem iluminados.",
  moderate: "Redução moderada. Pode requerer iluminação adicional e evitar ambientes com alto contraste.",
  severe: "Redução severa. Leitura e reconhecimento de rostos afetados. Mobilidade assistida recomendada.",
  profound: "Redução profunda. Visão funcional altamente comprometida. Suporte de tecnologia assistiva essencial.",
};

/**
 * Compute ERC projections for years 0..horizon.
 */
export function simulateVision(input: SimulatorInput = {}): SimulatorPoint[] {
  const baseline = input.ercBaseline ?? 1.0;
  const rG = input.decayRate ?? 0.035;
  const horizon = input.years ?? 20;

  const points: SimulatorPoint[] = [];

  for (let t = 0; t <= horizon; t++) {
    const erc = baseline * Math.exp(-rG * t);
    const percentRetained = (erc / baseline) * 100;
    const level = classifyImpairment(percentRetained);

    points.push({
      year: t,
      erc: parseFloat(erc.toFixed(4)),
      percentRetained: parseFloat(percentRetained.toFixed(1)),
      visualImpairmentLevel: level,
      altText: generateAltText(t, erc, percentRetained, level),
    });
  }

  return points;
}

function generateAltText(
  year: number,
  erc: number,
  percentRetained: number,
  level: VisualImpairmentLevel
): string {
  const yr = year === 0 ? "Basal (ano 0)" : `Ano ${year}`;
  return (
    `${yr}: ERC = ${erc.toFixed(3)}, ` +
    `${percentRetained.toFixed(1)}% da sensibilidade original retida. ` +
    `Nível: ${level}. ` +
    impairmentDescriptions[level]
  );
}

/**
 * Generate a summary for screen readers.
 */
export function generateSimulationSummary(points: SimulatorPoint[]): string {
  const last = points[points.length - 1];
  const criticalYear = points.find((p) => p.visualImpairmentLevel === "severe")?.year;

  let summary = `Simulação CDHR1 de ${last.year} anos. `;
  summary += `Ao final do período, ${last.percentRetained}% da sensibilidade ao contraste é retida. `;
  if (criticalYear !== undefined) {
    summary += `Transição para nível severo estimada no ano ${criticalYear}. `;
  }
  summary += "Consulte seu oftalmologista para avaliação individualizada.";
  return summary;
}
