import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Trail } from "@remotion/motion-blur";
import { fonts, noir } from "../theme";
import { clamp, rev } from "./motion";

// ---------------------------------------------------------------------------
// Kinetic typography: word-cascade headlines, red marker swipes, strike-and-
// replace. Text never sits under a continuously-animating transform — each
// word's entrance transform reaches identity and locks.
// ---------------------------------------------------------------------------

export const Headline: React.FC<{
  at: number;
  words: string;
  size?: number;
  markWord?: number; // index of the word that gets the red marker slab
  stagger?: number;
  color?: string;
  trail?: boolean; // China-style Trail on the cascade (costly ×8 — hero use only)
}> = ({ at, words, size = 120, markWord, stagger = 5, color = noir.paper, trail }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const list = words.split(" ");
  const body = (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        columnGap: size * 0.28,
        rowGap: size * 0.12,
        maxWidth: 1560,
      }}
    >
      {list.map((wd, i) => {
        const wAt = at + i * stagger;
        const s = spring({ frame: frame - wAt, fps, config: { damping: 16, stiffness: 190 } });
        const p = rev(frame, wAt, 10);
        const marked = markWord === i;
        return (
          <span
            key={i}
            style={{
              position: "relative",
              display: "inline-block",
              fontFamily: fonts.display,
              fontSize: size,
              lineHeight: 1.02,
              letterSpacing: size * 0.09,
              color: marked ? noir.paper : color,
              opacity: clamp(p * 1.6, 0, 1),
              transform: `translateY(${(1 - s) * size * 0.35}px)`,
              filter: p < 1 ? `blur(${5 * (1 - p)}px)` : undefined,
              padding: marked ? `0 ${size * 0.12}px` : undefined,
            }}
          >
            {marked ? <RedMarker at={wAt + 6} /> : null}
            <span style={{ position: "relative" }}>{wd}</span>
          </span>
        );
      })}
    </div>
  );
  if (trail) {
    return (
      <Trail layers={6} lagInFrames={0.12} trailOpacity={0.5}>
        {body}
      </Trail>
    );
  }
  return body;
};

// Red slab swipe behind a word (the kit's Marker, in blood red).
export const RedMarker: React.FC<{ at: number }> = ({ at }) => {
  const frame = useCurrentFrame();
  const p = rev(frame, at, 9);
  return (
    <span
      style={{
        position: "absolute",
        left: 0,
        top: "6%",
        bottom: "2%",
        width: `${p * 100}%`,
        background: noir.red,
        zIndex: 0,
      }}
    />
  );
};

// Strike a phrase through, then stamp the replacement word beneath it.
export const StrikeReplace: React.FC<{
  at: number; // strike frame
  replaceAt: number;
  from: string;
  to: string;
  size?: number;
}> = ({ at, replaceAt, from, to, size = 84 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const strikeP = rev(frame, at, 10);
  const s = spring({ frame: frame - replaceAt, fps, config: { damping: 11, stiffness: 260 } });
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: size * 0.28 }}>
      <span
        style={{
          position: "relative",
          fontFamily: fonts.display,
          fontSize: size,
          color: noir.paper,
          letterSpacing: size * 0.09,
          whiteSpace: "nowrap",
        }}
      >
        {from}
        <span
          style={{
            position: "absolute",
            left: "-2%",
            top: "48%",
            width: `${strikeP * 104}%`,
            height: size * 0.09,
            background: noir.red,
            transform: "rotate(-2deg)",
          }}
        />
      </span>
      {frame >= replaceAt ? (
        <span
          style={{
            fontFamily: fonts.display,
            fontSize: size * 1.25,
            color: noir.red,
            letterSpacing: size * 0.14,
            transform: `scale(${1.5 - 0.5 * s}) rotate(-3deg)`,
            opacity: clamp(s * 1.5, 0, 1),
            border: `${size * 0.06}px solid ${noir.red}`,
            padding: `${size * 0.04}px ${size * 0.3}px`,
          }}
        >
          {to}
        </span>
      ) : null}
    </div>
  );
};
