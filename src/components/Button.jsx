import React, { useState } from 'react';
import buttonSpec from '../../tokens/components/button.json';
import { resolveColorToken, resolveShadow, resolveTypography } from './ds-theme.js';

function resolveButtonStyleKey({ type, danger, theme }) {
  if (theme === 'danger' || danger) {
    if (type === 'primary') return 'primaryDanger';
    if (type === 'outline') return 'outlineDanger';
    if (type === 'dashed') return 'dashedDanger';
    if (type === 'text') return 'textDanger';
  }

  if (type === 'ghost' && theme === 'primary') return 'primaryGhost';
  if (type === 'ghost' && theme === 'secondary') return 'secondaryGhost';
  if (type === 'dashed') return 'dashed';
  if (theme === 'secondary' && type === 'primary') return 'secondary';

  return type;
}

function getButtonStyleDefinition(styleKey) {
  const style = buttonSpec.styles[styleKey];
  if (!style) {
    return buttonSpec.styles.outline;
  }

  if (!style.extends) {
    return style;
  }

  return {
    ...getButtonStyleDefinition(style.extends),
    ...style,
  };
}

function patchButtonTheme(styleTokens, { type, theme, state }) {
  if (theme === 'secondary' && (type === 'outline' || type === 'dashed' || type === 'ghost')) {
    const border =
      state === 'active'
        ? 'Brand/Tertiary/colorTertiaryActive'
        : state === 'hover' || state === 'loading'
          ? 'Brand/Tertiary/colorTertiaryHover'
          : 'Brand/Tertiary/colorTertiary';

    return {
      ...styleTokens,
      border,
      text: border,
    };
  }

  if (theme === 'primary' && (type === 'outline' || type === 'dashed' || type === 'ghost') && state === 'default') {
    return {
      ...styleTokens,
      border: 'Brand/Primary/colorPrimary',
      text: 'Brand/Primary/colorPrimary',
    };
  }

  return styleTokens;
}

export function Button({
  children = 'Button',
  type = 'primary',
  size = 'default',
  state,
  shape = 'default',
  theme = 'primary',
  danger = false,
  loading = false,
  disabled = false,
  iconLeft = null,
  iconRight = null,
  iconOnly = false,
  onClick,
}) {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);
  const visualState = disabled
    ? 'disabled'
    : loading
      ? 'loading'
      : state || (pressed ? 'active' : hovered ? 'hover' : 'default');
  const styleKey = resolveButtonStyleKey({ type, danger, theme });
  const styleDefinition = getButtonStyleDefinition(styleKey);
  const sizeSpec = buttonSpec.sizes[size] || buttonSpec.sizes.default;
  const typographyRef =
    size === 'large' ? buttonSpec.typography.lgNormal.ref : 'EN/Paragraph Small 13_h18_Regular';
  const typography = resolveTypography(typographyRef);
  const rawTokens = styleDefinition.states?.[visualState] || styleDefinition.states?.default;
  const styleTokens = patchButtonTheme(rawTokens, { type, theme, state: visualState });
  const borderRadius =
    shape === 'round'
      ? buttonSpec.shape.round.borderRadius.value
      : sizeSpec.borderRadius.value;
  const borderStyle = styleDefinition.borderStyle || 'solid';
  const showLeft = loading || iconLeft;

  const style = {
    minHeight: sizeSpec.controlHeight.value,
    minWidth: iconOnly ? sizeSpec.iconOnlySize.value : sizeSpec.basicMinWidth?.value,
    paddingInline: iconOnly ? 0 : sizeSpec.paddingInline.value,
    paddingBlock: 0,
    borderRadius,
    borderWidth: borderStyle === 'none' ? 0 : buttonSpec.layout.lineWidth.value,
    borderStyle,
    borderColor: resolveColorToken(styleTokens.border),
    background: resolveColorToken(styleTokens.background),
    color: resolveColorToken(styleTokens.text),
    boxShadow: styleTokens.shadow ? resolveShadow(styleTokens.shadow) : 'none',
    fontFamily: typography.fontFamily,
    fontSize: typography.fontSize,
    fontWeight: typography.fontWeight,
    lineHeight: `${typography.lineHeight}px`,
    opacity: disabled ? 0.8 : 1,
    cursor: disabled ? 'not-allowed' : 'pointer',
    transform: pressed && !disabled ? 'translateY(1px)' : 'translateY(0)',
  };

  return (
    <button
      className="ds-button"
      disabled={disabled}
      onBlur={() => setPressed(false)}
      onClick={onClick}
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
      <span className="ds-button__content" style={{ gap: buttonSpec.layout.iconTextGap.value }}>
        {showLeft ? (
          <span className={loading ? 'ds-button__icon ds-button__icon--spin' : 'ds-button__icon'}>
            {loading ? '◌' : iconLeft}
          </span>
        ) : null}
        {!iconOnly ? <span>{children}</span> : null}
        {iconRight ? <span className="ds-button__icon">{iconRight}</span> : null}
      </span>
    </button>
  );
}
