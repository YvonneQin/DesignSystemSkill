// ============================================================================
// bind-radius.js — WRITES. Bind unbound uniform corner radii to Radius tokens.
// Processes up to BATCH_LIMIT nodes per call — re-run until scan shows 0 unbound.
//
// ALWAYS run scan-radius.js first. Set RADIUS_TO_TOKEN for values without exact match.
// ============================================================================

// ---------------------------- CONFIG ----------------------------------------
const ROOT_NODE_ID = null; // e.g. '115962:128337'
const BATCH_LIMIT = 80;
const TOKEN_PREFIX = "radius/";
const COLLECTION_NAME = "Vision Token";

// Exact radius (px) -> token name. Near-matches go here after user approval.
const RADIUS_TO_TOKEN = {
  0: "radius/roundedNone0",
  2: "radius/roundedXs2",
  4: "radius/roundedSm4",
  6: "radius/roundedMd6",
  8: "radius/roundedLg8",
  12: "radius/roundedXl12",
  16: "radius/rounded2Xl16",
  24: "radius/rounded3Xl24",
  32: "radius/rounded4Xl32",
  100: "radius/roundedFull999",
  999: "radius/roundedFull999",
  // Near-match examples (uncomment after user approval):
  // 5: "radius/roundedMd6",
  // 18: "radius/rounded2Xl16",
};
// ----------------------------------------------------------------------------

const collections = await figma.variables.getLocalVariableCollectionsAsync();
const collection = COLLECTION_NAME
  ? collections.find((c) => c.name === COLLECTION_NAME)
  : collections[0];
if (!collection) throw new Error(`Collection not found: ${COLLECTION_NAME}`);

const variables = await figma.variables.getLocalVariablesAsync();
const varByName = Object.fromEntries(
  variables
    .filter((v) => v.variableCollectionId === collection.id)
    .map((v) => [v.name, v])
);

// Create roundedFull · 999 if mapping needs it and token is missing
const modeId = collection.modes[0].modeId;
const FULL_RADIUS_KEY = 999;
if (RADIUS_TO_TOKEN[FULL_RADIUS_KEY] && !varByName["radius/roundedFull999"]) {
  const fullVar = figma.variables.createVariable(
    "radius/roundedFull999",
    collection,
    "FLOAT"
  );
  fullVar.scopes = ["CORNER_RADIUS"];
  fullVar.setVariableCodeSyntax("WEB", "var(--roundedFull999)");
  fullVar.setValueForMode(modeId, FULL_RADIUS_KEY);
  varByName["radius/roundedFull999"] = fullVar;
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

function bindRadius(node, variable) {
  node.setBoundVariable("topLeftRadius", variable);
  node.setBoundVariable("topRightRadius", variable);
  node.setBoundVariable("bottomLeftRadius", variable);
  node.setBoundVariable("bottomRightRadius", variable);
}

let boundCount = 0;
const boundByToken = {};

function walk(n) {
  if (boundCount >= BATCH_LIMIT) return;
  if ("topLeftRadius" in n && !n.boundVariables?.topLeftRadius) {
    const r = n.topLeftRadius;
    const uniform =
      n.topLeftRadius === n.topRightRadius &&
      n.topLeftRadius === n.bottomLeftRadius &&
      n.topLeftRadius === n.bottomRightRadius;
    if (!uniform) {
      if ("children" in n) for (const child of n.children) walk(child);
      return;
    }
    const tokenName = RADIUS_TO_TOKEN[r];
    if (!tokenName) {
      if ("children" in n) for (const child of n.children) walk(child);
      return;
    }
    const variable = varByName[tokenName];
    if (!variable) {
      if ("children" in n) for (const child of n.children) walk(child);
      return;
    }
    bindRadius(n, variable);
    boundCount++;
    boundByToken[tokenName] = (boundByToken[tokenName] || 0) + 1;
  }
  if ("children" in n && boundCount < BATCH_LIMIT) {
    for (const child of n.children) walk(child);
  }
}

if ("children" in root) {
  for (const child of root.children) walk(child);
} else {
  walk(root);
}

return {
  boundCount,
  boundByToken,
  batchLimit: BATCH_LIMIT,
  hasMore: boundCount === BATCH_LIMIT,
  hint: boundCount === BATCH_LIMIT ? "Re-run until boundCount < BATCH_LIMIT" : "Done or partial",
};
