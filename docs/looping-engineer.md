# Looping Engineer Runbook

This repo has several workflows that fit a looping execution model well: inspect state, take a narrow action, verify, and either continue or stop at a clear gate.

Use this document to decide where looping is appropriate and where it must stop for user confirmation.

## Fit Criteria

A task is a good fit for looping when all of the following are true:

- The next step is determined by the previous scan or build result
- The action can be scoped narrowly to a selection, batch, or file
- Success can be verified mechanically
- Failure can be reported without inventing new design semantics

Do not use looping to make token naming, token value, or semantic mapping decisions on its own.

## 1. Figma Audit Loop

Best for read-only discovery before any binding work.

### Inputs

- Figma `fileKey`
- Target `node-id` or explicit selection scope
- Existing token collections in the file

### Loop

1. Inspect variable collections and confirm the token source is present.
2. Run `scripts/figma/scan-colors.js` on the selection.
3. Run `scripts/figma/scan-radius.js` on the selection.
4. Fill `templates/audit-report.md`.
5. If scope is still too large or noisy, narrow the selection and repeat.

### Stop Conditions

- The report is complete enough for user review
- The remaining scope is ambiguous and needs a human decision
- The target file is missing the expected token collections

### Output

- Completed audit report
- Count summary for exact, near, ambiguous, unmatched, and unbound values
- A concrete approval list for the next write phase

## 2. Figma Bind And Verify Loop

Best for repetitive, batched normalization after user approval.

### Inputs

- Approved color mappings for ambiguous or near matches
- Approved radius fallback mappings, if exact tokens do not exist
- Selection-scoped Figma target

### Loop

1. Run `scripts/figma/bind-colors.js` for exact matches and approved overrides.
2. Run `scripts/figma/bind-radius.js` with `BATCH_LIMIT=80`.
3. Re-run `scan-colors.js` and `scan-radius.js`.
4. If unbound nodes remain and they are already approved, continue with the next batch.
5. If only exceptions remain, stop and report them.

### Stop Conditions

- All approved items are bound
- Only unapproved near matches or unmatched values remain
- A write fails repeatedly and the remaining scope needs investigation

### Output

- Bound count by token
- Residual exception list
- Verification summary from follow-up scans or screenshots

### Hard Boundaries

- Never create new tokens in this loop unless the user explicitly approved that token change
- Never switch token semantics silently just to make the scan pass

## 3. Token Build And Consistency Loop

Best for source-level validation after approved token edits or for read-only drift checks.

### Inputs

- Source files under `tokens/sources/`
- Semantic mappings under `tokens/colors/`
- Grouping config under `tokens/groups.json` and `tokens/figma.config.json`

### Loop

1. Run `npm run tokens:build`.
2. Inspect `tokens/dist/theme.json` for unresolved refs or malformed output.
3. If the issue is a structural mistake in already-approved source edits, fix it and rebuild.
4. Repeat until the build output is valid.

### Stop Conditions

- Build passes and output is structurally correct
- The next fix would change token meaning, value, naming, or refs without approval

### Output

- Clean build result
- A short list of unresolved or approval-gated issues, if any remain

### Hard Boundaries

- This loop must not introduce new token values, names, or refs without explicit approval
- Scripts in `scripts/tokens/` that write source JSON are not safe default actions

## 4. Docs And Skill Consistency Loop

Best for low-risk repo maintenance.

### Inputs

- `README.md`
- `docs/`
- `workflows/`
- `.cursor/skills/`

### Loop

1. Compare docs against the current repo structure and workflow rules.
2. Fix stale paths, inconsistent terminology, or missing entrypoints.
3. Re-read adjacent docs to ensure the change did not introduce contradictions.
4. Repeat until the task routing and safety rules are consistent.

### Stop Conditions

- The docs agree on the same workflow and safety constraints
- Remaining issues depend on product or token decisions rather than documentation

### Output

- Updated entrypoints and task routing docs
- Reduced drift between skills, workflows, and repo map

## Not Good Looping Targets

These require a human decision before execution:

- Add, rename, delete, or revalue tokens
- Rewrite Figma Variable collections
- Invent semantic token mappings for ambiguous values
- Change component semantic axes or naming vocabulary

See `.cursor/rules/design-token-confirmation.mdc`.

## Recommended Operating Split

Use looping in two buckets:

- Safe automatic loop: audit, batch bind on approved mappings, build verification, doc cleanup
- Human gate required: token semantics, new variables, collection rewrites, unresolved ambiguous mappings

If the task mixes both buckets, run the safe loop first, then stop with a precise approval request.
