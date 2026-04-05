import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'
import { sql } from 'drizzle-orm'

// ── Articles ─────────────────────────────────────────────────────────────────
export const articles = sqliteTable('articles', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  pmid: text('pmid').unique(),
  title: text('title').notNull(),
  authors: text('authors'),        // JSON: string[]
  abstract: text('abstract'),
  journal: text('journal'),
  year: integer('year'),
  volume: text('volume'),
  pages: text('pages'),
  doi: text('doi'),
  url: text('url'),
  peerReviewed: integer('peer_reviewed', { mode: 'boolean' }).default(true),
  impactFactor: text('impact_factor'),
  citationCount: integer('citation_count').default(0),
  sourceDatabase: text('source_database'),  // 'pubmed' | 'europe-pmc' | 'other'
  genes: text('genes'),            // JSON: string[] (gene symbols)
  phenotypes: text('phenotypes'),  // JSON: string[]
  therapies: text('therapies'),    // JSON: string[]
  keywords: text('keywords'),      // JSON: string[]
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
})

// ── Genes ─────────────────────────────────────────────────────────────────────
export const genes = sqliteTable('genes', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  symbol: text('symbol').unique().notNull(),
  name: text('name'),
  chromosome: text('chromosome'),
  location: text('location'),
  omimId: text('omim_id'),
  ensemblId: text('ensembl_id'),
  function: text('function'),
  mutationCount: integer('mutation_count').default(0),
  articleCount: integer('article_count').default(0),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
})

// ── Phenotypes ────────────────────────────────────────────────────────────────
export const phenotypes = sqliteTable('phenotypes', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').unique().notNull(),
  description: text('description'),
  omimId: text('omim_id'),
  icd10Code: text('icd10_code'),
  geneIds: text('gene_ids'),       // JSON: number[]
  ageOfOnset: text('age_of_onset'),
  progressionRate: text('progression_rate'),
  articleCount: integer('article_count').default(0),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
})

// ── Clinical Trials ───────────────────────────────────────────────────────────
export const clinicalTrials = sqliteTable('clinical_trials', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  nctId: text('nct_id').unique().notNull(),
  title: text('title'),
  status: text('status'),          // 'recruiting' | 'active' | 'completed' | 'terminated' | 'suspended'
  phase: text('phase'),            // '1' | '2' | '3' | '4' | 'not-applicable'
  geneIds: text('gene_ids'),       // JSON: number[]
  phenotypeIds: text('phenotype_ids'), // JSON: number[]
  therapyType: text('therapy_type'),
  sponsorName: text('sponsor_name'),
  locations: text('locations'),    // JSON: { city, country }[]
  startDate: text('start_date'),
  completionDate: text('completion_date'),
  enrollmentTarget: integer('enrollment_target'),
  url: text('url'),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
})

// ── Conferences ───────────────────────────────────────────────────────────────
export const conferences = sqliteTable('conferences', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  acronym: text('acronym'),
  year: integer('year'),
  location: text('location'),
  startDate: text('start_date'),
  endDate: text('end_date'),
  website: text('website'),
  articleCount: integer('article_count').default(0),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
})

// ── Therapies ─────────────────────────────────────────────────────────────────
export const therapies = sqliteTable('therapies', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  type: text('type'),              // 'gene-therapy' | 'drug' | 'device' | 'rehabilitation'
  mechanism: text('mechanism'),
  targetGeneIds: text('target_gene_ids'), // JSON: number[]
  clinicalTrialCount: integer('clinical_trial_count').default(0),
  articleCount: integer('article_count').default(0),
  status: text('status'),          // 'preclinical' | 'phase-1' | 'phase-2' | 'phase-3' | 'approved'
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
})

// ── Authors ───────────────────────────────────────────────────────────────────
export const authors = sqliteTable('authors', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  institution: text('institution'),
  country: text('country'),
  articleCount: integer('article_count').default(0),
  collaboratorCount: integer('collaborator_count').default(0),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
})

// ── Search History ────────────────────────────────────────────────────────────
export const searchHistory = sqliteTable('search_history', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  query: text('query'),
  filters: text('filters'),        // JSON
  resultsCount: integer('results_count'),
  timestamp: integer('timestamp', { mode: 'timestamp' }).default(sql`(unixepoch())`),
})
