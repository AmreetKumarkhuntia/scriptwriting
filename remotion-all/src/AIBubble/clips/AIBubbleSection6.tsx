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
import { Bubble } from "../components/Bubble";
import { SfxTrack, SfxCue } from "../components/Sfx";

// SECTION 6 — OUTRO · cues 90–94 · 3:40–3:52 · 363 frames @ 30fps.
// Accent coral. The $20/month bubble inflates over the plane, then pops. Close
// the loop and invite the comment.

const CENTER: React.CSSProperties = {
  justifyContent: "center",
  alignItems: "center",
};

const POP_AT = 150; // global frame the bubble bursts

const SFX_CUES: SfxCue[] = [
  { cue: "popIn", at: 22, volume: 0.3 }, // bubble appears
  { cue: "riserBig", at: 84, volume: 0.55 }, // build to the pop
  { cue: "burst", at: POP_AT, volume: 0.75 }, // the POP
  { cue: "whoosh", at: POP_AT + 42 }, // CTA in
  { cue: "ding", at: POP_AT + 100, volume: 0.4 }, // like · subscribe
];

export const AIBubbleSection6: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const fadeOut = interpolate(
    frame,
    [durationInFrames - 18, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // Slow inflate before the pop.
  const inflate = interpolate(frame, [20, POP_AT], [0.9, 1.06], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Quick white flash at the pop.
  const flash = interpolate(frame, [POP_AT, POP_AT + 6, POP_AT + 22], [0, 0.8, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <Plane />
      <SfxTrack cues={SFX_CUES} />
      <AbsoluteFill style={{ opacity: fadeOut }}>
        {/* Bubble + its captions (cues 90–93) */}
        <Sequence durationInFrames={POP_AT + 40}>
          <AbsoluteFill style={{ ...CENTER, gap: 60 }}>
            <div
              style={{
                fontFamily: fonts.body,
                fontWeight: 600,
                fontSize: 40,
                letterSpacing: 4,
                textTransform: "uppercase",
                color: colors.inkSoft,
                opacity: interpolate(frame, [10, 30], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }),
              }}
            >
              aapki AI — subsidised hai
            </div>
            <div style={{ transform: `scale(${inflate})` }}>
              <Bubble
                size={460}
                label="$20 / MONTH"
                tint={signal.bad}
                ring={signal.bad}
                ringWidth={3}
                startDelay={20}
                seed="outro"
                pop={{ at: POP_AT - 20, duration: 24 }}
              />
            </div>
            <Title
              lines={["KISI POINT PAR, KOI SUBSIDY ROK DEGA."]}
              fontSize={52}
              startDelay={96}
            />
          </AbsoluteFill>
        </Sequence>

        {/* White flash at the pop */}
        <AbsoluteFill style={{ background: colors.paper, opacity: flash }} />

        {/* CTA (cues 93–94) */}
        <Sequence from={POP_AT + 40} durationInFrames={durationInFrames - (POP_AT + 40)}>
          <AbsoluteFill style={{ ...CENTER, gap: 34 }}>
            <Title lines={["TAB KYA HOGA?"]} fontSize={120} startDelay={4} />
            <RollingText
              text="comments mein batao — aur saare sources description mein hain"
              startDelay={40}
              stagger={2}
              fontSize={38}
            />
            <div
              style={{
                marginTop: 16,
                fontFamily: fonts.display,
                fontWeight: 600,
                fontSize: 40,
                letterSpacing: 4,
                color: signal.bad,
                opacity: interpolate(frame, [POP_AT + 90, POP_AT + 110], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }),
              }}
            >
              LIKE · SUBSCRIBE
            </div>
          </AbsoluteFill>
        </Sequence>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
