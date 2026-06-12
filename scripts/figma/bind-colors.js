// ============================================================================
// bind.js — WRITES. Binds hardcoded SOLID colors to design-system color
// variables. Rebuilds the same palette as scan.js, then:
//   - auto-binds every EXACT single-candidate match
//   - additionally binds any raw hex listed in APPROVALS (for near/ambiguous
//     matches the user confirmed after reviewing the scan report)
//
// ALWAYS run scan.js first and show the user the report. Only run this after
// they confirm. Operates on the current selection, else the whole page.
// ============================================================================

// ---------------------------- CONFIG ----------------------------------------
const TOKEN_COLLECTIONS = ["color", "tokens"];
// Manual approvals from the scan report: map a raw hex -> the varId to bind it
// to. Use this for near/ambiguous matches the user explicitly approved.
// Example: { "#3c82f6": "VariableID:123:456" }
const APPROVALS = {};
// Set true to bind exact single-candidate matches automatically.
const BIND_EXACT = true;
// ----------------------------------------------------------------------------

const to2 = (x) => Math.round(x * 255).toString(16).padStart(2, "0");
const hexOf = (c) => "#" + to2(c.r) + to2(c.g) + to2(c.b);

// 1. Import token color variables (in PARALLEL — sequential imports time out).
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
      descriptors.push({ key: v.key, name: v.name });
}
const importedVars = await Promise.all(
  descriptors.map((d) => figma.variables.importVariableByKeyAsync(d.key))
);
const varById = new Map();
const imported = importedVars.map((variable, i) => {
  varById.set(variable.id, variable);
  return { variable, name: descriptors[i].name };
});

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

// 2. Build hex -> single varId map for exact matches (skip ambiguous hexes).
const hexToVars = new Map();
for (const item of imported) {
  for (const c of await reachableColors(item.variable)) {
    const hex = hexOf(c);
    if (!hexToVars.has(hex)) hexToVars.set(hex, new Set());
    hexToVars.get(hex).add(item.variable.id);
  }
}
const exactBind = new Map(); // hex -> varId
if (BIND_EXACT)
  for (const [hex, ids] of hexToVars)
    if (ids.size === 1) exactBind.set(hex, [...ids][0]);

// 3. Resolve the final hex -> varId binding plan (exact + approvals).
const plan = new Map(exactBind);
for (const [hex, varId] of Object.entries(APPROVALS))
  plan.set(hex.toLowerCase(), varId);

// 4. Scope: selection, else whole page.
figma.skipInvisibleInstanceChildren = true;
const sel = figma.currentPage.selection;
const roots = sel.length ? sel : [figma.currentPage];
const nodeSet = new Map();
for (const root of roots) {
  nodeSet.set(root.id, root);
  if (typeof root.findAll === "function")
    for (const n of root.findAll(() => true)) nodeSet.set(n.id, n);
}

// 5. Bind. Clone the paint array, swap in the bound paint, reassign.
const mutatedNodeIds = new Set();
let boundCount = 0;
const skipped = [];
for (const node of nodeSet.values()) {
  for (const prop of ["fills", "strokes"]) {
    const paints = node[prop];
    if (!Array.isArray(paints)) continue;
    let changed = false;
    const next = paints.map((p) => p); // shallow clone of array
    paints.forEach((p, i) => {
      if (p.type !== "SOLID") return;
      if (p.boundVariables && p.boundVariables.color) return; // already bound
      const hex = hexOf(p.color);
      const varId = plan.get(hex);
      if (!varId) return;
      const variable = varById.get(varId);
      if (!variable) {
        skipped.push({ nodeId: node.id, hex, reason: "variable not imported" });
        return;
      }
      next[i] = figma.variables.setBoundVariableForPaint(p, "color", variable);
      changed = true;
      boundCount++;
    });
    if (changed) {
      node[prop] = next;
      mutatedNodeIds.add(node.id);
    }
  }
}

return {
  scope: sel.length ? `selection (${sel.length})` : `page "${figma.currentPage.name}"`,
  nodesScanned: nodeSet.size,
  boundPaintCount: boundCount,
  mutatedNodeCount: mutatedNodeIds.size,
  mutatedNodeIds: [...mutatedNodeIds],
  skipped,
};
