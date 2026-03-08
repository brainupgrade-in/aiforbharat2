#!/bin/bash
# Generate voiceover using Microsoft Edge Neural TTS (free, high quality)
# Voice: Andrew Multilingual Neural - Warm, Confident, Authentic, Conversational

VOICE="en-US-AndrewMultilingualNeural"
RATE="-5%"  # Slightly slower for clarity
SCENES_DIR="public/audio/scenes"
TOTAL_DURATION=0

echo "Generating voiceover with: $VOICE"
echo "Rate: $RATE (slightly slower for presentation clarity)"
echo ""

for txt_file in "$SCENES_DIR"/*.txt; do
    base=$(basename "$txt_file" .txt)
    mp3_file="$SCENES_DIR/${base}.mp3"
    text=$(cat "$txt_file")
    chars=${#text}

    printf "  %-25s (%d chars) ... " "$base.txt" "$chars"

    edge-tts --voice "$VOICE" --rate="$RATE" --text "$text" --write-media "$mp3_file" 2>/dev/null

    duration=$(ffprobe -v quiet -show_entries format=duration -of csv=p=0 "$mp3_file" 2>/dev/null)
    TOTAL_DURATION=$(echo "$TOTAL_DURATION + $duration" | bc)

    printf "✅ %.1fs\n" "$duration"
done

echo ""
echo "Concatenating all scenes with 0.8s gaps..."

# Create silence gap
ffmpeg -y -f lavfi -i anullsrc=r=24000:cl=mono -t 0.8 -c:a libmp3lame -b:a 128k /tmp/silence_gap.mp3 2>/dev/null

# Build concat list
CONCAT_FILE="/tmp/concat_list.txt"
> "$CONCAT_FILE"
first=1
for mp3_file in "$SCENES_DIR"/*.mp3; do
    if [ "$first" = "0" ]; then
        echo "file '/tmp/silence_gap.mp3'" >> "$CONCAT_FILE"
    fi
    echo "file '$(realpath "$mp3_file")'" >> "$CONCAT_FILE"
    first=0
done

# Concatenate
ffmpeg -y -f concat -safe 0 -i "$CONCAT_FILE" -c:a libmp3lame -b:a 192k "public/audio/voiceover-full.mp3" 2>/dev/null

FULL_DURATION=$(ffprobe -v quiet -show_entries format=duration -of csv=p=0 "public/audio/voiceover-full.mp3" 2>/dev/null)

echo ""
echo "=================================================="
echo "Per-scene audio generated:"
for mp3_file in "$SCENES_DIR"/*.mp3; do
    base=$(basename "$mp3_file")
    d=$(ffprobe -v quiet -show_entries format=duration -of csv=p=0 "$mp3_file" 2>/dev/null)
    printf "  ✅ %-25s (%.1fs)\n" "$base" "$d"
done
echo ""
echo "Total duration: ${FULL_DURATION}s ($(echo "$FULL_DURATION * 30 / 1" | bc) frames @ 30fps)"
echo "Full voiceover: public/audio/voiceover-full.mp3"

# Generate timing JSON for Remotion
python3 -c "
import json, subprocess, glob
timing = {}
for f in sorted(glob.glob('$SCENES_DIR/*.mp3')):
    name = f.split('/')[-1].replace('.mp3','')
    r = subprocess.run(['ffprobe','-v','quiet','-show_entries','format=duration','-of','csv=p=0',f], capture_output=True, text=True)
    timing[name] = float(r.stdout.strip())
with open('public/audio/timing.json','w') as f:
    json.dump(timing, f, indent=2)
print('Timing data saved to public/audio/timing.json')
print(json.dumps(timing, indent=2))
"

# Cleanup
rm -f /tmp/silence_gap.mp3 /tmp/concat_list.txt
