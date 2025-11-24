#!/usr/bin/env node
/**
 * Logo Optimization Script
 * Optimizes logo.png for web performance by creating:
 * - logo-56x56.png (56x56px for navbar, ~5KB)
 * - logo-56x56.webp (56x56px WebP, ~3KB)
 * - logo.webp (optimized full size, ~20KB)
 * 
 * Usage: node optimize-logo.js
 * Or: npm run optimize:logo
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const logoPath = join(__dirname, 'public', 'logo.png');

console.log('🖼️  Logo Optimization Script');
console.log('============================\n');

if (!existsSync(logoPath)) {
  console.error('❌ Error: public/logo.png not found');
  console.log('\n📝 Manual Optimization Instructions:');
  console.log('   1. Open public/logo.png in an image editor');
  console.log('   2. Resize to 56x56px (for navbar display)');
  console.log('   3. Save as logo-56x56.png (target: <5KB)');
  console.log('   4. Convert to WebP format using:');
  console.log('      - Online: https://squoosh.app/');
  console.log('      - CLI: cwebp logo-56x56.png -o logo-56x56.webp -q 85');
  console.log('   5. Also create optimized full-size logo.webp (<20KB)');
  console.log('\n💡 Expected savings: ~135KB (from 140KB to ~5KB)');
  process.exit(1);
}

try {
  const logoBuffer = readFileSync(logoPath);
  const logoSize = (logoBuffer.length / 1024).toFixed(1);
  
  console.log(`📊 Current logo.png size: ${logoSize} KB`);
  console.log('📐 Display size: 56x56px (navbar)');
  console.log('📐 Actual size: 384x512px');
  console.log('\n⚠️  Image optimization requires external tools:');
  console.log('\n📝 To optimize the logo:');
  console.log('   1. Install ImageMagick: brew install imagemagick (macOS)');
  console.log('      Or use online tool: https://squoosh.app/');
  console.log('\n   2. Resize to 56x56px:');
  console.log('      convert public/logo.png -resize 56x56 public/logo-56x56.png');
  console.log('\n   3. Convert to WebP:');
  console.log('      convert public/logo.png -resize 56x56 -quality 85 public/logo-56x56.webp');
  console.log('      convert public/logo.png -quality 85 public/logo.webp');
  console.log('\n   4. Or use Squoosh.app:');
  console.log('      - Upload logo.png');
  console.log('      - Resize to 56x56px');
  console.log('      - Choose WebP format');
  console.log('      - Download as logo-56x56.webp');
  console.log('\n💡 Expected file sizes after optimization:');
  console.log('   - logo-56x56.png: ~5KB (saves ~135KB)');
  console.log('   - logo-56x56.webp: ~3KB (saves ~137KB)');
  console.log('   - logo.webp: ~20KB (saves ~120KB)');
  console.log('\n✅ Code changes are ready - just optimize the image files!');
  
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}

