import React, { useState } from 'react';
import tagSpec from '../../tokens/components/tag.json';
import { resolveColorToken, resolveTypography } from './ds-theme.js';

function resolvePalette(theme) {
  return tagSpec.palettes[theme] || tagSpec.palettes.neutral;
}

export function Tag({
  children = 'Tag',
  theme = 'pink',
  type = 'primary',
  state,
  shape = 'default',
  loading = false,
  disabled = false,
  showLeftIcon = true,
  showRightIcon = true,
  leftIcon = '⌕',
  rightIcon = '⌄',
}) {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);
  const visualState = disabled
    ? 'disabled'
    : loading
      ? 'loading'
      : state || (pressed ? 'active' : hovered ? 'hover' : 'default');
  const typography = resolveTypography(tagSpec.layout.typography.ref);
  const palette = resolvePalette(theme);
  const typeSpec = tagSpec.styles[type] || tagSpec.styles.primary;
  const stateSpec = typeSpec.states[visualState] || typeSpec.states.default;
  const backgroundRef = stateSpec.background === '{paletteBg}' ? palette.background : stateSpec.background;
  const borderRef = stateSpec.border === '{paletteBorder}' ? palette.border : stateSpec.border;
  const textRef = stateSpec.text === '{paletteText}' ? palette.text : stateSpec.text;
  const borderRadius =
    shape === 'round' ? tagSpec.shape.round.borderRadius.value : tagSpec.layout.borderRadius.value;

  const style = {
    minHeight: tagSpec.layout.height.value,
    paddingInline: tagSpec.layout.paddingInline.value,
    paddingBlock: tagSpec.layout.paddingBlock.value,
    borderRadius,
    borderWidth: stateSpec.borderStyle === 'none' ? 0 : tagSpec.layout.lineWidth.value,
    borderStyle: stateSpec.borderStyle || 'solid',
    borderColor: resolveColorToken(borderRef),
    background: resolveColorToken(backgroundRef),
    color: resolveColorToken(textRef),
    fontFamily: typography.fontFamily,
    fontSize: typography.fontSize,
    fontWeight: typography.fontWeight,
    lineHeight: `${typography.lineHeight}px`,
    opacity: disabled ? 0.72 : 1,
    cursor: disabled ? 'not-allowed' : 'pointer',
  };

  return (
    <button
      className="ds-tag"
      disabled={disabled}
      onBlur={() => setPressed(false)}
      onMouseDown={() => setPressed(true)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setPressed(false);
      }}
      onMouseUp={() => setPressed(false)}
      style={style}
      type="button"
    >
      {showLeftIcon ? <span className="ds-tag__icon">{loading ? '◌' : leftIcon}</span> : null}
      <span>{children}</span>
      {showRightIcon ? <span className="ds-tag__icon">{rightIcon}</span> : null}
    </button>
  );
}
