#!/usr/bin/env python3
"""Cross-verify the local model's captions against YouTube's own auto-captions.

The model (Whisper-Hindi2Hinglish-Prime) is right ~90% of the time; this pass
catches the other 10% BEFORE a clip ships. For each clip it:

  1. Pulls YouTube's `hi-orig` auto-caption for the source VOD (an INDEPENDENT
     ASR of the *same audio* — apples-to-apples with our transcription; the `en`
     track is a machine *translation*, useless for word-level matching, so it's
     kept only as a human-readable reference).
  2. Slices it to the clip's [in,out] VOD window using the per-word timestamps
     embedded in the VTT.
  3. Transliterates the Devanagari to Latin and fuzzy-compares it against the
     model's romanized words.json for that clip.
  4. Flags low-agreement clips for human review and dumps both texts side by
     side so the divergent words are obvious.

It does NOT auto-edit captions — it produces a review report. Re-captioning a
flagged clip is cheap now (GPU badge re-render), so fix the flagged few by hand.

Usage:
  caption_crosscheck.py --batch production-batch.tsv --words-dir raw/ \
     --cache /mnt/f/recordings/elden-ring/tmp/yt-subs --out crosscheck.md \
     [--flag 55] [--only 03,a04]
"""
import argparse
import json
import re
import subprocess
import sys
import unicodedata
from pathlib import Path

from indic_transliteration import sanscript
from rapidfuzz import fuzz

WORD_TAG = re.compile(r"<(\d\d):(\d\d):(\d\d)\.(\d\d\d)><c>([^<]*)</c>")
CUE_TS = re.compile(r"(\d\d):(\d\d):(\d\d)\.(\d\d\d)\s+-->")


def hms(t):
    p = [float(x) for x in t.split(":")]
    return p[0] * 3600 + p[1] * 60 + p[2] if len(p) == 3 else p[0] * 60 + p[1]


def deva_to_ascii(s):
    """Devanagari -> Latin (IAST), diacritics stripped to ASCII. Latin/English
    already in the string passes through unchanged."""
    out = sanscript.transliterate(s, sanscript.DEVANAGARI, sanscript.IAST)
    out = unicodedata.normalize("NFKD", out)
    return "".join(c for c in out if not unicodedata.combining(c))


def norm_tokens(s):
    s = deva_to_ascii(s).lower()
    return re.findall(r"[a-z0-9]+", s)


def parse_vtt_words(path):
    """Extract (t_seconds, word) from a YouTube auto-caption VTT using its inline
    per-word <timestamp><c>word</c> tags, plus the first word (at cue start)."""
    words = []
    text = Path(path).read_text(encoding="utf-8", errors="ignore")
    for block in re.split(r"\n\n+", text):
        m = CUE_TS.search(block)
        if not m:
            continue
        cue_t = int(m.group(1)) * 3600 + int(m.group(2)) * 60 + int(m.group(3)) + int(m.group(4)) / 1000
        payload = block.split("\n", 2)[-1] if "\n" in block else ""
        # first token(s) before the first inline tag are spoken at cue start
        head = re.split(r"<\d\d:\d\d:\d\d\.\d\d\d>", payload)[0]
        head = re.sub(r"</?c>", "", head).strip()
        if head:
            for w in head.split():
                words.append((cue_t, w))
        for hh, mm, ss, ms, w in WORD_TAG.findall(payload):
            t = int(hh) * 3600 + int(mm) * 60 + int(ss) + int(ms) / 1000
            w = w.strip()
            if w:
                words.append((t, w))
    # drop exact consecutive duplicates (rolling-caption repeats)
    dedup = []
    for t, w in words:
        if dedup and dedup[-1][1] == w and abs(dedup[-1][0] - t) < 0.05:
            continue
        dedup.append((t, w))
    return dedup


