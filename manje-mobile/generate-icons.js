/**
 * Generates branded app icon assets for Manje.
 * Run with: node generate-icons.js
 *
 * Produces:
 *   assets/icon.png          1024x1024  green bg + white M  (iOS app icon)
 *   assets/adaptive-icon.png 1024x1024  transparent bg + white M  (Android foreground layer)
 *   assets/splash-icon.png   1024x1024  green bg + white M  (splash screen)
 *   assets/favicon.png         64x64   green bg + white M  (web favicon)
 */

const { createCanvas, GlobalFonts } = require('@napi-rs/canvas');
const fs = require('fs');
const path = require('path');

const BRAND_GREEN = '#1A6B4A';
const FONT_PATH = path.join(
  __dirname,
  'node_modules/@expo-google-fonts/syne/800ExtraBold/Syne_800ExtraBold.ttf'
);

GlobalFonts.registerFromPath(FONT_PATH, 'Syne');

function drawIcon({ size, transparentBg }) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  if (!transparentBg) {
    ctx.fillStyle = BRAND_GREEN;
    ctx.fillRect(0, 0, size, size);
  }

  // Scale font size relative to canvas — 58% of width works well for ExtraBold M
  const fontSize = Math.round(size * 0.58);
  ctx.font = `${fontSize}px Syne`;
  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Visually centre: ExtraBold caps sit slightly above the geometric middle,
  // nudge down by ~3% to optically balance within the safe zone
  ctx.fillText('M', size / 2, size / 2 + size * 0.03);

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

console.log('\nDone. Run `npx expo start` to preview the icons.');
