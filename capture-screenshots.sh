#!/bin/bash

# Mobile app screenshot capture script
# Captures screenshots of all wireframe pages at mobile viewport size

DOCS_DIR="/home/rajesh/ai-for-bharat-2/docs"
OUTPUT_DIR="/home/rajesh/ai-for-bharat-2/screenshots"
VIEWPORT="390x844"  # iPhone 12/13 size

# Create output directory if it doesn't exist
mkdir -p "$OUTPUT_DIR"

echo "Creating mobile app screenshots..."
echo "Viewport: $VIEWPORT"
echo ""

# Array of pages to screenshot
declare -A PAGES=(
    ["01-landing-page"]="$DOCS_DIR/index.html"
    ["02-dashboard"]="$DOCS_DIR/dashboard.html"
    ["03-glucose-tracker"]="$DOCS_DIR/glucose-tracker.html"
    ["04-meal-analyzer"]="$DOCS_DIR/meal-analyzer.html"
    ["05-retina-scan"]="$DOCS_DIR/retina-scan.html"
    ["06-ai-advisor"]="$DOCS_DIR/chatbot.html"
)

# Capture screenshots using Chrome headless
for name in "${!PAGES[@]}"; do
    file="${PAGES[$name]}"
    output="$OUTPUT_DIR/screenshot-$name.png"

    echo "Capturing: $name"
    echo "  Source: $file"
    echo "  Output: $output"

    google-chrome --headless --disable-gpu \
        --window-size=$VIEWPORT \
        --screenshot="$output" \
        --hide-scrollbars \
        --force-device-scale-factor=2 \
        "file://$file" 2>/dev/null

    if [ $? -eq 0 ]; then
        echo "  ✓ Success"
    else
        echo "  ✗ Failed"
    fi
    echo ""
done

echo "Screenshot capture complete!"
echo "Screenshots saved in: $OUTPUT_DIR"
ls -lh "$OUTPUT_DIR"/screenshot-*.png 2>/dev/null
