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
import { WorldAnchor } from "../components/WorldAnchor";
import { Bubble } from "../components/Bubble";
import { Title } from "../components/Title";
import { PointsList } from "../components/PointsList";
import { SfxTrack, SfxCue } from "../components/Sfx";
import { SURVIVORS, WIDE, focus, MapNode } from "../world/economyMap";

// SECTION 5 — THE VERDICT · cues 74–89 · 3:02–3:40 · 1142 frames @ 30fps.
// The payoff fly-over: the camera glides across the survivor map, tagging each
// player SAFE / SURPRISE / RISK, then pulls back over the whole populated plane.

const CENTER: React.CSSProperties = {
  justifyContent: "center",
  alignItems: "center",
};

const CAM: CamKey[] = [
  { f: 0, cam: WIDE },
  { f: 150, cam: focus(SURVIVORS.nvidia.x, SURVIVORS.nvidia.y, 1.0, 320) },
  { f: 356, cam: focus(SURVIVORS.cloud.x, SURVIVORS.cloud.y, 1.0, 320) },
  { f: 570, cam: focus(SURVIVORS.anthropic.x, SURVIVORS.anthropic.y, 1.0, 300) },
  { f: 784, cam: focus(SURVIVORS.openai.x, SURVIVORS.openai.y, 0.95, 330) },
  { f: 1010, cam: { ...WIDE, z: 0.46 } }, // pull back over the whole map
];

const SFX_CUES: SfxCue[] = [
  { cue: "swoosh", at: 2 }, // the question
  { cue: "whoosh", at: 150 }, // → NVIDIA
  { cue: "ding", at: 200 }, // SAFE
  { cue: "whoosh", at: 356 }, // → cloud
  { cue: "ding", at: 406 }, // SAFE
  { cue: "whoosh", at: 570 }, // → Anthropic
  { cue: "ding", at: 620 }, // SURPRISE
  { cue: "whoosh", at: 784 }, // → OpenAI
  { cue: "alert", at: 834, volume: 0.4 }, // MOST AT RISK
  { cue: "riser", at: 1005, volume: 0.45 }, // build into the spine
  { cue: "impact", at: 1090 }, // "EK HI DIRECTION"
];

const SurvivorNode: React.FC<{
  node: MapNode;
  label: string;
  tag: string;
  tagColor: string;
  lines: string[];
  bubbleDelay: number;
  tagAt: number;
  seed: string;
  tint: string;
}> = ({ node, label, tag, tagColor, lines, bubbleDelay, tagAt, seed, tint }) => {
  const frame = useCurrentFrame();
  const reveal = interpolate(frame, [tagAt, tagAt + 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: node.x,
          top: node.y,
          transform: "translate(-50%, -50%)",
        }}
      >
        <Bubble
          size={node.r * 2}
          label={label}
          tint={tint}
          ring={tagColor}
          ringWidth={3}
          startDelay={bubbleDelay}
          seed={seed}
        />
      </div>
      <WorldAnchor x={node.x} y={node.y + node.r + 26} width={760}>
        <div
          style={{
            opacity: reveal,
            transform: `translateY(${interpolate(reveal, [0, 1], [16, 0])}px)`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 16,
          }}
        >
          <div
            style={{
              padding: "8px 26px",
              borderRadius: 999,
              background: tagColor,
              color: colors.paper,
              fontFamily: fonts.display,
              fontWeight: 600,
              fontSize: 34,
              letterSpacing: 2,
            }}
          >
            {tag}
          </div>
          {lines.map((l) => (
            <div
              key={l}
              style={{
                fontFamily: fonts.body,
                fontWeight: 600,
                fontSize: 34,
                color: colors.ink,
                textAlign: "center",
              }}
            >
              {l}
            </div>
          ))}
        </div>
      </WorldAnchor>
    </>
  );
};

export const AIBubbleSection5: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const fadeOut = interpolate(
    frame,
    [durationInFrames - 18, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // Map dims to a faint backdrop for the closing overlay (stays visible behind).
  const worldOpacity = interpolate(frame, [1005, 1050], [1, 0.16], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <Plane />
      <SfxTrack cues={SFX_CUES} />
      <AbsoluteFill style={{ opacity: fadeOut }}>
        {/* ---- MOVING WORLD: the survivor map ---- */}
        <AbsoluteFill style={{ opacity: worldOpacity }}>
          <CameraStage keyframes={CAM}>
            <SurvivorNode
              node={SURVIVORS.nvidia}
              label="NVIDIA"
              tag="SAFE"
              tagColor={signal.good}
              tint={signal.good}
              lines={["real revenue · real margins"]}
              bubbleDelay={40}
              tagAt={200}
              seed="nvidia"
            />
            <SurvivorNode
              node={SURVIVORS.cloud}
              label="AWS · AZURE · GCP"
              tag="SAFE"
              tagColor={signal.good}
              tint={signal.good}
              lines={["enterprise contracts", "profitable parents"]}
              bubbleDelay={60}
              tagAt={406}
              seed="cloud"
            />
            <SurvivorNode
              node={SURVIVORS.anthropic}
              label="ANTHROPIC"
              tag="SURPRISE"
              tagColor={signal.neutral}
              tint={signal.neutral}
              lines={["first profitable quarter", "mid-2026"]}
              bubbleDelay={80}
              tagAt={620}
              seed="anthropic"
            />
            <SurvivorNode
              node={SURVIVORS.openai}
              label="OpenAI"
              tag="MOST AT RISK"
              tagColor={signal.bad}
              tint={signal.bad}
              lines={["biggest brand · biggest burn", "most exposed · no hardware moat"]}
              bubbleDelay={100}
              tagAt={834}
              seed="openai-risk"
            />
            {/* application layer — small, doomed, sits low */}
            <div
              style={{
                position: "absolute",
                left: SURVIVORS.apps.x,
                top: SURVIVORS.apps.y,
                transform: "translate(-50%, -50%)",
              }}
            >
              <Bubble
                size={SURVIVORS.apps.r * 2}
                label="APP LAYER"
                tint={signal.bad}
                ring={`${signal.bad}66`}
                startDelay={120}
                seed="apps"
              />
            </div>
          </CameraStage>
        </AbsoluteFill>

        {/* ---- SCREEN OVERLAYS ---- */}

        {/* Beat 1 — the question (cues 74–75) */}
        <Sequence durationInFrames={150}>
          <AbsoluteFill style={CENTER}>
            <Title lines={["TO KAUN SURVIVE KAREGA?"]} fontSize={96} />
          </AbsoluteFill>
        </Sequence>

        {/* Beat 6 — honest caveat + the verifiable spine (cues 88–89) */}
        <Sequence from={1005} durationInFrames={137}>
          <AbsoluteFill style={{ ...CENTER, gap: 40 }}>
            <Title lines={["MAIN GALAT HO SAKTA HOON —"]} fontSize={64} startDelay={4} />
            <PointsList
              items={["PRICING GAP", "CHINA PRESSURE", "INFRA WALL"]}
              startDelay={28}
              stagger={12}
              fontSize={58}
              accent={signal.bad}
              align="center"
            />
            <Title
              lines={["sab EK HI DIRECTION mein."]}
              fontSize={56}
              color={signal.bad}
              startDelay={80}
            />
          </AbsoluteFill>
        </Sequence>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
