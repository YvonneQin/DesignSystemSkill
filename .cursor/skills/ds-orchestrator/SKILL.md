---
name: ds-orchestrator
description: Route design-system tasks to the right skill and workflow. Use when the user asks for design system help without a specific task, or when coordinating multi-step normalization (tokens + binding + audit).
---

# Design System Orchestrator

Routes tasks to domain skills and enforces phased workflows.

## Token layout (Ant Design style)

```
Colors/
  Base/      → tokens/sources/rdxcolors.json  → Figma Color Library
  Semantic/  → tokens/sources/mode.json       → Figma Mode
```

Combined export: `tokens/dist/theme.json` (run `node scripts/tokens/build-theme.js`).
Config: `tokens/figma.config.json`, group tree: `tokens/groups.json`.

## Routing

| Intent | Skill | Workflow doc |
|--------|-------|--------------|
| Edit token JSON / build theme | — | `workflows/create-tokens.md` |
| Sync tokens to Figma | `figma-generate-library` (built-in) | `workflows/create-tokens.md` |
| Bind hardcoded colors | `figma-bind-colors` | `workflows/normalize-design.md` |
| Bind corner radii | `figma-bind-radius` | `workflows/normalize-design.md` |
| Build component library | `figma-generate-library` (built-in) | — |

## Phased execution

Every write workflow follows:

```
Phase 0 — Discovery (read-only)
Phase 1 — Report + user confirm
Phase 2 — Execute (batched if needed)
Phase 3 — Verify (screenshot / metadata)
```

Use `templates/audit-report.md` for scan output.

## Performance

- Scope to user selection when possible
- Batch writes at 80 nodes per call on heavy pages
- Never run parallel `use_figma` writes on the same file
