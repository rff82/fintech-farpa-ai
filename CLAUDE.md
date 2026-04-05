# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

**HealthTech CDHR1** (`health.farpa.ai`) — A hybrid Open Science and personal telemetry platform focused on retinal dystrophies. It processes private local data and uses the cloud for AI, RAG, and hosting. The platform has two distinct user zones: a public "Educational Museum" (no login, zero AI cost at access time) and a private "Patient Laboratory" (authenticated, generative AI on demand).

The core mathematical model: `ERC(t) = ERC_baseline × e^(−r_G × t)` where ERC is Electro-Retinogram Contrast sensitivity, r_G is the gene-specific decay rate (0.035/year for CDHR1), and t is time in years.

Privacy is a non-negotiable constraint: PII is never stored. Users are identified only by SHA-256 hashes of their OAuth provider ID.

**All Cloudflare resources must use the `health-` prefix.**

---

## Monorepo structure

Turborepo monorepo (npm workspaces, Node ≥ 22, npm 11):

- `apps/web` — Next.js 15 App Router frontend, deployed to **Cloudflare Pages**
- `apps/local-etl` — CLI tool (`health-etl`) for Apple Health XML parsing and OCR; never deployed to cloud
- `packages/shared` — Zod schemas and shared types consumed by both apps

Packages are referenced as `@health/web`, `@health/local-etl`, `@health/shared`.

---

## Commands

### Root (all workspaces via Turbo)
```bash
npm run dev                # start all dev servers
npm run build              # build all packages + apps (shared builds first)
npm run lint               # lint all
npm run typecheck          # type-check all
npm run clean              # clean all dist/build outputs
npm run security-check     # npm audit + custom checks — run before every deploy
npm run validate-bindings  # verify Cloudflare bindings are live
```

### Web app (`apps/web`)
```bash
npm run dev          # Next.js dev server
npm run build        # export → .next/
npm run preview      # wrangler pages dev .next (local Cloudflare Pages preview)
npm run deploy       # wrangler pages deploy .next
npm run typecheck    # tsc --noEmit
```

### Local ETL (`apps/local-etl`)
```bash
npm run dev          # tsx watch src/index.ts
npm run build        # tsc → dist/
node dist/index.js etl --input=export.xml [--output=records.jsonl]
node dist/index.js ocr --image=exam.png   [--lang=por+eng]
```

---

## Product architecture

### Two-zone funnel

**Zone 1 — Educational Museum (public, no login)**
- Landing page: Open Science project presentation + didactic explanation of the CDHR1 mathematical model
- Vision Simulator Gallery: pre-rendered images of common scenes (landscapes, faces) + temporal slider (1–20 years) showing scotoma progression
- Science Feed: read-only timeline of PubMed/Europe PMC papers already captured and summarised by the RAG background job

**Zone 2 — Patient Laboratory (authenticated)**
- Personal Vision Simulator: user uploads a photo of their home/family; AI applies the ERC formula and generates images of how they will see that scene over 20 years
- Synthetic Digital Twin: panel crossing user's real macular atrophy data against the degradation average from medical literature, plotted on the same chart
- Intervention Audit: AI crosses new medical literature against the user's supplementation log, generating alerts about new evidence
- Chat with My Body: natural-language chat where AI answers by crossing the user's blood/OCT exams (stored in D1) against the global medical literature vector store

### Cloudflare bindings (`apps/web/wrangler.toml`)

| Binding | Type | Resource name |
|---|---|---|
| `DB` | D1 | `health-db` |
| `VECTOR_STORE` | Vectorize | `health-vector-store` |
| `ASSETS` | R2 | `health-assets` |
| `KV` | KV Namespace | `health-kv-store` |

These bindings are declared but inactive while `apps/web` is in static export mode (`output: "export"` in `next.config.ts`). To activate SSR and API routes, remove `output: "export"` and add `@opennextjs/cloudflare`.

### RAG cron worker (`apps/web/src/workers/rag-cron.ts`)
Cloudflare scheduled worker: `0 3 1,15 * *` (1st and 15th of each month, 03:00 UTC). Queries PubMed for CDHR1-related articles, upserts metadata to D1, stores embeddings in Vectorize, logs sync state to KV. Respects PubMed rate limits: 350 ms delay without API key, 110 ms with `PUBMED_API_KEY`.

The multi-gene RAG engine also supports real-time user queries for other genes (e.g. ABCA4) — it fetches from public APIs, cross-references results, and returns translated, evidence-backed answers.

### Shared schemas (`packages/shared/src/schemas.ts`)
Single source of truth for all data shapes as Zod schemas. Canonical types: `AnonymousSession`, `ComplianceRecord`, `SimulatorInput`, `HealthRecord`, `RAGArticle`, `FHIRExportRequest`, `SafePrompt`. `SafePromptSchema` includes prompt injection detection patterns and is applied before every AI call.

