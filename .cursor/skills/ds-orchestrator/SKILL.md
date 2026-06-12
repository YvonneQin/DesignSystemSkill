---
name: ds-orchestrator
description: Route design-system tasks to the right skill and workflow. Use when the user asks for design system help without a specific task, or when coordinating multi-step normalization (tokens + binding + audit).
---

# Design System Orchestrator

Routes tasks to domain skills and enforces phased workflows.

## Routing

| Intent | Skill | Workflow doc |
|--------|-------|--------------|
| Bind hardcoded colors | `figma-bind-colors` | `workflows/normalize-design.md` |
| Bind corner radii | `figma-bind-radius` | `workflows/normalize-design.md` |
| Create tokens | `figma-generate-library` (built-in) | — |
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
