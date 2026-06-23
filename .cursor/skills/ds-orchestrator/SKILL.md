---
name: ds-orchestrator
description: Route design-system tasks to the right skill and workflow. Use when the user asks for design system help without a specific task, or when coordinating multi-step normalization (tokens + binding + audit).
---

# Design System Orchestrator

Routes tasks to domain skills and enforces phased workflows.

## Token layout (Ant Design style)

```
ColorMode/
  Base/      → tokens/sources/rdx-base-10.json
  Neutral/   → tokens/sources/mode.json + tokens/colors/semantic-*.json
  Brand/     → tokens/colors/semantic-*.json

Vision Token/
  radius/, margin/, padding/, controlHeight/, iconSize/
```

Combined export: `tokens/dist/theme.json` (run `node scripts/tokens/build-theme.js`).
Config: `tokens/figma.config.json`, group tree: `tokens/groups.json`.

Important: `scripts/figma/*.js` are Figma Plugin API payloads for `use_figma`, not local Node scripts.

## Routing

| Intent | Skill | Workflow doc |
|--------|-------|--------------|
| Edit token JSON / build theme | — | `workflows/create-tokens.md` |
| Sync tokens to Figma | `figma-generate-library` (built-in) | `workflows/create-tokens.md` |
| Bind hardcoded colors | `figma-bind-colors` | `workflows/normalize-design.md` |
| Bind corner radii | `figma-bind-radius` | `workflows/normalize-design.md` |
| Wash / normalize a component end-to-end | `wash-component` | `workflows/normalize-design.md` + `tokens/components/README.md` |
| Init Ant Design component (spec + Figma) | `antd-component-init` | `tokens/components/README.md` |
| Build component library | `figma-generate-library` (built-in) | — |

## Phased execution

Every write workflow follows:

```
Phase 0 — Discovery (read-only)
Phase 1 — Report + user confirm
Phase 2 — Execute (batched if needed)
Phase 3 — Verify (screenshot / metadata)
```

**Design token 变更**：Phase 1 必须单独列出拟改 token（路径、旧值→新值、影响），**未获用户明确同意不得进入 Phase 2**。详见 `.cursor/rules/design-token-confirmation.mdc`。

Use `templates/audit-report.md` for scan output.

## Performance

- Scope to user selection when possible
- Batch writes at 80 nodes per call on heavy pages
- Never run parallel `use_figma` writes on the same file
