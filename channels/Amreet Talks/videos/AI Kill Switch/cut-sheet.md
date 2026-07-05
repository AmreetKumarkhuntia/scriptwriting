# AI Kill Switch — Motion-Graphics Cut Sheet (v3 — FULLY FACELESS)

**The video is 100% motion graphics** — the talking head is never shown. 19 clips cover the
whole 0:00–6:08 timeline back-to-back on V2: the 10 original takeovers + 9 new `KS-Gap`
explainer clips filling every gap. The VO comes from the source cut's audio only.

**VO source:** `F:\highlights\AI Talks\kill switch.mp4` (6:08, audio track only)
**Takeovers:** `F:\videoEditing\kill switch\takeovers\` — 10 × MP4, 1920×1080 @ 30fps, h264
**Gap clips:** `F:\videoEditing\kill switch\gaps\` — 9 × MP4, same format
**Look:** GOV-NOIR RED — designed boards (big type, dossier cards, stamps, server racks,
draw-on strings) with a camera flying station → station. Letterbox bars on every clip.
Takeovers = dense hooks (~3–4s per station); gap clips = the explainer body (~6–9s per
station, camera drifting through the holds, a new element landing every few seconds).

## How to assemble (Resolve)

- **Fastest path:** import `F:\videoEditing\kill switch\takeovers\KS-SFX.fcpxml`
  (File → Import → Timeline). It IS the whole assembly now: all 19 clips on the video track
  at the exact offsets below, zero gaps, plus every SFX hit as its own audio clip on the
  lanes underneath (levels pre-set). Add the VO (source cut audio) + music bed, **mute the
  clips' baked audio**, done.
- Manual alternative: drop each clip on V2 at the timecode below, **straight cuts both
  ends** — every clip has a baked entrance (push-in resolve) and exit (blur + dip), so the
  junctions read as edited, not pasted.
- Each clip carries its own quiet baked SFX (~-12 dB under VO); keep or mute per taste —
  the editable per-hit versions live in the FCPXML / [`sfx-track.md`](sfx-track.md).
- 30fps clips on a 60fps timeline is fine.
- Beats land on the exact spoken words (from `captions.md`); ±0.5s slip is fine everywhere.
  Trim **tails**, not heads.

## Drop-in table — 19 clips, 0:00 → 6:08.0, no gaps

| # | File | Drop at | Dur | Out at | What it shows |
|---|------|---------|-----|--------|---------------|
| 1 | `takeovers\KS-ColdOpen.mp4` | **0:00.0** | 14.0s | 0:14.0 | THE HOOK: "12 JUNE · 5:21 PM" → Commerce letter → app-window wall around the rocker switch — **SLAMS OFF**, windows die → **KILL SWITCH** lockup. |
| 2 | `gaps\KS-Gap1.mp4` | **0:14.0** | 27.0s | 0:41.0 | CASE FILE opens: date panel + letter card → "EK SWITCH — **SAARE AI**" wired switch-fan (Fable/Mythos/GPT chips) → motif #1 **SWITCH KA MALIK KAUN?** → `3 SAAL` stamp. |
| 3 | `takeovers\KS-SealDrop.mp4` | **0:41.0** | 10.0s | 0:51.0 | GOOGLE vs ANTHROPIC vs OPENAI bracket → giant **U.S. GOVERNMENT stamp slams** across it → "ASLI PLAYER: GOVERNMENT". |
| 4 | `gaps\KS-Gap2.mp4` | **0:51.0** | 12.5s | 1:03.5 | The fork: "SWITCH OFF — YA **CONTROL**" two-panel choice → CCW rewind clock + `72 GHANTE PEECHE` stamp. |
| 5 | `takeovers\KS-Timeline.mp4` | **1:03.5** | 12.0s | 1:15.5 | Dated-spine flight: 9 JUNE launch → 12 JUNE letter → globe dies → pull back: **72 GHANTE** counter. |
| 6 | `gaps\KS-Gap3.mp4` | **1:15.5** | 45.0s | 2:00.5 | The longest case: FABLE 5 + MYTHOS 5 server racks go **DARK** → "SIRF OFF" → `72 GHANTE LIVE` → **PEHLI BAAR** → "SAFETY BUG?" struck → **NAHI.** → jailbreak demo wall (RESTRICTED doc) → **AMAZON** reveal + string stub. |
| 7 | `takeovers\KS-Network.mp4` | **2:00.5** | 8.0s | 2:08.5 | Evidence board: AMAZON→WHITE HOUSE strings light up → David Sacks card. |
| 8 | `gaps\KS-Gap4.mp4` | **2:08.5** | 19.0s | 2:27.5 | Refusal chain: ANTHROPIC file takes **REFUSED** stamp → 'FLAW: "MINOR"' → GPT-5.5 replicates → "GOVERNMENT NE KHUD HATA DIYA" → `2018 KA KANOON` doc → "BANA HI NAHI THA" → coda over the chain. |
| 9 | `takeovers\KS-Vault.mp4` | **2:27.5** | 12.0s | 2:39.5 | Export-law exhibit wall: missile + chip blueprints → chatbot in the crosshair frame → globe **DENIED**. |
| 10 | `gaps\KS-Gap5.mp4` | **2:39.5** | 38.8s | 3:18.3 | Blast radius: NO PUBLIC / NO NATIONS / **NO ONE** cascade → passports struck ("NAHI HO SAKTA") → **DotField world ignites red** under `SAB KE LIYE OFF` → motif #2 → `ASLI BOMB` + **WAPSI = LICENSE** seal panel. |
| 11 | `takeovers\KS-StampGate.mp4` | **3:18.3** | 8.0s | 3:26.3 | RE-EXPORT LICENSE takes "GRANTED — SHARTON PE" → Palantir card tears off → **LEVER** stamp. |
| 12 | `gaps\KS-Gap6.mp4` | **3:26.3** | 25.7s | 3:52.0 | The irony exhibit: framed Anthropic quote ("Humein regulate karo…") → "WAHI LINE → **LEVER** BAN GAYI" + switch slams → "SAFETY NE BACHAYA NAHI — **HATHIYAR DE DIYA**" → "SWITCH **WAPAS ON** KAISE HUA?" → `19 DIN` stamp. |
| 13 | `takeovers\KS-SwitchBack.mp4` | **3:52.0** | 12.0s | 4:04.0 | The spine returns: 19-DIN bracket → 1 JULY station, switch slams **ON** → 99%+ gauge → MYTHOS 5 behind barrier tape. |
| 14 | `gaps\KS-Gap7.mp4` | **4:04.0** | 39.5s | 4:43.5 | Comeback terms stack → "**OFF: WASHINGTON · ON: WASHINGTON** — DONO BAAR" → "ONE-TIME STORY?" → **NAHI.** → DO HAFTE BAAD + 25 JUNE / WHITE HOUSE / **→ OPENAI** cascade → GPT-5.6 + codenames **unredact** (SOL · TERRA · LUNA) → TRUSTED PARTNERS ONLY tape. |
| 15 | `takeovers\KS-OrderVsRequest.mp4` | **4:43.5** | 9.0s | 4:52.5 | Comparison board: LEGAL ORDER stamp vs "SIRF EK REQUEST" note → puppet strings pull taut → "DO COMPANIES · DO HAFTE · EK HAATH". |
| 16 | `gaps\KS-Gap8.mp4` | **4:52.5** | 13.5s | 5:06.0 | ANTHROPIC + OPENAI case cards take one **PATTERN** stamp → "EK AI — JISE SWITCH CHHU BHI **NAHI** SAKTI" + one chip stays lit (Swarm tease). |
| 17 | `takeovers\KS-Swarm.mp4` | **5:06.0** | 12.0s | 5:18.0 | The showstopper: plug **YANKS** → zoom out to the weight-matrix, **red ignition wave** → MISTRAL / CHINA chips. |
| 18 | `gaps\KS-Gap9.mp4` | **5:18.0** | 34.5s | 5:52.5 | The verdict: CHINA — PEHLE SE OPEN → **US AI vs OPEN CHINESE AI** split board (crossed-out switch) → "SABSE BADA **AD**" → "COMPANY VS COMPANY? **AB NAHI**" → motif #3 → **LABS struck → GOVERNMENT** stamped over the coda pull-back. |
| 19 | `takeovers\KS-Outro.mp4` | **5:52.5** | 15.5s | **6:08.0** | Switch flips OFF ("off unhone kiya") and ON ("on unhone kiya") → board clears → **"SWITCH KISKE PAAS?"** + comment CTA + end-card chip — **holds to 6:08.0** (extended; no freeze-frame needed). |

The `SWITCH KA MALIK KAUN?` motif recurs at 0:32 / 3:06 / 5:44 — the video's refrain.

## Music direction

- One **dark pulse / tension bed** for the whole video, ducked to **10–15%** under VO; swell at
  0:00–0:14, 5:06–5:18, and out over the end card. (Pick a thriller/investigative bed — the
  video-edit skill's bundled feel-good track is the wrong mood.)
- Baked/FCPXML SFX are accents, not a score.

## Grade notes

- Boards are near-black (`#0A0A0C`) with ONE red accent per frame — don't lift the blacks.
- Letterbox bars are baked into every clip; nothing else needs cropping.

## Re-render / tweak

```bash
cd remotion-all
npx remotion render KS-<Scene>  "/mnt/f/videoEditing/kill switch/takeovers/KS-<Scene>.mp4"
npx remotion render KS-Gap<N>   "/mnt/f/videoEditing/kill switch/gaps/KS-Gap<N>.mp4"
```

Pure DOM/canvas — no GL flag needed. Sources: takeovers in
`remotion-all/src/AIKillSwitch/clips/*.tsx`, gap clips in `clips/Gap1..9.tsx` (shared
scaffold `clips/gapKit.tsx`), engine in `src/AIKillSwitch/mg/`. After changing any
`SfxTrack` or drop offset, regenerate the SFX timeline:
`python3 scripts/killswitch_sfx_fcpxml.py "/mnt/f/videoEditing/kill switch/takeovers/KS-SFX.fcpxml" "channels/Amreet Talks/videos/AI Kill Switch/sfx-track.md"`.

## Archived alternates

- `takeovers\3d-versions\` — the earlier 3D takeover renders (same durations/timecodes).
- `overlays\` + `KSO-1..9` comps — transparent ProRes overlays that float graphics AROUND a
  visible talking head. Superseded by the faceless cut; keep only if a face-visible version
  is ever wanted.
