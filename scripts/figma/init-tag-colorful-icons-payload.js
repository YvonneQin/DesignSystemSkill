// Add left + right icons to *Tag* / Colorful — same logic as Button.
// Paste into use_figma. Avoid > and < in code (breaks MCP XML).

const page = figma.root.children.find((p) => p.name.indexOf('Tag') != -1);
await figma.setCurrentPageAsync(page);

const searchComp = figma.getNodeById('432:24');
if (!searchComp) throw new Error('SearchOutlined (432:24) missing');

const set = page.children.find((c) => c.name.indexOf('Colorful') != -1);
if (!set) throw new Error('Colorful tag set missing');

const allVars = await figma.variables.getLocalVariablesAsync();
const varByName = {};
const varById = {};
for (let i = 0; i < allVars.length; i++) {
  varByName[allVars[i].name] = allVars[i];
  varById[allVars[i].id] = allVars[i];
}

function v(name) {
  const x = varByName[name];
  if (!x) throw new Error('Missing variable: ' + name);
  return x;
}

function propKey(prefix) {
  const keys = Object.keys(set.componentPropertyDefinitions || {});
  for (let i = 0; i < keys.length; i++) {
    if (keys[i].indexOf(prefix) == 0) return keys[i];
  }
  return null;
}

function bindIconVectors(iconInstance, variable) {
  const vectors = iconInstance.findAll((n) => n.type == 'VECTOR');
  for (let i = 0; i < vectors.length; i++) {
    const vec = vectors[i];
    if (!vec.fills || !vec.fills.length) continue;
    const paint = vec.fills[0];
    if (paint.type != 'SOLID') continue;
    vec.fills = [figma.variables.setBoundVariableForPaint(paint, 'color', variable)];
  }
}

function labelColorVar(variant) {
  const label = variant.findOne((n) => n.type == 'TEXT' && n.name == 'Label');
  if (!label) return null;
  const bv = label.boundVariables && label.boundVariables.fills;
  if (!bv || !bv.length) return null;
  return varById[bv[0].id] || null;
}

const iconSizeVar = v('iconSize/iconSizeSm12');
const gapVar = v('padding/paddingXxs4');

let iconValueKey = propKey('IconValue');
if (!iconValueKey) {
  set.addComponentProperty('IconValue', 'INSTANCE_SWAP', searchComp.id);
  iconValueKey = propKey('IconValue');
}

let showLeftKey = propKey('ShowLeftIcon');
if (!showLeftKey) {
  set.addComponentProperty('ShowLeftIcon', 'BOOLEAN', true);
  showLeftKey = propKey('ShowLeftIcon');
}

let showRightKey = propKey('ShowRightIcon');
if (!showRightKey) {
  set.addComponentProperty('ShowRightIcon', 'BOOLEAN', false);
  showRightKey = propKey('ShowRightIcon');
}

const mutated = [];

for (let vi = 0; vi < set.children.length; vi++) {
  const variant = set.children[vi];
  const textVar = labelColorVar(variant);

  const removeList = [];
  for (let ci = 0; ci < variant.children.length; ci++) {
    const ch = variant.children[ci];
    if (ch.type == 'INSTANCE' && ch.name.indexOf('Icon') == 0) removeList.push(ch);
  }
  for (let ri = 0; ri < removeList.length; ri++) removeList[ri].remove();

  const left = searchComp.createInstance();
  left.name = 'Icon';
  variant.insertChild(0, left);
  left.setBoundVariable('width', iconSizeVar);
  left.setBoundVariable('height', iconSizeVar);
  if (textVar) bindIconVectors(left, textVar);
  left.componentPropertyReferences = {
    mainComponent: iconValueKey,
    visible: showLeftKey,
  };

  const right = searchComp.createInstance();
  right.name = 'Icon';
  variant.appendChild(right);
  right.setBoundVariable('width', iconSizeVar);
  right.setBoundVariable('height', iconSizeVar);
  if (textVar) bindIconVectors(right, textVar);
  right.componentPropertyReferences = {
    mainComponent: iconValueKey,
    visible: showRightKey,
  };

  variant.itemSpacing = 4;
  variant.setBoundVariable('itemSpacing', gapVar);

  mutated.push({
    variant: variant.name,
    textVar: textVar ? textVar.name : null,
    w: variant.width,
  });
}

// Re-layout Colorful grid
const PAD = 24;
const ROW_GAP = 69;
const COLORFUL_NO_X = 141;
const COLORFUL_LEFT_RIGHT = 94;
const PRESET_ORDER = [
  'Magenta', 'Blue', 'Cyan', 'Geekblue', 'Gold', 'Green', 'Lime', 'Orange', 'Purple', 'Red', 'Volcano',
];

function parseProp(name, key) {
  const parts = name.split(', ');
  for (let i = 0; i < parts.length; i++) {
    const kv = parts[i].split('=');
    if (kv[0].trim() == key) return kv[1].trim();
  }
  return null;
}

let rowY = PAD;
for (let pi = 0; pi < PRESET_ORDER.length; pi++) {
  const preset = PRESET_ORDER[pi];
  let yesNode = null;
  let noNode = null;
  for (let i = 0; i < set.children.length; i++) {
    const c = set.children[i];
    if (parseProp(c.name, 'Preset') != preset) continue;
    if (parseProp(c.name, 'Border') == 'Yes') yesNode = c;
    if (parseProp(c.name, 'Border') == 'No') noNode = c;
  }
  if (yesNode) {
    yesNode.x = Math.max(PAD, COLORFUL_LEFT_RIGHT - yesNode.width);
    yesNode.y = rowY;
  }
  if (noNode) {
    noNode.x = COLORFUL_NO_X;
    noNode.y = rowY;
  }
  rowY += ROW_GAP;
}

let maxX = 0;
let maxY = 0;
for (let i = 0; i < set.children.length; i++) {
  const c = set.children[i];
  maxX = Math.max(maxX, c.x + c.width);
  maxY = Math.max(maxY, c.y + c.height);
}
set.resize(Math.max(maxX + PAD, 80), Math.max(maxY + PAD, 60));

return {
  setId: set.id,
  iconValueKey,
  showLeftKey,
  showRightKey,
  variantCount: set.children.length,
  sample: mutated[0],
};
