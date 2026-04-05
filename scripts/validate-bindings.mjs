#!/usr/bin/env node
/**
 * Self-healing binding validator — verifica se todos os recursos
 * Cloudflare do projeto existem antes de cada deploy.
 *
 * Falha o deploy se qualquer recurso obrigatório estiver ausente.
 */

const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;

if (!ACCOUNT_ID || !API_TOKEN) {
  console.error("❌ CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_API_TOKEN must be set.");
  process.exit(1);
}

const CF_BASE = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}`;

async function cfFetch(path) {
  const res = await fetch(`${CF_BASE}${path}`, {
    headers: { Authorization: `Bearer ${API_TOKEN}` },
  });
  const data = await res.json();
  return data;
}

let failed = false;

function check(label, ok, detail = "") {
  if (ok) {
    console.log(`  ✅ ${label}`);
  } else {
    console.log(`  ❌ ${label}${detail ? ": " + detail : ""}`);
    failed = true;
  }
}

console.log("\n🔗 Cloudflare Binding Validator\n");

// D1 — health-db
const d1 = await cfFetch("/d1/database?name=health-db");
check(
  "D1 health-db",
  d1.result?.length > 0,
  d1.result?.length === 0 ? "health-db not found" : ""
);

// KV — health-kv-store
const kv = await cfFetch("/storage/kv/namespaces?per_page=100");
const kvExists = kv.result?.some((ns) => ns.title === "health-kv-store");
check("KV health-kv-store", kvExists, kvExists ? "" : "health-kv-store not found");

// R2 — health-assets (optional — only warn if R2 is enabled)
try {
  const r2 = await cfFetch("/r2/buckets?name_contains=health-assets");
  const r2exists = r2.result?.buckets?.some((b) => b.name === "health-assets");
  check("R2 health-assets", r2exists, r2exists ? "" : "health-assets bucket not found");
} catch {
  console.log("  ⚠️  R2 health-assets: skipped (R2 not enabled)");
}

console.log(
  failed
    ? "\n❌ Binding validation FAILED — deploy aborted.\n"
    : "\n✅ All bindings validated.\n"
);

process.exit(failed ? 1 : 0);
