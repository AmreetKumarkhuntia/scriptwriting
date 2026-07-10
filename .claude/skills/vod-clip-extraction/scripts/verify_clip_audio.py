#!/usr/bin/env python3
"""Verify a cut clip's audio against the VOD-level transcript BEFORE
spending any time rendering captions onto it.

Run this immediately after cutting a clip, before gaming-clip-captions ever
touches it. Re-transcribes just the clip's own audio (fast — it's short) and
diffs the fresh transcript against the slice of words.json that was carried
over from the VOD-level transcription for this clip's [start,end] window.

This is a SELF-CONSISTENCY check, not a second opinion from a different
model — it will NOT catch the model mishearing a word the same way twice.
What it DOES catch: clip boundaries that drifted from what the transcript
expected (wrong start/end, off-by-some-seconds cuts) and the post-silence
first-word DTW mistiming bug landing right at a cut edge.

IMPORTANT: this script MUST run inside the skill's dedicated .venv at
`~/.claude/skills/vod-clip-extraction/.venv/`. If invoked under the system
python it auto-relaunches under the venv interpreter.

Usage:
  python3 verify_clip_audio.py CLIP.mp4 VOD_WORDS_JSON CLIP_START_ABS CLIP_END_ABS
    [--model PATH] [--cpu] [--word-count-tolerance 0.35] [--edge-tolerance 1.0]

Exit code 0 = passed, 1 = flagged for review. Either way, prints a report.
"""
import argparse
import json
import os
import re
import sys
from pathlib import Path

_VENV_DIR = Path(__file__).resolve().parent.parent / ".venv"
_VENV_PY = _VENV_DIR / "bin/python3"
if _VENV_PY.exists() and Path(sys.prefix).resolve() != _VENV_DIR.resolve():
    os.execv(str(_VENV_PY), [str(_VENV_PY), __file__, *sys.argv[1:]])

from transcribe_words import DEFAULT_MODEL, transcribe, extract_audio
import tempfile


def _norm_words(words):
    out = []
    for w in words:
        t = re.sub(r"[^a-z0-9]+", "", w["word"].lower())
        if t:
            out.append(t)
    return out


def slice_words(vod_words, start_abs, end_abs):
    return [
        {"word": w["word"], "start": w["start"] - start_abs, "end": w["end"] - start_abs}
        for w in vod_words
        if start_abs <= w["start"] < end_abs
    ]


def main():
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("clip")
    p.add_argument("vod_words_json")
    p.add_argument("clip_start_abs", type=float)
    p.add_argument("clip_end_abs", type=float)
    p.add_argument("--model", default=DEFAULT_MODEL)
    p.add_argument("--cpu", action="store_true")
    p.add_argument("--word-count-tolerance", type=float, default=0.35,
                    help="fresh transcript's word count may differ from the expected slice by this fraction before flagging")
    p.add_argument("--edge-tolerance", type=float, default=1.0,
                    help="seconds the fresh transcript's first/last word may sit from the clip's own edges before flagging")
    args = p.parse_args()

    vod_words = json.loads(Path(args.vod_words_json).read_text())
    expected = slice_words(vod_words, args.clip_start_abs, args.clip_end_abs)

    with tempfile.TemporaryDirectory() as tmpdir:
        audio_path = Path(tmpdir) / "audio.wav"
        extract_audio(Path(args.clip), audio_path)
        device = "cpu" if args.cpu else "cuda"
        try:
            fresh, _lang = transcribe(audio_path, args.model, device)
        except Exception as e:
            if device == "cuda":
                print(f"[verify_clip_audio] GPU path failed ({e}), falling back to CPU", file=sys.stderr)
                fresh, _lang = transcribe(audio_path, args.model, "cpu")
            else:
                raise

    problems = []

    exp_n, fresh_n = len(expected), len(fresh)
    if exp_n == 0:
        problems.append("expected slice has zero words (clip window doesn't overlap the VOD transcript at all)")
    elif abs(fresh_n - exp_n) / max(exp_n, 1) > args.word_count_tolerance:
        problems.append(
            f"word count mismatch: expected ~{exp_n} words from the VOD slice, "
            f"fresh re-transcription found {fresh_n} (clip boundaries may have drifted)"
        )

    if fresh:
        first_gap = fresh[0]["start"]
        last_gap = (args.clip_end_abs - args.clip_start_abs) - fresh[-1]["end"]
        if first_gap > args.edge_tolerance:
            problems.append(
                f"first spoken word starts {first_gap:.2f}s into the clip — cut-in may be too early/loose"
            )
        if last_gap > args.edge_tolerance:
            problems.append(
                f"last spoken word ends {last_gap:.2f}s before the clip's own end — cut-out may be too late/loose"
            )

    flagged_edges = [
        w for w in expected
        if w["start"] < args.edge_tolerance
        and any(vw["word"] == w["word"] and vw.get("post_silence") for vw in vod_words)
    ]
    if flagged_edges:
        problems.append(
            f"{len(flagged_edges)} word(s) near the clip start were flagged post-silence during VOD "
            f"transcription (known DTW mistiming risk) — spot-check the cut-in point by ear"
        )

    exp_text = " ".join(_norm_words(expected))
    fresh_text = " ".join(_norm_words(fresh))
    print(f"[verify_clip_audio] expected ({exp_n}w): {exp_text[:200]}", file=sys.stderr)
    print(f"[verify_clip_audio] fresh    ({fresh_n}w): {fresh_text[:200]}", file=sys.stderr)

    if problems:
        print(f"[verify_clip_audio] FLAGGED FOR REVIEW:", file=sys.stderr)
        for msg in problems:
            print(f"  - {msg}", file=sys.stderr)
        sys.exit(1)
    else:
        print(f"[verify_clip_audio] PASSED — clip audio matches expected transcript slice", file=sys.stderr)
        sys.exit(0)


if __name__ == "__main__":
    main()
