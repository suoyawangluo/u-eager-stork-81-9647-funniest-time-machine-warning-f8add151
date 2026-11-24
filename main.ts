// Funniest Time Machine Warning Label — make.fun entry
// Writes a single warning label for a time machine (<=120 chars) to /output/entry.txt.
// The label keeps a straight safety-notice face and turns a real time-travel
// hazard — meeting (and lending money to) your duplicate self — into the joke,
// with the punch landing on the last words.

import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ENTRY =
  "CAUTION: Do not lend money to yourself. You never pay yourself back.";

function checkGate(text: string): void {
  const chars = [...text].length;
  if (chars < 1 || chars > 120) {
    throw new Error(`gate failed: entry is ${chars} characters, must be 1-120`);
  }
  if (text.trim().length === 0) {
    throw new Error("gate failed: entry is only whitespace");
  }
  if (text.includes("\n")) {
    throw new Error("gate failed: entry must be a single line");
  }
}

function verifyWritten(outPath: string, expected: string): void {
  const back = readFileSync(outPath, "utf8");
  if (back !== expected) {
    throw new Error(`read-back mismatch: wrote ${JSON.stringify(expected)}, read ${JSON.stringify(back)}`);
  }
  const digest = createHash("sha256").update(back, "utf8").digest("hex");
  console.log(`read-back ok, sha256 ${digest}`);
}

function main(): void {
  checkGate(ENTRY);
  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, "entry.txt");
  writeFileSync(outPath, ENTRY, "utf8");
  verifyWritten(outPath, ENTRY);
  console.log(
    `wrote ${outPath} (${[...ENTRY].length} code points), verified: ${JSON.stringify(ENTRY)}`,
  );
}

main();
