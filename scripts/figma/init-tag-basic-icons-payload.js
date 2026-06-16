// Replace Basic Tag text icons with Icon library instances + INSTANCE_SWAP.
// Paste into use_figma. Avoid > and < in code (breaks MCP XML).

const page = figma.root.children.find((p) => p.name.indexOf('Tag') != -1);
await figma.setCurrentPageAsync(page);

const closeComp = figma.getNodeById('509:486');
const plusComp = figma.getNodeById('509:476');
if (!closeComp || !plusComp) throw new Error('Icon components not loaded');

const set = page.children.find((c) => c.name.indexOf('Basic') != -1);
if (!set) throw new Error('Basic tag set missing');

const allVars = await figma.variables.getLocalVariablesAsync();
const varByName = {};
for (let i = 0; i < allVars.length; i++) varByName[allVars[i].name] = allVars[i];

function v(name) {
  const x = varByName[name];
  if (!x) throw new Error('Missing variable: ' + name);
  return x;
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

function parseProp(name, key) {
  const parts = name.split(', ');
  for (let i = 0; i < parts.length; i++) {
    const kv = parts[i].split('=');
    if (kv[0].trim() == key) return kv[1].trim();
  }
  return null;
}

const iconSizeVar = v('iconSize/iconSizeSm12');
const textColor = v('Neutral/Text/colorText');

let iconValueKey = Object.keys(set.componentPropertyDefinitions || {}).find((k) => k.indexOf('IconValue') == 0);
if (!iconValueKey) {
  set.addComponentProperty('IconValue', 'INSTANCE_SWAP', closeComp.id);
  iconValueKey = Object.keys(set.componentPropertyDefinitions).find((k) => k.indexOf('IconValue') == 0);
}

const mutated = [];

for (let vi = 0; vi < set.children.length; vi++) {
  const variant = set.children[vi];
  const variantType = parseProp(variant.name, 'Variant');
  const needsClose = variantType == 'Closeable';
  const needsPlus = variantType == 'Add New';

  const removeList = [];
  for (let ci = 0; ci < variant.children.length; ci++) {
    const ch = variant.children[ci];
    if (ch.name == 'Close' || ch.name == 'Plus' || ch.name == 'Icon') removeList.push(ch);
  }
  for (let ri = 0; ri < removeList.length; ri++) removeList[ri].remove();

  if (needsPlus) {
    const plus = plusComp.createInstance();
    plus.name = 'Icon';
    variant.insertChild(0, plus);
    plus.setBoundVariable('width', iconSizeVar);
    plus.setBoundVariable('height', iconSizeVar);
    bindIconVectors(plus, textColor);
    plus.componentPropertyReferences = { mainComponent: iconValueKey };
    mutated.push({ variant: variant.name, icon: 'PlusOutlined' });
  }

  if (needsClose) {
    const close = closeComp.createInstance();
    close.name = 'Icon';
    variant.appendChild(close);
    close.setBoundVariable('width', iconSizeVar);
    close.setBoundVariable('height', iconSizeVar);
    bindIconVectors(close, textColor);
    close.componentPropertyReferences = { mainComponent: iconValueKey };
    mutated.push({ variant: variant.name, icon: 'CloseOutlined' });
  }
}

return { iconValueKey, mutated, setId: set.id };
