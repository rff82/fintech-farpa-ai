#!/usr/bin/env node
/**
 * Security check script — runs npm audit + custom checks.
 * Called by: npm run security-check
 * Also executed in CI before every deploy.
 */

import { execSync } from "child_process";
import { readFileSync, existsSync } from "fs";
import path from "path";

const ROOT = new URL("..", import.meta.url).pathname;
let failed = false;

function check(label, fn) {
  process.stdout.write(`  ${label}… `);
  try {
    fn();
    console.log("✅ OK");
  } catch (err) {
    console.log(`❌ FAIL\n     ${err.message}`);
    failed = true;
  }
}

console.log("\n🔐 HealthTech CDHR1 — Security Check\n");

// 1. npm audit
check("npm audit (high+critical)", () => {
  execSync("npm audit --audit-level=high --json", {
    cwd: ROOT,
    stdio: "pipe",
  });
});

// 2. No .env files committed
check("No .env files in git index", () => {
  const result = execSync("git ls-files | grep -E '^\\.env$|^\\.env\\.'", {
    cwd: ROOT,
    stdio: "pipe",
  })
    .toString()
    .trim();
  if (result) throw new Error(`.env files found in git: ${result}`);
});

// 3. .env.example has no real values
check(".env.example has no real secrets", () => {
  const envExample = readFileSync(path.join(ROOT, ".env.example"), "utf8");
  const lines = envExample.split("\n").filter((l) => l.includes("=") && !l.startsWith("#"));
  for (const line of lines) {
    const [, value] = line.split("=");
    if (value && value.trim().length > 0 && !value.includes("#")) {
      throw new Error(`Possible real value in .env.example: ${line}`);
    }
  }
});

// 4. wrangler.toml has no API tokens
check("wrangler.toml has no hardcoded tokens", () => {
  const files = ["apps/web/wrangler.toml", "apps/local-etl/wrangler.toml"];
  for (const f of files) {
    const fPath = path.join(ROOT, f);
    if (!existsSync(fPath)) continue;
    const content = readFileSync(fPath, "utf8");
    if (/api_token\s*=\s*"[a-zA-Z0-9_-]{20,}"/.test(content)) {
      throw new Error(`Hardcoded API token found in ${f}`);
    }
  }
});

// 5. No console.log with sensitive keywords in src
check("No sensitive console.log in src", () => {
  try {
    const result = execSync(
      `grep -rn "console.log.*\\b(password|token|secret|api_key)\\b" apps/web/src packages/shared/src --include="*.ts" --include="*.tsx"`,
      { cwd: ROOT, stdio: "pipe" }
    )
      .toString()
      .trim();
    if (result) throw new Error(`Sensitive console.log found:\n${result}`);
  } catch (e) {
    if (e.status === 1) return; // grep found nothing — OK
    throw e;
  }
});

console.log(
  failed
    ? "\n❌ Security check FAILED — fix issues before deploying.\n"
    : "\n✅ All security checks passed.\n"
);

process.exit(failed ? 1 : 0);
