/**
 * Generates PNG icons from the SVG source.
 * Run once: node generate-icons.mjs
 * Requires: npm install -g sharp-cli  OR  npx @squoosh/cli
 *
 * Fallback: uses a simple canvas approach with node-canvas if available,
 * otherwise creates minimal placeholder PNGs.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Minimal 1x1 blue PNG encoded as base64 — scaled by browser
// For production, replace with real PNG icons generated from icon.svg
const BLUE = '#007AFF';

// Try to use sharp if available
async function generateWithSharp() {
  const { default: sharp } = await import('sharp');
  const svgPath = path.join(__dirname, 'public/icons/icon.svg');
  const svg = fs.readFileSync(svgPath);

  const sizes = [
    { name: 'icon-192.png', size: 192 },
    { name: 'icon-512.png', size: 512 },
    { name: 'icon-512-maskable.png', size: 512 },
    { name: 'apple-touch-icon.png', size: 180 },
  ];

  for (const { name, size } of sizes) {
    await sharp(svg)
      .resize(size, size)
      .png()
      .toFile(path.join(__dirname, 'public/icons', name));
    console.log(`Generated ${name}`);
  }
}

generateWithSharp().catch(() => {
  console.log('sharp not available — install it with: npm install sharp');
  console.log('Alternatively, use any SVG-to-PNG tool on public/icons/icon.svg');
});
