#!/usr/bin/env node
/**
 * Regenerate non–Ant Design Base palettes from per-palette 800 accents.
 * Each palette keeps its own hue/sat anchor — ramps are NOT forced to match blue.
 *
 * Run after: node scripts/tokens/apply-default-base.js
 * Usage: node scripts/tokens/regen-non-antd-base.js
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "../..");
const RDX_PATH = path.join(ROOT, "tokens/sources/rdx-base-10.json");
const SYNC_PATH = path.join(ROOT, "scripts/figma/sync-rdx-base-10-payload.js");

const KEEP = new Set([
  "blue", "cyan", "indigo", "gold", "green", "lime", "pink", "orange",
  "purple", "red", "tomato", "yellow", "amber", "gray", "black", "white",
]);

const SCALE_STEPS = ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900"];

// 800 accent anchors (chromatic identity per palette)
const ACCENT_STEP800 = {
  mauve: "#6f6d7a",
  slate: "#6c6e79",
  sage: "#686f6c",
  olive: "#6b6f69",
  sand: "#6e6e68",
  ruby: "#a00020",
  crimson: "#cc1c63",
  plum: "#82398e",
  violet: "#6f2581",
  iris: "#3434bf",
  teal: "#00635b",
  jade: "#1f705b",
  grass: "#367a42",
  bronze: "#7f6357",
  brown: "#846144",
  mint: "#55ddbf",
  sky: "#44d2f9",
};

const LIGHT_CURVE = {
  dl: [0.38, 0.32, 0.26, 0.2, 0.14, 0.07, 0, -0.08, -0.12, -0.18],
  sm: [0.12, 0.18, 0.28, 0.42, 0.65, 0.85, 1.0, 1.0, 0.95, 0.9],
};

const NEUTRAL_LIGHT_CURVE = {
  dl: [0.36, 0.3, 0.24, 0.18, 0.12, 0.06, 0, -0.06, -0.1, -0.14],
  sm: [0.08, 0.12, 0.18, 0.28, 0.45, 0.65, 1.0, 0.9, 0.85, 0.8],
};

const NEUTRAL = new Set(["mauve", "slate", "sage", "olive", "sand"]);

function hexToRgb(hex) {
  const h = hex.replace("#", "");
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}

function rgbToHex(r, g, b) {
  const c = (n) =>
    Math.round(Math.min(255, Math.max(0, n)))
      .toString(16)
      .padStart(2, "0");
  return `#${c(r)}${c(g)}${c(b)}`;
}

function rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      default:
        h = (r - g) / d + 4;
    }
    h /= 6;
  }
  return { h, s, l };
}

function hslToRgb(h, s, l) {
  if (s === 0) {
    const v = Math.round(l * 255);
    return { r: v, g: v, b: v };
  }
  const hue2rgb = (p, q, t) => {
    let tt = t;
    if (tt < 0) tt += 1;
    if (tt > 1) tt -= 1;
    if (tt < 1 / 6) return p + (q - p) * 6 * tt;
    if (tt < 1 / 2) return q;
    if (tt < 2 / 3) return p + (q - p) * (2 / 3 - tt) * 6;
    return p;
  };
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  return {
    r: Math.round(hue2rgb(p, q, h + 1 / 3) * 255),
    g: Math.round(hue2rgb(p, q, h) * 255),
    b: Math.round(hue2rgb(p, q, h - 1 / 3) * 255),
  };
}

function mixRgb(a, b, t) {
  return {
    r: a.r + (b.r - a.r) * t,
    g: a.g + (b.g - a.g) * t,
    b: a.b + (b.b - a.b) * t,
  };
}

function generateLightScaleFromAccent(accentHex, curve) {
  const accent = hexToRgb(accentHex);
  const { h, s, l } = rgbToHsl(accent.r, accent.g, accent.b);
  return curve.dl.map((dl, i) => {
    const stepL = Math.min(0.99, Math.max(0.08, l + dl));
    const stepS = Math.min(1, Math.max(0, s * curve.sm[i]));
    const rgb = hslToRgb(h, stepS, stepL);
    return rgbToHex(rgb.r, rgb.g, rgb.b);
  });
}

function generateDarkScale(lightSteps) {
  const accent = hexToRgb(lightSteps[6]);
  const accentHsl = rgbToHsl(accent.r, accent.g, accent.b);
  const black = { r: 0, g: 0, b: 0 };
  const darkLightness = [0.07, 0.1, 0.13, 0.17, 0.21, 0.26, 0.32, 0.42, null, null];
  const darkSaturation = [0.35, 0.4, 0.45, 0.5, 0.55, 0.6, 0.65, 0.7, null, null];
  const dark = [];
  for (let i = 0; i < 10; i++) {
    if (i === 8) {
      dark.push(rgbToHex(accent.r, accent.g, accent.b));
      continue;
    }
    if (i === 9) {
      const lighter = hslToRgb(
        accentHsl.h,
        Math.min(1, accentHsl.s * 0.95),
        Math.min(0.72, accentHsl.l + 0.12)
      );
      dark.push(rgbToHex(lighter.r, lighter.g, lighter.b));
      continue;
    }
    const mixed = mixRgb(black, accent, 0.12 + i * 0.06);
    const hsl = rgbToHsl(mixed.r, mixed.g, mixed.b);
    hsl.l = darkLightness[i];
    hsl.s = Math.max(hsl.s, darkSaturation[i] * accentHsl.s);
    hsl.h = accentHsl.h;
    const rgb = hslToRgb(hsl.h, Math.min(1, hsl.s), hsl.l);
    dark.push(rgbToHex(rgb.r, rgb.g, rgb.b));
  }
  return dark;
}

function generateNeutralDarkScale(lightSteps) {
  const accent = hexToRgb(lightSteps[6]);
  const dark = [];
  for (let i = 0; i < 10; i++) {
    if (i === 8) {
      dark.push(lightSteps[6]);
      continue;
    }
    if (i === 9) {
      const a = hexToRgb(lightSteps[6]);
      const lighter = mixRgb(a, { r: 255, g: 255, b: 255 }, 0.15);
      dark.push(rgbToHex(lighter.r, lighter.g, lighter.b));
      continue;
    }
    const t = 0.06 + i * 0.035;
    const mixed = mixRgb({ r: 0, g: 0, b: 0 }, accent, t);
    dark.push(rgbToHex(mixed.r, mixed.g, mixed.b));
  }
  return dark;
}

function applyPalette(rdx, palette, lightSteps, source) {
  const darkSteps = NEUTRAL.has(palette)
    ? generateNeutralDarkScale(lightSteps)
    : generateDarkScale(lightSteps);
  for (let i = 0; i < SCALE_STEPS.length; i++) {
    const step = SCALE_STEPS[i];
    rdx[palette][step] = {
      light: lightSteps[i],
      dark: darkSteps[i],
    };
  }
  console.log(`Regenerated ${palette} (${source})`);
}

const rdx = JSON.parse(fs.readFileSync(RDX_PATH, "utf8"));

for (const [palette, accent] of Object.entries(ACCENT_STEP800)) {
  const curve = NEUTRAL.has(palette) ? NEUTRAL_LIGHT_CURVE : LIGHT_CURVE;
  const lightSteps = generateLightScaleFromAccent(accent, curve);
  applyPalette(rdx, palette, lightSteps, `accent ${accent}`);
}

fs.writeFileSync(RDX_PATH, `${JSON.stringify(rdx, null, 2)}\n`);

const syncHeader = `function hexToRgba(hex) {
  let h = String(hex).replace('#', '');
  if (h.length === 8) {
    return {
      r: parseInt(h.slice(0, 2), 16) / 255,
      g: parseInt(h.slice(2, 4), 16) / 255,
      b: parseInt(h.slice(4, 6), 16) / 255,
      a: parseInt(h.slice(6, 8), 16) / 255,
    };
  }
  return {
    r: parseInt(h.slice(0, 2), 16) / 255,
    g: parseInt(h.slice(2, 4), 16) / 255,
    b: parseInt(h.slice(4, 6), 16) / 255,
    a: 1,
  };
}

const DATA = ${JSON.stringify(rdx)};

`;

const syncTail = fs.readFileSync(SYNC_PATH, "utf8").split("const collections = ")[1];
fs.writeFileSync(SYNC_PATH, syncHeader + "const collections = " + syncTail);

console.log("\nWrote", RDX_PATH);
