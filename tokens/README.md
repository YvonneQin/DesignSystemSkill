# Design Tokens

Ant Design–style token layout: **Base**, **Neutral**, and **Brand** are sibling top-level groups in Figma `ColorMode`.

## Group tree (Figma Variables sidebar)

```
Base/              → Radix palettes (gray, blue, …)     330
Neutral/           → Text, Icon, Fill, Bg, Border        32
Brand/             → Primary, Success, Warning, …        53
radius/            → roundedMd6, …
margin/            → marginMd20, …
padding/           → paddingMd20, …
```

## Directory layout

```
tokens/
├── groups.json           # Group tree manifest (sidebar structure)
├── figma.config.json     # Group → Figma collection mapping
├── colors/
│   └── mapping.json      # Tailwind refs → Base aliases (for Neutral mode refs)
├── sources/              # Authoritative JSON inputs
│   ├── rdx-base-10.json  # Base palettes (Light + Dark)
│   ├── mode.json         # Neutral mode refs + numeric tokens such as radius/border
│   ├── twcolors.json     # Tailwind primitives (reference only)
│   └── tokens.json       # Raw number primitives
└── dist/
    └── theme.json        # Generated combined theme (do not hand-edit)
```

## Layers

| Layer | File | Figma collection | Who uses it |
|-------|------|------------------|-------------|
| **Base** | `sources/rdx-base-10.json` | `ColorMode` | Palettes, chart colors, direct primitive access |
| **Neutral** | `sources/mode.json` + `colors/semantic-*.json` | `ColorMode` | Components and page semantics |
| **Brand** | `colors/semantic-*.json` | `ColorMode` | Brand palettes such as Primary, Error, Success |
| **Mapping** | `colors/mapping.json` | — | Resolves `{neutral.950}` → `Base/gray/900` |

Components should bind **Neutral** or **Brand** tokens, not raw `Base/*`, unless you are building palettes or deliberate primitive-only assets.

## Build combined theme

```bash
node scripts/tokens/build-theme.js
```

Produces `tokens/dist/theme.json`:

```json
{
  "Colors": {
    "Base": {
      "gray": { "50": { "light": "#fcfcfc", "dark": "#111111", "figma": "Base/gray/50" } }
    },
    "Semantic": {
      "colorBgBase": {
        "light": { "type": "alias", "ref": "Base/white/50" },
        "dark": { "type": "alias", "ref": "Base/gray/50" },
        "figma": "Neutral/colorBgBase"
      }
    }
  }
}
```

## Edit workflow

1. **Change a base color** -> edit `sources/rdx-base-10.json` -> rebuild -> sync to Figma `ColorMode`
2. **Change Neutral refs** -> edit `sources/mode.json` or `colors/mapping.json` -> rebuild -> sync to Figma `ColorMode`
3. **Change Brand refs** -> edit `colors/semantic-*.json` if the semantic palette itself changes
4. **Sync to Figma** -> use `figma-generate-library` or the targeted `scripts/figma/sync-*.js` payloads

## Mapping overrides

`mode.json` has hardcoded hex for `semantic-background` and `semantic-border`. In Figma these alias to Base grays (see `colors/mapping.json` → `semanticOverrides`).

## white / black solids

Base `white/*` and `black/*` are solid neutral grays (no alpha). `black/500` = `#0a0a0a` (pinned anchor); `black/50` light = `#f2f2f2` … `black/900` light = `#000000`.
