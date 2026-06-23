const PAGE_ID = '162:8';
const RUN_NS = 'dsb';
const SET_NAME = '*Popover*';

const componentMatrix = [
  { title: 'WithTitle', content: 'Info', state: 'Closed' },
  { title: 'WithTitle', content: 'Info', state: 'Hover' },
  { title: 'WithTitle', content: 'Info', state: 'Open' },
  { title: 'WithTitle', content: 'Action', state: 'Closed' },
  { title: 'WithTitle', content: 'Action', state: 'Hover' },
  { title: 'WithTitle', content: 'Action', state: 'Open' },
  { title: 'NoTitle', content: 'Info', state: 'Closed' },
  { title: 'NoTitle', content: 'Info', state: 'Hover' },
  { title: 'NoTitle', content: 'Info', state: 'Open' },
  { title: 'NoTitle', content: 'Action', state: 'Closed' },
  { title: 'NoTitle', content: 'Action', state: 'Hover' },
  { title: 'NoTitle', content: 'Action', state: 'Open' }
];

const colorNames = {
  bgContainer: 'Neutral/Bg/colorBgContainer',
  bgElevated: 'Neutral/Bg/colorBgElevated',
  borderSecondary: 'Neutral/Border/colorBorderSecondary',
  borderSplit: 'Neutral/Border/colorSplit',
  text: 'Neutral/Text/colorText',
  textSecondary: 'Neutral/Text/colorTextSecondary',
  textHeading: 'Neutral/Text/colorTextHeading',
  primary: 'Brand/Primary/colorPrimary',
  primaryHover: 'Brand/Primary/colorPrimaryHover'
};

const floatNames = {
  radiusXs2: 'radius/roundedXs2',
  radiusLg: 'radius/roundedLg8',
  padding16: 'padding/padding16',
  padding8: 'padding/paddingXs8',
  controlHeight: 'controlHeight/controlHeightMd32'
};

const textStyleNames = {
  title: 'EN/Paragraph 14_h20_SemiBold',
  body: 'EN/Paragraph 14_h20_Regular'
};

const effectStyleName = 'Component/Button/secondaryShadow';
const dismissButtonVariantId = '447:328';
const primaryButtonVariantId = '447:30';

function solid(color) {
  return { type: 'SOLID', color };
}

function clonePaints(paints) {
  return JSON.parse(JSON.stringify(paints));
}

function cloneEffects(effects) {
  return JSON.parse(JSON.stringify(effects));
}

function bindPaintColor(node, paintField, variable) {
  const next = clonePaints(node[paintField]);
  next[0] = figma.variables.setBoundVariableForPaint(next[0], 'color', variable);
  node[paintField] = next;
}

function useTextStyle(node, textStyle) {
  node.textStyleId = textStyle.id;
}

function tag(node, key) {
  node.setSharedPluginData(RUN_NS, 'component', 'popover');
  node.setSharedPluginData(RUN_NS, 'key', key);
}

async function setInstanceLabel(instance, text) {
  const label = instance.findOne(n => n.type === 'TEXT' && n.name === 'Label');
  if (!label) throw new Error('Button label text node not found in instance');
  const fonts = label.getStyledTextSegments(['fontName']);
  const seen = new Set();
  for (const seg of fonts) {
    const key = `${seg.fontName.family}__${seg.fontName.style}`;
    if (seen.has(key)) continue;
    seen.add(key);
    await figma.loadFontAsync(seg.fontName);
  }
  label.characters = text;
  return [instance.id, label.id];
}

function createTextNode(name, text, textStyle, fillVariable, options = {}) {
  const node = figma.createText();
  node.name = name;
  useTextStyle(node, textStyle);
  node.characters = text;
  node.fills = [solid({ r: 0, g: 0, b: 0 })];
  bindPaintColor(node, 'fills', fillVariable);
  if (options.mode === 'WRAP') {
    node.textAutoResize = 'HEIGHT';
    node.resize(options.width || 208, Math.max(1, node.height));
  } else {
    node.textAutoResize = 'WIDTH_AND_HEIGHT';
  }
  return node;
}

