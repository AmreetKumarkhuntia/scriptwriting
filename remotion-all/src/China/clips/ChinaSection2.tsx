import {
  AbsoluteFill,
  interpolate,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Trail } from "@remotion/motion-blur";
import { colors, sides, signal } from "../theme";
import { SceneBackground } from "../components/SceneBackground";
import {
  Constellation,
  LAB_NODES,
  LabNode,
} from "../components/Constellation";
import {
  CameraStage,
  CamKey,
  WORLD_CX,
  WORLD_CY,
} from "../components/CameraStage";
import { WorldAnchor } from "../components/WorldAnchor";
import { LabDossier } from "../components/LabDossier";
import { Badge } from "../components/Badge";
import { GpuRow } from "../components/GpuRow";
import { KineticTitle } from "../components/KineticTitle";
import { RollingText } from "../components/RollingText";
import { StatCounter } from "../components/StatCounter";
import { PointsList } from "../components/PointsList";

// SECTION 2 — THE PLAYERS · cues 55–102 · 2:25–4:32 · 3795 frames @ 30fps.
// The labs live on one big 2D canvas; a virtual camera (CameraStage) flies to
// each one as it's named (node up top, info below), then pulls back wide to
// reveal the whole network, which converges on one bet: OPEN.

const CENTER: React.CSSProperties = {
  justifyContent: "center",
  alignItems: "center",
};

const CONVERGE_START = 3300;

// Node lookup + camera targets ----------------------------------------------
const N: Record<string, LabNode> = Object.fromEntries(
  LAB_NODES.map((n) => [n.id, n]),
);

const WIDE = { cx: WORLD_CX, cy: WORLD_CY, z: 0.5 };
// Focus a lab: center below the node so it sits in the upper third and its info
// column (anchored below it) is framed underneath. Taller dossiers (Zhipu) zoom
// out a touch and center lower so the bottom line stays on screen.
const focus = (id: string, z = 1.15, dy = 230) => ({
  cx: N[id].x,
  cy: N[id].y + dy,
  z,
});

const CAM_KEYS: CamKey[] = [
  { f: 0, cam: WIDE },
  { f: 250, cam: focus("deepseek") },
  { f: 700, cam: focus("moonshot") },
  { f: 1014, cam: focus("zhipu", 0.9, 300) },
  { f: 1492, cam: focus("minimax") },
  { f: 2090, cam: focus("alibaba") },
  { f: 2337, cam: focus("stepfun") },
  { f: 2588, cam: WIDE }, // interlude — pull back to the whole ecosystem
  { f: 3077, cam: focus("baidu") },
  { f: 3155, cam: WIDE }, // synthesis → converge → re-hook
];

// Info column hangs just below a node (world y offset).
const INFO_DY = 150;

const BadgeRow: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ display: "flex", gap: 22, flexWrap: "wrap", justifyContent: "center" }}>
    {children}
  </div>
);

