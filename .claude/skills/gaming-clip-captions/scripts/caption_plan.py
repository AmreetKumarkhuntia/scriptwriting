#!/usr/bin/env python3
"""Build a caption_overlay.py manifest.json from a VOD-level words.json.

Slices the VOD-level word timestamps (from vod-clip-extraction's
transcribe_words.py) down to one clip's [start,end] window, re-zeros them to
clip-relative time, and groups them into ~2-3s caption chunks — replacing
the old "hand-grep YouTube VTT word-cues" step.

Grouping rules (same shape as video-edit's captions_plan.py, tuned for this
channel's shorter/punchier card style):
  - Break on a pause >= BREAK_PAUSE
  - Break when the running chunk reaches MAX_WORDS_PER_LINE
  - Break when the running chunk reaches MAX_DUR_PER_LINE

Guard rail: if a chunk's first word was flagged `post_silence` during VOD
transcription (the known faster-whisper DTW quirk where the first word
after a long silence can be mistimed by several seconds), its start time is
padded forward slightly rather than trusted as-is.

Emoji is NOT auto-assigned — per this skill's own convention (see
caption_overlay.py's docstring), emoji belongs on reaction/punchline beats
by editorial judgment, not every card. Every card is emitted with
"emoji": null; add it by hand on the beats that land.

IMPORTANT: this script has no ASR dependency, just stdlib json/argparse —
no venv relaunch needed.

Usage:
  python3 caption_plan.py VOD_WORDS_JSON CLIP_START_ABS CLIP_END_ABS OUT_MANIFEST_JSON
"""
import argparse
import json
import sys
from pathlib import Path

MAX_WORDS_PER_LINE = 5
MAX_DUR_PER_LINE = 2.6
BREAK_PAUSE = 0.42
SILENCE_PAD = 0.18


def slice_and_zero(vod_words, start_abs, end_abs):
    out = []
    for w in vod_words:
        if start_abs <= w["start"] < end_abs:
            out.append({
                "word": w["word"],
                "start": round(w["start"] - start_abs, 3),
                "end": round(min(w["end"], end_abs) - start_abs, 3),
                "post_silence": w.get("post_silence", False),
            })
    return out


def group_into_cards(words):
    cards = []
    current = []
    for i, w in enumerate(words):
        current.append(w)
        is_last = i == len(words) - 1
        gap_to_next = 0.0 if is_last else max(0.0, words[i + 1]["start"] - w["end"])
        cur_dur = current[-1]["end"] - current[0]["start"]
        too_many = len(current) >= MAX_WORDS_PER_LINE
        too_long = cur_dur >= MAX_DUR_PER_LINE
        long_pause = gap_to_next >= BREAK_PAUSE

        if is_last or too_many or too_long or long_pause:
            start = current[0]["start"]
            if current[0].get("post_silence"):
                # Known DTW quirk: don't trust the very first word after a
                # long gap at face value — pad forward slightly rather than
                # anchoring the card to a potentially-mistimed start.
                start += SILENCE_PAD
            text = " ".join(c["word"] for c in current).strip()
            cards.append({"text": text, "start": round(start, 2), "end": round(current[-1]["end"], 2), "emoji": None})
            current = []
    return cards


def main():
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("vod_words_json")
    p.add_argument("clip_start_abs", type=float)
    p.add_argument("clip_end_abs", type=float)
    p.add_argument("out_manifest_json")
    args = p.parse_args()

    vod_words = json.loads(Path(args.vod_words_json).read_text())
    clip_words = slice_and_zero(vod_words, args.clip_start_abs, args.clip_end_abs)
    if not clip_words:
        raise SystemExit(
            f"no words found in [{args.clip_start_abs}, {args.clip_end_abs}] — "
            f"check the VOD words.json covers this range"
        )

    cards = group_into_cards(clip_words)
    Path(args.out_manifest_json).write_text(json.dumps(cards, indent=2))
    print(f"[caption_plan] wrote {len(cards)} caption cards -> {args.out_manifest_json}", file=sys.stderr)


if __name__ == "__main__":
    main()
