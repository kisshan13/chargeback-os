import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { validateDataset } from "../src/validator.js";
import { SOURCE_ENTITIES } from "./data-shape.js";

const packageRoot = join(fileURLToPath(new URL("..", import.meta.url)));
const sourceRoot = join(packageRoot, "data", "source");

function readJsonl(value: string): Record<string, unknown>[] {
  return value.split(/\r?\n/).filter(Boolean).map((line, index) => {
    try {
      return JSON.parse(line) as Record<string, unknown>;
    } catch {
      throw new Error(`Invalid JSONL at line ${index + 1}.`);
    }
  });
}

const dataset: Record<string, Record<string, unknown>[]> = {};
for (const fileName of SOURCE_ENTITIES) {
  dataset[fileName] = readJsonl(await readFile(join(sourceRoot, `${fileName}.jsonl`), "utf8"));
}

const report = validateDataset(dataset as never);
if (!report.valid) {
  console.error(JSON.stringify(report, null, 2));
  process.exitCode = 1;
} else {
  console.log(`Synthetic dataset is valid: ${Object.values(dataset).reduce((sum, records) => sum + records.length, 0)} records.`);
}
