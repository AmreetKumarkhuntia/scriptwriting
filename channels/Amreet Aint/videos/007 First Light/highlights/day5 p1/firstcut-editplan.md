# 007 Day 5 · Part 1 — First-Cut Edit Plan (DaVinci Resolve) — "The Web HQ Heist"

Companion to the generated FCPXML. It's a **first cut**: clips butted end-to-end in story order, razor-cut at each beat, with a pre-applied **zoom-to-face** reframe on the marquee lines and a labelled marker at every beat. You polish from here. (Part 2 is in `../day5 p2/`.)

- Part 1: `F:\recordings\007\day5 p1\007_day5_p1_firstcut.fcpxml` — ~32.4 min, 14 clips, 6 zoom segments

## Open in DaVinci Resolve (free)
1. New project → **File ▸ Import ▸ Timeline…** → pick the `.fcpxml`.
2. If media shows offline, relink the timeline to the clips folder (`F:\recordings\007\day5 p1\`). The FCPXML already points there via `file:///F:/...` URLs.
3. Timeline is **2560×1440 @ 60 fps**. Every beat has a labelled marker (jump with ↑/↓).

## Zoom-to-face (the pre-applied move)
The facecam is **baked into the bottom-right** of the game frame, so "zoom to my face" = a reframe punch toward that corner. Each `zoom` segment is split out and given an `adjust-transform` of **scale 1.5, position −450 −260** (a static punch-in). To make it feel intentional:
- Select the zoom segment → Inspector ▸ Transform.
- Keyframe **Zoom 1.0 → 1.5 over ~8–10 frames** at the segment start (and ease back to 1.0 at the end if you want a pop-out).
- Cap around **1.6×** so the facecam stays sharp; nudge Position if the face drifts.
- Copy the tuned Transform and paste to the other zoom segments for consistency.

The clip-local times are transcript-derived (±a couple seconds) — scrub each marker and slide the zoom to land exactly on the line.

## Part 1 — beats
**ZOOM (reframe pre-applied):**
| clip | local | line |
|---|---|---|
| 01_coldopen_thea | 14–28 | "1.35 million killed in car accidents — Thea's thesis" |
| 07_damian_escape | 4–16 | "you only have 4 minutes — you'll never make it" |
| 10_the_reveal | 152–168 | "1.35 million killed in car accidents" |
| 10_the_reveal | 182–196 | "Player will attain perfection" |
| 12_greenway_imout | 57–71 | "there is no we, bro — I'm out" |
| 14_vietnam_briefing | 152–164 | "We are in Vietnam — Chapter eight" |

**tune (marker only — add a zoom if it lands):** 02_setup_shutdown @194 (banter); 03_infiltrate_mole @42 (simple mole); 06_basilisk_safe @200 (basilisk); 13_nullspace_debrief @127 (black op).
**MEME:** 09_labcoat_mole @30 (lab-coat / Ken Banks gag).

## Regenerate (after editing the manifest)
```bash
cd "/home/amreet_khuntia/repos/scriptwriting"
python3 scripts/firstcut_fcpxml.py "videos/007 First Light/highlights/day5 p1/firstcut.beats.json" "/mnt/f/recordings/007/day5 p1/007_day5_p1_firstcut.fcpxml"
```
The generator prints clip count, total runtime, zoom-segment and marker counts — use the runtime as the authoritative length check (target 30–45 min).

## Render target
- Part 1 → `F:\recordings\007\007_day5_p1_edit.mp4`
