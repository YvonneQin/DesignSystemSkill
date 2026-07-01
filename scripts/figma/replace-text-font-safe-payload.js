// Replace a text node's font and content with explicit font validation.
// Paste the body into use_figma and set TARGET_ID / NEXT_TEXT / TARGET_FONT.

const TARGET_ID = '1818:19794';
const NEXT_TEXT = '01';
const TARGET_FONT = { family: 'Noto Sans SC', style: 'Regular' };

function getOwnerPage(node) {
  let current = node;
  while (current && current.type !== 'PAGE') current = current.parent;
  return current;
}

async function loadExistingFonts(textNode) {
  const segments = textNode.getStyledTextSegments(['fontName']);
  const seen = new Set();

  for (const segment of segments) {
    const fontName = segment.fontName;
    if (!fontName || fontName === figma.mixed) continue;
    const key = `${fontName.family}__${fontName.style}`;
    if (seen.has(key)) continue;
    seen.add(key);
    await figma.loadFontAsync(fontName);
  }

  if (segments.length === 0 && textNode.fontName !== figma.mixed) {
    await figma.loadFontAsync(textNode.fontName);
  }
}

const node = await figma.getNodeByIdAsync(TARGET_ID);
if (!node) throw new Error(`Node not found: ${TARGET_ID}`);
if (node.type !== 'TEXT') throw new Error(`Target node is not TEXT: ${node.type}`);

const ownerPage = getOwnerPage(node);
if (ownerPage) {
  await figma.setCurrentPageAsync(ownerPage);
}

const availableFonts = await figma.listAvailableFontsAsync();
const targetFontExists = availableFonts.some(
  (font) =>
    font.fontName.family === TARGET_FONT.family &&
    font.fontName.style === TARGET_FONT.style,
);

if (!targetFontExists) {
  return {
    ok: false,
    reason: 'TARGET_FONT_UNAVAILABLE',
    requestedFont: TARGET_FONT,
    targetId: node.id,
    currentFontName: node.fontName,
    sameFamilyStyles: availableFonts
      .filter((font) => font.fontName.family === TARGET_FONT.family)
      .map((font) => font.fontName.style),
  };
}

await loadExistingFonts(node);
await figma.loadFontAsync(TARGET_FONT);

const before = {
  characters: node.characters,
  fontName: node.fontName,
};

node.fontName = TARGET_FONT;
node.characters = NEXT_TEXT;

return {
  ok: true,
  mutatedNodeIds: [node.id],
  before,
  after: {
    characters: node.characters,
    fontName: node.fontName,
  },
};
