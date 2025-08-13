const fs = require('fs');
const path = require('path');

// Ruta absoluta a la carpeta de imágenes
const galleryDir = path.join(__dirname, '../public/gallery');
const outputPath = path.join(__dirname, '../public/gallery-data.json');

try {
  const files = fs
    .readdirSync(galleryDir)
    .filter((file) => file.toLowerCase().endsWith('.webp'))
    .map((file) => `/gallery/${file}`);

  fs.writeFileSync(outputPath, JSON.stringify(files, null, 2));

  console.log(`✅ gallery-data.json generado con ${files.length} imágenes.`);
} catch (err) {
  console.error('❌ Error al generar gallery-data.json:', err.message);
  process.exit(1);
}
