// ============================================================================
// scan.js — READ-ONLY. Find hardcoded (unbound) SOLID colors in scope and
// match them against the design-system color variables (tokens).
//
// HOW TO RUN: paste the body of this file into the `use_figma` tool `code`
// param (fileKey = the design file). It mutates nothing — it only returns a
// report. Tune CONFIG below before running.
// ============================================================================

// ---------------------------- CONFIG ----------------------------------------
// Library variable collections that hold COLOR tokens. Discover names with the
// inspect snippet in the skill; for "Design System（New）" these are:
const TOKEN_COLLECTIONS = ["color", "tokens"];
// Per-channel Euclidean distance (0-1 RGB) under which a raw color counts as a
// "near match" (reported for manual review, never auto-bound).
const NEAR_TOLERANCE = 0.06;
// Cap on how many per-node locations to return per raw color (keeps output small).
const MAX_LOCATIONS = 8;
// ----------------------------------------------------------------------------

const to2 = (x) => Math.round(x * 255).toString(16).padStart(2, "0");
const hexOf = (c) => "#" + to2(c.r) + to2(c.g) + to2(c.b);
const dist = (a, b) =>
  Math.sqrt((a.r - b.r) ** 2 + (a.g - b.g) ** 2 + (a.b - b.b) ** 2);

// 1. Import every COLOR variable from the token collections.
// IMPORTANT: import in PARALLEL. Sequential `await import` in a loop is the #1
// cause of timeouts on libraries with many tokens.
const libCollections =
  await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync();
const descriptors = [];
for (const coll of libCollections) {
  if (!TOKEN_COLLECTIONS.includes(coll.name)) continue;
  const vars = await figma.teamLibrary.getVariablesInLibraryCollectionAsync(
    coll.key
  );
  for (const v of vars)
    if (v.resolvedType === "COLOR")
      descriptors.push({ key: v.key, name: v.name, collection: coll.name });
}
const importedVars = await Promise.all(
  descriptors.map((d) => figma.variables.importVariableByKeyAsync(d.key))
);
const imported = importedVars.map((variable, i) => ({
  variable,
  name: descriptors[i].name,
  collection: descriptors[i].collection,
}));

// 2. Resolve each variable to all reachable concrete RGB values (follow aliases).
async function reachableColors(variable, seen) {
  seen = seen || new Set();
  if (seen.has(variable.id)) return [];
  seen.add(variable.id);
  const out = [];
  for (const modeId of Object.keys(variable.valuesByMode)) {
    const val = variable.valuesByMode[modeId];
    if (val && val.type === "VARIABLE_ALIAS") {
      const ref = await figma.variables.getVariableByIdAsync(val.id);
      if (ref) out.push(...(await reachableColors(ref, seen)));
    } else if (val && typeof val === "object" && "r" in val) {
      out.push(val);
    }
  }
  return out;
}

// 3. Build the token color palette: list of { hex, rgb, name, id, collection }.
const palette = [];
const seenPair = new Set();
for (const item of imported) {
  for (const c of await reachableColors(item.variable)) {
    const hex = hexOf(c);
    const pairKey = item.variable.id + "@" + hex;
    if (seenPair.has(pairKey)) continue;
    seenPair.add(pairKey);
    palette.push({
      hex,
      rgb: { r: c.r, g: c.g, b: c.b },
      name: item.name,
      id: item.variable.id,
      collection: item.collection,
    });
  }
}
const exactByHex = new Map();
for (const p of palette) {
  if (!exactByHex.has(p.hex)) exactByHex.set(p.hex, []);
  exactByHex.get(p.hex).push(p);
}

// 4. Determine scope: current selection, else the whole current page.
// Skip invisible instance interiors — large speedup on heavy pages.
figma.skipInvisibleInstanceChildren = true;
const sel = figma.currentPage.selection;
const roots = sel.length ? sel : [figma.currentPage];
const scopeDesc = sel.length
  ? `selection (${sel.length} node(s))`
  : `page "${figma.currentPage.name}"`;
const nodeSet = new Map();
for (const root of roots) {
  nodeSet.set(root.id, root);
  if (typeof root.findAll === "function")
    for (const n of root.findAll(() => true)) nodeSet.set(n.id, n);
}

// 5. Collect raw (unbound) SOLID paints from fills + strokes.
function rawSolids(node, prop) {
  const paints = node[prop];
  if (!Array.isArray(paints)) return [];
  const res = [];
  paints.forEach((p, i) => {
    if (
      p.type === "SOLID" &&
      p.visible !== false &&
      !(p.boundVariables && p.boundVariables.color)
    ) {
      res.push({ prop, index: i, color: p.color });
    }
  });
  return res;
}

// 6. Classify each occurrence and aggregate by raw hex.
const agg = new Map(); // hex -> { count, rgb, locations:[] }
for (const node of nodeSet.values()) {
  for (const prop of ["fills", "strokes"]) {
    for (const hit of rawSolids(node, prop)) {
      const hex = hexOf(hit.color);
      if (!agg.has(hex))
        agg.set(hex, { count: 0, rgb: hit.color, locations: [] });
      const a = agg.get(hex);
      a.count++;
      if (a.locations.length < MAX_LOCATIONS)
        a.locations.push({
          nodeId: node.id,
          nodeName: node.name,
          prop: hit.prop,
          index: hit.index,
        });
    }
  }
}

const exact = [];
const ambiguous = [];
const near = [];
const none = [];
for (const [hex, a] of agg) {
  const hits = exactByHex.get(hex);
  if (hits && hits.length === 1) {
    exact.push({ hex, count: a.count, token: hits[0].name, varId: hits[0].id });
  } else if (hits && hits.length > 1) {
    ambiguous.push({
      hex,
      count: a.count,
      tokens: hits.map((h) => ({ name: h.name, varId: h.id })),
    });
  } else {
    let best = null;
    for (const p of palette) {
      const d = dist(a.rgb, p.rgb);
      if (!best || d < best.d) best = { d, p };
    }
    if (best && best.d <= NEAR_TOLERANCE) {
      near.push({
        hex,
        count: a.count,
        nearestToken: best.p.name,
        nearestHex: best.p.hex,
        varId: best.p.id,
        distance: Number(best.d.toFixed(4)),
      });
    } else {
      none.push({ hex, count: a.count });
    }
  }
}

const sortByCount = (arr) => arr.sort((x, y) => y.count - x.count);
return {
  scope: scopeDesc,
  nodesScanned: nodeSet.size,
  tokenColorsLoaded: palette.length,
  summary: {
    exactColors: exact.length,
    ambiguousColors: ambiguous.length,
    nearColors: near.length,
    unmatchedColors: none.length,
  },
  exact: sortByCount(exact),
  ambiguous: sortByCount(ambiguous),
  near: sortByCount(near),
  none: sortByCount(none),
};
