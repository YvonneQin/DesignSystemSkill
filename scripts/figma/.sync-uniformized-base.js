function hexToRgba(hex) {
  let h = String(hex).replace('#', '');
  if (h.length === 8) {
    return {
      r: parseInt(h.slice(0, 2), 16) / 255,
      g: parseInt(h.slice(2, 4), 16) / 255,
      b: parseInt(h.slice(4, 6), 16) / 255,
      a: parseInt(h.slice(6, 8), 16) / 255,
    };
  }
  return {
    r: parseInt(h.slice(0, 2), 16) / 255,
    g: parseInt(h.slice(2, 4), 16) / 255,
    b: parseInt(h.slice(4, 6), 16) / 255,
    a: 1,
  };
}
const DATA = {"mauve":{"1":{"light":"#fafafa","dark":"#080709"},"2":{"light":"#f3f3f3","dark":"#0c0c0e"},"3":{"light":"#e1e1e3","dark":"#111113"},"4":{"light":"#cbcace","dark":"#151418"},"5":{"light":"#b2b1b7","dark":"#1a191d"},"6":{"light":"#9a99a1","dark":"#1e1e22"},"7":{"light":"#84828e","dark":"#232228"},"8":{"light":"#706e7a","dark":"#27262c"},"9":{"light":"#5d5b67","dark":"#84828e"},"10":{"light":"#4b4953","dark":"#97969e"}},"slate":{"1":{"light":"#fafafa","dark":"#070809"},"2":{"light":"#f3f3f3","dark":"#0c0c0e"},"3":{"light":"#e1e1e3","dark":"#111113"},"4":{"light":"#cacbce","dark":"#141518"},"5":{"light":"#b1b2b7","dark":"#191a1d"},"6":{"light":"#999aa1","dark":"#1e1e22"},"7":{"light":"#82848e","dark":"#222328"},"8":{"light":"#6e707a","dark":"#26272c"},"9":{"light":"#5b5d67","dark":"#82848e"},"10":{"light":"#494b53","dark":"#96979e"}},"sage":{"1":{"light":"#fafafa","dark":"#070908"},"2":{"light":"#f3f3f3","dark":"#0c0e0d"},"3":{"light":"#e1e3e2","dark":"#111312"},"4":{"light":"#cacecc","dark":"#141816"},"5":{"light":"#b1b7b4","dark":"#191d1b"},"6":{"light":"#99a19e","dark":"#1e2220"},"7":{"light":"#828e89","dark":"#222825"},"8":{"light":"#6e7a75","dark":"#262c29"},"9":{"light":"#5b6762","dark":"#828e89"},"10":{"light":"#49534f","dark":"#969e9b"}},"olive":{"1":{"light":"#fafafa","dark":"#080907"},"2":{"light":"#f3f3f3","dark":"#0d0e0c"},"3":{"light":"#e2e3e1","dark":"#121311"},"4":{"light":"#cbceca","dark":"#151814"},"5":{"light":"#b3b7b1","dark":"#1a1d19"},"6":{"light":"#9ca199","dark":"#1f221e"},"7":{"light":"#868e82","dark":"#242822"},"8":{"light":"#727a6e","dark":"#282c26"},"9":{"light":"#5f675b","dark":"#868e82"},"10":{"light":"#4c5349","dark":"#999e96"}},"sand":{"1":{"light":"#fafafa","dark":"#090907"},"2":{"light":"#f3f3f3","dark":"#0e0e0c"},"3":{"light":"#e3e3e1","dark":"#131311"},"4":{"light":"#cececa","dark":"#181814"},"5":{"light":"#b7b7b1","dark":"#1d1d19"},"6":{"light":"#a1a199","dark":"#22221e"},"7":{"light":"#8e8e82","dark":"#282822"},"8":{"light":"#7a7a6e","dark":"#2c2c26"},"9":{"light":"#67675b","dark":"#8e8e82"},"10":{"light":"#535349","dark":"#9e9e96"}},"ruby":{"1":{"light":"#ffe6eb","dark":"#080203"},"2":{"light":"#ffbac8","dark":"#120206"},"3":{"light":"#ff91a8","dark":"#29050c"},"4":{"light":"#ff6988","dark":"#4d0413"},"5":{"light":"#ff4068","dark":"#80001b"},"6":{"light":"#ff1646","dark":"#b00025"},"7":{"light":"#e2002f","dark":"#e2002f"},"8":{"light":"#b30025","dark":"#ff1747"},"9":{"light":"#8c001d","dark":"#ff446b"},"10":{"light":"#660015","dark":"#ff708e"}},"crimson":{"1":{"light":"#fde8f0","dark":"#070305"},"2":{"light":"#fabfd7","dark":"#100409"},"3":{"light":"#f799bf","dark":"#250914"},"4":{"light":"#f474a7","dark":"#450c23"},"5":{"light":"#f14e8f","dark":"#720e36"},"6":{"light":"#ee2777","dark":"#a01049"},"7":{"light":"#ca185f","dark":"#ca185f"},"8":{"light":"#a60d4a","dark":"#ee2877"},"9":{"light":"#820a3a","dark":"#f44f91"},"10":{"light":"#5f072a","dark":"#f679ab"}},"plum":{"1":{"light":"#f6ebfa","dark":"#060407"},"2":{"light":"#e7c8f1","dark":"#0c060e"},"3":{"light":"#daa7e9","dark":"#1c0d21"},"4":{"light":"#cc87e1","dark":"#33143d"},"5":{"light":"#be66d9","dark":"#531d63"},"6":{"light":"#b045d0","dark":"#73268a"},"7":{"light":"#9233af","dark":"#9233af"},"8":{"light":"#76248f","dark":"#b046d0"},"9":{"light":"#5c1c70","dark":"#c068db"},"10":{"light":"#431551","dark":"#cf8ce3"}},"violet":{"1":{"light":"#f8ebfa","dark":"#060307"},"2":{"light":"#eac7f2","dark":"#0d060e"},"3":{"light":"#dea5eb","dark":"#1e0c22"},"4":{"light":"#d284e4","dark":"#36133e"},"5":{"light":"#c663dc","dark":"#581b65"},"6":{"light":"#ba40d5","dark":"#7a238d"},"7":{"light":"#9b2fb3","dark":"#9b2fb3"},"8":{"light":"#7e2192","dark":"#ba42d4"},"9":{"light":"#621973","dark":"#c864df"},"10":{"light":"#481353","dark":"#d589e6"}},"iris":{"1":{"light":"#ebebfa","dark":"#030307"},"2":{"light":"#c7c7f2","dark":"#06060e"},"3":{"light":"#a5a5eb","dark":"#0c0c22"},"4":{"light":"#8484e4","dark":"#13133e"},"5":{"light":"#6363dc","dark":"#1b1b65"},"6":{"light":"#4040d5","dark":"#23238d"},"7":{"light":"#2f2fb3","dark":"#2f2fb3"},"8":{"light":"#212192","dark":"#4242d4"},"9":{"light":"#191973","dark":"#6464df"},"10":{"light":"#131353","dark":"#8989e6"}},"teal":{"1":{"light":"#e6fffc","dark":"#020807"},"2":{"light":"#bafff8","dark":"#021210"},"3":{"light":"#91fff3","dark":"#052925"},"4":{"light":"#69ffef","dark":"#044d45"},"5":{"light":"#40ffeb","dark":"#008072"},"6":{"light":"#16ffe6","dark":"#00b09d"},"7":{"light":"#00e2ca","dark":"#00e2ca"},"8":{"light":"#00b3a0","dark":"#17ffe6"},"9":{"light":"#008c7d","dark":"#44ffeb"},"10":{"light":"#00665b","dark":"#70fff0"}},"jade":{"1":{"light":"#ebfaf6","dark":"#030706"},"2":{"light":"#c7f2e6","dark":"#060e0c"},"3":{"light":"#a5ebd7","dark":"#0c221c"},"4":{"light":"#84e4c9","dark":"#133e32"},"5":{"light":"#63dcba","dark":"#1b6550"},"6":{"light":"#40d5ab","dark":"#238d6f"},"7":{"light":"#2fb38e","dark":"#2fb38e"},"8":{"light":"#219273","dark":"#42d4ab"},"9":{"light":"#19735a","dark":"#64dfbc"},"10":{"light":"#135341","dark":"#89e6cc"}},"grass":{"1":{"light":"#ebfaee","dark":"#040704"},"2":{"light":"#c8f1d1","dark":"#060e08"},"3":{"light":"#a7e9b6","dark":"#0d2111"},"4":{"light":"#87e19b","dark":"#143d1d"},"5":{"light":"#66d980","dark":"#1d632c"},"6":{"light":"#45d064","dark":"#268a3c"},"7":{"light":"#33af4e","dark":"#33af4e"},"8":{"light":"#248f3c","dark":"#46d064"},"9":{"light":"#1c702f","dark":"#68db81"},"10":{"light":"#155122","dark":"#8ce39f"}},"bronze":{"1":{"light":"#faf0eb","dark":"#070504"},"2":{"light":"#f1d5c8","dark":"#0e0906"},"3":{"light":"#e9bca7","dark":"#21130d"},"4":{"light":"#e1a487","dark":"#3d2114"},"5":{"light":"#d98b66","dark":"#63341d"},"6":{"light":"#d07245","dark":"#8a4626"},"7":{"light":"#af5b33","dark":"#af5b33"},"8":{"light":"#8f4724","dark":"#d07346"},"9":{"light":"#70371c","dark":"#db8d68"},"10":{"light":"#512815","dark":"#e3a88c"}},"brown":{"1":{"light":"#faf2eb","dark":"#070504"},"2":{"light":"#f1dac8","dark":"#0e0a06"},"3":{"light":"#e9c4a7","dark":"#21160d"},"4":{"light":"#e1af87","dark":"#3d2614"},"5":{"light":"#d99966","dark":"#633c1d"},"6":{"light":"#d08245","dark":"#8a5226"},"7":{"light":"#af6a33","dark":"#af6a33"},"8":{"light":"#8f5324","dark":"#d08346"},"9":{"light":"#70411c","dark":"#db9b68"},"10":{"light":"#512f15","dark":"#e3b38c"}},"mint":{"1":{"light":"#e9fcf8","dark":"#030706"},"2":{"light":"#c3f6ea","dark":"#050f0d"},"3":{"light":"#9ff1de","dark":"#0b231e"},"4":{"light":"#7cecd2","dark":"#104136"},"5":{"light":"#58e7c6","dark":"#156b58"},"6":{"light":"#34e1ba","dark":"#1a967a"},"7":{"light":"#24be9b","dark":"#24be9b"},"8":{"light":"#179c7e","dark":"#35e1ba"},"9":{"light":"#127a62","dark":"#5ae9c8"},"10":{"light":"#0d5948","dark":"#82edd5"}},"sky":{"1":{"light":"#e6f9ff","dark":"#030608"},"2":{"light":"#bbeefe","dark":"#030e11"},"3":{"light":"#92e4fe","dark":"#072027"},"4":{"light":"#6bdafd","dark":"#073a4a"},"5":{"light":"#42d0fd","dark":"#075e79"},"6":{"light":"#19c6fc","dark":"#0683aa"},"7":{"light":"#0ba6d7","dark":"#0ba6d7"},"8":{"light":"#0287b1","dark":"#19c6fd"},"9":{"light":"#026a8a","dark":"#44d2ff"},"10":{"light":"#014d65","dark":"#70dcff"}}};
const collections = await figma.variables.getLocalVariableCollectionsAsync();
const modeColl = collections.find(c => c.name === 'ColorMode');
if (!modeColl) throw new Error('ColorMode collection missing');
const lightId = modeColl.modes.find(m => m.name === 'Light').modeId;
const darkId = modeColl.modes.find(m => m.name === 'Dark').modeId;
const vars = await figma.variables.getLocalVariablesAsync();
const byName = Object.fromEntries(vars.map(v => [v.name, v]));
let updated = 0;
let created = 0;
const missing = [];
for (const [palette, steps] of Object.entries(DATA)) {
  for (const [step, colors] of Object.entries(steps)) {
    const name = `Base/${palette}/${step}`;
    let v = byName[name];
    if (!v) {
      v = figma.variables.createVariable(name, modeColl, 'COLOR');
      v.scopes = [];
      v.description = 'Base palette (10-step)';
      v.setVariableCodeSyntax('WEB', `var(--${palette}-${step})`);
      created++;
    } else {
      updated++;
    }
    v.setValueForMode(lightId, hexToRgba(colors.light));
    v.setValueForMode(darkId, hexToRgba(colors.dark));
  }
}
return { updated, created, missing, palettes: Object.keys(DATA).length, paletteNames: Object.keys(DATA) };