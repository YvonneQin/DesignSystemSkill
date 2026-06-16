# Component Specs

Component-level JSON specs map foundation tokens to Figma variants. They are the **source of truth** for binding — not standalone Figma variables.

## Read Order

When initializing or editing a component, read in this order:

1. `AGENTS.md`
2. `tokens/components/README.md`
3. `_control-gene.schema.json`
4. `_control-gene.template.json`
5. the closest existing reference such as `button.json` or `tag.json`

If the task touches token meaning, naming, refs, or values, stop and get user approval before editing anything under `tokens/`.

## Source Of Truth Hierarchy

| Layer | Source of truth | Notes |
|------|------------------|-------|
| Token primitives and semantic refs | `tokens/` | user approval required for token changes |
| Component behavior and bindings | `tokens/components/{name}.json` | authoritative spec for the component |
| Figma implementation | component set in Figma | must follow the JSON spec, not the other way around |

Practical rule:

- Change the JSON spec first.
- Review the spec.
- Only then initialize or update Figma.

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
5. `scripts/figma/*.js` are `use_figma` payloads, not local Node scripts

## Adding a new control

1. Copy `_control-gene.template.json` → `{name}.json`
2. Read `_control-gene.schema.json` → `extensionGuide.{name}` for component-specific genes
3. Fill variant axes, naming, sizes, styles, and `mappingCoverage.gaps`
4. Review whether any missing foundation tokens are required
5. If token changes are needed, stop for user approval before editing `tokens/`
6. Register in `tokens/groups.json` under `Components`
7. Create or update the Figma component set from the spec
8. Verify variant count, bindings, and page structure

## Review Checklist

Before any Figma write:

- [ ] Variant axes are explicit and non-overlapping
- [ ] `variantCount` is plausible for the axes defined
- [ ] Every style token path points to existing `Neutral/*`, `Brand/*`, or approved foundation tokens
- [ ] Any hardcoded value left in the spec has a reason
- [ ] `figmaConventions` states page content and layout rules
- [ ] `mappingCoverage.gaps` is updated instead of silently ignored

After any Figma write:

- [ ] Variant count matches the spec
- [ ] Radius, spacing, and color bindings are present on sampled variants
- [ ] No extra showcase frames or doc frames were added to the page
- [ ] Follow-up screenshot or metadata check was done

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
