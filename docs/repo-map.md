# Repo Map

This file is the operational map for the repository: what is authoritative, what is generated, and how Codex should approach changes.

## Top Level

| Path | Role | Edit policy |
|------|------|-------------|
| `AGENTS.md` | repo operating rules for agents | edit rarely; high impact |
| `README.md` | top-level entrypoint | safe to improve |
| `docs/` | repo documentation | safe to improve |
| `.cursor/` | project skills and rules | edit carefully |
| `tokens/` | design-token source of truth | token-change approval required |
| `scripts/` | automation and Figma payloads | safe, but Figma payload changes can be high impact |
| `workflows/` | process documentation | safe to improve |
| `templates/` | reusable report templates | safe to improve |

## Source Of Truth vs Generated

### Authoritative source files

- `tokens/sources/*.json`
- `tokens/colors/*.json`
- `tokens/groups.json`
- `tokens/figma.config.json`
- `tokens/components/*.json`

### Generated or derived files

- `tokens/dist/theme.json`

Rule: change source, then rebuild generated output.

## `tokens/`

This directory defines the design system data model.

| Path | Purpose |
|------|---------|
| `tokens/sources/rdx-base-10.json` | base palettes for `Base/*` |
| `tokens/sources/mode.json` | semantic, radius, and border-like token source data |
| `tokens/colors/mapping.json` | ref resolution and semantic overrides |
| `tokens/groups.json` | sidebar/group tree and collection metadata |
| `tokens/figma.config.json` | group-to-Figma collection mapping |
| `tokens/components/` | component DNA, schema, and spec JSON |
| `tokens/dist/theme.json` | combined build output used for sync |

Practical rule:

- If the task is about token meaning, naming, refs, or values, start in `tokens/`.
- If the task is about component binding rules, start in `tokens/components/`.

## `scripts/tokens/`

These are local Node utilities.

| Script | Purpose |
|--------|---------|
| `build-theme.js` | build `tokens/dist/theme.json` |
| `apply-default-base.js` | apply Ant Design base palettes into `rdx-base-10.json` |
| `uniformize-base-palettes.js` | normalize ramp shape while preserving palette identity |
| `regen-non-antd-base.js` | regenerate non-Ant palettes from anchors |
| `refresh-base-palettes.js` | orchestrate apply + uniformize + build |
| `update-palettes-from-figma.js` | update local palettes from Figma reference data |

Important:

- Several of these scripts write token source JSON.
- That means they require explicit user approval before use if they change token data.

## `scripts/figma/`

These files are not a conventional local app. They are payload snippets for Figma Plugin API execution through `use_figma`.

### Read-only / audit

- `scan-colors.js`
- `scan-radius.js`

### Binding / normalization writes

- `bind-colors.js`
- `bind-radius.js`

### Token sync payloads

- `sync-rdx-base-10-payload.js`
- `sync-mode-collection.js`
- `sync-radius-payload.js`
- `sync-padding-payload.js`
- `sync-margin-payload.js`
- `sync-brand-*.js`

### One-off component construction / layout payloads

- `init-tag-*.js`
- `layout-tag-variants-payload.js`
- `rebuild-palette-board.js`

Operational rule:

- Read the file first.
- Confirm whether it is read-only or write-capable.
- Never run sync payloads or token-creating payloads without explicit approval.

## `.cursor/`

This directory holds repo-local agent behavior.

| Path | Purpose |
|------|---------|
| `.cursor/rules/design-token-confirmation.mdc` | mandatory confirmation rule for token changes |
| `.cursor/skills/ds-orchestrator/` | design-system task routing |
| `.cursor/skills/figma-bind-colors/` | bind hardcoded colors workflow |
| `.cursor/skills/figma-bind-radius/` | bind hardcoded radii workflow |
| `.cursor/skills/antd-component-init/` | component init workflow |

These are instructions, not business data, so they are a good place to improve future Codex behavior.

## `workflows/`

| File | Purpose |
|------|---------|
| `create-tokens.md` | source edit -> build -> sync flow |
| `normalize-design.md` | scan -> confirm -> bind -> verify flow |

If a task spans multiple directories, start from the workflow doc before editing files.

## Safe Entry Strategy For Codex

1. Read `AGENTS.md`.
2. Identify whether the task is:
   - documentation
   - token source change
   - Figma binding
   - component spec work
   - repo plumbing
3. For token source changes, stop for approval before editing.
4. Prefer:
   - docs changes in `README.md`, `docs/`, `workflows/`
   - behavior changes in `scripts/` or `.cursor/skills/`
   - token edits only after explicit approval

## Gaps This Repo Already Has

- Top-level docs existed, but the operational entrypoint was scattered.
- Some docs refer to outdated token layout terminology.
- Figma payload scripts and local Node scripts were not clearly separated at the top level.

This repo map is meant to remove that ambiguity.
