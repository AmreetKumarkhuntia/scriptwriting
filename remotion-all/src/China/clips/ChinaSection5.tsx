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
import { Badge } from "../components/Badge";
import { PathDraw } from "../../shared/effects";

// SECTION 5 — THE CONCENTRATION RISK + ENDING · cues 176–239 · 7:34–10:13.
// 4784 frames @ 30fps. Picks up exactly where Section 4's dark turn ("lekin
// story yahan khatam nahi hoti") drops us. Two movements:
//   A) The part nobody talks about — if the whole world builds on a few models,
//      one foundation's decisions reach everywhere (Huawei/5G analogy).
//   B) The close — China didn't become the smartest, it became the DEFAULT;
//      one strategy (open weights · aggressive pricing · global distribution);
//      "6 of 6 was a signal"; the real question — what are YOU building on? —
//      then the outro / end card.
// Color convention (theme.ts): China = skyLight/blueMed + signal.good (green);
// US / incumbent = royal/navy + signal.bad (red). Numbers from script.md.

const EXT = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const CENTER: React.CSSProperties = {
  justifyContent: "center",
  alignItems: "center",
};
const CX = 960;

const clamp01 = (n: number) => Math.max(0, Math.min(1, n));

// ---------------------------------------------------------------------------
// BEAT 1 — "ek important baat": this isn't anti-China · cues 176–182 · 0–514
// ---------------------------------------------------------------------------
const BeatImportant: React.FC = () => {
  const frame = useCurrentFrame();
  const titleOut = interpolate(frame, [150, 178], [1, 0], EXT);
  const bodyIn = interpolate(frame, [180, 210], [0, 1], EXT);
  const out = interpolate(frame, [494, 514], [1, 0], EXT);

  const GOOD = ["POWERFUL", "WIDELY ADOPTED", "GENUINELY GOOD"];

  return (
    <AbsoluteFill style={{ opacity: out }}>
      {/* the framing title */}
      <AbsoluteFill style={{ ...CENTER, opacity: titleOut }}>
        <KineticTitle lines={["EK IMPORTANT", "BAAT —"]} fontSize={130} stagger={5} />
      </AbsoluteFill>

      {/* the balanced point */}
      <AbsoluteFill style={{ ...CENTER, gap: 54, opacity: bodyIn }}>
        <RollingText
          text="Iska matlab ye nahi ki ye models bure hain."
          startDelay={188}
          stagger={3}
          fontSize={46}
          weight={600}
          color="#EAF4FE"
        />
        <div style={{ display: "flex", gap: 26 }}>
          {GOOD.map((g, i) => (
            <Badge key={g} text={g} color={signal.good} startDelay={230 + i * 14} fontSize={30} />
          ))}
        </div>
        <RollingText
          text="Isiliye itne developers inhe adopt kar rahe hain."
          startDelay={300}
          stagger={3}
          fontSize={36}
          color={colors.skyLight}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// BEAT 2 — concentration: everything builds on one foundation, and its
// decisions reach everywhere · cues 183–195 · 0–950
// ---------------------------------------------------------------------------
const FX = CX;
const FY = 700; // foundation top-anchor point (lines converge here)

// App nodes sit in a band well below the top caption/badge block (ends ≈y194)
// so they never collide with it.
const APP_NODES = Array.from({ length: 15 }).map((_, i) => ({
  i,
  x: 180 + (1560 / 14) * i,
  y: 360 + noise2D(`n2-${i}`, i * 1.3, 0) * 55,
}));

const BeatConcentration: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase A — the question
  const qOut = interpolate(frame, [120, 148], [1, 0], EXT);
  // Phase B+ — the diagram
  const diagramIn = interpolate(frame, [130, 170], [0, 1], EXT);
  const out = interpolate(frame, [930, 950], [1, 0], EXT);

  const slab = spring({ frame: frame - 150, fps, config: { damping: 200 }, durationInFrames: 22 });

  // the propagation pulse: foundation's decision travels back UP every line
  const pulse = interpolate(frame, [600, 770], [0, 1], EXT);

  // "AI decides" tags
  const DECIDE = ["KYA DIKHE", "KYA NA DIKHE", "KAISE DIKHE"];
  const decideIn = interpolate(frame, [320, 350], [0, 1], EXT);
  const decideOut = interpolate(frame, [540, 568], [1, 0], EXT);

  return (
    <AbsoluteFill style={{ opacity: out }}>
      {/* PHASE A — the question */}
      <AbsoluteFill style={{ ...CENTER, gap: 44, opacity: qOut }}>
        <KineticTitle lines={["LEKIN — EK", "INTERESTING SAWAAL."]} fontSize={104} stagger={4} accent={sides.china} />
        <RollingText
          text="Agar duniya ki saari apps kuch hi models par depend karein?"
          startDelay={56}
          stagger={3}
          fontSize={40}
          color="#C7D3E6"
        />
      </AbsoluteFill>

      {/* PHASE B — convergence + propagation diagram */}
      <AbsoluteFill style={{ opacity: diagramIn }}>
        {/* top caption — AI doesn't just answer */}
        <div
          style={{
            position: "absolute",
            top: 70,
            left: 0,
            width: "100%",
            textAlign: "center",
            opacity: decideIn * decideOut,
          }}
        >
          <span style={{ fontFamily: fonts.display, fontSize: 52, letterSpacing: 3, color: "#EEF3FB" }}>
            AI SIRF ANSWERS NAHI DETA —
          </span>
          <div style={{ display: "flex", justifyContent: "center", gap: 22, marginTop: 22 }}>
            {DECIDE.map((d, i) => (
              <Badge key={d} text={d} color={signal.bad} startDelay={330 + i * 12} fontSize={26} />
            ))}
          </div>
        </div>

        {/* dependency lines + propagation dots */}
        <svg width={1920} height={1080} style={{ position: "absolute", top: 0, left: 0, overflow: "visible" }}>
          {APP_NODES.map((n) => {
            const draw = interpolate(frame, [150 + n.i * 4, 270 + n.i * 4], [0, 1], EXT);
            const x2 = FX + (n.x - FX) * draw;
            const y2 = FY + (n.y - FY) * draw;
            // pulse travels slab -> node
            const pt = clamp01((pulse - n.i * 0.008) * 1.1);
            const px = FX + (n.x - FX) * pt;
            const py = FY + (n.y - FY) * pt;
            return (
              <g key={n.i}>
                <line
                  x1={FX}
                  y1={FY}
                  x2={x2}
                  y2={y2}
                  stroke={`${colors.skyLight}77`}
                  strokeWidth={2}
                />
                {pulse > 0 && pt < 1 ? (
                  <circle cx={px} cy={py} r={7} fill={signal.good} style={{ filter: `drop-shadow(0 0 10px ${signal.good})` }} />
                ) : null}
              </g>
            );
          })}
        </svg>

        {/* app nodes */}
        {APP_NODES.map((n) => {
          const pop = spring({ frame: frame - (160 + n.i * 4), fps, config: { damping: 14, stiffness: 130 }, durationInFrames: 16 });
          const pt = clamp01((pulse - n.i * 0.008) * 1.1);
          const lit = interpolate(pt, [0.9, 1], [0, 1], EXT);
          return (
            <div
              key={n.i}
              style={{
                position: "absolute",
                left: n.x,
                top: n.y,
                transform: `translate(-50%, -50%) scale(${interpolate(pop, [0, 1], [0.4, 1])})`,
                opacity: interpolate(pop, [0, 0.5], [0, 1], EXT),
                width: 46,
                height: 46,
                borderRadius: 10,
                border: `2px solid ${colors.skyLight}`,
                background: `linear-gradient(160deg, ${colors.blueMed}${lit > 0.5 ? "cc" : "55"}, ${colors.navy}ee)`,
                boxShadow: `0 0 ${interpolate(lit, [0, 1], [10, 34])}px ${lit > 0.5 ? signal.good : colors.skyLight}99`,
              }}
            />
          );
        })}

        {/* the one foundation */}
        <div
          style={{
            position: "absolute",
            left: CX,
            top: FY + 60,
            transform: `translate(-50%, -50%) translateY(${interpolate(slab, [0, 1], [60, 0])}px)`,
            opacity: interpolate(slab, [0, 1], [0, 1]),
            width: 520,
            height: 104,
            borderRadius: 16,
            border: `4px solid ${sides.china}`,
            background: `linear-gradient(180deg, ${colors.skyLight}55, ${colors.blueMed} 100%)`,
            boxShadow: `0 0 70px ${sides.china}66`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: fonts.display,
            fontSize: 52,
            letterSpacing: 6,
            color: colors.midnight,
          }}
        >
          EK AI MODEL
        </div>

        {/* payoff caption — sits below the foundation slab (slab bottom ≈812) */}
        <div
          style={{
            position: "absolute",
            top: 860,
            left: 0,
            width: "100%",
            textAlign: "center",
            opacity: interpolate(frame, [610, 644], [0, 1], EXT),
          }}
        >
          <span style={{ fontFamily: fonts.display, fontSize: 62, letterSpacing: 3, color: signal.good, textShadow: `0 0 28px ${signal.good}55` }}>
            FOUNDATION KE DECISIONS — HAR JAGAH.
          </span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// BEAT 3 — scale example: 113,000 Qwen versions fan out · cues 196–199 · 0–321
// ---------------------------------------------------------------------------
const BeatFanOut: React.FC = () => {
  const frame = useCurrentFrame();
  const out = interpolate(frame, [301, 321], [1, 0], EXT);

  // derivatives explode outward from one core
  const burst = interpolate(frame, [40, 200], [0, 1], { ...EXT, easing: (t) => 1 - Math.pow(1 - t, 3) });
  const count = Math.floor(burst * 120);

  return (
    <AbsoluteFill style={{ opacity: out }}>
      {/* fan-out field */}
      {Array.from({ length: count }).map((_, i) => {
        const ang = (i / 120) * Math.PI * 2 + noise2D(`fa-${i}`, 0, 0) * 0.6;
        const rr = (140 + noise2D(`fr-${i}`, i, 0) * 320 + 320) * burst;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: CX + Math.cos(ang) * rr,
              top: 470 + Math.sin(ang) * rr * 0.7,
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: signal.good,
              boxShadow: `0 0 10px ${signal.good}`,
              opacity: 0.45,
              transform: "translate(-50%, -50%)",
            }}
          />
        );
      })}

      {/* hero number */}
      <div style={{ position: "absolute", top: 360, left: 0, width: "100%", display: "flex", justifyContent: "center" }}>
        <StatCounter
          to={113000}
          suffix="+"
          startDelay={20}
          countDuration={70}
          fontSize={200}
          color={signal.good}
          accent={signal.good}
          entrance="slide"
          heroFont="heavy"
          label="QWEN VERSIONS ON HUGGING FACE"
          labelWeight={300}
          labelColor="#9FB2D8"
        />
      </div>

      <div style={{ position: "absolute", bottom: 120, left: 0, width: "100%", textAlign: "center", opacity: interpolate(frame, [150, 184], [0, 1], EXT) }}>
        <span style={{ fontFamily: fonts.display, fontSize: 58, letterSpacing: 3, color: "#EEF3FB" }}>
          EK MODEL → HAZAARON TOOLS, APPS, AGENTS.
        </span>
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// BEAT 4 — the Huawei / 5G analogy: infra is now intelligence · cues 200–208
// 0–700
// ---------------------------------------------------------------------------
// telecom tower glyph
const Tower: React.FC<{ color: string }> = ({ color }) => (
  <svg width={120} height={150} viewBox="0 0 120 150" style={{ overflow: "visible" }}>
    <line x1={60} y1={10} x2={20} y2={140} stroke={color} strokeWidth={5} strokeLinecap="round" />
    <line x1={60} y1={10} x2={100} y2={140} stroke={color} strokeWidth={5} strokeLinecap="round" />
    <line x1={38} y1={50} x2={82} y2={50} stroke={color} strokeWidth={4} />
    <line x1={31} y1={78} x2={89} y2={78} stroke={color} strokeWidth={4} />
    <line x1={24} y1={108} x2={96} y2={108} stroke={color} strokeWidth={4} />
    <path d="M44 20 Q60 -4 76 20" fill="none" stroke={color} strokeWidth={4} />
  </svg>
);

const BeatAnalogy: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const introOut = interpolate(frame, [140, 168], [1, 0], EXT);
  const rowIn = interpolate(frame, [170, 200], [0, 1], EXT);
  const rowOut = interpolate(frame, [540, 566], [1, 0], EXT);
  const qIn = interpolate(frame, [566, 596], [0, 1], EXT);
  const out = interpolate(frame, [680, 700], [1, 0], EXT);

  const oldPop = spring({ frame: frame - 200, fps, config: { damping: 14, stiffness: 120 }, durationInFrames: 18 });
  const oldDim = interpolate(frame, [320, 360], [1, 0.28], EXT);
  const aiPop = spring({ frame: frame - 360, fps, config: { damping: 12, stiffness: 120 }, durationInFrames: 18 });

  return (
    <AbsoluteFill style={{ opacity: out }}>
      {/* intro */}
      <AbsoluteFill style={{ ...CENTER, gap: 36, opacity: introOut }}>
        <KineticTitle lines={["EXPERTS ISE", "COMPARE KARTE HAIN —"]} fontSize={96} stagger={4} />
        <Badge text="HUAWEI · 5G DEBATE" color={signal.bad} startDelay={60} fontSize={34} />
      </AbsoluteFill>

      {/* old infra -> AI */}
      <AbsoluteFill style={{ opacity: rowIn * rowOut }}>
        {/* old infra (left) */}
        <div
          style={{
            position: "absolute",
            left: 520,
            top: 540,
            transform: `translate(-50%, -50%) scale(${interpolate(oldPop, [0, 1], [0.6, 1])})`,
            opacity: interpolate(oldPop, [0, 0.4], [0, 1], EXT) * oldDim,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 18,
          }}
        >
          <Tower color="#9FB2D8" />
          <span style={{ fontFamily: fonts.body, fontWeight: 600, fontSize: 30, letterSpacing: 4, color: "#9FB2D8" }}>
            CABLES · TOWERS
          </span>
        </div>

        {/* arrow */}
        <PathDraw d="M 700 480 L 1180 480" stroke={colors.skyLight} strokeWidth={5} durationInFrames={26} startDelay={300} />
        <div style={{ position: "absolute", left: 1180, top: 480, transform: "translate(-50%, -50%)", opacity: interpolate(frame, [320, 340], [0, 1], EXT), fontFamily: fonts.display, fontSize: 56, color: colors.skyLight }}>
          ›
        </div>

        {/* AI node (right) */}
        <div
          style={{
            position: "absolute",
            left: 1400,
            top: 540,
            transform: `translate(-50%, -50%) scale(${interpolate(aiPop, [0, 1], [0.5, 1])})`,
            opacity: interpolate(aiPop, [0, 0.4], [0, 1], EXT),
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 20,
          }}
        >
          <div
            style={{
              width: 180,
              height: 180,
              borderRadius: "50%",
              border: `4px solid ${sides.china}`,
              background: `radial-gradient(circle at 50% 35%, ${colors.blueMed}aa, ${colors.navy}ee)`,
              boxShadow: `0 0 ${60 + Math.sin(frame / 8) * 18}px ${sides.china}99`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: fonts.display,
              fontSize: 80,
              letterSpacing: 2,
              color: sides.china,
            }}
          >
            AI
          </div>
          <span style={{ fontFamily: fonts.display, fontSize: 44, letterSpacing: 4, color: "#FFFFFF" }}>
            INTELLIGENCE
          </span>
        </div>

        <div style={{ position: "absolute", bottom: 120, left: 0, width: "100%", textAlign: "center", opacity: interpolate(frame, [400, 430], [0, 1], EXT) }}>
          <span style={{ fontFamily: fonts.body, fontWeight: 600, fontSize: 34, letterSpacing: 3, color: "#C7D3E6" }}>
            AB — INTERNET CABLES NAHI. TELECOM TOWERS NAHI. INTELLIGENCE.
          </span>
        </div>
      </AbsoluteFill>

      {/* the question */}
      <AbsoluteFill style={{ ...CENTER, opacity: qIn }}>
        <KineticTitle
          lines={["FUTURE KA INFRASTRUCTURE", "KOI AUR BANAYE —", "LONG-TERM EFFECT?"]}
          fontSize={86}
          startDelay={572}
          stagger={3}
          accent={sides.china}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// BEAT 5 — the one-line summary: not the smartest, the default · cues 209–215
// 0–585
// ---------------------------------------------------------------------------
const BeatOneLine: React.FC = () => {
  const frame = useCurrentFrame();
  const titleOut = interpolate(frame, [110, 138], [1, 0], EXT);
  const strikeOut = interpolate(frame, [250, 280], [1, 0], EXT);
  const frontierOut = interpolate(frame, [380, 408], [1, 0], EXT);
  const out = interpolate(frame, [565, 585], [1, 0], EXT);

  return (
    <AbsoluteFill style={{ opacity: out }}>
      {/* hook */}
      <AbsoluteFill style={{ ...CENTER, opacity: titleOut }}>
        <KineticTitle lines={["POORI STORY —", "EK LINE MEIN."]} fontSize={120} stagger={5} />
      </AbsoluteFill>

      {/* kill the misconception — fade in only after the hook title clears (138) */}
      <AbsoluteFill
        style={{
          ...CENTER,
          opacity: interpolate(frame, [140, 165], [0, 1], EXT) * strikeOut,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
          <span style={{ fontFamily: fonts.body, fontWeight: 600, fontSize: 34, letterSpacing: 6, color: "#8FA3C4" }}>
            CHINA ACHANAK NAHI BANA —
          </span>
          <StrikeWord text="DUNIYA KA SABSE INTELLIGENT AI" delay={150} fontSize={78} />
        </div>
      </AbsoluteFill>

      {/* be fair: frontier still leads */}
      <AbsoluteFill style={{ ...CENTER, opacity: interpolate(frame, [290, 318], [0, 1], EXT) * frontierOut }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: fonts.body, fontWeight: 600, fontSize: 30, letterSpacing: 6, color: signal.bad }}>FRONTIER PAR ABHI BHI —</div>
          <div style={{ fontFamily: fonts.display, fontSize: 92, letterSpacing: 3, color: "#EEF3FB", marginTop: 10 }}>
            GPT-5.5 · CLAUDE MYTHOS
          </div>
          <div style={{ fontFamily: fonts.body, fontWeight: 500, fontSize: 30, letterSpacing: 3, color: "#9FB2D8", marginTop: 10 }}>
            …lead karte hain.
          </div>
        </div>
      </AbsoluteFill>

      {/* the reframe */}
      <AbsoluteFill style={{ ...CENTER, opacity: interpolate(frame, [410, 440], [0, 1], EXT) }}>
        <Trail layers={6} lagInFrames={0.1} trailOpacity={0.5}>
          <AbsoluteFill style={CENTER}>
            <KineticTitle
              lines={["RACE SMARTEST KI NAHI THI —", "RACE THI DEFAULT BANNE KI."]}
              fontSize={92}
              startDelay={418}
              stagger={4}
              accent={sides.china}
            />
          </AbsoluteFill>
        </Trail>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// BEAT 6 — the strategy: three pillars hold up the default layer · cues 216–222
// 0–453
// ---------------------------------------------------------------------------
const PILLARS = [
  { label: "OPEN WEIGHTS", x: CX - 380, delay: 40 },
  { label: "AGGRESSIVE PRICING", x: CX, delay: 60 },
  { label: "GLOBAL DISTRIBUTION", x: CX + 380, delay: 80 },
];

const BeatPillars: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const out = interpolate(frame, [433, 453], [1, 0], EXT);

  const PH = 360; // pillar max height
  const baseY = 760; // pillar bottom
  const slab = spring({ frame: frame - 150, fps, config: { damping: 200 }, durationInFrames: 22 });

  return (
    <AbsoluteFill style={{ opacity: out }}>
      <div style={{ position: "absolute", top: 90, left: 0, width: "100%", textAlign: "center", opacity: interpolate(frame, [0, 20], [0, 1], EXT) }}>
        <span style={{ fontFamily: fonts.display, fontSize: 64, letterSpacing: 3, color: "#EEF3FB" }}>
          SABSE ACCESSIBLE LAYER —
        </span>
        <div style={{ fontFamily: fonts.body, fontWeight: 600, fontSize: 30, letterSpacing: 6, color: colors.skyLight, marginTop: 8 }}>
          EK HI STRATEGY · KAI LABS
        </div>
      </div>

      {/* the slab that the pillars hold up */}
      <div
        style={{
          position: "absolute",
          left: CX,
          top: baseY - PH - 70,
          transform: `translate(-50%, 0) translateY(${interpolate(slab, [0, 1], [-40, 0])}px)`,
          opacity: interpolate(slab, [0, 1], [0, 1]),
          width: 1080,
          height: 78,
          borderRadius: 14,
          border: `4px solid ${sides.china}`,
          background: `linear-gradient(180deg, ${colors.skyLight}55, ${colors.blueMed} 100%)`,
          boxShadow: `0 0 70px ${sides.china}55`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: fonts.display,
          fontSize: 46,
          letterSpacing: 6,
          color: colors.midnight,
        }}
      >
        THE DEFAULT LAYER
      </div>

      {/* the three pillars */}
      {PILLARS.map((p) => {
        const grow = spring({ frame: frame - p.delay, fps, config: { damping: 16, stiffness: 90 }, durationInFrames: 26 });
        const h = PH * grow;
        return (
          <div key={p.label}>
            <div
              style={{
                position: "absolute",
                left: p.x,
                top: baseY - h,
                transform: "translateX(-50%)",
                width: 200,
                height: h,
                borderRadius: "12px 12px 0 0",
                background: `linear-gradient(180deg, ${colors.skyLight}aa 0%, ${colors.blueMed} 100%)`,
                boxShadow: `0 0 40px ${sides.china}44`,
                border: `2px solid ${sides.china}`,
                borderBottom: "none",
              }}
            />
            <div
              style={{
                position: "absolute",
                left: p.x,
                top: baseY + 22,
                transform: "translateX(-50%)",
                width: 320,
                textAlign: "center",
                fontFamily: fonts.body,
                fontWeight: 700,
                fontSize: 28,
                letterSpacing: 2,
                color: "#EAF4FE",
                opacity: interpolate(grow, [0.5, 1], [0, 1], EXT),
              }}
            >
              {p.label}
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// BEAT 7 — "6 of 6 wasn't an anomaly — it was a signal" · cues 223–226 · 0–350
// (callback to the hook)
// ---------------------------------------------------------------------------
const BeatSignal: React.FC = () => {
  const frame = useCurrentFrame();
  const sixOut = interpolate(frame, [160, 188], [1, 0], EXT);
  const out = interpolate(frame, [330, 350], [1, 0], EXT);

  return (
    <AbsoluteFill style={{ opacity: out }}>
      {/* the callback stat */}
      <AbsoluteFill style={{ ...CENTER, gap: 30, opacity: sixOut }}>
        <span style={{ fontFamily: fonts.body, fontWeight: 600, fontSize: 34, letterSpacing: 6, color: "#8FA3C4" }}>
          EK HAFTE KE LIYE —
        </span>
        <StatCounter to={6} suffix=" / 6" startDelay={20} countDuration={20} fontSize={200} entrance="pop" accent={sides.china} />
        <span style={{ fontFamily: fonts.display, fontSize: 52, letterSpacing: 2, color: "#EEF3FB" }}>
          MOST-USED MODELS — ALL CHINESE.
        </span>
      </AbsoluteFill>

      {/* anomaly? -> signal */}
      <AbsoluteFill style={{ ...CENTER, opacity: interpolate(frame, [190, 214], [0, 1], EXT) }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 30 }}>
          <div style={{ opacity: interpolate(frame, [260, 286], [1, 0], EXT) }}>
            <StrikeWord text="RANDOM ANOMALY?" delay={196} fontSize={84} />
          </div>
          <div style={{ opacity: interpolate(frame, [276, 300], [0, 1], EXT) }}>
            <KineticTitle lines={["YE EK SIGNAL THA."]} fontSize={120} startDelay={278} stagger={5} accent={sides.china} />
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// BEAT 8 — the real question: what are YOU building on? · cues 227–234 · 0–568
// ---------------------------------------------------------------------------
const BeatRealQuestion: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const introOut = interpolate(frame, [150, 178], [1, 0], EXT);
  const qIn = interpolate(frame, [180, 210], [0, 1], EXT);
  const qOut = interpolate(frame, [470, 498], [1, 0], EXT);
  const descIn = interpolate(frame, [498, 528], [0, 1], EXT);

  const appPop = spring({ frame: frame - 200, fps, config: { damping: 12, stiffness: 120 }, durationInFrames: 18 });

  return (
    <AbsoluteFill>
      {/* setup */}
      <AbsoluteFill style={{ ...CENTER, gap: 40, opacity: introOut }}>
        <RollingText
          text="Sawaal ye nahi ki engineers inhe use karein ya nahi —"
          startDelay={8}
          stagger={3}
          fontSize={42}
          color="#C7D3E6"
        />
        <RollingText text="kaafi log already kar rahe hain." startDelay={70} stagger={3} fontSize={36} color={colors.skyLight} />
      </AbsoluteFill>

      {/* the question + motif */}
      <AbsoluteFill style={{ opacity: qIn * qOut }}>
        {/* YOUR APP sitting on a "?" foundation */}
        <div style={{ position: "absolute", left: CX, top: 300, transform: `translate(-50%, -50%) scale(${interpolate(appPop, [0, 1], [0.6, 1])})`, opacity: interpolate(appPop, [0, 0.4], [0, 1], EXT) }}>
          <div
            style={{
              width: 300,
              padding: "28px 0",
              borderRadius: 18,
              border: `3px solid ${signal.good}`,
              background: `linear-gradient(160deg, ${colors.navy}, ${colors.midnight})`,
              boxShadow: `0 0 44px ${signal.good}44`,
              textAlign: "center",
              fontFamily: fonts.display,
              fontSize: 60,
              letterSpacing: 3,
              color: "#FFFFFF",
            }}
          >
            YOUR APP
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            left: CX,
            top: 470,
            transform: "translate(-50%, -50%)",
            width: 420,
            height: 96,
            borderRadius: 16,
            border: `4px dashed ${sides.china}`,
            background: `${colors.blueMed}22`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: fonts.display,
            fontSize: 64,
            color: sides.china,
            opacity: interpolate(frame, [230, 256], [0, 1], EXT),
          }}
        >
          ?
        </div>

        <div style={{ position: "absolute", bottom: 230, left: 0, width: "100%", textAlign: "center" }}>
          <KineticTitle lines={["KIS FOUNDATION PAR?"]} fontSize={100} startDelay={250} stagger={4} accent={sides.china} />
        </div>
        <div style={{ position: "absolute", bottom: 140, left: 0, width: "100%", textAlign: "center", opacity: interpolate(frame, [360, 390], [0, 1], EXT) }}>
          <span style={{ fontFamily: fonts.body, fontWeight: 600, fontSize: 42, letterSpacing: 3, color: "#EEF3FB" }}>
            …aur kya aap use samajhte ho?
          </span>
        </div>
      </AbsoluteFill>

      {/* description CTA */}
      <AbsoluteFill style={{ ...CENTER, opacity: descIn }}>
        <div style={{ textAlign: "center" }}>
          <RollingText
            text="Benchmarks · pricing · sources"
            startDelay={504}
            stagger={3}
            fontSize={44}
            weight={600}
            color="#EAF4FE"
          />
          <div style={{ marginTop: 20, fontFamily: fonts.display, fontSize: 64, letterSpacing: 4, color: colors.skyLight }}>
            ↓ DESCRIPTION MEIN
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// BEAT 9 — outro / end card · cues 235–239 · 0–343
// ---------------------------------------------------------------------------
const Bell: React.FC<{ color: string }> = ({ color }) => (
  <svg width={66} height={66} viewBox="0 0 72 72" style={{ overflow: "visible" }}>
    <path
      d="M36 12 C24 12 18 22 18 38 C18 50 12 54 12 54 L60 54 C60 54 54 50 54 38 C54 22 48 12 36 12 Z"
      fill="none"
      stroke={color}
      strokeWidth={5}
      strokeLinejoin="round"
    />
    <path d="M30 58 C30 64 42 64 42 58" fill="none" stroke={color} strokeWidth={5} strokeLinecap="round" />
    <circle cx={36} cy={9} r={4} fill={color} />
  </svg>
);

const BeatOutro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const subPop = spring({ frame: frame - 70, fps, config: { damping: 9, mass: 0.8 }, durationInFrames: 24 });
  const subPulse = interpolate(Math.sin(frame / 7), [-1, 1], [26, 52]);
  const bellPop = spring({ frame: frame - 96, fps, config: { damping: 8, mass: 0.6 }, durationInFrames: 20 });
  const bellWiggle = frame > 110 ? Math.sin(frame / 4) * 7 * Math.exp(-(frame - 110) / 40) : 0;

  const cardPop = spring({ frame: frame - 140, fps, config: { damping: 16 }, durationInFrames: 22 });
  const handle = spring({ frame: frame - 180, fps, config: { damping: 16 }, durationInFrames: 20 });

  return (
    <AbsoluteFill style={CENTER}>
      <KineticTitle lines={["THANKS FOR WATCHING."]} fontSize={104} stagger={4} />

      {/* subscribe + bell */}
      <div style={{ display: "flex", alignItems: "center", gap: 28, marginTop: 56 }}>
        <div
          style={{
            fontFamily: fonts.body,
            fontWeight: 800,
            fontSize: 40,
            color: "#FFFFFF",
            background: signal.bad,
            padding: "18px 50px",
            borderRadius: 12,
            letterSpacing: 1,
            transform: `scale(${interpolate(subPop, [0, 1], [0.4, 1])})`,
            opacity: interpolate(subPop, [0, 0.4], [0, 1], EXT),
            boxShadow: `0 0 ${subPulse}px ${signal.bad}`,
          }}
        >
          SUBSCRIBE
        </div>
        <div
          style={{
            transform: `scale(${interpolate(bellPop, [0, 1], [0.4, 1])}) rotate(${bellWiggle}deg)`,
            transformOrigin: "33px 8px",
            opacity: interpolate(bellPop, [0, 0.4], [0, 1], EXT),
          }}
        >
          <Bell color={colors.skyLight} />
        </div>
      </div>

      {/* next-video teaser */}
      <div
        style={{
          marginTop: 58,
          width: 620,
          height: 200,
          borderRadius: 16,
          overflow: "hidden",
          transform: `translateY(${interpolate(cardPop, [0, 1], [40, 0])}px)`,
          opacity: interpolate(cardPop, [0, 0.5], [0, 1], EXT),
          border: `1px solid ${sides.china}55`,
          background: `linear-gradient(135deg, ${colors.blueMed}33, ${colors.midnight})`,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: 26,
        }}
      >
        <div style={{ fontFamily: fonts.body, fontWeight: 700, fontSize: 20, letterSpacing: 3, color: colors.skyLight, marginBottom: 8 }}>
          ▶ WATCH NEXT
        </div>
        <div style={{ fontFamily: fonts.display, fontSize: 44, letterSpacing: 2, color: "#FFFFFF" }}>
          THE CHIP WAR, EXPLAINED
        </div>
      </div>

      {/* channel handle / bug */}
      <div
        style={{
          marginTop: 40,
          fontFamily: fonts.body,
          fontWeight: 700,
          fontSize: 30,
          letterSpacing: 2,
          color: "#9FB2D8",
          opacity: interpolate(handle, [0, 1], [0, 1]),
        }}
      >
        @yourchannel
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// ROOT
// ---------------------------------------------------------------------------
export const ChinaSection5: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const fadeOut = interpolate(frame, [durationInFrames - 18, durationInFrames], [1, 0], EXT);

  return (
    <AbsoluteFill>
      <SceneBackground />
      <AbsoluteFill style={{ opacity: fadeOut }}>
        {/* Beat 1 — ek important baat · cues 176–182 */}
        <Sequence durationInFrames={514}>
          <BeatImportant />
        </Sequence>

        {/* Beat 2 — concentration risk / propagation · cues 183–195 */}
        <Sequence from={514} durationInFrames={950}>
          <BeatConcentration />
        </Sequence>

        {/* Beat 3 — 113,000 Qwen versions fan out · cues 196–199 */}
        <Sequence from={1464} durationInFrames={321}>
          <BeatFanOut />
        </Sequence>

        {/* Beat 4 — Huawei/5G → intelligence · cues 200–208 */}
        <Sequence from={1785} durationInFrames={700}>
          <BeatAnalogy />
        </Sequence>

        {/* Beat 5 — one line: not smartest, the default · cues 209–215 */}
        <Sequence from={2485} durationInFrames={585}>
          <BeatOneLine />
        </Sequence>

        {/* Beat 6 — three pillars hold the default layer · cues 216–222 */}
        <Sequence from={3070} durationInFrames={453}>
          <BeatPillars />
        </Sequence>

        {/* Beat 7 — 6/6 was a signal (hook callback) · cues 223–226 */}
        <Sequence from={3523} durationInFrames={350}>
          <BeatSignal />
        </Sequence>

        {/* Beat 8 — the real question: what are you building on? · cues 227–234 */}
        <Sequence from={3873} durationInFrames={568}>
          <BeatRealQuestion />
        </Sequence>

        {/* Beat 9 — outro / end card · cues 235–239 */}
        <Sequence from={4441} durationInFrames={343}>
          <BeatOutro />
        </Sequence>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