export const ChinaSection2: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const fadeOut = interpolate(
    frame,
    [durationInFrames - 18, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // The whole world clears just before the re-hook title takes over.
  const worldOpacity = interpolate(frame, [3500, 3560], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <SceneBackground />
      <AbsoluteFill style={{ opacity: fadeOut }}>
        {/* ---- THE MOVING WORLD (panned + zoomed by the camera) ---- */}
        <AbsoluteFill style={{ opacity: worldOpacity }}>
          <CameraStage keyframes={CAM_KEYS}>
            <Constellation convergeStart={CONVERGE_START} />

            {/* Beat 1 — DeepSeek (FULL) · cues 58–63 */}
            <Sequence from={250} durationInFrames={450} layout="none">
              <WorldAnchor x={N.deepseek.x} y={N.deepseek.y + INFO_DY}>
                <LabDossier
                  name="DEEPSEEK"
                  sub="Hangzhou · backed by a quant fund"
                  startDelay={8}
                  nameSize={100}
                >
                  <BadgeRow>
                    <Badge text="NO TECH GIANT" startDelay={70} />
                    <Badge text="NO GOVERNMENT PROJECT" startDelay={84} />
                  </BadgeRow>
                  <RollingText
                    text="V4 Pro ≈ Gemini 3.1 Pro on SWE-Bench"
                    startDelay={300}
                    stagger={3}
                    fontSize={42}
                    color={colors.skyLight}
                    weight={600}
                  />
                </LabDossier>
              </WorldAnchor>
            </Sequence>

            {/* Beat 2 — Moonshot / Kimi (COMPACT) · cues 64–67 */}
            <Sequence from={700} durationInFrames={314} layout="none">
              <WorldAnchor x={N.moonshot.x} y={N.moonshot.y + INFO_DY}>
                <LabDossier
                  name="MOONSHOT AI"
                  sub="Beijing · Kimi K2.6"
                  startDelay={8}
                  nameSize={92}
                >
                  <StatCounter
                    to={256}
                    suffix="K"
                    startDelay={150}
                    countDuration={26}
                    fontSize={120}
                    entrance="slide"
                    label="token context window"
                    labelWeight={300}
                    labelColor="#9FB2D8"
                  />
                  <Badge text="First open-weight to beat GPT-5.4" startDelay={60} />
                </LabDossier>
              </WorldAnchor>
            </Sequence>

            {/* Beat 3 — Zhipu / GLM (FULL) · cues 68–74 */}
            <Sequence from={1014} durationInFrames={478} layout="none">
              <WorldAnchor x={N.zhipu.x} y={N.zhipu.y + INFO_DY}>
                <LabDossier
                  name="ZHIPU"
                  sub="Z.ai · listed on HKEX 2026"
                  startDelay={8}
                  nameSize={100}
                >
                  <GpuRow startDelay={200} label="8× H100" />
                  <BadgeRow>
                    <Badge
                      text="MIT License — open source"
                      startDelay={300}
                      color={signal.good}
                    />
                  </BadgeRow>
                  <RollingText
                    text="beats Claude Opus on some coding benchmarks"
                    startDelay={360}
                    stagger={3}
                    fontSize={36}
                  />
                </LabDossier>
              </WorldAnchor>
            </Sequence>

            {/* Beat 4 — MiniMax (FULL) · cues 75–79 */}
            <Sequence from={1492} durationInFrames={513} layout="none">
              <WorldAnchor x={N.minimax.x} y={N.minimax.y + INFO_DY}>
                <LabDossier name="MINIMAX" sub="Shanghai" startDelay={8} nameSize={100}>
                  <StatCounter
                    to={4.55}
                    suffix="T"
                    decimals={2}
                    startDelay={300}
                    countDuration={34}
                    fontSize={140}
                    entrance="slide"
                    heroFont="heavy"
                    label="tokens processed in 7 days"
                    labelWeight={300}
                    labelColor="#9FB2D8"
                  />
                  <Badge text="#1 on OpenRouter for a week" startDelay={120} />
                </LabDossier>
              </WorldAnchor>
            </Sequence>

            {/* Beat 5 — Alibaba / Qwen (COMPACT) · cues 81–83 */}
            <Sequence from={2090} durationInFrames={247} layout="none">
              <WorldAnchor x={N.alibaba.x} y={N.alibaba.y + INFO_DY}>
                <LabDossier name="ALIBABA" sub="Qwen3.7 Max" startDelay={8} nameSize={92}>
                  <StatCounter
                    to={13}
                    suffix="×"
                    startDelay={110}
                    countDuration={24}
                    fontSize={120}
                    color={signal.good}
                    accent={signal.good}
                    entrance="slide"
                    heroFont="heavy"
                    label="cheaper than Claude Opus 4.7"
                    labelWeight={300}
                    labelColor="#9FB2D8"
                  />
                  <Badge text="Top on SWE-Bench Pro" startDelay={20} />
                </LabDossier>
              </WorldAnchor>
            </Sequence>

            {/* Beat 6 — StepFun (COMPACT) · cues 84–87 */}
            <Sequence from={2337} durationInFrames={251} layout="none">
              <WorldAnchor x={N.stepfun.x} y={N.stepfun.y + INFO_DY}>
                <LabDossier name="STEPFUN" sub="Step 3.5 Flash" startDelay={8} nameSize={92}>
                  <StatCounter
                    to={10}
                    suffix="¢"
                    startDelay={30}
                    countDuration={20}
                    fontSize={120}
                    color={signal.good}
                    accent={signal.good}
                    entrance="slide"
                    heroFont="heavy"
                    label="per million tokens"
                    labelWeight={300}
                    labelColor="#9FB2D8"
                  />
                  <Badge
                    text="~50× cheaper than GPT-5.5"
                    startDelay={150}
                    color={signal.good}
                  />
                </LabDossier>
              </WorldAnchor>
            </Sequence>

            {/* Beat 8 — Baidu (COMPACT) · cue 93 */}
            <Sequence from={3077} durationInFrames={78} layout="none">
              <WorldAnchor x={N.baidu.x} y={N.baidu.y + INFO_DY}>
                <LabDossier
                  name="BAIDU"
                  sub="ERNIE 5.0 · enterprise"
                  startDelay={4}
                  nameSize={92}
                >
                  <Badge text="Enterprise market" startDelay={28} />
                </LabDossier>
              </WorldAnchor>
            </Sequence>
          </CameraStage>
        </AbsoluteFill>

        {/* ---- SCREEN OVERLAYS (full-frame text moments — not panned) ---- */}

        {/* Beat Intro — not one lab, an ecosystem (cues 55–57) */}
        <Sequence durationInFrames={250}>
          <AbsoluteFill style={{ ...CENTER, gap: 30 }}>
            <KineticTitle
              lines={["NOT ONE LAB.", "AN ECOSYSTEM."]}
              fontSize={104}
              stagger={5}
              accent={sides.china}
            />
            <RollingText
              text="…and it isn't just DeepSeek."
              startDelay={70}
              stagger={4}
              fontSize={38}
            />
          </AbsoluteFill>
        </Sequence>

        {/* Beat 7 — contrast interlude over the (wide) ecosystem · cues 88–92 */}
        <Sequence from={2588} durationInFrames={489}>
          <AbsoluteFill style={{ ...CENTER, gap: 56 }}>
            <RollingText
              text="GPT-5.5 still wins the benchmark…"
              startDelay={20}
              stagger={4}
              fontSize={48}
            />
            <KineticTitle
              lines={["…BUT AT SCALE,", "PRICE IS THE QUESTION."]}
              fontSize={92}
              startDelay={120}
              stagger={4}
              accent={sides.china}
            />
          </AbsoluteFill>
        </Sequence>

        {/* Beat 9 — synthesis: different everything · cues 94–96 */}
        <Sequence from={3155} durationInFrames={145}>
          <AbsoluteFill style={CENTER}>
            <PointsList
              items={["DIFFERENT CITIES", "DIFFERENT INVESTORS", "DIFFERENT GOALS"]}
              fontSize={70}
              stagger={26}
            />
          </AbsoluteFill>
        </Sequence>

        {/* Hold below OPEN: one bet, on purpose · cue 97–98 */}
        <Sequence from={3340} durationInFrames={200}>
          <AbsoluteFill
            style={{ justifyContent: "flex-start", alignItems: "center", paddingTop: 690 }}
          >
            <RollingText
              text="ONE BET — NOT A COINCIDENCE."
              startDelay={10}
              stagger={4}
              fontSize={44}
              weight={600}
              color={colors.skyLight}
            />
          </AbsoluteFill>
        </Sequence>

        {/* Beat 10 — re-hook into Section 3 · cues 99–102 */}
        <Sequence from={3540} durationInFrames={255}>
          <Trail layers={8} lagInFrames={0.1} trailOpacity={0.6}>
            <AbsoluteFill style={CENTER}>
              <KineticTitle
                lines={["ITNA KHARCH KARKE…", "FREE MEIN KYUN?"]}
                fontSize={128}
                stagger={6}
                accent={sides.china}
              />
            </AbsoluteFill>
          </Trail>
        </Sequence>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
