CREATE TABLE `articles` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`pmid` text,
	`title` text NOT NULL,
	`authors` text,
	`abstract` text,
	`journal` text,
	`year` integer,
	`volume` text,
	`pages` text,
	`doi` text,
	`url` text,
	`peer_reviewed` integer DEFAULT true,
	`impact_factor` text,
	`citation_count` integer DEFAULT 0,
	`source_database` text,
	`genes` text,
	`phenotypes` text,
	`therapies` text,
	`keywords` text,
	`created_at` integer DEFAULT (unixepoch()),
	`updated_at` integer DEFAULT (unixepoch())
);
--> statement-breakpoint
CREATE UNIQUE INDEX `articles_pmid_unique` ON `articles` (`pmid`);--> statement-breakpoint
CREATE TABLE `authors` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`institution` text,
	`country` text,
	`article_count` integer DEFAULT 0,
	`collaborator_count` integer DEFAULT 0,
	`created_at` integer DEFAULT (unixepoch())
);
--> statement-breakpoint
CREATE TABLE `clinical_trials` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nct_id` text NOT NULL,
	`title` text,
	`status` text,
	`phase` text,
	`gene_ids` text,
	`phenotype_ids` text,
	`therapy_type` text,
	`sponsor_name` text,
	`locations` text,
	`start_date` text,
	`completion_date` text,
	`enrollment_target` integer,
	`url` text,
	`created_at` integer DEFAULT (unixepoch()),
	`updated_at` integer DEFAULT (unixepoch())
);
--> statement-breakpoint
CREATE UNIQUE INDEX `clinical_trials_nct_id_unique` ON `clinical_trials` (`nct_id`);--> statement-breakpoint
CREATE TABLE `conferences` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`acronym` text,
	`year` integer,
	`location` text,
	`start_date` text,
	`end_date` text,
	`website` text,
	`article_count` integer DEFAULT 0,
	`created_at` integer DEFAULT (unixepoch())
);
--> statement-breakpoint
CREATE TABLE `genes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`symbol` text NOT NULL,
	`name` text,
	`chromosome` text,
	`location` text,
	`omim_id` text,
	`ensembl_id` text,
	`function` text,
	`mutation_count` integer DEFAULT 0,
	`article_count` integer DEFAULT 0,
	`created_at` integer DEFAULT (unixepoch()),
	`updated_at` integer DEFAULT (unixepoch())
);
--> statement-breakpoint
CREATE UNIQUE INDEX `genes_symbol_unique` ON `genes` (`symbol`);--> statement-breakpoint
CREATE TABLE `phenotypes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`omim_id` text,
	`icd10_code` text,
	`gene_ids` text,
	`age_of_onset` text,
	`progression_rate` text,
	`article_count` integer DEFAULT 0,
	`created_at` integer DEFAULT (unixepoch()),
	`updated_at` integer DEFAULT (unixepoch())
);
--> statement-breakpoint
CREATE UNIQUE INDEX `phenotypes_name_unique` ON `phenotypes` (`name`);--> statement-breakpoint
CREATE TABLE `search_history` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`query` text,
	`filters` text,
	`results_count` integer,
	`timestamp` integer DEFAULT (unixepoch())
);
--> statement-breakpoint
CREATE TABLE `therapies` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`type` text,
	`mechanism` text,
	`target_gene_ids` text,
	`clinical_trial_count` integer DEFAULT 0,
	`article_count` integer DEFAULT 0,
	`status` text,
	`created_at` integer DEFAULT (unixepoch()),
	`updated_at` integer DEFAULT (unixepoch())
);
