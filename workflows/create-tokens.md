# Create / sync tokens

Ant Design–style flow: edit sources → build → push to Figma.

## Steps

### 1. Edit sources

| Goal | File |
|------|------|
| Palette color (gray/9, blue/8…) | `tokens/sources/rdxcolors.json` |
| Semantic token (background, primary…) | `tokens/sources/mode.json` |
| Tailwind → Radix ref map | `tokens/colors/mapping.json` |

### 2. Build combined theme

```bash
node scripts/tokens/build-theme.js
```

Check `tokens/dist/theme.json` for unresolved refs.

### 3. Sync to Figma

Load Cursor skill `figma-generate-library`.

| Group | Figma collection | Modes |
|-------|------------------|-------|
| `Base` | Color Library | Light, Dark |
| `Neutral` | Mode | Light, Dark |

Config: `tokens/figma.config.json`

### 4. Bind designs

After tokens exist in Figma:

- Colors → `figma-bind-colors`
- Radii → `figma-bind-radius`

See `workflows/normalize-design.md`.

## Group tree reference

See `tokens/groups.json` for the full sidebar structure (Base palettes list, Semantic categories).
