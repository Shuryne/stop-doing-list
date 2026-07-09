import type { ReactNode } from "react";
import type { FrameProps } from "@/lib/frames";
import { Sheen } from "./util";

/** Shared matted picture frame — frame/mat tones vary per variant. */
function matFrame({
  w,
  children,
  frameBg,
  matBg,
  frameK,
  matK,
  radius = 3,
}: {
  w: number;
  children: ReactNode;
  frameBg: string;
  matBg: string;
  frameK: number;
  matK: number;
  radius?: number;
}) {
  const frame = Math.max(w * frameK, 6);
  const mat = Math.max(w * matK, 20);
  return (
    <div
      className="relative"
      style={{
        padding: frame,
        borderRadius: radius,
        background: frameBg,
        boxShadow:
          "0 0 0 1px rgba(0,0,0,0.3), 0 1px 1px rgba(255,255,255,0.14) inset, 0 55px 100px -30px rgba(0,0,0,0.5)",
      }}
    >
      <div
        style={{
          padding: mat,
          background: matBg,
          boxShadow: "0 1px 2px rgba(0,0,0,0.16) inset",
        }}
      >
        <div
          className="relative overflow-hidden"
          style={{ boxShadow: "0 0 0 1px rgba(0,0,0,0.12), 0 2px 6px rgba(0,0,0,0.22)" }}
        >
          {children}
          <Sheen />
        </div>
      </div>
    </div>
  );
}

export function FrameDark({ w, children }: FrameProps) {
  return matFrame({
    w,
    children,
    frameBg: "linear-gradient(150deg,#33302a,#161310 58%,#26221c)",
    matBg: "linear-gradient(155deg,#f6f3ec,#ece7dc)",
    frameK: 0.022,
    matK: 0.06,
  });
}

export function FrameWood({ w, children }: FrameProps) {
  return matFrame({
    w,
    children,
    frameBg: "linear-gradient(150deg,#caa878,#7c5a34 58%,#b18851)",
    matBg: "linear-gradient(155deg,#f7f4ed,#efe9dd)",
    frameK: 0.026,
    matK: 0.06,
  });
}

export function FrameMetal({ w, children }: FrameProps) {
  return matFrame({
    w,
    children,
    frameBg: "linear-gradient(150deg,#5a5a5f,#2a2a2d 55%,#48484c)",
    matBg: "#fbfbf9",
    frameK: 0.009,
    matK: 0.05,
    radius: 1,
  });
}

/** Frameless float mount — just a cream mat with a drop shadow. */
export function Mat({ w, children }: FrameProps) {
  const mat = Math.max(w * 0.07, 24);
  return (
    <div
      style={{
        padding: mat,
        background: "linear-gradient(155deg,#f6f3ec,#ece7dc)",
        boxShadow:
          "0 0 0 1px rgba(0,0,0,0.05), 0 45px 95px -30px rgba(0,0,0,0.4)",
      }}
    >
      <div
        className="relative overflow-hidden"
        style={{ boxShadow: "0 2px 10px rgba(0,0,0,0.18)" }}
      >
        {children}
        <Sheen />
      </div>
    </div>
  );
}

/** The dark frame tilted on the wall, with a directional cast shadow. */
export function FramedAngled({ w, children }: FrameProps) {
  return (
    <div style={{ perspective: `${w * 4}px` }}>
      <div
        style={{
          transform: "rotateY(14deg) rotateX(3deg)",
          transformStyle: "preserve-3d",
          filter: "drop-shadow(30px 42px 40px rgba(0,0,0,0.42))",
        }}
      >
        {matFrame({
          w,
          children,
          frameBg: "linear-gradient(150deg,#33302a,#161310 58%,#26221c)",
          matBg: "linear-gradient(155deg,#f6f3ec,#ece7dc)",
          frameK: 0.022,
          matK: 0.06,
        })}
      </div>
    </div>
  );
}
