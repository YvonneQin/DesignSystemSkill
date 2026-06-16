// Create/update Brand/Info semantic tokens (alias → Brand/Primary/*).
// Paste body into use_figma.

const TOKENS = {
  colorInfo: { light: 'colorPrimary', dark: 'colorPrimary', scopes: ['FRAME_FILL', 'SHAPE_FILL'] },
  colorInfoBg: { light: 'colorPrimaryBg', dark: 'colorPrimaryBg', scopes: ['FRAME_FILL', 'SHAPE_FILL'] },
  colorInfoBgHover: { light: 'colorPrimaryBgHover', dark: 'colorPrimaryBgHover', scopes: ['FRAME_FILL', 'SHAPE_FILL'] },
  colorInfoBorder: { light: 'colorPrimaryBorder', dark: 'colorPrimaryBorder', scopes: ['STROKE_COLOR'] },
  colorInfoBorderHover: { light: 'colorPrimaryBorderHover', dark: 'colorPrimaryHover', scopes: ['STROKE_COLOR'] },
  colorInfoHover: { light: 'colorPrimaryHover', dark: 'colorPrimaryHover', scopes: ['FRAME_FILL', 'SHAPE_FILL'] },
  colorInfoActive: { light: 'colorPrimaryActive', dark: 'colorPrimaryActive', scopes: ['FRAME_FILL', 'SHAPE_FILL'] },
  colorInfoTextHover: { light: 'colorPrimaryTextHover', dark: 'colorPrimaryTextHover', scopes: ['TEXT_FILL'] },
  colorInfoText: { light: 'colorPrimaryText', dark: 'colorPrimaryText', scopes: ['TEXT_FILL'] },
  colorInfoTextActive: { light: 'colorPrimaryTextActive', dark: 'colorPrimaryTextActive', scopes: ['TEXT_FILL'] },
};

const collections = await figma.variables.getLocalVariableCollectionsAsync();
const modeColl = collections.find((c) => c.name === 'Mode');
if (!modeColl) throw new Error('Mode collection missing');
const lightId = modeColl.modes.find((m) => m.name === 'Light').modeId;
const darkId = modeColl.modes.find((m) => m.name === 'Dark').modeId;

const vars = await figma.variables.getLocalVariablesAsync();
const byName = Object.fromEntries(vars.map((v) => [v.name, v]));

function primary(token) {
  const v = byName[`Brand/Primary/${token}`];
  if (!v) throw new Error(`Brand/Primary/${token} missing`);
  return v;
}

let created = 0;
let updated = 0;
const results = [];

for (const [token, cfg] of Object.entries(TOKENS)) {
  const varName = `Brand/Info/${token}`;
  let v = byName[varName];
  if (!v) {
    v = figma.variables.createVariable(varName, modeColl, 'COLOR');
    created++;
  } else {
    updated++;
  }
  v.scopes = cfg.scopes;
  v.description = 'Brand info — alias to Brand/Primary';
  v.setVariableCodeSyntax('WEB', `var(--${token})`);
  v.setValueForMode(lightId, figma.variables.createVariableAlias(primary(cfg.light)));
  v.setValueForMode(darkId, figma.variables.createVariableAlias(primary(cfg.dark)));
  results.push({
    name: varName,
    light: `Brand/Primary/${cfg.light}`,
    dark: `Brand/Primary/${cfg.dark}`,
  });
}

return { created, updated, total: results.length, tokens: results };
