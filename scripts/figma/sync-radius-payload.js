// Create/update Vision Token radius variables (camelCase: radius/roundedMd6).
// Paste body into use_figma.

const TOKENS = [
  ['roundedNone0', 0],
  ['roundedXs2', 2],
  ['roundedSm4', 4],
  ['roundedMd6', 6],
  ['roundedLg8', 8],
  ['roundedXl12', 12],
  ['rounded2Xl16', 16],
  ['rounded3Xl24', 24],
  ['rounded4Xl32', 32],
  ['roundedFull999', 999],
];

const GROUP = 'radius';
const COLLECTION_NAME = 'Vision Token';

let collections = await figma.variables.getLocalVariableCollectionsAsync();
let coll = collections.find((c) => c.name === COLLECTION_NAME);
if (!coll) coll = figma.variables.createVariableCollection(COLLECTION_NAME);
const modeId = coll.modes[0].modeId;

const vars = await figma.variables.getLocalVariablesAsync();
for (const v of vars.filter((x) => x.variableCollectionId === coll.id && /^[Rr]adius\//.test(x.name))) {
  v.remove();
}

const results = [];
for (const [name, value] of TOKENS) {
  const varName = `${GROUP}/${name}`;
  const v = figma.variables.createVariable(varName, coll, 'FLOAT');
  v.scopes = ['CORNER_RADIUS'];
  v.description = `Corner radius ${value}px`;
  v.setVariableCodeSyntax('WEB', `var(--${name})`);
  v.setValueForMode(modeId, value);
  results.push({ name: varName, value });
}

return { group: GROUP, created: results.length, tokens: results };
