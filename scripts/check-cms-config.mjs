// Confirms .pages.yml still matches the files it edits.
//
// The failure this prevents: if a data file gains a key that the CMS config
// doesn't declare, saving that file through the CMS silently drops the key.
// Run as part of CI so the config and the content can't drift apart.
import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { load } from "js-yaml";

const cfg = load(await readFile(".pages.yml", "utf8"));
const problems = [];

for (const entry of cfg.content) {
  if (!existsSync(entry.path)) {
    problems.push(`missing file — ${entry.label}: ${entry.path}`);
    continue;
  }
  const declared = new Set(entry.fields.map((f) => f.name));
  const raw = await readFile(entry.path, "utf8");

  let actual;
  if (entry.path.endsWith(".json")) {
    actual = new Set(Object.keys(JSON.parse(raw)));
  } else {
    const m = raw.match(/^---\n([\s\S]*?)\n---\n/);
    actual = new Set(Object.keys(m ? load(m[1]) : {}));
    declared.delete("body");
  }

  for (const key of actual) {
    if (!declared.has(key)) {
      problems.push(`would be dropped on save — ${entry.label}: "${key}"`);
    }
  }
  for (const key of declared) {
    if (!actual.has(key)) {
      problems.push(`declared but not in file — ${entry.label}: "${key}"`);
    }
  }
}

console.log(`Checked ${cfg.content.length} CMS entries against their files.`);
if (problems.length) {
  console.error("\n" + problems.join("\n"));
  process.exit(1);
}
console.log("Config matches. Nothing would be dropped on save.");
