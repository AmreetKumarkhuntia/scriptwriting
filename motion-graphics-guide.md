---
name: motion-graphics-guide
description: How we build motion-graphics clips for these videos in Remotion — project structure, the reusable component library, the beat-based section pattern, hard-won Remotion gotchas, and the visual/craft design language. Use whenever creating or editing animated graphics in remotion-all/.
metadata:
  tags: remotion, motion-graphics, video, animation, design
---

# Motion Graphics Guide

How animated graphics are built for these videos. The graphics live in the **`remotion-all/`**
Remotion project; each video gets its own folder under `remotion-all/src/<VideoName>/` (e.g.
`src/China/`). This guide is the craft layer on top of the generic
[remotion-best-practices](.agents/skills/remotion-best-practices/SKILL.md) skill — read that for
raw Remotion API knowledge; read this for *how we use it here*.

> Companion docs: [`research-framework.md`](research-framework.md) (sourcing),
> [`scripting-framework.md`](scripting-framework.md) (writing + re-hooks + tone). The motion
> graphics serve the script — never the other way around.

## When to use

Whenever you're asked to create or fix the on-screen graphics for a video — a section clip, a
chart, a title card, a stat callout. Start here, then reuse the component library before writing
anything new.

## Project structure

```
remotion-all/
  src/
    Root.tsx                     # registers every <Composition>
    <VideoName>/                 # one folder per video, e.g. China/
      index.tsx                  # exports a <...Compositions/> fragment of this video's clips
      theme.ts                   # palette (colors), semantic colors (signal), fonts, sides
      clips/                     # ONE composition per script section
        ChinaHook.tsx            # Section 0 / hook
        ChinaSection1.tsx        # Section 1, etc.
      components/                # reusable animated building blocks (shared across clips)
```

- **One clip = one script section.** Frame ranges are pinned to the section's `captions.md` cue
  timestamps so the clip can be dropped onto the editor timeline over the recorded audio.
- Register each clip in `Root.tsx` (via the video's `index.tsx`) with a stable `id`
  (`China-Section1`), `1920×1080`, `30fps`, and `durationInFrames` = the section's cue span.
- **On-screen numbers come from `script.md`** (the canonical narrative), *not* `captions.md`
  (auto-transcription drifts — e.g. it says "$5.55" where the script says "$5").

## The beat-based section pattern

Every section clip is one composition built as an ordered list of timed "beats":

```tsx
export const ChinaSectionN: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const fadeOut = interpolate(frame, [durationInFrames - 18, durationInFrames], [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill>
      <SceneBackground />
      <AbsoluteFill style={{ opacity: fadeOut }}>
        <Sequence durationInFrames={75}>{/* Beat 1 */}</Sequence>
        <Sequence from={75} durationInFrames={210}>{/* Beat 2 */}</Sequence>
        {/* … */}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
```

- `SceneBackground` underneath everything; a **global fade-out** over the final ~18 frames.
- Each beat is a `<Sequence>` centered with `AbsoluteFill style={{ justifyContent:"center",
  alignItems:"center" }}` (a shared `CENTER` style helps).
- Beats map 1:1 to script lines; comment each beat with its cue range + relative frames.
- Tune frame ranges against `captions.md`; treat the first pass as approximate.

## Component library (`src/<VideoName>/components/`)

Reuse these before building anything new. All animate purely off `useCurrentFrame`.

- **`SceneBackground`** — full-screen themed gradient + slow drifting dot grid + vignette.
  Deterministic (no `Math.random`/`Date.now`).
- **`KineticTitle`** — word-by-word Bebas reveal with a spring pop. Props: `lines`, `fontSize`,
  `stagger`, `startDelay`, `color`, `accent` (glow). For titles, questions, re-hooks.
- **`StatCounter`** — big count-up number + optional label. Props:
  - `entrance`: `"pop"` (bouncy scale, default — used by the hook) | `"slide"` (smooth rise).
  - `heroFont`: `"display"` (Bebas, default) | `"heavy"` (Montserrat 800) — the editorial look.
  - `lead` (small light qualifier above, e.g. "UP TO"), `prefix`/`suffix` (attach to number),
    `label` + `labelWeight`/`labelColor` (sub-line; go light 300 + muted for callouts).
  - `to`, `decimals`, `countDuration`, `startDelay`, `color`, `accent`.
- **`ComparisonBarChart`** — vertical bars comparing labeled values. All bars share one bottom
  axis baseline; model names sit in a row below; `axisTitle` renders *below* the chart. Colors
  by `side` (`"china"` | `"us"`) using the `signal` palette. Props: `bars`, `maxValue`,
  `format`, `decimals`, `startDelay`, `stagger`, `height`, `barWidth`, `axisTitle`.
- **`PointsList`** — staggered bullet reveal (accent marker + word). For "where X is used" beats.
- **`RollingText`** — word-by-word **roll-up** (each word masked in `overflow:hidden`, inner span
  `translateY 100%→0`). For subtitles / supporting lines under a title.
- **`StrikeWord`** — a word that fades in, then a red bar wipes through it. For dead/old ideas
  ("JUST A CHATBOT", "WHICH IS THE BEST MODEL?").

## Remotion patterns & gotchas (learned the hard way)

- **Animate with `useCurrentFrame` + `interpolate` + `spring` only.** No CSS transitions/
  animations, no Tailwind animation classes — they don't render.
- **`<Sequence from={N}>` defaults to absolute layout pinned top-left.** If a delayed child must
  inherit the parent's flex centering, add **`layout="none"`** (or wrap its content in its own
  centered `AbsoluteFill`).
