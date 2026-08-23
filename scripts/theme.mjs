// Turns the Look & Feel settings (src/_data/theme.json) into CSS custom
// properties, and reports how readable the result is.
//
// The point of this file is that the office picks THREE colours, not nine.
// Everything else — the darker red for hovers, the pale red wash behind
// callouts, the softened greys, the hairline rules — is derived here, so the
// palette stays internally consistent no matter what they choose.

const clamp = (n, lo = 0, hi = 255) => Math.min(hi, Math.max(lo, n));

export function parseHex(hex) {
  let h = String(hex || "").trim().replace(/^#/, "");
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  if (!/^[0-9a-fA-F]{6}$/.test(h)) return null;
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
}

const toHex = (rgb) =>
  "#" + rgb.map((c) => clamp(Math.round(c)).toString(16).padStart(2, "0")).join("").toUpperCase();

// Mix two colours. amount = how much of `b` to blend in.
const mix = (a, b, amount) => a.map((c, i) => c + (b[i] - c) * amount);

const BLACK = [0, 0, 0];
const WHITE = [255, 255, 255];

// --- Readability -----------------------------------------------------------
// Standard WCAG relative luminance and contrast ratio. Used to warn when a
// chosen colour would make text hard to read, which is the one way a colour
// picker can genuinely harm a visitor.

export function luminance(rgb) {
  const [r, g, b] = rgb.map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrast(a, b) {
  const la = luminance(a);
  const lb = luminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

// --- Choice tables ---------------------------------------------------------
// Deliberately system font stacks: no external font request, nothing to load,
// no security-policy change, and no flash of unstyled text. Every one of these
// resolves to something reasonable on Mac, Windows, iOS and Android.

const SERIF_STACKS = {
  classic: `"Iowan Old Style", "Palatino Linotype", Palatino, "Book Antiqua", Georgia, "Times New Roman", serif`,
  traditional: `Georgia, "Times New Roman", Times, serif`,
  modern: `"Charter", "Bitstream Charter", Cambria, Georgia, serif`,
  plain: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`,
};

const SANS_STACKS = {
  classic: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`,
  traditional: `"Helvetica Neue", Helvetica, Arial, sans-serif`,
  modern: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`,
  plain: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`,
};

const TEXT_SIZES = {
  small: "1rem",
  normal: "1.0625rem",
  large: "1.125rem",
  larger: "1.1875rem",
};

const CORNERS = { square: "0", slight: "3px", rounded: "10px" };
const WIDTHS = { narrow: "60rem", standard: "68rem", wide: "76rem" };

const pick = (table, key, fallback) =>
  Object.prototype.hasOwnProperty.call(table, key) ? table[key] : table[fallback];

// --- The palette -----------------------------------------------------------

export function buildTheme(theme = {}) {
  const brand = parseHex(theme.brandColor) || [195, 13, 17];
  const ink = parseHex(theme.textColor) || [31, 31, 31];
  const paper = parseHex(theme.pageColor) || [251, 249, 246];

  const pairing = theme.fontPairing || "classic";
  const serif = pick(SERIF_STACKS, pairing, "classic");
  const sans = pick(SANS_STACKS, pairing, "classic");
  const headingIsSerif = (theme.headingFont || "serif") !== "sans";

  // A dark page needs its supporting tones lightened rather than darkened,
  // otherwise "soft grey text" turns into invisible text.
  const paperIsDark = luminance(paper) < 0.35;
  const toward = paperIsDark ? WHITE : BLACK;
  const away = paperIsDark ? BLACK : WHITE;

  const vars = {
    "--red": toHex(brand),
    "--red-dark": toHex(mix(brand, BLACK, 0.22)),
    "--red-tint": toHex(mix(brand, away, 0.9)),

    "--ink": toHex(ink),
    // 0.38 is not arbitrary: it is the lightest this grey can go and still
    // clear 4.5:1 against a near-white page. The hand-picked value this
    // replaced (#7A7370) sat at 4.43:1 — just under.
    "--ink-soft": toHex(mix(ink, paper, 0.25)),
    "--ink-faint": toHex(mix(ink, paper, 0.38)),

    "--paper": toHex(paper),
    "--paper-alt": toHex(mix(paper, toward, 0.045)),
    "--white": paperIsDark ? toHex(mix(paper, WHITE, 0.08)) : "#FFFFFF",
    "--rule": toHex(mix(paper, toward, 0.14)),

    "--serif": serif,
    "--sans": sans,
    "--heading-font": headingIsSerif ? serif : sans,

    "--wrap": pick(WIDTHS, theme.contentWidth, "standard"),
    "--base-size": pick(TEXT_SIZES, theme.textSize, "normal"),
    "--radius": pick(CORNERS, theme.corners, "slight"),
  };

  // Readability report. Body text on the page background is the one that
  // matters most; white-on-brand is what every button and the footer use.
  const checks = [
    {
      label: "body text on the page background",
      ratio: contrast(ink, paper),
      min: 4.5,
      fix: "Darken the text colour, or lighten the page background, until the two are further apart.",
    },
    {
      label: "white text on the brand colour",
      ratio: contrast(brand, WHITE),
      min: 4.5,
      fix: "Buttons and the footer put white lettering on the brand colour. Choose a deeper brand colour — pale or bright shades cannot carry white text.",
    },
    {
      label: "quieter grey text on the page background",
      ratio: contrast(parseHex(vars["--ink-faint"]), paper),
      min: 4.5,
      fix: "This grey is worked out from your text colour. Darken the text colour, or lighten the page background.",
    },
  ];

  return { vars, checks };
}

export function toCss(vars) {
  const body = Object.entries(vars)
    .map(([k, v]) => `  ${k}: ${v};`)
    .join("\n");
  return `:root {\n${body}\n}`;
}
