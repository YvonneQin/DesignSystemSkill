# Normalize Design Workflow

Bring a hardcoded Figma design in line with the design system.

## Phase 0 — Discovery

1. Open Figma file; note `fileKey` and target `node-id`.
2. Inspect variable collections (local vs library).
3. Confirm user selection scope.
4. If the user says "find it from this node", first list the exact child / descendant nodes in that node before inferring source components.

## Phase 1 — Audit (read-only)

1. Run `scan-colors.js` on selection.
2. Run `scan-radius.js` on selection.
3. Fill `templates/audit-report.md` with results.
4. **Stop and wait for user confirmation.**

## Phase 2 — Bind (writes)

1. Colors: `bind-colors.js` with approved `APPROVALS`.
2. Radii: `bind-radius.js` in batches of 80 until complete.
3. Create missing tokens only if user explicitly asked (e.g. `rounded-full`).

## Phase 3 — Verify

1. Re-run scans; confirm zero unbound (or document intentional exceptions).
2. Screenshot affected frames.
3. Summarize bound counts by token.
4. For text-style or controlled-height questions, verify by reading binding fields directly (`textStyleId`, `boundVariables.height`) and report counts, not just screenshots.
