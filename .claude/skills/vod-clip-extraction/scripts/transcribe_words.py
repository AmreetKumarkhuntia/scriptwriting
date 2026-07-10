#!/usr/bin/env python3
"""Transcribe a VOD (or any audio/video file) to word-level timestamps.

Output: <video>.words.json -> [{"word", "start", "end"}, ...] at
VOD-ABSOLUTE time (time 0 = the start of the file you pass in, not a clip
cut from it). Run this ONCE per VOD — both clip-boundary decisions
(inter-word gaps) and caption burn-in (caption_plan.py) read the same file,
sliced to whatever window they need. Re-tightening a clip's in/out points
never requires re-transcribing, since the underlying word timestamps don't
move.

Model: Oriserve/Whisper-Hindi2Hinglish-Prime, converted to CTranslate2 and
stored on the E-drive models store (not the repo, not local disk) —
see /mnt/e/models/whisper-hinglish-prime-ct2. Picked for this channel
specifically: fine-tuned on real noisy Indian-accented audio, outputs
natural Romanized Hinglish, and faster-whisper's own DTW word timestamps
are used directly (no wav2vec2 forced-alignment step — the standard Hindi
aligner is Devanagari-only and would silently mistime the Latin-script
English words inside Hinglish sentences).

IMPORTANT: this script MUST run inside the skill's dedicated .venv at
`~/.claude/skills/vod-clip-extraction/.venv/` (faster-whisper, ctranslate2).
If invoked under the system python it auto-relaunches under the venv
interpreter.

Usage:
  python3 transcribe_words.py VIDEO_OR_AUDIO [OUT_WORDS_JSON] [--model PATH] [--cpu]

  OUT_WORDS_JSON defaults to <video>.words.json next to the input file.
"""
import argparse
import json
import os
import subprocess
import sys
import tempfile
from pathlib import Path

_VENV_DIR = Path(__file__).resolve().parent.parent / ".venv"
_VENV_PY = _VENV_DIR / "bin/python3"
if _VENV_PY.exists() and Path(sys.prefix).resolve() != _VENV_DIR.resolve():
    os.execv(str(_VENV_PY), [str(_VENV_PY), __file__, *sys.argv[1:]])

DEFAULT_MODEL = "/mnt/e/models/whisper-hinglish-prime-ct2"

# Known faster-whisper DTW quirk: the first word after a long silence can be
# mistimed by several seconds. Real risk here — 1-3hr VODs have dead air
# (deaths, loading screens, chat-reading). We don't try to "fix" the
# timestamp (there's no ground truth to fix it against), we just flag it so
# downstream consumers (cut-point picking, caption_plan.py) know not to
# anchor on these words blindly.
SILENCE_GAP_S = 2.0

# Voice-enhancement chain applied BEFORE ASR so the decoder never sees the raw
# mixed track (voice + loud game music/SFX). This is the always-on Tier-1 fix
# for "voice lost under loud game audio" — zero new deps, all filters are in
# this box's ffmpeg. highpass kills boss-roar/orchestral sub-bass; afftdn
# strips steady background; dynaudnorm (per-frame, not static loudnorm) lifts
# voice that ducks under combat; alimiter tames peaks. (Researched + verified.)
ENHANCE_AF = "highpass=f=80, afftdn=nf=-25, dynaudnorm=g=7:m=15:p=0.9, alimiter=limit=0.95"

# Hallucination boilerplate faster-whisper emits on low-SNR / non-speech spans
# (a whole segment of these, not a real word in context). Dropped post-hoc.
import re as _re
_DENYLIST = _re.compile(r"^(to be continued|thanks for watching|please subscribe|amara\.org|nan)([ .]+(to be continued|thanks for watching|please subscribe|nan))*[. ]*$", _re.I)


