#!/usr/bin/env python3
"""Beep out profanity in a clip's audio using word-level timestamps.

Reads a clip-relative words.json ([{"word","start","end"}...] where time 0 =
the clip's start), finds profanity words, and replaces those exact audio spans
with a 1kHz beep tone (frame-accurate — we know each word's start/end). Video
is untouched. Also prints the matched spans so the caller can mask the same
words in the caption text.

Wordlist is English + romanized-Hindi gaming profanity (how the ASR model
spells it). Edit PROFANITY below to taste; mild words (saala, kutta) are
deliberately NOT included.

Usage:
  python3 beep_profanity.py CLIP.mp4 CLIP_WORDS.json OUT.mp4 [--pad 0.06]

Exit prints the beeped spans as JSON on stdout: [[start,end,word], ...].
"""
import argparse
import json
import re
import subprocess
import sys
from pathlib import Path

# Matched as whole-word, case-insensitive, on a punctuation-stripped token.
# Stems cover inflections (fuck -> fucking/fucker/fucked; chutiya -> chutiye).
PROFANITY = [
    # English
    r"fuck\w*", r"motherfuck\w*", r"shit\w*", r"bitch\w*", r"bastard", r"asshole",
    r"dick", r"cunt", r"pussy", r"nigga\w*",
    # Hindi / Hinglish (romanized, as Whisper-Hindi2Hinglish outputs)
    r"bhosdi\w*", r"bsdk", r"madarchod\w*", r"madarch\w*", r"bhenchod\w*", r"behenchod\w*",
    r"bhen\w*chod", r"chutiy\w*", r"chutia\w*", r"gaand", r"gand", r"rand[iae]",
    r"lund", r"la[uw]da", r"lawde", r"harami", r"haramzad\w*", r"jhaant", r"chod",
    r"chodu", r"bkl", r"mc", r"bc",
]
_RX = re.compile(r"^(?:" + "|".join(PROFANITY) + r")$", re.I)


def is_profane(word):
    tok = re.sub(r"[^a-z0-9]", "", word.lower())
    return bool(tok) and bool(_RX.match(tok))


def main():
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("clip")
    p.add_argument("words_json")
    p.add_argument("out")
    p.add_argument("--pad", type=float, default=0.06, help="seconds of extra beep each side of the word")
    p.add_argument("--freq", type=int, default=1000)
    p.add_argument("--gain", type=float, default=0.25, help="beep volume (0-1)")
    args = p.parse_args()

    words = json.loads(Path(args.words_json).read_text())
    spans = [(max(0.0, w["start"] - args.pad), w["end"] + args.pad, w["word"])
             for w in words if is_profane(w["word"])]

    if not spans:
        # nothing to beep — copy through unchanged
        subprocess.run(["ffmpeg", "-y", "-i", args.clip, "-c", "copy", args.out],
                       check=True, capture_output=True)
        print("[]")
        print(f"[beep] no profanity found -> passthrough {args.out}", file=sys.stderr)
        return

    expr = "+".join(f"between(t,{s:.3f},{e:.3f})" for s, e, _ in spans)
    dur = float(subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", args.clip],
        capture_output=True, text=True).stdout.strip())

    fc = (
        f"[0:a]volume=0:enable='{expr}'[voice];"
        f"[1:a]volume={args.gain},volume=0:enable='not({expr})'[beep];"
        f"[voice][beep]amix=inputs=2:normalize=0:duration=first[a]"
    )
    cmd = ["ffmpeg", "-y", "-i", args.clip,
           "-f", "lavfi", "-t", f"{dur:.3f}", "-i", f"sine=frequency={args.freq}:sample_rate=48000",
           "-filter_complex", fc, "-map", "0:v", "-map", "[a]",
           "-c:v", "copy", "-c:a", "aac", "-ar", "48000", "-ac", "2", args.out]
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode != 0:
        print(r.stderr[-2000:], file=sys.stderr)
        raise SystemExit(f"ffmpeg beep failed (exit {r.returncode})")

    print(json.dumps([[round(s, 3), round(e, 3), w] for s, e, w in spans]))
    print(f"[beep] beeped {len(spans)} span(s) -> {args.out}", file=sys.stderr)


if __name__ == "__main__":
    main()
