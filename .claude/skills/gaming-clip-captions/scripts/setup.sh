#!/usr/bin/env bash
# Idempotent setup for the gaming-clip-captions skill.
# Lightweight — Pillow/numpy only, no ASR deps (word timestamps come from
# vod-clip-extraction's transcribe_words.py / words.json, not from this skill).
set -euo pipefail

SKILL_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo "==> gaming-clip-captions setup ($SKILL_DIR)"

if ! command -v ffmpeg >/dev/null 2>&1; then
  echo "ffmpeg not found. Install via: brew install ffmpeg"; exit 1
fi

if ! command -v uv >/dev/null 2>&1; then
  echo "uv not found. Install via: brew install uv"; exit 1
fi

VENV_DIR="$SKILL_DIR/.venv"
if [ ! -d "$VENV_DIR" ]; then
  echo "==> Creating venv at $VENV_DIR"
  uv python install 3.12
  uv venv --python 3.12 "$VENV_DIR"
fi
# shellcheck disable=SC1091
source "$VENV_DIR/bin/activate"

if ! python3 -c "import PIL, numpy" >/dev/null 2>&1; then
  echo "==> Installing Pillow + numpy"
  uv pip install Pillow numpy
fi

for f in \
  "/mnt/d/Thumbnails/Thumbnail making/FONTS/impact.ttf" \
  "/usr/share/fonts/truetype/noto/NotoColorEmoji.ttf"
do
  if [ ! -f "$f" ]; then
    echo "WARNING: expected font not found: $f"
  fi
done

echo "==> setup OK"
