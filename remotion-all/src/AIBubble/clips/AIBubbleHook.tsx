import {
  AbsoluteFill,
  interpolate,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { colors, signal, fonts } from "../theme";
import { Plane } from "../components/Plane";
import { CameraStage, CamKey } from "../components/CameraStage";
import { Bubble } from "../components/Bubble";
import { Title } from "../components/Title";
import { RollingText } from "../components/RollingText";
import { SfxTrack, SfxCue } from "../components/Sfx";

// HOOK — THE GAP · cues 1–11 · 0:00–0:27 · 807 frames @ 30fps.
// The camera drifts in over the empty plane; two bubbles rise — COST vs PRICE —
// and a gap opens between them. Tease only (no hard $ yet). Ends on the re-hook.

const CENTER: React.CSSProperties = {
  justifyContent: "center",
  alignItems: "center",
};

// World anchors for the two bubbles + the gap between them.
const COST_X = 1360;
const PRICE_X = 1840;
const ROW_Y = 900;

const CAM: CamKey[] = [
  { f: 0, cam: { cx: 1600, cy: ROW_Y, z: 0.62 } },
  { f: 150, cam: { cx: 1600, cy: ROW_Y, z: 0.82 } }, // push in as bubbles form
  { f: 620, cam: { cx: 1600, cy: ROW_Y, z: 0.82 } }, // hold
  { f: 700, cam: { cx: 1600, cy: ROW_Y, z: 0.6 } }, // pull back for re-hook
];

const SFX_CUES: SfxCue[] = [
  { cue: "swoosh", at: 2 }, // opening title
  { cue: "popIn", at: 152 }, // COST bubble
  { cue: "popIn", at: 172 }, // PRICE bubble
  { cue: "alert", at: 332, volume: 0.3 }, // gap reveal
  { cue: "riser", at: 610, volume: 0.4 }, // build to re-hook
  { cue: "whoosh", at: 690 }, // re-hook title
];

const WorldBubble: React.FC<{
  x: number;
  y: number;
  size: number;
  label: string;
  tint: string;
  startDelay: number;
  seed: string;
}> = ({ x, y, size, label, tint, startDelay, seed }) => (
  <div
    style={{ position: "absolute", left: x, top: y, transform: "translate(-50%, -50%)" }}
  >
    <Bubble size={size} label={label} tint={tint} startDelay={startDelay} seed={seed} />
  </div>
);

export const AIBubbleHook: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const fadeOut = interpolate(
    frame,
    [durationInFrames - 18, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // World clears just before the re-hook title takes over.
  const worldOpacity = interpolate(frame, [630, 690], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <Plane />
      <SfxTrack cues={SFX_CUES} />
      <AbsoluteFill style={{ opacity: fadeOut }}>
        {/* ---- MOVING WORLD ---- */}
        <AbsoluteFill style={{ opacity: worldOpacity }}>
          <CameraStage keyframes={CAM}>
            <WorldBubble
              x={COST_X}
              y={ROW_Y}
              size={360}
              label="COST"
              tint={signal.bad}
              startDelay={150}
              seed="cost"
            />
            <WorldBubble
              x={PRICE_X}
              y={ROW_Y}
              size={360}
              label="PRICE"
              tint={colors.blue}
              startDelay={170}
              seed="price"
            />

            {/* The gap marker between them (world space) */}
            <div
              style={{
                position: "absolute",
                left: 1600,
                top: ROW_Y,
                transform: "translate(-50%, -50%)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 14,
                opacity: interpolate(frame, [330, 360], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }),
              }}
            >
              <div
                style={{
                  width: 0,
                  height: 150,
                  borderLeft: `3px dashed ${signal.bad}`,
                }}
              />
              <div
                style={{
                  fontFamily: fonts.body,
                  fontWeight: 700,
                  fontSize: 30,
                  letterSpacing: 6,
                  color: signal.bad,
                }}
              >
                GAP
              </div>
            </div>
          </CameraStage>
        </AbsoluteFill>

        {/* ---- SCREEN OVERLAYS ---- */}

        {/* Beat 1 — opening line (cues 1–2) */}
        <Sequence durationInFrames={150}>
          <AbsoluteFill style={{ ...CENTER, gap: 28 }}>
            <Title lines={["MUJHE AAPKO", "EK MATH DIKHANI HAI"]} fontSize={104} />
            <RollingText
              text="complicated nahi — bas wo jo koi bolna nahi chahta"
              startDelay={36}
              stagger={3}
              fontSize={36}
            />
          </AbsoluteFill>
        </Sequence>

        {/* Beat 3 — name the gap (cues 6–8), below the bubbles */}
        <Sequence from={330} durationInFrames={300}>
          <AbsoluteFill
            style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 120 }}
          >
            <Title
              lines={["EK GAP — BAHUT BADA."]}
              fontSize={76}
              color={signal.bad}
              startDelay={6}
            />
            <div style={{ height: 18 }} />
            <RollingText
              text="aur koi ise har mahine bhar raha hai"
              startDelay={120}
              stagger={3}
              fontSize={36}
            />
          </AbsoluteFill>
        </Sequence>

        {/* Beat 5 — re-hook (cues 10–11) */}
        <Sequence from={690} durationInFrames={117}>
          <AbsoluteFill style={{ ...CENTER, gap: 24 }}>
            <Title
              lines={["EK DIN YE RUK JAYEGA.", "TAB KYA?"]}
              fontSize={108}
              startDelay={6}
              stagger={5}
            />
          </AbsoluteFill>
        </Sequence>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
