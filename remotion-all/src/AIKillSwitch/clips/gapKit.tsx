import React from "react";
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { fonts, noir } from "../theme";
import { Board } from "../mg/Board";
import { MoCam, MoKey, MoStage } from "../mg/Stage";
import { EASE, clamp, rev } from "../mg/motion";
import { FlatSwitch, useEnter } from "../mg/Cards";
import { Headline, StrikeReplace } from "../mg/Kinetic";
import { EnterExit, ImpactFlash, Letterbox, Vignette } from "../components/Frame";
import { SfxCue, SfxTrack } from "../components/Sfx";

// ---------------------------------------------------------------------------
// GAP-CLIP KIT — shared scaffold for KS-Gap1..9, the full-screen clips that
// fill every talking-head gap between takeovers (the video is fully faceless).
// Same takeover register (Board / MoStage / Letterbox / EnterExit), but paced
// as the explainer BODY: one station per 6–9s, drift during holds, new element
// at least every ~5s. Beat frames are copied 1:1 from overlays/O1–O9 (the
// word-synced timing source).
// ---------------------------------------------------------------------------

// ---- gapCam: station list → pop-free MoKey list -----------------------------
// camAt() interpolates from the PREVIOUS KEY'S TARGET, so a key must never
// start before the previous key's trans has completed. gapCam guarantees it:
// after each station key it emits a drift key (tiny z push, glide) whose
// trans ends exactly at the next station's depart frame.
export type GapStation = {
  depart: number; // frame the flight to this station starts
  x: number;
  y?: number;
  z?: number;
  trans?: number; // flight length (default 40)
  drift?: number; // extra z during the hold (default 0.028; 0 = dead hold)
  glide?: boolean; // glide easing for the flight (codas); default settle
};

export const gapCam = (first: MoCam, stations: GapStation[], clipDur: number): MoKey[] => {
  const keys: MoKey[] = [{ f: 0, cam: first }];
  stations.forEach((s, i) => {
    const trans = s.trans ?? 40;
    const cam: MoCam = { cx: s.x, cy: s.y ?? 880, z: s.z ?? 1.0 };
    keys.push({ f: s.depart, cam, trans, mode: s.glide ? "glide" : "settle" });
    const holdStart = s.depart + trans;
    const holdEnd = i + 1 < stations.length ? stations[i + 1].depart : clipDur;
    const drift = s.drift ?? 0.028;
    if (holdEnd - holdStart > 12 && drift > 0) {
      keys.push({
        f: holdStart,
        cam: { ...cam, z: cam.z + drift },
        trans: holdEnd - holdStart,
        mode: "glide",
      });
    }
  });
  return keys;
};

// ---- CaseTag: the persistent top-left case chip (letterbox-safe) ------------
export const CaseTag: React.FC<{ kicker: string; label: string; at?: number }> = ({
  kicker,
  label,
  at = 16,
}) => {
  const frame = useCurrentFrame();
  if (frame < at) return null;
  const p = EASE(rev(frame, at, 12));
  return (
    <div
      style={{
        position: "absolute",
        left: 96,
        top: 112,
        display: "flex",
        alignItems: "center",
        gap: 16,
        padding: "12px 24px 10px 18px",
        background: "#101014",
        border: "1px solid #26262E",
        borderLeft: `6px solid ${noir.red}`,
        boxShadow: "0 12px 40px rgba(0,0,0,0.55)",
        opacity: p,
        transform: `translateX(${-24 * (1 - p)}px)`,
        zIndex: 20,
      }}
    >
      <span style={{ fontFamily: fonts.display, fontSize: 32, letterSpacing: 5, color: noir.red }}>
        {kicker}
      </span>
      <span style={{ width: 6, height: 6, background: noir.smoke, borderRadius: 3 }} />
      <span style={{ fontFamily: fonts.display, fontSize: 32, letterSpacing: 5, color: noir.paper }}>
        {label}
      </span>
    </div>
  );
};

