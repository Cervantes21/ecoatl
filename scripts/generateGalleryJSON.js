// scripts/generateGalleryJSON.js
const fs = require('fs');
const path = require('path');

const galleryDir = path.join(process.cwd(), 'public/gallery');
const outputDir = path.join(process.cwd(), 'data');
const outputPath = path.join(outputDir, 'gallery-data.json');

function buildTree(absDir, urlPrefix = '/gallery') {
  const entries = fs.readdirSync(absDir, { withFileTypes: true });
  const node = { _files: [] };

  for (const entry of entries) {
    const absPath = path.join(absDir, entry.name);
    const relUrl = path.posix.join(urlPrefix, entry.name);

    if (entry.isDirectory()) {
      node[entry.name] = buildTree(absPath, relUrl);
    } else if (entry.isFile()) {
      const lower = entry.name.toLowerCase();
      // Ajusta extensiones si quieres incluir videos
      if (lower.endsWith('.webp') || lower.endsWith('.jpg') || lower.endsWith('.jpeg') || lower.endsWith('.png')) {
        node._files.push(relUrl);
      }
    }
  }

  // Ordena para consistencia visual
  node._files.sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));
  return node;
}

try {
  if (!fs.existsSync(galleryDir)) throw new Error('No existe /public/gallery');

  const tree = buildTree(galleryDir, '/gallery');

  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);
  fs.writeFileSync(outputPath, JSON.stringify(tree, null, 2));

  console.log(`✅ gallery-data.json generado en ${outputPath}`);
} catch (err) {
  console.error('❌ Error al generar gallery-data.json:', err.message);
  process.exit(1);
}
