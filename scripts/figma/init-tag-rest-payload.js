// Initialize *Tag* / Basic, Checkable, Status below Colorful set.
// Paste body into use_figma. Uses == not ===.

const page = figma.root.children.find((p) => p.name.indexOf('Tag') > -1);
await figma.setCurrentPageAsync(page);

const colorful = page.children.find((c) => c.name.indexOf('Colorful') > -1);
const startY = colorful ? colorful.y + colorful.height + 120 : 0;

const allVars = await figma.variables.getLocalVariablesAsync();
const varByName = {};
for (let i = 0; i < allVars.length; i++) varByName[allVars[i].name] = allVars[i];

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

function makeTagContainer(name, borderYes, bgVar, borderVar, textVar) {
  const comp = figma.createComponent();
  comp.name = name;
  comp.layoutMode = 'HORIZONTAL';
  comp.primaryAxisAlignItems = 'CENTER';
  comp.counterAxisAlignItems = 'CENTER';
  comp.paddingLeft = 8;
  comp.paddingRight = 8;
  comp.paddingTop = 1;
  comp.paddingBottom = 1;
  comp.itemSpacing = 4;
  comp.cornerRadius = 4;
  comp.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  comp.strokes = borderYes ? [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }] : [];
  comp.strokeWeight = borderYes ? 1 : 0;
  comp.layoutSizingHorizontal = 'HUG';
  comp.layoutSizingVertical = 'HUG';
  comp.setBoundVariable('paddingLeft', v('padding/paddingXs8'));
  comp.setBoundVariable('paddingRight', v('padding/paddingXs8'));
  comp.setBoundVariable('topLeftRadius', v('radius/roundedSm4'));
  comp.setBoundVariable('topRightRadius', v('radius/roundedSm4'));
  comp.setBoundVariable('bottomLeftRadius', v('radius/roundedSm4'));
  comp.setBoundVariable('bottomRightRadius', v('radius/roundedSm4'));
  bindPaint(comp, 'fills', 0, bgVar);
  if (borderYes && borderVar) bindPaint(comp, 'strokes', 0, borderVar);
  return comp;
}

function makeLabel(text, textVar) {
  const label = figma.createText();
  label.name = 'Label';
  label.fontName = { family: 'Inter', style: 'Regular' };
  label.fontSize = 12;
  label.lineHeight = { unit: 'PIXELS', value: 20 };
  label.characters = text;
  label.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }];
  bindPaint(label, 'fills', 0, textVar);
  return label;
}

await figma.loadFontAsync({ family: 'Inter', style: 'Regular' });

const bgContainer = v('Neutral/Bg/colorBgContainer');
const borderColor = v('Neutral/Border/colorBorder');
const textColor = v('Neutral/Text/colorText');
const fillTertiary = v('Neutral/Fill/colorFillTertiary');
const primary = v('Brand/Primary/colorPrimary');
const textLight = v('Neutral/Text/colorTextLightSolid');

// --- Basic ---
const basicComps = [];
const basicDefs = [
  ['Variant=Default, Border=Yes', true, bgContainer, borderColor, textColor, 'Tag'],
  ['Variant=Default, Border=No', false, fillTertiary, null, textColor, 'Tag'],
  ['Variant=Closeable, Border=Yes', true, bgContainer, borderColor, textColor, 'Tag'],
  ['Variant=Closeable, Border=No', false, fillTertiary, null, textColor, 'Tag'],
  ['Variant=Add New, Border=Yes', true, bgContainer, borderColor, textColor, 'New Tag'],
];

for (let i = 0; i < basicDefs.length; i++) {
  const d = basicDefs[i];
  const comp = makeTagContainer(d[0], d[1], d[2], d[3], d[4]);
  comp.appendChild(makeLabel(d[5], d[4]));
  if (d[0].indexOf('Closeable') > -1) {
    const close = makeLabel('×', textColor);
    close.name = 'Close';
    comp.appendChild(close);
  }
  if (d[0].indexOf('Add New') > -1) {
    const plus = makeLabel('+', textColor);
    plus.name = 'Plus';
    comp.insertChild(0, plus);
  }
  basicComps.push(comp);
}

const basicSet = figma.combineAsVariants(basicComps, page, page.children.length);
basicSet.name = '*Tag* / Basic';
basicSet.x = 0;
basicSet.y = startY;

// --- Checkable ---
const checkComps = [];
const checkDefs = [
  ['Checked=False', bgContainer, borderColor, textColor, 'Tag'],
  ['Checked=True', primary, primary, textLight, 'Tag'],
];
for (let i = 0; i < checkDefs.length; i++) {
  const d = checkDefs[i];
  const borderYes = i == 0;
  const comp = makeTagContainer(d[0], borderYes, d[1], d[2], d[3]);
  comp.appendChild(makeLabel(d[4], d[3]));
  checkComps.push(comp);
}
const checkSet = figma.combineAsVariants(checkComps, page, page.children.length);
checkSet.name = '*Tag* / Checkable';
checkSet.x = 0;
checkSet.y = basicSet.y + basicSet.height + 120;

// --- Status ---
const statusComps = [];
const statusDefs = [
  ['Status=Default', textColor],
  ['Status=Success', v('Brand/Success/colorSuccess')],
  ['Status=Processing', v('Brand/Primary/colorPrimary')],
  ['Status=Error', v('Brand/Error/colorError')],
  ['Status=Warning', v('Brand/Warning/colorWarning')],
];
for (let i = 0; i < statusDefs.length; i++) {
  const d = statusDefs[i];
  const comp = makeTagContainer(d[0], false, fillTertiary, null, d[1]);
  const dot = figma.createEllipse();
  dot.name = 'Dot';
  dot.resize(6, 6);
  bindPaint(dot, 'fills', 0, d[1]);
  comp.insertChild(0, dot);
  comp.appendChild(makeLabel('Tag', d[1]));
  statusComps.push(comp);
}
const statusSet = figma.combineAsVariants(statusComps, page, page.children.length);
statusSet.name = '*Tag* / Status';
statusSet.x = 0;
statusSet.y = checkSet.y + checkSet.height + 120;

return {
  colorfulId: colorful ? colorful.id : null,
  basicSetId: basicSet.id,
  checkableSetId: checkSet.id,
  statusSetId: statusSet.id,
  variantCounts: {
    basic: basicSet.children.length,
    checkable: checkSet.children.length,
    status: statusSet.children.length,
  },
};
