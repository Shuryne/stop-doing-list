import type { FrameProps } from "@/lib/frames";
import { Sheen } from "./util";

/** Classic instant-photo card: even margins with a deep bottom border. */
export function Polaroid({ w, children }: FrameProps) {
  const pad = Math.max(w * 0.05, 18);
  const bottom = Math.max(w * 0.16, 60);
  return (
    <div
      style={{
        paddingTop: pad,
        paddingLeft: pad,
        paddingRight: pad,
        paddingBottom: bottom,
        background: "#fdfdfb",
        borderRadius: 4,
        boxShadow:
          "0 0 0 1px rgba(0,0,0,0.04), 0 45px 95px -30px rgba(0,0,0,0.45)",
      }}
    >
      <div
        className="relative overflow-hidden"
        style={{ boxShadow: "0 0 0 1px rgba(0,0,0,0.08)" }}
      >
        {children}
        <Sheen />
      </div>
    </div>
  );
}

/** Top-down flat lay: the print resting on a warm desk surface. */
export function Flatlay({ w, children }: FrameProps) {
  const surface = Math.max(w * 0.14, 40);
  return (
    <div
      className="relative"
      style={{
        padding: surface,
        borderRadius: 6,
        background: "linear-gradient(135deg,#d8c3a0,#c3a983 55%,#b99a6f)",
        boxShadow:
          "0 0 0 1px rgba(0,0,0,0.05), 0 55px 110px -35px rgba(0,0,0,0.5)",
      }}
    >
      {/* soft grain / directional light on the desk */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          borderRadius: 6,
          background:
            "radial-gradient(80% 60% at 30% 20%, rgba(255,255,255,0.25), transparent 60%)",
        }}
      />
      <div
        className="relative overflow-hidden"
        style={{
          transform: "rotate(-1.6deg)",
          boxShadow:
            "0 0 0 1px rgba(0,0,0,0.06), 0 26px 44px -18px rgba(0,0,0,0.45)",
        }}
      >
        {children}
        <Sheen />
      </div>
    </div>
  );
}

/** Paper note stuck to a wall with a strip of washi tape — slightly askew. */
export function StickyNote({ w, children }: FrameProps) {
  const pad = Math.max(w * 0.03, 12);
  return (
    <div className="relative" style={{ transform: "rotate(-1.4deg)" }}>
      {/* Washi tape. */}
      <div
        className="absolute left-1/2 -translate-x-1/2"
        style={{
          top: -pad * 0.7,
          width: w * 0.2,
          height: Math.max(w * 0.045, 16),
          background: "rgba(214,203,168,0.55)",
          transform: "rotate(1.8deg)",
          boxShadow: "0 1px 2px rgba(0,0,0,0.12)",
        }}
      />
      <div
        style={{
          padding: pad,
          background: "#fffdf5",
          borderRadius: 2,
          boxShadow:
            "0 0 0 1px rgba(0,0,0,0.04), 0 32px 70px -28px rgba(0,0,0,0.45)",
        }}
      >
        <div
          className="relative overflow-hidden"
          style={{ boxShadow: "0 1px 6px rgba(0,0,0,0.12)" }}
        >
          {children}
          <Sheen />
        </div>
      </div>
    </div>
  );
}