def extract_audio(src: Path, out_wav: Path) -> None:
    # 1) 48kHz mono, then 2) enhancement chain resampled to 16kHz for ASR.
    raw48 = out_wav.with_name("raw48.wav")
    subprocess.run(
        ["ffmpeg", "-y", "-i", str(src), "-ac", "1", "-ar", "48000", "-vn", str(raw48)],
        check=True, capture_output=True,
    )
    subprocess.run(
        ["ffmpeg", "-y", "-i", str(raw48), "-af", ENHANCE_AF, "-ac", "1", "-ar", "16000", str(out_wav)],
        check=True, capture_output=True,
    )
    raw48.unlink(missing_ok=True)


def transcribe(audio_path: Path, model_path: str, device: str, language="en"):
    from faster_whisper import WhisperModel

    compute_type = "int8_float16" if device == "cuda" else "int8"
    model = WhisperModel(model_path, device=device, compute_type=compute_type)
    # language="en": Oriserve Prime outputs romanized (Latin-script) Hinglish
    # and is fine-tuned under the <|en|> token — that is its native code-mix
    # condition. Leaving it None lets faster-whisper lock the whole file to
    # <|hi|> (detected on the first 30s of Hindi commentary), which SUPPRESSES
    # English code-switch bursts ("hey what the hell is going on"). Forcing en
    # restores the training condition and recovers those spans without harming
    # Hindi (output is romanized either way). condition_on_previous_text=False
    # stops a Hindi-committed window from biasing the next one against a switch.
    # VAD threshold lowered to 0.3 — only safe because ENHANCE_AF already
    # cleaned the signal (on a raw mix a low threshold makes hallucinations).
    lang = None if language in ("auto", "none", "") else language
    segments, info = model.transcribe(
        str(audio_path),
        task="transcribe",
        language=lang,
        word_timestamps=True,
        vad_filter=True,
        vad_parameters=dict(threshold=0.3, min_silence_duration_ms=200, speech_pad_ms=400),
        condition_on_previous_text=False,
        no_repeat_ngram_size=3,
        hallucination_silence_threshold=2.0,
    )

    words = []
    prev_end = 0.0
    for seg in segments:
        seg_txt = seg.text.strip().lower()
        if _DENYLIST.match(seg_txt):
            continue  # drop a whole hallucinated/boilerplate segment
        for w in seg.words:
            words.append({
                "word": w.word.strip(),
                "start": round(w.start, 3),
                "end": round(w.end, 3),
                "post_silence": bool((w.start - prev_end) >= SILENCE_GAP_S),
            })
            prev_end = w.end
    return words, info.language, info.language_probability


def main():
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("video")
    p.add_argument("out_json", nargs="?", default=None)
    p.add_argument("--model", default=DEFAULT_MODEL)
    p.add_argument("--cpu", action="store_true", help="force CPU (fallback if the GPU path has friction)")
    p.add_argument("--lang", default="en",
                   help="decoder language token (default 'en' — Prime's native romanized-Hinglish "
                        "condition; use 'auto' to let faster-whisper detect, or 'hi' to A/B)")
    args = p.parse_args()

    video = Path(args.video)
    out_json = Path(args.out_json) if args.out_json else video.with_suffix(video.suffix + ".words.json")
    device = "cpu" if args.cpu else "cuda"

    with tempfile.TemporaryDirectory() as tmpdir:
        audio_path = Path(tmpdir) / "audio.wav"
        extract_audio(video, audio_path)
        try:
            words, language, lang_prob = transcribe(audio_path, args.model, device, args.lang)
        except Exception as e:
            if device == "cuda":
                print(f"[transcribe_words] GPU path failed ({e}), falling back to CPU", file=sys.stderr)
                words, language, lang_prob = transcribe(audio_path, args.model, "cpu", args.lang)
            else:
                raise

    out_json.write_text(json.dumps(words, indent=2))
    n_flagged = sum(1 for w in words if w["post_silence"])
    print(
        f"[transcribe_words] wrote {len(words)} words (lang={language} p={lang_prob:.2f}, "
        f"forced={args.lang}, {n_flagged} post-silence-flagged) -> {out_json}",
        file=sys.stderr,
    )


if __name__ == "__main__":
    main()
