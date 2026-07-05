import React from "react";
import { useCurrentFrame } from "remotion";
import { fonts, noir } from "../theme";
import { clamp, EASE, impact, overshoot, rev } from "../mg/motion";
import { StrikeReplace } from "../mg/Kinetic";

// ---------------------------------------------------------------------------
// OVERLAY KIT — alpha-channel elements that float AROUND the talking head.
// No Board / Letterbox / Vignette / EnterExit (takeover signatures) and no
// MoStage: everything is screen-fixed. Face-safe zone: x 540–1380, y 100–860
// stays clear — elements live in the top corners, side columns, and a bottom
// strip (y ≥ 880). Every element takes `at` + `out` and fades itself away
// before its window closes, so each comp ends fully transparent.
// ---------------------------------------------------------------------------

const EXIT = 10;

// enter 0→1 (eased) times exit 1→0 over the last EXIT frames of the window
const useWindow = (at: number, out: number, enterLen = 10) => {
  const frame = useCurrentFrame();
  const on = frame >= at && frame <= out;
  const enter = EASE(rev(frame, at, enterLen));
  const exit = 1 - rev(frame, out - EXIT, EXIT);
  return { frame, on, enter, exit, alpha: clamp(enter * exit, 0, 1) };
};

const slab: React.CSSProperties = {
  background: "rgba(13,13,16,0.86)",
  boxShadow: "0 12px 40px rgba(0,0,0,0.55)",
};

// red accent span inside StripLine / chips
export const R: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span style={{ color: noir.red }}>{children}</span>
);

// --- CaseFrame — four thin corner brackets: the "case-file footage" register -
export const CaseFrame: React.FC<{ at?: number; out: number }> = ({ at = 6, out }) => {
  const { on, alpha } = useWindow(at, out, 14);
  if (!on) return null;
  const arm = 64;
  const th = 3;
  const inset = 36;
  const corner = (h: "left" | "right", v: "top" | "bottom") => (
    <div
      key={h + v}
      style={{
        position: "absolute",
        [h]: inset,
        [v]: inset,
        width: arm,
        height: arm,
        [`border${v === "top" ? "Top" : "Bottom"}`]: `${th}px solid ${noir.smoke}`,
        [`border${h === "left" ? "Left" : "Right"}`]: `${th}px solid ${noir.smoke}`,
      }}
    />
  );
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 0.5 * alpha, pointerEvents: "none" }}>
      {corner("left", "top")}
      {corner("right", "top")}
      {corner("left", "bottom")}
      {corner("right", "bottom")}
    </div>
  );
};

// --- SectionTag — persistent top-left case chip -----------------------------
export const SectionTag: React.FC<{
  at: number;
  out: number;
  kicker: string; // "CASE 02"
  label: string; // "ANDAR SE CALL"
}> = ({ at, out, kicker, label }) => {
  const { on, enter, alpha } = useWindow(at, out, 12);
  if (!on) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: 64,
        top: 56,
        display: "flex",
        alignItems: "center",
        gap: 16,
        padding: "12px 24px 10px 18px",
        ...slab,
        borderLeft: `6px solid ${noir.red}`,
        opacity: alpha,
        transform: `translateX(${-24 * (1 - enter)}px)`,
      }}
    >
      <span style={{ fontFamily: fonts.display, fontSize: 32, letterSpacing: 5, color: noir.red }}>
        {kicker}
      </span>
      <span style={{ width: 6, height: 6, background: noir.smoke, borderRadius: 3 }} />
      <span style={{ fontFamily: fonts.display, fontSize: 32, letterSpacing: 5, color: noir.paper }}>
        {label}
      </span>
    </div>
  );
};

