// Refuses to publish a colour scheme that would be hard to read.
//
// The Look & Feel controls let the office pick colours. The one way a colour
// picker can actually harm a visitor is by putting text on a background too
// close to it in tone. This checks the three combinations the design leans on
// against the WCAG AA threshold (4.5:1 for body text).
//
// It runs on the way to the live site, not on the preview build — so the
// office can see their choice, understand why it is being refused, and fix it.
import { readFile } from "node:fs/promises";
import { buildTheme, parseHex } from "./theme.mjs";

const theme = JSON.parse(await readFile("src/_data/theme.json", "utf8"));

for (const key of ["brandColor", "textColor", "pageColor"]) {
  if (!parseHex(theme[key])) {
    console.error(
      `\nThe Look & Feel setting "${key}" is not a colour: ${JSON.stringify(theme[key])}\n` +
        `Expected something like #C30D11.\n`
    );
    process.exit(1);
  }
}

const { checks } = buildTheme(theme);
const failed = checks.filter((c) => c.ratio < c.min);

for (const c of checks) {
  const mark = c.ratio < c.min ? "FAIL" : "ok  ";
  console.log(`${mark} ${c.ratio.toFixed(2)}:1  ${c.label}`);
}

if (failed.length) {
  console.error(
    "\n" +
      "*".repeat(72) + "\n" +
      "THE COLOURS CHOSEN UNDER LOOK & FEEL ARE TOO HARD TO READ.\n\n" +
      failed
        .map(
          (c) =>
            `  ${c.label}\n` +
            `    contrast ${c.ratio.toFixed(2)}:1 — needs at least ${c.min}:1\n` +
            `    ${c.fix}`
        )
        .join("\n\n") +
      "\n\n" +
      "  Nothing has changed on the live site. Open Look & Feel, adjust, and\n" +
      "  publish again.\n" +
      "*".repeat(72) + "\n"
  );
  process.exit(1);
}

console.log("\nColours are readable.");
