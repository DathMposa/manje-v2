/**
 * Generates branded app icon assets for Manje.
 * Run with: node generate-icons.js
 */

const { createCanvas, GlobalFonts } = require('@napi-rs/canvas');
const fs = require('fs');
const path = require('path');

const BRAND_PRIMARY = '#1A6B4A'; // Brand Primary Green
const BACKGROUND_WHITE = '#FFFFFF';
const FONT_PATH = path.join(
  __dirname,
  'assets',
  'fonts',
  'Comfortaa-Bold.ttf'
);

// Register the locally downloaded font
GlobalFonts.registerFromPath(FONT_PATH, 'Comfortaa');

function drawIcon({ size, transparentBg }) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  if (!transparentBg) {
    ctx.fillStyle = BACKGROUND_WHITE;
    ctx.fillRect(0, 0, size, size);
  }

  // Scale font size relative to canvas
  // Increased to 65% of width for a much larger presence
  const fontSize = Math.round(size * 0.65);
  ctx.font = `${fontSize}px Comfortaa`;
  
  // Set colors and a very bold stroke for a "fat" look
  ctx.fillStyle = BRAND_PRIMARY;
  ctx.strokeStyle = BRAND_PRIMARY;
  
  // Increased stroke width to 15% of font size for extra "fatness"
  ctx.lineWidth = fontSize * 0.15;
  ctx.lineJoin = 'round'; // Ensure rounded terminals match Comfortaa's style
  
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const x = size / 2;
  const y = size / 2 + size * 0.03; // Optical adjustment for vertical centering

  // Draw both stroke and fill to achieve the requested "fat" look
  ctx.strokeText('M', x, y);
  ctx.fillText('M', x, y);

  return canvas.toBuffer('image/png');
}

const outputs = [
  { file: 'assets/icon.png',          size: 1024, transparentBg: false },
  { file: 'assets/adaptive-icon.png', size: 1024, transparentBg: true  },
  { file: 'assets/splash-icon.png',   size: 1024, transparentBg: false },
  { file: 'assets/favicon.png',       size: 64,   transparentBg: false },
];

for (const { file, size, transparentBg } of outputs) {
  const buffer = drawIcon({ size, transparentBg });
  const outPath = path.join(__dirname, file);
  fs.writeFileSync(outPath, buffer);
  console.log(`✓ ${file}  (${size}x${size})`);
}

console.log('\nDone. Icons regenerated with authentic Comfortaa Bold font and enhanced "fat" styling.');
