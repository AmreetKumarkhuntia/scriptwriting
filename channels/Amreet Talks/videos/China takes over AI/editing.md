# China Takes Over AI — Editing Spec (Remotion Build)

A motion-graphics build spec. Timings are pulled from `captions.md` (authoritative).
Styling tokens come from `theme.md`. Narrative beats come from `script.md` / `idea.md`.

> This is a spec, not code. It maps every beat of the video to Remotion compositions,
> reusable components, props, and frame ranges so the build step is mechanical.

---

## 1. Global Setup

### Composition config

```
id:               ChinaTakesOverAI
fps:              30
width:            1920
height:           1080
durationInFrames: 18420   // last cue ends 00:10:13,860 → 613.86s × 30 ≈ 18420
```

VO audio runs the full length: `<Audio src={vo} />` mounted at frame 0 in the root.
Captions are rendered on top of everything (see `<CaptionLayer>`).

### Frame math

`frames = round(seconds × 30)`. Conversions used by the beat sheet:

| Time     | Frame |
| -------- | ----- |
| 0:00     | 0     |
| 0:30     | 900   |
| 1:05     | 1950  |
| 2:00     | 3600  |
| 2:50     | 5100  |
| 4:00     | 7200  |
| 5:30     | 9900  |
| 7:00     | 12600 |
| 8:30     | 15300 |
| 10:13.86 | 18420 |

### Design tokens (`src/theme.ts`)

From `theme.md`. Name them so components never hardcode hex.

```ts
export const colors = {
  skyLight: "#ADE1FB", // accents, highlights, "China" / cheaper side
  blueMed:  "#266CA9", // secondary fills, China bars
  royal:    "#0F2573", // US / expensive side, mid backgrounds
  navy:     "#041D56", // panels, gradient top
  midnight: "#01082D", // base background, gradient bottom
};

export const fonts = {
  display: "Bebas Neue", // titles, section headers, stats, country/labels
  body:    "Montserrat",  // explanations, lower-thirds, captions, callouts
};
```

Font usage mirrors `theme.md`: **Bebas Neue** → `<KineticTitle>`, `<SectionHeader>`,
`<StatCounter>` numerals, map/country labels. **Montserrat** → `<BodyText>`,
`<LowerThird>`, `<CaptionLayer>`, callouts (Medium for body, SemiBold for stats labels).

### Background system

`<SceneBackground>` is mounted in every scene:
- Linear gradient `midnight → navy` (top-left to bottom-right).
- Subtle parallax dot/line grid drifting slowly (deterministic, frame-driven — no `Math.random`).
- Optional vignette toward `midnight` at edges to keep text legible.

---

## 2. Reusable Component Library

Build these once in `src/components/`. Each lists props + the Remotion primitive it uses.
All animation is driven by `useCurrentFrame()` + `interpolate`/`spring` (deterministic).

| Component | Props | Animation primitive | Purpose |
| --------- | ----- | ------------------- | ------- |
| `<SceneBackground>` | `accent?` | frame-driven drift | Gradient + grid, every scene |
| `<KineticTitle>` | `lines: string[]`, `stagger?` | `spring` per word, staggered by frame | Bebas word-by-word reveal (hook, section titles) |
| `<SectionHeader>` | `text`, `kicker?` | slide+fade (`interpolate`) | H1/H2 section labels (Bebas) |
| `<StatCounter>` | `to`, `prefix?`, `suffix?`, `label`, `decimals?` | `interpolate` count-up + `spring` pop | Animated numbers (80.2%, $5.55, 4.55T, 113,000, 61%, 12.7×) |
| `<PriceBar>` | `items:{label,value,color,note}[]` | bar-width `interpolate` | Comparison bars (MiniMax vs GPT, etc.) |
| `<VersusCard>` | `left`, `right`, `verdict` | two-panel slide-in | Head-to-head model framing |
| `<ModelGrid>` | `models:{name,logo}[]`, `highlight?` | staggered scale-in | "6 of 6" logos / labs grid |
| `<LogoOrbit>` | `logos[]` | rotation + opacity | Teaser montage of model logos |
| `<ChinaMap>` | `pins:{city,label}[]` | pin drop (`spring`) | Lab origin map (Hangzhou, Beijing) |
| `<LowerThird>` | `title`, `subtitle` | wipe-in strip | Names / cities (Montserrat) |
| `<RisingBar>` | `from`, `to`, `labels` | height `interpolate` | 11% → 54% programming growth |
| `<DonutStat>` | `percent`, `label` | arc sweep (`interpolate`) | OpenRouter 61%, HF 41/36 split |
| `<PlatformVsProduct>` | — | split diagram reveal | "product vs platform" core idea |
| `<LockInDiagram>` | `nodes`, `edges` | edge-draw | Switching-cost / dependency (Cursor→GLM) |
| `<TransitionWipe>` | `dir`, `color` | `@remotion/transitions` | Themed section transitions |
| `<CaptionLayer>` | `captions` | per-cue fade | TikTok-style captions from `captions.md` (`@remotion/captions`), Montserrat |

