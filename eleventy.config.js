export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addPassthroughCopy({ "src/files": "files" });
  eleventyConfig.addPassthroughCopy("staticwebapp.config.json");

  eleventyConfig.addWatchTarget("src/assets/css/");

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

  // Marks content the office still needs to supply. Renders visibly in the
  // page so nothing ships to parents looking finished but blank.
  eleventyConfig.addPairedShortcode("todo", (content, label) => {
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
