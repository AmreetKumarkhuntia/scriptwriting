# Amreet Talks — Shorts Plan (12 reels)

**Created:** 2026-07-04 · **Deliverable:** 12 reels (post top 10 + 2 bonus), each ≤20s, derived/cut from a published long-form and funnelling back to it.
**Status (2026-07-04):** ✅ All 24 source windows **cut** to `/mnt/f/recordings/ai talks/shorts/<reel>/src/`. Masters in `_sources/`. Editor manifest (clips + VO per reel) lives beside the media at `/mnt/f/recordings/ai talks/shorts/README.md`.
**✅ Reel #1 (HERO) BUILT & RENDERED** — `→ /mnt/f/recordings/ai talks/shorts/01-aijobs-person/out/r1.mp4` (1080×1920 @30fps, 19.0s, VO baked in). See "Build method" below.
**✅ Reel #3 BUILT & RENDERED (2026-07-08)** — `→ /mnt/f/recordings/ai talks/shorts/03-china-top6/out/r3-talk.mp4` (1080×1920 @30fps, 20.05s). Talking-head variant, built directly from R1/R2's locked template. See "Reel #3" entry below.

## Build method (locked with Reel #1 — the template for 2–12)

Reels are **rebuilt natively in Remotion at 9:16**, not overlaid on the 16:9 cut clips. Reason: the published cut intercuts a facecam that won't lip-sync to the English VO; a native rebuild is 100% clean motion-graphics and true vertical. It reuses the channel's own `remotion-all/src/AIJobs/` component library (`SceneBackground`, `StatCounter`, `KineticTitle`, + a portrait `VersusSplit`). The on-brand **kinetic center text is the caption highlighting** (words reveal in time with the VO; key words pop cyan=win / rose=fear) — no separate lower-third band. VO = premium ElevenLabs **Liam** via vidIQ, baked in as `<Audio>`; beat frames snapped to the VO's own sentence pauses (`ffmpeg silencedetect`).

- **Composition:** `AIJobs-Reel1` in `remotion-all/src/AIJobs/clips/AIJobsReel1.tsx` (registered in `AIJobs/index.tsx`, `1080×1920 @30fps`, 570f).
- **VO:** `01-aijobs-person/vo/r1-liam.mp3` (16.6s). Public wiring: `remotion-all/public/aitalks-shorts` → symlink to the F-drive shorts folder, so `staticFile("aitalks-shorts/<reel>/vo/…mp3")` resolves.
- **Render:** `cd remotion-all && npx remotion render AIJobs-Reel1 "<out>/r1.mp4"`.
- The `src/` window cuts stay as reference; reels 2–12 clone this composition pattern (swap copy/stats/beats per reel), NOT the "muted clips under VO" workflow.

**★ Talking-head variant (the direction the creator chose) — R1 → `out/r1-talk.mp4`:** his **own recording is the spine** (his voice + face carry it); graphics only **support**. Fixes the "two parallel explanations" problem of the hybrid. Recipe: (1) find his raw take (`ai talks/job fear/ai job fear.mkv` + `.srt`), pick a self-contained ~13s arc on breath boundaries (silencedetect), ffmpeg crop→vertical `src/recording-vert.mp4` keeping his audio; (2) 4.5s graphics **hook** up front (reuse the AIJobs Anton slams) then cut to his recording; (3) **English captions** (lower-third, keyword pop) timed to his delivery (his clip starts at comp frame 135, caption frame = 135+clipTime*30); (4) **supporting overlays** on his beats, kept in the UPPER area so his face stays visible — a `SearchCard` receipt, the `StatCounter` 300M→"basically none" on the payoff line, a headline-chip tease on the cliffhanger; (5) CTA. Composition `AIJobs-Reel1-Talk` at `remotion-all/src/AIJobs/clips/AIJobsReel1Talk.tsx` (in-file `Caption`/`SearchCard`/`HeadlineChip` components). Gotcha: nest overlay containers with `alignItems:"center"` (an `alignItems:stretch` AbsoluteFill blows the card up full-frame); `rm -rf node_modules/.cache` before render if webpack throws. **This is the reusable template for any reel that has a recording.**