**Color coding convention** for all comparisons: Chinese models = `skyLight` / `blueMed`,
US models = `royal` / `navy`. Cheaper/winning side gets `skyLight` glow.

**Transitions:** between every top-level `<Sequence>` use `<TransitionWipe>` (~10–15 frame
themed wipe) so cuts raise the next question rather than jarring.

---

## 3. Per-Section Beat Sheet

Each section is a top-level `<Sequence from={..} durationInFrames={..}>`. Inner frames are
relative to the section start.

### SECTION 0 — HOOK · `from={0}` len `900` (0:00–0:30) · cues 1–10

| Inner frame | Cue | On screen | Components |
| ----------- | --- | --------- | ---------- |
| 0–90   | 1 | "CHINA JUST TOOK OVER AI." slams in word-by-word | `<KineticTitle>` |
| 90–180 | 2 | Strike-through "not OpenAI / not Anthropic" logos greyed; "China" in `skyLight` | `<LogoOrbit>` (greyed) |
| 180–360| 3–5 | "APRIL 2026" stamp; "6 OF 6" stat slam; MiniMax/DeepSeek/Kimi logos | `<StatCounter to={6} suffix="/6">`, `<ModelGrid highlight>` |
| 360–700| 6–9 | Versus framing: Chinese vs most-powerful; question stinger "HOW? WHAT? WHY?" | `<VersusCard>`, `<KineticTitle>` |
| 700–900| 10 | "LET'S START" beat → wipe into Section 1 | `<TransitionWipe>` |

Palette: midnight base, `skyLight` for China emphasis, `royal` for US side.

### SECTION 1 — WHAT ACTUALLY CHANGED · `from={857}` len `~1093` (0:30–1:05) · cues 11–32

| Inner frame | Cue | On screen | Components |
| ----------- | --- | --------- | ---------- |
| 0–180   | 11–14 | "THE OLD ASSUMPTION: SMARTEST MODEL WINS" header | `<SectionHeader kicker>` |
| 180–420 | 15–18 | Chatbot icon morphs into "INFRASTRUCTURE" (agents, autonomous workflows, background reasoning) | animated icon morph |
| 420–600 | 19–20 | "THOUSANDS OF CALLS / DAY" count-up | `<StatCounter to={1000} suffix="+/day">` |
| 600–760 | 21–23 | Price line graph spikes ("skyrocketed") | `<RisingBar>` / line graph |
| 760–1093| 24–32 | `<PriceBar>`: MiniMax M2.5 80.2% @ 30¢ vs GPT-5.5 88.7% @ $5.55 → "17× MORE EXPENSIVE FOR 8%"; then DeepSeek V4 Flash 14¢ / Step 3.5 Flash 10¢ "50× CHEAPER" callout | `<PriceBar>`, `<StatCounter>` |

### SECTION 2 — WHO ARE THE PLAYERS · `from={1950}` len `~1650` (1:05–2:00) · cues 33–64

China map intro, then lab cards animate in one by one, each with a `<LowerThird>` and a
`<StatCounter>` for its headline number.

| Inner frame | Cue | Lab card | Stat |
| ----------- | --- | -------- | ---- |
| 0–150    | 33–37 | "SAME 12-MONTH WINDOW · SAME STRATEGY" + `<ChinaMap>` | — |
| 150–420  | 58–63 | **DeepSeek** / Hangzhou — quant fund High-Flyer | V4 Pro ≈ Gemini 3.1 Pro on SWE-Bench |
| 420–650  | 64    | **Moonshot AI** / Beijing | Kimi K2.6: first open-weight to beat GPT-5.4, 2M context |
| 650–880  | 68–74 | **Zhipu (Z.ai)** | GLM-5.1: 8×H100, MIT license, listed HKEX 2026 |
| 880–1120 | 75–80 | **MiniMax** | most-used on OpenRouter 1 week, 4.55T tokens / 7 days |
| 1120–1380| 81–84 | **Alibaba Qwen3.7 Max** | top SWE-Bench, 13× cheaper than Claude Opus 4.7 |
| 1380–1650| 84–87 | **StepFun** Step 3.5 Flash | 10¢/M, ~50× cheaper than GPT-5.5 |

> Note on cue ordering: the VO front-loads the "same window / who are these people" framing
> (cues 50–57) before naming labs (58+). Place the map/strategy beat over cues 50–57 and start
> the lab cards at cue 58. Each lab card uses `<ModelGrid>`-style scale-in with `<LowerThird>`.

### SECTION 3 — WHY OPEN SOURCE · `from={3600}` len `~1500` (2:00–2:50) · cues 88–123

