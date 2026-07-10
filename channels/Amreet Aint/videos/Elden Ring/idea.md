# Elden Ring — Vertical Streams · idea.md

## Thesis
Mine **9 recent, already-vertical (1080x1920) Elden Ring solo live streams** (2026-06-27 →
2026-07-08, ~18.3 hours total, 1–14 views each) for **standalone boss-fight and rage/tilt clips** —
each moment is its own independently-postable YouTube Short + Instagram Reel, not one assembled
supercut. Source footage is native 9:16, so unlike the God of War/007 First Light precedent there's
**no facecam-corner reframe work needed** — clips can go near-straight from cut to caption to post.

This is a different shape from the channel's usual "boss-first supercut" playbook: high volume,
low per-clip effort, fast to iterate on. 143 candidate moments were found across the 9 streams (20
of them S-tier) — see [`cut-list.md`](./cut-list.md) for the full timestamped sweep.

## Why this batch works
- **Two genuinely different content flavors from the same footage**: BOSS clips sell the skill/spectacle
  (clutch wins, iconic bosses, "I hate this boss" arcs), RAGE clips sell the personality (meltdowns,
  self-deprecating one-liners, comedic tilt) — post them as separate series so each finds its own
  audience instead of diluting one channel's "brand."
- **Recurring bits are a free hook**: "I hate this boss" recurs verbatim in two different streams
  (`j8fuJ2xbVIg`, `AF_7niXth8g`) — worth leaning into as a recognizable tag/thumbnail phrase.
  Accidental ledge-jump deaths are a comedy goldmine (happens 2x in `y9ikYH3oECU`, 1x in
  `j8fuJ2xbVIg`, 3x self-reported in `NxOMr6_jzA4` — "died 40-50 times jumping like this").
  Rennala appears in two different sessions with completely different reactions
  (`y9ikYH3oECU`'s battery-charge gag vs. `j8fuJ2xbVIg`'s "she turned into Goku" fight) — a natural
  "which reaction is funnier" side-by-side post.
- **Rage triggers repeat predictably** (per the cut-list's cross-stream notes): unfair-feeling dodge/
  parry timing, long run-backs after a death, running out of flasks mid-attempt, terrain/camera
  getting the player stuck, unreliable NPC summons, and ambush/swarm mobs. Useful to know for
  framing future streams too, not just this clip batch.

## Packaging (per-clip, not per-video)
Since the deliverable is many small standalone clips, packaging happens at the clip level. Shorts/
Reels autoplay from frame 0, so the **first 1-2 seconds of the clip itself is the hook** — pick IN
points that start right at the punchline or right before the payoff, not mid-buildup.

**Caption/on-screen-text templates** (Hinglish, one CAPS word, channel's usual loud-reaction voice):
- BOSS clips: `"[BOSS NAME] मर गया 💀🔥"` / `"मैंने बोला CANCER-SHAPED बॉस, अगले सेकंड में मर गया 😭"` /
  `"1 HP पे CLUTCH WIN 🔥 (Elden Ring)"`
- RAGE clips: `"मैं एक CAR से मरा एल्डन रिंग में 💀"` / `"'I HATE THIS BOSS' — भाई का पूरा meltdown 😂"` /
  `"40 बार कूद के मरा भाई 💀 (Elden Ring rage compilation material)"`

**Thumbnail (if used for YT Shorts' cover frame):** freeze on the reaction peak — the death screen,
the boss health bar at zero, or the facecam mid-scream/mid-laugh (facecam is baked into the corner
of this footage same as the rest of the channel).

**Tags:** Elden Ring, Elden Ring Hindi, Elden Ring gameplay, Elden Ring boss fight, Elden Ring funny
moments, Elden Ring rage, Hindi gaming shorts, Hinglish gameplay, Amreet Aint, Elden Ring clips.

Pre-publish: run `vidiq_score_title` on caption text where it doubles as the on-platform title.

## Platform notes
- Source is already 1080x1920 — cut straight, no `firstcut_fcpxml.py` reframe pass needed.
- Both YouTube Shorts and Instagram Reels accept the same vertical export — one cut serves both
  platforms (re-export audio loudness/captions per platform's usual defaults).
- Clip lengths in the cut-list run ~15–90s; most Shorts/Reels-native lengths (keep under 60s where
  the beat allows, only the "can't-cut" boss climaxes run longer).

## Caveats
- Transcript source is YouTube's real `hi-orig` Hindi auto-caption track (confirmed present on all
  9 videos — an earlier assumption that captions were missing was wrong, caused by truncating
  `--list-subs` output; see the tooling report from this session). Auto-ASR still garbles proper
  nouns/boss names and code-switched English — verify exact wording via `transcript.py window`
  before burning in captions.
- **All S+A tier candidates (69 of 143) have since been visually verified**, not just
  transcript-scanned — a test cut ("died to a literal car") turned out to be pure talking-to-chat
  with zero on-screen action, so every S/A candidate was checked against sampled video frames.
  18 were dropped as transcript-only false positives, 9 got a corrected boss/enemy name (ASR
  garbled several — the real names came from reading the on-screen health bars), and 3 were
  downgraded pending a re-check (real footage exists, just not at the exact claimed timestamp).
  **B-tier (74 candidates) is still transcript-only / unverified** — see `cut-list.md`'s "Needs
  re-check" and "Rejected" sections for the full detail before trusting any B-tier row at face value.
- `NxOMr6_jzA4`'s original 30 candidates were scanned in a single retry pass (the original workflow
  run hit a transient API error on this stream) and were **not** cross-normalized against the other
  8 streams' tiering the way the rest of the batch was — since visually verified alongside everyone
  else's S/A tier, so this is now less of a concern than it was.
- Source VODs / any actual cut clips live on **`/mnt/f`** (Windows F: drive) once cutting starts —
  not the repo. This pass (candidate discovery + visual verification) ran on macOS, so working files
  (captions, cleaned transcripts, low-res verification downloads, contact sheets) live in a session
  scratchpad, not committed anywhere.

→ Full timestamped, tiered candidate sweep in [`cut-list.md`](./cut-list.md).
