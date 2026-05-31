---
name: motion-graphics-clips
description: Building and editing animated motion-graphics clips for the scriptwriting YouTube videos in remotion-all/ — the reusable component library, the 2D camera pan/zoom (CameraStage), the node-ignite "constellation", logo handling, and the captions→frame beat-sheet workflow. Use when creating or editing any src/<Video>/clips/*.tsx clip.
metadata:
  tags: remotion, motion-graphics, video, china-ai, camera, constellation, logos
---

## When to use

Use when building or editing the animated full-screen clips in
`remotion-all/src/<Video>/` (e.g. `src/China/`). This is the **project-specific craft**:
how clips are structured, the shared components, the camera/constellation patterns, and the
gotchas learned building "China Takes Over AI". For generic Remotion API knowledge use the
`remotion-best-practices` skill; for the visual design language see `motion-graphics-guide.md`.

## Project layout

- `remotion-all/src/<Video>/clips/*.tsx` — one Composition per script **section** (full-screen
  segment dropped over recorded footage). 1920×1080 @ 30fps.
- `remotion-all/src/<Video>/components/*.tsx` — the reusable animated components below.
- `remotion-all/src/<Video>/theme.ts` — `colors`, `sides`, `signal`, `fonts` tokens. **Never
  hardcode hex** — import tokens.
- `remotion-all/src/<Video>/index.tsx` — registers each clip as a `<Composition>`.
- `remotion-all/src/index.ts` → `Root.tsx` — the render entry / composition registry.
- `remotion-all/public/logos/*.svg` — brand logos (see Logos below).

## Workflow (beat sheet → clip)

1. **Timing is authoritative from `captions.md`** (SRT cues), not from `editing.md` (which can be
   stale). Convert: `frames = round(seconds × 30)`. Map each VO cue to a clip-absolute frame and
   build a per-beat table before coding. Honour the **actual VO pacing** — uneven cue lengths
   should drive uneven beat treatment (full reveal vs quick blink), don't force a uniform rhythm.
2. One `<Composition>` per section; `durationInFrames` = last cue end × 30. Top-level structure:
   `<AbsoluteFill>` → `<SceneBackground/>` → a global `fadeOut` `<AbsoluteFill>` → one
   `<Sequence from={..} durationInFrames={..}>` per beat (inner frames reset to 0 per Sequence,
   so child `startDelay`s are beat-relative).
3. **Deterministic only**: no `Math.random` / `Date.now`. Use `@remotion/noise` `noise2D(seed,
   frame/k, 0)` for organic drift, and always `interpolate(..., {extrapolateLeft:"clamp",
   extrapolateRight:"clamp"})`.
4. **Verify by rendering stills** at each beat boundary, then look at them:
   `npx remotion still src/index.ts <CompId> /tmp/x.png --frame=N` (run from `remotion-all/`).
   Always `npx tsc --noEmit` clean. Scrub in `npx remotion studio` for motion.

## Reusable component library (`src/China/components/`)

- **`SceneBackground`** — gradient + noise-drifting dot grid + vignette. Mount once per clip,
  fixed (not panned).
- **`KineticTitle`** `{lines[], fontSize, startDelay, stagger, accent}` — Bebas word-by-word
  spring-pop. Titles, section headers, re-hooks.
- **`StatCounter`** `{to, prefix, suffix, decimals, label, startDelay, countDuration, fontSize,
  color, accent, entrance:"pop"|"slide", heroFont:"display"|"heavy", lead, labelWeight,
  labelColor}` — animated count-up hero number. Use `signal.good` (green) for China/cheap wins.
- **`RollingText`** `{text, startDelay, stagger, fontSize, color, weight}` — Montserrat word
  roll-up. Sub-captions / one-liners.
- **`PointsList`** `{items[], startDelay, stagger, fontSize, accent}` — staggered bullet reveal.
- **`StrikeWord`** `{text, delay, fontSize}` — word + red strike-bar (a killed idea).
- **`ComparisonBarChart`** `{bars:{label,value,side}[], maxValue, format, ...}` — color by
  meaning (green=cheap/good, red=expensive). Prefer `StatCounter` if a single number reads better.
- **`Badge`** `{text, color, startDelay, fontSize}` — small Montserrat pill (license / ranking
  tags).
- **`GpuRow`** `{count, startDelay, label}` — chips lighting up (e.g. "8× H100").
- **`Trail`** (`@remotion/motion-blur`) — wrap a title for the ghosted re-hook look.
- **`PathDraw`** (`src/shared/effects/`) — `evolvePath` stroke-in for diagrams.

## Pattern: node-ignite "constellation" (`IgnitableNode` + `Constellation`)

For "who are the players" reveals. `IgnitableNode` `{x, y, name, logo, monogram, igniteFrame,
activeUntil, size, showCaption}` starts as an anonymous **"?"** and **ignites** into a lit core /
logo. Three frame-driven states: **anon → active** (bright, scaled, focused at `igniteFrame`) →
**settled** (dimmed once focus moves on at `activeUntil`). `Constellation` holds the node list
(`LAB_NODES` with positions + `igniteFrame`), draws **converge lines** to a center point, and
reveals a thesis word (e.g. **OPEN**) at `convergeStart`. Pays off a Section-1 cliffhanger of
anonymous nodes.

## Pattern: 2D camera fly-around (`CameraStage` + `WorldAnchor`)

Make a section feel like **one big canvas with a moving camera** (fly/zoom to each subject, then
pull back). Place content in a **WORLD** larger than the viewport (e.g. 3200×1800); the camera is
just a transform on the world container:

```
transformOrigin: "0 0";
transform: `translate(960px,540px) scale(z) translate(${-cx}px,${-cy}px)`
// world point (x,y) → screen (960 + z*(x-cx), 540 + z*(y-cy))
```

- **`CameraStage`** `{keyframes:{f,cam:{cx,cy,z}}[], transitionFrames}` — `camAt(frame)` finds the
  active keyframe and **eases from the previous target over `transitionFrames`, then holds**
  (hold-then-move; do NOT linearly lerp across far-apart keys or it drifts forever). Bezier ease.
- **Focus** a subject: `cx,cy = node + (0,+dy)` so it sits in the upper third with its info below;
  `z ≈ 1.15`. **Wide**: world center, `z ≈ 0.5`.
- **`WorldAnchor`** `{x,y,children}` — hangs a subject's info column centered below its node in
  world space so the **info travels with the camera**. Mount per-beat via `<Sequence layout="none">`
  *inside* `CameraStage` so it pans; keep full-frame text moments (intro / interlude / synthesis /
  re-hook) as **screen overlays outside** `CameraStage`.
- Bump node/hero sizes (~2×) since they're viewed small at wide zoom and large at focus.
- Keep `SceneBackground` fixed (un-panned) for a calm backdrop.

## Logos

White monochrome logos read best on the dark/cyan theme and dodge sourcing-color issues:
- Fetch into `public/logos/` (transparent SVG preferred):
  - simpleicons: `curl https://cdn.simpleicons.org/<slug>/white` (deepseek, baidu, alibabacloud,
    qwen, minimax, bytedance, …).
  - LobeHub (covers AI-lab/model marks simpleicons lacks):
    `https://unpkg.com/@lobehub/icons-static-svg@latest/icons/<slug>.svg` (kimi, moonshot, zhipu,
    stepfun, …).
- Render with `<Img src={staticFile("logos/x.svg")} style={{ filter:"brightness(0) invert(1)",
  objectFit:"contain" }}/>` — forces any source colour to flat white. **Transparent bg required**
  (a solid bg → white box). Verify each via a still. Fallback: a white Bebas **monogram**.

## Gotchas / rules learned

- **Text collisions:** never place a node caption (or any label) over a centered dossier/title;
  keep the center band clear. When info "travels with the node", turn node captions off
  (`showCaption={false}`) so the dossier names it.
- **Zoom magnifies text:** at focus `z`, dossier fonts grow — reduce font sizes, and for the
  **tallest** beat (many rows) zoom out a touch + lower the focus center so the bottom line stays
  on screen (e.g. Zhipu used `z:0.9, dy:300` vs the default `z:1.15, dy:230`).
- **Sequence inside a transformed world**: use `layout="none"` so it doesn't inject an extra
  full-size wrapper.
- **Re-hook every section** with a chained question (Hinglish, MrBeast/MKBHD energy) and a `Trail`
  title; fade the world out (`opacity` interpolate) just before the title takes over.
- Keep counts consistent across sections (if Section 1 says "EIGHT" and shows 8 nodes, Section 2
  must resolve 8 — flag mismatches when labs are added/removed).

## Verification recipe

```
cd remotion-all
npx tsc --noEmit                                   # must be clean
npx remotion still src/index.ts <CompId> /tmp/f<N>.png --frame=<N>   # eyeball each beat
npx remotion studio                                # scrub motion + transitions
```
Render stills at: each beat's mid-point, the focus/wide transitions, and the finale converge.
