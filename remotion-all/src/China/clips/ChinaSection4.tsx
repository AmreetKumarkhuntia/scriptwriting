import {
  AbsoluteFill,
  interpolate,
  Sequence,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Trail } from "@remotion/motion-blur";
import { colors, fonts, sides, signal } from "../theme";
import { SceneBackground } from "../components/SceneBackground";
import { KineticTitle } from "../components/KineticTitle";
import { RollingText } from "../components/RollingText";
import { StatCounter } from "../components/StatCounter";
import { ComparisonBarChart } from "../components/ComparisonBarChart";
import { PathDraw } from "../../shared/effects";

// SECTION 4 — THE PROOF · cues 133–175 · 5:43–7:34. 3351 frames @ 30fps.
// Answers Section 3's re-hook ("kaun banega default layer?") with hard adoption
// data: 61% of OpenRouter tokens, 12.7x YoY, programming 11%→50%+, HF 41% vs
// 36.5% — then turns dark ("lekin story yahan khatam nahi hoti") into Section 5.
// Numbers from script.md / research.md. China = green/skyLight, US = red/royal.

const EXT = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const CENTER: React.CSSProperties = {
  justifyContent: "center",
  alignItems: "center",
};
const CX = 960;

// ---------------------------------------------------------------------------
// Small shared glyphs
// ---------------------------------------------------------------------------
const Check: React.FC<{ color: string; size?: number }> = ({ color, size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ overflow: "visible" }}>
    <path
      d="M4 12 l5 5 L20 6"
      fill="none"
      stroke={color}
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// A labelled node tile (the "product" / "model" box motif from Section 3).
const Tile: React.FC<{
  title: string;
  sub: string;
  color: string;
  w?: number;
  h?: number;
}> = ({ title, sub, color, w = 320, h = 130 }) => (
  <div
    style={{
      width: w,
      height: h,
      borderRadius: 18,
      border: `3px solid ${color}`,
      background: `linear-gradient(160deg, ${colors.navy} 0%, ${colors.midnight} 100%)`,
      boxShadow: `0 0 44px ${color}44`,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
    }}
  >
    <div style={{ fontFamily: fonts.display, fontSize: 56, letterSpacing: 3, color: "#EEF3FB", lineHeight: 1 }}>
      {title}
    </div>
    <div style={{ fontFamily: fonts.body, fontWeight: 500, fontSize: 22, letterSpacing: 3, color }}>
      {sub}
    </div>
  </div>
);