function createTrigger(state, vars, styles) {
  const trigger = figma.createFrame();
  trigger.name = 'trigger';
  trigger.layoutMode = 'HORIZONTAL';
  trigger.primaryAxisSizingMode = 'AUTO';
  trigger.counterAxisSizingMode = 'FIXED';
  trigger.counterAxisAlignItems = 'CENTER';
  trigger.itemSpacing = 0;
  trigger.resize(1, 32);
  trigger.primaryAxisSizingMode = 'AUTO';
  trigger.counterAxisSizingMode = 'FIXED';
  trigger.setBoundVariable('height', vars.controlHeight);
  trigger.paddingLeft = 16;
  trigger.paddingRight = 16;
  trigger.setBoundVariable('paddingLeft', vars.padding16);
  trigger.setBoundVariable('paddingRight', vars.padding16);
  trigger.paddingTop = 0;
  trigger.paddingBottom = 0;
  trigger.topLeftRadius = 8;
  trigger.topRightRadius = 8;
  trigger.bottomLeftRadius = 8;
  trigger.bottomRightRadius = 8;
  trigger.setBoundVariable('topLeftRadius', vars.radiusLg);
  trigger.setBoundVariable('topRightRadius', vars.radiusLg);
  trigger.setBoundVariable('bottomLeftRadius', vars.radiusLg);
  trigger.setBoundVariable('bottomRightRadius', vars.radiusLg);
  trigger.strokes = [solid({ r: 0, g: 0, b: 0 })];
  trigger.strokeWeight = 1;
  bindPaintColor(trigger, 'strokes', state === 'Open' ? styles.primary : state === 'Hover' ? styles.primaryHover : styles.borderSecondary);
  trigger.fills = [solid({ r: 1, g: 1, b: 1 })];
  bindPaintColor(trigger, 'fills', styles.bgContainer);

  const label = createTextNode(
    'triggerLabel',
    'Popover trigger',
    styles.bodyStyle,
    state === 'Open' ? styles.primary : state === 'Hover' ? styles.primaryHover : styles.text,
    { mode: 'AUTO' }
  );
  trigger.appendChild(label);
  label.layoutSizingHorizontal = 'HUG';
  label.layoutSizingVertical = 'HUG';
  return trigger;
}

function createArrow(vars, styles) {
  const holder = figma.createFrame();
  holder.name = 'arrowSlot';
  holder.resize(240, 8);
  holder.fills = [];
  holder.strokes = [];
  holder.clipsContent = false;

  const arrow = figma.createRectangle();
  arrow.name = 'arrow';
  arrow.resize(10, 10);
  arrow.rotation = 45;
  arrow.x = 24;
  arrow.y = 1;
  arrow.topLeftRadius = 2;
  arrow.topRightRadius = 2;
  arrow.bottomLeftRadius = 2;
  arrow.bottomRightRadius = 2;
  arrow.setBoundVariable('topLeftRadius', vars.radiusXs2);
  arrow.setBoundVariable('topRightRadius', vars.radiusXs2);
  arrow.setBoundVariable('bottomLeftRadius', vars.radiusXs2);
  arrow.setBoundVariable('bottomRightRadius', vars.radiusXs2);
  arrow.fills = [solid({ r: 1, g: 1, b: 1 })];
  arrow.strokes = [];
  bindPaintColor(arrow, 'fills', styles.bgElevated);
  holder.appendChild(arrow);
  return { holder, arrow };
}

