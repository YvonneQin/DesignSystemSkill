// Create/update Brand/Link semantic tokens (alias → Brand/Primary/*).
// Paste body into use_figma.

const TOKENS = {
  colorLink: { light: 'colorPrimary', dark: 'colorPrimary', scopes: ['TEXT_FILL'] },
  colorLinkHover: { light: 'colorPrimaryHover', dark: 'colorPrimaryHover', scopes: ['TEXT_FILL'] },
  colorLinkActive: { light: 'colorPrimaryActive', dark: 'colorPrimaryActive', scopes: ['TEXT_FILL'] },
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
  const varName = `Brand/Link/${token}`;
  let v = byName[varName];
  if (!v) {
    v = figma.variables.createVariable(varName, modeColl, 'COLOR');
    created++;
  } else {
    updated++;
  }
  v.scopes = cfg.scopes;
  v.description = 'Brand link — alias to Brand/Primary';
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
