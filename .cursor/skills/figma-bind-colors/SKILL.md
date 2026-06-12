---
name: figma-bind-colors
description: Bind hardcoded (unbound) SOLID colors in a Figma design file to the matching design-system color variables (tokens). Use when the user wants to map raw/hardcoded colors in a Figma file to Figma variables, clean up non-token colors, "绑色", bind colors to tokens, or normalize a hardcoded design against a design system.
---

# Bind Figma Colors to Design Tokens

Maps hardcoded SOLID fills/strokes in a Figma file to the project's design-system
color variables. Read-only scan first, confirm, then write.

Scripts live at `scripts/figma/`. Read them and paste their body
into the `use_figma` tool — they are Figma Plugin API snippets, not Node scripts.

## Prerequisite

Load the `figma-use` skill before any `use_figma` call.

## Workflow

```
- [ ] 1. Get the Figma file URL; extract fileKey. Confirm it's a /design/ file.
- [ ] 2. Inspect: where do the color tokens live? (local vars vs. team library)
- [ ] 3. Set TOKEN_COLLECTIONS in the scripts to the right collection names.
- [ ] 4. Tell the user to SELECT the target nodes (else the whole page is scanned).
- [ ] 5. Run scan-colors.js (read-only) → present the report.
- [ ] 6. User confirms. For near/ambiguous they approve, fill APPROVALS in bind-colors.js.
- [ ] 7. Run bind-colors.js (writes). Verify with a screenshot.
```

### Step 2 — Inspect token location

Run this read-only snippet via `use_figma` to see whether tokens are local or in
a published library, and to get exact collection names:

```js
const local = await figma.variables.getLocalVariableCollectionsAsync();
const lib = await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync();
return {
  localCollections: local.map((c) => c.name),
  libraryCollections: lib.map((c) => ({ name: c.name, library: c.libraryName })),
};
```

Set `TOKEN_COLLECTIONS` in both `scan-colors.js` and `bind-colors.js` to the collection names
that hold COLOR tokens (commonly `color` and `tokens`).

### Step 5 — Scan and report

Run `scripts/figma/scan-colors.js`. It classifies every raw hex into:

- **exact** — one token has this exact RGB → safe to auto-bind
- **ambiguous** — multiple tokens share this RGB → user picks which
- **near** — within `NEAR_TOLERANCE` of a token → user reviews (never auto-bound)
- **none** — no close token → reported only, left untouched

Present the report grouped by these four buckets, sorted by usage count.

### Step 7 — Bind

Run `scripts/figma/bind-colors.js`. It auto-binds exact single-candidate
matches. For approved near/ambiguous colors, fill `APPROVALS` with
`{ "#rawhex": "VariableID:xxx" }` (varId comes from the scan report). After
binding, take a `screenshot()` of an affected frame to confirm colors are intact.

## Defaults

- Scope: current selection; fall back to whole page only if nothing selected.
- Exact matches → auto-bind. Near/ambiguous → manual review, never silent.
- Unmatched colors → report only, do not create new variables unless asked.

## Performance

- **Always scope to a selection.** A whole-page scan on a heavy file times out.
- Token variables are imported in **parallel** (`Promise.all`).
- Set `figma.skipInvisibleInstanceChildren = true` before traversal.
