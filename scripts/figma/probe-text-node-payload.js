// Read-only health check for a specific text node.
// Paste the body into use_figma and set TARGET_ID.

const TARGET_ID = '1818:19794';

function getOwnerPage(node) {
  let current = node;
  while (current && current.type !== 'PAGE') current = current.parent;
  return current;
}

const node = await figma.getNodeByIdAsync(TARGET_ID);
if (!node) {
  return {
    ok: false,
    targetId: TARGET_ID,
    reason: 'NODE_NOT_FOUND',
    fileName: figma.root.name,
    currentPage: figma.currentPage.name,
  };
}

const ownerPage = getOwnerPage(node);
if (ownerPage) {
  await figma.setCurrentPageAsync(ownerPage);
}

const availableFonts = await figma.listAvailableFontsAsync();
const notoSansScRegular = availableFonts.some(
  (font) => font.fontName.family === 'Noto Sans SC' && font.fontName.style === 'Regular',
);

return {
  ok: true,
  fileName: figma.root.name,
  currentPage: figma.currentPage.name,
  targetId: node.id,
  targetType: node.type,
  targetName: node.name,
  targetCharacters: node.type === 'TEXT' ? node.characters : null,
  targetFontName: node.type === 'TEXT' ? node.fontName : null,
  hasNotoSansScRegular: notoSansScRegular,
};
