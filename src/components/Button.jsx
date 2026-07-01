import React, { useState } from 'react';
import buttonSpec from '../../tokens/components/button.json';
import { resolveColorToken, resolveShadow, resolveTypography } from './ds-theme.js';

function normalizeType(type) {
  if (type === 'primary') return 'default';
  if (type === 'dashed') return 'outline';
  if (type === 'text') return 'ghost';
  return type;
}

function resolveButtonStyleKey({ type, danger, theme }) {
  const normalizedType = normalizeType(type);

  if (theme === 'danger' || danger) {
    if (normalizedType === 'default') return 'danger';
    if (normalizedType === 'outline') return 'dangerOutline';
    if (normalizedType === 'ghost') return 'dangerGhost';
  }

  if (theme === 'black' && normalizedType === 'default') return 'black';
  if (theme === 'black' && normalizedType === 'outline') return 'blackOutline';
  if (theme === 'black' && normalizedType === 'ghost') return 'blackGhost';
  if (theme === 'secondary' && normalizedType === 'default') return 'secondary';

  return normalizedType;
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
  type = 'default',
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
  const resolvedState = visualState === 'loading' ? 'hover' : visualState;
  const styleKey = resolveButtonStyleKey({ type, danger, theme });
  const styleDefinition = getButtonStyleDefinition(styleKey);
  const sizeSpec = buttonSpec.sizes[size] || buttonSpec.sizes.default;
  const typographyRef = sizeSpec.typography?.ref || 'EN/Paragraph Small 13_h18_Regular';
  const typography = resolveTypography(typographyRef);
  const rawTokens = styleDefinition.states?.[resolvedState] || styleDefinition.states?.default;
  const styleTokens = patchButtonTheme(rawTokens, { type: normalizeType(type), theme, state: resolvedState });
  const borderRadius =
    shape === 'round'
      ? buttonSpec.shape?.round?.borderRadius?.value ?? 999
      : sizeSpec.borderRadius.value;
  const borderStyle = type === 'dashed' ? 'dashed' : styleDefinition.borderStyle || 'solid';
  const showLeft = loading || iconLeft;
  const minWidth = iconOnly
    ? sizeSpec.iconOnlySize?.value ?? sizeSpec.controlHeight.value
    : sizeSpec.basicMinWidth?.value ?? sizeSpec.previewWidth?.value;
  const contentGap = buttonSpec.layout.iconTextGap?.value ?? buttonSpec.layout.gap?.value ?? 8;

  const style = {
    minHeight: sizeSpec.controlHeight.value,
    minWidth,
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
      <span className="ds-button__content" style={{ gap: contentGap }}>
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
