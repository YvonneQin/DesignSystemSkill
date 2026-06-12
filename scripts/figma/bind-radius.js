// ============================================================================
// bind-radius.js — WRITES. Bind unbound uniform corner radii to Radius tokens.
// Processes up to BATCH_LIMIT nodes per call — re-run until scan shows 0 unbound.
//
// ALWAYS run scan-radius.js first. Set RADIUS_TO_TOKEN for values without exact match.
// ============================================================================

// ---------------------------- CONFIG ----------------------------------------
const ROOT_NODE_ID = null; // e.g. '115962:128337'
const BATCH_LIMIT = 80;
const TOKEN_PREFIX = "Radius/";
const COLLECTION_NAME = "Vision Token";

// Exact radius (px) -> token name. Near-matches go here after user approval.
const RADIUS_TO_TOKEN = {
  0: "Radius/rounded-none",
  2: "Radius/rounded-xs",
  4: "Radius/rounded-sm",
  6: "Radius/rounded-md",
  8: "Radius/rounded-lg",
  12: "Radius/rounded-xl",
  16: "Radius/rounded-2xl",
  24: "Radius/rounded-3xl",
  32: "Radius/rounded-4xl",
  100: "Radius/rounded-full",
  // Near-match examples (uncomment after user approval):
  // 5: "Radius/rounded-md",
  // 18: "Radius/rounded-2xl",
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

// Create rounded-full if mapping needs it and token is missing
const modeId = collection.modes[0].modeId;
if (RADIUS_TO_TOKEN[100] && !varByName["Radius/rounded-full"]) {
  const fullVar = figma.variables.createVariable(
    "Radius/rounded-full",
    collection,
    "FLOAT"
  );
  fullVar.scopes = ["CORNER_RADIUS"];
  fullVar.setVariableCodeSyntax("WEB", "var(--rounded-full)");
  fullVar.setValueForMode(modeId, 100);
  varByName["Radius/rounded-full"] = fullVar;
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
