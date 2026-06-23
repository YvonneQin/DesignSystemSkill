import React, { useState } from 'react';
import inputSpec from '../../tokens/components/input.json';
import { resolveColorToken, resolveShadow, resolveTypography } from './ds-theme.js';

function getInputSlots({
  prefixIcon,
  prefixText,
  suffixText,
  suffixIcon,
  showPrefixIcon,
  showPrefixText,
  showSuffixText,
  showSuffixIcon,
}) {
  const prefixItems = [];
  const suffixItems = [];

  if (showPrefixIcon && prefixIcon) {
    prefixItems.push({ key: 'prefix-icon', value: prefixIcon });
  }
  if (showPrefixText && prefixText) {
    prefixItems.push({ key: 'prefix-text', value: prefixText });
  }
  if (showSuffixText && suffixText) {
    suffixItems.push({ key: 'suffix-text', value: suffixText });
  }
  if (showSuffixIcon && suffixIcon) {
    suffixItems.push({ key: 'suffix-icon', value: suffixIcon });
  }

  return { prefixItems, suffixItems };
}

export function Input({
  value = '',
  placeholder = 'Please enter',
  size = 'default',
  state,
  semantic = 'default',
  disabled = false,
  width = 360,
  prefixIcon = '⌕',
  prefixText = 'Prefix',
  suffixText = 'Suffix',
  suffixIcon = '⌄',
  showPrefixIcon = true,
  showPrefixText = true,
  showSuffixText = true,
  showSuffixIcon = true,
  onChange,
}) {
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [draftValue, setDraftValue] = useState(value);
  const [isTyping, setIsTyping] = useState(false);

  const hasValue = draftValue !== '';
  const visualState = disabled
    ? 'disabled'
    : state || (focused ? (isTyping ? 'typing' : 'focused') : hovered ? 'hover' : hasValue ? 'filled' : 'default');
  const sizeSpec = inputSpec.sizes[size] || inputSpec.sizes.default;
  const styleGroup = inputSpec.styles[semantic] || inputSpec.styles.default;
  const styleTokens = styleGroup.states[visualState] || styleGroup.states.default;
  const typography = resolveTypography(sizeSpec.typography.ref);
  const { prefixItems, suffixItems } = getInputSlots({
    prefixIcon,
    prefixText,
    suffixText,
    suffixIcon,
    showPrefixIcon,
    showPrefixText,
    showSuffixText,
    showSuffixIcon,
  });

  const wrapperStyle = {
    width,
    minHeight: sizeSpec.controlHeight.value,
    paddingInline: sizeSpec.paddingInline.value,
    gap: inputSpec.layout.gap.value,
    borderRadius: sizeSpec.borderRadius.value,
    borderWidth: inputSpec.layout.lineWidth.value,
    borderStyle: 'solid',
    borderColor: resolveColorToken(styleTokens.border),
    background: resolveColorToken(styleTokens.background),
    color: resolveColorToken(styleTokens.text),
    boxShadow: styleTokens.shadow ? resolveShadow(styleTokens.shadow) : 'none',
    fontFamily: typography.fontFamily,
    fontSize: typography.fontSize,
    fontWeight: typography.fontWeight,
    lineHeight: `${typography.lineHeight}px`,
    opacity: disabled ? 0.84 : 1,
  };

  const slotColor = resolveColorToken(styleTokens.icon);
  const inputColor = resolveColorToken(styleTokens.text);
  const placeholderColor = resolveColorToken(styleTokens.placeholder);

  return (
    <label
      className="ds-input"
      style={wrapperStyle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setIsTyping(false);
      }}
    >
      {prefixItems.length ? (
        <span className="ds-input__group">
          {prefixItems.map((item) => (
            <span className="ds-input__slot" key={item.key} style={{ color: slotColor }}>
              {item.value}
            </span>
          ))}
        </span>
      ) : null}
      <input
        className="ds-input__field"
        disabled={disabled}
        placeholder={placeholder}
        value={draftValue}
        onBlur={() => {
          setFocused(false);
          setIsTyping(false);
        }}
        onChange={(event) => {
          setDraftValue(event.target.value);
          setIsTyping(true);
          onChange?.(event);
        }}
        onFocus={() => {
          setFocused(true);
          setIsTyping(false);
        }}
        style={{
          color: inputColor,
          fontFamily: typography.fontFamily,
          fontSize: typography.fontSize,
          fontWeight: typography.fontWeight,
          lineHeight: `${typography.lineHeight}px`,
          ['--ds-input-placeholder']: placeholderColor,
        }}
      />
      {suffixItems.length ? (
        <span className="ds-input__group ds-input__group--suffix">
          {suffixItems.map((item) => (
            <span className="ds-input__slot" key={item.key} style={{ color: slotColor }}>
              {item.value}
            </span>
          ))}
        </span>
      ) : null}
    </label>
  );
}
