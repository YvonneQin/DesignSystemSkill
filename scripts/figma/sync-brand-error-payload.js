// Create/update Brand/Error semantic tokens (alias → Base/red/*).
// Paste body into use_figma.

const TOKENS = {
  colorError: { light: 500, dark: 500, scopes: ['FRAME_FILL', 'SHAPE_FILL'] },
  colorErrorBg: { light: 50, dark: 50, scopes: ['FRAME_FILL', 'SHAPE_FILL'] },
  colorErrorBgHover: { light: 100, dark: 100, scopes: ['FRAME_FILL', 'SHAPE_FILL'] },
  colorErrorBorder: { light: 200, dark: 200, scopes: ['STROKE_COLOR'] },
  colorErrorBorderHover: { light: 300, dark: 300, scopes: ['STROKE_COLOR'] },
  colorErrorHover: { light: 400, dark: 600, scopes: ['FRAME_FILL', 'SHAPE_FILL'] },
  colorErrorActive: { light: 600, dark: 400, scopes: ['FRAME_FILL', 'SHAPE_FILL'] },
  colorErrorTextHover: { light: 700, dark: 700, scopes: ['TEXT_FILL'] },
  colorErrorText: { light: 800, dark: 800, scopes: ['TEXT_FILL'] },
  colorErrorTextActive: { light: 900, dark: 900, scopes: ['TEXT_FILL'] },
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
