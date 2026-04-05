/**
 * OCR local — extrai texto de imagens de exames usando Tesseract.js.
 * Funciona completamente offline, sem envio de dados para a nuvem.
 *
 * Usage: node dist/ocr/index.js --image=/path/to/exam.png [--lang=por]
 */

import path from "path";

interface OcrResult {
  text: string;
  confidence: number;
  imagePath: string;
  extractedAt: string;
}

function parseArgs(): { image: string; lang: string } {
  const args = process.argv.slice(2);
  const image = args.find((a) => a.startsWith("--image="))?.split("=")[1] ?? "";
  const lang = args.find((a) => a.startsWith("--lang="))?.split("=")[1] ?? "por+eng";
  if (!image) {
    console.error("Usage: node ocr/index.js --image=/path/to/exam.png [--lang=por+eng]");
    process.exit(1);
  }
  return { image, lang };
}

export async function extractTextFromImage(
  imagePath: string,
  lang = "por+eng"
): Promise<OcrResult> {
  // Dynamic import so the module is only loaded when OCR is needed
  const { createWorker } = await import("tesseract.js");

  console.log(`🔍 OCR start: ${imagePath} (lang: ${lang})`);

  const worker = await createWorker(lang, 1, {
    logger: (m: { status: string; progress: number }) => {
      if (m.status === "recognizing text") {
        process.stdout.write(`\r  Progress: ${Math.round(m.progress * 100)}%`);
      }
    },
  });

  const {
    data: { text, confidence },
  } = await worker.recognize(path.resolve(imagePath));

  await worker.terminate();

  process.stdout.write("\n");
  console.log(`✅ OCR complete — confidence: ${confidence.toFixed(1)}%`);

  return {
    text: text.trim(),
    confidence,
    imagePath,
    extractedAt: new Date().toISOString(),
  };
}

// CLI entry point
if (process.argv[1] && process.argv[1].endsWith("index.js")) {
  const { image, lang } = parseArgs();
  extractTextFromImage(image, lang)
    .then((result) => {
      console.log("\n--- Extracted Text ---");
      console.log(result.text);
      console.log(`\nConfidence: ${result.confidence.toFixed(1)}%`);
    })
    .catch((err) => {
      console.error("OCR error:", err);
      process.exit(1);
    });
}