// --- KeyChip — corner slab for names / dates / facts -------------------------
export const KeyChip: React.FC<{
  at: number;
  out: number;
  x: number;
  y: number;
  title: string;
  sub?: string;
  subAt?: number; // delay the sub-line to its own spoken moment
  accent?: boolean; // full red slab
  deadAt?: number; // frame the chip "goes dark": dims + red strike + DARK tag
  w?: number;
}> = ({ at, out, x, y, title, sub, subAt, accent, deadAt, w = 440 }) => {
  const { frame, on, enter, alpha } = useWindow(at, out, 12);
  if (!on) return null;
  const pop = overshoot(frame, at, 14);
  const dead = deadAt !== undefined ? rev(frame, deadAt, 8) : 0;
  const subA = subAt !== undefined ? rev(frame, subAt, 10) : 1;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        padding: "16px 24px 14px",
        ...slab,
        background: accent ? "rgba(126,18,32,0.92)" : slab.background,
        borderLeft: `6px solid ${accent ? noir.ember : noir.red}`,
        opacity: alpha * (1 - dead * 0.45),
        transform: `scale(${0.85 + 0.15 * pop}) translateY(${10 * (1 - enter)}px)`,
        transformOrigin: "left top",
      }}
    >
      <div
        style={{
          fontFamily: fonts.display,
          fontSize: 44,
          lineHeight: 1.04,
          letterSpacing: 3,
          color: dead > 0.5 ? noir.ash : noir.paper,
        }}
      >
        {title}
      </div>
      {sub ? (
        <div
          style={{
            fontFamily: fonts.body,
            fontSize: 20,
            fontWeight: 600,
            letterSpacing: 3,
            textTransform: "uppercase",
            color: noir.ash,
            marginTop: 6,
            opacity: subA,
          }}
        >
          {sub}
        </div>
      ) : null}
      {deadAt !== undefined && frame >= deadAt ? (
        <>
          <div
            style={{
              position: "absolute",
              left: "-2%",
              top: "46%",
              width: `${dead * 104}%`,
              height: 6,
              background: noir.red,
              transform: "rotate(-3deg)",
            }}
          />
          <div
            style={{
              position: "absolute",
              right: 12,
              top: 10,
              fontFamily: fonts.display,
              fontSize: 26,
              letterSpacing: 4,
              color: noir.red,
              opacity: clamp(dead * 1.5, 0, 1),
            }}
          >
            DARK
          </div>
        </>
      ) : null}
    </div>
  );
};

// --- CornerStamp — small bordered red stamp slam ------------------------------
export const CornerStamp: React.FC<{
  at: number;
  out: number;
  text: string;
  x: number;
  y: number;
  rot?: number;
  size?: number;
}> = ({ at, out, text, x, y, rot = -8, size = 64 }) => {
  const { frame, on, alpha } = useWindow(at, out, 7);
  if (!on) return null;
  const p = EASE(rev(frame, at, 7));
  const scale = (1.7 - 0.7 * p) * impact(frame, at + 7, 0.06, 6);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `rotate(${rot}deg) scale(${scale})`,
        transformOrigin: "center",
        opacity: alpha,
        filter: "drop-shadow(0 14px 34px rgba(0,0,0,0.6))",
      }}
    >
      <div
        style={{
          border: `${Math.max(5, size * 0.11)}px solid ${noir.red}`,
          outline: `2px solid ${noir.red}`,
          outlineOffset: 5,
          background: "rgba(10,10,12,0.45)",
          color: noir.red,
          fontFamily: fonts.display,
          fontSize: size,
          letterSpacing: size * 0.12,
          lineHeight: 1,
          padding: `${size * 0.16}px ${size * 0.34}px ${size * 0.09}px`,
          whiteSpace: "nowrap",
        }}
      >
        {text}
      </div>
    </div>
  );
};

// --- StripLine — bottom-left punch strip --------------------------------------
export const StripLine: React.FC<{
  at: number;
  out: number;
  children: React.ReactNode;
  size?: number;
  x?: number;
  y?: number;
}> = ({ at, out, children, size = 46, x = 64, y = 944 }) => {
  const { on, enter, alpha } = useWindow(at, out, 11);
  if (!on) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        display: "flex",
        alignItems: "center",
        gap: 22,
        padding: "14px 30px 10px 20px",
        ...slab,
        opacity: alpha,
        transform: `translateY(${26 * (1 - enter)}px)`,
      }}
    >
      <div style={{ width: 8, height: size * 0.92, background: noir.red, flexShrink: 0 }} />
      <div
        style={{
          fontFamily: fonts.display,
          fontSize: size,
          letterSpacing: 3.5,
          lineHeight: 1.05,
          color: noir.paper,
          whiteSpace: "nowrap",
        }}
      >
        {children}
      </div>
    </div>
  );
};

