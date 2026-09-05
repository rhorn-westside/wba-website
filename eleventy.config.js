import MarkdownIt from "markdown-it";
import { readFileSync } from "node:fs";

const md = new MarkdownIt({ html: true, linkify: true, typographer: false });

// Wording stored in data files can include %PHONE% and %EMAIL%. They are
// replaced with the real, linked values from site.json at build time, so the
// contact details still live in exactly one place.
const siteData = JSON.parse(readFileSync("src/_data/site.json", "utf8"));
const tokens = (value) =>
  String(value)
    .replaceAll("%PHONE%", `[${siteData.contact.phone}](tel:${siteData.contact.phoneHref})`)
    .replaceAll("%EMAIL%", `[${siteData.contact.email}](mailto:${siteData.contact.email})`);

export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addPassthroughCopy({ "src/files": "files" });
  eleventyConfig.addPassthroughCopy("staticwebapp.config.json");


  // Renders a markdown string from a data file into HTML. Lets wording that
  // lives in JSON (so the CMS can edit it) still support bold, links and lists.
  eleventyConfig.addFilter("markdown", (value) => {
    if (!value) return "";
    return md.render(tokens(value));
  });

  // Same, but without the wrapping <p> — for single lines.
  eleventyConfig.addFilter("markdownInline", (value) => {
    if (!value) return "";
    return md.renderInline(tokens(value));
  });

  eleventyConfig.addWatchTarget("src/assets/css/");

  // The closure banner hides itself once its take-down time passes. That is
  // deliberate — a stale "school is closed" notice is worse than none — but it
  // means a take-down time set in the past produces silence, which looks
  // exactly like a broken banner. Say so loudly at build time.
  eleventyConfig.on("eleventy.before", async () => {
    const { readFile } = await import("node:fs/promises");
    try {
      const alert = JSON.parse(
        await readFile("src/_data/alert.json", "utf8")
      );
      if (!alert.active) return;
      if (!alert.expires) {
        console.log("\n[alert] Closure banner is ON with no take-down time.\n");
        return;
      }
      const when = Date.parse(alert.expires);
      if (!isNaN(when) && Date.now() > when) {
        console.warn(
          "\n" +
            "*".repeat(72) + "\n" +
            "[alert] THE CLOSURE BANNER WILL NOT APPEAR.\n" +
            `        It is switched on, but its take-down time (${alert.expires})\n` +
            "        has already passed, so the page hides it immediately.\n" +
            "        Set a take-down time in the future, or clear it entirely.\n" +
            "*".repeat(72) + "\n"
        );
      } else if (!isNaN(when)) {
        console.log(`\n[alert] Closure banner is ON until ${alert.expires}.\n`);
      }
    } catch {
      /* no alert file, or unreadable — the site builds fine without it */
    }
  });

  // Say so at build time when the Look & Feel colours are hard to read. The
  // preview build still goes ahead — seeing the problem explains it far better
  // than a refusal does — but check-contrast.mjs stops it reaching the live
  // site.
  eleventyConfig.on("eleventy.before", async () => {
    const { readFile } = await import("node:fs/promises");
    const { buildTheme } = await import("./scripts/theme.mjs");
    try {
      const theme = JSON.parse(await readFile("src/_data/theme.json", "utf8"));
      const bad = buildTheme(theme).checks.filter((c) => c.ratio < c.min);
      if (bad.length) {
        console.warn(
          "\n" +
            "*".repeat(72) + "\n" +
            "[theme] THESE COLOURS ARE TOO HARD TO READ AND CANNOT BE PUBLISHED.\n" +
            bad
              .map((c) => `        ${c.label} — ${c.ratio.toFixed(2)}:1, needs 4.5:1`)
              .join("\n") +
            "\n" +
            "*".repeat(72) + "\n"
        );
      }
    } catch {
      /* no theme file — site.css defaults apply and the site builds fine */
    }
  });

  // Builds the URL for an uploaded document.
  //
  // Pages CMS stores a file it uploaded as "/files/name.pdf", while a value
  // typed by hand is usually just "name.pdf". The template used to prepend
  // "/files/" unconditionally, so the office's first CMS upload produced
  // /files//files/name.pdf and failed the link check. Accept either form.
  eleventyConfig.addFilter("fileUrl", (name) => {
    if (!name) return "";
    return "/files/" + String(name).trim().replace(/^\/*files\/*/i, "");
  });

  // Nunjucks' selectattr is unreliable across versions; this is explicit.
  eleventyConfig.addFilter("where", (arr, key, value) =>
    (arr || []).filter((item) => item[key] === value)
  );

  // First letter of a person's name, ignoring the honorific.
  eleventyConfig.addFilter("initial", (name) => {
    const stripped = String(name || "").replace(
      /^(Pastor|Mrs\.|Mr\.|Miss|Ms\.|Dr\.)\s+/,
      ""
    );
    return stripped.charAt(0).toUpperCase();
  });

  // Current year, for the footer copyright line.
  eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);

  // Marks content the office still needs to supply.
  //
  // These are notes to ourselves, not to parents, so they appear ONLY on the
  // preview site. On the live site the block disappears entirely -- no gap, no
  // placeholder. That way a note can sit in the source for as long as it takes
  // to get the real content, without a parent ever reading our to-do list.
  eleventyConfig.addPairedShortcode("todo", (content, label) => {
    if (process.env.SITE_ENV !== "preview") return "";
    return `<div class="todo" role="note"><span class="todo__label">Needs content${
      label ? `: ${label}` : ""
    }</span>${content}</div>`;
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    templateFormats: ["njk", "md", "html"],
  };
}