async function createFooter(styles, refs) {
  const footer = figma.createAutoLayout('VERTICAL');
  footer.name = 'footer';
  footer.fills = [];
  footer.strokes = [];
  footer.layoutSizingVertical = 'HUG';
  footer.itemSpacing = 8;
  footer.setBoundVariable('itemSpacing', styles.padding8);

  const divider = figma.createRectangle();
  divider.name = 'divider';
  divider.resize(240, 1);
  divider.fills = [solid({ r: 0, g: 0, b: 0 })];
  bindPaintColor(divider, 'fills', styles.borderSplit);
  footer.appendChild(divider);
  divider.layoutSizingHorizontal = 'FILL';
  divider.layoutSizingVertical = 'FIXED';

  const actions = figma.createAutoLayout('HORIZONTAL');
  actions.name = 'actions';
  actions.fills = [];
  actions.strokes = [];
  actions.layoutSizingVertical = 'HUG';
  actions.counterAxisAlignItems = 'CENTER';
  actions.primaryAxisAlignItems = 'SPACE_BETWEEN';

  const secondary = refs.dismissButtonComponent.createInstance();
  secondary.setProperties({
    'ShowLeftIcon#432:451': false,
    'ShowRightIcon#432:1353': false,
    'ShowContent#432:902': true,
    'Theme': 'Black',
    'Type': 'Text',
    'Size': 'Small',
    'State': 'Default',
    'Shape': 'Default'
  });
  actions.appendChild(secondary);
  secondary.layoutSizingHorizontal = 'HUG';
  secondary.layoutSizingVertical = 'HUG';

  const primary = refs.primaryButtonComponent.createInstance();
  primary.setProperties({
    'ShowLeftIcon#432:451': false,
    'ShowRightIcon#432:1353': false,
    'ShowContent#432:902': true,
    'Theme': 'Blue',
    'Type': 'Link',
    'Size': 'Small',
    'State': 'Default',
    'Shape': 'Default'
  });
  actions.appendChild(primary);
  primary.layoutSizingHorizontal = 'HUG';
  primary.layoutSizingVertical = 'HUG';
  const labelIds = [];
  labelIds.push(...await setInstanceLabel(secondary, 'Dismiss'));
  labelIds.push(...await setInstanceLabel(primary, 'Primary action'));
  footer.appendChild(actions);
  actions.layoutSizingHorizontal = 'FILL';

  return { footer, footerNodeIds: [divider.id, actions.id, ...labelIds] };
}

