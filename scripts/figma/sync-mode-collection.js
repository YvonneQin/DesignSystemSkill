// Paste into use_figma to create/update Mode semantic collection.
// Source: tokens/sources/mode.json + tokens/colors/mapping.json

function parseRef(value) {
  const m = String(value).match(/^\{(.+)\}$/);
  return m ? m[1] : null;
}

const LIGHT_REF = {
  white: "white/1", "black.5": "black/5", "neutral.50": "gray/1", "neutral.100": "gray/3",
  "neutral.200": "gray/4", "neutral.500": "gray/10", "neutral.900": "gray/12", "neutral.950": "gray/12",
  "red.600": "red/9", "blue.8": "blue/8", "blue.9": "blue/9", "blue.10": "blue/10",
  "blue.11": "blue/11", "blue.12": "blue/12",
};
const DARK_REF = {
  white: "white/1", "black.5": "black/5", "neutral.50": "gray/12", "neutral.100": "gray/3",
  "neutral.200": "gray/11", "neutral.400": "gray/9", "neutral.500": "gray/10", "neutral.700": "gray/8",
  "neutral.800": "gray/3", "neutral.900": "gray/2", "neutral.950": "gray/1", "red.400": "red/11",
  "blue.8": "blue/8", "blue.9": "blue/9", "blue.10": "blue/10", "blue.11": "blue/11", "blue.12": "blue/12",
};
const SEMANTIC_OVERRIDES = {
  "semantic-background": { light: "gray/11", dark: "gray/3" },
  "semantic-border": { light: "gray/9", dark: "gray/7" },
};

const COLOR_KEYS = [
  "background","foreground","card","card-foreground","popover","popover-foreground",
  "primary","primary-foreground","secondary","secondary-foreground","muted","muted-foreground",
  "accent","accent-foreground","destructive","border","input","ring",
  "chart-1","chart-2","chart-3","chart-4","chart-5",
  "sidebar","sidebar-foreground","sidebar-primary","sidebar-primary-foreground",
  "sidebar-accent","sidebar-accent-foreground","sidebar-border","sidebar-ring",
  "background-color","semantic-background","semantic-border","semantic-foreground",
];

const LIGHT_VALUES = {
  background:"{white}",foreground:"{neutral.950}",card:"{white}","card-foreground":"{neutral.950}",
  popover:"{white}","popover-foreground":"{neutral.950}",primary:"{neutral.900}",
  "primary-foreground":"{neutral.50}",secondary:"{neutral.100}","secondary-foreground":"{neutral.950}",
  muted:"{neutral.100}","muted-foreground":"{neutral.500}",accent:"{neutral.100}",
  "accent-foreground":"{neutral.900}",destructive:"{red.600}",border:"{neutral.200}",
  input:"{neutral.200}",ring:"{neutral.500}","chart-1":"{blue.8}","chart-2":"{blue.9}",
  "chart-3":"{blue.10}","chart-4":"{blue.11}","chart-5":"{blue.12}",sidebar:"{neutral.50}",
  "sidebar-foreground":"{neutral.950}","sidebar-primary":"{neutral.900}",
  "sidebar-primary-foreground":"{neutral.50}","sidebar-accent":"{neutral.100}",
  "sidebar-accent-foreground":"{neutral.900}","sidebar-border":"{neutral.200}",
  "sidebar-ring":"{neutral.500}","background-color":"{black.5}",
  "semantic-background":"#696867","semantic-border":"#898887","semantic-foreground":"{white}",
};
const DARK_VALUES = {
  background:"{neutral.950}",foreground:"{neutral.50}",card:"{neutral.900}",
  "card-foreground":"{neutral.50}",popover:"{neutral.800}","popover-foreground":"{neutral.50}",
  primary:"{neutral.200}","primary-foreground":"{neutral.900}",secondary:"{neutral.800}",
  "secondary-foreground":"{neutral.50}",muted:"{neutral.800}","muted-foreground":"{neutral.400}",
  accent:"{neutral.700}","accent-foreground":"{neutral.50}",destructive:"{red.400}",
  border:"{neutral.700}",input:"{neutral.900}",ring:"{neutral.500}","chart-1":"{blue.8}",
  "chart-2":"{blue.9}","chart-3":"{blue.10}","chart-4":"{blue.11}","chart-5":"{blue.12}",
  sidebar:"{neutral.900}","sidebar-foreground":"{neutral.50}","sidebar-primary":"{blue.10}",
  "sidebar-primary-foreground":"{neutral.50}","sidebar-accent":"{neutral.800}",
  "sidebar-accent-foreground":"{neutral.50}","sidebar-border":"{neutral.700}",
  "sidebar-ring":"{neutral.500}","background-color":"{black.5}",
  "semantic-background":"#272625","semantic-border":"#535151","semantic-foreground":"{white}",
};

const COLOR_SCOPES = ["FRAME_FILL", "SHAPE_FILL", "TEXT_FILL", "STROKE_COLOR"];

const collections = await figma.variables.getLocalVariableCollectionsAsync();
const colorColl = collections.find((c) => c.name === "Color Library");
if (!colorColl) throw new Error("Color Library missing");

let modeColl = collections.find((c) => c.name === "Mode");
if (!modeColl) {
  modeColl = figma.variables.createVariableCollection("Mode");
}
modeColl.renameMode(modeColl.modes[0].modeId, "Light");
let darkModeId = modeColl.modes.find((m) => m.name === "Dark")?.modeId;
if (!darkModeId) darkModeId = modeColl.addMode("Dark");
const lightModeId = modeColl.modes.find((m) => m.name === "Light").modeId;

const allVars = await figma.variables.getLocalVariablesAsync();
const colorByName = {};
for (const v of allVars) {
  if (v.variableCollectionId === colorColl.id) colorByName[v.name] = v;
}
const existingMode = {};
for (const v of allVars) {
  if (v.variableCollectionId === modeColl.id) existingMode[v.name] = v;
}

const missing = [];
let created = 0;
let updated = 0;

function setAlias(variable, modeId, tokenName, raw, refMap, modeLabel) {
  const override = SEMANTIC_OVERRIDES[tokenName]?.[modeLabel];
  if (override) {
    const t = colorByName[override];
    if (!t) { missing.push({ token: variable.name, target: override }); return; }
    variable.setValueForMode(modeId, figma.variables.createVariableAlias(t));
    return;
  }
  const ref = parseRef(raw);
  if (!ref) { missing.push({ token: variable.name, raw }); return; }
  const targetName = refMap[ref];
  const target = colorByName[targetName];
  if (!target) { missing.push({ token: variable.name, ref, targetName }); return; }
  variable.setValueForMode(modeId, figma.variables.createVariableAlias(target));
}

for (const token of COLOR_KEYS) {
  const varName = `mode/${token}`;
  let v = existingMode[varName];
  if (!v) {
    v = figma.variables.createVariable(varName, modeColl, "COLOR");
    created++;
  } else {
    updated++;
  }
  v.scopes = COLOR_SCOPES;
  v.description = "Semantic token — Neutral";
  v.setVariableCodeSyntax("WEB", `var(--mode-${token})`);
  setAlias(v, lightModeId, token, LIGHT_VALUES[token], LIGHT_REF, "light");
  setAlias(v, darkModeId, token, DARK_VALUES[token], DARK_REF, "dark");
}

return {
  collection: "Mode",
  modes: modeColl.modes.map((m) => m.name),
  created,
  updated,
  total: COLOR_KEYS.length,
  missing,
};
