// Layout Tag component sets — variants grid + page stack. Paste into use_figma.

const page = figma.root.children.find((p) => p.name.indexOf('Tag') > -1);
await figma.setCurrentPageAsync(page);

const PAD = 24;
const ROW_GAP = 69;
const SET_GAP = 120;
const PAGE_X = 48;
const COLORFUL_NO_X = 141;
const COLORFUL_LEFT_RIGHT = 94;
const BASIC_NO_X = 173;
const BASIC_LEFT_X = 24;

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

function fitSet(set) {
  let maxX = 0;
  let maxY = 0;
  for (let i = 0; i < set.children.length; i++) {
    const c = set.children[i];
    maxX = Math.max(maxX, c.x + c.width);
    maxY = Math.max(maxY, c.y + c.height);
  }
  set.resize(Math.max(maxX + PAD, 80), Math.max(maxY + PAD, 60));
}

function layoutColorful(set) {
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
  fitSet(set);
}

function layoutBasic(set) {
  const rows = [
    ['Default', PAD],
    ['Add New', PAD + ROW_GAP],
    ['Closeable', PAD + ROW_GAP * 2],
  ];
  for (let ri = 0; ri < rows.length; ri++) {
    const variant = rows[ri][0];
    const rowY = rows[ri][1];
    for (let i = 0; i < set.children.length; i++) {
      const c = set.children[i];
      if (parseProp(c.name, 'Variant') != variant) continue;
      const border = parseProp(c.name, 'Border');
      if (border == 'Yes') {
        c.x = BASIC_LEFT_X;
        c.y = rowY;
      } else if (border == 'No') {
        c.x = BASIC_NO_X;
        c.y = rowY;
      }
    }
  }
  fitSet(set);
}

function layoutCheckable(set) {
  let rowY = PAD;
  const order = ['False', 'True'];
  for (let oi = 0; oi < order.length; oi++) {
    const val = order[oi];
    for (let i = 0; i < set.children.length; i++) {
      const c = set.children[i];
      if (parseProp(c.name, 'Checked') == val) {
        c.x = PAD;
        c.y = rowY;
      }
    }
    rowY += ROW_GAP;
  }
  fitSet(set);
}

function layoutStatus(set) {
  const order = ['Default', 'Error', 'Processing', 'Success', 'Warning'];
  let rowY = PAD;
  let maxW = 0;
  for (let oi = 0; oi < order.length; oi++) {
    for (let i = 0; i < set.children.length; i++) {
      const c = set.children[i];
      if (parseProp(c.name, 'Status') == order[oi]) {
        c.y = rowY;
        maxW = Math.max(maxW, c.width);
      }
    }
    rowY += 70;
  }
  for (let i = 0; i < set.children.length; i++) {
    const c = set.children[i];
    c.x = PAD + (maxW - c.width) / 2;
  }
  fitSet(set);
}

const setNames = ['Colorful', 'Basic', 'Checkable', 'Status'];
const sets = [];
for (let si = 0; si < setNames.length; si++) {
  const key = setNames[si];
  for (let i = 0; i < page.children.length; i++) {
    const c = page.children[i];
    if (c.type == 'COMPONENT_SET' && c.name.indexOf(key) > -1) {
      sets.push(c);
      break;
    }
  }
}

for (let i = 0; i < sets.length; i++) {
  const s = sets[i];
  if (s.name.indexOf('Colorful') > -1) layoutColorful(s);
  else if (s.name.indexOf('Basic') > -1) layoutBasic(s);
  else if (s.name.indexOf('Checkable') > -1) layoutCheckable(s);
  else if (s.name.indexOf('Status') > -1) layoutStatus(s);
}

let pageY = PAGE_X;
for (let i = 0; i < sets.length; i++) {
  sets[i].x = PAGE_X;
  sets[i].y = pageY;
  pageY += sets[i].height + SET_GAP;
}

return {
  laidOut: sets.map((s) => ({ id: s.id, name: s.name, w: s.width, h: s.height, x: s.x, y: s.y })),
};
