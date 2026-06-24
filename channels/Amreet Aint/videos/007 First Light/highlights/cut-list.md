# 007 Day 3 — Cut List (executable companion)

We pull **only the needed sections** at 2K with `yt-dlp --download-sections`
(no full-VOD download), then trim-and-re-encode each to a uniform spec for
Remotion. Final clips → `remotion-all/public/007clips/` (gitignored).

Source streams: 2560×1440 AV1 60fps (`400`) + opus (`251`). IN/OUT are
caption-derived anchors — verify (step 0) and nudge the trim where a line is clipped.

## 1. Download the 14 sections (2K, ~55 MB each)

`--download-sections` without `--force-keyframes-at-cuts` is fast (stream copy,
exact requested length) — tested at ~53 s/clip. We request a **3 s pad** each
side so the exact trim has headroom in step 3.

```bash
URL="https://www.youtube.com/watch?v=uyst1OHsCfM"
FMT="400+251/308+251/bestvideo[height<=1440]+bestaudio"
mkdir -p /tmp/007raw
dl() { yt-dlp -f "$FMT" --download-sections "*$2-$3" --merge-output-format mp4 \
  --no-part -o "/tmp/007raw/$1.%(ext)s" "$URL"; }

# name              PADDED_IN  PADDED_OUT   (= target ±3s)
dl 01_qlab          00:09:22 00:10:58
dl 02_briefing      00:16:32 00:17:53
dl 03_arrival       00:18:12 00:18:58
dl 04_brawl         00:22:32 00:23:28
dl 05_execution     00:24:57 00:26:38
dl 06_fightpit      00:42:17 00:43:28
dl 07_auction_bids  01:12:57 01:14:13
dl 08_auction_climax 01:17:12 01:18:43
dl 09_coup          01:19:12 01:20:03
dl 10_firefight     01:41:27 01:43:03
dl 11_boat_reveal   01:57:17 01:59:33
dl 12_pit_monologue 02:01:41 02:03:39
dl 13_pit_escape    02:03:46 02:04:53
dl 14_scorpion      02:05:32 02:06:28
```

## 0. Verify cut points (do before step 3)

Each padded section is 0-based at its PADDED_IN, so the target beat starts at
**t=3s**. Pull frames to confirm, and adjust the per-clip `-ss` in step 3 (3s =
on target; <3 starts earlier, >3 starts later):

```bash
for f in /tmp/007raw/*.mp4; do
  n=$(basename "$f" .mp4)
  ffmpeg -y -ss 3 -i "$f" -frames:v 1 "/tmp/007check/${n}_in.jpg"   # target IN
  dur=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$f")
  ffmpeg -y -ss $(python3 -c "print(max(0,$dur-3.2))") -i "$f" -frames:v 1 "/tmp/007check/${n}_out.jpg"  # target OUT
done
```

## 2. Target durations (= OUT − IN)

| name | target dur (s) | trim `-ss` |
|------|----:|----:|
| 01_qlab | 90 | 3 |
| 02_briefing | 75 | 3 |
| 03_arrival | 40 | 3 |
| 04_brawl | 50 | 3 |
| 05_execution | 95 | 3 |
| 06_fightpit | 65 | 3 |
| 07_auction_bids | 70 | 3 |
| 08_auction_climax | 85 | 3 |
| 09_coup | 45 | 3 |
| 10_firefight | 90 | 3 |
| 11_boat_reveal | 130 | 3 |
| 12_pit_monologue | 112 | 3 |
| 13_pit_escape | 61 | 3 |
| 14_scorpion | 50 | 3 |

## 3. Trim to exact + re-encode to uniform 2K30 h264/aac

```bash
OUT="remotion-all/public/007clips"; mkdir -p "$OUT"
# enc <name> <ss> <dur>
enc() { ffmpeg -y -ss "$2" -t "$3" -i "/tmp/007raw/$1.mp4" \
  -vf "scale=2560:1440:force_original_aspect_ratio=decrease,pad=2560:1440:-1:-1,fps=30" \
  -c:v libx264 -crf 18 -preset veryfast -pix_fmt yuv420p \
  -c:a aac -ar 48000 -ac 2 "$OUT/$1.mp4"; }
# enc 01_qlab 3 90   … (use the table above; adjust -ss per verification)
```

## 4. Probe durations → frames → clips.ts

```bash
for f in remotion-all/public/007clips/*.mp4; do
  d=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$f")
  printf "%-22s %6.2fs  %5d frames\n" "$(basename "$f")" "$d" "$(python3 -c "import math;print(math.floor($d*30)-1)")"
done
```
Plug each `frames` into `remotion-all/src/Bond007/clips.ts`. Total comp length is
derived by `reelDurationInFrames()`.

## 5. Re-time overlays, preview, render
- `08_auction_climax` callout "We sold Greenway 😅" `at` ≈ "By giving you him" beat.
- `13_pit_escape` callout `at: 40`.
```bash
cd remotion-all
npm run dev     # Studio → scrub Bond007-Highlights (OffthreadVideo has no preview audio; swap <Video> to check, then revert)
npm run lint
npx remotion render Bond007-Highlights --output "/mnt/f/recordings/007/part 3/007_day3_highlights.mp4"
```
