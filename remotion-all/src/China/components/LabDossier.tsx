import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { colors, fonts, sides } from "../theme";

type Props = {
  name: string; // lab name (Bebas)
  sub: string; // "CITY · BACKER / PRODUCT" line (Montserrat)
  accent?: string;
  startDelay?: number;
  nameSize?: number;
  children?: React.ReactNode; // hero-stat slot
};

// Center-band reveal card for a lab: name + a city/backer subline + a hero-stat
// slot. Whole block slides up and fades in. Used for the FULL / COMPACT tiers
// (BLINK labs skip this and rely on their node caption + a Badge).
export const LabDossier: React.FC<Props> = ({
  name,
  sub,
  accent = sides.china,
  startDelay = 0,
  nameSize = 120,
  children,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const p = spring({
    frame: frame - startDelay,
    fps,
    config: { damping: 200 },
    durationInFrames: 18,
  });
  const opacity = interpolate(p, [0, 1], [0, 1]);
  const y = interpolate(p, [0, 1], [40, 0]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 24,
        opacity,
        transform: `translateY(${y}px)`,
      }}
    >
      <div
        style={{
          fontFamily: fonts.display,
          fontSize: nameSize,
          lineHeight: 0.95,
          letterSpacing: 3,
          color: "#FFFFFF",
          textShadow: `0 0 ${nameSize * 0.2}px ${accent}66`,
        }}
      >
        {name}
      </div>
      <div
        style={{
          fontFamily: fonts.body,
          fontWeight: 500,
          fontSize: nameSize * 0.26,
          letterSpacing: 4,
          textTransform: "uppercase",
          color: colors.skyLight,
        }}
      >
        {sub}
      </div>
      {children ? (
        <div
          style={{
            marginTop: 18,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 22,
          }}
        >
          {children}
        </div>
      ) : null}
    </div>
  );
};
