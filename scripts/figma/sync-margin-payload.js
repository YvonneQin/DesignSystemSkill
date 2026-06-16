// Create/update Vision Token margin variables (camelCase: margin/marginMd20).
// Paste body into use_figma.

const TOKENS = [
  ['marginXxs4', 4],
  ['marginXs8', 8],
  ['marginSm12', 12],
  ['margin16', 16],
  ['marginMd20', 20],
  ['marginLg24', 24],
  ['marginXl32', 32],
  ['marginXxl48', 48],
];

const GROUP = 'margin';
const COLLECTION_NAME = 'Vision Token';

let collections = await figma.variables.getLocalVariableCollectionsAsync();
let coll = collections.find((c) => c.name === COLLECTION_NAME);
if (!coll) coll = figma.variables.createVariableCollection(COLLECTION_NAME);
const modeId = coll.modes[0].modeId;

const vars = await figma.variables.getLocalVariablesAsync();
for (const v of vars.filter((x) => x.variableCollectionId === coll.id && /^[Mm]argin\//.test(x.name))) {
  v.remove();
}

const results = [];
for (const [name, value] of TOKENS) {
  const varName = `${GROUP}/${name}`;
  const v = figma.variables.createVariable(varName, coll, 'FLOAT');
  v.scopes = ['GAP'];
  v.description = `Margin ${value}px`;
  v.setVariableCodeSyntax('WEB', `var(--${name})`);
  v.setValueForMode(modeId, value);
  results.push({ name: varName, value });
}

return { group: GROUP, created: results.length, tokens: results };
