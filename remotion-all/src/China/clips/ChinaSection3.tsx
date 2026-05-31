import {
  AbsoluteFill,
  interpolate,
  Sequence,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Trail } from "@remotion/motion-blur";
import { noise2D } from "@remotion/noise";
import { colors, fonts, sides, signal } from "../theme";
import { SceneBackground } from "../components/SceneBackground";
import { KineticTitle } from "../components/KineticTitle";
import { RollingText } from "../components/RollingText";
import { StatCounter } from "../components/StatCounter";
import { StrikeWord } from "../components/StrikeWord";
import { PathDraw } from "../../shared/effects";

// SECTION 3 — WHY OPEN SOURCE / THE PLATFORM PLAY · cues 103–132 · 4:32–5:43.
// 2116 frames @ 30fps. Answers Section 2's re-hook ("itna kharch karke FREE
// MEIN KYUN?"): open-sourcing isn't charity — it's a platform play that
// compounds. Proof = 113,000 Qwen derivatives. Closes by reframing the race:
// the prize is becoming the DEFAULT LAYER, not the smartest model.
// Color convention: China = skyLight/blueMed + signal.good; US = royal/navy +
// signal.bad. Numbers from script.md / research.md (HF Spring 2026).

const CENTER: React.CSSProperties = {
  justifyContent: "center",
  alignItems: "center",
};

const CX = 960;
const CY = 540;

// ---------------------------------------------------------------------------
// Small shared glyphs
// ---------------------------------------------------------------------------

// A padlock drawn from primitives (deterministic, font-independent). Used for
// the "closed product" (Beat 2) and the dev-side "locked in" callback (Beat 5).
const Padlock: React.FC<{ size?: number; color: string; bg?: string }> = ({
  size = 90,
  color,
  bg = colors.midnight,
}) => (
  <svg width={size} height={size * 1.2} viewBox="0 0 100 120" style={{ overflow: "visible" }}>
    <path
      d="M28 52 V36 a22 22 0 0 1 44 0 V52"
      fill="none"
      stroke={color}
      strokeWidth={9}
      strokeLinecap="round"
    />
    <rect x="20" y="50" width="60" height="58" rx="10" fill={color} />
    <circle cx="50" cy="74" r="7" fill={bg} />
    <rect x="46.5" y="76" width="7" height="18" rx="3" fill={bg} />
  </svg>
);

