// Create/update Brand/Warning semantic tokens (alias → Base/gold/*).
// Paste body into use_figma.

const TOKENS = {
  colorWarning: { light: 6, dark: 6, scopes: ['FRAME_FILL', 'SHAPE_FILL'] },
  colorWarningBg: { light: 1, dark: 1, scopes: ['FRAME_FILL', 'SHAPE_FILL'] },
  colorWarningBgHover: { light: 2, dark: 2, scopes: ['FRAME_FILL', 'SHAPE_FILL'] },
  colorWarningBorder: { light: 3, dark: 3, scopes: ['STROKE_COLOR'] },
  colorWarningBorderHover: { light: 4, dark: 4, scopes: ['STROKE_COLOR'] },
  colorWarningHover: { light: 5, dark: 7, scopes: ['FRAME_FILL', 'SHAPE_FILL'] },
  colorWarningActive: { light: 7, dark: 5, scopes: ['FRAME_FILL', 'SHAPE_FILL'] },
  colorWarningTextHover: { light: 8, dark: 8, scopes: ['TEXT_FILL'] },
  colorWarningText: { light: 9, dark: 9, scopes: ['TEXT_FILL'] },
  colorWarningTextActive: { light: 10, dark: 10, scopes: ['TEXT_FILL'] },
};

const collections = await figma.variables.getLocalVariableCollectionsAsync();
const modeColl = collections.find((c) => c.name === 'Mode');
if (!modeColl) throw new Error('Mode collection missing');
const lightId = modeColl.modes.find((m) => m.name === 'Light').modeId;
const darkId = modeColl.modes.find((m) => m.name === 'Dark').modeId;

const vars = await figma.variables.getLocalVariablesAsync();
const byName = Object.fromEntries(vars.map((v) => [v.name, v]));

function base(step) {
  const v = byName[`Base/gold/${step}`];
  if (!v) throw new Error(`Base/gold/${step} missing`);
  return v;
}

let created = 0;
let updated = 0;
const results = [];

for (const [token, cfg] of Object.entries(TOKENS)) {
  const varName = `Brand/Warning/${token}`;
  let v = byName[varName];
  if (!v) {
    v = figma.variables.createVariable(varName, modeColl, 'COLOR');
    created++;
  } else {
    updated++;
  }
  v.scopes = cfg.scopes;
  v.description = 'Brand warning — alias to Base/gold';
  v.setVariableCodeSyntax('WEB', `var(--${token})`);
  v.setValueForMode(lightId, figma.variables.createVariableAlias(base(cfg.light)));
  v.setValueForMode(darkId, figma.variables.createVariableAlias(base(cfg.dark)));
  results.push({
    name: varName,
    light: `Base/gold/${cfg.light}`,
    dark: `Base/gold/${cfg.dark}`,
  });
}

return { created, updated, total: results.length, tokens: results };
