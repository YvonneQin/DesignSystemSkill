import theme from '../tokens/dist/theme.json';
import paddingSource from '../tokens/sources/padding.json';
import marginSource from '../tokens/sources/margin.json';
import radiusSource from '../tokens/sources/radius.json';
import controlHeightSource from '../tokens/sources/control-height.json';
import iconSizeSource from '../tokens/sources/icon-size.json';
import borderSource from '../tokens/sources/mode.json';
import typographyEn from '../tokens/typography/en-text-styles.json';
import typographyCn from '../tokens/typography/cn-text-styles.json';
import effectStyles from '../tokens/effects/styles.json';

const componentModules = import.meta.glob('../tokens/components/*.json', {
  eager: true,
  import: 'default',
});
const implementationModules = import.meta.glob('./components/**/*.{js,jsx,ts,tsx}');

function flattenColorBranch(branch, prefix = []) {
  return Object.entries(branch || {}).flatMap(([key, value]) => {
    if (value && typeof value === 'object' && value.type === 'color') {
      return [{
        name: [...prefix, key].join('/'),
        figma: value.figma,
        light: value.light,
        dark: value.dark,
      }];
    }

    if (value && typeof value === 'object') {
      return flattenColorBranch(value, [...prefix, key]);
    }

    return [];
  });
}

function resolveDisplayValue(value) {
  if (value && typeof value === 'object' && value.type === 'alias') {
    return value.ref;
  }

  return value;
}

function slugToTokens(slug) {
  return slug
    .split(/[-_]/)
    .filter(Boolean)
    .map((token) => token.toLowerCase());
}

function hasImplementationForSlug(slug) {
  const slugTokens = slugToTokens(slug);

  return Object.keys(implementationModules).some((path) => {
    const normalized = path.toLowerCase();
    return slugTokens.every((token) => normalized.includes(token));
  });
}

function summarizeEffects(bucket) {
  return Object.entries(bucket || {}).map(([name, effect]) => ({
    name,
    ref: effect.ref,
    layers: Array.isArray(effect.effects) ? effect.effects.length : 0,
    preview: Array.isArray(effect.effects)
      ? effect.effects
          .map((item) => `${item.offset.x},${item.offset.y},${item.radius},${item.color}`)
          .join(' | ')
      : '',
  }));
}

function collectRefs(value, refs = new Set()) {
  if (Array.isArray(value)) {
    value.forEach((item) => collectRefs(item, refs));
    return refs;
  }

  if (!value || typeof value !== 'object') {
    return refs;
  }

  if (typeof value.ref === 'string') {
    refs.add(value.ref);
  }

  Object.values(value).forEach((item) => collectRefs(item, refs));
  return refs;
}