### Privacy and auth model
- **Auth.js** with Google, Apple, and Microsoft providers
- `anonymizeId()` (`apps/web/src/lib/auth.ts`): hashes `provider:rawId` with SHA-256 — only this hash enters D1, never name or email
- LGPD compliance: "Medical Disclaimer" checkbox required at login; Dynamic Consent opt-in for donating anonymised data to science
- FHIR export (`apps/web/src/lib/fhir.ts`): uses anonymous hash as patient ID

### Admin panel (`/admin`)
Access gated by matching the logged-in hash against the `ADMIN_ID` env var. Four observability pages:
1. **Simulator Audit** — metadata of generated images and injected mathematical variables
2. **RAG Explorer** — search terms, Vectorize scores, source links
3. **Sync Monitor** — ETL ingestion success/error status
4. **Anomalias & Self-Healing** — review queue; biologically absurd data detected by ETL/AI is flagged `PENDING_REVIEW` for manual accept/discard

Currently uses mock data; production wires to D1 queries.

### Local ETL (`apps/local-etl`)
Runs on the user's machine — zero cloud cost. Two commands:
- `etl`: SAX-based differential parser for Apple Health XML export, using `sync_state.json` cursor to read only new records; sends structured JSON via authenticated POST to `/api/sync`
- `ocr`: local Tesseract/Ollama extraction from PDF exams (blood tests, OCT); sends JSON, never raw files

### Interoperability
`/api/export` endpoint: FHIR R4-aligned JSON bundle and clinical PDF. `buildFHIRBundle()` in `apps/web/src/lib/fhir.ts`.

---

## UI and accessibility

**Accessibility is non-negotiable.** Target: WCAG 2.2 AAA. The audience has severe low vision or blindness.

- First focusable element on every page: Skip Link pointing to `#main-content`
- High-contrast toggle (`HighContrastToggle` component): pure black background (`#000000`), yellow text (`#FFFF00`), thick focus rings (`focus-visible:ring-4`)
- All AI output appears inside `<div aria-live="polite">` (`LiveRegion` component)
- Vision Simulator images must have AI-generated descriptive `alt` text explaining the visual distortion — never empty or generic
- Use `DashboardSkeleton` / `Skeleton` components for loading states; Progressive Disclosure via accordions for dense content
- Tone of voice: welcoming, empathetic, non-alarmist

**CSS theming** — always use custom properties, never hardcode colors:
`--color-primary`, `--color-surface`, `--color-text`, `--color-muted`, `--color-border`, `--color-success`, `--color-warning`, `--color-danger`

**Explainable AI (XAI)**: every AI insight must expose an `XAITooltip` with the calculation memory and PubMed source links.

### i18n
`apps/web/src/i18n/en.ts` (default, global) and `apps/web/src/i18n/pt.ts`. Locale enforced in `ComplianceRecordSchema` as `z.enum(["en", "pt"])`. Routes: `/en/*` and `/pt/*`.

---

## Security and DevSecOps

- **Zod on all endpoints** — sanitises against SQL injection on D1, validates all inputs at system boundaries
- **Anti-prompt injection** — `SafePromptSchema` rejects known injection patterns; system prompts are hardened; if no PubMed study exists for a query, the AI must respond "insufficient data", never hallucinate
- **`npm run security-check`** — runs `npm audit --audit-level=high`, checks no `.env` files are committed, validates no real secrets in `.env.example`, checks `wrangler.toml` for hardcoded tokens, scans `src` for sensitive `console.log`
- **GitHub Actions CI/CD** (`.github/workflows/deploy.yml`) — validates Cloudflare binding health before traffic switch; uses `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`, and `GITHUB_TOKEN` from GitHub Secrets
- **`.gitignore`** must exclude: `.env*`, `node_modules`, `.wrangler`, `.next`, `.turbo`, `dist`, `build`, logs

### Required `.env` variables (see `.env.example`)
```
CLOUDFLARE_API_TOKEN=
CLOUDFLARE_ACCOUNT_ID=
GITHUB_TOKEN=
ADMIN_ID=          # SHA-256 hash that unlocks /admin
PUBMED_API_KEY=    # optional — removes PubMed rate limits
# OAuth providers (Auth.js)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
APPLE_CLIENT_ID=
APPLE_CLIENT_SECRET=
MICROSOFT_CLIENT_ID=
MICROSOFT_CLIENT_SECRET=
```

---

## Key constraints

- Static export limitation: `apps/web` is currently `output: "export"`. No API routes or SSR until `@opennextjs/cloudflare` is added.
- `apps/local-etl` uses `"type": "module"` — all imports must use `.js` extensions in compiled output.
- `packages/shared` must build before apps (`turbo build` enforces this via `"dependsOn": ["^build"]`).
- The ETL never sends raw files to the cloud — only structured JSON via authenticated POST.
- Never store PII. The SHA-256 hash is the only user identifier across all tables and exports.
