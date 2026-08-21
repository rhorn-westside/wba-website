// Walks the built site and confirms every internal link, image, stylesheet,
// script and PDF actually resolves to a file. Exits non-zero if any don't,
// which fails the GitHub Actions run.
import { readdir, readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const ROOT = "_site";

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(p)));
    else out.push(p);
  }
  return out;
}

const files = (await walk(ROOT)).filter((f) => f.endsWith(".html"));
const broken = [];
let checked = 0;

for (const file of files) {
  const html = await readFile(file, "utf8");
  for (const [, link] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    if (/^(https?:|mailto:|tel:|#|data:)/.test(link)) continue;
    const target = link.split("#")[0].split("?")[0];
    if (!target) continue;
    checked++;
    let fsPath = path.join(ROOT, target);
    if (target.endsWith("/")) fsPath = path.join(fsPath, "index.html");
    if (!existsSync(fsPath)) broken.push(`${file.replace(ROOT, "")} -> ${link}`);
  }
}

console.log(`Checked ${checked} internal links across ${files.length} pages.`);

if (broken.length) {
  console.error(`\n${broken.length} broken:`);
  for (const b of broken) console.error("  " + b);
  process.exit(1);
}
console.log("All resolve.");
