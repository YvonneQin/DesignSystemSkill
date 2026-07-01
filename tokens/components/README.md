# Component Specs

Component-level JSON specs map foundation tokens to Figma variants. They are the **source of truth** for binding — not standalone Figma variables.

## Read Order

When initializing or editing a component, read in this order:

1. `AGENTS.md`
2. `tokens/components/README.md`
3. `_dna-tree.json`
4. `rules/control.rules.json` if the component belongs to Control DNA
5. `_control-gene.schema.json`
6. `_control-gene.template.json`
7. the closest existing reference such as `button.json` or `tag.json`

If the task touches token meaning, naming, refs, or values, stop and get user approval before editing anything under `tokens/`.

## Source Of Truth Hierarchy

| Layer | Source of truth | Notes |
|------|------------------|-------|
| Token primitives and semantic refs | `tokens/` | user approval required for token changes |
| Component behavior and bindings | `tokens/components/{name}.json` | compiled compatibility spec consumed by local code |
| Editable split spec | `tokens/components/{name}/{name}.*.json` | source-of-truth when a component is decomposed into structure/variant/token/style/rule files |
| Figma implementation | component set in Figma | must follow the JSON spec, not the other way around |

Practical rule:

- Change the split spec first when it exists; otherwise change the single JSON spec.
- Regenerate or update the compiled `{name}.json` compatibility file in the same edit.
- Review the spec.
- Only then initialize or update Figma.

## Control DNA

All interactive controls (Button, Input, Select, …) share **Control DNA** genes.

| File | Purpose |
|------|---------|
| [`_dna-tree.json`](./_dna-tree.json) | Family classification tree for the whole design system |
| [`rules/control.rules.json`](./rules/control.rules.json) | Shared generation rules that keep controls in one family |
| [`_control-gene.schema.json`](./_control-gene.schema.json) | Gene definitions, token layers, appearance strategies, Figma rules |
| [`_control-gene.template.json`](./_control-gene.template.json) | Copy-paste starter for new control components |
| [`button.json`](./button.json) | Reference implementation (fully mapped) |

### Four-layer model

Use these files as four distinct layers instead of mixing everything into one component spec:

1. **DNA Tree**: classify the component family
2. **DNA Rules**: define how shared properties resolve into one family style
3. **DNA Schema**: define the required structure of component specs
4. **Component Spec**: define the concrete component output

Practical reading:

- Tree answers: "which family is this?"
- Rules answers: "how should this family behave?"
- Schema answers: "how should the spec be written?"
- Component spec answers: "what does this component resolve to?"

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

### Shared rules

The shared rules are now explicit in [`rules/control.rules.json`](./rules/control.rules.json).

- `size` controls height, padding, radius, typography, and icon size
- `variant` controls appearance strategy, semantic palette, shadow, and border style
- `state` controls interaction colors and disabled treatment
- `icon` controls slot visibility, layout mode, gap, and content visibility
- `loading` controls interactivity and spinner behavior

This is the layer that preserves family resemblance across Button, Input, Select, and future controls.

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

### Global naming rule

All Figma component naming that involves semantic meaning must follow one single baseline. The reference node is `Semantic icon 1.0` (`965:4885`) in the AgentOS Design System file.

Hard rules:

1. Never use placeholder property names such as `Property 1`, `Property 2`, `Property 3`
2. Variant axis names must be explicit domain names such as `Type`, `Variant`, `State`, `Size`, `Status`, `Preset`, `Checked`
3. Any semantic category must reuse the naming method established by `965:4885`
4. The semantic vocabulary baseline is `Type=Info|Danger|Success|Warning`
5. Never expose raw color names such as `Blue`, `Green`, `Red`, `Gold` when the intent is semantic meaning
6. Use `Variant` for visual treatment differences, not for semantic severity
7. Use `State` for interaction/runtime preview states such as `Default`, `Hover`, `Active`, `Loading`, `Disabled`
8. Use `Status` only when the component model is explicitly a status component, for example `Status=Warning`
9. Child variant names must be composed from the real axis names, for example `Type=Warning, Variant=Primary, State=Hover`

Practical mapping:

- semantic severity: `Info|Danger|Success|Warning`
- visual treatment: `Primary|Outline|Dashed|Link`
- interaction state: `Default|Hover|Active|Loading|Disabled`

This rule is global and mandatory. Any future semantic naming must be checked against `965:4885` first unless the user explicitly approves an exception.

## Adding a new control

1. Classify the component under Control DNA in `_dna-tree.json`
2. Read `rules/control.rules.json` and decide which shared rules apply unchanged
3. Copy `_control-gene.template.json` → `{name}.json`
4. Read `_control-gene.schema.json` → `extensionGuide.{name}` for component-specific genes
5. Fill variant axes, naming, sizes, styles, and `mappingCoverage.gaps`
6. Only use `ruleOverrides` when the component must intentionally diverge from shared family rules
7. Review whether any missing foundation tokens are required
8. If token changes are needed, stop for user approval before editing `tokens/`
9. Register in `tokens/groups.json` under `Components`
10. Create or update the Figma component set from the spec
11. Verify variant count, bindings, and page structure

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
