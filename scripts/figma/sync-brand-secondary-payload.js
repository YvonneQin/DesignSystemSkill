// Create/update Brand/Tertiary semantic tokens (alias → Base/black/*).
// Paste body into use_figma.

const TOKENS = {
  colorTertiary: { light: 500, dark: 500, scopes: ['FRAME_FILL', 'SHAPE_FILL'] },
  colorTertiaryBg: { light: 50, dark: 50, scopes: ['FRAME_FILL', 'SHAPE_FILL'] },
  colorTertiaryBgHover: { light: 100, dark: 100, scopes: ['FRAME_FILL', 'SHAPE_FILL'] },
  colorTertiaryBorder: { light: 200, dark: 200, scopes: ['STROKE_COLOR'] },
  colorTertiaryBorderHover: { light: 300, dark: 300, scopes: ['STROKE_COLOR'] },
  colorTertiaryHover: { light: 400, dark: 600, scopes: ['FRAME_FILL', 'SHAPE_FILL'] },
  colorTertiaryActive: { light: 600, dark: 400, scopes: ['FRAME_FILL', 'SHAPE_FILL'] },
  colorTertiaryTextHover: { light: 700, dark: 700, scopes: ['TEXT_FILL'] },
  colorTertiaryText: { light: 800, dark: 800, scopes: ['TEXT_FILL'] },
  colorTertiaryTextActive: { light: 900, dark: 900, scopes: ['TEXT_FILL'] },
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
  const varName = `Brand/Tertiary/${token}`;
  let v = byName[varName];
  if (!v) {
    v = figma.variables.createVariable(varName, modeColl, 'COLOR');
    created++;
  } else {
    updated++;
  }
  v.scopes = cfg.scopes;
  v.description = 'Brand tertiary — alias to Base/black';
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
