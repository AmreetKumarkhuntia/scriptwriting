---
name: gaming-clip-captions
description: Finish a cut gameplay short — burn in dynamic word-synced captions (with emoji on reaction beats) plus a "CHECK FULL VIDEO AND SUBSCRIBE" end-card. Includes a dense fixed-rate (2-3fps) frame-burst tool for pinpointing exact moments (caption sync, cut boundaries, reaction frames) — finer-grained than vod-clip-extraction's whole-candidate contact sheets. Built for Amreet Aint's facecam-on-top / gameplay-below vertical layout. Use after a clip has been cut (from vod-clip-extraction or a direct yt-dlp --download-sections pull) and is ready to post to Shorts/Reels.
metadata:
  tags: captions, emoji, ffmpeg, pillow, shorts, reels, amreet-aint, gaming, frame-extraction
---

## When to use

You already have a cut, trimmed gameplay clip (see [vod-clip-extraction] and
`channels/Amreet Aint/videos/<game>/cut-list.md` for picking + cutting the
moment) and want to finish it for posting: captions that pop in synced to
the actual dialogue, emoji on the punchlines, and a subscribe end-card. This
is the "editing" pass, not the "which moment to clip" pass.

Designed around Amreet Aint's recording layout: facecam band on top,
gameplay footage below, both baked into one 1080x1920 vertical frame — no
separate reframe/crop needed for that layout, captions just get positioned
at the seam between the two.

## Workflow

### 1. Get word-level caption timing

Word timing comes from a **local ASR model**, not YouTube's own auto-caption
VTT (too imprecise to drive an actual cut or caption — that's what it's
good for at the research/discovery stage in [youtube-transcript-analysis],
not here). [vod-clip-extraction]'s `transcribe_words.py` transcribes the
whole VOD once with `Oriserve/Whisper-Hindi2Hinglish-Prime` (faster-whisper,
GPU-accelerated, converted model lives on `/mnt/e/models/`) and writes
`words.json` at VOD-absolute time, stored alongside the VOD's other
artifacts on `/mnt/f`. Re-tightening a clip's in/out points never needs
re-transcribing — the word timestamps don't move.

### 2. Group words into caption cards

```bash
python3 .claude/skills/gaming-clip-captions/scripts/caption_plan.py \
  path/to/vod.words.json <CLIP_START_ABS> <CLIP_END_ABS> manifest.json
```
Slices `words.json` to the clip's window, re-zeros to clip-relative time,
and groups into ~2-3s caption chunks on pause/word-count/duration
boundaries — writing the flat manifest `caption_overlay.py` expects:

```json
[
  {"text": "Oh what the bleep", "start": 11.3, "end": 12.6, "emoji": null},
  {"text": "BHAI BHAI BHAI BHAI", "start": 12.6, "end": 15.6, "emoji": null},
  {"text": "Bach gaye", "start": 15.6, "end": 16.8, "emoji": null}
]
```

`caption_plan.py` never assigns emoji — that stays an editorial call, not
something to automate:
- **Emoji only on the beats that land** — reaction/punchline words, not
  every card. Rough mapping that's worked so far: swearing/bleep → 💀 or
  🤬, panic/exclamation → 😭 or 😱, pain sounds ("aay aay aay") → 😵,
  a joke/aside → 😂. Don't force one onto a flat narration line. Hand-edit
  the generated manifest to add these before rendering.
- Spot-check the actual card text against what's really being said before
  locking it in — the model can still mishear a word occasionally (see
  Gotchas), and `verify_clip_audio.py` (run right after cutting, see
  [vod-clip-extraction]) is the gate for catching boundary/timing drift
  before you get this far.

### 3. Verify exact moments with a dense frame burst

Whenever you need to pin down an exact second — where a caption word should
really land, the exact "YOU DIED" frame, an exact cut boundary — don't rely
on a single frame grab or a coarse sample. Pull a dense, fixed-rate burst:

