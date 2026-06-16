// Create/update Brand/Error semantic tokens (alias → Base/red/*).
// Paste body into use_figma.

const TOKENS = {
  colorError: { light: 6, dark: 6, scopes: ['FRAME_FILL', 'SHAPE_FILL'] },
  colorErrorBg: { light: 1, dark: 1, scopes: ['FRAME_FILL', 'SHAPE_FILL'] },
  colorErrorBgHover: { light: 2, dark: 2, scopes: ['FRAME_FILL', 'SHAPE_FILL'] },
  colorErrorBorder: { light: 3, dark: 3, scopes: ['STROKE_COLOR'] },
  colorErrorBorderHover: { light: 4, dark: 4, scopes: ['STROKE_COLOR'] },
  colorErrorHover: { light: 5, dark: 7, scopes: ['FRAME_FILL', 'SHAPE_FILL'] },
  colorErrorActive: { light: 7, dark: 5, scopes: ['FRAME_FILL', 'SHAPE_FILL'] },
  colorErrorTextHover: { light: 8, dark: 8, scopes: ['TEXT_FILL'] },
  colorErrorText: { light: 9, dark: 9, scopes: ['TEXT_FILL'] },
  colorErrorTextActive: { light: 10, dark: 10, scopes: ['TEXT_FILL'] },
};

const collections = await figma.variables.getLocalVariableCollectionsAsync();
const modeColl = collections.find((c) => c.name === 'ColorMode');
if (!modeColl) throw new Error('ColorMode collection missing');
const lightId = modeColl.modes.find((m) => m.name === 'Light').modeId;
const darkId = modeColl.modes.find((m) => m.name === 'Dark').modeId;

const vars = await figma.variables.getLocalVariablesAsync();
const byName = Object.fromEntries(vars.map((v) => [v.name, v]));

function base(step) {
  const v = byName[`Base/red/${step}`];
  if (!v) throw new Error(`Base/red/${step} missing`);
  return v;
}

let created = 0;
let updated = 0;
const results = [];

for (const [token, cfg] of Object.entries(TOKENS)) {
  const varName = `Brand/Error/${token}`;
  let v = byName[varName];
  if (!v) {
    v = figma.variables.createVariable(varName, modeColl, 'COLOR');
    created++;
  } else {
    updated++;
  }
  v.scopes = cfg.scopes;
  v.description = 'Brand error — alias to Base/red';
  v.setVariableCodeSyntax('WEB', `var(--${token})`);
  v.setValueForMode(lightId, figma.variables.createVariableAlias(base(cfg.light)));
  v.setValueForMode(darkId, figma.variables.createVariableAlias(base(cfg.dark)));
  results.push({
    name: varName,
    light: `Base/red/${cfg.light}`,
    dark: `Base/red/${cfg.dark}`,
  });
}

return { created, updated, total: results.length, tokens: results };