// ---- GapClip: the full takeover skeleton, one JSX call ----------------------
export const GapClip: React.FC<{
  cues: SfxCue[];
  cam: MoKey[];
  worldW?: number;
  worldH?: number;
  kicker: string;
  label: string;
  flashes?: number[];
  screen?: React.ReactNode; // screen-fixed lockups (survive camera flights)
  children: React.ReactNode; // world content
}> = ({ cues, cam, worldW = 3200, worldH = 1800, kicker, label, flashes = [], screen, children }) => (
  <AbsoluteFill style={{ backgroundColor: noir.void }}>
    <SfxTrack cues={cues} />
    <EnterExit>
      <Board />
      <MoStage keys={cam} worldW={worldW} worldH={worldH}>
        {children}
      </MoStage>
      {screen}
      <CaseTag kicker={kicker} label={label} />
      <Vignette />
    </EnterExit>
    {flashes.map((f) => (
      <ImpactFlash key={f} at={f} />
    ))}
    <Letterbox />
  </AbsoluteFill>
);

// ---- R: inline red accent ----------------------------------------------------
export const R: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span style={{ color: noir.red }}>{children}</span>
);

// ---- MotifBlock: the recurring "SWITCH KA MALIK KAUN?" refrain ---------------
export const MotifBlock: React.FC<{ at: number }> = ({ at }) => {
  const frame = useCurrentFrame();
  const bar = rev(frame, at + 24, 14);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 22 }}>
      <Headline at={at} words="SWITCH KA MALIK KAUN?" size={132} markWord={3} />
      <div style={{ height: 10, width: 640 * bar, background: noir.red }} />
    </div>
  );
};

// ---- BoardLine: world-hosted punch strip (red tick + Bebas line) -------------
export const BoardLine: React.FC<{ at: number; children: React.ReactNode; size?: number }> = ({
  at,
  children,
  size = 52,
}) => {
  const enter = useEnter(at, 12);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 22,
        padding: "16px 32px 12px 22px",
        background: "#101014",
        border: "1px solid #26262E",
        boxShadow: "0 18px 50px rgba(0,0,0,0.55)",
        ...enter,
      }}
    >
      <div style={{ width: 8, height: size * 0.92, background: noir.red, flexShrink: 0 }} />
      <div
        style={{
          fontFamily: fonts.display,
          fontSize: size,
          letterSpacing: 3.5,
          lineHeight: 1.05,
          color: noir.paper,
          whiteSpace: "nowrap",
        }}
      >
        {children}
      </div>
    </div>
  );
};

// ---- RedSlab: the red answer bar under a headline -----------------------------
export const RedSlab: React.FC<{ at: number; children: React.ReactNode; size?: number }> = ({
  at,
  children,
  size = 60,
}) => {
  const enter = useEnter(at, 12);
  return (
    <div
      style={{
        display: "inline-block",
        background: noir.red,
        color: noir.paper,
        fontFamily: fonts.display,
        fontSize: size,
        letterSpacing: size * 0.12,
        lineHeight: 1,
        padding: `${size * 0.22}px ${size * 0.5}px ${size * 0.14}px`,
        boxShadow: "0 18px 50px rgba(0,0,0,0.5)",
        ...enter,
      }}
    >
      {children}
    </div>
  );
};

// ---- ScreenLine: screen-fixed bottom-center punch line (letterbox-safe) ------
export const ScreenLine: React.FC<{
  at: number;
  out: number;
  children: React.ReactNode;
  size?: number;
}> = ({ at, out, children, size = 44 }) => {
  const frame = useCurrentFrame();
  if (frame < at || frame > out) return null;
  const enter = EASE(rev(frame, at, 11));
  const exit = 1 - rev(frame, out - 10, 10);
  return (
    <AbsoluteFill
      style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 132, zIndex: 20 }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 20,
          padding: "14px 30px 10px 20px",
          background: "#101014",
          border: "1px solid #26262E",
          boxShadow: "0 12px 40px rgba(0,0,0,0.55)",
          opacity: clamp(enter * exit, 0, 1),
          transform: `translateY(${26 * (1 - enter)}px)`,
        }}
      >
        <div style={{ width: 8, height: size * 0.92, background: noir.red, flexShrink: 0 }} />
        <div
          style={{
            fontFamily: fonts.display,
            fontSize: size,
            letterSpacing: 3.5,
            lineHeight: 1.05,
            color: noir.paper,
            whiteSpace: "nowrap",
          }}
        >
          {children}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---- DocCard: paper document card (world version of the overlay DocChip) -----
