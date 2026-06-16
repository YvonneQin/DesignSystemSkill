# Ant Design Component Init — Reference

## Figma file constants

| Item | Value |
|------|-------|
| File | AgentOS Design System |
| fileKey | `MwUyizdlqXKyFzHJWvBtI8` |
| URL | https://www.figma.com/design/MwUyizdlqXKyFzHJWvBtI8/AgentOS-Design-System |
| Collections | `Vision Token` (spacing, radius, controlHeight, iconSize), `ColorMode` (Brand, Neutral), `Font`, `Effect` |

## Button reference (implemented)

Use `tokens/components/button.json` as the gold standard.
Use `tokens/components/tag.json` as the main non-control-family reference.

### Variant axes (450 variants)

```
Theme=Blue|Black|Red
Type=Primary|Outline|Dashed|Text|Link
Size=Large|Default|Small
State=Default|Hover|Loading|Active|Disabled
Ghost=False
Shape=Default|Round
```

### styleResolution highlights

- `theme=black + type=primary` → secondary styles
- `theme=red + type=*` → danger style blocks
- `type=outline` → antd `default` (Outlined)
- `type=dashed` → outline + `borderStyle=dashed`

### Per-size tokens (Button)

| Size | controlHeight | paddingInline | iconSize | radius (Default shape) |
|------|---------------|---------------|----------|------------------------|
| small | controlHeightSm24 | padding6 | iconSizeSm12 | roundedSm4 |
| default | controlHeightMd32 | paddingXs8 | iconSizeMd16 | roundedLg8 |
| large | controlHeightLg40 | paddingSm12 | iconSizeMd16 | roundedLg8 |

Round shape: `radius/roundedFull999` for all sizes.

### Component properties (Button)

| Property | Type | Binds to |
|----------|------|----------|
| IconValue | INSTANCE_SWAP | Icon.mainComponent (left + right) |
| ShowLeftIcon | BOOLEAN | left Icon.visible |
| ShowContent | BOOLEAN | Label.visible |
| ShowRightIcon | BOOLEAN | right Icon.visible |

### Anatomy (Button)

```
container (auto-layout, HUG width)
└── content (horizontal, center, gap=paddingXxs4)
    ├── Icon (INSTANCE, 16×16 or 12×12)
    ├── Label (TEXT)
    └── Icon (INSTANCE)
```

## Spec JSON checklist

When reviewing `{component}.json` before Figma init:

- [ ] `variantCount` matches Cartesian product of axes (minus composed rules)
- [ ] Every `styles.*.states.*` value is a token path or `null`
- [ ] `sizes.*` refs exist in `tokens/sources/` or `tokens/groups.json`
- [ ] `antd.examples` cover main prop combinations
- [ ] `figmaConventions.pageContent` states page = component set only
- [ ] `mappingCoverage.gaps` lists unmapped Ant Design constants
- [ ] any remaining hardcoded values have an explicit reason in the JSON

## Component family split

| Family | Primary reference | Notes |
|--------|-------------------|-------|
| `control` | `button.json` | full Control DNA example |
| `feedback` | `tag.json` | separate component sets by family are acceptable |

Rule:

- Prefer `button.json` when the component behaves like a control.
- Prefer `tag.json` when the component is not Control DNA and has family-specific layout or preset-color behavior.

## Figma binding snippets

Scripts live in `scripts/figma/`. Read and paste body into `use_figma` — not Node scripts.

### Bind FLOAT variable to layout prop

```js
node.setBoundVariable('paddingLeft', variable);
node.setBoundVariable('width', variable);
```

### Bind color to stroke / fill

```js
const newPaint = figma.variables.setBoundVariableForPaint(paint, 'color', variable);
node.strokes = [newPaint]; // or node.fills = [newPaint]
```

### Bind icon inside INSTANCE

```js
const vectors = iconInstance.findAll((n) => n.type === 'VECTOR');
for (const v of vectors) {
  const newPaint = figma.variables.setBoundVariableForPaint(v.fills[0], 'color', variable);
  v.fills = [newPaint];
}
```

### INSTANCE_SWAP + BOOLEAN

```js
icon.componentPropertyReferences = {
  ...(icon.componentPropertyReferences || {}),
  mainComponent: 'IconValue#<id>',
  visible: 'ShowLeftIcon#<id>',
};
```

## Ant Design → Figma axis mapping (controls)

| antd prop | Typical Figma axis | Notes |
|-----------|-------------------|-------|
| `type` | Type | Map `default` → Outline |
| `size` | Size | large / default / small |
| `danger` | Theme=Red or Danger | Prefer Theme axis in merged sets |
| `ghost` | Ghost | boolean |
| `disabled` | State=Disabled | design preview, not a runtime prop |
| `loading` | State=Loading | spinner layer optional |
| `shape` | Shape | default / round / circle |

## New component prompt template

When user says "initialize {Component}":

1. Which antd props are in scope for v1?
2. Does it share Control DNA (`dna: control`) or another branch?
3. Any Theme axis (Blue/Black/Red) or single palette?
4. Icon / prefix / suffix slots?

Default: follow Button patterns unless component docs say otherwise.

## Codex execution rule

Before calling `use_figma`, the repo JSON spec should already be reviewable on disk.
