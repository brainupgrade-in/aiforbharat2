# App Icons

This directory should contain the PWA app icons referenced in `manifest.json`.

## Required Icon Sizes

Create PNG files with the following sizes:
- icon-72x72.png
- icon-96x96.png
- icon-128x128.png
- icon-144x144.png
- icon-152x152.png
- icon-192x192.png
- icon-384x384.png
- icon-512x512.png

## Design Guidelines

**Colors:**
- Primary: #2563eb (Blue)
- Secondary: #10b981 (Green)
- Use gradient from blue to green

**Symbol:**
- Glucose drop, heart with pulse, or medical cross
- Include "DC" or "DiabetCare" text

**Style:**
- Flat design
- Rounded corners (maskable safe zone)
- High contrast for visibility

## Quick Generation Options

### Option 1: Online Tools (Easiest)
1. Visit https://realfavicongenerator.net/
2. Upload a 512x512 image
3. Download all sizes

### Option 2: ImageMagick (Command Line)
```bash
# Create base icon (512x512) first, then:
for size in 72 96 128 144 152 192 384 512; do
  convert icon-512x512.png -resize ${size}x${size} icon-${size}x${size}.png
done
```

### Option 3: Figma/Canva
1. Create 512x512 artboard
2. Design with DiabetCare branding
3. Export as PNG in all required sizes

## Temporary Fallback

Until icons are created, the app will show browser default favicon. The wireframes work perfectly without custom icons - they're only needed for final PWA installation and branding.

## Current Status

⚠️ **Icons not yet created** - Please create icons using one of the methods above before deploying to production.
