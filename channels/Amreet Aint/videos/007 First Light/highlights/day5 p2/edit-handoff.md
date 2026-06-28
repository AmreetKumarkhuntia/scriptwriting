# 007 Day 5 · Part 2 — Editor Handoff — "The Final Mission"

**Read this first**, then `cut-list.md` (same folder) for full beat detail/quotes, and `firstcut-editplan.md` for the zoom map.

Day 5 (8h VOD) is cut into **two** sequential highlight videos in story order. This is **Part 2** — Vietnam → finale, **≈ 73 min, 35 clips** (full-coverage v2 cut: every cutscene + fight/boss). Part 1 ("The Web HQ Heist", London) is in `../day5 p1/`.

Delivered as: clean-boundary clips (native 1440p60, Hindi commentary baked in, **no motion graphics**) + a DaVinci-importable FCPXML first cut with pre-placed zoom-to-face moves and labelled markers. Polish (smooth zooms, drop memes, trim action peaks, final fades/music) happens in DaVinci.

## Spec
- Container/codec: MP4 / h264 (libx264 crf 18), **2560×1440 @ 60 fps**, yuv420p
- Audio: AAC 48 kHz stereo (Hindi commentary + game audio, baked)
- Cut philosophy: complete scene/dialogue boundaries; long combat/navigation trimmed to peaks; cold-open teaser at clip `01`.

> **This is a long first cut by design** (≈73 min). The user asked for full coverage — every cutscene and fight. Tighten the action peaks (flagged below) in DaVinci to land the final runtime where you want it.

## Paths (WSL ↔ Windows — same bytes, Windows path for DaVinci)
| What | WSL | Windows |
|---|---|---|
| Full VOD archive | `/mnt/f/recordings/007/007_day5_full.mp4` | `F:\recordings\007\007_day5_full.mp4` |
| Part 2 clips + FCPXML | `/mnt/f/recordings/007/day5 p2/` | `F:\recordings\007\day5 p2\` |
| Part 2 first cut | `…/day5 p2/007_day5_p2_firstcut.fcpxml` | `F:\recordings\007\day5 p2\007_day5_p2_firstcut.fcpxml` |
| Render P2 → | | `F:\recordings\007\007_day5_p2_edit.mp4` |

## Part 2 clips (timeline order)
| # | clip | type | what it is |
|---|------|------|-----------|
| 01 | coldopen_newlook | hook | Cold open: "how do you like the new look?" (dup of #28) |
| 02 | vietnam_arrival | story | Courier cover; "Chapter eight"; the Pearl |
| 03 | pearl_ledger | story/funny | QT glasses; read the ledger; "$1,000 bourbon" |
| 04 | recon_guests | story | "Three profiles fit Caliban's MO"; the mystery woman |
| 05 | pearl_twist | story | "It's not Damian — wrong SUVs" (the assault triggers) |
| 06 | villa_ellis | action/story | Villa assault; "I could sure as hell try"; rescue Ellis |
| 07 | damian_confront | story | "You'll never defeat my father. Hyperion will see to that." |
| 08 | villa_firefight | **action** | Villa/quarry firefight — "two hostiles, targets down" |
| 09 | greenway_death | story | "Damn, bro. Greenway." (Greenway down) |
| 10 | damian_boss | **boss** | Damian boss fight — golden mask, health bar, laser arena |
| 11 | damian_defeated | story | "Damian, it's done. He's gone." |
| 12 | mi6_interlude | story | M briefing; "THEIA is a complete scam" (009 + Greenway framed) |
| 13 | hyperion_core | story | "The core is the magic key" |
| 14 | isa_backstory | story | Yacht flashback; "their plane never made it" |
| 15 | antarctica_arrival | story | "THE BETRAYAL" — the ice approach to Webb's facility |
| 16 | aria_factory | story | Wrecky robot + the Aria android |
| 17 | factory_infiltration | **action** | "We're not supposed to be here" — stealth → firefight |
| 18 | isa_encounter | story | Isa Vale; "even Damian was never invited down here" |
| 19 | hyperion_chamber | story | Reaching Hyperion; "James Bond is here — sound the alarm" |
| 20 | hyperion_firefight | **action** | Gunfight pushing to the core |
| 21 | centrifuge_core | **action** | Stop the centrifuge (OUT before the 06:33 fail screen) |
| 22 | webb_core_crisis | story | Webb at the core; "never let a good crisis go to waste" |
| 23 | webb_dead_betrayal | story | "Web's dead… Isa stayed with the core" (her betrayal) |
| 24 | ice_escape | **action** | A daring escape — the ice-canyon sled/boat run + chopper |
| 25 | mi6_under_attack | **action** | MI6 HQ breached — "they're taking out the cameras" |
| 26 | hostage_fight | **action** | "There are hostages here" firefight (peak nudged) |
| 27 | datacenter_push | **action** | "Clear the room" — the blue data-center push |
| 28 | son_reveal | story | **Climax:** Web's son villain reveal — "the new look" |
| 29 | qlab_valhalla | story | Q: "We have the Valhalla — enough firepower" |
| 30 | last_stand | **action** | The Last Stand — "override in progress 50/75%" |
| 31 | valhalla_chase | **action** | **The Aston Martin Valhalla car chase** → the crash |
| 32 | flood_warning | action/story | "Turn MI6 underground into a fish tank" |
| 33 | sewer_boss | **boss** | **Final boss** — Damian golden-mask sewer fight (OUT before 07:52:30 fail) |
| 34 | finale_takedown | action/story | Takedown cutscene → underwater finale (re-cut off the MISSION FAILED screen, IN 07:54:06) |
| 35 | ending_returns | story | The memorial; "007." → "James Bond will return." |

## Editor notes
- **Cold open** is at clip `01` (a dup of #28). Consider a hard cut + title slam after it.
- **Action peaks to trim** — these were cut from long combat stretches at transcript+contact-sheet INs; re-trim each to the best 30–90s in DaVinci against the contact sheet: `08 villa_firefight`, `10 damian_boss`, `17 factory_infiltration`, `20 hyperion_firefight`, `24 ice_escape`, `25 mi6_under_attack`, `26 hostage_fight`, `27 datacenter_push`, `30 last_stand`, `31 valhalla_chase`, `33 sewer_boss`.
- **Two boss fights:** `10_damian_boss` (Vietnam villa, drug-buffed) and `33_sewer_boss` (the golden-mask finale). Both have a visible boss health bar — frame on it.
- **MISSION FAILED safety:** `21_centrifuge_core` OUTs at 06:31:50 (before the 06:33 fail) and `33_sewer_boss` OUTs before the 07:52:30 fail; `34_finale_takedown` INs on the post-win cutscene (07:54:06). If you re-trim these, don't pull past those fail screens.
- **Zoom-to-face**: pre-placed ~1.5× reframe toward the bottom-right facecam at the marquee lines; smooth in DaVinci (keyframe 1.0→1.5 over ~8–10 frames, cap ~1.6×). See `firstcut-editplan.md`.
- **Ending**: `35_ending_returns` carries the "James Bond will return" card — good spot for an outro/subscribe end-screen.
- **Memes** (optional): flagged in the editplan as MEME markers (the "$1,000 bourbon", "meet Wrecky").

## Finishing
- **Primary:** import the `.fcpxml` into **DaVinci Resolve (free)** on Windows, polish, export to the render target above.
- **Alternative:** Blender VSE via the Windows `blender` MCP (`docs/blender-video-editing.md`) — import clips butted end-to-end, add zooms/memes, render.
