# 007 Day 5 — Editor Handoff (two highlight videos)

**Read this first.** Day 5 (8h VOD) is cut into **two** sequential highlight videos in story order:
- **Part 1 — "The Web HQ Heist"** (London raid + conspiracy reveal + escape) ≈ 32 min
- **Part 2 — "The Final Mission"** (Vietnam → finale) ≈ 31 min

Each part is delivered as: clean-boundary clips (native 1440p60, Hindi commentary baked in, **no motion graphics**) + a DaVinci-importable FCPXML first cut with pre-placed zoom-to-face moves and labelled markers. Polish (smooth zooms, drop memes, final fades/music) happens in DaVinci.

> **Status:** clips pending cut from the full VOD (download in progress). Once `enc()` runs + contact sheets check out, this becomes READY.

## Spec (both parts)
- Container/codec: MP4 / h264 (libx264 crf 18), **2560×1440 @ 60 fps**, yuv420p
- Audio: AAC 48 kHz stereo (Hindi commentary + game audio, baked)
- Cut philosophy: complete scene/dialogue boundaries; long combat/navigation trimmed to peaks; cold-open teaser at clip `01`.

## Paths (WSL ↔ Windows — same bytes, Windows path for DaVinci)
| What | WSL | Windows |
|---|---|---|
| Full VOD archive | `/mnt/f/recordings/007/007_day5_full.mp4` | `F:\recordings\007\007_day5_full.mp4` |
| Part 1 clips + FCPXML | `/mnt/f/recordings/007/day5 p1/` | `F:\recordings\007\day5 p1\` |
| Part 2 clips + FCPXML | `/mnt/f/recordings/007/day5 p2/` | `F:\recordings\007\day5 p2\` |
| Part 1 first cut | `…/day5 p1/007_day5_p1_firstcut.fcpxml` | `F:\recordings\007\day5 p1\007_day5_p1_firstcut.fcpxml` |
| Part 2 first cut | `…/day5 p2/007_day5_p2_firstcut.fcpxml` | `F:\recordings\007\day5 p2\007_day5_p2_firstcut.fcpxml` |
| Render P1 → | | `F:\recordings\007\007_day5_p1_edit.mp4` |
| Render P2 → | | `F:\recordings\007\007_day5_p2_edit.mp4` |

## Part 1 clips (timeline order)
| # | clip | type | what it is |
|---|------|------|-----------|
| 01 | coldopen_thea | hook | Cold open: Thea villain line (dup of #10) |
| 02 | setup_shutdown | story | The mission setup + coffee banter |
| 03 | infiltrate_mole | story | "A simple mole. Human weakness." |
| 04 | perch_gate | story | Damian's office; "the perch gate, use it" |
| 05 | mole_plan | story | Mystery woman + the heist plan |
| 06 | basilisk_safe | story/action | Q-tech safe; "the command code is basilisk" |
| 07 | damian_escape | action | "4 minutes, you'll never make it"; zipline; "we're in" |
| 08 | faraday_cage | story | "A giant Faraday cage" |
| 09 | labcoat_mole | funny | Lab-coat gag; Isa Vale outed |
| 10 | the_reveal | story | **Climax:** the cover-up + Thea monologue |
| 11 | flightdeck_fight | action | Escape gunfight (peak nudged on video) |
| 12 | greenway_imout | story | "There is no we, bro. I'm out." |
| 13 | nullspace_debrief | story | M's black-op assignment; "go see Q" |
| 14 | vietnam_briefing | story | → "We are in Vietnam. Chapter eight." |

## Part 2 clips (timeline order)
| # | clip | type | what it is |
|---|------|------|-----------|
| 01 | coldopen_newlook | hook | Cold open: "how do you like the new look?" (dup of #11) |
| 02 | vietnam_arrival | story | Courier cover; "Chapter eight"; the Pearl |
| 03 | pearl_ledger | story/funny | QT glasses; read the ledger |
| 04 | villa_ellis | action/story | Villa assault; "I could sure as hell try" |
| 05 | hyperion_core | story | "The core is the magic key" |
| 06 | isa_backstory | story | Isa's parents; "their plane never made it" |
| 07 | aria_factory | story | Wrecky robot + the Aria android |
| 08 | centrifuge_core | action | Stop the centrifuge |
| 09 | crisis_quote | story | "Never let a good crisis go to waste" |
| 10 | hostage_fight | action | Hostage firefight (peak nudged on video) |
| 11 | son_reveal | story | **Climax:** Web's son villain reveal |
| 12 | flood_warning | action | "Turn MI6 underground into a fish tank" |
| 13 | sc9_finale | action | SC9 boss climax (peak nudged on video) |
| 14 | ending_returns | story | "007." → "James Bond will return." |

## Editor notes
- **Cold opens** are already at clip `01` of each part (a duplicate of the marquee beat). Consider a hard cut + title slam after it.
- **Action peaks** (`11_flightdeck_fight`, `10_hostage_fight`, `13_sc9_finale`) were cut from long combat stretches; their exact window was nudged against the contact sheet — re-trim freely if a better 30–60s exists.
- **Zoom-to-face**: pre-placed ~1.5× reframe toward the bottom-right facecam at the marquee lines; smooth in DaVinci (keyframe 1.0→1.5 over ~8–10 frames, cap ~1.6×). See `day5-firstcut-editplan.md`.
- **Ending**: `14_ending_returns` carries the "James Bond will return" card — good spot for an outro/subscribe end-screen.
- **Memes** (optional): flagged in the editplan as MEME markers (e.g. the lab-coat gag, the "$1000 bourbon").

## Finishing
- **Primary:** import each `.fcpxml` into **DaVinci Resolve (free)** on Windows, polish, export to the render targets above.
- **Alternative:** Blender VSE via the Windows `blender` MCP (`docs/blender-video-editing.md`) — import clips butted end-to-end, add zooms/memes, render.
