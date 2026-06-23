// Rebuild Color System palette board (Light or Dark).
// Paste body into use_figma. Set FRAME_ID and MODE_NAME at top.

const FRAME_ID = '5:3'; // Light: 5:3, Dark: 5:175
const MODE_NAME = 'Light'; // 'Light' | 'Dark'

const PALETTES = [
  'gray', 'mauve', 'slate', 'sage', 'olive', 'sand',
  'tomato', 'red', 'ruby', 'crimson', 'pink', 'plum',
  'purple', 'violet', 'iris', 'indigo', 'blue', 'cyan',
  'teal', 'jade', 'green', 'grass', 'bronze', 'gold',
  'brown', 'orange', 'amber', 'yellow', 'lime', 'mint',
  'sky', 'black', 'white',
];
const COL_W = 160;
const SWATCH_H = 56;
const SCALE_STEPS = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900'];
const COL_PITCH = 180;
const START_X = 294;
const START_Y = 310;
const MAIN_HUE_ROW = 7; // 1-based row index in SCALE_STEPS
const ACCENT_STEP = '600';
const SQUARE_SIZE = 56;
const SQUARE_Y = 1008;
const LABEL_Y = 1084;

const collections = await figma.variables.getLocalVariableCollectionsAsync();
const modeColl = collections.find((c) => c.name === 'ColorMode');
if (!modeColl) throw new Error('ColorMode collection missing');
const lightModeId = modeColl.modes.find((m) => m.name === 'Light').modeId;
const darkModeId = modeColl.modes.find((m) => m.name === 'Dark').modeId;

const allVars = await figma.variables.getLocalVariablesAsync();
const varByName = new Map();
for (const v of allVars) {
  if (v.variableCollectionId === modeColl.id) varByName.set(v.name, v);
}

function token(palette, step) {
  return `Base/${palette}/${step}`;
}

function bindFill(node, tokenName) {
  const variable = varByName.get(tokenName);
  if (!variable) return false;
  const base = { type: 'SOLID', color: { r: 0.5, g: 0.5, b: 0.5 } };
  node.fills = [figma.variables.setBoundVariableForPaint(base, 'color', variable)];
  return true;
}

function bindStroke(node, tokenName) {
  const variable = varByName.get(tokenName);
  if (!variable) return false;
  const base = { type: 'SOLID', color: { r: 0.7, g: 0.7, b: 0.7 } };
  node.strokes = [figma.variables.setBoundVariableForPaint(base, 'color', variable)];
  return true;
}

function capitalizePalette(name) {
  return name.charAt(0).toUpperCase() + name.slice(1);
}

async function buildBoard(frameId, modeName) {
  const modeId = modeName === 'Light' ? lightModeId : darkModeId;
  const frame = await figma.getNodeByIdAsync(frameId);
  await figma.setCurrentPageAsync(frame.parent);
  frame.setExplicitVariableModeForCollection(modeColl, modeId);
  for (const child of [...frame.children]) child.remove();
  bindFill(frame, token('gray', '50'));

  let fontFamily = 'Inter';
  let fontStyle = 'Medium';
  const fonts = await figma.listAvailableFontsAsync();
  if (fonts.some((f) => f.fontName.family === 'PingFang SC' && f.fontName.style === 'Medium')) {
    fontFamily = 'PingFang SC';
    fontStyle = 'Medium';
  }
  await figma.loadFontAsync({ family: fontFamily, style: fontStyle });

  const created = [];
  const lastColX = START_X + (PALETTES.length - 1) * COL_PITCH;
  const lineWidth = lastColX + COL_W - 252;

  const guide = figma.createLine();
  guide.name = 'Vector 85';
  guide.x = 252;
  guide.y = START_Y + (MAIN_HUE_ROW - 1) * SWATCH_H + SWATCH_H / 2;
  guide.resize(lineWidth, 0);
  guide.strokeWeight = 2;
  guide.dashPattern = [8, 8];
  bindStroke(guide, token('gray', '500'));
  frame.appendChild(guide);
  created.push(guide.id);

  const title = figma.createText();
  title.name = '主色相';
  title.fontName = { family: fontFamily, style: fontStyle };
  title.fontSize = 24;
  title.lineHeight = { unit: 'PIXELS', value: 36 };
  title.characters = '主色相';
  title.x = 160;
  title.y = 656;
  bindFill(title, token('gray', '800'));
  frame.appendChild(title);
  created.push(title.id);

  for (let ci = 0; ci < PALETTES.length; ci++) {
    const palette = PALETTES[ci];
    const x = START_X + ci * COL_PITCH;
    const col = figma.createFrame();
    col.name = `Column / ${palette}`;
    col.resize(COL_W, SWATCH_H * SCALE_STEPS.length);
    col.x = x;
    col.y = START_Y;
    col.fills = [];
    col.clipsContent = true;
    frame.appendChild(col);
    created.push(col.id);

    for (let i = 0; i < SCALE_STEPS.length; i++) {
      const step = SCALE_STEPS[i];
      const sw = figma.createRectangle();
      sw.name = 'Subtract';
      sw.resize(COL_W, SWATCH_H);
      sw.y = i * SWATCH_H;
      bindFill(sw, token(palette, step));
      col.appendChild(sw);
      created.push(sw.id);
    }

    const sq = figma.createRectangle();
    sq.name = `${palette}-accent`;
    sq.resize(SQUARE_SIZE, SQUARE_SIZE);
    sq.cornerRadius = 4;
    sq.x = x + (COL_W - SQUARE_SIZE) / 2;
    sq.y = SQUARE_Y;
    bindFill(sq, token(palette, ACCENT_STEP));
    frame.appendChild(sq);
    created.push(sq.id);

    const label = figma.createText();
    label.name = palette;
    label.fontName = { family: fontFamily, style: fontStyle };
    label.fontSize = 24;
    label.lineHeight = { unit: 'PIXELS', value: 36 };
    label.characters = capitalizePalette(palette);
    const labelW = label.width;
    label.x = x + (COL_W - labelW) / 2;
    label.y = LABEL_Y;
    bindFill(label, token('gray', '900'));
    frame.appendChild(label);
    created.push(label.id);
  }

  const frameW = START_X + PALETTES.length * COL_PITCH + 200;
  const frameH = 1424;
  frame.resizeWithoutConstraints(frameW, frameH);
  return {
    frameId,
    modeName,
    palettes: PALETTES.length,
    swatches: PALETTES.length * SCALE_STEPS.length,
    nodes: created.length,
    width: frameW,
    height: frameH,
    createdNodeIds: created,
  };
}

return await buildBoard(FRAME_ID, MODE_NAME);