// ---------------------------------------------------------------------------
// BEAT 1a — real-world proof: Cursor's Composer is a fine-tuned Kimi K2.5
// (Moonshot's open-weight model; Cursor confirmed Composer is built on it) ·
// cues 133–139 · local 0–550
// ---------------------------------------------------------------------------
const BeatProof: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const introOut = interpolate(frame, [140, 170], [1, 0], EXT);
  const exIn = interpolate(frame, [180, 206], [0, 1], EXT);
  const kimi = spring({ frame: frame - 200, fps, config: { damping: 14, stiffness: 120 }, durationInFrames: 20 });
  const composer = spring({ frame: frame - 300, fps, config: { damping: 14, stiffness: 120 }, durationInFrames: 20 });
  const arrowDraw = interpolate(frame, [264, 320], [0, 1], EXT);
  const out = interpolate(frame, [524, 548], [1, 0], EXT);

  const kimiY = 370; // base / source node (center)
  const compY = 710; // derived fine-tuned node
  const arrowY0 = 450;
  const arrowLen = 150;
  const headOpacity = interpolate(arrowDraw, [0.85, 1], [0, 1], EXT);

  return (
    <AbsoluteFill style={{ opacity: out }}>
      {/* Intro — continues Section 3's thesis */}
      <AbsoluteFill style={{ ...CENTER, opacity: introOut }}>
        <KineticTitle lines={["ABHI — CHINA", "KAAFI AAGE HAI."]} fontSize={104} stagger={4} accent={sides.china} />
      </AbsoluteFill>

      {/* The concrete example: Kimi (base) → fine-tuned → Composer (Cursor) */}
      <AbsoluteFill style={{ opacity: exIn }}>
        <div style={{ position: "absolute", top: 110, left: 0, width: "100%", textAlign: "center" }}>
          <span style={{ fontFamily: fonts.body, fontWeight: 600, fontSize: 30, letterSpacing: 10, color: "#8FA3C4" }}>
            FOR EXAMPLE —
          </span>
        </div>

        {/* KIMI K2.5 — the open base model, centered */}
        <div
          style={{
            position: "absolute",
            left: CX,
            top: kimiY,
            transform: `translate(-50%, -50%) scale(${interpolate(kimi, [0, 1], [0.6, 1])})`,
            opacity: interpolate(kimi, [0, 0.4], [0, 1], EXT),
          }}
        >
          <Tile title="KIMI K2.5" sub="MOONSHOT · OPEN WEIGHTS" color={signal.good} w={460} h={156} />
        </div>

        {/* fine-tune arrow Kimi → Composer */}
        <svg width={1920} height={1080} style={{ position: "absolute", top: 0, left: 0, overflow: "visible" }}>
          <path
            d={`M ${CX} ${arrowY0} L ${CX} ${arrowY0 + arrowLen}`}
            fill="none"
            stroke={sides.china}
            strokeWidth={5}
            strokeDasharray={arrowLen}
            strokeDashoffset={arrowLen * (1 - arrowDraw)}
            style={{ filter: `drop-shadow(0 0 8px ${sides.china})` }}
          />
          <path
            d={`M ${CX - 14} ${arrowY0 + arrowLen - 16} L ${CX} ${arrowY0 + arrowLen + 4} L ${CX + 14} ${arrowY0 + arrowLen - 16}`}
            fill="none"
            stroke={sides.china}
            strokeWidth={5}
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={headOpacity}
            style={{ filter: `drop-shadow(0 0 8px ${sides.china})` }}
          />
        </svg>
        <div style={{ position: "absolute", left: CX + 28, top: arrowY0 + 52, fontFamily: fonts.body, fontWeight: 700, fontSize: 26, letterSpacing: 4, color: sides.china, opacity: arrowDraw }}>
          FINE-TUNED
        </div>

        {/* CURSOR · COMPOSER — the fine-tuned derivative */}
        <div
          style={{
            position: "absolute",
            left: CX,
            top: compY,
            transform: `translate(-50%, -50%) scale(${interpolate(composer, [0, 1], [0.6, 1])})`,
            opacity: interpolate(composer, [0, 0.4], [0, 1], EXT),
          }}
        >
          <Tile title="COMPOSER" sub="· CURSOR ·" color={colors.skyLight} w={320} h={120} />
        </div>

        <div style={{ position: "absolute", top: compY + 86, left: 0, width: "100%", textAlign: "center" }}>
          <RollingText text="Cursor's Composer = fine-tuned Kimi K2.5" startDelay={350} stagger={3} fontSize={34} weight={600} color={sides.china} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// BEAT 1b — fine-tuned for everything → "did the approach work?" · cues 140–145
// local 0–460
// ---------------------------------------------------------------------------
const FT_CHIPS = ["CODING", "AGENTS", "TRANSLATION", "VISION", "VOICE"];

const BeatFineTune: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const chipsOut = interpolate(frame, [196, 224], [1, 0], EXT);
  const headIn = interpolate(frame, [8, 30], [0, 1], EXT);

  return (
    <AbsoluteFill>
      {/* fine-tune branches — vertically centered block */}
      <AbsoluteFill style={{ ...CENTER, opacity: chipsOut }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 70 }}>
          <div style={{ textAlign: "center", opacity: headIn }}>
            <div style={{ fontFamily: fonts.display, fontSize: 64, letterSpacing: 4, color: "#EEF3FB" }}>
              EK OPEN MODEL → SAB KUCH
            </div>
            <div style={{ fontFamily: fonts.body, fontWeight: 600, fontSize: 28, letterSpacing: 6, color: signal.good, marginTop: 8 }}>
              FINE-TUNED · MOSTLY OPEN SOURCE
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "center", gap: 36 }}>
            {FT_CHIPS.map((c, i) => {
              const p = spring({ frame: frame - (40 + i * 16), fps, config: { damping: 14, stiffness: 130 }, durationInFrames: 18 });
              return (
                <div
                  key={c}
                  style={{
                    transform: `translateY(${interpolate(p, [0, 1], [40, 0])}px) scale(${interpolate(p, [0, 1], [0.7, 1])})`,
                    opacity: interpolate(p, [0, 1], [0, 1]),
                    padding: "18px 30px",
                    borderRadius: 12,
                    border: `2px solid ${sides.china}`,
                    background: `linear-gradient(180deg, ${colors.blueMed}cc, ${colors.navy}ee)`,
                    boxShadow: `0 0 26px ${sides.china}44`,
                    fontFamily: fonts.body,
                    fontWeight: 600,
                    fontSize: 26,
                    letterSpacing: 2,
                    color: "#EAF4FE",
                  }}
                >
                  {c}
                </div>
              );
            })}
          </div>
        </div>
      </AbsoluteFill>

      {/* the pivot question */}
      <AbsoluteFill style={{ ...CENTER, opacity: interpolate(frame, [230, 256], [0, 1], EXT) }}>
        <Trail layers={5} lagInFrames={0.08} trailOpacity={0.5}>
          <AbsoluteFill style={CENTER}>
            <KineticTitle lines={["PAR — KYA YE", "APPROACH KAAM KI?"]} fontSize={108} startDelay={236} stagger={4} accent={sides.china} />
          </AbsoluteFill>
        </Trail>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// BEAT 2 — 61% OpenRouter token share (radial donut) · cues 146–150 · local 0–500
