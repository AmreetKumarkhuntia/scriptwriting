# 007 First Light — Highlights (per-part docs)

Each published highlight video has its own folder here, named to **mirror its media folder on the F: drive** (`F:\recordings\007\…`). Inside each: the cut list, the editor handoff, the first-cut edit plan, the `firstcut.beats.json` manifest, and the YouTube metadata (title / description / chapters / tags).

| Folder | Video | Working title | Media on F: | Render target |
|---|---|---|---|---|
| `part 3/` | Day 3 | Hunting the pirate king (Al Lef) | `part 3/` | `007_day3_highlights.mp4` (Remotion) |
| `part 4/` | Day 4 | The gala heist + the 009 twist | `part 4/` | `007_day4_edit.mp4` |
| `day5 p1/` | Day 5 · Part 1 | The Web HQ Heist (London) | `day5 p1/` | `007_day5_p1_edit.mp4` |
| `day5 p2/` | Day 5 · Part 2 | The Final Mission (Vietnam → finale) | `day5 p2/` | `007_day5_p2_edit.mp4` |

**Shared:** `day5-master-rundown.md` is the full 8-hour scan of the Day 5 VOD and the rationale for splitting it into Parts 1 & 2 — it spans both `day5 p1/` and `day5 p2/`, so it lives at this root.

Per-folder files (where present):
- `cut-list.md` — clip table (VOD IN, duration, beat) + the `enc()` ffmpeg recipe + verbatim quotes.
- `edit-handoff.md` — "read this first" for the editor: spec, paths, clip running order, notes.
- `firstcut-editplan.md` — DaVinci import + the zoom-to-face map + regenerate command.
- `firstcut.beats.json` — manifest for `scripts/firstcut_fcpxml.py` (Day 4 & Day 5; Day 3 was built in Remotion).
- `youtube-metadata.md` — title options, description, chapters (DRAFT — re-time on final export), tags, hashtags, thumbnail text, pinned comment.
