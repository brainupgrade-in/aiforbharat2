#!/bin/bash

# Full-page mobile screenshot capture using Firefox
# Firefox has better full-page screenshot support

DOCS_DIR="/home/rajesh/ai-for-bharat-2/docs"
OUTPUT_DIR="/home/rajesh/ai-for-bharat-2/screenshots"
VIEWPORT="390,844"

# Create output directory
mkdir -p "$OUTPUT_DIR"

echo "Creating full-page mobile app screenshots with Firefox..."
echo "Viewport: $VIEWPORT"
echo ""

# Array of pages
declare -A PAGES=(
    ["01-landing-page"]="index.html"
    ["02-dashboard"]="dashboard.html"
    ["03-glucose-tracker"]="glucose-tracker.html"
    ["04-meal-analyzer"]="meal-analyzer.html"
    ["05-retina-scan"]="retina-scan.html"
    ["06-ai-advisor"]="chatbot.html"
)

# Capture screenshots using Firefox
for name in "${!PAGES[@]}"; do
    file="${PAGES[$name]}"
    input="file://$DOCS_DIR/$file"
    output="$OUTPUT_DIR/screenshot-$name-full.png"

    echo "Capturing: $name"
    echo "  Source: $file"
    echo "  Output: $output"

    # Firefox headless with screenshot
    firefox --headless --screenshot "$output" \
        --window-size=$VIEWPORT \
        "$input" 2>/dev/null

    if [ -f "$output" ]; then
        size=$(du -h "$output" | cut -f1)
        echo "  ✓ Success ($size)"
    else
        echo "  ✗ Failed"
    fi
    echo ""

    # Small delay between captures
    sleep 1
done

echo "Screenshot capture complete!"
echo ""
ls -lh "$OUTPUT_DIR"/screenshot-*-full.png 2>/dev/null