async function createOverlay(config, vars, styles, refs) {
  const overlay = figma.createAutoLayout('VERTICAL');
  overlay.name = 'overlay';
  overlay.fills = [];
  overlay.strokes = [];
  overlay.primaryAxisSizingMode = 'AUTO';
  overlay.counterAxisSizingMode = 'AUTO';
  overlay.itemSpacing = 0;
  overlay.visible = config.state === 'Open';

  const arrowBits = createArrow(vars, styles);
  overlay.appendChild(arrowBits.holder);

  const card = figma.createAutoLayout('VERTICAL');
  card.name = 'card';
  card.primaryAxisSizingMode = 'AUTO';
  card.counterAxisSizingMode = 'FIXED';
  card.resize(240, 1);
  card.primaryAxisSizingMode = 'AUTO';
  card.counterAxisSizingMode = 'FIXED';
  card.itemSpacing = 8;
  card.setBoundVariable('itemSpacing', vars.padding8);
  card.paddingLeft = 16;
  card.paddingRight = 16;
  card.paddingTop = 16;
  card.paddingBottom = 16;
  card.setBoundVariable('paddingLeft', vars.padding16);
  card.setBoundVariable('paddingRight', vars.padding16);
  card.setBoundVariable('paddingTop', vars.padding16);
  card.setBoundVariable('paddingBottom', vars.padding16);
  card.topLeftRadius = 8;
  card.topRightRadius = 8;
  card.bottomLeftRadius = 8;
  card.bottomRightRadius = 8;
  card.setBoundVariable('topLeftRadius', vars.radiusLg);
  card.setBoundVariable('topRightRadius', vars.radiusLg);
  card.setBoundVariable('bottomLeftRadius', vars.radiusLg);
  card.setBoundVariable('bottomRightRadius', vars.radiusLg);
  card.fills = [solid({ r: 1, g: 1, b: 1 })];
  bindPaintColor(card, 'fills', styles.bgElevated);
  card.effects = cloneEffects(styles.shadow.effects);

  const title = createTextNode('header', 'Popover title', styles.titleStyle, styles.textHeading, { mode: 'WRAP', width: 208 });
  title.visible = config.title === 'WithTitle';
  card.appendChild(title);
  title.textAutoResize = 'HEIGHT';
  title.resize(208, Math.max(1, title.height));
  title.layoutSizingHorizontal = 'FILL';
  title.layoutSizingVertical = 'HUG';

  const bodyText = config.content === 'Action'
    ? 'This card supports short helper text and lightweight follow-up actions.'
    : 'This is a lightweight container for supplementary information.';
  const body = createTextNode('body', bodyText, styles.bodyStyle, styles.textSecondary, { mode: 'WRAP', width: 208 });
  card.appendChild(body);
  body.textAutoResize = 'HEIGHT';
  body.resize(208, Math.max(1, body.height));
  body.layoutSizingHorizontal = 'FILL';
  body.layoutSizingVertical = 'HUG';

  let footerNodeIds = [];
  if (config.content === 'Action') {
    const footerBits = await createFooter(styles, refs);
    card.appendChild(footerBits.footer);
    footerBits.footer.layoutSizingHorizontal = 'FILL';
    footerNodeIds = footerBits.footerNodeIds;
  }

  overlay.appendChild(card);
  return {
    overlay,
    ids: [overlay.id, arrowBits.holder.id, arrowBits.arrow.id, card.id, title.id, body.id, ...footerNodeIds]
  };
}

async function createVariant(config, refs) {
  const component = figma.createComponent();
  component.name = `Title=${config.title}, Content=${config.content}, State=${config.state}`;
  tag(component, component.name);

  component.layoutMode = 'VERTICAL';
  component.primaryAxisSizingMode = 'AUTO';
  component.counterAxisSizingMode = 'AUTO';
  component.itemSpacing = 8;
  component.setBoundVariable('itemSpacing', refs.vars.padding8);
  component.fills = [];
  component.strokes = [];

  const trigger = createTrigger(config.state, refs.vars, refs.styles);
  component.appendChild(trigger);

  const overlayBits = await createOverlay(config, refs.vars, refs.styles, refs);
  component.appendChild(overlayBits.overlay);

  return {
    component,
    ids: [component.id, trigger.id, trigger.children[0].id, ...overlayBits.ids]
  };
}

const page = figma.root.children.find(p => p.id === PAGE_ID);
if (!page) throw new Error('Popover page not found');
await figma.setCurrentPageAsync(page);

for (const child of [...page.children]) {
  child.remove();
}

const varsAll = await figma.variables.getLocalVariablesAsync();
const getVar = (name) => {
  const item = varsAll.find(v => v.name === name);
  if (!item) throw new Error(`Missing variable: ${name}`);
  return item;
};
const textStyles = await figma.getLocalTextStylesAsync();
const getTextStyle = (name) => {
  const item = textStyles.find(s => s.name === name);
  if (!item) throw new Error(`Missing text style: ${name}`);
  return item;
};
const effectStyles = await figma.getLocalEffectStylesAsync();
const shadow = effectStyles.find(s => s.name === effectStyleName);
if (!shadow) throw new Error(`Missing effect style: ${effectStyleName}`);
const dismissButtonComponent = await figma.getNodeByIdAsync(dismissButtonVariantId);
const primaryButtonComponent = await figma.getNodeByIdAsync(primaryButtonVariantId);
if (!dismissButtonComponent || dismissButtonComponent.type !== 'COMPONENT') throw new Error(`Missing button variant: ${dismissButtonVariantId}`);
if (!primaryButtonComponent || primaryButtonComponent.type !== 'COMPONENT') throw new Error(`Missing button variant: ${primaryButtonVariantId}`);

