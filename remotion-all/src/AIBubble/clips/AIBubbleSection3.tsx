import {
  AbsoluteFill,
  interpolate,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { colors, signal, fonts } from "../theme";
import { Plane } from "../components/Plane";
import { Title } from "../components/Title";
import { RollingText } from "../components/RollingText";
import { BurnStack } from "../components/BurnStack";
import { Bubble } from "../components/Bubble";
import { SfxTrack, SfxCue } from "../components/Sfx";

// SECTION 3 — THE BURN · cues 47–62 · 1:58–2:36 · 1148 frames @ 30fps.
// Accent amber/coral. Clearly-labelled speculation: OpenAI's burn, then the
// contrast — Amazon built assets it owned; OpenAI's product costs more the more
// it's used.

const CENTER: React.CSSProperties = {
  justifyContent: "center",
  alignItems: "center",
};

const SFX_CUES: SfxCue[] = [
  { cue: "alert", at: 4, volume: 0.35 }, // speculation warning
  { cue: "whoosh", at: 185 }, // → the burn
  { cue: "fire", at: 205, loop: true, durationInFrames: 430, volume: 0.22 }, // burn ambience
  { cue: "alert", at: 305, volume: 0.3 }, // losses
  { cue: "money", at: 465 }, // must raise $100B
  { cue: "impact", at: 648 }, // "PATTERN ALARMING"
  { cue: "popIn", at: 790 }, // Amazon bubble
  { cue: "popIn", at: 840 }, // OpenAI bubble
  { cue: "impact", at: 1064 }, // re-hook
];

const StatChip: React.FC<{
  lead: string;
  value: string;
  color: string;
  appearAt: number;
}> = ({ lead, value, color, appearAt }) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [appearAt, appearAt + 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const y = interpolate(frame, [appearAt, appearAt + 14], [18, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        opacity: o,
        transform: `translateY(${y}px)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 10,
        minWidth: 280,
      }}
    >
      <div
        style={{
          fontFamily: fonts.body,
          fontWeight: 600,
          fontSize: 26,
          letterSpacing: 5,
          textTransform: "uppercase",
          color: colors.inkSoft,
        }}
      >
        {lead}
      </div>
      <div
        style={{
          fontFamily: fonts.display,
          fontWeight: 700,
          fontSize: 84,
          letterSpacing: -2,
          color,
        }}
      >
        {value}
      </div>
    </div>
  );
};

const ContrastBubble: React.FC<{
  size: number;
  label: string;
  caption: string;
  tint: string;
  startDelay: number;
  seed: string;
}> = ({ size, label, caption, tint, startDelay, seed }) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 26,
        width: 560,
      }}
    >
      <Bubble
        size={size}
        label={label}
        tint={tint}
        ring={tint}
        startDelay={startDelay}
        seed={seed}
      />
      <div
        style={{
          fontFamily: fonts.body,
          fontWeight: 600,
          fontSize: 34,
          color: colors.ink,
          textAlign: "center",
          maxWidth: 480,
          lineHeight: 1.25,
          opacity: interpolate(frame, [startDelay + 16, startDelay + 30], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        {caption}
      </div>
    </div>
  );
};

export const AIBubbleSection3: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const fadeOut = interpolate(
    frame,
    [durationInFrames - 18, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <AbsoluteFill>
      <Plane />
      <SfxTrack cues={SFX_CUES} />
      <AbsoluteFill style={{ opacity: fadeOut }}>
        {/* Beat 1 — speculation label (cues 47–49) */}
        <Sequence durationInFrames={185}>
          <AbsoluteFill style={CENTER}>
            <div
              style={{
                padding: "40px 56px",
                borderRadius: 24,
                border: `2px dashed ${signal.warn}`,
                background: `${signal.warn}10`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 22,
              }}
            >
              <Title lines={["AAGE SE — SPECULATION."]} fontSize={78} color={signal.warnDeep} />
              <RollingText
                text="leaked reports · main khud verify nahi kar sakta"
                startDelay={30}
                stagger={3}
                fontSize={34}
              />
            </div>
          </AbsoluteFill>
        </Sequence>

        {/* Beat 2 — the burn (cues 49–56) */}
        <Sequence from={185} durationInFrames={435}>
          <AbsoluteFill style={{ ...CENTER, gap: 56 }}>
            <BurnStack startDelay={20} burnDuration={380} tiles={18} columns={6} />
            <div style={{ display: "flex", gap: 80, alignItems: "flex-start" }}>
              <StatChip lead="Losses / yr" value="TENS OF $B" color={signal.bad} appearAt={120} />
              <StatChip lead="Profitable" value="2030" color={colors.ink} appearAt={200} />
              <StatChip lead="Must raise" value="$100B" color={signal.warnDeep} appearAt={280} />
            </div>
          </AbsoluteFill>
        </Sequence>

        {/* Beat 3 — even if half true (cues 56–57) */}
        <Sequence from={620} durationInFrames={150}>
          <AbsoluteFill style={{ ...CENTER, gap: 18 }}>
            <Title lines={["EVEN IF AADHA SACH HO —"]} fontSize={78} startDelay={6} />
            <Title
              lines={["PATTERN ALARMING HAI."]}
              fontSize={92}
              color={signal.bad}
              startDelay={28}
            />
          </AbsoluteFill>
        </Sequence>

        {/* Beat 4 — the contrast (cues 57–61) */}
        <Sequence from={770} durationInFrames={290}>
          <AbsoluteFill style={{ ...CENTER, gap: 70, flexDirection: "row" }}>
            <ContrastBubble
              size={300}
              label="AMAZON"
              caption="warehouses banaye — jo uske KHUD ke the"
              tint={signal.good}
              startDelay={20}
              seed="amazon"
            />
            <ContrastBubble
              size={300}
              label="OpenAI"
              caption="product jitna use ho, utna MEHENGA"
              tint={signal.bad}
              startDelay={70}
              seed="openai-burn"
            />
          </AbsoluteFill>
        </Sequence>

        {/* Beat 5 — re-hook (cue 62) */}
        <Sequence from={1060} durationInFrames={88}>
          <AbsoluteFill style={CENTER}>
            <Title lines={["YE EK ALAG HI PROBLEM HAI."]} fontSize={84} startDelay={4} />
          </AbsoluteFill>
        </Sequence>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
