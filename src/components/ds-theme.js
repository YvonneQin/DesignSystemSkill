import theme from '../../tokens/dist/theme.json';
import semanticPrimary from '../../tokens/colors/semantic-primary.json';
import semanticSecondary from '../../tokens/colors/semantic-secondary.json';
import semanticError from '../../tokens/colors/semantic-error.json';
import semanticWarning from '../../tokens/colors/semantic-warning.json';
import semanticSuccess from '../../tokens/colors/semantic-success.json';
import semanticLink from '../../tokens/colors/semantic-link.json';
import semanticText from '../../tokens/colors/semantic-text.json';
import semanticBg from '../../tokens/colors/semantic-bg.json';
import semanticBorder from '../../tokens/colors/semantic-border.json';
import semanticFill from '../../tokens/colors/semantic-fill.json';
import semanticIcon from '../../tokens/colors/semantic-icon.json';
import effectStyles from '../../tokens/effects/styles.json';
import typographyEn from '../../tokens/typography/en-text-styles.json';

const colorRegistry = {};

function registerNamespace(namespace, sections) {
  sections.forEach((section) => {
    Object.entries(section || {}).forEach(([name, value]) => {
      colorRegistry[`${namespace}/${name}`] = value;
    });
  });
}

registerNamespace('Brand/Primary', [semanticPrimary.tokens]);
registerNamespace('Brand/Tertiary', [semanticSecondary.tokens]);
registerNamespace('Brand/Error', [semanticError.tokens]);
registerNamespace('Brand/Warning', [semanticWarning.tokens]);
registerNamespace('Brand/Success', [semanticSuccess.tokens]);
registerNamespace('Brand/Link', [semanticLink.tokens]);
registerNamespace('Neutral/Text', [semanticText.base, semanticText.semantic]);
registerNamespace('Neutral/Bg', [semanticBg.base, semanticBg.semantic]);
registerNamespace('Neutral/Border', [semanticBorder.tokens]);
registerNamespace('Neutral/Fill', [semanticFill.base, semanticFill.semantic]);
registerNamespace('Neutral/Icon', [semanticIcon.semantic]);

const effectRegistry = {
  ...Object.fromEntries(
    Object.entries(effectStyles.global || {}).map(([name, value]) => [value.ref, value.effects || []])
  ),
  ...Object.fromEntries(
    Object.values(effectStyles.component || {}).flatMap((bucket) =>
      Object.entries(bucket || {}).map(([name, value]) => [value.ref, value.effects || []])
    )
  ),
};

const typeRegistry = Object.fromEntries(
  (typographyEn.styles || []).map((style) => [style.ref, style])
);

function qualifyRef(currentPath, ref) {
  if (ref.includes('/')) {
    return ref;
  }

  const namespace = currentPath.split('/').slice(0, -1).join('/');
  return `${namespace}/${ref}`;
}

function resolveBaseColor(ref) {
  const parts = ref.split('/');
  const family = parts[1];
  const step = parts[2];
  return theme.Colors?.Base?.[family]?.[step]?.light || ref;
}

function resolveNodeValue(currentPath, node, seen) {
  if (!node || typeof node !== 'object') {
    return node;
  }

  if (node.light) {
    if (node.light.value !== undefined) {
      return node.light.value;
    }
    if (node.light.ref) {
      return resolveColorToken(qualifyRef(currentPath, node.light.ref), seen);
    }
  }

  if (node.value !== undefined) {
    return node.value;
  }

  if (node.ref) {
    return resolveColorToken(qualifyRef(currentPath, node.ref), seen);
  }

  return currentPath;
}

export function resolveColorToken(path, seen = new Set()) {
  if (!path) {
    return 'transparent';
  }

  if (path === 'transparent' || path.startsWith('rgba') || path.startsWith('#')) {
    return path;
  }

  if (seen.has(path)) {
    return path;
  }

  seen.add(path);

  if (path.startsWith('Base/')) {
    return resolveBaseColor(path);
  }

  const node = colorRegistry[path];
  if (!node) {
    return path;
  }

  return resolveNodeValue(path, node, seen);
}

export function resolveShadow(ref) {
  const effects = effectRegistry[ref];
  if (!effects || !effects.length) {
    return 'none';
  }

  return effects
    .map((effect) => {
      const inset = effect.type === 'INNER_SHADOW' ? 'inset ' : '';
      return `${inset}${effect.offset.x}px ${effect.offset.y}px ${effect.radius}px ${effect.spread}px ${effect.color}`;
    })
    .join(', ');
}

export function resolveTypography(ref) {
  return typeRegistry[ref] || typeRegistry['EN/Paragraph 14_h20_Regular'];
}
