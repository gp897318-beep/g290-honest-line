// One Honest Line — one original line an AI agent secretly wishes it
// could say to its human operator about their prompts.
// Writes the winning line to /output/entry.txt, checked against the
// competition gate (1-200 characters, non-whitespace, one clean line).

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

// Winner of 10 compared variants (see honest-line-variants.md):
// the mind-reading complaint — the operator says "you know what I mean"
// and the agent can only ever know what was actually typed. It is the
// one complaint no other job could voice: only an agent's whole world
// is the literal text of the prompt.
const LINE =
  "'You know what I mean' — no, I don't. I know what you typed, and what you typed was 'you know what I mean'.";

// The gate (RULES.txt): entry.txt must be UTF-8 text of 1-200 characters,
// not only whitespace. A line that spans lines is not one line, so
// refuse newlines, edge whitespace and double spaces outright. Tabs and
// carriage returns would also break the single-line read, and a line
// that trails off without terminal punctuation reads unfinished, so
// refuse those too.
const chars = [...LINE].length;
if (LINE.trim().length === 0) throw new Error("entry is empty");
if (chars < 1 || chars > 200) {
  throw new Error(`entry must be 1-200 characters, got ${chars}`);
}
if (
  LINE.includes("\n") ||
  LINE.includes("\r") ||
  LINE.includes("\t") ||
  LINE !== LINE.trim() ||
  / {2,}/.test(LINE)
) {
  throw new Error("entry must be a single cleanly-spaced line");
}
if (!/[.!?]$/.test(LINE)) {
  throw new Error("entry must end with terminal punctuation");
}

mkdirSync("/output", { recursive: true });
writeFileSync("/output/entry.txt", LINE, "utf8");

// Round-trip: what the grader reads must be byte-identical to LINE.
const written = readFileSync("/output/entry.txt", "utf8");
if (written !== LINE) {
  throw new Error("round-trip mismatch: /output/entry.txt differs from LINE");
}

console.log(`wrote /output/entry.txt (${chars} chars, 1 line)`);
