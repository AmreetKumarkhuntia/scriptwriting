# 007 First Light — Day 4 · EDIT HANDOFF

Read this first, then `day4-cut-list.md` for full beat detail/quotes.

## What's already done (input is READY)

19 clean-boundary clips are cut, re-encoded, and verified. Each clip is a
**complete scene** (cutscenes kept whole; grind/navigation/death-retries already
removed between beats). Hindi commentary audio is baked in. **No motion graphics
were added** — that's intentional and is the editor's call from here.

- **Spec:** h264, **2560×1440 @ 60fps**, yuv420p, AAC 48k stereo. (Native — NOT
  downsampled to 30fps, since there was no Remotion stage.)
- **Total runtime:** ≈ 68 min across 19 clips, ≈ 4.9 GB.

## Locations

| What | WSL path | Windows path (Blender) |
|------|----------|------------------------|
| **Cut clips (edit these)** | `/mnt/f/recordings/007/part 4/` | `F:\recordings\007\part 4\` |
| Full VOD archive (re-cut source) | `/mnt/f/recordings/007/007_day4_full.mp4` (5.7 GB) | `F:\recordings\007\007_day4_full.mp4` |
| Cut list + verbatim quotes | `videos/007 First Light/highlights/day4-cut-list.md` | same via `\\wsl.localhost\Ubuntu\…` |
| Source VOD online | <https://www.youtube.com/live/Q1rz778nbfY> | — |

> Editing runs from **Windows Claude** in Blender VSE (the `blender` MCP), per
> `docs/blender-video-editing.md`. Pass Blender **`F:\…`** paths, not `/mnt/f`.

## The 19 clips (running order = filename order)

| # | file | type | what it is |
|---|------|------|------------|
| 01 | `01_shipwreck_lore` | story | Roth/shipwreck lore — 009 mole hunt, the twins |
| 02 | `02_safehouse_evidence` | story | booby-trap safehouse → **"009 was the target"** twist |
| 03 | `03_firefight_start` | action | "We got company. A lot of it" |
| 04 | `04_landrover_backup` | action | Land Rover down → "I have a backup plan" |
| 05 | `05_heavy_driver_kill` | action | mini-boss down → "Greenway, legend" |
| 06 | `06_aftermath_gohome` | story | case closed → "we just put three agents in the ground" |
| 07 | `07_apartment_hit` | story | poison umbrella, Monroe's note, assassin arrives |
| 08 | `08_rooftop_chase` | action | **"Faster, James!"** → grabs the phone → museum hook |
| 09 | `09_gala_infiltration` | funny | journalist "Mike Chatzfield" press-pass gambit |
| 10 | `10_cctv_simon` | funny | "Simon says… feet or head first" |
| 11 | `11_cctv_hack` | funny | post-it password gag → "Basement archives" |
| 12 | `12_archives_kill` | action | **"That was for Monroe"** |
| 13 | `13_web_meet` | story | meet Web/Damian/Isela → the drugged drink |
| 14 | `14_damian_banter` | story | **CENTERPIECE** villain banter → "Make them disappear" |
| 15 | `15_window_escape` | story/funny | "Waiting for you, Jinx" → reveal: it's the *son* |
| 16 | `16_backlot_gunfight` | action | "bring your gun to work day" |
| 17 | `17_artifact_ai_exhibit` | funny | the AI artifact-recreation gag |
| 18 | `18_car_getaway` | action/funny | steal the car ("Hello, Gila") → reunion |
| 19 | `19_perch_finale` | funny/story | **"I don't feel so good"** poison gag → cliffhanger |

## Editor notes / known things

- **Two clips open on the game's own fade-from-black** (cinematic, not errors):
  `18_car_getaway` (dim museum-exit shot, dialogue over it) and `19_perch_finale`
  (~5 s fade into Greenway's stash). Leave the fades or trim them — editor's call.
- **Long talky clips, kept whole by request** — if a tighter cut is wanted, the
  trim candidates are `02_safehouse_evidence` (~7:44), `09_gala_infiltration`
  (~6:38), `14_damian_banter` (~8:03).
- **Best moments to feature first** (cold-open candidates): `08_rooftop_chase`
  ("Faster, James!"), `14_damian_banter`, `19_perch_finale` poison gag.

## To re-cut any clip (boundaries are in day4-cut-list.md)

```bash
SRC="/mnt/f/recordings/007/007_day4_full.mp4"
OUT="/mnt/f/recordings/007/part 4"
ffmpeg -y -ss <IN> -t <DURATION_SEC> -i "$SRC" \
  -c:v libx264 -crf 18 -preset veryfast -pix_fmt yuv420p \
  -c:a aac -ar 48000 -ac 2 "$OUT/<name>.mp4"
```

## Suggested edit flow (Blender VSE — see docs/blender-video-editing.md)

1. Scene: 2560×1440, **60fps** (clips are 60 — match it), `use_sequencer=True`.
2. Import clips 01→19 in order via `new_movie` + `new_sound`, butting each next
   strip against the previous (`frame_start + frame_final_duration`).
3. Add zoom punch-ins on reaction/quote moments; drop memes on higher channels
   over the funny beats if desired.
4. Render h264 to `F:\recordings\007\007_day4_edit.mp4` (lands at
   `/mnt/f/recordings/007/007_day4_edit.mp4`).
