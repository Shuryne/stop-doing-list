import type { ReactNode } from "react";
import { Camera, Flashlight, Lock } from "lucide-react";
import type { FrameProps } from "@/lib/frames";
import { Sheen } from "./util";

/** Shared iPhone shell — body/button colors vary per variant. `overlay` draws
 * inside the screen, above the poster (e.g. a lock-screen clock). */
function phoneShell({
  w,
  children,
  bodyBg,
  buttonBg,
  overlay,
}: {
  w: number;
  children: ReactNode;
  bodyBg: string;
  buttonBg: string;
  overlay?: ReactNode;
}) {
  const bezel = Math.max(w * 0.032, 10);
  const screenR = w * 0.15;
  const outerR = screenR + bezel;
  const island = { w: w * 0.3, h: Math.max(w * 0.07, 16) };
  const btn = Math.max(w * 0.014, 4);
  // mute switch + two volume keys (left), side button (right)
  const sideButtons: { edge: "left" | "right"; top: string; height: string }[] =
    [
      { edge: "left", top: "20%", height: "5%" },
      { edge: "left", top: "29%", height: "8%" },
      { edge: "left", top: "40%", height: "8%" },
      { edge: "right", top: "32%", height: "11%" },
    ];

  return (
    <div className="relative">
      {sideButtons.map((b, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            [b.edge]: -btn * 0.5,
            top: b.top,
            height: b.height,
            width: btn,
            borderRadius: btn,
            background: buttonBg,
          }}
        />
      ))}

      <div
        className="relative"
        style={{
          padding: bezel,
          borderRadius: outerR,
          background: bodyBg,
          boxShadow:
            "0 0 0 1px rgba(0,0,0,0.35), 0 2px 2px rgba(255,255,255,0.28) inset, 0 60px 120px -30px rgba(0,0,0,0.55), 0 10px 28px -14px rgba(0,0,0,0.45)",
        }}
      >
        <div
          className="relative"
          style={{ borderRadius: screenR, boxShadow: "0 0 0 2px rgba(0,0,0,0.5)" }}
        >
          <div
            className="relative overflow-hidden"
            style={{ borderRadius: screenR }}
          >
            {children}
            {overlay}
            <div
              className="absolute left-1/2 -translate-x-1/2 rounded-full bg-black"
              style={{ top: bezel * 0.55, width: island.w, height: island.h }}
            />
            <Sheen radius={screenR} />
          </div>
        </div>
      </div>
    </div>
  );
}

export function IPhoneBlack({ w, children }: FrameProps) {
  return phoneShell({
    w,
    children,
    bodyBg: "linear-gradient(150deg,#48484c,#0e0e10 52%,#2a2a2d)",
    buttonBg: "linear-gradient(90deg,#2c2c2f,#464649)",
  });
}

export function IPhoneSilver({ w, children }: FrameProps) {
  return phoneShell({
    w,
    children,
    bodyBg: "linear-gradient(150deg,#f2f2f4,#c4c4c9 52%,#e4e4e8)",
    buttonBg: "linear-gradient(90deg,#b6b6bb,#dedee2)",
  });
}

/** Bezel-less rounded screen — minimal, just corners + shadow. */
export function PhonePlain({ w, children }: FrameProps) {
  const r = w * 0.16;
  return (
    <div
      className="relative overflow-hidden"
      style={{
        borderRadius: r,
        boxShadow:
          "0 0 0 1px rgba(0,0,0,0.08), 0 45px 100px -30px rgba(0,0,0,0.45)",
      }}
    >
      {children}
      <Sheen radius={r} />
    </div>
  );
}

/** iOS lock-screen overlay: big clock, lock glyph, torch/camera, home bar.
 * Placeholder time (Apple's canonical 9:41) — decorative, never exported. */
function LockOverlay({ w }: { w: number }) {
  const circle = Math.max(w * 0.105, 34);
  const btn = "flex items-center justify-center rounded-full backdrop-blur-md";
  return (
    <div
      className="pointer-events-none absolute inset-0 flex flex-col items-center text-white"
      style={{ textShadow: "0 1px 5px rgba(0,0,0,0.35)" }}
    >
      <div className="flex flex-col items-center" style={{ marginTop: "13%" }}>
        <Lock size={w * 0.045} color="white" strokeWidth={2.4} />
        <div
          style={{
            fontSize: w * 0.15,
            fontWeight: 500,
            lineHeight: 1,
            letterSpacing: "0.01em",
            marginTop: w * 0.02,
          }}
        >
          9:41
        </div>
      </div>
      <div className="flex-1" />
      <div
        className="flex w-full items-center justify-between"
        style={{ paddingLeft: "9%", paddingRight: "9%", marginBottom: "7%" }}
      >
        <span
          className={btn}
          style={{ width: circle, height: circle, background: "rgba(30,30,30,0.45)" }}
        >
          <Flashlight size={w * 0.05} color="white" />
        </span>
        <span
          className={btn}
          style={{ width: circle, height: circle, background: "rgba(30,30,30,0.45)" }}
        >
          <Camera size={w * 0.05} color="white" />
        </span>
      </div>
      <div
        style={{
          width: w * 0.34,
          height: Math.max(w * 0.011, 4),
          borderRadius: 999,
          background: "rgba(255,255,255,0.85)",
          marginBottom: "3%",
        }}
      />
    </div>
  );
}

/** iPhone showing the poster as a lock-screen wallpaper. */
export function IOSLock({ w, children }: FrameProps) {
  return phoneShell({
    w,
    children,
    bodyBg: "linear-gradient(150deg,#48484c,#0e0e10 52%,#2a2a2d)",
    buttonBg: "linear-gradient(90deg,#2c2c2f,#464649)",
    overlay: <LockOverlay w={w} />,
  });
}

/** iPhone tilted in 3D — a floating 3/4 product shot. */
export function IPhoneAngled({ w, children }: FrameProps) {
  return (
    <div style={{ perspective: `${w * 3.2}px` }}>
      <div
        style={{
          transform: "rotateY(-19deg) rotateX(5deg) rotate(-1deg)",
          transformStyle: "preserve-3d",
          filter: "drop-shadow(24px 44px 46px rgba(0,0,0,0.4))",
        }}
      >
        {phoneShell({
          w,
          children,
          bodyBg: "linear-gradient(150deg,#48484c,#0e0e10 52%,#2a2a2d)",
          buttonBg: "linear-gradient(90deg,#2c2c2f,#464649)",
        })}
      </div>
    </div>
  );
}
