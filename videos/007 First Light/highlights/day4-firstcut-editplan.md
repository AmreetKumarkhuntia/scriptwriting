# 007 Day 4 — First Cut · Edit Plan (DaVinci Resolve)

Companion to `007_day4_firstcut.fcpxml`. This is a **first cut** — clips assembled in story
order, razor-cut at each beat, with a zoom-to-face reframe pre-applied on the confident
beats and a labelled marker on every beat. **No motion graphics** (by design). You open it,
smooth the push-ins, and tune.

## How to open
DaVinci Resolve (free) → **File → Import → Timeline…** → `007_day4_firstcut.fcpxml`
(it sits in this folder, `F:\recordings\007\part 4\`). Timeline is **2560×1440 @ 60fps**;
media links from this same folder. If clips show offline, relink to `F:\recordings\007\part 4\`.

## The zoom-to-face move (you apply this — 30 seconds, once)
> DaVinci's FCPXML import mangles transforms (it threw the zoomed shot off-canvas = black
> frames), so the reframe is **deliberately not baked in**. Instead the clip is already **cut to
> the exact segment** at each ZOOM beat, so applying it yourself is fast — do it once, copy to all:

1. Click a **ZOOM** segment → **Inspector → Transform**.
2. **Zoom ≈ 1.6**, then drag **Position** so your face (bottom-right cam) is centred — starting
   point ~ **X −700, Y +380** (in Resolve, +Y is *up*). Nudge to taste; cap ~1.8× (cam is small,
   bigger gets soft).
3. **Ease it** — keyframe Zoom 1.0 → 1.6 over ~8–10 frames in, then back out, so it *pushes*
   instead of jump-cutting. (A hard cut-to-face reads fine too if you'd rather skip easing.)
4. **Reuse it** — right-click the finished segment → **Copy**, select the other ZOOM segments →
   **Paste Attributes → Transform**. One framing, applied to all of them.

## Beats (clip-local timecodes)

### ZOOM → face — clip is cut at the line; apply the reframe (confident times from cut-list)
| Clip | At | Line |
|------|----|------|
| `02_safehouse_evidence` | 7:18 | "009 wasn't the culprit, he **was the target**." |
| `14_damian_banter` | 2:04 | "Never accept a drink from a stranger…" |
| `14_damian_banter` | 4:53 | "…**Make them disappear.**" |
| `19_perch_finale` | 3:09 | "I don't feel so good, actually." (poison gag) |

### ZOOM → face (tune) — marker only, time approximate
These are where a zoom-to-face *should* land but the clip-local time needs eyeballing —
scrub to the line, then apply the same reframe. (Refine via a transcript pass if you want.)
| Clip | ~At | Beat |
|------|----|------|
| `01_shipwreck_lore` | 0:35 | Roth's lore dump — Operation Knife/Nightfall, the 009 mole hunt |
| `07_apartment_hit` | 2:00 | Monroe's note — "they're gone because of my mistakes" |
| `06_aftermath_gohome` | 3:15 | "we just put three agents in the ground… go home" |
| `13_web_meet` | 1:05 | the speech + watch hack |

### MEME — marker only (drop your own image/GIF on a track above)
No meme assets exist yet — these mark *where* a meme lands; add the file yourself (or ask me
to source them). Times approximate.
| Clip | ~At | Gag |
|------|----|-----|
| `10_cctv_simon` | 0:15 | "Simon says… feet or head first, you choose" |
| `11_cctv_hack` | 0:30 | password-on-a-post-it gag |
| `17_artifact_ai_exhibit` | 0:55 | "Damian's dogs, I presume" |
| `15_window_escape` | 1:00 | "my eyeballs!" gag |
| `09_gala_infiltration` | 2:00 | press-pass gambit — posing as journalist "Mike Chatzfield" |

## Regenerating
Edit `day4-firstcut.beats.json` (in the repo, copy here) and re-run:
```
python3 scripts/firstcut_fcpxml.py "videos/007 First Light/highlights/day4-firstcut.beats.json" \
  "/mnt/f/recordings/007/part 4/007_day4_firstcut.fcpxml"
```
`kind` values: `zoom` = split + reframe + marker · `tune` = marker only (zoom spot, approx) ·
`meme` = marker only.