export const DocCard: React.FC<{ at: number; title: string; tag?: string; w?: number }> = ({
  at,
  title,
  tag = "RESTRICTED",
  w = 400,
}) => {
  const enter = useEnter(at);
  return (
    <div
      style={{
        width: w,
        background: noir.paper,
        boxShadow: "0 22px 60px rgba(0,0,0,0.6)",
        ...enter,
        transform: `${enter.transform} rotate(-2deg)`,
      }}
    >
      <div
        style={{
          background: noir.red,
          color: noir.paper,
          fontFamily: fonts.display,
          fontSize: 26,
          letterSpacing: 8,
          textAlign: "center",
          padding: "9px 0 6px",
        }}
      >
        {tag}
      </div>
      <div style={{ padding: "20px 24px 24px" }}>
        <div
          style={{
            fontFamily: fonts.display,
            fontSize: 42,
            lineHeight: 1.06,
            letterSpacing: 2,
            color: noir.void,
          }}
        >
          {title}
        </div>
        <div style={{ height: 16, width: "86%", background: noir.void, marginTop: 16 }} />
        <div style={{ height: 16, width: "58%", background: noir.void, marginTop: 9 }} />
      </div>
    </div>
  );
};

// ---- QuoteBlock: the quote slab (world version of the overlay QuoteCard) -----
export const QuoteBlock: React.FC<{
  at: number;
  quote: string;
  who?: string;
  w?: number;
  size?: number;
}> = ({ at, quote, who, w = 760, size = 38 }) => {
  const enter = useEnter(at);
  return (
    <div
      style={{
        width: w,
        padding: "26px 36px 24px",
        background: "#131318",
        border: "1px solid #2c2c36",
        borderLeft: `8px solid ${noir.red}`,
        borderRadius: 12,
        boxShadow: "0 18px 50px rgba(0,0,0,0.55)",
        ...enter,
      }}
    >
      <div style={{ fontFamily: fonts.display, fontSize: 72, lineHeight: 0.55, color: noir.red }}>
        &ldquo;
      </div>
      <div
        style={{
          fontFamily: fonts.body,
          fontSize: size,
          fontWeight: 600,
          lineHeight: 1.38,
          color: noir.paper,
          marginTop: 6,
        }}
      >
        {quote}
      </div>
      {who ? (
        <div
          style={{
            fontFamily: fonts.body,
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: 3,
            textTransform: "uppercase",
            color: noir.ash,
            marginTop: 18,
          }}
        >
          <span style={{ color: noir.red }}>—</span> {who}
        </div>
      ) : null}
    </div>
  );
};

// ---- StrikeBlock: entrance-gated strike-and-replace ---------------------------
export const StrikeBlock: React.FC<{
  at: number; // mount + entrance
  strikeAt: number;
  replaceAt: number;
  from: string;
  to: string;
  size?: number;
}> = ({ at, strikeAt, replaceAt, from, to, size = 76 }) => {
  const frame = useCurrentFrame();
  const enter = useEnter(at, 12);
  if (frame < at) return null;
  return (
    <div style={{ ...enter }}>
      <StrikeReplace at={strikeAt} replaceAt={replaceAt} from={from} to={to} size={size} />
    </div>
  );
};

// ---- SlamSwitch: FlatSwitch that spring-slams ON→OFF at a frame ---------------
export const SlamSwitch: React.FC<{ at: number; size?: number }> = ({ at, size = 240 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s =
    frame < at
      ? 0
      : spring({ frame: frame - at, fps, config: { damping: 11, stiffness: 210, mass: 0.6 } });
  return <FlatSwitch flip={s} size={size} hitAt={at} />;
};
