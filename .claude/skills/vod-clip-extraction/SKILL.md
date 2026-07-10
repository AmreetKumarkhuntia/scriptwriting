---
name: vod-clip-extraction
description: Download a YouTube gameplay/stream VOD (or just the needed time ranges) and cut clean-boundary clips for a highlight reel — store on /mnt/f, verify cut points with a contact sheet. Use after youtube-transcript-analysis when turning a long VOD into editable clips.
metadata:
  tags: yt-dlp, ffmpeg, clips, highlight-reel, 2k, davinci
---

## When to use

After picking the beats for a highlight reel (see [youtube-transcript-analysis]),
to pull the source video and cut it into clips. Pairs with
[remotion-highlight-reel], which assembles the clips. The guiding principle for
*where* to cut is in memory — `feedback-highlight-clip-boundaries`.

## Core principle: cut on COMPLETE scene boundaries

The game's own cutscene dialogue is the narration. Cut each clip as a complete
unit — **start at the first line of the scene, end AFTER the final thought /
payoff line.** Caption-anchor timestamps cut mid-sentence and make the reel feel
like disconnected fragments. **Merge** consecutive beats whose gap is ≤ ~1:30
into one continuous clip (truly end-to-end). Verify before committing (step 4).

Finding exact edges depends on the content:
- **Cutscene/narrated content** (e.g. 007) — YouTube's own cue-level transcript
  (`transcript.py window` in the transcript skill) is precise enough; the
  dialogue is scripted and clearly bounded.
- **Streaming/commentary content** (facecam gameplay, Hindi/Hinglish reaction —
  e.g. Elden Ring) — YouTube's auto-captions are too imprecise for real
  commentary. Use `transcribe_words.py` (below) instead: transcribe the whole
  VOD once with a local model, then treat inter-word gaps ≥ ~1.5-2s in the
  resulting `words.json` as candidate cut boundaries.

## 1. Get the source — full VOD vs. just the sections

Check available resolutions first (2K = `1440p`, often VP9 `308` / AV1 `400`):
```bash
yt-dlp -F "https://www.youtube.com/watch?v=<ID>" | grep -E "1440|2160|1080"
```

**Sections only (fast, less disk)** — download just the ranges you need. Without
`--force-keyframes-at-cuts` it stream-copies (fast) and the output is the exact
requested length; pad ~3 s each side for trim headroom:
```bash
yt-dlp -f "400+251/308+251/bestvideo[height<=1440]+bestaudio" \
  --download-sections "*00:16:04-00:19:03" --merge-output-format mp4 --no-part \
  -o "/tmp/raw/02_briefing.%(ext)s" "https://www.youtube.com/watch?v=<ID>"
```
`--force-keyframes-at-cuts` makes it frame-exact but re-encodes (slow on AV1) — avoid; pad + trim in step 3 instead.

