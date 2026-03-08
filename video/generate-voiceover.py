#!/usr/bin/env python3
"""Generate per-scene voiceover using ElevenLabs API with realistic conversational voice."""

import os
import json
import glob
import subprocess
from pathlib import Path

API_KEY = "sk_aa9d04b26e6da868e124b8d615c1561bba2e3541b8bb099e"
SCENES_DIR = Path("public/audio/scenes")
OUTPUT_DIR = Path("public/audio")

# ElevenLabs voice options for realistic conversational tone:
# "Brian" - warm male, great for presentations
# "Rachel" - warm female, conversational
# "Adam" - deep male, authoritative yet warm
# "Aria" - conversational female
# Using "Brian" for a warm, confident male presenter voice
VOICE_ID = "nPczCjzI2devNBz1zQrb"  # Brian - warm male conversational

# For realistic conversational voice:
VOICE_SETTINGS = {
    "stability": 0.65,        # Lower = more expressive/natural
    "similarity_boost": 0.85,  # High similarity to voice profile
    "style": 0.45,            # Some style variation for conversational feel
    "use_speaker_boost": True  # Enhanced clarity
}

MODEL_ID = "eleven_multilingual_v2"  # Best quality multilingual model


def list_voices():
    """List available voices to pick the best one."""
    import urllib.request
    req = urllib.request.Request(
        "https://api.elevenlabs.io/v1/voices",
        headers={"xi-api-key": API_KEY}
    )
    with urllib.request.urlopen(req) as resp:
        data = json.loads(resp.read())
    print("\nAvailable voices:")
    for v in data["voices"]:
        labels = v.get("labels", {})
        accent = labels.get("accent", "")
        desc = labels.get("description", "")
        use_case = labels.get("use_case", "")
        print(f"  {v['voice_id']}: {v['name']} ({accent}) - {desc} - {use_case}")


def generate_scene_audio(scene_file: Path, output_file: Path) -> float:
    """Generate audio for a single scene script."""
    import urllib.request

    text = scene_file.read_text().strip()
    if not text:
        print(f"  SKIP {scene_file.name} (empty)")
        return 0.0

    payload = json.dumps({
        "text": text,
        "model_id": MODEL_ID,
        "voice_settings": VOICE_SETTINGS
    }).encode()

    req = urllib.request.Request(
        f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}",
        data=payload,
        headers={
            "xi-api-key": API_KEY,
            "Content-Type": "application/json",
            "Accept": "audio/mpeg"
        }
    )

    with urllib.request.urlopen(req) as resp:
        audio_data = resp.read()

    output_file.write_bytes(audio_data)

    # Get duration using ffprobe
    try:
        result = subprocess.run(
            ["ffprobe", "-v", "quiet", "-show_entries", "format=duration",
             "-of", "csv=p=0", str(output_file)],
            capture_output=True, text=True
        )
        duration = float(result.stdout.strip())
    except Exception:
        duration = 0.0

    return duration


def concat_audio(audio_files: list, output: Path):
    """Concatenate audio files using ffmpeg with small gaps between scenes."""
    # Create a silence file (0.5s gap between scenes)
    silence = OUTPUT_DIR / "_silence.mp3"
    subprocess.run([
        "ffmpeg", "-y", "-f", "lavfi", "-i",
        "anullsrc=r=44100:cl=mono", "-t", "0.5",
        "-c:a", "libmp3lame", "-b:a", "128k", str(silence)
    ], capture_output=True)

    # Build concat list with silences between
    list_file = OUTPUT_DIR / "_concat.txt"
    lines = []
    for i, f in enumerate(audio_files):
        lines.append(f"file '{f.resolve()}'")
        if i < len(audio_files) - 1:
            lines.append(f"file '{silence.resolve()}'")
    list_file.write_text("\n".join(lines))

    subprocess.run([
        "ffmpeg", "-y", "-f", "concat", "-safe", "0",
        "-i", str(list_file), "-c:a", "libmp3lame", "-b:a", "192k",
        str(output)
    ], capture_output=True)

    # Cleanup
    silence.unlink(missing_ok=True)
    list_file.unlink(missing_ok=True)


def main():
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    # Find all scene scripts
    scene_files = sorted(SCENES_DIR.glob("*.txt"))
    if not scene_files:
        print("No scene scripts found in", SCENES_DIR)
        return

    print(f"Found {len(scene_files)} scene scripts")
    print(f"Voice: Brian (warm male conversational)")
    print(f"Model: {MODEL_ID}")
    print()

    # First, list voices to help pick (uncomment if needed)
    # list_voices()

    audio_files = []
    total_duration = 0.0
    total_chars = 0

    for sf in scene_files:
        text = sf.read_text().strip()
        chars = len(text)
        total_chars += chars

        out_name = sf.stem + ".mp3"
        out_path = OUTPUT_DIR / "scenes" / out_name

        print(f"  Generating {sf.name} ({chars} chars)...", end=" ", flush=True)
        duration = generate_scene_audio(sf, out_path)
        total_duration += duration
        audio_files.append(out_path)
        print(f"✅ {duration:.1f}s")

    # Concat all scenes
    concat_output = OUTPUT_DIR / "voiceover-full.mp3"
    print(f"\nConcatenating {len(audio_files)} scenes...")
    concat_audio(audio_files, concat_output)

    # Get final duration
    try:
        result = subprocess.run(
            ["ffprobe", "-v", "quiet", "-show_entries", "format=duration",
             "-of", "csv=p=0", str(concat_output)],
            capture_output=True, text=True
        )
        full_duration = float(result.stdout.strip())
    except Exception:
        full_duration = total_duration

    print(f"\n{'='*50}")
    print(f"Per-scene audio generated:")
    for af in audio_files:
        try:
            result = subprocess.run(
                ["ffprobe", "-v", "quiet", "-show_entries", "format=duration",
                 "-of", "csv=p=0", str(af)],
                capture_output=True, text=True
            )
            d = float(result.stdout.strip())
        except Exception:
            d = 0
        print(f"  ✅ {af.name} ({d:.1f}s)")
    print(f"\nTotal: {full_duration:.1f}s ({int(full_duration * 30)} frames @ 30fps)")
    print(f"Characters: {total_chars}")
    print(f"Concatenated: {concat_output}")

    # Save timing data for Remotion
    timing = {}
    for af in audio_files:
        try:
            result = subprocess.run(
                ["ffprobe", "-v", "quiet", "-show_entries", "format=duration",
                 "-of", "csv=p=0", str(af)],
                capture_output=True, text=True
            )
            timing[af.stem] = float(result.stdout.strip())
        except Exception:
            timing[af.stem] = 0

    timing_file = OUTPUT_DIR / "timing.json"
    timing_file.write_text(json.dumps(timing, indent=2))
    print(f"Timing data: {timing_file}")


if __name__ == "__main__":
    main()