- **Late-mounting sequences cause layout reflow / "jump".** When a `<Sequence from={N}>` mounts a
  new item into a centered flex column, the column re-centers and everything above it jumps. Fix:
  **don't wrap in a late `<Sequence>` — render the component from frame 0 and use its own
  `startDelay`** so its box reserves space immediately. Our components clamp opacity/value/spring
  for negative local frames, so an early mount is invisible until its delay.
- **Entrance feel:** `slide` = damped spring (`{ damping: 200 }`, no overshoot) — matches
  `KineticTitle`/`PointsList`; `pop` = bouncy (`{ damping: 12, stiffness: 120 }`). Pick one and
  stay consistent within a beat.
- **Bar charts:** anchor bars to a single bottom axis (`alignItems:flex-end` + a `borderBottom`),
  put labels in a separate row *below* the axis, and the axis title below that. Don't nest the
  label inside the bar column — it breaks the shared baseline.

## Visual & craft design language

- **Brand palette is blue** (see the video's `theme.md` / `theme.ts`): sky-light accents, medium/
  royal/navy/midnight. **Bebas Neue** = display (titles, stats), **Montserrat** = body.
- **Semantic color only on data.** Bars and callout *numbers* may go **green** (China / cheaper /
  win) or **red** (the expensive incumbent) via the `signal` palette. The background, titles, and
  body text stay blue — color is a *highlight*, not a theme change.
- **Typographic hierarchy = the number is the hero.** Hero numbers heavy (Montserrat 800);
  framing words ("up to", "cheaper", sub-labels) light (Montserrat 300) and muted. Big heavy
  figure, small light qualifiers.
- **Motion vocabulary:** roll-up (`RollingText`) for supporting lines; strike-through
  (`StrikeWord`) for ideas being killed; a drawn **arrow** for "X → Y" transitions; staggered
  pop-in for sets of items/nodes.
- **Don't spoil the next section.** If a later section is the payoff (e.g. "who are these labs?"),
  tease with **anonymous markers** (glowing "?" nodes), not the named reveal.
- **Re-hooks:** every section's last beat is a question that sets up the next section. Energy is
  punchy (MrBeast/MKBHD) — short lines, strong contrast — per `scripting-framework.md`.

## Verification

- **Preview:** `cd remotion-all && npm run dev` → open the composition in Studio, scrub beat by
  beat. Check entrances, that nothing jumps/reflows, that numbers count to the script values, and
  that delayed elements stay centered.
- **Lint/typecheck:** `npm run lint` (`eslint src && tsc`) must pass clean.
- **Optional render:** `npx remotion still <id> --frame=<n> --scale=0.5` or
  `npx remotion render <id>` to spot-check at full res.
- Re-check any shared component's *other* call sites after editing it (e.g. changing
  `StatCounter` defaults could affect the hook).
