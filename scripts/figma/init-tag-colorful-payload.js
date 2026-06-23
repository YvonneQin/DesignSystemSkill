// Initialize *Tag* / Colorful on AgentOS Tag page. Paste body into use_figma.
// Avoid === in this file (MCP JSON escaping).

const page = figma.root.children.find((p) => p.name.indexOf('Tag') > -1);
await figma.setCurrentPageAsync(page);

const PRESETS = [
  ['Magenta', 'pink'],
  ['Blue', 'blue'],
  ['Cyan', 'cyan'],
  ['Geekblue', 'indigo'],
  ['Gold', 'gold'],
  ['Green', 'green'],
  ['Lime', 'lime'],
  ['Orange', 'orange'],
  ['Purple', 'purple'],
  ['Red', 'red'],
  ['Volcano', 'tomato'],
];

const allVars = await figma.variables.getLocalVariablesAsync();
const varByName = {};
for (let i = 0; i < allVars.length; i++) {
  varByName[allVars[i].name] = allVars[i];
}

function v(name) {
  const x = varByName[name];
  if (!x) throw new Error('Missing variable: ' + name);
  return x;
}

function bindPaint(node, field, paintIndex, variable) {
  const arr = field == 'fills' ? node.fills : node.strokes;
  if (!arr || !arr.length) return;
  const paint = arr[paintIndex];
  if (!paint || paint.type != 'SOLID') return;
  const next = figma.variables.setBoundVariableForPaint(paint, 'color', variable);
  const clone = arr.slice();
  clone[paintIndex] = next;
  if (field == 'fills') node.fills = clone;
  else node.strokes = clone;
}

await figma.loadFontAsync({ family: 'SF Pro Text', style: 'Regular' });

const radiusVar = v('radius/roundedSm4');
const padXVar = v('padding/paddingXs8');

const components = [];

for (let pi = 0; pi < PRESETS.length; pi++) {
  const presetName = PRESETS[pi][0];
  const palette = PRESETS[pi][1];
  const bgVar = v('Base/' + palette + '/50');
  const borderVar = v('Base/' + palette + '/200');
  const textVar = v('Base/' + palette + '/600');

  for (let bi = 0; bi < 2; bi++) {
    const borderYes = bi == 0;
    const borderLabel = borderYes ? 'Yes' : 'No';
    const comp = figma.createComponent();
    comp.name = 'Preset=' + presetName + ', Border=' + borderLabel;
    comp.layoutMode = 'HORIZONTAL';
    comp.primaryAxisAlignItems = 'CENTER';
    comp.counterAxisAlignItems = 'CENTER';
    comp.paddingLeft = 8;
    comp.paddingRight = 8;
    comp.paddingTop = 1;
    comp.paddingBottom = 1;
    comp.itemSpacing = 0;
    comp.cornerRadius = 4;
    comp.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
    comp.strokes = borderYes ? [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }] : [];
    comp.strokeWeight = borderYes ? 1 : 0;
    comp.layoutSizingHorizontal = 'HUG';
    comp.layoutSizingVertical = 'HUG';

    comp.setBoundVariable('paddingLeft', padXVar);
    comp.setBoundVariable('paddingRight', padXVar);
    comp.setBoundVariable('topLeftRadius', radiusVar);
    comp.setBoundVariable('topRightRadius', radiusVar);
    comp.setBoundVariable('bottomLeftRadius', radiusVar);
    comp.setBoundVariable('bottomRightRadius', radiusVar);

    bindPaint(comp, 'fills', 0, bgVar);
    if (borderYes) bindPaint(comp, 'strokes', 0, borderVar);

    const label = figma.createText();
    label.name = 'Label';
    label.fontName = { family: 'SF Pro Text', style: 'Regular' };
    label.fontSize = 12;
    label.lineHeight = { unit: 'PIXELS', value: 20 };
    label.characters = presetName;
    label.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }];
    bindPaint(label, 'fills', 0, textVar);
    comp.appendChild(label);

    components.push(comp);
  }
}

const set = figma.combineAsVariants(components, page, page.children.length);
set.name = '*Tag* / Colorful';
set.x = 0;
set.y = 0;

return {
  componentSetId: set.id,
  pageId: page.id,
  variantCount: set.children.length,
  createdNodeIds: [set.id].concat(components.map((c) => c.id)),
};
