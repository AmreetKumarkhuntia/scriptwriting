# 007 First Light — Day 4 · Highlight Clips (cut list)

Source VOD: <https://www.youtube.com/live/Q1rz778nbfY> (2h29m16s, Hindi
commentary, channel *Amreet Aint*). Day 4 covers chapters 5–7: the desert
shipwreck, Becket's safehouse, the apartment hit + rooftop chase, the Web
Industries gala (Ch.6), the Damian Web confrontation, and the Perch (Ch.7).

**This is a clips-only deliverable** — no Remotion, no motion graphics, no
concatenation. Each clip is a complete scene (cutscenes kept end-to-end) with the
grind / navigation / death-retries clipped out between beats. Cut clips →
`/mnt/f/recordings/007/part 4/`. Full archive VOD kept at
`/mnt/f/recordings/007/007_day4_full.mp4`.

IN/OUT are cue-level transcript anchors (verified against
`/tmp/yt_Q1rz778nbfY.en.vtt`); nudge any boundary the contact sheet shows
clipping a line.

## Running order

| # | clip | IN → OUT | dur(s) | beat | type |
|---|------|----------|----:|------|------|
| 01 | `01_shipwreck_lore` | 00:04:46 → 00:08:45 | 239 | Roth on the wreck — Operation Knife/Nightfall, the 009 mole hunt, the "great white" twins (Nico & Jerome) | story |
| 02 | `02_safehouse_evidence` | 00:11:06 → 00:18:50 | 464 | Becket's booby-trapped safehouse → Q-Branch self-destruct case → **"009 wasn't the culprit, he was the target"** | story |
| 03 | `03_firefight_start` | 00:18:52 → 00:19:50 | 58 | "We got company. A lot of it" — ambush kicks off | action |
| 04 | `04_landrover_backup` | 00:23:15 → 00:25:30 | 135 | Land Rover destroyed → "I have a backup plan" → "An army of them" | action |
| 05 | `05_heavy_driver_kill` | 00:37:22 → 00:38:48 | 86 | "Heavy driver" mini-boss down → "Greenway, legend" | action |
| 06 | `06_aftermath_gohome` | 00:40:50 → 00:44:40 | 230 | "You'd have made a great double O" → case closed → "we just put three agents in the ground… go home" | story |
| 07 | `07_apartment_hit` | 00:44:47 → 00:49:40 | 293 | Monroe's flat — poison-tip umbrella, her note ("they're gone because of my mistakes"), the assassin arrives | story |
| 08 | `08_rooftop_chase` | 00:49:40 → 00:55:08 | 328 | **"Faster, James!"** rooftop chase → grabs the phone → Money Penny: signal's at the museum gala (Ch.6 hook) | action |
| 09 | `09_gala_infiltration` | 00:55:24 → 01:02:02 | 398 | Gala social infiltration — "tall, blonde, dead-eyed," posing as journalist "Mike Chatzfield," the press-pass gambit | funny |
| 10 | `10_cctv_simon` | 01:06:28 → 01:07:08 | 40 | "Simon says go back to the gala… feet or head first, you choose" → knockout | funny |
| 11 | `11_cctv_hack` | 01:20:05 → 01:23:08 | 183 | "Brought my own key" → password-on-a-post-it gag → "Here's your man. Basement archives" | funny |
| 12 | `12_archives_kill` | 01:39:58 → 01:41:35 | 97 | Takes down the assassin in the archives — **"That was for Monroe"** | action |
| 13 | `13_web_meet` | 01:44:38 → 01:47:42 | 184 | Meet Nicholas Web, Damian & Isela → the speech + watch hack → the drugged drink | story |
| 14 | `14_damian_banter` | 01:47:42 → 01:55:45 | 483 | **Centerpiece** — Damian's interrogation banter → "Make them disappear" | story |
| 15 | `15_window_escape` | 01:55:55 → 01:59:05 | 190 | Window escape with Isela ("Waiting for you, Jinx") → "my eyeballs!" gag → reveal: it's the **son** running the kill team | story / funny |
| 16 | `16_backlot_gunfight` | 01:59:05 → 02:01:40 | 155 | "Bring your gun to work day" — backlot shootout | action |
| 17 | `17_artifact_ai_exhibit` | 02:13:08 → 02:14:25 | 77 | The neural-net artifact-recreation exhibit narration → "Damian's dogs, I presume" | funny |
| 18 | `18_car_getaway` | 02:21:15 → 02:24:38 | 203 | "Somehow I doubt that" → steal Isela's car ("Hello, Gila") → "half of Kensington would've heard that" → reunion: "Web." | action / funny |
| 19 | `19_perch_finale` | 02:24:46 → 02:28:45 | 239 | Greenway's stash → infiltrate as "upper middle management" → Roger Finch → the **"I don't feel so good"** poison gag → "we will continue tomorrow" | funny / story |