**★ Talking-head variant applied to R2 → `out/r2-talk.mp4`:** same recipe, Fable5's cream/ink/clay theme instead of AIJobs' dark palette. Since Fable5 had no local raw take with a clean facecam window, the recording was cut **directly from the published long-form** (`9hNiFmOZCw0`, 19.04–27.67s + 30.40–34.23s, a jump cut removing a 2.7s breath pause) — the auto-generated captions (`yt-dlp --write-auto-sub`, free, no Whisper needed) were used to locate the window by keyword search ("security", "hacking", "GPT-5.5") instead of scrubbing the raw `.mkv` takes. Supporting overlays reuse Fable5's own literal components verbatim (`GuardrailVault` padlock card, `StatBlock`) instead of porting AIJobs' `SearchCard` — its unfilled-circle "icon" matches a pattern the creator has previously rejected (abstract glyphs vs. instantly-nameable objects). His real spoken arc ends on the model being *released* (not "still locked away" as in the graphics build), so the `StatBlock` "5× vs GPT-5.5" appears as a forward-teasing cliffhanger into the CTA rather than a claim he says that line. Also fixed here (and backported to `AIJobsReel1Talk.tsx`): the shared `Caption`/`FadeCenter` pattern was reading `useVideoConfig().durationInFrames` (the whole composition's length) for its fade-*out* instead of each caption's own local `<Sequence>` duration — since `useCurrentFrame()` is Sequence-relative, captions faded in but hard-cut out instead of fading. Composition `Fable5-Reel2-Talk` at `remotion-all/src/Fable5/clips/Fable5Reel2Talk.tsx`.

**★ Talking-head variant applied to R3 → `out/r3-talk.mp4`:** a variation on the recipe — instead of a synthetic TTS hook, **his own live facecam audio doubles as the hook** (no new VO credits spent). Two source windows joined on a whoosh, both his real voice throughout: **Beat 1** = `hook.mp4` 0.0–2.70s (his facecam saying the video's literal opening line, "China just took a Google [over]…") and **Beat 2** = `price.mp4` 2.70–18.60s (cut on a verified `silencedetect` pause) — the published video's *own* bar-chart graphics (MiniMax M2.5 vs GPT-5.5: 80.2% vs 88.7% SWE-Bench Verified, $0.30 vs $5.00/M tokens, 17× more expensive for just 8 points), which already carry his real narration baked in, so **no captions were added over the bar-chart portion** — the on-screen numbers already are the caption. All numbers verified against `channels/Amreet Talks/videos/China takes over AI/research.md` (not the ASR captions, which garbled "80.2%" → "8.2%" etc.). Both windows use the **same crop formula as R1/R2** (`crop=608:1080:656:0,scale=1080:1920`) — verified via frame grabs that the bar-chart text survives the crop with margin, so facecam and full-screen graphics could share one crop pass. A `HeadlineChip` ("That week · Top 6 most-used models → all Chinese") bridges the reel's own thesis in the upper area right as Beat 2 opens, since the source video's native "NOT GOOGLE/NOT OPENAI" + "APRIL 2026" graphics fall just after the Beat-1 cutoff and weren't reachable inside the ≤20s budget. Sourcing note: `yt-dlp --write-auto-sub` hit a persistent HTTP 429 on this video (all client variants, incl. PO-token-gated `web`) and the `vidiq_video_transcript` MCP tool also errored out both times — the actual transcript came from a pre-existing `script.srt` sitting alongside the raw `.mkv` takes on the F-drive (`China Takes Over Ai/script.srt`, a real ASR transcript of his take, Hinglish, with the usual number-garbling). Composition `China-Reel3-Talk` at `remotion-all/src/China/clips/ChinaReel3Talk.tsx`.

**Follow-up — asymmetric crop (facecam letterboxed, graphics stay full-bleed):** creator feedback after watching r3-talk: the initial cut cropped *everything* (facecam and bar-chart graphics alike) with the same tight full-bleed `crop=608:1080:656:0` — fine for graphics, too zoomed on his face. Fix applies a gentler crop **only** where his camera is on screen: `crop=900:1080:510:0,scale=1080:1296,pad=1080:1920:0:312:black` (1.48× wider FOV than the tight crop, 312px letterbox bars top/bottom ≈ 32.5% of the canvas — chosen because 1,166,400/900=1296 divides evenly, zero distortion, and the crop is a strict superset of the old one so the framing doesn't shift, just widens). Graphics-only stretches are untouched. This required splitting what was one `beat2-vert.mp4` into three: `beat2a-graphics-vert.mp4` (price.mp4 2.70–9.40s, tight crop), `beat2b-facecam-vert.mp4` (9.40–11.866667s — his live reaction plus the ~0.4s dissolve baked into the source, gentler crop), `beat2c-graphics-vert.mp4` (11.866667–18.60s, tight crop) — cut points found via `ffmpeg` scene-change detection and landed on exact 60fps source-frame boundaries (162/564/712/1116) so the 2:1 decimation to 30fps has zero rounding drift (201+74+202=477 frames, unchanged from the original single-clip `BEAT2_FRAMES`, so no other Sequence offsets moved). `beat1-vert.mp4` (the pure-facecam hook) got the same gentler crop. Old `beat2-vert.mp4` and a `beat1-vert-tightcrop-orig.mp4` backup are left on disk, unreferenced, as a rollback.

**Hybrid (face) variant — earlier test on R1 → `out/r1-hybrid.mp4`:** a graphics hook (Liam VO trimmed to the setup) that **hands off to the creator's real facecam clip** for the payoff, then the CTA. Recipe: (1) ffmpeg pre-crop the facecam window to vertical 1080×1920 (subject-centered cover, gentle zoom) → `src/<clip>-vert.mp4`; (2) trim the Liam VO to the setup with a fade tail → `vo/<reel>-liam-setup.mp3`; (3) in the comp, reuse the setup beats, then a `<Sequence>` with `<OffthreadVideo src={staticFile("aitalks-shorts/<reel>/src/<clip>-vert.mp4")} objectFit:"cover">`, a top/bottom scrim, a lower-third that carries the **English payoff on mute**, and a `hook-whoosh` SFX on the transition; (4) end card. Composition `AIJobs-Reel1-Hybrid` at `remotion-all/src/AIJobs/clips/AIJobsReel1Hybrid.tsx` is the reference. Facecam carries **its own (Hindi) audio** in the handoff — the language switches mid-reel by design; swap to muted-B-roll-under-Liam or a fresh English selfie take if preferred.

## Context

Amreet Talks is small/restarting (top video = 107 views); Shorts are the cheapest top-of-funnel. Each reel is **≤20s**, **cut from an already-published long-form**, **re-voiced in punchy English** (originals shipped Hinglish — source audio muted under the new VO), with animated **caption highlighting**, ending in a CTA back to its parent. Only 4 videos are published, so we mine 2–4 distinct moments each. Final aspect (9:16 rebuild vs letterbox 16:9) and VO source (self-record vs cloned TTS) stay parked — **cut first, decide after**.

⚠️ **Facecam caveat (found on cutting):** the 3 explainer videos are mostly clean motion-graphics, but **Fable 5's intro (R2) is facecam** and **China/others intercut facecam reaction shots** — these won't lip-sync under English VO. Cover them with the graphic/caption card, or swap in the clean silent Remotion section-renders that already exist in the project folders (`ai talks/fable 5 comparison/Fable5-*.mp4`, `ai talks/China Takes Over Ai/China-Section*.mp4`). Benchmark/stat graphics (subsidy, frontier, flip, tokens, wef) are clean and ready as-is.

## Sources (published, verified IDs + durations)

| Parent | ID / URL | Len | Views | Reels | master |
|---|---|---|---|---|---|
| AI Jobs Apocalypse: Reality Or Panic? | `V2-_0JBnP2w` · youtu.be/V2-_0JBnP2w | 3:51 | 62 | 3 | `_sources/aijobs.mp4` |
| China's AI is Taking Over the World! | `wLSqttwg0JU` · youtu.be/wLSqttwg0JU | 10:09 | 107 | 4 | `_sources/china.mp4` |
| Big AI Is Running Out Of Time (AI Bubble) | `Nv0W9K-cDQ4` · youtu.be/Nv0W9K-cDQ4 | 3:54 | 29 | 3 | `_sources/bubble.mp4` |
| Claude Fable 5 (Most Insane AI Model) | `9hNiFmOZCw0` · youtu.be/9hNiFmOZCw0 | 13:17 | 15 | 2 | `_sources/fable.mp4` |

> AI Kill Switch is a **draft (unpublished)** — no reel until recorded; queued as future Short #13 (best punch lines of the set).

## Format spec (all reels)

≤20s hard cap · hook lands by 0:03 · fresh **English VO** (MrBeast pacing) drives the timeline, source audio muted · visuals = the pre-cut `src/` clips · burned animated captions with **keyword pop** on bold words · end card (last ~2s) "Watch the full video →" + parent title + subscribe · parent link in description **and** pinned comment.

## The 12 reels (ranked A=hero/top · B=strong · C=bonus)

Full VO scripts, keyword pops, and clip filenames per reel are in the F-drive `README.md` next to the media. Summary + cut windows here:

| # | Tier | Reel (hook) | Parent | src clips (window) |
|---|---|---|---|---|
| R1 | A | ✅ **BUILT** — "AI isn't coming for your job. This is." | AI Jobs | native 9:16 rebuild → `out/r1.mp4` · **+ HYBRID face test → `out/r1-hybrid.mp4`** |
| R2 | A | ✅ **BUILT** — "Too dangerous to release" | Fable 5 | native 9:16 Remotion rebuild → `out/r2.mp4` · **+ TALKING-HEAD variant → `out/r2-talk.mp4`** |
| R3 | A | ✅ **BUILT** — "Top 6 AI models were all Chinese" | China | native talking-head build → `out/r3-talk.mp4` |
| R4 | A | "You pay $20. It costs $60." ✅clean | AI Bubble | hook (0:00–0:19) · subsidy (0:38–1:00) |
| R5 | B | "300 million jobs gone? Zero." | AI Jobs | hook (0:00–0:10) · wef (1:44–2:12) |
| R6 | B | "5× better than GPT-5.5" ✅clean | Fable 5 | swebench (0:52–1:04) · frontier (1:06–1:30) |
| R7 | B | "4.55 trillion tokens in 7 days" ✅clean | China | tokens (3:26–3:35) · fiftyx (1:45–1:50) |
| R8 | B | "China cut AI prices 90%" | AI Bubble | china-price (1:15–1:31) · choice (1:44–1:55) |
| R9 | C | "AI can't fix your wiring" | AI Jobs | jobs-safe (3:06–3:22) |
| R10 | C | "Open source isn't charity — it's strategy" | China | platforms (4:34–4:42) · derivatives (5:16–5:22) · default (9:11–9:19) |
| R11 | C | "The bubble isn't AI" | AI Bubble | thesis (2:55–3:15) |
| R12 | C | "Whoever owns the default owns what you see" | China | whatyousee (8:01–8:09) · default (9:11–9:19) |

## Posting calendar (12 reels, every other day, interleaved parents)

Hero first; parents rotated so no two same-source reels post back-to-back; ~5–6pm IST. Post the **top 10**; R11–R12 are bonus. Dates are targets.

| # | Date | Reel | Parent |
|---|---|---|---|
| 1 | Sun Jul 6 | R1 Hero — person not AI | AI Jobs |
| 2 | Tue Jul 8 | R3 — Top 6 Chinese | China |
| 3 | Thu Jul 10 | R4 — $20 vs $60 | AI Bubble |
| 4 | Sat Jul 12 | R2 — too dangerous | Fable 5 |
| 5 | Mon Jul 14 | R5 — 300M → zero | AI Jobs |
| 6 | Wed Jul 16 | R7 — 4.55T tokens | China |
| 7 | Fri Jul 18 | R8 — 90% price cut | AI Bubble |
| 8 | Sun Jul 20 | R6 — 5× better | Fable 5 |
| 9 | Tue Jul 22 | R9 — can't fix wiring | AI Jobs |
| 10 | Thu Jul 24 | R10 — open-source strategy | China |
| 11 | Sat Jul 26 | R11 — bubble isn't AI (bonus) | AI Bubble |
| 12 | Mon Jul 28 | R12 — own the default (bonus) | China |

## Production workflow (remaining, per reel)

1. ~~Pull visuals~~ ✅ done — clips in `/mnt/f/recordings/ai talks/shorts/<reel>/src/`.
2. **VO** — self-record, or clone-voice via vidIQ (`vidiq_voiceover_clone_start` → `vidiq_voiceover_generate`); trim ≤20s; VO = master audio.
3. **Assemble** — VO first, muted `src/` clips under it in the listed order (Blender VSE via Windows Claude, or any editor). For facecam windows, cover with the graphic / a caption card / the clean section-renders.
4. **Caption highlight** — burn animated VO captions; pop the keyword list on beat.
5. **End card** — last ~2s CTA to parent.
6. **Aspect** — leave 16:9 (or letterbox 1080×1920); revisit after cut #1.
7. **Export & post** → `/mnt/f/recordings/ai talks/shorts/<reel>/out/`; parent link in description + pinned comment.

## Folder convention

- **Plan/spec (repo):** `channels/Amreet Talks/shorts/shorts-plan.md` (this file, canonical).
- **Media (F: drive, never committed):** `/mnt/f/recordings/ai talks/shorts/` → `_sources/` (masters), `<NN-slug>/src/` (cut clips), `<NN-slug>/out/` (renders), `README.md` (editor manifest).
- Slugs: `01-aijobs-person`, `02-fable-danger`, `03-china-top6`, `04-bubble-subsidy`, `05-aijobs-zero`, `06-fable-5x`, `07-china-tokens`, `08-bubble-90`, `09-aijobs-wiring`, `10-china-opensource`, `11-bubble-notai`, `12-china-default`.

## Verification

- Clip cuts: ✅ all 24 exist at exact requested lengths (ffprobe-verified), key graphics eyeballed via frame grabs.
- Per reel before posting: runtime ≤20s · hook lands by 0:03 · captions sync to VO · numbers on screen match VO · end card readable · parent link in description **and** pinned comment.
- Watch reel #1 (hero) end-to-end first; lock the template, then batch the rest.
