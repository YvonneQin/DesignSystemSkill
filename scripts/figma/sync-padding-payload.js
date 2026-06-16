// Create/update Vision Token padding variables (camelCase: padding/paddingMd20).
// Paste body into use_figma.

const TOKENS = [
  ['paddingXxs4', 4],
  ['padding6', 6],
  ['paddingXs8', 8],
  ['paddingSm12', 12],
  ['padding16', 16],
  ['paddingMd20', 20],
  ['paddingLg24', 24],
  ['paddingXl32', 32],
];

const GROUP = 'padding';
const COLLECTION_NAME = 'Vision Token';

let collections = await figma.variables.getLocalVariableCollectionsAsync();
let coll = collections.find((c) => c.name === COLLECTION_NAME);
if (!coll) coll = figma.variables.createVariableCollection(COLLECTION_NAME);
const modeId = coll.modes[0].modeId;

const vars = await figma.variables.getLocalVariablesAsync();
for (const v of vars.filter((x) => x.variableCollectionId === coll.id && /^[Pp]adding\//.test(x.name))) {
  v.remove();
}

const results = [];
for (const [name, value] of TOKENS) {
  const varName = `${GROUP}/${name}`;
  const v = figma.variables.createVariable(varName, coll, 'FLOAT');
  v.scopes = ['GAP'];
  v.description = `Padding ${value}px`;
  v.setVariableCodeSyntax('WEB', `var(--${name})`);
  v.setValueForMode(modeId, value);
  results.push({ name: varName, value });
}

return { group: GROUP, created: results.length, tokens: results };
