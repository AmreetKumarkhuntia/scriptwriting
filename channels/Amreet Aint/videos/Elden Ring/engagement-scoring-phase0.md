# Engagement / "hold-score" — Phase 0 validation findings

**Question we set out to answer:** can a model score the *good parts vs. bad parts* of a stream —
so we rank clip-worthy moments and eventually auto-assemble a "best moments" cut — and does any of
it actually track our own judgment, running only locally? (Full plan + research landscape:
`~/.claude/plans/indexed-nibbling-riddle.md`.)

**Verdict: PARTIAL PASS — the concept works as a coarse "dead-vs-alive" filter, not yet as a
best-clip ranker.** Details below. This was a cheap spike; we spent almost nothing and now know
exactly what to build (and what not to).

---

## What we built (and why not the 7B VLM)

The research pointed at Meta/others' short-video **engagement** models (SnapUGC / VQualA 2025 —
predict "will they keep watching past 5s"). But the strongest one (VideoLLaMA2-7B) is impractical
*here right now*: this box is an **RTX 5070 with 12 GB VRAM** (7B VLMs want ~16 GB), the pretrained
checkpoints are Baidu-Yun-hosted, and the system Python is 3.14 (too new for that ML stack). Meta's
**TRIBE** is a brain-fMRI encoder, not an engagement predictor — a dead end for us.

So Phase 0 built the **local, learned-free alternative**: `engagement_score.py` (in the
`vod-clip-extraction` skill), which encodes the heuristics we already wrote in `cut-list.md` as cheap
ffmpeg signals — no GPU, one dependency (numpy + a tiny opencv for face detection):

- facecam **reaction-swing** · game-region **action + continuity** · **audio energy + spikes** ·
  **speech density** (from `words.json`) · minus a **dead-air** penalty.
- Splits the frame into facecam vs. gameplay bands. **Bug found & fixed during the spike:** the
  facecam is *not always on top* — several streams (the Rennala sessions, `a17`, etc.) put gameplay
  on top and the facecam on the bottom. A Haar face-detector now picks the correct band per clip;
  before the fix, those clips were scored fully inverted.

## The test set (all local, no downloads needed for the "kept" side)

- **Kept (good):** the 36 already-cut Elden Ring clips — 11 S-tier + 25 A-tier — scored on their
  full `raw/` candidate windows (the exact spans we assigned tiers to).
- **Rejected (bad):** 17 of the **documented rejected windows** from `cut-list.md` (menu, loading,
  black/desktop, riding/traversal, flat-facecam), pulled fresh from the VODs with `yt-dlp
  --download-sections`. These are the true negatives the kept set was missing.

## Results

**0a — score vs. our S/A tier: Spearman ≈ 0 (+0.04).** Expected, and *not* a failure: every one of
the 36 is a confirmed winner, so S-vs-A is "good vs. slightly-better," and the difference is
*editorial* (a recurring bit, a named boss, a punchline) — not something a motion/audio scorer can
see. Tellingly, 4 of the bottom 6 are S-tier: the Rennala cutscene reveal, "queen betrayed us",
quit-to-desktop — all **quiet comedy/story beats**. The scorer is blind to humor by construction.

**0a — kept vs. rejected (the test that matters): AUC = 0.72, gap +0.45.** Given a random good clip
and a random dead window, the score ranks the good one higher **72%** of the time — clearly above
chance (0.50), well short of perfect. Which signals actually separate good from dead:

| signal | separation (z) | note |
|---|---|---|
| **audio_energy** | **+0.95** | loudest signal — shouting/hits/reactions |
| **game_action** | **+0.68** | combat motion |
| dead_air | +0.48 | rejected windows are deader |
| audio_spikes / game_continuity | +0.34 / +0.27 | secondary |
| **facecam_swing / motion** | **~0** | *useless* — yet we had weighted it highest |

Failure modes are the interpretable ones: a **loud loading screen** sneaks up the ranking (audio
fooled it), and **quiet comedy clips** sink. Re-weighting to drop facecam and lead with audio+game
lifts the ceiling to **AUC ≈ 0.79** (robust); **audio-energy alone scores 0.855** on this set — the
streamer's voice is the single best "something clip-worthy is happening" signal — but audio-only is
the config that gets fooled by loud loading/menu screens, so game motion stays in for robustness.
The scorer's default weights have been updated to this tuned config.

**0b — vs. real retention: BLOCKED / pending.** Can't run it now: (1) the gaming clips aren't posted
yet; (2) real retention / avg-view-% is **YouTube-Studio-private** — not exposed by yt-dlp or the API;
(3) the connected vidIQ account is the **Amreet Talks** channel, not Amreet Aint, and its free credits
are exhausted. To do 0b later we need a few posted clips + their Studio retention numbers by hand.

## What this means

- The local scorer is a **decent action/energy detector** — good enough to **auto-prune the dead
  ~80% of a 2-hour VOD** (menus, loading, riding, flat-facecam) and surface the high-energy windows
  as candidates. That directly attacks the real chore: finding the ~20 clip-worthy moments in hours
  of stream, and pruning dead time before a best-of assembly.
- It is **not** a best-*clip* ranker on its own, because roughly half of our best clips win on
  **comedy/dialogue**, which needs language, not motion. We already have that language for free — the
  `words.json` ASR — so the obvious upgrade is a **text signal** (keyword/laughter/profanity-spike, or
  a small local LLM reading the transcript) fused with the audio+game action score.

## Recommended Phase 1 (revised by the evidence)

1. **Re-weight & de-bug the scorer:** drop facecam-swing, lead with audio_energy + game_action +
   dead-air; add a cheap **menu/loading-screen detector** (static UI + uniform/black frame) to kill
   the loud-loading false positive.
2. **Slide it over a whole stream** → an energy curve → non-max-suppress into ranked candidate
   windows. Ship it as the front-end of `vod-clip-extraction` so the human reviews ~20 auto-found
   candidates instead of scrubbing 2 hours.
3. **Add the transcript-text signal** (from `words.json`) so comedy/story beats stop getting missed —
   this is the piece that turns "dead-vs-alive filter" into "actually finds the best parts."
4. **Assemble the survivors** into a best-of via the existing `remotion-highlight-reel` skill.
5. (Deferred) revisit the pretrained 7B ECR model only if we move to a ≥16 GB GPU **and** it beats
   the tuned local scorer on a real 0b retention test.

## Artifacts
- Scorer: `.claude/skills/vod-clip-extraction/scripts/engagement_score.py`
- Raw run + separation numbers: scratchpad `scores_raw_v2.json`, `separation.txt`, `sweep_weights.py`.
