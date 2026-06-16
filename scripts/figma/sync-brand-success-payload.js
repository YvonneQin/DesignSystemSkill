// Create/update Brand/Success semantic tokens (alias → Base/green/*).
// Paste body into use_figma.

const TOKENS = {
  colorSuccess: { light: 6, dark: 6, scopes: ['FRAME_FILL', 'SHAPE_FILL'] },
  colorSuccessBg: { light: 1, dark: 1, scopes: ['FRAME_FILL', 'SHAPE_FILL'] },
  colorSuccessBgHover: { light: 2, dark: 2, scopes: ['FRAME_FILL', 'SHAPE_FILL'] },
  colorSuccessBorder: { light: 3, dark: 3, scopes: ['STROKE_COLOR'] },
  colorSuccessBorderHover: { light: 4, dark: 4, scopes: ['STROKE_COLOR'] },
  colorSuccessHover: { light: 5, dark: 7, scopes: ['FRAME_FILL', 'SHAPE_FILL'] },
  colorSuccessActive: { light: 7, dark: 5, scopes: ['FRAME_FILL', 'SHAPE_FILL'] },
  colorSuccessTextHover: { light: 8, dark: 8, scopes: ['TEXT_FILL'] },
  colorSuccessText: { light: 9, dark: 9, scopes: ['TEXT_FILL'] },
  colorSuccessTextActive: { light: 10, dark: 10, scopes: ['TEXT_FILL'] },
};

const collections = await figma.variables.getLocalVariableCollectionsAsync();
const modeColl = collections.find((c) => c.name === 'Mode');
if (!modeColl) throw new Error('Mode collection missing');
const lightId = modeColl.modes.find((m) => m.name === 'Light').modeId;
const darkId = modeColl.modes.find((m) => m.name === 'Dark').modeId;

const vars = await figma.variables.getLocalVariablesAsync();
const byName = Object.fromEntries(vars.map((v) => [v.name, v]));

function base(step) {
  const v = byName[`Base/green/${step}`];
  if (!v) throw new Error(`Base/green/${step} missing`);
  return v;
}

let created = 0;
let updated = 0;
const results = [];

for (const [token, cfg] of Object.entries(TOKENS)) {
  const varName = `Brand/Success/${token}`;
  let v = byName[varName];
  if (!v) {
    v = figma.variables.createVariable(varName, modeColl, 'COLOR');
    created++;
  } else {
    updated++;
  }
  v.scopes = cfg.scopes;
  v.description = 'Brand success — alias to Base/green';
  v.setVariableCodeSyntax('WEB', `var(--${token})`);
  v.setValueForMode(lightId, figma.variables.createVariableAlias(base(cfg.light)));
  v.setValueForMode(darkId, figma.variables.createVariableAlias(base(cfg.dark)));
  results.push({
    name: varName,
    light: `Base/green/${cfg.light}`,
    dark: `Base/green/${cfg.dark}`,
  });
}

return { created, updated, total: results.length, tokens: results };
