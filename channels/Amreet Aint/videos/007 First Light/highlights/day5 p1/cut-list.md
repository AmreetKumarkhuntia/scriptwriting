# 007 First Light — Day 5 · Part 1 Cut List — "The Web HQ Heist"

**Source VOD:** https://www.youtube.com/live/9hpcQAZr8sk — "The Best Spy is here | 007 First Light day 5"
**Duration:** 08:03:10 · **Commentary:** Hindi/Hinglish (game cutscene dialogue is English) · **Channel:** Amreet Aint
**Full VOD archive:** `/mnt/f/recordings/007/007_day5_full.mp4` (h264 not needed — kept as AV1 1440p60 source for re-cuts)
**Output spec:** native 2560×1440 @ 60fps, h264 crf 18, yuv420p, AAC 48k stereo (same as Day 4).

> Day 5's 8h VOD is cut into **two** sequential highlight videos. This is **Part 1** (London). Part 2 ("The Final Mission", Vietnam → finale) is in `../day5 p2/cut-list.md`.

## Split decision
**Split at 03:13:58 — "We are in Vietnam. Chapter eight."** The only game-announced chapter boundary; a London→Vietnam act change immediately after a mission-complete + M debrief + new-mission briefing. Nearest real act break to the 4h target (next break, the android factory, is ~05:29). See `../day5-master-rundown.md` for the full 8h structure.
- **Part 1 — "The Web HQ Heist"** (London): 00:54:36 → ~03:14  *(this doc)*
- **Part 2 — "The Final Mission"** (Vietnam → finale): ~03:13 → 08:01
- **Warmup trimmed:** 00:00:00–00:54:36 is a battle-royale game + viewer chat — not 007.

> Cold-open convention (Day 4): clip `01` is a duplicate of the part's strongest beat, pulled to the front as a teaser, then it also plays in story position later. Action/story clips at long-combat beats (flight deck) have transcript-derived IN points; their OUT/peak is nudged against the contact sheet after cutting.

---

## PART 1 — "The Web HQ Heist"  (target ~32 min)

| # | name | VOD IN | dur_s | beat / payoff | type |
|---|------|--------|-------|---------------|------|
| 01 | `01_coldopen_thea` | 02:34:14 | 44 | COLD OPEN (dup of #10): "1.35 million killed in car accidents… Player will attain perfection." | hook |
| 02 | `02_setup_shutdown` | 00:54:36 | 234 | M/Greenway shutdown setup + plan; banter "your age group shouldn't break into a high-security building." | story |
| 03 | `03_infiltrate_mole` | 01:15:55 | 85 | "It's someone already inside… a simple mole. Human weakness, Bond, never underestimated." | story |
| 04 | `04_perch_gate` | 01:22:55 | 60 | "Even monsters have mothers." Damian Web's office. "The perch gate is right through here. Use it." | story |
| 05 | `05_mole_plan` | 01:36:28 | 104 | Mystery woman "we should really stop meeting like this / you blew my cover"; the plan: CCTV, kill feeds, command code. | story |
| 06 | `06_basilisk_safe` | 01:46:40 | 212 | Q-tech locker + safe; "the command code is basilisk"; "you make a fine sidekick, James." | story/action |
| 07 | `07_damian_escape` | 01:52:45 | 253 | "You only have 4 minutes. You'll never make it." Bridge retracts, zipline; "Moneypenny, we're in." | action |
| 08 | `08_faraday_cage` | 01:56:58 | 72 | "The place is a giant Faraday cage. Nothing goes in or out." The evidence is here. | story |
| 09 | `09_labcoat_mole` | 02:00:20 | 65 | Lab-coat gag; "Fletcher, operations… she's a corporate mole" (Isa Vale). | funny/story |
| 10 | `10_the_reveal` | 02:31:58 | 267 | **CLIMAX:** false-intel cover-up, framed 009, "a lie from the start"; Thea villain monologue. | story |
| 11 | `11_flightdeck_fight` | 02:36:35 | 145 | Escape gunfight: "Bond, step aside. You'll need that now." (peak nudged on video) | action |
| 12 | `12_greenway_imout` | 03:01:15 | 75 | Greenway breaks: "There is no we, bro. I'm out." | story |
| 13 | `13_nullspace_debrief` | 03:03:23 | 162 | The "null space"; Webb's footage; arrest orders; "a black op to collect irrefutable proof"; "go see Q." | story |
| 14 | `14_vietnam_briefing` | 03:11:20 | 165 | Caliban / Vietnam copycat killing → ENDS "We are in Vietnam. Chapter eight." | story |

**P1 total ≈ 1943 s ≈ 32.4 min** (incl. 44s cold open).

### Part 1 enc() recipe
```bash
SRC="/mnt/f/recordings/007/007_day5_full.mp4"
OUT="/mnt/f/recordings/007/day5 p1"; mkdir -p "$OUT"
enc() { ffmpeg -y -ss "$2" -t "$3" -i "$SRC" -c:v libx264 -crf 18 -preset veryfast -pix_fmt yuv420p -c:a aac -ar 48000 -ac 2 "$OUT/$1.mp4"; }
enc 01_coldopen_thea     02:34:14  44
enc 02_setup_shutdown    00:54:36  234
enc 03_infiltrate_mole   01:15:55  85
enc 04_perch_gate        01:22:55  60
enc 05_mole_plan         01:36:28  104
enc 06_basilisk_safe     01:46:40  212
enc 07_damian_escape     01:52:45  253
enc 08_faraday_cage      01:56:58  72
enc 09_labcoat_mole      02:00:20  65
enc 10_the_reveal        02:31:58  267
enc 11_flightdeck_fight  02:36:35  145
enc 12_greenway_imout    03:01:15  75
enc 13_nullspace_debrief 03:03:23  162
enc 14_vietnam_briefing  03:11:20  165
```

---

## Verbatim — Part 1 centerpiece quotes (zoom-to-face candidates)
- **02:34:32** — Thea (villain thesis): *"Every year 1.35 million people are killed in car accidents worldwide. And yet we just accept it… But if a single driverless car malfunctions, clear the front page."*
- **03:02:14** — Greenway: *"There is no we, bro. I'm out."*

## Reproduce — download command (full VOD, shared with Part 2)
```bash
cd "/mnt/f/recordings/007"
yt-dlp --no-update -f "400+251/308+251/bestvideo[height<=1440]+bestaudio" \
  --merge-output-format mp4 --no-part -o "007_day5_full.mp4" \
  "https://www.youtube.com/watch?v=9hpcQAZr8sk"
```

## Status (Part 1)
- [x] Transcript pulled + scanned (8h), master rundown written (`../day5-master-rundown.md`)
- [x] Split chosen (03:13:58), beats assigned, durations budgeted
- [x] Full VOD downloaded (21GB, dur 08:03:10, all timestamps decode)
- [x] **Part 1 cut + verified** — 14 clips → `day5 p1/`, all decodable, durations match manifest exactly (Σ=1943s≈32.4min), contact sheet verified (boundaries land in-scene, facecam intact), P1 FCPXML regenerated (~32.4 min, 6 zooms, 11 markers).
- [x] beats.json manifest + FCPXML generated (`firstcut.beats.json` → `007_day5_p1_firstcut.fcpxml`)
- [x] Editplan + edit-handoff written (`firstcut-editplan.md`, `edit-handoff.md`)