// --- MotifStrip — the recurring "SWITCH KA MALIK KAUN?" spine -----------------
export const MotifStrip: React.FC<{ at: number; out: number }> = ({ at, out }) => {
  const { frame, on, enter, alpha } = useWindow(at, out, 12);
  if (!on) return null;
  const bar = rev(frame, at + 8, 12);
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 906,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        opacity: alpha,
        filter: enter < 1 ? `blur(${5 * (1 - enter)}px)` : undefined,
        transform: `translateY(${20 * (1 - enter)}px)`,
      }}
    >
      <div style={{ padding: "12px 44px 8px", ...slab }}>
        <span style={{ fontFamily: fonts.display, fontSize: 72, letterSpacing: 8, color: noir.paper }}>
          SWITCH KA MALIK{" "}
        </span>
        <span style={{ fontFamily: fonts.display, fontSize: 72, letterSpacing: 8, color: noir.red }}>
          KAUN?
        </span>
        <div style={{ height: 7, width: `${bar * 100}%`, background: noir.red, marginTop: 6 }} />
      </div>
    </div>
  );
};

// --- QuoteCard — quote slab with attribution ----------------------------------
export const QuoteCard: React.FC<{
  at: number;
  out: number;
  x: number;
  y: number;
  w?: number;
  quote: string;
  who: string;
}> = ({ at, out, x, y, w = 560, quote, who }) => {
  const { on, enter, alpha } = useWindow(at, out, 12);
  if (!on) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        padding: "20px 28px 18px",
        ...slab,
        borderLeft: `6px solid ${noir.red}`,
        opacity: alpha,
        transform: `translateX(${-28 * (1 - enter)}px)`,
      }}
    >
      <div style={{ fontFamily: fonts.display, fontSize: 58, lineHeight: 0.6, color: noir.red }}>
        &ldquo;
      </div>
      <div
        style={{
          fontFamily: fonts.body,
          fontSize: 29,
          fontWeight: 600,
          lineHeight: 1.35,
          color: noir.paper,
          marginTop: 4,
        }}
      >
        {quote}
      </div>
      <div
        style={{
          fontFamily: fonts.body,
          fontSize: 19,
          fontWeight: 700,
          letterSpacing: 3,
          textTransform: "uppercase",
          color: noir.ash,
          marginTop: 14,
        }}
      >
        <span style={{ color: noir.red }}>—</span> {who}
      </div>
    </div>
  );
};

// --- DocChip — small paper document card (literal device) ---------------------
export const DocChip: React.FC<{
  at: number;
  out: number;
  x: number;
  y: number;
  title: string;
  tag?: string; // red band text
}> = ({ at, out, x, y, title, tag = "RESTRICTED" }) => {
  const { frame, on, enter, alpha } = useWindow(at, out, 12);
  if (!on) return null;
  const pop = overshoot(frame, at, 14);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: 360,
        background: noir.paper,
        boxShadow: "0 18px 50px rgba(0,0,0,0.6)",
        opacity: alpha,
        transform: `rotate(-2deg) scale(${0.85 + 0.15 * pop}) translateY(${-20 * (1 - enter)}px)`,
        transformOrigin: "center top",
      }}
    >
      <div
        style={{
          background: noir.red,
          color: noir.paper,
          fontFamily: fonts.display,
          fontSize: 24,
          letterSpacing: 8,
          textAlign: "center",
          padding: "8px 0 5px",
        }}
      >
        {tag}
      </div>
      <div style={{ padding: "18px 22px 20px" }}>
        <div
          style={{
            fontFamily: fonts.display,
            fontSize: 36,
            lineHeight: 1.06,
            letterSpacing: 2,
            color: noir.void,
          }}
        >
          {title}
        </div>
        <div style={{ height: 15, width: "86%", background: noir.void, marginTop: 14 }} />
        <div style={{ height: 15, width: "58%", background: noir.void, marginTop: 8 }} />
      </div>
    </div>
  );
};

// --- StrikeLine — positioned strike-and-replace beat ---------------------------
export const StrikeLine: React.FC<{
  at: number; // mount + fade-in
  strikeAt: number;
  replaceAt: number;
  out: number;
  from: string;
  to: string;
  cx: number; // center x
  y: number;
  size?: number;
}> = ({ at, strikeAt, replaceAt, out, from, to, cx, y, size = 48 }) => {
  const { on, enter, alpha } = useWindow(at, out, 10);
  if (!on) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: cx,
        top: y,
        transform: `translateX(-50%) translateY(${14 * (1 - enter)}px)`,
        padding: "18px 30px 20px",
        ...slab,
        opacity: alpha,
      }}
    >
      <StrikeReplace at={strikeAt} replaceAt={replaceAt} from={from} to={to} size={size} />
    </div>
  );
};
