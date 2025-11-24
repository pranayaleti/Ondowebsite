#!/bin/bash
# Script to optimize logo.png for web performance
# Requires: imagemagick or sharp-cli (npm install -g sharp-cli)

echo "🖼️  Optimizing logo.png for web performance..."

LOGO_PATH="public/logo.png"

if [ ! -f "$LOGO_PATH" ]; then
    echo "❌ Error: $LOGO_PATH not found"
    exit 1
fi

# Check if imagemagick is available
if command -v convert &> /dev/null; then
    echo "✅ Using ImageMagick..."
    
    # Create optimized PNG (56x56 for navbar)
    convert "$LOGO_PATH" -resize 56x56 -quality 85 -strip "public/logo-56x56.png"
    
    # Create WebP version (56x56)
    convert "$LOGO_PATH" -resize 56x56 -quality 85 -strip "public/logo-56x56.webp"
    
    # Create WebP version (original size, optimized)
    convert "$LOGO_PATH" -quality 85 -strip "public/logo.webp"
    
    echo "✅ Created optimized logo files:"
    echo "   - logo-56x56.png (for navbar)"
    echo "   - logo-56x56.webp (for navbar, WebP)"
    echo "   - logo.webp (full size, WebP)"
    
elif command -v sharp &> /dev/null; then
    echo "✅ Using sharp-cli..."
    sharp -i "$LOGO_PATH" -o "public/logo-56x56.png" --resize 56 56 --quality 85
    sharp -i "$LOGO_PATH" -o "public/logo-56x56.webp" --resize 56 56 --format webp --quality 85
    sharp -i "$LOGO_PATH" -o "public/logo.webp" --format webp --quality 85
    echo "✅ Created optimized logo files"
else
    echo "⚠️  ImageMagick or sharp-cli not found"
    echo "📝 To optimize manually:"
    echo "   1. Resize logo.png to 56x56px (for navbar display)"
    echo "   2. Convert to WebP format (saves ~80% file size)"
    echo "   3. Use online tools like:"
    echo "      - https://squoosh.app/"
    echo "      - https://convertio.co/png-webp/"
    echo ""
    echo "   Target sizes:"
    echo "   - logo-56x56.png: 56x56px, <5KB"
    echo "   - logo-56x56.webp: 56x56px, <3KB"
    echo "   - logo.webp: optimized full size, <20KB"
    exit 1
fi

# Show file sizes
echo ""
echo "📊 File sizes:"
ls -lh public/logo*.{png,webp} 2>/dev/null | awk '{print "   " $9 ": " $5}'

