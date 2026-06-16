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
│   └── mapping.json      # Tailwind refs → Radix refs (for Semantic)
├── sources/              # Authoritative JSON inputs
│   ├── rdxcolors.json    # Base palettes (light_mode + dark_mode)
│   ├── mode.json         # Semantic + radius + border
│   ├── twcolors.json     # Tailwind primitives (reference only)
│   └── tokens.json       # Raw number primitives
└── dist/
    └── theme.json        # Generated combined theme (do not hand-edit)
```

## Layers

| Layer | File | Figma collection | Who uses it |
|-------|------|------------------|-------------|
| **Base** | `sources/rdxcolors.json` | `Color Library` | Palettes, charts, direct color needs |
| **Semantic** | `sources/mode.json` | `Mode` | Components, pages |
| **Mapping** | `colors/mapping.json` | — | Resolves `{neutral.950}` → `gray/12` |

Components bind **Semantic** (`mode/background`), not Base (`gray/12`), unless you are building the palette itself.

## Build combined theme

```bash
node scripts/tokens/build-theme.js
```

Produces `tokens/dist/theme.json`:

```json
{
  "Colors": {
    "Base": {
      "gray": { "1": { "light": "#fcfcfc", "dark": "#111111", "figma": "gray/1" } }
    },
    "Semantic": {
      "background": {
        "light": { "type": "alias", "ref": "white/1" },
        "dark": { "type": "alias", "ref": "gray/1" },
        "figma": "mode/background"
      }
    }
  }
}
```

## Edit workflow

1. **Change a base color** → edit `sources/rdxcolors.json` → rebuild → sync to Figma `Color Library`
2. **Change semantic mapping** → edit `sources/mode.json` or `colors/mapping.json` → rebuild → sync to Figma `Mode`
3. **Sync to Figma** → use Cursor `figma-generate-library` with `tokens/dist/theme.json` + `tokens/figma.config.json`

## Semantic overrides

`mode.json` has hardcoded hex for `semantic-background` and `semantic-border`. In Figma these alias to Base grays (see `colors/mapping.json` → `semanticOverrides`).

## white / black solids

Base `white/*` and `black/*` are solid neutral grays (no alpha). `black/6` = `#0a0a0a` (pinned anchor); `black/1` light = `#f2f2f2` … `black/10` light = `#000000`.
