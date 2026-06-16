# Design System Agent

Cursor Agent skills and Figma Plugin API scripts for design-system workflows: token creation, color/radius binding, and design normalization.

## Structure

```
tokens/                  # Ant Design–style token sources + combined theme
  groups.json            # Base + Neutral group tree
  sources/               # rdxcolors.json, mode.json, …
  dist/theme.json        # Generated (node scripts/tokens/build-theme.js)
.cursor/skills/          # Project-level Cursor skills
scripts/figma/           # Figma Plugin API snippets (paste into use_figma)
scripts/tokens/          # Node build scripts
workflows/               # Multi-step workflow guides
templates/               # Report and spec templates
```

### Token layers

| Group | Source | Figma collection |
|-------|--------|------------------|
| Base | `tokens/sources/rdxcolors.json` | Color Library |
| Neutral | `tokens/sources/mode.json` | Mode |

See [tokens/README.md](tokens/README.md).

## Prerequisites

- [Cursor](https://cursor.com) with Figma MCP enabled
- Figma account with edit access to target files
- Load `figma-use` before any `use_figma` call

## Skills

| Skill | Trigger |
|-------|---------|
| `ds-orchestrator` | Route design-system tasks to the right workflow |
| `figma-bind-colors` | Bind hardcoded colors to design tokens |
| `figma-bind-radius` | Bind hardcoded corner radii to Radius tokens |

## Quick start

1. Open this folder in Cursor.
2. Share a Figma file URL and describe the task (e.g. "bind colors on this page").
3. The agent loads the matching skill, runs read-only scans first, then writes after confirmation.

### Tokens

```bash
node scripts/tokens/build-theme.js   # → tokens/dist/theme.json
```

Edit `tokens/sources/*.json`, rebuild, then sync to Figma via `figma-generate-library`.

## Scripts

| Script | Type | Purpose |
|--------|------|---------|
| `scripts/figma/scan-colors.js` | read-only | Find unbound colors, classify matches |
| `scripts/figma/bind-colors.js` | writes | Bind colors to token variables |
| `scripts/figma/scan-radius.js` | read-only | Find unbound corner radii |
| `scripts/figma/bind-radius.js` | writes | Bind radii to Radius tokens (batched) |

## License

MIT
