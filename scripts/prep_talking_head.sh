#!/usr/bin/env bash
# prep_talking_head.sh
# Prepares a talking head video for the Remotion circle overlay.
#
# Usage:
#   ./scripts/prep_talking_head.sh input.mp4 [output_size]
#
# Arguments:
#   input.mp4    — your raw talking head video
#   output_size  — pixel diameter of the circle (default: 600, 2x the 300px CSS size for retina)
#
# Output: public/talking_head.mp4 (ready to drop into Remotion)

set -euo pipefail

INPUT="${1:-}"
SIZE="${2:-600}"
OUTPUT="public/talking_head.mp4"

if [[ -z "$INPUT" ]]; then
  echo "Usage: $0 input.mp4 [output_size]"
  exit 1
fi

if [[ ! -f "$INPUT" ]]; then
  echo "Error: file not found: $INPUT"
  exit 1
fi

echo "→ Detecting input dimensions..."
WIDTH=$(ffprobe -v error -select_streams v:0 -show_entries stream=width  -of csv=p=0 "$INPUT")
HEIGHT=$(ffprobe -v error -select_streams v:0 -show_entries stream=height -of csv=p=0 "$INPUT")
echo "  Source: ${WIDTH}x${HEIGHT}"

# ─── Step 1: Center-crop to square ───────────────────────────────────────────
# Takes the largest centered square from the source frame.
# For portrait talking-head (e.g. 1080x1920): crops 1080x1080 from vertical center.
# For landscape (e.g. 1920x1080): crops 1080x1080 from horizontal center.
CROP_SIZE=$(( WIDTH < HEIGHT ? WIDTH : HEIGHT ))
CROP_X=$(( (WIDTH  - CROP_SIZE) / 2 ))
CROP_Y=$(( (HEIGHT - CROP_SIZE) / 2 ))

# Move crop origin up by 10% of CROP_SIZE to better center on the head/face
# (head is typically in the upper-center of a portrait frame)
HEAD_OFFSET=$(( CROP_SIZE / 10 ))
CROP_Y=$(( CROP_Y - HEAD_OFFSET ))
# Clamp to valid range
if (( CROP_Y < 0 )); then CROP_Y=0; fi

echo "→ Cropping ${CROP_SIZE}x${CROP_SIZE} at offset (${CROP_X}, ${CROP_Y}) …"

# ─── Step 2: Scale to output size ────────────────────────────────────────────
echo "→ Scaling to ${SIZE}x${SIZE} …"

# ─── Step 3: Encode ──────────────────────────────────────────────────────────
# H.264 / yuv420p: universally supported by browsers & Remotion's OffthreadVideo.
# -movflags +faststart: moov atom at front — browser can start decoding immediately
#   (critical for preventing the first-frame flicker in Remotion Player preview).
# -crf 18: near-lossless quality; raise to 23 for smaller files.
# -preset slow: better compression at same quality.
# Audio is kept (-c:a aac) so Remotion can mux it; remove -c:a / add -an if audio not needed.

mkdir -p public

TMPOUT="$(dirname "$OUTPUT")/.tmp_$(basename "$OUTPUT")"

ffmpeg -y -i "$INPUT" \
  -vf "crop=${CROP_SIZE}:${CROP_SIZE}:${CROP_X}:${CROP_Y},scale=${SIZE}:${SIZE}:flags=lanczos" \
  -c:v libx264 \
  -crf 18 \
  -preset slow \
  -pix_fmt yuv420p \
  -movflags +faststart \
  -c:a aac \
  -b:a 192k \
  "$TMPOUT"

mv "$TMPOUT" "$OUTPUT"

echo ""
echo "✓ Done → $OUTPUT"
echo "  Resolution: ${SIZE}x${SIZE}  |  Format: H.264/AAC/MP4"
echo ""
echo "  Drop this file into remotion-test/public/ and render with:"
echo "  npx remotion render Presentation out/presentation.mp4"