**Full VOD (when you'll iterate on boundaries a lot, or want the archive)** — one
download, then cut locally any number of times:
```bash
yt-dlp -f "400+251/308+251/bestvideo[height<=1440]+bestaudio" \
  --merge-output-format mp4 --no-part -o "007_day3_full.mp4" \
  "https://www.youtube.com/watch?v=<ID>"
```
2K VODs are ~6 GB and merge AV1+opus into the mp4 container.

## 2. Store media on /mnt/f, not the repo

Per `feedback-media-on-f-drive`: cut clips to a folder on the external drive and
symlink the Remotion public subfolder to it, so `staticFile()` still resolves
while the bytes stay off-repo:
```bash
ln -s "/mnt/f/recordings/<proj>/clips" remotion-all/public/<proj>clips
# add `remotion-all/public/<proj>clips` (no trailing slash) to .gitignore
```

## 3. Cut + re-encode to a uniform spec

Re-encode every clip to identical codec/fps/dims so Remotion `OffthreadVideo`
plays them predictably (2K source is AV1 60fps → normalize to h264 30fps). Put
`-ss` before `-i` (fast accurate seek in ffmpeg ≥ 5) and `-t` after for duration:
```bash
ffmpeg -y -ss 00:16:07 -i "$SRC" -t 173 \
  -vf "scale=2560:1440:force_original_aspect_ratio=decrease,pad=2560:1440:-1:-1,fps=30" \
  -c:v libx264 -crf 18 -preset veryfast -pix_fmt yuv420p \
  -c:a aac -ar 48000 -ac 2 "$OUT/02_briefing.mp4"
```
- From padded section files (step 1), trim the pad with `-ss <pad> -t <dur>`.
- `veryfast` is fine — the clips get re-encoded again by the final Remotion render.
- Long AV1 clips decode slowly; run the batch with `run_in_background: true`.

## 3b. Streaming/commentary content: local ASR for cut points + captions

For facecam gameplay/reaction content (not scripted cutscene dialogue), run
this once per VOD, before picking any cut points:
```bash
.claude/skills/vod-clip-extraction/scripts/setup.sh   # one-time: venv + model
python3 .claude/skills/vod-clip-extraction/scripts/transcribe_words.py \
  "/mnt/f/recordings/<proj>/vod.mp4"
```
Writes `vod.mp4.words.json` (word-level, VOD-absolute timestamps) next to the
source file. Local model: `Oriserve/Whisper-Hindi2Hinglish-Prime` via
faster-whisper, GPU-accelerated, converted model on `/mnt/e/models/` — picked
for this channel's actual Hindi-accented Hinglish speech, not generic English
benchmarks. One transcription serves both the cut-point decision (inter-word
gaps) and [gaming-clip-captions]'s caption timing — re-tightening a clip never
requires re-transcribing.

**After cutting a clip, before doing anything else with it**, verify its audio
against the expected transcript slice — catches boundary drift and the known
post-silence mistiming bug before any render time is spent:
```bash
python3 .claude/skills/vod-clip-extraction/scripts/verify_clip_audio.py \
  clip.mp4 vod.mp4.words.json <CLIP_START_ABS> <CLIP_END_ABS>
```
Exits nonzero and prints what looks off if the clip's own audio doesn't match
what the VOD-level transcript expected for that window — re-check the cut
before moving on to [gaming-clip-captions].

## 4. Verify cut points before assembling

Caption timing drifts — confirm each cut visually:
```bash
.claude/skills/vod-clip-extraction/scripts/contact_sheet.sh "/mnt/f/recordings/<proj>/clips" /tmp/sheet.png
```
Read the sheet image; it shows a labeled IN + OUT frame per clip. Nudge any
boundary that clips a line or lands on the wrong scene, then re-cut that one clip.

## 5. Durations → frames (for the Remotion manifest)

```bash
for f in "$OUT"/*.mp4; do d=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$f");
  printf "%-22s %5d frames\n" "$(basename "$f")" "$(python3 -c "import math;print(math.floor($d*30)-1)")"; done
```
`floor(seconds*30)-1` so a clip never freezes on its last frame in a Sequence.
Hand these to [remotion-highlight-reel] (`clips.ts`).

## Gotchas
- **zsh** doesn't word-split unquoted vars (`set -- $r` fails) — use `${=r}`; and
  an unmatched glob (`rm foo.*`) aborts the whole command — guard or use unique names.
- yt-dlp's `impersonation … no impersonate target` WARNING is harmless.
- Auto-captions garble proper nouns — verify names against the video if they matter.
- **If you ever re-convert the Hinglish model from scratch, don't skip the
  `alignment_heads` patch in `setup.sh`.** Confirmed on real footage: without
  it, the CTranslate2 converter falls back to using every attention head in
  the last half of the layers (no real calibration), which causes word-level
  DTW timestamps to catastrophically collapse — an entire 40+ second segment
  of real speech all landing on the exact same instant, not just minor drift.
  The fix borrows `openai/whisper-large-v3`'s own calibrated heads (valid
  since Prime is fine-tuned from it, same architecture) — `setup.sh` applies
  this automatically after conversion.
