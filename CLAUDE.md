# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

**HealthTech CDHR1** — A health AI platform focused on CDHR1 retinal dystrophy. It simulates vision progression using an exponential decay model (`ERC(t) = ERC_baseline × e^(−r_G × t)`), ingests Apple Health data, and maintains a RAG knowledge base from PubMed. Privacy is a core constraint: PII is never stored — users are identified only by SHA-256 hashes.

## Monorepo structure

This is a Turborepo monorepo (npm workspaces, Node ≥ 22, npm 11):

- `apps/web` — Next.js 15 frontend, deployed to **Cloudflare Pages** (static export mode)
- `apps/local-etl` — CLI tool (`health-etl`) for Apple Health XML parsing and OCR; never deployed
- `packages/shared` — Zod schemas and shared types consumed by both apps

Packages are referenced as `@health/web`, `@health/local-etl`, `@health/shared`.

## Commands

### Root (all workspaces via Turbo)
```bash
npm run dev          # start all dev servers
npm run build        # build all packages + apps
npm run lint         # lint all
npm run typecheck    # type-check all
npm run clean        # clean all dist/build outputs
npm run security-check     # npm audit + custom checks (run before deploy)
npm run validate-bindings  # verify Cloudflare bindings
```

### Web app (`apps/web`)
```bash
cd apps/web
npm run dev          # Next.js dev server
npm run build        # static export → .next/
npm run preview      # wrangler pages dev .next (local CF Pages preview)
npm run deploy       # wrangler pages deploy .next
npm run typecheck    # tsc --noEmit
```

### Local ETL (`apps/local-etl`)
```bash
cd apps/local-etl
npm run dev          # tsx watch src/index.ts
npm run build        # tsc → dist/
# After build:
node dist/index.js etl --input=export.xml [--output=records.jsonl]
node dist/index.js ocr --image=exam.png   [--lang=por+eng]
```

## Architecture

### Cloudflare bindings (`apps/web/wrangler.toml`)
The web app declares four Cloudflare bindings (activated when switching from static export to `@opennextjs/cloudflare`):
- `DB` — D1 database (`health-db`) for health records and RAG article metadata
- `VECTOR_STORE` — Vectorize index (`health-vector-store`) for RAG embeddings
- `ASSETS` — R2 bucket (`health-assets`) for file storage
- `KV` — KV namespace for sync timestamps and counters

### RAG cron worker (`apps/web/src/workers/rag-cron.ts`)
A Cloudflare scheduled worker that runs on `0 3 1,15 * *` (1st and 15th of each month at 03:00 UTC). It queries PubMed for CDHR1-related articles across three search terms, upserts metadata into D1, and logs sync state to KV. Respects PubMed rate limits (350 ms delay without API key, 110 ms with).

### Shared schemas (`packages/shared/src/schemas.ts`)
All data shapes are defined as Zod schemas here and exported as TypeScript types. This is the single source of truth for: `AnonymousSession`, `ComplianceRecord`, `SimulatorInput`, `HealthRecord`, `RAGArticle`, `FHIRExportRequest`, and `SafePrompt` (which includes prompt injection detection).

### Privacy model
- `apps/web/src/lib/auth.ts`: `anonymizeId()` hashes `provider:rawId` with SHA-256 — this is the only identifier stored
- FHIR export (`apps/web/src/lib/fhir.ts`) uses the anonymous hash as patient ID; no PII enters any resource
- `SafePromptSchema` in shared validates prompts against injection patterns before any AI call

### UI conventions
- CSS custom properties for theming (`--color-primary`, `--color-surface`, `--color-text`, `--color-muted`, `--color-border`, `--color-success`, `--color-warning`, `--color-danger`) — do not use hardcoded colors
- Accessibility is a first-class concern: `aria-label`, `aria-live`, `role`, skip links, `LiveRegion` component, screen-reader-only summaries (`sr-only`)
- `XAITooltip` component is used to surface explainable AI notes on metrics showing the formula/source

### i18n
Translations live in `apps/web/src/i18n/en.ts` and `apps/web/src/i18n/pt.ts`. The app supports `en` and `pt` locales (enforced in `ComplianceRecordSchema`).

## Key constraints

- `apps/web` is currently a **static export** (`output: "export"` in `next.config.ts`). API routes and SSR are not available until `@opennextjs/cloudflare` is added and the static export is removed.
- The local-etl app uses `"type": "module"` and imports with `.js` extensions (ESM build output).
- `packages/shared` must be built before the apps that depend on it (`turbo build` handles this via `"dependsOn": ["^build"]`).
- Admin page (`/admin`) currently uses mock data; production wires to D1 queries.