```bash
python3 .claude/skills/gaming-clip-captions/scripts/dense_frames.py \
  your_clip.mp4 12 16 review.png --fps 2.5
```
Tiles 2-3 labeled frames per second across the given window into one
contact sheet (splits into `review_1.png`, `review_2.png`, ... past
`--max-per-sheet`, default 30). This is the sibling of
[vod-clip-extraction]'s `candidate_preview.py` — that one scales frame count
to a whole 30-90s candidate window for broad "does this hold up" checks
(~1 frame per 8s); this one is for zooming into a few seconds you already
suspect matter, at real precision. Use it before locking in caption
timestamps, not just after something looks off.

### 4. Find the facecam/gameplay seam

```bash
python3 .claude/skills/gaming-clip-captions/scripts/detect_seam.py your_clip.mp4
```
Prints the y-pixel row. This is stable across clips from the same recording
setup, so you only need to (re)run it if the facecam position changes.

### 5. Burn in the captions

```bash
python3 .claude/skills/gaming-clip-captions/scripts/caption_overlay.py \
  your_clip.mp4 manifest.json <SEAM_Y> your_clip_captioned.mp4
```
Renders every card as its own transparent PNG via Pillow (keeps emoji
compositing simple — ffmpeg's `drawtext` can't render color emoji glyphs)
and composites them with a chained `overlay=...:enable='between(t,start,end)'`
filter graph so each card only shows during its own window.

### 6. Add the subscribe end-card

```bash
python3 .claude/skills/gaming-clip-captions/scripts/subscribe_endcard.py \
  your_clip_captioned.mp4 final.mp4 --handle @AmreetAint
```
Freezes + darkens the last frame, burns in "CHECK FULL VIDEO / AND
SUBSCRIBE" + the handle (override with `--line1`/`--line2`/`--handle`, hold
duration with `--hold`), and concats it onto the clip.

> **Static banners / context tags are NOT done here.** A burned-in overlay bar
> or "what's going on" label is added later in the **Remotion** motion-graphics
> project (or directly at upload time), not by this skill — burning it in with
> ffmpeg made placement guesswork that kept colliding with the facecam/HUD/
> platform-chrome. This skill's job ends at word-synced captions + end-card;
> the clip it outputs is the input to that later banner/motion pass.

## Gotchas

- Every text/emoji render in this pipeline goes through Pillow, then gets
  composited as an image via ffmpeg's `overlay` filter — kept this way even
  though this box's ffmpeg does have `drawtext`/libfreetype, since drawtext
  can't render color emoji glyphs and Pillow keeps font metrics/outline
  style consistent across every card.
- **Noto Color Emoji only renders at one fixed bitmap-strike size: 109px.**
  Any other size throws `invalid pixel size`. Render at 109 and let Pillow's
  `.resize()` scale it down to whatever you actually need.
- **Jump-cut offset math** — if a clip is spliced from multiple
  non-contiguous source segments, `caption_plan.py` needs to be run
  per-segment with that segment's own `[start,end]` window, then each
  segment's card timestamps need the **cumulative offset** of the segments
  before it added once (segment 2's offset = segment 1's duration, etc.) —
  a doubled offset is the most likely bug and will silently push cards past
  the clip's actual end. Sanity-check by spot-reading a frame right at each
  card's start time before trusting the whole render.
- Devanagari text will not render in Impact (Latin-only font) — this
  shouldn't come up since the model outputs Romanized Hinglish natively,
  but if a caption looks like tofu boxes, that's why.
- The known faster-whisper DTW quirk — the first word after a long silence
  can be mistimed by several seconds — is why `caption_plan.py` pads a
  chunk's start time slightly when its first word was flagged
  `post_silence` during transcription, rather than trusting it as-is.

## Reference example

The `bhai-bhai-bhai-panicked-wipe` short (`NxOMr6_jzA4`, cut-list entry
01:29:47→01:31:00, tightened + jump-cut to 47s) is the worked example this
skill was built from — 15 caption cards, 5 with emoji, seam detected at
y≈735 for that recording's layout.
