# Design System Skill Repo

Design-system workspace for token sources, Figma sync payloads, normalization scripts, and project-level agent skills.

This repo is organized so Codex can work here safely:

- `tokens/` is the source of truth for token data
- `scripts/tokens/` contains local Node utilities
- `scripts/figma/` contains Figma Plugin API payloads for `use_figma`
- `.cursor/skills/` contains task-routing and workflow instructions
- `workflows/` contains the human-readable process docs

## Start Here

1. Read [AGENTS.md](./AGENTS.md) for repository rules.
2. Read [docs/repo-map.md](./docs/repo-map.md) for the actual structure.
3. Use the npm scripts below for local token workflows.
4. Treat `scripts/figma/*.js` as Figma payloads, not normal Node scripts.

## Safety Rule

Do not change token values, names, refs, or Figma Variables without explicit user approval.

This includes changes under:

- `tokens/sources/`
- `tokens/colors/`
- `tokens/groups.json`
- `tokens/figma.config.json`
- any Figma token sync payload

Read-only audits and binding existing nodes to already-approved tokens are allowed.

## Repo Map

| Path | Purpose | Notes |
|------|---------|-------|
| `tokens/` | canonical token definitions and generated theme | authoritative data lives here |
| `tokens/dist/theme.json` | generated combined export | rebuild, do not hand-edit |
| `tokens/components/` | component spec JSON and control DNA schema | component-token mapping source |
| `scripts/tokens/` | local Node scripts for token build/refresh | safe local entrypoints |
| `scripts/figma/` | Figma Plugin API snippets | paste into `use_figma` |
| `.cursor/skills/` | project skills for routing tasks | Cursor-oriented, still useful reference |
| `.cursor/rules/` | repo safety rules | token confirmation rule lives here |
| `workflows/` | step-by-step process docs | use for repeatable execution |
| `templates/` | report templates | audit/reporting helpers |

More detail: [docs/repo-map.md](./docs/repo-map.md)

## Common Commands

```bash
npm run tokens:build
npm run tokens:refresh-base -- /path/to/default.json
npm run tokens:apply-default-base -- /path/to/default.json
npm run tokens:uniformize-base -- /path/to/default.json
npm run tokens:regen-non-antd-base
npm run tokens:update-palettes-from-figma
```

## Common Workflows

| Goal | Read first | Main command / script |
|------|------------|------------------------|
| Edit token JSON and rebuild theme | `workflows/create-tokens.md` | `npm run tokens:build` |
| Sync tokens to Figma | `workflows/create-tokens.md` | `scripts/figma/sync-*.js` via `use_figma` |
| Audit hardcoded colors / radii | `workflows/normalize-design.md` | `scan-colors.js`, `scan-radius.js` |
| Bind colors / radii | `workflows/normalize-design.md` | `bind-colors.js`, `bind-radius.js` |
| Initialize component specs | `tokens/components/README.md` | component JSON + Figma workflow |

## Figma Conventions

- Default to read-only scan before any write.
- Scope to selection on heavy pages.
- Batch write operations where the scripts expect it.
- Verify with a follow-up scan or screenshot after writes.
- Keep component pages focused on the component set only.

## Token Model

Current top-level token groups are:

- `Base`
- `Neutral`
- `Brand`
- `Radius`
- `Margin`
- `Padding`
- `Border`

See [tokens/README.md](./tokens/README.md) and [tokens/groups.json](./tokens/groups.json) for the exact mapping.
