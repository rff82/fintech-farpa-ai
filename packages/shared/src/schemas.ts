import { z } from "zod";

// ─── Auth / Session ───────────────────────────────────────────────────────────
export const AnonymousSessionSchema = z.object({
  anonymousId: z.string().regex(/^[a-f0-9]{64}$/, "Must be a SHA-256 hex digest"),
});

export const ComplianceRecordSchema = z.object({
  anonymousId: z.string().regex(/^[a-f0-9]{64}$/),
  disclaimerAcceptedAt: z.string().datetime(),
  locale: z.enum(["en", "pt"]),
});

// ─── Vision Simulator ─────────────────────────────────────────────────────────
export const SimulatorInputSchema = z.object({
  ercBaseline: z.number().positive().max(10).default(1.0),
  decayRate: z.number().positive().max(1).default(0.035),
  years: z.number().int().min(1).max(50).default(20),
});

// ─── Apple Health ETL ─────────────────────────────────────────────────────────
export const HealthRecordSchema = z.object({
  type: z.string().min(1).max(256),
  value: z.string().max(64),
  unit: z.string().max(32),
  startDate: z.string().datetime({ offset: true }),
  endDate: z.string().datetime({ offset: true }),
  sourceName: z.string().max(128),
});

// ─── RAG Article ──────────────────────────────────────────────────────────────
export const RAGArticleSchema = z.object({
  pmid: z.string().regex(/^\d{1,10}$/),
  title: z.string().min(1).max(1000),
  abstract: z.string().max(10000),
  authors: z.array(z.string().max(100)).max(50),
  publishedDate: z.string().max(10),
  doi: z.string().max(100).optional(),
});

// ─── FHIR Observation input ───────────────────────────────────────────────────
export const FHIRExportRequestSchema = z.object({
  anonymousId: z.string().regex(/^[a-f0-9]{64}$/),
  yearsToExport: z.number().int().min(1).max(50).default(20),
});

// ─── Prompt sanitization ──────────────────────────────────────────────────────
const INJECTION_PATTERNS = [
  /ignore previous instructions/i,
  /system prompt/i,
  /\bjailbreak\b/i,
  /<script/i,
  /\bexec\s*\(/i,
  /\bdrop\s+table/i,
  /union\s+select/i,
];

export const SafePromptSchema = z
  .string()
  .min(1)
  .max(2000)
  .refine(
    (val) => !INJECTION_PATTERNS.some((p) => p.test(val)),
    { message: "Prompt contains disallowed content." }
  );

export type AnonymousSession = z.infer<typeof AnonymousSessionSchema>;
export type ComplianceRecord = z.infer<typeof ComplianceRecordSchema>;
export type SimulatorInput = z.infer<typeof SimulatorInputSchema>;
export type HealthRecord = z.infer<typeof HealthRecordSchema>;
export type RAGArticle = z.infer<typeof RAGArticleSchema>;
