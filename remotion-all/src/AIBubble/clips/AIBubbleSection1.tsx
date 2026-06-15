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
import { Title } from "../components/Title";
import { RollingText } from "../components/RollingText";
import { StatCounter } from "../components/StatCounter";
import { GapChasm } from "../components/GapChasm";
import { MoneyFlow } from "../components/MoneyFlow";
import { StrikeWord } from "../components/StrikeWord";
import { SfxTrack, SfxCue } from "../components/Sfx";

// SECTION 1 — THE SUBSIDY · cues 12–30 · 0:27–1:15 · 1456 frames @ 30fps.
// Camera flies from the subscription math (cost $60 vs price $20 → $40 gap) over
// to the funders (Microsoft, Amazon) streaming money into the AI companies.

const CENTER: React.CSSProperties = {
  justifyContent: "center",
  alignItems: "center",
};

const MATH_X = 1150;
const FUND_X = 2150;

const CAM: CamKey[] = [
  { f: 0, cam: { cx: 1600, cy: 900, z: 0.55 } },
  { f: 200, cam: { cx: MATH_X, cy: 920, z: 0.92 } }, // the math
  { f: 700, cam: { cx: FUND_X, cy: 900, z: 0.84 } }, // the funders
  { f: 1000, cam: { cx: 1600, cy: 900, z: 0.6 } }, // pull wide
];

const SFX_CUES: SfxCue[] = [
  { cue: "swoosh", at: 2 }, // title
  { cue: "whoosh", at: 200 }, // camera → the math
  { cue: "money", at: 250 }, // token stat
  { cue: "alert", at: 452, volume: 0.35 }, // $60 cost (expensive)
  { cue: "impact", at: 496 }, // the $40 GAP stinger
  { cue: "whoosh", at: 700 }, // camera → funders
  { cue: "money", at: 720 }, // Microsoft → OpenAI
  { cue: "money", at: 825 }, // Amazon → Anthropic
  { cue: "alert", at: 1012, volume: 0.35 }, // "conspiracy" strike
  { cue: "riser", at: 1170, volume: 0.4 }, // build to re-hook
  { cue: "whoosh", at: 1215 }, // re-hook
];

const WorldCaption: React.FC<{ text: string; appearAt: number }> = ({
  text,
  appearAt,
}) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        fontFamily: fonts.body,
        fontWeight: 600,
        fontSize: 34,
        letterSpacing: 5,
        textTransform: "uppercase",
        color: colors.inkSoft,
        opacity: interpolate(frame, [appearAt, appearAt + 10], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
      }}
    >
      {text}
    </div>
  );
};

export const AIBubbleSection1: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const fadeOut = interpolate(
    frame,
    [durationInFrames - 18, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // World clears before the strategy + re-hook overlays take the screen.
  const worldOpacity = interpolate(frame, [965, 1010], [1, 0], {
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
            {/* MATH region */}
            <WorldAnchor x={MATH_X} y={420} width={900}>
              <WorldCaption text="CLAUDE OPUS · 1 POWER USER" appearAt={210} />
              <div style={{ height: 24 }} />
              <StatCounter
                to={2}
                suffix="M"
                startDelay={232}
                countDuration={24}
                fontSize={150}
                color={colors.ink}
                label="tokens / month"
                labelColor={colors.inkSoft}
              />
              <div style={{ height: 60 }} />
              <GapChasm cost={60} price={20} startDelay={430} />
            </WorldAnchor>

            {/* FUNDERS region */}
            <WorldAnchor x={FUND_X} y={470} width={1200}>
              <WorldCaption text="GAP KAUN BHARTA HAI?" appearAt={690} />
              <div style={{ height: 70 }} />
              <MoneyFlow
                from="MICROSOFT"
                to="OpenAI"
                amount="$13B+"
                color={colors.blue}
                startDelay={715}
              />
              <div style={{ height: 60 }} />
              <MoneyFlow
                from="AMAZON"
                to="Anthropic"
                amount="$4B"
                color={signal.good}
                startDelay={820}
              />
            </WorldAnchor>
          </CameraStage>
        </AbsoluteFill>

        {/* ---- SCREEN OVERLAYS ---- */}

        {/* Beat 1 — verify (cues 12–14) */}
        <Sequence durationInFrames={205}>
          <AbsoluteFill style={{ ...CENTER, gap: 28 }}>
            <Title lines={["JO MAIN", "VERIFY KAR SAKTA HOON"]} fontSize={100} />
            <RollingText
              text="har AI company apni API pricing publicly publish karti hai"
              startDelay={36}
              stagger={3}
              fontSize={36}
            />
          </AbsoluteFill>
        </Sequence>

        {/* Beat 5 — strategy, not conspiracy (cues 25–27) */}
        <Sequence from={1000} durationInFrames={205}>
          <AbsoluteFill style={{ ...CENTER, gap: 40 }}>
            <StrikeWord text="CONSPIRACY?" delay={10} fontSize={96} />
            <Title lines={["NAHI — STRATEGY."]} fontSize={104} startDelay={40} />
            <RollingText
              text="aapko dependent banao, economics baad mein dekho"
              startDelay={70}
              stagger={3}
              fontSize={36}
            />
          </AbsoluteFill>
        </Sequence>

        {/* Beat 6 — re-hook (cues 28–30) */}
        <Sequence from={1215} durationInFrames={241}>
          <AbsoluteFill style={CENTER}>
            <Title
              lines={["JAB 'LATER' AAYEGA —", "TAB KYA?"]}
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
