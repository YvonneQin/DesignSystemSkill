#!/usr/bin/env node
/**
 * Apply Ant Design Base palettes from default.json to rdx-base-10.json.
 *
 * Usage: node scripts/tokens/apply-default-base.js [path/to/default.json]
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "../..");
const DEFAULT_PATH =
  process.argv[2] || path.join(process.env.HOME, "Downloads/default.json");
const RDX_PATH = path.join(ROOT, "tokens/sources/rdx-base-10.json");
const SYNC_PATH = path.join(ROOT, "scripts/figma/sync-rdx-base-10-payload.js");

const SCALE_STEPS = ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900"];

// Ant Design Base name → rdx-base-10 palette key
// blue uses the Figma reference accent (#386bff), not Ant Design default.json
const PALETTE_MAP = {
  Cyan: "cyan",
  Geekblue: "indigo",
  Gold: "gold",
  Green: "green",
  Lime: "lime",
  Magenta: "pink",
  Orange: "orange",
  Purple: "purple",
  Red: "red",
  Volcano: "tomato",
  Yellow: "yellow",
};

function extractSteps(basePalette) {
  const steps = {};
  for (let i = 1; i <= SCALE_STEPS.length; i++) {
    const entry = basePalette[String(i)];
    if (!entry?.value) {
      throw new Error(`Missing step ${i}`);
    }
    steps[SCALE_STEPS[i - 1]] = entry.value.toLowerCase();
  }
  return steps;
}

const source = JSON.parse(fs.readFileSync(DEFAULT_PATH, "utf8"));
const lightBase = source.light.Colors.Base;
const darkBase = source.dark.Colors.Base;
const rdx = JSON.parse(fs.readFileSync(RDX_PATH, "utf8"));

for (const [antdName, rdxName] of Object.entries(PALETTE_MAP)) {
  if (!lightBase[antdName]) {
    console.warn(`Skip ${antdName}: not in default.json light Base`);
    continue;
  }
  if (!darkBase[antdName]) {
    console.warn(`Skip ${antdName}: not in default.json dark Base`);
    continue;
  }
  if (!rdx[rdxName]) {
    console.warn(`Skip ${rdxName}: not in rdx-base-10.json`);
    continue;
  }

  const lightSteps = extractSteps(lightBase[antdName]);
  const darkSteps = extractSteps(darkBase[antdName]);

  for (const key of SCALE_STEPS) {
    rdx[rdxName][key] = {
      light: lightSteps[key],
      dark: darkSteps[key],
    };
  }
  console.log(`Applied ${antdName} → Base/${rdxName}`);
}

// Warning token uses gold; mirror gold → amber for consistency
if (rdx.gold && rdx.amber) {
  for (const key of SCALE_STEPS) {
    rdx.amber[key] = { ...rdx.gold[key] };
  }
  console.log("Mirrored gold → amber");
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
console.log("Wrote", SYNC_PATH);