def fetch_subs(video_id, cache):
    cache = Path(cache)
    cache.mkdir(parents=True, exist_ok=True)
    got = {}
    for lang in ("hi-orig", "en"):
        # yt-dlp names the file <id>.<lang>.vtt
        matches = list(cache.glob(f"{video_id}.{lang}*.vtt"))
        if not matches:
            subprocess.run(
                ["yt-dlp", "--skip-download", "--write-auto-subs",
                 "--sub-langs", lang, "--sub-format", "vtt",
                 "-o", str(cache / "%(id)s.%(ext)s"),
                 f"https://www.youtube.com/watch?v={video_id}"],
                capture_output=True, text=True)
            matches = list(cache.glob(f"{video_id}.{lang}*.vtt"))
        if matches:
            got[lang] = matches[0]
    return got


def slice_text(words, t0, t1):
    return " ".join(w for t, w in words if t0 - 0.5 <= t <= t1 + 0.5)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--batch", required=True)
    ap.add_argument("--words-dir", required=True)
    ap.add_argument("--cache", required=True)
    ap.add_argument("--out", required=True)
    ap.add_argument("--flag", type=float, default=55.0)
    ap.add_argument("--only", default="")
    args = ap.parse_args()

    only = set(x.strip() for x in args.only.split(",") if x.strip())
    rows = [l.split("\t") for l in Path(args.batch).read_text().splitlines()[1:] if l.strip()]
    words_dir = Path(args.words_dir)
    subs_cache = {}
    report = []

    for idx, vid, tin, tout, cat, slug in rows:
        if only and idx not in only:
            continue
        wj = words_dir / f"{idx}_{slug}.mp4.words.json"
        if not wj.exists():
            report.append((idx, slug, None, "(no model words.json)", "", "")); continue
        model_text = " ".join(w["word"] for w in json.loads(wj.read_text()))
        model_norm = " ".join(norm_tokens(model_text))

        if vid not in subs_cache:
            subs_cache[vid] = fetch_subs(vid, args.cache)
        subs = subs_cache[vid]
        t0, t1 = hms(tin), hms(tout)
        yt_hi = slice_text(parse_vtt_words(subs["hi-orig"]), t0, t1) if "hi-orig" in subs else ""
        yt_en = slice_text(parse_vtt_words(subs["en"]), t0, t1) if "en" in subs else ""
        yt_hi_norm = " ".join(norm_tokens(yt_hi))

        score = fuzz.token_set_ratio(model_norm, yt_hi_norm) if yt_hi_norm else 0.0
        report.append((idx, slug, score, model_text.strip(),
                       deva_to_ascii(yt_hi).strip(), yt_en.strip()))
        print(f"[{idx}] {slug}: agreement={score:.0f}", flush=True)

    report.sort(key=lambda r: (r[2] is not None, r[2] if r[2] is not None else 0))
    flagged = [r for r in report if r[2] is not None and r[2] < args.flag]

    lines = ["# Caption cross-check (model vs YouTube hi-orig ASR)", "",
             f"Flag threshold: agreement < {args.flag:.0f}. "
             f"{len(flagged)}/{len([r for r in report if r[2] is not None])} clips flagged for review.", ""]
    for idx, slug, score, mt, hi, en in report:
        tag = "🔴 REVIEW" if (score is not None and score < args.flag) else ("🟢" if score is not None else "⚪ skip")
        lines += [f"## {tag}  [{idx}] {slug}  —  agreement {score if score is None else round(score)}",
                  f"- **model:** {mt}", f"- **yt hi-orig (romanized):** {hi}",
                  f"- **yt en (translation, ref):** {en}", ""]
    Path(args.out).write_text("\n".join(lines))
    print(f"\nReport -> {args.out}  |  {len(flagged)} flagged for review", flush=True)
    for idx, slug, score, *_ in flagged:
        print(f"  🔴 [{idx}] {slug}  ({round(score)})", flush=True)


if __name__ == "__main__":
    main()
