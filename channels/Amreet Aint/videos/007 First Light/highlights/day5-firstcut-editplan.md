# 007 Day 5 — First-Cut Edit Plan (DaVinci Resolve)

Companion to the two generated FCPXMLs. Each is a **first cut**: clips butted end-to-end in story order, razor-cut at each beat, with a pre-applied **zoom-to-face** reframe on the marquee lines and a labelled marker at every beat. You polish from here.

- Part 1: `F:\recordings\007\day5 p1\007_day5_p1_firstcut.fcpxml` — ~32.4 min, 14 clips, 6 zoom segments
- Part 2: `F:\recordings\007\day5 p2\007_day5_p2_firstcut.fcpxml` — ~31.5 min, 14 clips, 6 zoom segments

## Open in DaVinci Resolve (free)
1. New project → **File ▸ Import ▸ Timeline…** → pick the `.fcpxml`.
2. If media shows offline, relink the timeline to the clips folder (`F:\recordings\007\day5 p1\` or `day5 p2\`). The FCPXML already points there via `file:///F:/...` URLs.
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

## Part 2 — beats
**ZOOM (reframe pre-applied):**
| clip | local | line |
|---|---|---|
| 01_coldopen_newlook | 2–16 | "how do you like the new look?" |
| 04_villa_ellis | 46–60 | "I could sure as hell try" |
| 09_crisis_quote | 64–80 | "never let a good crisis go to waste" |
| 11_son_reveal | 8–22 | "how do you like the new look?" |
| 11_son_reveal | 60–74 | "all thanks to you — how does it feel, James?" |
| 14_ending_returns | 98–112 | "...007" |

**tune:** 02_vietnam_arrival @38 (Chapter eight); 03_pearl_ledger @100 (who Web is here to kill); 05_hyperion_core @50 (magic key); 06_isa_backstory @66 (the plane); 07_aria_factory @54 (Aria); 12_flood_warning @9 (fish tank); 14_ending_returns @163 ("James Bond will return").
**MEME:** 03_pearl_ledger @85 ($1,000 bourbon).

## Regenerate (after editing a manifest)
```bash
cd "/home/amreet_khuntia/repos/scriptwriting"
python3 scripts/firstcut_fcpxml.py "videos/007 First Light/highlights/day5-firstcut-p1.beats.json" "/mnt/f/recordings/007/day5 p1/007_day5_p1_firstcut.fcpxml"
python3 scripts/firstcut_fcpxml.py "videos/007 First Light/highlights/day5-firstcut-p2.beats.json" "/mnt/f/recordings/007/day5 p2/007_day5_p2_firstcut.fcpxml"
```
The generator prints clip count, total runtime, zoom-segment and marker counts — use the runtime as the authoritative length check (target 30–45 min each).

## Render targets
- Part 1 → `F:\recordings\007\007_day5_p1_edit.mp4`
- Part 2 → `F:\recordings\007\007_day5_p2_edit.mp4`
