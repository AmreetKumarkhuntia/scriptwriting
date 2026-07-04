import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { fonts, noir } from "../theme";

// ---------------------------------------------------------------------------
// DOM typography kit. All text lives OUTSIDE the 3D canvas and enters with a
// rise + blur-resolve AFTER the camera settles — never under an animating
// transform (pixel-stability law). One red accent per frame.
// ---------------------------------------------------------------------------

// Shared entrance: opacity + resolving blur + short rise. Returns style.
export const useReveal = (at: number, dur = 12) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [at, at + dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return {
    opacity: t,
    filter: t < 1 ? `blur(${6 * (1 - t)}px)` : undefined,
    transform: `translateY(${18 * (1 - t)}px)`,
  } as const;
};

export const NoirTitle: React.FC<{
  at: number;
  children: React.ReactNode;
  size?: number;
  color?: string;
  tracking?: number;
  style?: React.CSSProperties;
}> = ({ at, children, size = 132, color = noir.paper, tracking = 14, style }) => {
  const reveal = useReveal(at);
  return (
    <div
      style={{
        fontFamily: fonts.display,
        fontSize: size,
        color,
        letterSpacing: tracking,
        lineHeight: 1.02,
        textAlign: "center",
        ...reveal,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export const Sub: React.FC<{
  at: number;
  children: React.ReactNode;
  size?: number;
  color?: string;
  weight?: number;
  style?: React.CSSProperties;
}> = ({ at, children, size = 30, color = noir.ash, weight = 500, style }) => {
  const reveal = useReveal(at);
  return (
    <div
      style={{
        fontFamily: fonts.body,
        fontSize: size,
        fontWeight: weight,
        color,
        letterSpacing: 4,
        textTransform: "uppercase",
        textAlign: "center",
        ...reveal,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

// Timestamp super — "12 JUNE 2026 · 5:21 PM" — the dated-timeline rule on screen.
export const DateSuper: React.FC<{
  at: number;
  children: React.ReactNode;
  pos?: React.CSSProperties;
}> = ({ at, children, pos }) => {
  const reveal = useReveal(at, 10);
  return (
    <div
      style={{
        position: "absolute",
        left: 96,
        bottom: 132,
        display: "flex",
        alignItems: "center",
        gap: 18,
        ...pos,
        ...reveal,
      }}
    >
      <div style={{ width: 10, height: 34, background: noir.red }} />
      <div
        style={{
          fontFamily: fonts.display,
          fontSize: 44,
          color: noir.paper,
          letterSpacing: 6,
        }}
      >
        {children}
      </div>
    </div>
  );
};

// Attribution / label chip on paper — "PER FORTUNE", "DAVID SACKS".
export const PaperChip: React.FC<{
  at: number;
  children: React.ReactNode;
  accent?: boolean;
  style?: React.CSSProperties;
}> = ({ at, children, accent = false, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - at, fps, config: { damping: 14, stiffness: 130 } });
  if (frame < at) return null;
  return (
    <div
      style={{
        display: "inline-block",
        transform: `scale(${0.7 + 0.3 * s})`,
        opacity: Math.min(1, s * 1.4),
        background: accent ? noir.red : noir.paper,
        color: accent ? noir.paper : noir.void,
        fontFamily: fonts.body,
        fontWeight: 700,
        fontSize: 24,
        letterSpacing: 3,
        textTransform: "uppercase",
        padding: "10px 22px",
        ...style,
      }}
    >
      {children}
    </div>
  );
};

// Classified-dossier redaction bar that unredacts (wipes away) to reveal text.
export const Redacted: React.FC<{
  at: number; // frame the black bar starts wiping off
  children: React.ReactNode;
  size?: number;
  color?: string;
}> = ({ at, children, size = 56, color = noir.paper }) => {
  const frame = useCurrentFrame();
  const wipe = interpolate(frame, [at, at + 14], [0, 102], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <span
      style={{
        position: "relative",
        display: "inline-block",
        fontFamily: fonts.display,
        fontSize: size,
        color,
        letterSpacing: 6,
        padding: "0 10px",
      }}
    >
      {children}
      <span
        style={{
          position: "absolute",
          top: 2,
          bottom: 2,
          left: `${wipe}%`,
          right: 0,
          background: "#000",
          border: `1px solid ${noir.steel}`,
          display: wipe >= 101 ? "none" : "block",
        }}
      />
    </span>
  );
};

// Monotonic counter — physically cannot tick backward (running max inside).
export const MonoCounter: React.FC<{
  at: number;
  to: number;
  dur?: number;
  suffix?: string;
  size?: number;
  color?: string;
}> = ({ at, to, dur = 26, suffix = "", size = 150, color = noir.paper }) => {
  const frame = useCurrentFrame();
  const raw = interpolate(frame, [at, at + dur], [0, to], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const shown = Math.floor(Math.max(0, raw)); // monotonic by construction
  const reveal = useReveal(at, 8);
  return (
    <div
      style={{
        fontFamily: fonts.display,
        fontSize: size,
        color,
        letterSpacing: 4,
        fontVariantNumeric: "tabular-nums",
        ...reveal,
        transform: undefined, // counters don't ride the rise — stay planted
      }}
    >
      {shown}
      {suffix}
    </div>
  );
};