| Inner frame | Cue | On screen | Components |
| ----------- | --- | --------- | ---------- |
| 0–300    | 88–96 | "DIFFERENT LABS, ONE MOVE: OPEN THE MODELS" | `<SectionHeader>`, `<ModelGrid>` |
| 300–650  | 104–108 | **PRODUCT (US) vs PLATFORM (China)** split diagram | `<PlatformVsProduct>` |
| 650–1000 | 109–119 | Ecosystem compounding: devs → startups → fine-tunes feeding back; "free eval + red-teaming from community" | `<LockInDiagram>` (build-up) |
| 1000–1500| 120–123 | "113,000+ QWEN DERIVATIVES > GOOGLE + META COMBINED" count-up | `<StatCounter to={113000}>` |

Palette: platform side `skyLight`/`blueMed`, product side `royal`/`navy`.

### SECTION 4 — FALLOUT / STAKES + DATA · `from={5100}` len `~7320` (2:50–~7:00) · cues 124–209

This is the long data + stakes stretch. Anchor the data visuals to their cues:

| Inner frame (≈) | Cue | On screen | Components |
| --------------- | --- | --------- | ---------- |
| 0–300    | 124–132 | Lock-in: "BUILD ON IT → CAN'T SWITCH"; battle = "DEFAULT PLATFORM" not smartest | `<LockInDiagram>` |
| 300–650  | 136–140 | Cursor Composer → fine-tuned on GLM-5.1 dependency arrow | `<LockInDiagram>` (Cursor node) |
| 650–1500 | 146–152 | **OpenRouter: 61% of tokens Chinese** donut; "USAGE 12.7× YoY" | `<DonutStat percent={61}>`, `<StatCounter to={12.7} suffix="×">` |
| 1500–2100| 154–157 | Programming **11% → 54%** of OpenRouter usage rising bar | `<RisingBar from={11} to={54}>` |
| 2100–2700| 166–171 | **Hugging Face: 41% Chinese vs 36% US** downloads split | `<DonutStat>` ×2 / split bar |
| 2700–3600| 172–185 | "GOOD NEWS, BUT…" turn; AI decides what to show → foundation decisions everywhere | `<KineticTitle>`, motif graphics |
| 3600–4600| 196–205 | Scale example: 113K Qwen versions → thousands of tools/agents; **Huawei / 5G analogy** motif | `<ModelGrid>`, analogy split |
| 4600–7320| 206–209 | "NOT CABLES. NOT TOWERS. INTELLIGENCE." build toward the close | `<KineticTitle>` |

> The middle is data-dense — keep one stat on screen at a time, count-ups synced to the cue
> where the number is spoken, then hold. Use `<TransitionWipe>` between each data block.

### SECTION 5 — CLOSE · `from={12420}` len `~6000` (~7:00–10:13) · cues 209–239

| Inner frame (≈) | Cue | On screen | Components |
| --------------- | --- | --------- | ---------- |
| 0–1500   | 209–215 | One-line summary: "NOT THE SMARTEST. THE DEFAULT." Frontier still GPT-5.5 / Claude | `<KineticTitle>`, `<VersusCard>` |
| 1500–3500| 216–226 | Recap montage of the 3 strategy pillars: OPEN WEIGHTS · AGGRESSIVE PRICING · GLOBAL DISTRIBUTION; "6 of 6 = a signal" | `<ModelGrid>`, `<SectionHeader>` |
| 3500–5200| 227–234 | Question card: "WHAT ARE YOU BUILDING ON?" + "links in description" | `<KineticTitle>`, `<LowerThird>` |
| 5200–6000| 235–239 | End card: subscribe + next-video teaser, logo bug | end-card composition |

Final frame must equal **18420** (cue 239 ends 00:10:13,860).

---

## 4. Asset Checklist

**Logos:** OpenAI, Anthropic/Claude, GPT-5.5, DeepSeek, Moonshot/Kimi, Zhipu/GLM (Z.ai),
MiniMax, Alibaba/Qwen, StepFun, Hugging Face, OpenRouter, Cursor, Google, Meta, Huawei.

**Other art:** US flag, China flag, China map (with Hangzhou + Beijing pins).

**Fonts:** Bebas Neue, Montserrat (Medium + SemiBold) — load via `@remotion/google-fonts`
or `staticFile` per the remotion-best-practices media guide.

**Audio:** final voiceover track (matches `captions.md` timing), mounted at frame 0.

**Captions:** parse `captions.md` SRT cues → `<CaptionLayer>` (Montserrat, theme colors).

---

## 5. Build Notes / Conventions

- One `<Sequence>` per section; nest inner beats as child `<Sequence>`s or frame-gated
  components. Prefer composition-over-duration (remotion-best-practices).
- Everything deterministic: no `Date.now()` / unseeded `Math.random()`.
- All colors/fonts via `theme.ts` tokens — never hardcode hex in components.
- When building, consult the `remotion-best-practices` skill and the
  `mcp__remotion__remotion-documentation` tool for `interpolate`/`spring`/`@remotion/transitions`
  and `@remotion/captions` specifics.
