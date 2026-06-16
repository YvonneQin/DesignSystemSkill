# Component Specs

Component-level JSON specs map foundation tokens to Figma variants. They are the **source of truth** for binding — not standalone Figma variables.

## Control DNA

All interactive controls (Button, Input, Select, …) share **Control DNA** genes.

| File | Purpose |
|------|---------|
| [`_control-gene.schema.json`](./_control-gene.schema.json) | Gene definitions, token layers, appearance strategies, Figma rules |
| [`_control-gene.template.json`](./_control-gene.template.json) | Copy-paste starter for new control components |
| [`button.json`](./button.json) | Reference implementation (fully mapped) |

### Three-layer token model

```
Foundation (Vision Token / ColorMode / Font / Effect)
    ↓ ref
Semantic (Brand/* · Neutral/*)
    ↓ styleResolution
Component style block (primaryDanger, textDanger, …)
    ↓ bind
Figma variant
```

### Shared genes (all controls)

| Gene | Foundation token |
|------|------------------|
| Height | `controlHeight/controlHeight{Sm24\|Md32\|Lg40}` |
| Radius | `radius/rounded{Sm4\|Lg8\|Full999}` |
| Padding | `padding/padding{Xs8\|16}` |
| Gap | `margin/marginXs8` |
| Icon | `iconSize/iconSizeMd16` |
| Typography | `EN/Paragraph 14_h20_Regular`, `EN/H6 16_h24_Regular` |

### Variant axes

- **API axes** → Figma properties: `type`, `size`, `ghost`, `danger`, `status`
- **Figma-only axes** → design states: `default`, `hover`, `focused`, `pressed`, `disabled`

### Style resolution

Cross-cutting modifiers compose via rules — do not explode variant count:

```
primary + danger → primaryDanger
text + danger    → textDanger
dashed           → default + borderStyle=dashed
```

### Figma conventions

1. One component set per semantic palette — no duplicate subsets
2. Never bind explicit Light/Dark mode on components
3. Page contains **only** the component set — no labels or showcase grids
4. Matrix layout: State columns → Type sub-columns → Size rows

## Adding a new control

1. Copy `_control-gene.template.json` → `{name}.json`
2. Read `_control-gene.schema.json` → `extensionGuide.{name}` for component-specific genes
3. Register in `tokens/groups.json` under `Components`
4. Create foundation tokens in Figma before binding
5. Build variants in Figma; bind using spec paths

## Design System tree mapping

| DNA branch | Inherits from Control Gene |
|------------|---------------------------|
| Control | height, radius, gap, states, disabled, typography |
| Overlay | semantic colors, radius, shadow (elevation) |
| Selection | states, disabled, keyboard (spec-only) |
| Navigation | states (active ≈ pressed), typography |
| Feedback | Brand semantic palettes, motion (spec-only) |
| Information | typography hierarchy, radius sm |
| Data Display | spacing, typography, empty state tokens |
| Layout | padding/margin scale |
| Visualization | semantic colors (chart-specific) |
