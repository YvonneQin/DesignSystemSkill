---
name: figma-bind-radius
description: Bind hardcoded corner radii in a Figma file to Radius design tokens. Use when the user wants to bind corner radius, "绑圆角", normalize radius values against Vision Token / Radius variables, or clean up unbound rounded corners on a page or selection.
---

# Bind Figma Corner Radius to Design Tokens

Maps hardcoded `cornerRadius` values to local Radius variables. Read-only scan first, confirm mapping, then batched write.

Scripts live at `scripts/figma/`. Paste body into `use_figma`.

## Prerequisite

Load the `figma-use` skill before any `use_figma` call.

## Workflow

```
- [ ] 1. Get Figma file URL and target page/frame node ID (from URL node-id).
- [ ] 2. Inspect Radius tokens: collection name, prefix (e.g. radius/roundedLg8).
- [ ] 3. Run scan-radius.js on the target scope → present report.
- [ ] 4. User confirms mapping for near-matches (e.g. 5→roundedMd6, 18→rounded2Xl16).
- [ ] 5. Run bind-radius.js in batches (BATCH_LIMIT=80) until complete.
- [ ] 6. Re-run scan-radius.js to verify unbound count is 0.
```

## Token naming

For "Vision Token" collection, camelCase group + fused names (`radius/roundedMd6`):
- `radius/roundedXs2`, `radius/roundedSm4`, `radius/roundedMd6`
- `radius/roundedLg8`, `radius/roundedXl12`, `radius/rounded2Xl16`
- `radius/rounded3Xl24`, `radius/rounded4Xl32`, `radius/roundedNone0`
- `radius/roundedFull999` — create if missing for pill shapes

Margin / Padding: `margin/marginMd20`, `padding/paddingLg24` (size suffix camelCase: Xxs, Sm, Md, Lg, Xl, 2Xl).

## Performance (critical)

- **Batch writes**: use `BATCH_LIMIT = 80` per call; loop until no unbound nodes remain.
- **Never parallelize** multiple bind calls on the same file — causes partial failures.
- Large component sets (900+ variants) must be processed radius-by-radius, not all at once.

## Near-match policy

When no exact token exists, bind to closest and report in audit:
- `5` → `roundedMd6` (6)
- `18` → `rounded2Xl16` (16)

Ask user before applying near-matches unless they already approved.
