#!/usr/bin/env node
/**
 * Build Ant Design–style combined theme from token sources.
 * Output: tokens/dist/theme.json
 *
 * Usage: node scripts/tokens/build-theme.js
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "../..");
const TOKENS = path.join(ROOT, "tokens");

function readJson(rel) {
  return JSON.parse(fs.readFileSync(path.join(TOKENS, rel), "utf8"));
}

function parseRef(value) {
  const m = String(value).match(/^\{(.+)\}$/);
  return m ? m[1] : null;
}

function resolveSemantic(raw, mode, mapping, overrides, tokenName) {
  if (overrides[tokenName]?.[mode]) {
    return { type: "alias", ref: overrides[tokenName][mode] };
  }
  const ref = parseRef(raw);
  if (ref) {
    const target = mapping[mode][ref];
    if (!target) return { type: "unresolved", raw, ref };
    return { type: "alias", ref: target };
  }
  if (String(raw).startsWith("#")) {
    return { type: "color", value: raw };
  }
  if (typeof raw === "number") {
    return { type: "number", value: raw };
  }
  return { type: "unknown", raw };
}

function buildBase(rdx) {
  const base = {};
  for (const palette of Object.keys(rdx)) {
    base[palette] = {};
    for (const step of Object.keys(rdx[palette])) {
      const { light, dark } = rdx[palette][step];
      base[palette][step] = {
        type: "color",
        figma: `Base/${palette}/${step}`,
        light,
        dark,
      };
    }
  }
  return base;
}

function buildSemantic(mode, mapping) {
  const overrides = mapping.semanticOverrides || {};
  const semantic = {};
  const colorKeys = Object.keys(mode.light_mode).filter(
    (k) => mode.light_mode[k].type === "color"
  );

  for (const name of colorKeys) {
    semantic[name] = {
      type: "color",
      figma: `Neutral/${name}`,
      light: resolveSemantic(
        mode.light_mode[name].value,
        "light",
        mapping,
        overrides,
        name
      ),
      dark: resolveSemantic(
        mode.dark_mode[name].value,
        "dark",
        mapping,
        overrides,
        name
      ),
    };
  }
  return semantic;
}

function buildRadius(mode) {
  const radius = {};
  const keys = Object.keys(mode.light_mode).filter((k) => k.startsWith("radius-"));
  for (const name of keys) {
    radius[name] = {
      type: "number",
      figma: `mode/${name}`,
      value: mode.light_mode[name].value.replace(/^\{(\d+)\}$/, (_, n) => Number(n)),
    };
  }
  return radius;
}

function buildBorder(mode) {
  const border = {};
  for (const name of ["stroke-width", "border-width"]) {
    if (!mode.light_mode[name]) continue;
    border[name] = {
      type: "number",
      figma: `mode/${name}`,
      value: Number(mode.light_mode[name].value.replace(/^\{(\d+)\}$/, "$1")),
    };
  }
  return border;
}

function countTokens(theme) {
  let n = 0;
  for (const palette of Object.values(theme.Colors.Base)) n += Object.keys(palette).length;
  n += Object.keys(theme.Colors.Semantic).length;
  n += Object.keys(theme.Radius).length;
  n += Object.keys(theme.Border).length;
  return n;
}

function main() {
  const rdx = readJson("sources/rdx-base-10.json");
  const mode = readJson("sources/mode.json");
  const mapping = readJson("colors/mapping.json");
  const groups = readJson("groups.json");

  const theme = {
    $schema: "ant-design-combined/v1",
    $generated: new Date().toISOString(),
    $groups: groups.groups.map((g) => g.name),
    Colors: {
      Base: buildBase(rdx),
      Semantic: buildSemantic(mode, mapping),
    },
    Radius: buildRadius(mode),
    Border: buildBorder(mode),
  };

  theme.$tokenCount = countTokens(theme);

  const outDir = path.join(TOKENS, "dist");
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(
    path.join(outDir, "theme.json"),
    JSON.stringify(theme, null, 2) + "\n"
  );

  const unresolved = Object.entries(theme.Colors.Semantic)
    .filter(([, v]) => v.light.type === "unresolved" || v.dark.type === "unresolved")
    .map(([k]) => k);

  console.log(`Built tokens/dist/theme.json`);
  console.log(`  Base palettes: ${Object.keys(theme.Colors.Base).length}`);
  console.log(`  Semantic tokens: ${Object.keys(theme.Colors.Semantic).length}`);
  console.log(`  Total: ${theme.$tokenCount}`);
  if (unresolved.length) {
    console.warn(`  Unresolved refs: ${unresolved.join(", ")}`);
    process.exitCode = 1;
  }
}

main();
