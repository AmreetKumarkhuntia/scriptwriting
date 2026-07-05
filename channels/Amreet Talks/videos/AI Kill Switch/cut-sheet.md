# AI Kill Switch — Motion-Graphics Cut Sheet (v2)

**Source cut:** `F:\highlights\AI Talks\kill switch.mp4` (6:08, 1080p60, Hinglish VO)
**Clips:** `F:\videoEditing\kill switch\takeovers\` — 10 × MP4, 1920×1080 @ 30fps, h264
**Overlays:** `F:\videoEditing\kill switch\overlays\` — 9 × transparent ProRes 4444 (KSO-1…9),
graphics **around the talking head** for every gap between takeovers
**Look:** GOV-NOIR RED **motion graphics** — designed boards (big type, dossier cards, dated
timeline spines, draw-on strings) with a camera flying across the design. Letterbox bars = the
"graphics register" signature. The earlier 3D renders are archived in `takeovers\3d-versions\`
as alternates.

## How to use (Resolve)

- Drop each clip on **V2** at the timecode below, **straight cuts both ends** — every clip has a
  baked entrance (push-in resolve) and exit (blur + drift). Optional 2-frame dissolve if a cut
  feels hard.
- Clips are **full-screen takeovers**: VO keeps running underneath. Each carries its **own quiet
  SFX track** (~-12 dB under VO); keep or mute per taste.
- **Editable SFX**: every hit is also available as its own audio clip — import
  `F:\videoEditing\kill switch\takeovers\KS-SFX.fcpxml` (sound files in `takeovers\sfx\`),
  copy the audio lanes into the assembly, mute the clips' baked audio. Full cue list:
  [`sfx-track.md`](sfx-track.md).
- 30fps clips on the 60fps timeline is fine.
- Internal beats land on the exact spoken words (from `captions.md`); ±0.5s slip is fine
  everywhere. Trim **tails**, not heads.

## Drop-in table

| # | File | Drop at | Dur | Out at | What it shows / lands on |
|---|------|---------|-----|--------|--------------------------|
| 1 | `KS-ColdOpen.mp4` | **0:00.0** | 14.0s | 0:14.0 | THE HOOK, one flight: giant "12 JUNE 2026 · 5:21 PM" type → the Commerce letter card (red RESTRICTED band snaps) → a wall of app-windows around a big rocker switch — it **SLAMS OFF** (+6.5s, red flash) and the windows die in a cascade → pull back wide: **KILL SWITCH** lockup. |
| 2 | `KS-SealDrop.mp4` | **0:41.0** | 10.0s | 0:51.0 | The "race" bracket: GOOGLE **vs** ANTHROPIC **vs** OPENAI cards pop on "teen company" → a giant red **"U.S. GOVERNMENT" stamp SLAMS diagonally** across the whole bracket (impact at 0:47.9) → "ASLI PLAYER: GOVERNMENT" on "wo actually government hai" (0:48.4 ✓). |
| 3 | `KS-Timeline.mp4` | **1:03.5** | 12.0s | 1:15.5 | **The dated-spine flight**: camera flies 9 JUNE (Fable 5 launch card + LIVE chip) → 12 JUNE · 5:21 PM (letter card) → "KUCH GHANTON MEIN" (dotted globe blinks out) → pull WAY back: whole spine + **72 GHANTE** counter. Cut back to face at 1:15.5. |
| 4 | `KS-Network.mp4` | **2:00.5** | 8.0s | 2:08.5 | The evidence board: AMAZON / WHITE HOUSE / ANTHROPIC cards pinned, red strings draw between them with traveling packets — Amazon→WH lights on "White House tak pahunchai" (2:03.5 ✓) → **"BUG FIX KARO — YA MODEL HATAO" — David Sacks** on the spoken line (2:06 ✓). |
| 5 | `KS-Vault.mp4` | **2:27.5** | 12.0s | 2:39.5 | The law's exhibit wall: "EXPORT CONTROL REFORM ACT · 2018" over framed MISSILE + CHIP blueprints (2:28 ✓) → a glowing **chat bubble slides into the red-crosshair frame** ("?? — EK CHATBOT", 2:31 ✓) → fly to the dotted globe: **DENIED** stamp slams (2:35.2) and the world's dots die. |
| 6 | `KS-StampGate.mp4` | **3:18.3** | 8.0s | 3:26.3 | The RE-EXPORT LICENSE doc takes a red **"GRANTED — SHARTON PE"** stamp (3:20) → **PALANTIR $1B+ card tears off the board** (3:22.2, bonus fact — not in VO; trim if unwanted) → "HUMEIN REGULATE KARO" struck through → **LEVER** stamp on the irony line (3:24.9 ✓). |
| 7 | `KS-SwitchBack.mp4` | **3:52.0** | 12.0s | 4:04.0 | The spine returns: **19 DIN** gap bracket → fly to **1 JULY 2026** station: second letter card, the switch **slams back ON** (3:56.4 ✓ "wapas aaya"), the **99%+ classifier gauge** draws (3:58.3) → fly right: **MYTHOS 5 card behind "US ORGS ONLY" barrier tape** (4:02). Optional split: cut at the clip's 9.4s mark and place the Mythos tail at **4:10.7** where the VO says it. |
| 8 | `KS-OrderVsRequest.mp4` | **4:43.5** | 9.0s | 4:52.5 | Comparison board: ANTHROPIC card takes the red **LEGAL ORDER** stamp on "legal order tha" (4:45.4 ✓); OPENAI card gets the polite paper **"SIRF EK REQUEST"** note on the spoken line (4:47.4 ✓) + SOL·TERRA·LUNA chips; **red puppet strings draw from one node to BOTH cards and pull taut** → **"DO COMPANIES · DO HAFTE · EK HAATH"** (4:50.6). |
| 9 | `KS-Swarm.mp4` | **5:06.0** | 12.0s | 5:18.0 | The showstopper, flat: one server card + cable — the plug **YANKS out** on "ek plug" (5:08.3 ✓) → the camera zooms way out: the whole board is a matrix of thousands of weight-squares and a **red ignition wave** sweeps to the edges on "lakhon hard drives" (5:13 ✓) → MISTRAL / CHINA chips. |
| 10 | `KS-Outro.mp4` | **5:52.5** | 10.0s | 6:02.5 | The flat switch flips **OFF** on "off unhone kiya" (5:53.8 ✓) and **ON** on "on unhone kiya" (5:55.3 ✓) → board clears → kinetic **"SWITCH KISKE PAAS?"** cascade with motion-blur trail (5:58.2 ✓) + comment CTA. Lower-right chip marks the **end-card slot** for the Fable 5 review (5:59→end). |

Takeover coverage: ~107s ≈ 29% of runtime; with the V3 overlay track below, ~95%.

## Overlay track (V3)

One alpha clip per talking-head gap. Drop each on **V3** (above the face, below nothing) at the
timecode, **straight cuts both ends** — every element animates in/out internally and each clip
starts + ends fully transparent, so no dissolves needed. Clips are **silent** (SFX stays yours
via `KS-SFX.fcpxml`). All elements keep the face-safe center (x 540–1380, y 100–860) clear:
case tag top-left, chips/stamps on the right edge, punch-line strips along the bottom.

| # | File | Drop at | Dur | Out at | What plays around the face |
|---|------|---------|-----|--------|----------------------------|
| 1 | `KSO-1.mov` | **0:14.0** | 27.0s | 0:41.0 | `KILL SWITCH · CASE FILE` tag + corner brackets; `12 JUNE · 5:21 PM` chip; strip `EK SWITCH — SAARE AI`; first **SWITCH KA MALIK KAUN?** motif; `3 SAAL` stamp. |
| 2 | `KSO-2.mov` | **0:51.0** | 12.5s | 1:03.5 | `CASE 01 · 72 GHANTE`; strip `SWITCH OFF — YA CONTROL`; rewind stamp `72 GHANTE PEECHE`. |
| 3 | `KSO-3.mov` | **1:15.5** | 45.0s | 2:00.5 | FABLE 5 / MYTHOS 5 chips go **DARK** (red strike); `SIRF OFF` strip; `72 GHANTE LIVE` stamp; `SAFETY BUG?` → **NAHI.** strike; TRUSTED PARTNER + JAILBREAK chips; RESTRICTED doc card; AMAZON reveal chip. |
| 4 | `KSO-4.mov` | **2:08.5** | 19.0s | 2:27.5 | `REFUSED` stamp; `FLAW: "MINOR"` + GPT-5.5 chips; strip `GOVERNMENT NE KHUD HATA DIYA`; `2018 KA KANOON` doc card + `BANA HI NAHI THA` strip. |
| 5 | `KSO-5.mov` | **2:39.5** | 38.8s | 3:18.3 | `NO PUBLIC ACCESS / NO NATIONS / NO ONE` cascade; passport strip; `SAB KE LIYE OFF` stamp; export-rule strip; second **motif**; `ASLI BOMB` stamp; `WAPSI = LICENSE` chip. |
| 6 | `KSO-6.mov` | **3:26.3** | 25.7s | 3:52.0 | Anthropic quote card (`Humein regulate karo…`); `LEVER BAN GAYI` + `HATHIYAR DE DIYA` strips; `WAPAS ON KAISE?` strip; `19 DIN` stamp (pre-laps SwitchBack). |
| 7 | `KSO-7.mov` | **4:04.0** | 39.5s | 4:43.5 | Classifier / govt-terms / Mythos chips; strip `OFF: WASHINGTON · ON: WASHINGTON`; `ONE-TIME STORY?` → **NAHI.**; `25 JUNE / WHITE HOUSE / → OPENAI` cascade; GPT-5.6 + codename chips; `SIRF TRUSTED PARTNERS` strip. |
| 8 | `KSO-8.mov` | **4:52.5** | 13.5s | 5:06.0 | `PATTERN` stamp; strip `EK AI — JISE SWITCH CHHU BHI NAHI SAKTI` (sets up Swarm). |
| 9 | `KSO-9.mov` | **5:18.0** | 34.5s | 5:52.5 | `CHINA — PEHLE SE OPEN` chip; **US AI vs OPEN CHINESE AI** two-cell verdict; `SABSE BADA AD` strip; third **motif**; the answer: `LABS` → **GOVERNMENT** strike. |

**Outro tail:** VO runs to ~6:08 but `KS-Outro.mp4` ends at 6:02.5 — freeze the Outro's final
frame (hold the end card) for the last ~5.5s; no re-render needed.

## Music direction

- One **dark pulse / tension bed** for the whole video, ducked to **10–15%** under VO; swell at
  0:00–0:14, 5:06–5:18, and out over the end card. (The video-edit skill's bundled
  `bg-feelgood-builder.mp3` is the wrong mood — pick a thriller/investigative bed.)
- Clips' baked SFX are accents, not a score.

## Grade notes

- Boards are near-black (`#0A0A0C`) with ONE red accent per frame — don't lift their blacks; pull
  the webcam footage slightly cooler/darker toward them for cohesion.
- Letterbox bars are baked into clips only; the talking head stays full-frame.

## Re-render / tweak

```bash
cd remotion-all && npx remotion render KS-<Scene> "/mnt/f/videoEditing/kill switch/takeovers/KS-<Scene>.mp4"
```

Overlays need the alpha flags (config stays MP4-friendly for takeovers):

```bash
cd remotion-all && npx remotion render KSO-<N> "/mnt/f/videoEditing/kill switch/overlays/KSO-<N>.mov" \
  --image-format=png --pixel-format=yuva444p10le --codec=prores --prores-profile=4444
```

Overlay sources: `remotion-all/src/AIKillSwitch/overlays/O<N>.tsx` (element kit in `overlays/Kit.tsx`).

Pure DOM/canvas — no GL flag needed, ~20–40s per clip. Scene sources:
`remotion-all/src/AIKillSwitch/clips/*.tsx`, engine in `src/AIKillSwitch/mg/`.
The archived 3D variants (in `3d-versions\`) can be mixed in if you ever want one — same
durations and drop-in timecodes.