await figma.loadFontAsync({ family: 'SF Pro', style: 'Regular' });
await figma.loadFontAsync({ family: 'SF Pro', style: 'Semibold' });

const refs = {
  vars: {
    bgContainer: getVar(colorNames.bgContainer),
    bgElevated: getVar(colorNames.bgElevated),
    borderSecondary: getVar(colorNames.borderSecondary),
    borderSplit: getVar(colorNames.borderSplit),
    text: getVar(colorNames.text),
    textSecondary: getVar(colorNames.textSecondary),
    textHeading: getVar(colorNames.textHeading),
    primary: getVar(colorNames.primary),
    primaryHover: getVar(colorNames.primaryHover),
    radiusXs2: getVar(floatNames.radiusXs2),
    radiusLg: getVar(floatNames.radiusLg),
    padding16: getVar(floatNames.padding16),
    padding8: getVar(floatNames.padding8),
    controlHeight: getVar(floatNames.controlHeight)
  },
  styles: {
    bgContainer: getVar(colorNames.bgContainer),
    bgElevated: getVar(colorNames.bgElevated),
    borderSecondary: getVar(colorNames.borderSecondary),
    borderSplit: getVar(colorNames.borderSplit),
    text: getVar(colorNames.text),
    textSecondary: getVar(colorNames.textSecondary),
    textHeading: getVar(colorNames.textHeading),
    primary: getVar(colorNames.primary),
    primaryHover: getVar(colorNames.primaryHover),
    titleStyle: getTextStyle(textStyleNames.title),
    bodyStyle: getTextStyle(textStyleNames.body),
    shadow,
    padding8: getVar(floatNames.padding8)
  },
  dismissButtonComponent,
  primaryButtonComponent
};

const variants = [];
const createdNodeIds = [];
for (const config of componentMatrix) {
  const result = await createVariant(config, refs);
  variants.push(result.component);
  createdNodeIds.push(...result.ids);
}

const set = figma.combineAsVariants(variants, page);
set.name = SET_NAME;
tag(set, 'component-set');
createdNodeIds.push(set.id);

const rowOrder = [
  'WithTitle|Info',
  'WithTitle|Action',
  'NoTitle|Info',
  'NoTitle|Action'
];
const columnOrder = ['Closed', 'Hover', 'Open'];
const gapX = 48;
const gapY = 40;
const rowHeights = new Map();
const colWidths = new Map();

for (const variant of set.children) {
  const rowKey = `${variant.variantProperties.Title}|${variant.variantProperties.Content}`;
  const colKey = variant.variantProperties.State;
  rowHeights.set(rowKey, Math.max(rowHeights.get(rowKey) || 0, variant.height));
  colWidths.set(colKey, Math.max(colWidths.get(colKey) || 0, variant.width));
}

const colOffsets = new Map();
let currentX = 0;
for (const colKey of columnOrder) {
  colOffsets.set(colKey, currentX);
  currentX += (colWidths.get(colKey) || 0) + gapX;
}

const rowOffsets = new Map();
let currentY = 0;
for (const rowKey of rowOrder) {
  rowOffsets.set(rowKey, currentY);
  currentY += (rowHeights.get(rowKey) || 0) + gapY;
}

for (const variant of set.children) {
  const rowKey = `${variant.variantProperties.Title}|${variant.variantProperties.Content}`;
  const colKey = variant.variantProperties.State;
  variant.x = colOffsets.get(colKey) || 0;
  variant.y = rowOffsets.get(rowKey) || 0;
}

set.x = 160;
set.y = 160;

return {
  createdNodeIds,
  mutatedNodeIds: [],
  pageId: page.id,
  componentSetId: set.id,
  componentSetName: set.name,
  variantCount: set.children.length
};
