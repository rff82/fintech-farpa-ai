import { createHash } from "crypto";

/**
 * Anonymize a user identifier by hashing with SHA-256.
 * PII is NEVER stored — only the hash enters the database.
 */
export function anonymizeId(rawId: string): string {
  return createHash("sha256").update(rawId).digest("hex");
}

/**
 * Auth.js session callback — strip PII, persist only hash.
 * Place in auth.ts NextAuth config as `callbacks.session`.
 */
export function buildAnonymousSession(
  email: string | null | undefined,
  provider: string,
  rawId: string
) {
  return {
    anonymousId: anonymizeId(`${provider}:${rawId}`),
    // email is intentionally NOT stored
  };
}

/**
 * Compliance record shape stored in D1.
 */
export interface ComplianceRecord {
  anonymousId: string;
  disclaimerAcceptedAt: string; // ISO 8601
  locale: string;
}
