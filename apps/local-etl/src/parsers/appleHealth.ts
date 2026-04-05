#!/usr/bin/env node
/**
 * Apple Health XML → JSON ETL using SAX streaming parser.
 * High Water Mark: streams the export.xml without loading it all into RAM.
 *
 * Usage: node dist/parsers/appleHealth.js --input=/path/to/export.xml
 */

import { createReadStream } from "fs";
import { createInterface } from "readline";
import { pipeline } from "stream/promises";
import { Transform } from "stream";
import path from "path";

interface HealthRecord {
  type: string;
  value: string;
  unit: string;
  startDate: string;
  endDate: string;
  sourceName: string;
}

const HIGH_WATER_MARK = 64 * 1024; // 64 KB chunks

function parseArgs(): { input: string; output: string } {
  const args = process.argv.slice(2);
  const input = args.find((a) => a.startsWith("--input="))?.split("=")[1] ?? "";
  const output = args.find((a) => a.startsWith("--output="))?.split("=")[1] ?? "health-records.jsonl";
  if (!input) {
    console.error("Usage: node appleHealth.js --input=/path/to/export.xml [--output=out.jsonl]");
    process.exit(1);
  }
  return { input, output };
}

/**
 * Minimal SAX-like transformer: extracts <Record .../> tags line by line.
 * Handles multi-line attributes by accumulating until "/>" is found.
 */
class RecordExtractor extends Transform {
  private buffer = "";
  private count = 0;

  constructor() {
    super({ objectMode: true, highWaterMark: HIGH_WATER_MARK });
  }

  _transform(chunk: Buffer, _enc: string, cb: () => void) {
    this.buffer += chunk.toString("utf8");

    let pos: number;
    while ((pos = this.buffer.indexOf("<Record ")) !== -1) {
      const end = this.buffer.indexOf("/>", pos);
      if (end === -1) break; // incomplete tag — wait for more data

      const tag = this.buffer.slice(pos, end + 2);
      this.buffer = this.buffer.slice(end + 2);

      const record = this.parseRecord(tag);
      if (record) {
        this.push(JSON.stringify(record) + "\n");
        this.count++;
        if (this.count % 10_000 === 0) {
          process.stderr.write(`\r  Parsed ${this.count.toLocaleString()} records…`);
        }
      }
    }

    // Prevent unbounded buffer growth
    if (this.buffer.length > HIGH_WATER_MARK * 4) {
      this.buffer = this.buffer.slice(-HIGH_WATER_MARK);
    }

    cb();
  }

  _flush(cb: () => void) {
    process.stderr.write(`\n  Total: ${this.count.toLocaleString()} records extracted.\n`);
    cb();
  }

  private parseRecord(tag: string): HealthRecord | null {
    const attr = (name: string): string => {
      const m = tag.match(new RegExp(`${name}="([^"]*)"`));
      return m?.[1] ?? "";
    };

    const type = attr("type");
    if (!type) return null;

    return {
      type,
      value: attr("value"),
      unit: attr("unit"),
      startDate: attr("startDate"),
      endDate: attr("endDate"),
      sourceName: attr("sourceName"),
    };
  }
}

export async function runETL(inputPath: string, outputPath: string) {
  const { createWriteStream } = await import("fs");
  const src = createReadStream(path.resolve(inputPath), { highWaterMark: HIGH_WATER_MARK });
  const extractor = new RecordExtractor();
  const dest = createWriteStream(path.resolve(outputPath));

  console.log(`🔄 ETL start: ${inputPath} → ${outputPath}`);
  await pipeline(src, extractor, dest);
  console.log(`✅ ETL complete: ${outputPath}`);
}

// CLI entry point
if (process.argv[1] && process.argv[1].endsWith("appleHealth.js")) {
  const { input, output } = parseArgs();
  runETL(input, output).catch((err) => {
    console.error("ETL error:", err);
    process.exit(1);
  });
}
