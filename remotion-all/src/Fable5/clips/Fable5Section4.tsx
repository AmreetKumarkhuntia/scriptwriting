import {
  AbsoluteFill,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { colors, fonts } from "../theme";
import { PaperBackground } from "../components/PaperBackground";
import { EditorialTitle } from "../components/EditorialTitle";
import { Lead } from "../components/Lead";
import { SubLine } from "../components/SubLine";
import { GuardrailVault } from "../components/GuardrailVault";
import { ClaudeSpark } from "../components/ClaudeSpark";

// SECTION 4 — OUTRO · cues 47–62 · 2:03–2:42.5 · 1180 frames @ 30fps
// Beats:
//   0–210     "so… is Fable 5 worth it?"
//   210–520   the split: builders → worth it / everyday → Sonnet 5
//   520–760   the bigger story: Mythos still locked
//   760–990   "the version they decided we could handle" → "For now."
//   990–1180  CTA: which wins? comment + subscribe

const CENTER: React.CSSProperties = {
  justifyContent: "center",
  alignItems: "center",
};
const COL: React.CSSProperties = { ...CENTER, flexDirection: "column" };

// Two side-by-side verdict cards that slide in from opposite edges.
const VerdictCard: React.FC<{
  kicker: string;
  title: string;
  sub: string;
  hero: boolean;
  delay: number;
  from: number;
}> = ({ kicker, title, sub, hero, delay, from }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({
    frame: frame - delay,
    fps,
    config: { damping: 18, stiffness: 110 },
    durationInFrames: 22,
  });
  return (
    <div
      style={{
        width: 580,
        padding: "46px 44px",
        borderRadius: 26,
        background: `linear-gradient(180deg, ${colors.paper} 0%, ${colors.paperDeep} 100%)`,
        border: `1.5px solid ${hero ? colors.clay : colors.paperEdge}`,
        boxShadow: hero
          ? `0 26px 54px ${colors.clay}33`
          : `0 18px 40px ${colors.clayDeep}14`,
        display: "flex",
        flexDirection: "column",
        gap: 16,
        alignItems: "flex-start",
        opacity: interpolate(enter, [0, 1], [0, 1]),
        transform: `translateX(${interpolate(enter, [0, 1], [from, 0])}px)`,
      }}
    >
      <span
        style={{
          fontFamily: fonts.label,
          fontWeight: 700,
          fontSize: 24,
          letterSpacing: 4,
          textTransform: "uppercase",
          color: hero ? colors.clay : colors.inkSoft,
        }}
      >
        {kicker}
      </span>
      <span
        style={{
          fontFamily: fonts.display,
          fontWeight: 900,
          fontSize: 60,
          color: colors.ink,
          lineHeight: 1,
          letterSpacing: -1,
        }}
      >
        {title}
      </span>
      <span
        style={{
          fontFamily: fonts.label,
          fontWeight: 400,
          fontSize: 28,
          color: colors.inkSoft,
          lineHeight: 1.32,
        }}
      >
        {sub}
      </span>
    </div>
  );
};

export const Fable5Section4: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const fadeOut = interpolate(
    frame,
    [durationInFrames - 20, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <AbsoluteFill>
      <PaperBackground />

      <AbsoluteFill style={{ opacity: fadeOut }}>
        {/* Beat 1 — the question */}
        <Sequence durationInFrames={210}>
          <AbsoluteFill style={{ ...COL, gap: 24 }}>
            <Lead text="The verdict" delay={6} rule />
            <EditorialTitle
              lines={["So… is Fable 5 worth it?"]}
              fontSize={104}
              startDelay={18}
              stagger={4}
            />
          </AbsoluteFill>
        </Sequence>

        {/* Beat 2 — the split */}
        <Sequence from={210} durationInFrames={310}>
          <AbsoluteFill style={CENTER}>
            <div style={{ display: "flex", gap: 48, alignItems: "stretch" }}>
              <VerdictCard
                kicker="Builders & devs"
                title="Worth it."
                sub="Complex, long-running, agentic coding — the gap is real and it’s not small."
                hero
                delay={10}
                from={-60}
              />
              <VerdictCard
                kicker="Everyday use"
                title="Save your money."
                sub="Writing, email, summaries? Sonnet 5 still wins — at a fraction of the cost."
                hero={false}
                delay={26}
                from={60}
              />
            </div>
          </AbsoluteFill>
        </Sequence>

        {/* Beat 3 — the bigger story */}
        <Sequence from={520} durationInFrames={240}>
          <AbsoluteFill style={{ ...COL, gap: 30 }}>
            <Lead text="But the bigger story" delay={6} />
            <GuardrailVault
              title="MYTHOS 5"
              sub="Still locked"
              startDelay={20}
              width={660}
            />
            <SubLine
              text="Still out there — used by governments & defense contractors."
              delay={72}
              fontSize={40}
            />
          </AbsoluteFill>
        </Sequence>

        {/* Beat 4 — the version we could handle → For now */}
        <Sequence from={760} durationInFrames={230}>
          <AbsoluteFill style={{ ...COL, gap: 26 }}>
            <EditorialTitle
              lines={["Fable 5 is just the version", "they decided we could handle."]}
              fontSize={74}
              startDelay={6}
              stagger={3}
            />
            <EditorialTitle
              lines={["For now."]}
              fontSize={120}
              italic
              color={colors.clay}
              startDelay={72}
              stagger={6}
            />
          </AbsoluteFill>
        </Sequence>

        {/* Beat 5 — CTA */}
        <Sequence from={990} durationInFrames={190}>
          <AbsoluteFill style={{ ...COL, gap: 26 }}>
            <ClaudeSpark size={72} startDelay={2} />
            <EditorialTitle
              lines={["Fable 5, Opus 4.8, or GPT-5.5?"]}
              fontSize={78}
              startDelay={14}
              stagger={3}
            />
            <SubLine
              text="Tell me which wins in the comments — and subscribe for the full breakdown."
              delay={52}
              fontSize={40}
              maxWidth={1300}
            />
          </AbsoluteFill>
        </Sequence>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