function buildComponentCatalog() {
  return Object.entries(componentModules)
    .filter(([path]) => {
      const fileName = path.split('/').pop() || '';
      return !fileName.startsWith('_');
    })
    .map(([path, spec]) => {
      const variants = Object.entries(spec.variants || {}).map(([name, config]) => ({
        name,
        count: Array.isArray(config.values) ? config.values.length : 0,
        appliesTo: config.appliesTo || null,
        values: Array.isArray(config.values) ? config.values.slice(0, 6) : [],
      }));

      return {
        slug: path.split('/').pop().replace('.json', ''),
        name: spec.component,
        dna: spec.dna || 'unknown',
        description: spec.$description || '',
        variantCount: spec.variantCount || 0,
        docsUrl: spec.$source?.docs || null,
        figmaUrl: spec.$source?.figma?.url || null,
        anatomy: spec.anatomy?.layers || [],
        variants,
        variantAxisCount: variants.length,
        refs: Array.from(collectRefs(spec)).sort(),
        layout: spec.layout || {},
        styleResolution: spec.styleResolution?.rules || [],
        naming: spec.naming || {},
        source: spec.$source || {},
        implementationStatus: hasImplementationForSlug(path.split('/').pop().replace('.json', ''))
          ? 'implemented'
          : 'spec-only',
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}

const semanticSwatches = flattenColorBranch(theme.Colors?.Semantic || {}).map((token) => ({
  ...token,
  lightValue: resolveDisplayValue(token.light),
  darkValue: resolveDisplayValue(token.dark),
}));

const componentCatalog = buildComponentCatalog();

function primitiveTokenRecords(collectionName, source) {
  return (source.tokens || []).map((token) => ({
    kind: 'token',
    group: collectionName,
    name: token.name,
    ref: `${collectionName}/${token.name}`,
    component: null,
    value: String(token.value),
    searchText: `${collectionName} ${token.name} ${token.value}`.toLowerCase(),
  }));
}

export function getOverviewStats() {
  return {
    tokenCount: theme.$tokenCount || 0,
    topLevelGroups: Array.isArray(theme.$groups) ? theme.$groups.length : 0,
    basePaletteCount: Object.keys(theme.Colors?.Base || {}).length,
    semanticTokenCount: semanticSwatches.length,
    componentCount: componentCatalog.length,
  };
}

export function getFoundationCollections() {
  return [
    {
      name: 'Radius',
      collection: radiusSource.collection,
      naming: radiusSource.naming,
      items: radiusSource.tokens || [],
    },
    {
      name: 'Padding',
      collection: paddingSource.collection,
      naming: paddingSource.naming,
      items: paddingSource.tokens || [],
    },
    {
      name: 'Margin',
      collection: marginSource.collection,
      naming: marginSource.naming,
      items: marginSource.tokens || [],
    },
    {
      name: 'Control Height',
      collection: controlHeightSource.collection,
      naming: controlHeightSource.naming,
      items: controlHeightSource.tokens || [],
    },
    {
      name: 'Icon Size',
      collection: iconSizeSource.collection,
      naming: iconSizeSource.naming,
      items: iconSizeSource.tokens || [],
    },
  ];
}

export function getBorderTokens() {
  return [
    ...(theme.Border
      ? Object.entries(theme.Border).map(([name, token]) => ({
          name,
          value: token.value,
          figma: token.figma,
        }))
      : []),
    ...Object.entries(borderSource.light_mode?.border || {}).map(([name, value]) => ({
      name: `light_mode.border.${name}`,
      value,
      figma: null,
    })),
  ];
}

export function getBasePaletteFamilies() {
  return Object.entries(theme.Colors?.Base || {}).map(([family, steps]) => ({
    family,
    swatches: Object.entries(steps || {}).map(([step, token]) => ({
      step,
      light: token.light,
      dark: token.dark,
      figma: token.figma,
    })),
  }));
}

export function getSemanticColorTokens() {
  return semanticSwatches;
}

export function getTypographyShowcase() {
  return [
    {
      label: 'EN',
      items: (typographyEn.styles || []).slice(0, 8),
    },
    {
      label: 'CN',
      items: (typographyCn.styles || []).slice(0, 8),
    },
  ];
}

export function getEffectShowcase() {
  return {
    global: summarizeEffects(effectStyles.global),
    component: Object.entries(effectStyles.component || {}).map(([component, bucket]) => ({
      component,
      items: summarizeEffects(bucket),
    })),
  };
}

export function getComponentCatalog() {
  return componentCatalog;
}

export function getComponentBySlug(slug) {
  return componentCatalog.find((component) => component.slug === slug) || null;
}

export function getTokenSearchRecords() {
  const records = [];

  records.push(
    ...primitiveTokenRecords('Radius', radiusSource),
    ...primitiveTokenRecords('Padding', paddingSource),
    ...primitiveTokenRecords('Margin', marginSource),
    ...primitiveTokenRecords('ControlHeight', controlHeightSource),
    ...primitiveTokenRecords('IconSize', iconSizeSource)
  );

  records.push(
    ...Object.entries(theme.Border || {}).map(([name, token]) => ({
      kind: 'token',
      group: 'Border',
      name,
      ref: token.figma || `Border/${name}`,
      component: null,
      value: String(token.value),
      searchText: `border ${name} ${token.figma || ''} ${token.value}`.toLowerCase(),
    }))
  );

  records.push(
    ...semanticSwatches.map((token) => ({
      kind: 'token',
      group: 'Semantic',
      name: token.name,
      ref: token.figma,
      component: null,
      value: `${String(token.lightValue)} | ${String(token.darkValue)}`,
      searchText: `semantic ${token.name} ${token.figma} ${String(token.lightValue)} ${String(token.darkValue)}`.toLowerCase(),
    }))
  );

  records.push(
    ...componentCatalog.flatMap((component) => [
      {
        kind: 'component',
        group: 'Component',
        name: component.name,
        ref: component.slug,
        component: component.name,
        value: `${component.variantCount} variants`,
        searchText: `${component.name} ${component.slug} ${component.dna} ${component.refs.join(' ')}`.toLowerCase(),
      },
      ...component.refs.map((ref) => ({
        kind: 'component-ref',
        group: 'Component Ref',
        name: ref.split('/').pop() || ref,
        ref,
        component: component.name,
        value: component.slug,
        searchText: `${component.name} ${component.slug} ${ref}`.toLowerCase(),
      })),
    ])
  );

  return records;
}
