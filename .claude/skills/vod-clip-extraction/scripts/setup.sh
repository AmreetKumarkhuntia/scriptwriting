#!/usr/bin/env bash
# Idempotent setup for the vod-clip-extraction skill's local ASR.
# Installs faster-whisper/CTranslate2 (no torch/WhisperX needed — this
# skill uses faster-whisper's own word timestamps directly, not forced
# alignment) and downloads+converts the Hinglish model to the E-drive
# models store.
set -euo pipefail

SKILL_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
MODEL_DIR="/mnt/e/models/whisper-hinglish-prime-ct2"
HF_CACHE="/mnt/e/models/huggingface"

echo "==> vod-clip-extraction setup ($SKILL_DIR)"

if ! command -v ffmpeg >/dev/null 2>&1; then
  echo "ffmpeg not found. Install via: brew install ffmpeg"; exit 1
fi
echo "    ffmpeg: $(ffmpeg -version | head -n1)"

if ! command -v uv >/dev/null 2>&1; then
  echo "uv not found. Install via: brew install uv"; exit 1
fi

VENV_DIR="$SKILL_DIR/.venv"
if [ ! -d "$VENV_DIR" ]; then
  echo "==> Creating venv at $VENV_DIR (Python 3.12 — the system default is too new for some ML wheels)"
  uv python install 3.12
  uv venv --python 3.12 "$VENV_DIR"
fi
# shellcheck disable=SC1091
source "$VENV_DIR/bin/activate"

if ! python3 -c "import faster_whisper" >/dev/null 2>&1; then
  echo "==> Installing faster-whisper + ctranslate2 + CUDA runtime libs"
  uv pip install faster-whisper ctranslate2 "transformers[torch]" \
    nvidia-cublas-cu12 "nvidia-cudnn-cu12==9.*"
fi
echo "    faster-whisper: $(python3 -c 'import faster_whisper; print(faster_whisper.__version__)')"
echo "    ctranslate2: $(python3 -c 'import ctranslate2; print(ctranslate2.__version__)') (need >=4.7.0 for Blackwell/sm_120 GPUs)"

if [ ! -f "$MODEL_DIR/model.bin" ]; then
  echo "==> Converting Oriserve/Whisper-Hindi2Hinglish-Prime to CTranslate2 (one-time, ~1.5GB, downloaded to E-drive not local disk)"
  mkdir -p "$HF_CACHE"
  HF_HOME="$HF_CACHE" ct2-transformers-converter \
    --model Oriserve/Whisper-Hindi2Hinglish-Prime \
    --output_dir "$MODEL_DIR" --quantization int8_float16 \
    --copy_files tokenizer.json preprocessor_config.json

  # BUG WORKAROUND: Oriserve's fine-tune doesn't ship a calibrated
  # alignment_heads set, and the converter doesn't recognize this model
  # name, so it falls back to "every head in the last half of the layers"
  # (~320 heads) instead of a real calibrated set. That fallback causes
  # word-level DTW timestamps to catastrophically collapse — an entire
  # 40s+ segment's worth of words all landing on the exact same instant —
  # confirmed empirically on real footage, not a theoretical concern.
  # Prime is fine-tuned from openai/whisper-large-v3 (same architecture),
  # so large-v3's own real calibrated heads are the correct fix.
  python3 - "$MODEL_DIR/config.json" <<'PYEOF'
import json, sys
path = sys.argv[1]
cfg = json.load(open(path))
cfg["alignment_heads"] = [[7, 0], [10, 17], [12, 18], [13, 12], [16, 1], [17, 14], [19, 11], [21, 4], [24, 1], [25, 6]]
json.dump(cfg, open(path, "w"), indent=2)
print(f"    patched alignment_heads in {path} (openai/whisper-large-v3 calibration)")
PYEOF
fi
echo "    model: $MODEL_DIR"

echo "==> setup OK"
