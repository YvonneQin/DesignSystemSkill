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
const DATA = {"mauve":{"1":{"light":"#cfcfd0","dark":"#070707"},"2":{"light":"#c0c0c0","dark":"#0b0a0c"},"3":{"light":"#b0b0b1","dark":"#0e0e10"},"4":{"light":"#a0a0a3","dark":"#121214"},"5":{"light":"#908f95","dark":"#161618"},"6":{"light":"#807e87","dark":"#1a1a1d"},"7":{"light":"#6f6d7a","dark":"#1e1d21"},"8":{"light":"#615f69","dark":"#222125"},"9":{"light":"#57565e","dark":"#6f6d7a"},"10":{"light":"#4d4c53","dark":"#85838e"}},"slate":{"1":{"light":"#cececf","dark":"#060707"},"2":{"light":"#bfbfbf","dark":"#0a0a0b"},"3":{"light":"#afafb1","dark":"#0e0e10"},"4":{"light":"#9f9fa2","dark":"#121214"},"5":{"light":"#8e8f94","dark":"#161618"},"6":{"light":"#7d7f86","dark":"#191a1c"},"7":{"light":"#6c6e79","dark":"#1d1e21"},"8":{"light":"#5e6068","dark":"#212225"},"9":{"light":"#55565d","dark":"#6c6e79"},"10":{"light":"#4b4c52","dark":"#82848d"}},"sage":{"1":{"light":"#c7c7c7","dark":"#060706"},"2":{"light":"#b8b8b8","dark":"#0a0b0a"},"3":{"light":"#a8a9a9","dark":"#0e0e0e"},"4":{"light":"#989a9a","dark":"#111212"},"5":{"light":"#888c8a","dark":"#151616"},"6":{"light":"#787d7b","dark":"#181a19"},"7":{"light":"#686f6c","dark":"#1c1e1d"},"8":{"light":"#595f5d","dark":"#202221"},"9":{"light":"#505452","dark":"#686f6c"},"10":{"light":"#464a48","dark":"#7f8582"}},"olive":{"1":{"light":"#c8c8c8","dark":"#060706"},"2":{"light":"#b8b9b8","dark":"#0a0b0a"},"3":{"light":"#a9aaa9","dark":"#0e0e0e"},"4":{"light":"#9a9b99","dark":"#121211"},"5":{"light":"#8a8c89","dark":"#151615"},"6":{"light":"#7b7e79","dark":"#191a19"},"7":{"light":"#6b6f69","dark":"#1d1e1c"},"8":{"light":"#5c5f5a","dark":"#212220"},"9":{"light":"#525451","dark":"#6b6f69"},"10":{"light":"#484a47","dark":"#818580"}},"sand":{"1":{"light":"#c7c7c7","dark":"#070706"},"2":{"light":"#b8b8b7","dark":"#0a0a0a"},"3":{"light":"#a9a9a8","dark":"#0e0e0e"},"4":{"light":"#9a9a98","dark":"#121211"},"5":{"light":"#8b8b88","dark":"#161615"},"6":{"light":"#7d7d78","dark":"#1a1a18"},"7":{"light":"#6e6e68","dark":"#1e1e1c"},"8":{"light":"#5e5e59","dark":"#222220"},"9":{"light":"#535350","dark":"#6e6e68"},"10":{"light":"#494946","dark":"#84847f"}},"ruby":{"1":{"light":"#baa8ab","dark":"#240007"},"2":{"light":"#b29198","dark":"#33000a"},"3":{"light":"#b17480","dark":"#42000d"},"4":{"light":"#b74f64","dark":"#570011"},"5":{"light":"#bf2847","dark":"#6b0015"},"6":{"light":"#b50f30","dark":"#85001b"},"7":{"light":"#a00020","dark":"#a30021"},"8":{"light":"#770018","dark":"#d6002b"},"9":{"light":"#600215","dark":"#a00020"},"10":{"light":"#410310","dark":"#d80630"}},"crimson":{"1":{"light":"#d9d1d4","dark":"#1f040f"},"2":{"light":"#cdbec4","dark":"#2d0616"},"3":{"light":"#c6a7b3","dark":"#3a081c"},"4":{"light":"#c38ba2","dark":"#4c0a25"},"5":{"light":"#cb658e","dark":"#5e0d2e"},"6":{"light":"#d43877","dark":"#751039"},"7":{"light":"#cc1c63","dark":"#901446"},"8":{"light":"#a81752","dark":"#bc1a5b"},"9":{"light":"#93184a","dark":"#cc1c63"},"10":{"light":"#76163d","dark":"#e14484"}},"plum":{"1":{"light":"#c7c1c7","dark":"#170a19"},"2":{"light":"#b9afbb","dark":"#210f24"},"3":{"light":"#ad9bb0","dark":"#2b132f"},"4":{"light":"#a484a9","dark":"#39193e"},"5":{"light":"#9f66a8","dark":"#461f4c"},"6":{"light":"#944ba0","dark":"#57265f"},"7":{"light":"#82398e","dark":"#6b2f74"},"8":{"light":"#672d71","dark":"#8c3d99"},"9":{"light":"#592961","dark":"#82398e"},"10":{"light":"#44214a","dark":"#a64fb5"}},"violet":{"1":{"light":"#b7afb9","dark":"#18081c"},"2":{"light":"#aa9cae","dark":"#220b28"},"3":{"light":"#9f85a6","dark":"#2c0f34"},"4":{"light":"#976aa2","dark":"#3a1343"},"5":{"light":"#914ca1","dark":"#481853"},"6":{"light":"#823594","dark":"#591e67"},"7":{"light":"#6f2581","dark":"#6d247f"},"8":{"light":"#541c61","dark":"#8f30a6"},"9":{"light":"#451950","dark":"#6f2581"},"10":{"light":"#301338","dark":"#9636ad"}},"iris":{"1":{"light":"#d8d8dd","dark":"#08081c"},"2":{"light":"#c6c6d0","dark":"#0b0b28"},"3":{"light":"#b1b1c7","dark":"#0e0e34"},"4":{"light":"#9999c0","dark":"#131344"},"5":{"light":"#7979c2","dark":"#171754"},"6":{"light":"#5353c4","dark":"#1c1c68"},"7":{"light":"#3434bf","dark":"#232380"},"8":{"light":"#2b2b9f","dark":"#2e2ea8"},"9":{"light":"#2a2a8c","dark":"#3434bf"},"10":{"light":"#252573","dark":"#6060d0"}},"teal":{"1":{"light":"#859f9d","dark":"#002421"},"2":{"light":"#6d9996","dark":"#00332f"},"3":{"light":"#53948f","dark":"#00423d"},"4":{"light":"#3a8f88","dark":"#005750"},"5":{"light":"#1e8d84","dark":"#006b62"},"6":{"light":"#0a7d73","dark":"#00857a"},"7":{"light":"#00635b","dark":"#00a396"},"8":{"light":"#003a35","dark":"#00d6c5"},"9":{"light":"#012825","dark":"#00635b"},"10":{"light":"#022724","dark":"#049c90"}},"jade":{"1":{"light":"#a3aeab","dark":"#081c17"},"2":{"light":"#8fa39e","dark":"#0b2820"},"3":{"light":"#779c93","dark":"#0e342a"},"4":{"light":"#5d9889","dark":"#134437"},"5":{"light":"#44937e","dark":"#175444"},"6":{"light":"#2e846e","dark":"#1d6854"},"7":{"light":"#1f705b","dark":"#238068"},"8":{"light":"#165041","dark":"#2ea888"},"9":{"light":"#133f33","dark":"#1f705b"},"10":{"light":"#0d2720","dark":"#2f9d81"}},"grass":{"1":{"light":"#b6bcb7","dark":"#0b190d"},"2":{"light":"#a4b0a6","dark":"#102313"},"3":{"light":"#8fa593","dark":"#142e19"},"4":{"light":"#789e7f","dark":"#1b3c21"},"5":{"light":"#5d9b68","dark":"#214a28"},"6":{"light":"#478d53","dark":"#295c32"},"7":{"light":"#367a42","dark":"#32713d"},"8":{"light":"#295e33","dark":"#429450"},"9":{"light":"#244e2c","dark":"#367a42"},"10":{"light":"#1b3921","dark":"#4ba25a"}},"bronze":{"1":{"light":"#cdcbcb","dark":"#15110f"},"2":{"light":"#bfbcba","dark":"#1e1815"},"3":{"light":"#b2aca9","dark":"#271f1b"},"4":{"light":"#a69b96","dark":"#332823"},"5":{"light":"#9c8981","dark":"#40322c"},"6":{"light":"#917569","dark":"#4f3d36"},"7":{"light":"#7f6357","dark":"#614b42"},"8":{"light":"#675046","dark":"#7f6357"},"9":{"light":"#5a473f","dark":"#7f6357"},"10":{"light":"#473933","dark":"#9e8175"}},"brown":{"1":{"light":"#c7c5c3","dark":"#18110c"},"2":{"light":"#bab5b1","dark":"#221911"},"3":{"light":"#aea69e","dark":"#2c2017"},"4":{"light":"#a59689","dark":"#392a1d"},"5":{"light":"#a1856f","dark":"#473424"},"6":{"light":"#967356","dark":"#58402d"},"7":{"light":"#846144","dark":"#6c4f37"},"8":{"light":"#694d36","dark":"#8d6849"},"9":{"light":"#5a4330","dark":"#846144"},"10":{"light":"#463527","dark":"#a87f5d"}},"mint":{"1":{"light":"#f9fafa","dark":"#0a1a16"},"2":{"light":"#e8edec","dark":"#0e2520"},"3":{"light":"#d5e2df","dark":"#123029"},"4":{"light":"#bedad4","dark":"#183f36"},"5":{"light":"#a0d9cd","dark":"#1e4d43"},"6":{"light":"#7bdbc5","dark":"#256053"},"7":{"light":"#55ddbf","dark":"#2d7666"},"8":{"light":"#33d6b2","dark":"#399d87"},"9":{"light":"#2dc8a6","dark":"#55ddbf"},"10":{"light":"#2bab8f","dark":"#8ae5d1"}},"sky":{"1":{"light":"#fcfdfd","dark":"#08181c"},"2":{"light":"#eef2f3","dark":"#0b2228"},"3":{"light":"#d9e5e9","dark":"#0e2c34"},"4":{"light":"#c0dce3","dark":"#133944"},"5":{"light":"#9dd7e7","dark":"#174754"},"6":{"light":"#72d4ef","dark":"#1c5868"},"7":{"light":"#44d2f9","dark":"#206e83"},"8":{"light":"#1cc8f8","dark":"#2593b1"},"9":{"light":"#0fc0f1","dark":"#44d2f9"},"10":{"light":"#12a7d0","dark":"#78dcf7"}}};
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