// ---------------------------------------------------------------------------
const CHIPS_REAL = ["REAL DEVELOPERS", "REAL APPS", "REAL MONEY"];

const BeatDonut: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cy = 460;
  const r = 200;
  const C = 2 * Math.PI * r;
  const targetFrac = 0.61;
  const sweep = interpolate(frame, [24, 200], [0, targetFrac], { ...EXT, easing: (t) => 1 - Math.pow(1 - t, 3) });
  const out = interpolate(frame, [478, 500], [1, 0], EXT);

  return (
    <AbsoluteFill style={{ opacity: out }}>
      <div style={{ position: "absolute", top: 70, left: 0, width: "100%", textAlign: "center", opacity: interpolate(frame, [0, 20], [0, 1], EXT) }}>
        <span style={{ fontFamily: fonts.display, fontSize: 60, letterSpacing: 3, color: "#EEF3FB" }}>
          NUMBERS SAAF HAIN.
        </span>
      </div>

      <svg width={1920} height={1080} style={{ position: "absolute", top: 0, left: 0 }}>
        {/* track */}
        <circle cx={CX} cy={cy} r={r} fill="none" stroke={`${colors.royal}aa`} strokeWidth={56} />
        {/* china arc */}
        <circle
          cx={CX}
          cy={cy}
          r={r}
          fill="none"
          stroke={signal.good}
          strokeWidth={56}
          strokeLinecap="butt"
          strokeDasharray={`${C * sweep} ${C}`}
          transform={`rotate(-90 ${CX} ${cy})`}
          style={{ filter: `drop-shadow(0 0 16px ${signal.good}88)` }}
        />
      </svg>

      {/* center counter */}
      <div style={{ position: "absolute", left: CX, top: cy, transform: "translate(-50%, -50%)" }}>
        <StatCounter to={61} suffix="%" startDelay={24} countDuration={176} fontSize={150} color={signal.good} accent={signal.good} entrance="slide" />
      </div>

      <div style={{ position: "absolute", top: cy + r + 50, left: 0, width: "100%", textAlign: "center", opacity: interpolate(frame, [180, 210], [0, 1], EXT) }}>
        <span style={{ fontFamily: fonts.body, fontWeight: 700, fontSize: 32, letterSpacing: 6, color: colors.skyLight }}>
          OPENROUTER · CHINESE MODELS' TOKEN SHARE
        </span>
      </div>

      {/* "ye sirf traffic nahi" — real chips */}
      <div style={{ position: "absolute", top: 880, left: 0, width: "100%", display: "flex", justifyContent: "center", gap: 30 }}>
        {CHIPS_REAL.map((c, i) => {
          const p = spring({ frame: frame - (300 + i * 14), fps, config: { damping: 14, stiffness: 130 }, durationInFrames: 16 });
          return (
            <div
              key={c}
              style={{
                transform: `scale(${interpolate(p, [0, 1], [0.7, 1])})`,
                opacity: interpolate(p, [0, 1], [0, 1]),
                padding: "14px 28px",
                borderRadius: 999,
                border: `2px solid ${signal.good}`,
                background: `${signal.goodDeep}33`,
                fontFamily: fonts.body,
                fontWeight: 700,
                fontSize: 26,
                letterSpacing: 2,
                color: signal.good,
              }}
            >
              {c}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// BEAT 3 — 12.7x YoY growth (rising line) · cues 152–153 · local 0–190
// ---------------------------------------------------------------------------
const BeatGrowth: React.FC = () => {
  const frame = useCurrentFrame();
  const out = interpolate(frame, [168, 190], [1, 0], EXT);
  const dotIn = interpolate(frame, [70, 86], [0, 1], EXT);

  return (
    <AbsoluteFill style={{ opacity: out }}>
      <div style={{ position: "absolute", top: 110, left: 0, width: "100%", textAlign: "center", opacity: interpolate(frame, [0, 18], [0, 1], EXT) }}>
        <span style={{ fontFamily: fonts.display, fontSize: 56, letterSpacing: 4, color: "#EEF3FB" }}>
          AUR YE TRAFFIC PHAT RAHA HAI.
        </span>
      </div>

      <PathDraw
        d="M 360 820 C 700 800, 1050 720, 1300 430 S 1500 230, 1560 200"
        stroke={signal.good}
        strokeWidth={8}
        durationInFrames={70}
        startDelay={10}
      />

      {/* end-point glow + multiplier */}
      <div style={{ position: "absolute", left: 1560, top: 200, transform: "translate(-50%, -50%)", opacity: dotIn }}>
        <div style={{ width: 26, height: 26, borderRadius: "50%", background: signal.good, boxShadow: `0 0 30px ${signal.good}` }} />
      </div>
      <div style={{ position: "absolute", left: 1180, top: 280, transform: "translate(-50%, -50%)", opacity: dotIn }}>
        <StatCounter to={12.7} decimals={1} suffix="×" startDelay={70} countDuration={40} fontSize={150} color={signal.good} accent={signal.good} label="YoY TOKEN USAGE" entrance="pop" />
      </div>

      <div style={{ position: "absolute", left: 320, top: 850, fontFamily: fonts.body, fontWeight: 500, fontSize: 26, letterSpacing: 2, color: "#8FA3C4" }}>
        LAST YEAR
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// BEAT 4 — programming 11% → 50%+ (area chart) + WHY · cues 153–164 · local 0–815
// ---------------------------------------------------------------------------
const X0 = 360;
const X1 = 1560;
const Y_BASE = 820; // 0% — plot vertically centered in frame
const Y_TOP = 300; // 100%
const yAt = (p: number) => Y_BASE - (p / 100) * (Y_BASE - Y_TOP);

const WHY_DRIVERS = ["CODING AGENTS", "AUTONOMOUS WORKFLOWS", "BACKGROUND AI"];

const BeatProgramming: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase A — area chart (local 0–330); Phase B — the WHY stack (330–815).
  const chartOut = interpolate(frame, [320, 348], [1, 0], EXT);
  const whyIn = interpolate(frame, [350, 374], [0, 1], EXT);
  const out = interpolate(frame, [794, 815], [1, 0], EXT);

  const reveal = interpolate(frame, [24, 230], [0, X1 - X0], { ...EXT, easing: (t) => 1 - Math.pow(1 - t, 3) });
  const yMid = yAt(50);
  const areaD = `M ${X0} ${Y_BASE} L ${X0} ${yAt(11)} C 760 ${yAt(15)}, 1100 ${yAt(38)}, ${X1} ${yAt(52)} L ${X1} ${Y_BASE} Z`;
  const lineD = `M ${X0} ${yAt(11)} C 760 ${yAt(15)}, 1100 ${yAt(38)}, ${X1} ${yAt(52)}`;

  return (
    <AbsoluteFill style={{ opacity: out }}>
      {/* PHASE A — area chart */}
      <AbsoluteFill style={{ opacity: chartOut }}>
        <div style={{ position: "absolute", top: 190, left: 0, width: "100%", textAlign: "center", opacity: interpolate(frame, [0, 20], [0, 1], EXT) }}>
          <span style={{ fontFamily: fonts.body, fontWeight: 700, fontSize: 34, letterSpacing: 6, color: colors.skyLight }}>
            PROGRAMMING · SHARE OF OPENROUTER USAGE
          </span>
        </div>

        <svg width={1920} height={1080} style={{ position: "absolute", top: 0, left: 0 }}>
          <defs>
            <linearGradient id="progArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={`${signal.good}99`} />
              <stop offset="100%" stopColor={`${signal.good}10`} />
            </linearGradient>
            <clipPath id="progReveal">
              <rect x={X0} y={0} width={reveal} height={1080} />
            </clipPath>
          </defs>

          {/* axes */}
          <line x1={X0} y1={Y_BASE} x2={X1} y2={Y_BASE} stroke={`${colors.skyLight}55`} strokeWidth={3} />
          {/* 50% midline */}
          <line x1={X0} y1={yMid} x2={X1} y2={yMid} stroke="#FFFFFF55" strokeWidth={2} strokeDasharray="10 10" />

          <g clipPath="url(#progReveal)">
            <path d={areaD} fill="url(#progArea)" />
            <path d={lineD} fill="none" stroke={signal.good} strokeWidth={6} style={{ filter: `drop-shadow(0 0 10px ${signal.good}88)` }} />
          </g>
        </svg>

        {/* axis + endpoint labels */}
        <div style={{ position: "absolute", left: X0, top: Y_BASE + 20, transform: "translateX(-50%)", fontFamily: fonts.body, fontWeight: 600, fontSize: 26, color: "#8FA3C4" }}>2025</div>
        <div style={{ position: "absolute", left: X1, top: Y_BASE + 20, transform: "translateX(-50%)", fontFamily: fonts.body, fontWeight: 600, fontSize: 26, color: "#8FA3C4" }}>2026</div>
        <div style={{ position: "absolute", left: X0 - 90, top: yAt(11) - 30, fontFamily: fonts.display, fontSize: 56, color: "#C7D3E6", opacity: interpolate(frame, [40, 60], [0, 1], EXT) }}>11%</div>
        <div style={{ position: "absolute", left: X1 - 110, top: yAt(52) - 80, fontFamily: fonts.display, fontSize: 90, color: signal.good, textShadow: `0 0 28px ${signal.good}66`, opacity: interpolate(frame, [200, 226], [0, 1], EXT) }}>50%+</div>
        <div style={{ position: "absolute", left: X1 + 12, top: yMid - 18, fontFamily: fonts.body, fontWeight: 600, fontSize: 22, color: "#FFFFFFaa" }}>50%</div>
      </AbsoluteFill>

      {/* PHASE B — why it happened */}
      <AbsoluteFill style={{ opacity: whyIn }}>
        <div style={{ position: "absolute", top: 120, left: 0, width: "100%", textAlign: "center" }}>
          <span style={{ fontFamily: fonts.display, fontSize: 64, letterSpacing: 3, color: "#EEF3FB" }}>YE BADHA — KYUN?</span>
        </div>

        <div style={{ position: "absolute", top: 280, left: 0, width: "100%", display: "flex", justifyContent: "center", gap: 30 }}>
          {WHY_DRIVERS.map((d, i) => {
            const p = spring({ frame: frame - (374 + i * 18), fps, config: { damping: 14, stiffness: 120 }, durationInFrames: 18 });
            return (
              <div
                key={d}
                style={{
                  transform: `translateY(${interpolate(p, [0, 1], [40, 0])}px) scale(${interpolate(p, [0, 1], [0.7, 1])})`,
                  opacity: interpolate(p, [0, 1], [0, 1]),
                  padding: "22px 32px",
                  borderRadius: 14,
                  border: `2px solid ${sides.china}`,
                  background: `linear-gradient(180deg, ${colors.blueMed}cc, ${colors.navy}ee)`,
                  boxShadow: `0 0 26px ${sides.china}44`,
                  fontFamily: fonts.body,
                  fontWeight: 700,
                  fontSize: 28,
                  letterSpacing: 2,
                  color: "#EAF4FE",
                }}
              >
                {d}
              </div>
            );
          })}
        </div>

        {/* chain → volume → price → cost #1 → ready */}
        <div style={{ position: "absolute", top: 480, left: 0, width: "100%", textAlign: "center", opacity: interpolate(frame, [440, 466], [0, 1], EXT) }}>
          <span style={{ fontFamily: fonts.body, fontWeight: 600, fontSize: 36, letterSpacing: 3, color: "#C7D3E6" }}>↓ MASSIVE TOKEN VOLUME · PRICE SABSE ZYADA MATTER KARTA HAI</span>
        </div>

        <AbsoluteFill style={{ ...CENTER, opacity: interpolate(frame, [500, 524], [0, 1], EXT) }}>
          <div style={{ marginTop: 220, textAlign: "center" }}>
            <div style={{ fontFamily: fonts.display, fontSize: 96, letterSpacing: 4, color: signal.bad, textShadow: `0 0 30px ${signal.bad}55` }}>COST = #1 FACTOR</div>
          </div>
        </AbsoluteFill>

        <div style={{ position: "absolute", bottom: 90, left: 0, width: "100%", textAlign: "center", opacity: interpolate(frame, [600, 628], [0, 1], EXT) }}>
          <span style={{ fontFamily: fonts.display, fontSize: 66, letterSpacing: 3, color: signal.good, textShadow: `0 0 28px ${signal.good}55` }}>
            CHINESE MODELS PEHLE SE READY THE.
          </span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// BEAT 5 — Hugging Face: China 41% vs US 36.5% · cues 165–170 · local 0–437
// ---------------------------------------------------------------------------
const BeatHF: React.FC = () => {
  const frame = useCurrentFrame();
  const out = interpolate(frame, [416, 437], [1, 0], EXT);

  return (
    <AbsoluteFill style={{ ...CENTER, opacity: out }}>
      <div style={{ position: "absolute", top: 90, left: 0, width: "100%", textAlign: "center", opacity: interpolate(frame, [0, 20], [0, 1], EXT) }}>
        <span style={{ fontFamily: fonts.display, fontSize: 60, letterSpacing: 3, color: "#EEF3FB" }}>HUGGING FACE PAR BHI WAHI.</span>
      </div>

      <div style={{ marginTop: 60 }}>
        <ComparisonBarChart
          bars={[
            { label: "CHINA", value: 41, side: "china" },
            { label: "USA", value: 36.5, side: "us" },
          ]}
          maxValue={50}
          format={(n) => `${n.toFixed(1)}%`}
          startDelay={24}
          stagger={14}
          height={420}
          barWidth={200}
          axisTitle="FOUNDATION-MODEL DOWNLOADS"
        />
      </div>

      <div style={{ position: "absolute", bottom: 120, left: 0, width: "100%", textAlign: "center", opacity: interpolate(frame, [120, 150], [0, 1], EXT) }}>
        <span style={{ fontFamily: fonts.display, fontSize: 58, letterSpacing: 2, color: signal.good, textShadow: `0 0 26px ${signal.good}55` }}>
          ↑ CHINA ALREADY AAGE NIKAL CHUKA HAI.
        </span>
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// BEAT 6 — "today's reality" + good news → the dark turn · cues 171–175 · local 0–399
// ---------------------------------------------------------------------------
const GOOD = ["POWERFUL", "OPEN", "SASTA"];

const BeatTurn: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const stamp = spring({ frame: frame - 6, fps, config: { damping: 12, stiffness: 140 }, durationInFrames: 18 });
  const stampOut = interpolate(frame, [96, 118], [1, 0], EXT);
  // Fully clear the good-news block before the turn line lands (no ghost overlap).
  const goodOut = interpolate(frame, [236, 264], [1, 0], EXT);
  // the green→red drain
  const drain = interpolate(frame, [244, 330], [0, 0.42], EXT);

  return (
    <AbsoluteFill>
      {/* TODAY stamp */}
      <AbsoluteFill style={{ ...CENTER, opacity: stampOut }}>
        <div
          style={{
            textAlign: "center",
            transform: `scale(${interpolate(stamp, [0, 1], [2.1, 1])}) rotate(${interpolate(stamp, [0, 1], [-8, -4], EXT)}deg)`,
            opacity: interpolate(stamp, [0, 0.4], [0, 1], EXT),
          }}
        >
          <div style={{ fontFamily: fonts.body, fontWeight: 600, fontSize: 40, letterSpacing: 8, color: "#8FA3C4" }}>YE FUTURE PREDICTION NAHI —</div>
          <div style={{ fontFamily: fonts.display, fontSize: 150, letterSpacing: 6, color: signal.good, border: `6px solid ${signal.good}`, padding: "8px 40px", borderRadius: 14, marginTop: 14, textShadow: `0 0 30px ${signal.good}66` }}>
            AAJ KI REALITY
          </div>
        </div>
      </AbsoluteFill>

      {/* good news */}
      <AbsoluteFill style={{ ...CENTER, opacity: interpolate(frame, [124, 150], [0, 1], EXT) }}>
        <div style={{ opacity: goodOut, textAlign: "center" }}>
          <div style={{ fontFamily: fonts.body, fontWeight: 600, fontSize: 34, letterSpacing: 6, color: "#C7D3E6", marginBottom: 40 }}>
            DEVELOPER HO? YE GOOD NEWS HAI —
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: 60 }}>
            {GOOD.map((g, i) => {
              const p = spring({ frame: frame - (150 + i * 16), fps, config: { damping: 14, stiffness: 130 }, durationInFrames: 16 });
              return (
                <div key={g} style={{ display: "flex", alignItems: "center", gap: 14, opacity: interpolate(p, [0, 1], [0, 1]), transform: `scale(${interpolate(p, [0, 1], [0.7, 1])})` }}>
                  <Check color={signal.good} size={48} />
                  <span style={{ fontFamily: fonts.display, fontSize: 72, letterSpacing: 3, color: "#EEF3FB" }}>{g}</span>
                </div>
              );
            })}
          </div>
        </div>
      </AbsoluteFill>

      {/* the drain overlay */}
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at center, ${signal.bad}00 25%, ${signal.badDeep} 100%)`, opacity: drain }} />

      {/* the turn */}
      <AbsoluteFill style={{ ...CENTER, opacity: interpolate(frame, [250, 276], [0, 1], EXT) }}>
        <Trail layers={6} lagInFrames={0.1} trailOpacity={0.45}>
          <AbsoluteFill style={CENTER}>
            <KineticTitle lines={["LEKIN —", "STORY YAHAN", "KHATAM NAHI HOTI."]} fontSize={104} startDelay={258} stagger={4} color="#F4D6DA" accent={signal.bad} />
          </AbsoluteFill>
        </Trail>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// ROOT
// ---------------------------------------------------------------------------
export const ChinaSection4: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const fadeOut = interpolate(frame, [durationInFrames - 18, durationInFrames], [1, 0], EXT);

  return (
    <AbsoluteFill>
      <SceneBackground />
      <AbsoluteFill style={{ opacity: fadeOut }}>
        {/* Beat 1a — Cursor·Composer built on GLM · cues 133–139 */}
        <Sequence durationInFrames={550}>
          <BeatProof />
        </Sequence>

        {/* Beat 1b — fine-tuned everything → did it work? · cues 140–145 */}
        <Sequence from={550} durationInFrames={460}>
          <BeatFineTune />
        </Sequence>

        {/* Beat 2 — 61% token share (donut) · cues 146–150 */}
        <Sequence from={1010} durationInFrames={500}>
          <BeatDonut />
        </Sequence>

        {/* Beat 3 — 12.7x YoY growth · cues 152–153 */}
        <Sequence from={1510} durationInFrames={190}>
          <BeatGrowth />
        </Sequence>

        {/* Beat 4 — programming 11%→50%+ + why · cues 153–164 */}
        <Sequence from={1700} durationInFrames={815}>
          <BeatProgramming />
        </Sequence>

        {/* Beat 5 — Hugging Face 41% vs 36.5% · cues 165–170 */}
        <Sequence from={2515} durationInFrames={437}>
          <BeatHF />
        </Sequence>

        {/* Beat 6 — today's reality + the dark turn · cues 171–175 */}
        <Sequence from={2952} durationInFrames={399}>
          <BeatTurn />
        </Sequence>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
