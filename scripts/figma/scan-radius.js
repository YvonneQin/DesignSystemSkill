// ============================================================================
// scan-radius.js — READ-ONLY. Find nodes with unbound uniform corner radii
// in scope and match against local Radius token variables.
//
// HOW TO RUN: paste body into use_figma (fileKey = design file).
// Set ROOT_NODE_ID to the page/frame node ID, or leave null to use selection.
// ============================================================================

// ---------------------------- CONFIG ----------------------------------------
const ROOT_NODE_ID = null; // e.g. '115962:128337' — null = selection or page
const TOKEN_PREFIX = "Radius/"; // variable name prefix for radius tokens
const COLLECTION_NAME = "Vision Token"; // null = any collection
// ----------------------------------------------------------------------------

const variables = await figma.variables.getLocalVariablesAsync();
const collections = await figma.variables.getLocalVariableCollectionsAsync();

const radiusTokens = variables
  .filter(
    (v) =>
      v.resolvedType === "FLOAT" &&
      v.name.startsWith(TOKEN_PREFIX) &&
      (!COLLECTION_NAME ||
        collections.find((c) => c.id === v.variableCollectionId)?.name ===
          COLLECTION_NAME)
  )
  .map((v) => ({
    id: v.id,
    name: v.name,
    value: Object.values(v.valuesByMode)[0],
  }))
  .sort((a, b) => a.value - b.value);

const tokenByValue = new Map();
for (const t of radiusTokens) {
  if (!tokenByValue.has(t.value)) tokenByValue.set(t.value, []);
  tokenByValue.get(t.value).push(t);
}

let root;
if (ROOT_NODE_ID) {
  root = await figma.getNodeByIdAsync(ROOT_NODE_ID);
} else {
  const sel = figma.currentPage.selection;
  root = sel.length ? sel[0] : figma.currentPage;
}
if (!root) throw new Error("Root node not found");

figma.skipInvisibleInstanceChildren = true;

const stats = {
  bound: 0,
  unbound: 0,
  byRadius: {},
  unboundByRadius: {},
  boundByToken: {},
};

function walk(n) {
  if ("topLeftRadius" in n) {
    const r = n.topLeftRadius;
    const uniform =
      n.topLeftRadius === n.topRightRadius &&
      n.topLeftRadius === n.bottomLeftRadius &&
      n.topLeftRadius === n.bottomRightRadius;
    if (!uniform || r === 0) {
      if ("children" in n) for (const child of n.children) walk(child);
      return;
    }
    stats.byRadius[r] = (stats.byRadius[r] || 0) + 1;
    const boundId = n.boundVariables?.topLeftRadius?.id;
    if (boundId) {
      stats.bound++;
      const token = variables.find((v) => v.id === boundId)?.name || boundId;
      stats.boundByToken[token] = (stats.boundByToken[token] || 0) + 1;
    } else {
      stats.unbound++;
      stats.unboundByRadius[r] = (stats.unboundByRadius[r] || 0) + 1;
    }
  }
  if ("children" in n) for (const child of n.children) walk(child);
}

function walkAll(node) {
  walk(node);
  if ("children" in node && node.type !== "COMPONENT") {
    for (const child of node.children) walkAll(child);
  } else if ("children" in node) {
    for (const child of node.children) walk(child);
  }
}

if (ROOT_NODE_ID || root.type === "PAGE" || root.type === "FRAME") {
  if ("children" in root) for (const child of root.children) walkAll(child);
  else walk(root);
} else {
  walkAll(root);
}

const suggestions = {};
for (const [r, count] of Object.entries(stats.unboundByRadius)) {
  const num = Number(r);
  const exact = tokenByValue.get(num);
  if (exact?.length === 1) {
    suggestions[r] = { token: exact[0].name, type: "exact" };
  } else if (exact?.length > 1) {
    suggestions[r] = { tokens: exact.map((t) => t.name), type: "ambiguous" };
  } else {
    let best = null;
    for (const t of radiusTokens) {
      const d = Math.abs(t.value - num);
      if (!best || d < best.d) best = { d, token: t.name };
    }
    suggestions[r] = { token: best?.token, type: "near", delta: best?.d };
  }
}

return {
  scope: ROOT_NODE_ID ? `node ${ROOT_NODE_ID}` : root.name,
  radiusTokens: radiusTokens.map((t) => ({ name: t.name, value: t.value })),
  totalBound: stats.bound,
  totalUnbound: stats.unbound,
  unboundByRadius: stats.unboundByRadius,
  boundByToken: stats.boundByToken,
  suggestions,
  isComplete: stats.unbound === 0,
};
