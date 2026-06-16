#!/usr/bin/env node
/**
 * Uniformize Base ramp shape (shared curve) while keeping each palette's own
 * step-7 hue, lightness, and saturation. Ant Design palettes stay untouched.
 *
 * Run after: node scripts/tokens/apply-default-base.js
 * Usage: node scripts/tokens/uniformize-base-palettes.js [path/to/default.json]
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "../..");
const DEFAULT_PATH =
  process.argv[2] || path.join(process.env.HOME, "Downloads/default.json");
const RDX_PATH = path.join(ROOT, "tokens/sources/rdx-base-10.json");
const SYNC_PATH = path.join(ROOT, "scripts/figma/sync-rdx-base-10-payload.js");

const ANCHOR_STEP = 7;

// Ant Design palettes from default.json + alpha — never reshape these
const KEEP = new Set([
  "cyan", "indigo", "gold", "green", "lime", "pink", "orange",
  "purple", "red", "tomato", "yellow", "amber", "black", "white",
]);

// Figma 新色板主色相 — not Ant Design Blue
const FIXED_STEP7 = {
  blue: { light: "#386bff", dark: "#1d3887" },
};

const NEUTRAL = new Set(["gray", "mauve", "slate", "sage", "olive", "sand"]);

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

function relHslL(hex) {
  return rgbToHsl(...Object.values(hexToRgb(hex))).l;
}

function relSat(hex) {
  return rgbToHsl(...Object.values(hexToRgb(hex))).s;
}

function extractCurve(stepsObj, anchorStep) {
  const anchor = stepsObj[String(anchorStep)].value;
  const aL = relHslL(anchor);
  const aS = relSat(anchor) || 1;
  const dl = [];
  const sm = [];
  for (let i = 1; i <= 10; i++) {
    const v = stepsObj[String(i)].value;
    dl.push(relHslL(v) - aL);
    sm.push(aS > 0 ? relSat(v) / aS : 1);
  }
  return { dl, sm };
}

function buildScaleFromAnchor(anchorHex, curve, pinIndex) {
  const { h, s, l } = rgbToHsl(...Object.values(hexToRgb(anchorHex)));
  const steps = curve.dl.map((dl, i) => {
    const stepL = Math.min(0.99, Math.max(0.02, l + dl));
    const stepS = Math.min(1, Math.max(0, s * curve.sm[i]));
    const rgb = hslToRgb(h, stepS, stepL);
    return rgbToHex(rgb.r, rgb.g, rgb.b);
  });
  steps[pinIndex] = anchorHex.toLowerCase();
  return steps;
}

function mixRgb(a, b, t) {
  return {
    r: a.r + (b.r - a.r) * t,
    g: a.g + (b.g - a.g) * t,
    b: a.b + (b.b - a.b) * t,
  };
}

function generateDarkScale(lightSteps, darkAnchorHex, pinIndex) {
  const accent = hexToRgb(lightSteps[pinIndex]);
  const accentHsl = rgbToHsl(accent.r, accent.g, accent.b);
  const black = { r: 0, g: 0, b: 0 };
  const darkLightness = [0.07, 0.1, 0.13, 0.17, 0.21, 0.26, 0.32, 0.42, null, null];
  const darkSaturation = [0.35, 0.4, 0.45, 0.5, 0.55, 0.6, 0.65, 0.7, null, null];
  const dark = [];
  for (let i = 0; i < 10; i++) {
    if (i === pinIndex) {
      dark.push(darkAnchorHex.toLowerCase());
      continue;
    }
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

function generateNeutralDarkScale(lightSteps, darkAnchorHex, pinIndex) {
  const dark = [];
  for (let i = 0; i < 10; i++) {
    if (i === pinIndex) {
      dark.push(darkAnchorHex.toLowerCase());
      continue;
    }
    if (i === 8) {
      dark.push(lightSteps[pinIndex]);
      continue;
    }
    if (i === 9) {
      const a = hexToRgb(lightSteps[pinIndex]);
      const lighter = mixRgb(a, { r: 255, g: 255, b: 255 }, 0.15);
      dark.push(rgbToHex(lighter.r, lighter.g, lighter.b));
      continue;
    }
    const accent = hexToRgb(lightSteps[pinIndex]);
    const t = 0.06 + i * 0.035;
    const mixed = mixRgb({ r: 0, g: 0, b: 0 }, accent, t);
    dark.push(rgbToHex(mixed.r, mixed.g, mixed.b));
  }
  return dark;
}

function writeSyncPayload(rdx) {
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
}

const source = JSON.parse(fs.readFileSync(DEFAULT_PATH, "utf8"));
const lightCurve = extractCurve(source.light.Colors.Base.Blue, ANCHOR_STEP);

// Neutrals: same ramp shape, gentler saturation swing
const neutralCurve = {
  dl: lightCurve.dl,
  sm: lightCurve.sm.map((v) => 0.15 + v * 0.55),
};

const rdx = JSON.parse(fs.readFileSync(RDX_PATH, "utf8"));
const pinIndex = ANCHOR_STEP - 1;

for (const palette of Object.keys(rdx)) {
  if (KEEP.has(palette)) continue;

  const fixed = FIXED_STEP7[palette];
  const lightAnchor = fixed?.light ?? rdx[palette][String(ANCHOR_STEP)].light;
  const darkAnchor = fixed?.dark ?? rdx[palette][String(ANCHOR_STEP)].dark;
  const curve = NEUTRAL.has(palette) ? neutralCurve : lightCurve;

  const lightSteps = buildScaleFromAnchor(lightAnchor, curve, pinIndex);
  const darkSteps = NEUTRAL.has(palette)
    ? generateNeutralDarkScale(lightSteps, darkAnchor, pinIndex)
    : generateDarkScale(lightSteps, darkAnchor, pinIndex);

  for (let step = 1; step <= 10; step++) {
    rdx[palette][String(step)] = {
      light: lightSteps[step - 1],
      dark: darkSteps[step - 1],
    };
  }
  console.log(
    `Uniformized ${palette} (anchor step ${ANCHOR_STEP}: ${lightAnchor})`
  );
}

fs.writeFileSync(RDX_PATH, `${JSON.stringify(rdx, null, 2)}\n`);
writeSyncPayload(rdx);
console.log("\nWrote", RDX_PATH);
console.log("Wrote", SYNC_PATH);
