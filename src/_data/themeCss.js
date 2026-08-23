// The generated CSS variable block, available to templates as {{ themeCss }}.
import { readFile } from "node:fs/promises";
import { buildTheme, toCss } from "../../scripts/theme.mjs";

export default async function () {
  const theme = JSON.parse(await readFile("src/_data/theme.json", "utf8"));
  return toCss(buildTheme(theme).vars);
}
