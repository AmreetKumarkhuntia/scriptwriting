import { Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { noise2D } from "@remotion/noise";
import { colors, fonts } from "../theme";

type Props = {
  x: number; // node center x (px, within 1920x1080)
  y: number; // node center y
  name: string; // caption shown below the node once lit
  igniteFrame: number; // frame the "?" resolves into the lab logo
  activeUntil: number; // frame the node dims from "active focus" to "settled"
  logo?: string; // staticFile path; rendered as a white silhouette
  monogram?: string; // fallback shown if no logo
  showCaption?: boolean; // name caption below the node (off when a dossier names it)
  accent?: string;
  size?: number;
};

// A constellation node that starts as an anonymous "?" (carried over from
// Section 1) and ignites into a lit, named core. Three states, driven purely by
// frame: anon -> active (bright, scaled, focused) -> settled (lit but dimmed
// once the focus moves to the next lab). Organic noise wobble like Section 1.
export const IgnitableNode: React.FC<Props> = ({
  x,
  y,
  name,
  igniteFrame,
  activeUntil,
  logo,
  monogram,
  showCaption = true,
  accent = colors.skyLight,
  size = 128,
}) => {
  const frame = useCurrentFrame();

  // Anon nodes fade in at the very start (continuity with Section 1's scatter).
  const intro = interpolate(frame, [0, 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // anon -> active ramp at ignite
  const ignite = interpolate(frame, [igniteFrame, igniteFrame + 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // active -> settled ramp once focus leaves
  const settle = interpolate(frame, [activeUntil, activeUntil + 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Composite "focus" weight: 0 = anon, 1 = active, ~0.55 = settled.
  const focus = ignite - settle * 0.45;

  const wobbleX = noise2D(`node-${x}-x`, frame / 24, 0) * 5;
  const wobbleY = noise2D(`node-${y}-y`, frame / 24, 0) * 5;

  const scale = interpolate(focus, [0, 1], [0.9, 1.12]);
  const opacity = interpolate(focus, [0, 0.55, 1], [0.4, 0.62, 1]) * intro;
  const glow = interpolate(focus, [0, 1], [18, 46]);
  const coreOpacity = ignite; // filled core grows in as "?" fades

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(-50%, -50%) translate(${wobbleX}px, ${wobbleY}px) scale(${scale})`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 14,
        opacity,
      }}
    >
      <div
        style={{
          position: "relative",
          width: size,
          height: size,
          borderRadius: "50%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          border: `3px solid ${accent}`,
          background: `radial-gradient(circle at 50% 35%, ${colors.blueMed}66, ${colors.navy}cc)`,
          boxShadow: `0 0 ${glow}px ${accent}66`,
        }}
      >
        {/* Anonymous "?" — fades out as the node ignites */}
        <span
          style={{
            position: "absolute",
            fontFamily: fonts.display,
            fontSize: size * 0.55,
            color: accent,
            opacity: 1 - coreOpacity,
          }}
        >
          ?
        </span>
        {/* Lab logo (white silhouette) — fades in on ignite. Falls back to a
            white monogram if no logo file is supplied. */}
        {logo ? (
          <Img
            src={staticFile(logo)}
            style={{
              width: size * 0.56,
              height: size * 0.56,
              objectFit: "contain",
              opacity: coreOpacity,
              // Force any source colour to flat white to match the theme.
              filter: `brightness(0) invert(1) drop-shadow(0 0 ${size * 0.12}px ${accent}aa)`,
            }}
          />
        ) : (
          <span
            style={{
              fontFamily: fonts.display,
              fontSize: size * 0.36,
              letterSpacing: 1,
              color: "#FFFFFF",
              opacity: coreOpacity,
              textShadow: `0 0 ${size * 0.18}px ${accent}`,
            }}
          >
            {monogram}
          </span>
        )}
      </div>

      {/* Name caption — appears with ignition (off when a dossier names it) */}
      {showCaption ? (
        <span
          style={{
            fontFamily: fonts.display,
            fontSize: 30,
            letterSpacing: 3,
            color: "#FFFFFF",
            opacity: coreOpacity,
            textShadow: `0 0 14px ${accent}66`,
          }}
        >
          {name}
        </span>
      ) : null}
    </div>
  );
};
