# Amreet Talks — Shorts Plan (12 reels)

**Created:** 2026-07-04 · **Deliverable:** 12 reels (post top 10 + 2 bonus), each ≤20s, derived/cut from a published long-form and funnelling back to it.
**Status (2026-07-04):** ✅ All 24 source windows **cut** to `/mnt/f/recordings/ai talks/shorts/<reel>/src/`. Masters in `_sources/`. Editor manifest (clips + VO per reel) lives beside the media at `/mnt/f/recordings/ai talks/shorts/README.md`.
**✅ Reel #1 (HERO) BUILT & RENDERED** — `→ /mnt/f/recordings/ai talks/shorts/01-aijobs-person/out/r1.mp4` (1080×1920 @30fps, 19.0s, VO baked in). See "Build method" below.

## Build method (locked with Reel #1 — the template for 2–12)

Reels are **rebuilt natively in Remotion at 9:16**, not overlaid on the 16:9 cut clips. Reason: the published cut intercuts a facecam that won't lip-sync to the English VO; a native rebuild is 100% clean motion-graphics and true vertical. It reuses the channel's own `remotion-all/src/AIJobs/` component library (`SceneBackground`, `StatCounter`, `KineticTitle`, + a portrait `VersusSplit`). The on-brand **kinetic center text is the caption highlighting** (words reveal in time with the VO; key words pop cyan=win / rose=fear) — no separate lower-third band. VO = premium ElevenLabs **Liam** via vidIQ, baked in as `<Audio>`; beat frames snapped to the VO's own sentence pauses (`ffmpeg silencedetect`).

- **Composition:** `AIJobs-Reel1` in `remotion-all/src/AIJobs/clips/AIJobsReel1.tsx` (registered in `AIJobs/index.tsx`, `1080×1920 @30fps`, 570f).
- **VO:** `01-aijobs-person/vo/r1-liam.mp3` (16.6s). Public wiring: `remotion-all/public/aitalks-shorts` → symlink to the F-drive shorts folder, so `staticFile("aitalks-shorts/<reel>/vo/…mp3")` resolves.
- **Render:** `cd remotion-all && npx remotion render AIJobs-Reel1 "<out>/r1.mp4"`.
- The `src/` window cuts stay as reference; reels 2–12 clone this composition pattern (swap copy/stats/beats per reel), NOT the "muted clips under VO" workflow.

**★ Talking-head variant (the direction the creator chose) — R1 → `out/r1-talk.mp4`:** his **own recording is the spine** (his voice + face carry it); graphics only **support**. Fixes the "two parallel explanations" problem of the hybrid. Recipe: (1) find his raw take (`ai talks/job fear/ai job fear.mkv` + `.srt`), pick a self-contained ~13s arc on breath boundaries (silencedetect), ffmpeg crop→vertical `src/recording-vert.mp4` keeping his audio; (2) 4.5s graphics **hook** up front (reuse the AIJobs Anton slams) then cut to his recording; (3) **English captions** (lower-third, keyword pop) timed to his delivery (his clip starts at comp frame 135, caption frame = 135+clipTime*30); (4) **supporting overlays** on his beats, kept in the UPPER area so his face stays visible — a `SearchCard` receipt, the `StatCounter` 300M→"basically none" on the payoff line, a headline-chip tease on the cliffhanger; (5) CTA. Composition `AIJobs-Reel1-Talk` at `remotion-all/src/AIJobs/clips/AIJobsReel1Talk.tsx` (in-file `Caption`/`SearchCard`/`HeadlineChip` components). Gotcha: nest overlay containers with `alignItems:"center"` (an `alignItems:stretch` AbsoluteFill blows the card up full-frame); `rm -rf node_modules/.cache` before render if webpack throws. **This is the reusable template for any reel that has a recording.**

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
| R2 | A | ✅ **BUILT** — "Too dangerous to release" | Fable 5 | native 9:16 Remotion rebuild → `out/r2.mp4` |
| R3 | A | "Top 6 AI models were all Chinese" | China | hook (0:00–0:10) · price (1:04–1:26) · fiftyx (1:45–1:50) |
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
