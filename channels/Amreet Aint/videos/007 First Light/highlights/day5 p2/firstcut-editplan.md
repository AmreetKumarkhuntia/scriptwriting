# 007 Day 5 · Part 2 — First-Cut Edit Plan (DaVinci Resolve) — "The Final Mission"

Companion to the generated FCPXML. It's a **first cut**: clips butted end-to-end in story order, razor-cut at each beat, with a pre-applied **zoom-to-face** reframe on the marquee lines and a labelled marker at every beat. You polish from here. (Part 1 is in `../day5 p1/`.)

- Part 2 (v2, full coverage): `F:\recordings\007\day5 p2\007_day5_p2_firstcut.fcpxml` — **≈ 73 min, 35 clips, 12 zoom segments**

## Open in DaVinci Resolve (free)
1. New project → **File ▸ Import ▸ Timeline…** → pick the `.fcpxml`.
2. If media shows offline, relink the timeline to the clips folder (`F:\recordings\007\day5 p2\`). The FCPXML already points there via `file:///F:/...` URLs.
3. Timeline is **2560×1440 @ 60 fps**. Every beat has a labelled marker (jump with ↑/↓).

## Zoom-to-face (the pre-applied move)
The facecam is **baked into the bottom-right** of the game frame, so "zoom to my face" = a reframe punch toward that corner. Each `zoom` segment is split out and given an `adjust-transform` of **scale 1.5, position −450 −260** (a static punch-in). To make it feel intentional:
- Select the zoom segment → Inspector ▸ Transform.
- Keyframe **Zoom 1.0 → 1.5 over ~8–10 frames** at the segment start (and ease back to 1.0 at the end if you want a pop-out).
- Cap around **1.6×** so the facecam stays sharp; nudge Position if the face drifts.
- Copy the tuned Transform and paste to the other zoom segments for consistency.

The clip-local times are transcript-derived (±a couple seconds) — scrub each marker and slide the zoom to land exactly on the line.

## Part 2 — beats
**ZOOM (reframe pre-applied):**
| clip | local | line |
|---|---|---|
| 01_coldopen_newlook | 2–16 | "how do you like the new look?" |
| 05_pearl_twist | 75–89 | "it's not Damian — wrong SUVs" |
| 06_villa_ellis | 46–60 | "I could sure as hell try" |
| 09_greenway_death | 27–41 | "Damn, bro. Greenway." |
| 10_damian_boss | 10–24 | "Come on, Damian. Do your worst." |
| 12_mi6_interlude | 193–200 | "THEIA is a complete scam — a lie for a decade" |
| 18_isa_encounter | 50–64 | "even Damian was never invited down here" |
| 22_webb_core_crisis | 72–86 | "never let a good crisis go to waste" |
| 28_son_reveal | 8–22 | "how do you like the new look?" |
| 28_son_reveal | 60–74 | "all thanks to you — how does it feel, James?" |
| 31_valhalla_chase | 163–177 | "what a crazy car is this!" (Bond's grin) |
| 33_sewer_boss | 8–22 | the golden-mask boss — shoot the explosive tubes |
| 34_finale_takedown | 2–16 | the final takedown |
| 35_ending_returns | 98–112 | "...007" |

**tune (ZOOM→FACE on a quieter line — pre-split, reframe yourself if you want it):** 02@38 (Chapter eight); 03@100 (who Web is here to kill); 04@43 (Caliban's MO); 07@60 (Hyperion will see to that); 08@22 (targets down); 11@25 (he's gone); 12@78 (Greenway taught you that); 13@50 (magic key); 14@66 (the plane); 15@5 (Antarctica); 16@54 (Aria); 19@135 (sound the alarm); 21@20 (stop the centrifuge); 22@15 (I don't have to kill you); 23@27 (Isa stayed with the core); 26@29 (there are hostages here); 29@27 (we have the Valhalla); 30@96 (override 75%); 32@9 (fish tank); 35@163 ("James Bond will return").
**MEME:** 03@85 ($1,000 bourbon); 16@18 (meet Wrecky — demolish those).

## Regenerate (after editing the manifest)
```bash
cd "/home/amreet_khuntia/repos/scriptwriting"
python3 scripts/firstcut_fcpxml.py \
  "channels/Amreet Aint/videos/007 First Light/highlights/day5 p2/firstcut.beats.json" \
  "/mnt/f/recordings/007/day5 p2/007_day5_p2_firstcut.fcpxml"
```
The generator prints clip count, total runtime, zoom-segment and marker counts — use the runtime as the authoritative length check (this v2 cut is ≈73 min; trim action peaks in DaVinci to taste).

## Render target
- Part 2 → `F:\recordings\007\007_day5_p2_edit.mp4`
