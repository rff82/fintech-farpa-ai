#!/usr/bin/env node
/**
 * HealthTech CDHR1 — Local ETL CLI
 *
 * Commands:
 *   health-etl etl   --input=export.xml [--output=records.jsonl]
 *   health-etl ocr   --image=exam.png   [--lang=por+eng]
 */

import { APP_NAME, APP_VERSION } from "@health/shared";

const [command, ...rest] = process.argv.slice(2);

async function main() {
  console.log(`\n${APP_NAME} ETL v${APP_VERSION}\n`);

  switch (command) {
    case "etl": {
      const { runETL } = await import("./parsers/appleHealth.js");
      const input = rest.find((a) => a.startsWith("--input="))?.split("=")[1] ?? "";
      const output = rest.find((a) => a.startsWith("--output="))?.split("=")[1] ?? "health-records.jsonl";
      if (!input) {
        console.error("Usage: health-etl etl --input=/path/to/export.xml [--output=out.jsonl]");
        process.exit(1);
      }
      await runETL(input, output);
      break;
    }

    case "ocr": {
      const { extractTextFromImage } = await import("./ocr/index.js");
      const image = rest.find((a) => a.startsWith("--image="))?.split("=")[1] ?? "";
      const lang = rest.find((a) => a.startsWith("--lang="))?.split("=")[1] ?? "por+eng";
      if (!image) {
        console.error("Usage: health-etl ocr --image=/path/to/exam.png [--lang=por+eng]");
        process.exit(1);
      }
      const result = await extractTextFromImage(image, lang);
      console.log("\n--- Extracted Text ---\n", result.text);
      console.log(`\nConfidence: ${result.confidence.toFixed(1)}%`);
      break;
    }

    default:
      console.log("Commands:");
      console.log("  etl  --input=export.xml [--output=records.jsonl]");
      console.log("  ocr  --image=exam.png   [--lang=por+eng]");
      break;
  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
