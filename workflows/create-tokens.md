# Create / sync tokens

Ant Design-style flow: edit sources -> build -> push to Figma.

## Steps

### 1. Edit sources

| Goal | File |
|------|------|
| Base palette color (`Base/gray/800`, `Base/blue/700`) | `tokens/sources/rdx-base-10.json` |
| Neutral / Brand semantic token refs | `tokens/sources/mode.json` and `tokens/colors/semantic-*.json` |
| Tailwind → Radix ref map | `tokens/colors/mapping.json` |

### 2. Build combined theme

```bash
npm run tokens:build
```

Check `tokens/dist/theme.json` for unresolved refs.

### 3. Sync to Figma

Use `figma-generate-library` for library-style sync, or run the specific
`scripts/figma/sync-*.js` payload through `use_figma` when doing targeted sync.

Important: `scripts/figma/*.js` are Figma Plugin API payloads, not local Node entrypoints.

| Group | Figma collection | Modes |
|-------|------------------|-------|
| `Base` | `ColorMode` | `Light`, `Dark` |
| `Neutral` | `ColorMode` | `Light`, `Dark` |
| `Brand` | `ColorMode` | `Light`, `Dark` |
| `Radius` / spacing / sizing | `Vision Token` | single mode unless defined otherwise |

Config: `tokens/figma.config.json`

### 4. Bind designs

After tokens exist in Figma:

- Colors → `figma-bind-colors`
- Radii → `figma-bind-radius`

See `workflows/normalize-design.md`.

## Group tree reference

See `tokens/groups.json` for the full sidebar structure and exact collection mappings.
