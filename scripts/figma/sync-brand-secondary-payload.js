// Create/update Brand/Secondary semantic tokens (alias → Base/black/*).
// Paste body into use_figma.

const TOKENS = {
  colorSecondary: { light: 6, dark: 6, scopes: ['FRAME_FILL', 'SHAPE_FILL'] },
  colorSecondaryBg: { light: 1, dark: 1, scopes: ['FRAME_FILL', 'SHAPE_FILL'] },
  colorSecondaryBgHover: { light: 2, dark: 2, scopes: ['FRAME_FILL', 'SHAPE_FILL'] },
  colorSecondaryBorder: { light: 3, dark: 3, scopes: ['STROKE_COLOR'] },
  colorSecondaryBorderHover: { light: 4, dark: 4, scopes: ['STROKE_COLOR'] },
  colorSecondaryHover: { light: 5, dark: 7, scopes: ['FRAME_FILL', 'SHAPE_FILL'] },
  colorSecondaryActive: { light: 7, dark: 5, scopes: ['FRAME_FILL', 'SHAPE_FILL'] },
  colorSecondaryTextHover: { light: 8, dark: 8, scopes: ['TEXT_FILL'] },
  colorSecondaryText: { light: 9, dark: 9, scopes: ['TEXT_FILL'] },
  colorSecondaryTextActive: { light: 10, dark: 10, scopes: ['TEXT_FILL'] },
};

const collections = await figma.variables.getLocalVariableCollectionsAsync();
const modeColl = collections.find((c) => c.name === 'ColorMode');
if (!modeColl) throw new Error('ColorMode collection missing');
const lightId = modeColl.modes.find((m) => m.name === 'Light').modeId;
const darkId = modeColl.modes.find((m) => m.name === 'Dark').modeId;

const vars = await figma.variables.getLocalVariablesAsync();
const byName = Object.fromEntries(vars.map((v) => [v.name, v]));

function base(step) {
  const v = byName[`Base/black/${step}`];
  if (!v) throw new Error(`Base/black/${step} missing`);
  return v;
}

let created = 0;
let updated = 0;
const results = [];

for (const [token, cfg] of Object.entries(TOKENS)) {
  const varName = `Brand/Secondary/${token}`;
  let v = byName[varName];
  if (!v) {
    v = figma.variables.createVariable(varName, modeColl, 'COLOR');
    created++;
  } else {
    updated++;
  }
  v.scopes = cfg.scopes;
  v.description = 'Brand secondary — alias to Base/black';
  v.setVariableCodeSyntax('WEB', `var(--${token})`);
  v.setValueForMode(lightId, figma.variables.createVariableAlias(base(cfg.light)));
  v.setValueForMode(darkId, figma.variables.createVariableAlias(base(cfg.dark)));
  results.push({
    name: varName,
    light: `Base/black/${cfg.light}`,
    dark: `Base/black/${cfg.dark}`,
  });
}

return { created, updated, total: results.length, tokens: results };
