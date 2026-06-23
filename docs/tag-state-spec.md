# Tag State Spec

Status: draft

This document records the current `Tag` colorful family token mapping and the proposed `State` expansion logic for review before any further Figma writes.

## Scope

- Component: `*Tag* / Colorful`
- Variant axes today: `Theme`, `Type`
- Current Figma default set:
  - `Primary`
  - `Outline`
  - `Dashed`
  - `Text`
  - `Link`
- Proposed state axis:
  - `Default`
  - `Hover`
  - `Loading`
  - `Active`
  - `Disabled`

## ASCII Overview

```text
Theme x Type x State

Theme
  Pink / Blue / Cyan / Indigo / Gold / Green / Lime / Orange / Purple / Red / Tomato

Type
  Primary  Outline  Dashed  Text  Link

State
  Default  Hover  Loading  Active  Disabled
```

## Default Baseline

These values describe the current default nodes and should be treated as the baseline.

```text
Primary  = soft fill tag
Outline  = soft fill + border
Dashed   = soft fill + dashed border
Text     = transparent container + theme text
Link     = transparent container + stronger theme text
```

| Type | Background | Border | Text | Icon | Extra |
|---|---|---|---|---|---|
| `Primary` | `Base/{theme}/1` | `none` | `Base/{theme}/7` | `Base/{theme}/7` | `none` |
| `Outline` | `Base/{theme}/1` | `Base/{theme}/3` | `Base/{theme}/7` | `Base/{theme}/7` | `none` |
| `Dashed` | `Base/{theme}/1` | `Base/{theme}/3` | `Base/{theme}/7` | `Base/{theme}/7` | `dashPattern = [4, 4]` |
| `Text` | `transparent` | `none` | `Base/{theme}/7` | `Base/{theme}/7` | `none` |
| `Link` | `transparent` | `none` | `Base/{theme}/6` | `Base/{theme}/6` | `none` |

## Proposed State Matrix

This follows Button-style state reasoning while preserving the current default visuals as-is.

| State \\ Type | `Primary` | `Outline` | `Dashed` | `Text` | `Link` |
|---|---|---|---|---|---|
| `Default` | bg `Base/{theme}/1`  text/icon `Base/{theme}/7` | bg `Base/{theme}/1`  border `Base/{theme}/3`  text/icon `Base/{theme}/7` | bg `Base/{theme}/1`  border `Base/{theme}/3`  text/icon `Base/{theme}/7`  dashed | bg `transparent`  text/icon `Base/{theme}/7` | bg `transparent`  text/icon `Base/{theme}/6` |
| `Hover` | bg `Base/{theme}/2`  text/icon `Base/{theme}/5` | bg `Base/{theme}/2`  border `Base/{theme}/4`  text/icon `Base/{theme}/5` | bg `Base/{theme}/2`  border `Base/{theme}/4`  text/icon `Base/{theme}/5`  dashed | bg `Neutral/Fill/colorFillSecondary`  text/icon `Base/{theme}/7` | bg `transparent`  text/icon `Base/{theme}/5` |
| `Loading` | same as `Hover` | same as `Hover` | same as `Hover` | same as `Hover` | same as `Hover` |
| `Active` | bg `Base/{theme}/2`  text/icon `Base/{theme}/8` | bg `Base/{theme}/2`  border `Base/{theme}/6`  text/icon `Base/{theme}/8` | bg `Base/{theme}/2`  border `Base/{theme}/6`  text/icon `Base/{theme}/8`  dashed | bg `Neutral/Fill/colorFillTertiary`  text/icon `Base/{theme}/8` | bg `transparent`  text/icon `Base/{theme}/8` |
| `Disabled` | bg `Neutral/Bg/colorBgContainerDisabled`  text/icon `Neutral/Text/colorTextDisabled` | bg `Neutral/Bg/colorBgContainerDisabled`  border `Neutral/Border/colorBorder`  text/icon `Neutral/Text/colorTextDisabled` | bg `Neutral/Bg/colorBgContainerDisabled`  border `Neutral/Border/colorBorder`  text/icon `Neutral/Text/colorTextDisabled`  dashed | bg `transparent`  text/icon `Neutral/Text/colorTextDisabled` | bg `transparent`  text/icon `Neutral/Text/colorTextDisabled` |

## Token References

```text
Primary family reference
  colorPrimaryBg         -> Base/indigo/1
  colorPrimaryBgHover    -> Base/indigo/2
  colorPrimaryBorder     -> Base/indigo/3
  colorPrimaryBorderHover-> Base/indigo/4
  colorPrimaryHover      -> Base/indigo/5
  colorPrimary           -> Base/indigo/6
  colorPrimaryActive     -> Base/indigo/7
  colorPrimaryTextHover  -> Base/indigo/8
  colorPrimaryText       -> Base/indigo/9
  colorPrimaryTextActive -> Base/indigo/10
```

Neutral references used by the proposal:

- `Neutral/Bg/colorBgContainerDisabled`
- `Neutral/Border/colorBorder`
- `Neutral/Text/colorTextDisabled`
- `Neutral/Fill/colorFillSecondary`
- `Neutral/Fill/colorFillTertiary`
- `Neutral/Bg/colorTransparent`

## Notes

- `Default` should not be redrawn or restyled when expanding states.
- `Loading` is intentionally aligned with `Hover`, matching Button behavior.
- `Dashed` should only differ from `Outline` by dashed stroke.
- `Link` keeps a transparent container in all states.
