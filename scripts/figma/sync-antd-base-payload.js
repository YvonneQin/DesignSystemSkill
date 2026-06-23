function hexToRgba(hex) {
  let h = String(hex).replace('#', '');
  if (h.length === 8) h = h.slice(0, 6);
  return {
    r: parseInt(h.slice(0, 2), 16) / 255,
    g: parseInt(h.slice(2, 4), 16) / 255,
    b: parseInt(h.slice(4, 6), 16) / 255,
    a: 1,
  };
}

const DATA = {"blue":{"50":{"light":"#e6f4ff","dark":"#111a2c"},"100":{"light":"#bae0ff","dark":"#112545"},"200":{"light":"#91caff","dark":"#15325b"},"300":{"light":"#69b1ff","dark":"#15417e"},"400":{"light":"#4096ff","dark":"#1554ad"},"500":{"light":"#1677ff","dark":"#1668dc"},"600":{"light":"#0958d9","dark":"#3c89e8"},"700":{"light":"#003eb3","dark":"#65a9f3"},"800":{"light":"#002c8c","dark":"#8dc5f8"},"900":{"light":"#001d66","dark":"#b7dcfa"}},"cyan":{"50":{"light":"#e6fffb","dark":"#112123"},"100":{"light":"#b5f5ec","dark":"#113536"},"200":{"light":"#87e8de","dark":"#144848"},"300":{"light":"#5cdbd3","dark":"#146262"},"400":{"light":"#36cfc9","dark":"#138585"},"500":{"light":"#13c2c2","dark":"#13a8a8"},"600":{"light":"#08979c","dark":"#33bcb7"},"700":{"light":"#006d75","dark":"#58d1c9"},"800":{"light":"#00474f","dark":"#84e2d8"},"900":{"light":"#002329","dark":"#b2f1e8"}},"geekblue":{"50":{"light":"#f0f5ff","dark":"#131629"},"100":{"light":"#d6e4ff","dark":"#161d40"},"200":{"light":"#adc6ff","dark":"#1c2755"},"300":{"light":"#85a5ff","dark":"#203175"},"400":{"light":"#597ef7","dark":"#263ea0"},"500":{"light":"#2f54eb","dark":"#2b4acb"},"600":{"light":"#1d39c4","dark":"#5273e0"},"700":{"light":"#10239e","dark":"#7f9ef3"},"800":{"light":"#061178","dark":"#a8c1f8"},"900":{"light":"#030852","dark":"#d2e0fa"}},"gold":{"50":{"light":"#fffbe6","dark":"#2b2111"},"100":{"light":"#fff1b8","dark":"#443111"},"200":{"light":"#ffe58f","dark":"#594214"},"300":{"light":"#ffd666","dark":"#7c5914"},"400":{"light":"#ffc53d","dark":"#aa7714"},"500":{"light":"#faad14","dark":"#d89614"},"600":{"light":"#d48806","dark":"#e8b339"},"700":{"light":"#ad6800","dark":"#f3cc62"},"800":{"light":"#874d00","dark":"#f8df8b"},"900":{"light":"#613400","dark":"#faedb5"}},"green":{"50":{"light":"#f6ffed","dark":"#162312"},"100":{"light":"#d9f7be","dark":"#1d3712"},"200":{"light":"#b7eb8f","dark":"#274916"},"300":{"light":"#95de64","dark":"#306317"},"400":{"light":"#73d13d","dark":"#3c8618"},"500":{"light":"#52c41a","dark":"#49aa19"},"600":{"light":"#389e0d","dark":"#6abe39"},"700":{"light":"#237804","dark":"#8fd460"},"800":{"light":"#135200","dark":"#b2e58b"},"900":{"light":"#092b00","dark":"#d5f2bb"}},"lime":{"50":{"light":"#fcffe6","dark":"#1f2611"},"100":{"light":"#f4ffb8","dark":"#2e3c10"},"200":{"light":"#eaff8f","dark":"#3e4f13"},"300":{"light":"#d3f261","dark":"#536d13"},"400":{"light":"#bae637","dark":"#6f9412"},"500":{"light":"#a0d911","dark":"#8bbb11"},"600":{"light":"#7cb305","dark":"#a9d134"},"700":{"light":"#5b8c00","dark":"#c9e75d"},"800":{"light":"#3f6600","dark":"#e4f88b"},"900":{"light":"#254000","dark":"#f0fab5"}},"magenta":{"50":{"light":"#fff0f6","dark":"#291321"},"100":{"light":"#ffd6e7","dark":"#40162f"},"200":{"light":"#ffadd2","dark":"#551c3b"},"300":{"light":"#ff85c0","dark":"#75204f"},"400":{"light":"#f759ab","dark":"#a02669"},"500":{"light":"#eb2f96","dark":"#cb2b83"},"600":{"light":"#c41d7f","dark":"#e0529c"},"700":{"light":"#9e1068","dark":"#f37fb7"},"800":{"light":"#780650","dark":"#f8a8cc"},"900":{"light":"#520339","dark":"#fad2e3"}},"orange":{"50":{"light":"#fff7e6","dark":"#2b1d11"},"100":{"light":"#ffe7ba","dark":"#442a11"},"200":{"light":"#ffd591","dark":"#593815"},"300":{"light":"#ffc069","dark":"#7c4a15"},"400":{"light":"#ffa940","dark":"#aa6215"},"500":{"light":"#fa8c16","dark":"#d87a16"},"600":{"light":"#d46b08","dark":"#e89a3c"},"700":{"light":"#ad4e00","dark":"#f3b765"},"800":{"light":"#873800","dark":"#f8cf8d"},"900":{"light":"#612500","dark":"#fae3b7"}},"purple":{"50":{"light":"#f9f0ff","dark":"#1a1325"},"100":{"light":"#efdbff","dark":"#24163a"},"200":{"light":"#d3adf7","dark":"#301c4d"},"300":{"light":"#b37feb","dark":"#3e2069"},"400":{"light":"#9254de","dark":"#51258f"},"500":{"light":"#722ed1","dark":"#642ab5"},"600":{"light":"#531dab","dark":"#854eca"},"700":{"light":"#391085","dark":"#ab7ae0"},"800":{"light":"#22075e","dark":"#cda8f0"},"900":{"light":"#120338","dark":"#ebd7fa"}},"red":{"50":{"light":"#fff1f0","dark":"#2a1215"},"100":{"light":"#ffccc7","dark":"#431418"},"200":{"light":"#ffa39e","dark":"#58181c"},"300":{"light":"#ff7875","dark":"#791a1f"},"400":{"light":"#ff4d4f","dark":"#a61d24"},"500":{"light":"#f5222d","dark":"#d32029"},"600":{"light":"#cf1322","dark":"#e84749"},"700":{"light":"#a8071a","dark":"#f37370"},"800":{"light":"#820014","dark":"#f89f9a"},"900":{"light":"#5c0011","dark":"#fac8c3"}},"volcano":{"50":{"light":"#fff2e8","dark":"#2b1611"},"100":{"light":"#ffd8bf","dark":"#441d12"},"200":{"light":"#ffbb96","dark":"#592716"},"300":{"light":"#ff9c6e","dark":"#7c3118"},"400":{"light":"#ff7a45","dark":"#aa3e19"},"500":{"light":"#fa541c","dark":"#d84a1b"},"600":{"light":"#d4380d","dark":"#e87040"},"700":{"light":"#ad2102","dark":"#f3956a"},"800":{"light":"#871400","dark":"#f8b692"},"900":{"light":"#610b00","dark":"#fad4bc"}},"yellow":{"50":{"light":"#feffe6","dark":"#2b2611"},"100":{"light":"#ffffb8","dark":"#443b11"},"200":{"light":"#fffb8f","dark":"#595014"},"300":{"light":"#fff566","dark":"#7c6e14"},"400":{"light":"#ffec3d","dark":"#aa9514"},"500":{"light":"#fadb14","dark":"#d8bd14"},"600":{"light":"#d4b106","dark":"#e8d639"},"700":{"light":"#ad8b00","dark":"#f3ea62"},"800":{"light":"#876800","dark":"#f8f48b"},"900":{"light":"#614700","dark":"#fafab5"}}};

const collections = await figma.variables.getLocalVariableCollectionsAsync();
const modeColl = collections.find(c => c.name === 'Mode');
if (!modeColl) throw new Error('Mode collection missing');
const lightId = modeColl.modes.find(m => m.name === 'Light').modeId;
const darkId = modeColl.modes.find(m => m.name === 'Dark').modeId;

const vars = await figma.variables.getLocalVariablesAsync();
const existingBase = vars.filter(v => v.name.startsWith('Base/'));
let removed = 0;
for (const v of existingBase) { v.remove(); removed++; }

let created = 0;
for (const [palette, steps] of Object.entries(DATA)) {
  for (const [step, colors] of Object.entries(steps)) {
    const name = `Base/${palette}/${step}`;
    const v = figma.variables.createVariable(name, modeColl, 'COLOR');
    v.scopes = [];
    v.description = 'Ant Design base palette (50-900)';
    v.setVariableCodeSyntax('WEB', `var(--${palette}-${step})`);
    v.setValueForMode(lightId, hexToRgba(colors.light));
    v.setValueForMode(darkId, hexToRgba(colors.dark));
    created++;
  }
}

return { removed, created, palettes: Object.keys(DATA).length, sample: Object.keys(DATA) };