Total ≈ 68 min across 19 clips. Skipped as dead air: intro/loading (00:00–04:45),
the ~15-min firefight grind (kept start + 2 beats + boss), the long stealth
navigation + archives puzzle-retry loops, the bulldozer/Web-HQ combat grind
(02:05–02:13, 02:14–02:21).

## Verbatim — centerpiece quotes

**009 twist (`02_safehouse_evidence`, 00:18:24)**
> "Looks like he wasn't the culprit. He **was the target**." — "It's the other shoe."

**Damian Web (`14_damian_banter`, 01:49:46 / 01:52:35)**
> "Never accept a drink from a stranger. I guess they didn't teach you that in
> that little spy school of yours." …
> "I'd tell you. I really would. But then… well, then I'd have to kill you. Oh
> wait — I'm going to do that anyway."
> "Do you often let your father scold you like a petulant child?" — "That was
> invigorating. Thank you. **Make them disappear.**"

**Perch poison gag (`19_perch_finale`, 02:27:55)**
> "I don't feel so good, actually." — "Oh my. Something you ate?" — "Oh, dear God…"

## Commands (reproducible)

Source: full VOD downloaded once (avoids 19 re-downloads while tuning boundaries):
```bash
cd "/mnt/f/recordings/007"
yt-dlp --no-update -f "400+251/308+251/bestvideo[height<=1440]+bestaudio" \
  --merge-output-format mp4 --no-part -o "007_day4_full.mp4" \
  "https://www.youtube.com/watch?v=Q1rz778nbfY"
```

Cut each clip — `-ss` before `-i` (fast accurate seek), `-t` = duration; re-encode
to h264/aac at **native 1440p/60fps** (no fps downsample — there's no Remotion
stage to normalize for):
```bash
SRC="/mnt/f/recordings/007/007_day4_full.mp4"
OUT="/mnt/f/recordings/007/part 4"; mkdir -p "$OUT"
enc() { ffmpeg -y -ss "$2" -t "$3" -i "$SRC" \
  -c:v libx264 -crf 18 -preset veryfast -pix_fmt yuv420p \
  -c:a aac -ar 48000 -ac 2 "$OUT/$1.mp4"; }

enc 01_shipwreck_lore     00:04:46 239
enc 02_safehouse_evidence 00:11:06 464
enc 03_firefight_start    00:18:52 58
enc 04_landrover_backup   00:23:15 135
enc 05_heavy_driver_kill  00:37:22 86
enc 06_aftermath_gohome   00:40:50 230
enc 07_apartment_hit      00:44:47 293
enc 08_rooftop_chase      00:49:40 328
enc 09_gala_infiltration  00:55:24 398
enc 10_cctv_simon         01:06:28 40
enc 11_cctv_hack          01:20:05 183
enc 12_archives_kill      01:39:58 97
enc 13_web_meet           01:44:38 184
enc 14_damian_banter      01:47:42 483
enc 15_window_escape      01:55:55 190
enc 16_backlot_gunfight   01:59:05 155
enc 17_artifact_ai_exhibit 02:13:08 77
enc 18_car_getaway        02:21:15 203
enc 19_perch_finale       02:24:46 239
```

Verify cut points:
```bash
.claude/skills/vod-clip-extraction/scripts/contact_sheet.sh "/mnt/f/recordings/007/part 4" /tmp/day4_sheet.png
```

## Status — DONE ✅

All 19 clips cut to `/mnt/f/recordings/007/part 4/` (h264 1440p60, AAC, ~4.9 GB
total) and verified against the contact sheet — every cut lands in the right
scene with the commentary audio intact.

Notes on intentional fades (not errors):
- `18_car_getaway` opens on a dim shot of Bond in shadow at the museum exit
  (dialogue "…we hope to see you again. Somehow I doubt that." plays over it).
- `19_perch_finale` opens on a ~5 s fade-from-black into Greenway's stash
  (line "Quite the stash you got here, Greenway" plays over the fade) and ends on
  the natural end-of-session fade after "we will continue tomorrow."

Source archive `007_day4_full.mp4` (5.7 GB) kept in `/mnt/f/recordings/007/` for
any future re-cuts; safe to delete if space is needed.