// ---------------------------------------------------------------------------
// BEAT 1 — pivot / answer · cue 103 · local 0–62
// ---------------------------------------------------------------------------
const BeatPivot: React.FC = () => {
  const frame = useCurrentFrame();
  const out = interpolate(frame, [52, 68], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill style={{ ...CENTER, opacity: out }}>
      <KineticTitle
        lines={["YAHIN SE", "PICTURE CLEAR."]}
        fontSize={120}
        stagger={5}
        accent={sides.china}
      />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// BEAT 2 — PRODUCT vs PLATFORM · cues 104–108 · local 0–249
// ---------------------------------------------------------------------------
const StackBlock: React.FC<{ label: string; delay: number; y: number; w: number }> = ({
  label,
  delay,
  y,
  w,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - delay, fps, config: { damping: 14, stiffness: 130 }, durationInFrames: 18 });
  return (
    <div
      style={{
        position: "absolute",
        bottom: y,
        width: w,
        height: 58,
        left: "50%",
        transform: `translateX(-50%) translateY(${interpolate(p, [0, 1], [40, 0])}px) scale(${interpolate(p, [0, 1], [0.7, 1])})`,
        opacity: interpolate(p, [0, 1], [0, 1]),
        borderRadius: 10,
        border: `2px solid ${sides.china}`,
        background: `linear-gradient(180deg, ${colors.blueMed}cc, ${colors.navy}ee)`,
        boxShadow: `0 0 26px ${sides.china}44`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: fonts.body,
        fontWeight: 600,
        fontSize: 24,
        letterSpacing: 2,
        color: "#EAF4FE",
      }}
    >
      {label}
    </div>
  );
};

const BeatProductPlatform: React.FC = () => {
  const frame = useCurrentFrame();
  const boxPop = spring({ frame: frame - 20, fps: 30, config: { damping: 12, stiffness: 120 }, durationInFrames: 20 });
  const slab = spring({ frame: frame - 24, fps: 30, config: { damping: 200 }, durationInFrames: 20 });
  const kicker = interpolate(frame, [175, 200], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const headOpacity = interpolate(frame, [4, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill>
      {/* Center divider drawing down */}
      <PathDraw d={`M ${CX} 150 L ${CX} 880`} stroke={`${colors.skyLight}66`} strokeWidth={3} durationInFrames={26} startDelay={6} />

      {/* LEFT — US / PRODUCT (closed) */}
      <div style={{ position: "absolute", left: 0, top: 0, width: CX, height: 1080, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 40 }}>
        <div style={{ opacity: headOpacity, textAlign: "center" }}>
          <div style={{ fontFamily: fonts.body, fontWeight: 600, fontSize: 30, letterSpacing: 8, color: signal.bad }}>USA</div>
          <div style={{ fontFamily: fonts.display, fontSize: 96, letterSpacing: 4, color: "#EEF3FB", lineHeight: 1 }}>PRODUCT</div>
        </div>
        <div
          style={{
            position: "relative",
            width: 300,
            height: 320,
            transform: `scale(${interpolate(boxPop, [0, 1], [0.6, 1])})`,
            opacity: interpolate(boxPop, [0, 0.4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
            borderRadius: 24,
            border: `4px solid ${signal.bad}aa`,
            background: `linear-gradient(160deg, ${colors.royal} 0%, ${colors.navy} 100%)`,
            boxShadow: `0 0 60px ${signal.bad}33, inset 0 0 60px ${colors.midnight}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Padlock size={120} color={signal.bad} />
        </div>
        <div style={{ opacity: headOpacity, fontFamily: fonts.body, fontWeight: 500, fontSize: 28, letterSpacing: 3, color: "#9FB2D8" }}>
          EK BAND UNIT · RENT KARO
        </div>
      </div>

      {/* RIGHT — CHINA / PLATFORM (open foundation, things build on top) */}
      <div style={{ position: "absolute", left: CX, top: 0, width: CX, height: 1080 }}>
        <div style={{ position: "absolute", top: 200, left: 0, width: "100%", textAlign: "center", opacity: headOpacity }}>
          <div style={{ fontFamily: fonts.body, fontWeight: 600, fontSize: 30, letterSpacing: 8, color: signal.good }}>CHINA</div>
          <div style={{ fontFamily: fonts.display, fontSize: 96, letterSpacing: 4, color: sides.china, lineHeight: 1 }}>PLATFORM</div>
        </div>
        {/* Stacked things building on the base */}
        <StackBlock label="APPS" delay={150} y={570} w={260} />
        <StackBlock label="AGENTS" delay={130} y={506} w={320} />
        <StackBlock label="STARTUPS" delay={110} y={442} w={380} />
        {/* The base foundation slab */}
        <div
          style={{
            position: "absolute",
            bottom: 360,
            left: "50%",
            width: 460,
            height: 74,
            transform: `translateX(-50%) translateY(${interpolate(slab, [0, 1], [60, 0])}px)`,
            opacity: interpolate(slab, [0, 1], [0, 1]),
            borderRadius: 14,
            border: `4px solid ${sides.china}`,
            background: `linear-gradient(180deg, ${colors.skyLight}55, ${colors.blueMed} 100%)`,
            boxShadow: `0 0 70px ${sides.china}55`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: fonts.display,
            fontSize: 40,
            letterSpacing: 6,
            color: colors.midnight,
          }}
        >
          OPEN MODEL
        </div>
      </div>

      {/* Kicker — lands on "game badal diya" */}
      <div style={{ position: "absolute", bottom: 54, left: 0, width: "100%", textAlign: "center", opacity: kicker }}>
        <span style={{ fontFamily: fonts.display, fontSize: 56, letterSpacing: 3, color: "#FFFFFF", textShadow: `0 0 24px ${sides.china}66` }}>
          ISI EK DIFFERENCE NE GAME BADAL DIYA
        </span>
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// BEAT 3a — the compounding FLYWHEEL · cues 108–115 · local 0–557
// ---------------------------------------------------------------------------
const R = 300;
const STAGES = [
  { id: "open", title: "OPEN SOURCE", sub: "model release", x: CX, y: CY - R, delay: 59, lx: CX, ly: CY - R - 110, align: "center" as const },
  { id: "build", title: "DEVELOPERS BUILD", sub: "worldwide", x: CX + R, y: CY, delay: 139, lx: CX + R + 40, ly: CY, align: "left" as const },
  { id: "tune", title: "FINE-TUNE", sub: "startups · researchers · engineers", x: CX, y: CY + R, delay: 287, lx: CX, ly: CY + R + 70, align: "center" as const },
  { id: "grow", title: "ECOSYSTEM GROWS", sub: "stronger every loop", x: CX - R, y: CY, delay: 357, lx: CX - R - 40, ly: CY, align: "right" as const },
];

const StageNode: React.FC<{ s: (typeof STAGES)[number] }> = ({ s }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - s.delay, fps, config: { damping: 13, stiffness: 120 }, durationInFrames: 18 });
  const op = interpolate(p, [0, 0.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <>
      {/* node dot */}
      <div
        style={{
          position: "absolute",
          left: s.x,
          top: s.y,
          transform: `translate(-50%, -50%) scale(${interpolate(p, [0, 1], [0.4, 1])})`,
          width: 34,
          height: 34,
          borderRadius: "50%",
          background: sides.china,
          boxShadow: `0 0 30px ${sides.china}`,
          opacity: op,
        }}
      />
      {/* label */}
      <div
        style={{
          position: "absolute",
          left: s.lx,
          top: s.ly,
          transform:
            s.align === "center"
              ? "translate(-50%, -50%)"
              : s.align === "left"
                ? "translate(0, -50%)"
                : "translate(-100%, -50%)",
          textAlign: s.align,
          opacity: op,
          width: 360,
          ...(s.align === "right" ? { right: "auto" } : {}),
        }}
      >
        <div style={{ fontFamily: fonts.display, fontSize: 46, letterSpacing: 2, color: "#FFFFFF", lineHeight: 1 }}>{s.title}</div>
        <div style={{ fontFamily: fonts.body, fontWeight: 400, fontSize: 22, letterSpacing: 1, color: "#9FB2D8", marginTop: 6 }}>{s.sub}</div>
      </div>
    </>
  );
};

const BeatFlywheel: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Center core: pulses brighter when the feedback loop returns (local ~426).
  const corePop = spring({ frame: frame - 20, fps, config: { damping: 12, stiffness: 120 }, durationInFrames: 18 });
  const feedback = interpolate(frame, [426, 470], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const coreGlow = 60 + feedback * 90;

  // Compounding: a ring of derivative dots that multiplies + accelerates.
  const compound = interpolate(frame, [430, 557], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const dotCount = Math.floor(interpolate(compound, [0, 1], [0, 40]));
  const spin = frame * (0.6 + compound * 1.6);

  // Arc paths between consecutive stages (clockwise, sweep-flag 1).
  const arcs = [
    { d: `M ${CX} ${CY - R} A ${R} ${R} 0 0 1 ${CX + R} ${CY}`, delay: 95 },
    { d: `M ${CX + R} ${CY} A ${R} ${R} 0 0 1 ${CX} ${CY + R}`, delay: 200 },
    { d: `M ${CX} ${CY + R} A ${R} ${R} 0 0 1 ${CX - R} ${CY}`, delay: 320 },
    { d: `M ${CX - R} ${CY} A ${R} ${R} 0 0 1 ${CX} ${CY - R}`, delay: 390 },
  ];

  return (
    <AbsoluteFill>
      {/* faint full guide ring */}
      <svg width={1920} height={1080} style={{ position: "absolute", top: 0, left: 0 }}>
        <circle cx={CX} cy={CY} r={R} fill="none" stroke={`${colors.skyLight}1f`} strokeWidth={2} />
      </svg>

      {/* sequential glowing arcs */}
      {arcs.map((a, i) => (
        <PathDraw key={i} d={a.d} stroke={sides.china} strokeWidth={5} durationInFrames={40} startDelay={a.delay} />
      ))}

      {/* feedback arrow: ecosystem -> back into the core (model improves) */}
      <PathDraw d={`M ${CX - R + 30} ${CY} L ${CX - 90} ${CY}`} stroke={signal.good} strokeWidth={6} durationInFrames={30} startDelay={426} />

      {/* multiplying derivative dots around the ring (compounding) */}
      {Array.from({ length: dotCount }).map((_, i) => {
        const ang = (i / 40) * Math.PI * 2 + (spin * Math.PI) / 180;
        const rr = R + 70 + noise2D(`fw-${i}`, frame / 60, i) * 26;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: CX + Math.cos(ang) * rr,
              top: CY + Math.sin(ang) * rr,
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: signal.good,
              boxShadow: `0 0 12px ${signal.good}`,
              opacity: 0.7,
              transform: "translate(-50%, -50%)",
            }}
          />
        );
      })}

      {/* stage nodes + labels */}
      {STAGES.map((s) => (
        <StageNode key={s.id} s={s} />
      ))}

      {/* center core: THE OPEN MODEL */}
      <div
        style={{
          position: "absolute",
          left: CX,
          top: CY,
          transform: `translate(-50%, -50%) scale(${interpolate(corePop, [0, 1], [0.5, 1]) * (1 + feedback * 0.08)})`,
          opacity: interpolate(corePop, [0, 0.4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          width: 180,
          height: 180,
          borderRadius: "50%",
          border: `4px solid ${sides.china}`,
          background: `radial-gradient(circle at 50% 35%, ${colors.blueMed}aa, ${colors.navy}ee)`,
          boxShadow: `0 0 ${coreGlow}px ${sides.china}99`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          fontFamily: fonts.display,
          fontSize: 34,
          letterSpacing: 2,
          color: sides.china,
          lineHeight: 0.95,
        }}
      >
        THE OPEN MODEL
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// BEAT 3b — free labor: eval + red-teaming · cues 116–119 · local 0–302
// ---------------------------------------------------------------------------
const CostMeter: React.FC<{
  x: number;
  fillPct: number;
  color: string;
  glow: string;
  cap: string;
  head: string;
  sub: string;
  delay: number;
}> = ({ x, fillPct, color, glow, cap, head, sub, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - delay, fps, config: { damping: 18, stiffness: 90 }, durationInFrames: 26 });
  const H = 440;
  return (
    <div style={{ position: "absolute", left: x, top: 0, width: 640, height: 1080, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 26 }}>
      <div style={{ fontFamily: fonts.display, fontSize: 60, letterSpacing: 3, color: "#FFFFFF", opacity: interpolate(p, [0, 0.4], [0, 1]) }}>{head}</div>
      {/* meter track */}
      <div style={{ width: 150, height: H, borderRadius: 16, border: `2px solid ${colors.skyLight}33`, background: `${colors.navy}88`, display: "flex", alignItems: "flex-end", overflow: "hidden" }}>
        <div
          style={{
            width: "100%",
            height: H * fillPct * p,
            background: `linear-gradient(180deg, ${glow} 0%, ${color} 100%)`,
            boxShadow: `0 0 40px ${glow}66`,
          }}
        />
      </div>
      <div style={{ fontFamily: fonts.display, fontSize: 76, letterSpacing: 2, color: glow, opacity: interpolate(p, [0.3, 0.7], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), textShadow: `0 0 30px ${glow}66` }}>{cap}</div>
      <div style={{ fontFamily: fonts.body, fontWeight: 500, fontSize: 26, letterSpacing: 2, color: "#9FB2D8", textAlign: "center", maxWidth: 360, opacity: interpolate(p, [0.4, 0.8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>{sub}</div>
    </div>
  );
};

const BeatCost: React.FC = () => {
  const frame = useCurrentFrame();
  const out = interpolate(frame, [288, 302], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <div style={{ position: "absolute", top: 80, left: 0, width: "100%", textAlign: "center" }}>
        <RollingText text="EVALUATION + RED-TEAMING — kaun bharta hai?" startDelay={6} stagger={2.5} fontSize={40} weight={600} />
      </div>
      <CostMeter x={140} fillPct={0.95} color={signal.badDeep} glow={signal.bad} cap="$$$" head="WESTERN LABS" sub="khud paisa kharch karti hain" delay={20} />
      <CostMeter x={1140} fillPct={0.06} color={signal.goodDeep} glow={signal.good} cap="$0" head="CHINESE LABS" sub="community kar deti hai — FREE MEIN" delay={70} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// BEAT 4 — payoff stat: 113,000 derivatives · cues 120–123 · local 0–271
// ---------------------------------------------------------------------------
const HBar: React.FC<{
  y: number;
  pct: number;
  color: string;
  glow: string;
  label: string;
  value?: string;
  delay: number;
}> = ({ y, pct, color, glow, label, value, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - delay, fps, config: { damping: 18, stiffness: 90 }, durationInFrames: 26 });
  const maxW = 1180;
  return (
    <div style={{ position: "absolute", left: 360, top: y, display: "flex", alignItems: "center", gap: 26 }}>
      <div style={{ width: 220, textAlign: "right", fontFamily: fonts.display, fontSize: 44, letterSpacing: 2, color: "#EAF4FE", opacity: interpolate(p, [0, 0.4], [0, 1]) }}>{label}</div>
      <div style={{ height: 64, width: maxW * pct * p, borderRadius: "0 12px 12px 0", background: `linear-gradient(90deg, ${color} 0%, ${glow} 100%)`, boxShadow: `0 0 36px ${glow}55`, display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: 24 }}>
        {value ? (
          <span style={{ fontFamily: fonts.display, fontSize: 48, letterSpacing: 1, color: colors.midnight, opacity: interpolate(p, [0.5, 0.9], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>{value}</span>
        ) : null}
      </div>
    </div>
  );
};

const BeatStat: React.FC = () => {
  const frame = useCurrentFrame();

  // background dot-field multiplying (derivatives)
  const fieldP = interpolate(frame, [10, 90], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const dots = Math.floor(fieldP * 90);

  return (
    <AbsoluteFill>
      {/* faint multiplying derivative field */}
      {Array.from({ length: dots }).map((_, i) => {
        const nx = noise2D(`d4x-${i}`, i * 0.3, frame / 200);
        const ny = noise2D(`d4y-${i}`, i * 0.7, frame / 200);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 960 + nx * 920,
              top: 540 + ny * 520,
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: signal.good,
              opacity: 0.22,
            }}
          />
        );
      })}

      {/* hero number */}
      <div style={{ position: "absolute", top: 150, left: 0, width: "100%", display: "flex", justifyContent: "center" }}>
        <StatCounter
          to={113000}
          suffix="+"
          startDelay={10}
          countDuration={60}
          fontSize={210}
          color={signal.good}
          accent={signal.good}
          entrance="slide"
          heroFont="heavy"
          label="QWEN DERIVATIVES ON HUGGING FACE"
          labelWeight={300}
          labelColor="#9FB2D8"
        />
      </div>

      {/* comparison: Qwen dwarfs Google + Meta combined (G+M = illustrative, no fake number) */}
      <HBar y={640} pct={1.0} color={signal.goodDeep} glow={signal.good} label="QWEN" value="113K" delay={110} />
      <HBar y={740} pct={0.32} color={colors.royal} glow={colors.blueMed} label="GOOGLE + META" delay={140} />

      <div style={{ position: "absolute", top: 860, left: 0, width: "100%", textAlign: "center" }}>
        <KineticTitle lines={["> GOOGLE + META COMBINED"]} fontSize={64} startDelay={170} stagger={3} accent={signal.good} color={signal.good} />
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// BEAT 5a — lock-in: build on it → can't switch · cues 124–128 · local 0–378
// ---------------------------------------------------------------------------
const BeatLockIn: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const modelX = 560;
  const appX = 1360;
  const nodePop = spring({ frame: frame - 8, fps, config: { damping: 13, stiffness: 120 }, durationInFrames: 18 });

  // dependency edges between MODEL and YOUR APP
  const edges = [-150, -75, 0, 75, 150];
  // "switch?" attempt — edges flash red + padlock appears
  const flash = interpolate(frame, [200, 230], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const shake = flash > 0 ? noise2D("shake", frame / 2, 0) * 6 * flash : 0;
  const edgeColor = `rgb(${Math.round(interpolate(flash, [0, 1], [61, 255]))}, ${Math.round(interpolate(flash, [0, 1], [220, 92]))}, ${Math.round(interpolate(flash, [0, 1], [151, 108]))})`;

  const nodeBox = (label: string, sub: string, x: number, color: string): React.ReactElement => (
    <div
      style={{
        position: "absolute",
        left: x,
        top: CY,
        transform: `translate(-50%, -50%) scale(${interpolate(nodePop, [0, 1], [0.6, 1])})`,
        opacity: interpolate(nodePop, [0, 0.4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        width: 280,
        padding: "34px 0",
        borderRadius: 20,
        border: `4px solid ${color}`,
        background: `radial-gradient(circle at 50% 35%, ${colors.blueMed}55, ${colors.navy}ee)`,
        boxShadow: `0 0 50px ${color}55`,
        textAlign: "center",
      }}
    >
      <div style={{ fontFamily: fonts.display, fontSize: 56, letterSpacing: 2, color: "#FFFFFF", lineHeight: 1 }}>{label}</div>
      <div style={{ fontFamily: fonts.body, fontWeight: 500, fontSize: 22, letterSpacing: 1, color: "#9FB2D8", marginTop: 8 }}>{sub}</div>
    </div>
  );

  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", top: 90, left: 0, width: "100%", textAlign: "center" }}>
        <RollingText text="seedha in models par build karo…" startDelay={8} stagger={3} fontSize={44} weight={600} />
      </div>

      {/* dependency edges */}
      <svg width={1920} height={1080} style={{ position: "absolute", top: 0, left: 0 }}>
        {edges.map((off, i) => {
          const draw = interpolate(frame, [40 + i * 10, 90 + i * 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const d = `M ${modelX + 140} ${CY} C ${CX} ${CY + off}, ${CX} ${CY + off}, ${appX - 140} ${CY}`;
          const len = 820;
          return (
            <path
              key={i}
              d={d}
              fill="none"
              stroke={edgeColor}
              strokeWidth={4}
              strokeDasharray={len}
              strokeDashoffset={len * (1 - draw)}
              opacity={0.85}
              style={{ filter: `drop-shadow(0 0 8px ${edgeColor})` }}
            />
          );
        })}
      </svg>

      <div style={{ transform: `translateX(${shake}px)` }}>
        {nodeBox("MODEL", "Chinese foundation", modelX, sides.china)}
        {nodeBox("YOUR APP", "workflow yahin", appX, signal.good)}
      </div>

      {/* SWITCH? attempt fails → padlock + label */}
      <div style={{ position: "absolute", left: CX, top: CY - 150, transform: "translate(-50%, -50%)", opacity: flash, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
        <Padlock size={86} color={signal.bad} />
      </div>
      <div style={{ position: "absolute", left: CX, top: CY + 130, transform: "translate(-50%, -50%)", opacity: flash, textAlign: "center" }}>
        <div style={{ fontFamily: fonts.display, fontSize: 54, letterSpacing: 3, color: signal.bad, textShadow: `0 0 24px ${signal.bad}66` }}>SWITCH KARNA = MUSHKIL</div>
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// BEAT 5b — the reframe / re-hook · cues 129–132 · local 0–297
// ---------------------------------------------------------------------------
const BeatReframe: React.FC = () => {
  const frame = useCurrentFrame();
  // Kill the old idea, then fully clear it before the new thesis rises (no overlap).
  const strikeOut = interpolate(frame, [50, 66], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={CENTER}>
      <AbsoluteFill style={{ ...CENTER, opacity: strikeOut }}>
        <StrikeWord text="SMARTEST MODEL WINS" delay={10} fontSize={92} />
      </AbsoluteFill>
      <Trail layers={6} lagInFrames={0.08} trailOpacity={0.5}>
        <AbsoluteFill style={CENTER}>
          <KineticTitle
            lines={["BATTLE YE HAI —", "KAUN BANEGA DEFAULT LAYER?"]}
            fontSize={104}
            startDelay={72}
            stagger={5}
            accent={sides.china}
          />
        </AbsoluteFill>
      </Trail>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// ROOT
// ---------------------------------------------------------------------------
export const ChinaSection3: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const fadeOut = interpolate(frame, [durationInFrames - 18, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <SceneBackground />
      <AbsoluteFill style={{ opacity: fadeOut }}>
        {/* Beat 1 — pivot/answer · cue 103 */}
        <Sequence durationInFrames={62}>
          <BeatPivot />
        </Sequence>

        {/* Beat 2 — PRODUCT vs PLATFORM · cues 104–108 */}
        <Sequence from={62} durationInFrames={249}>
          <BeatProductPlatform />
        </Sequence>

        {/* Beat 3a — compounding flywheel · cues 108–115 */}
        <Sequence from={311} durationInFrames={557}>
          <BeatFlywheel />
        </Sequence>

        {/* Beat 3b — free eval/red-teaming · cues 116–119 */}
        <Sequence from={868} durationInFrames={302}>
          <BeatCost />
        </Sequence>

        {/* Beat 4 — 113,000 derivatives · cues 120–123 */}
        <Sequence from={1170} durationInFrames={271}>
          <BeatStat />
        </Sequence>

        {/* Beat 5a — lock-in · cues 124–128 */}
        <Sequence from={1441} durationInFrames={378}>
          <BeatLockIn />
        </Sequence>

        {/* Beat 5b — reframe / re-hook into Section 4 · cues 129–132 */}
        <Sequence from={1819} durationInFrames={297}>
          <BeatReframe />
        </Sequence>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
