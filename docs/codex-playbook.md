# Codex Playbook

This is the shortest operational guide for working in this repo with Codex.

## First Read

1. `AGENTS.md`
2. `README.md`
3. `docs/repo-map.md`

Then branch by task type.

## Task Routing

| Task | Start here | Write target |
|------|------------|--------------|
| Repo cleanup / docs | `README.md`, `docs/`, `workflows/` | docs only |
| Token source change | `workflows/create-tokens.md` | `tokens/` after approval |
| Figma color / radius normalization | `workflows/normalize-design.md` | Figma via `scripts/figma/*.js` |
| Component spec / init | `tokens/components/README.md` | `tokens/components/*.json` first, then Figma |

## Hard Rules

- Read before write.
- Token changes need explicit user approval.
- `scripts/figma/*.js` are `use_figma` payloads, not local Node scripts.
- Rebuild generated output after source changes.
- Verify after writes.

## Safe Defaults

- Prefer docs and workflow cleanup over touching token data.
- Prefer editing JSON specs before touching Figma.
- Prefer selection-scoped Figma operations over whole-page operations.
- Prefer existing `Neutral/*`, `Brand/*`, and `Vision Token` paths over inventing new names.

## Local Commands

```bash
npm run tokens:build
npm run tokens:refresh-base -- /path/to/default.json
```

## When To Stop And Ask

- A token name, value, or ref needs to change
- A Figma Variable collection will be created, renamed, or rewritten
- The component API axes are ambiguous
- The target Figma scope is unclear and whole-page writes would be risky
