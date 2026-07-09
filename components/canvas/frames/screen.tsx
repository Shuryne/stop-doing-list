import type { FrameProps } from "@/lib/frames";
import { Sheen } from "./util";

const APPLE_PATH =
  "M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z";

const DOCK_COLORS = [
  "#4c8dff",
  "#34c759",
  "#ff9f0a",
  "#ff375f",
  "#af52de",
  "#5ac8fa",
];

/** Apple-display-style: thin dark bezel on a brushed aluminum stand. */
export function Monitor({ w, children }: FrameProps) {
  const bezel = Math.max(w * 0.012, 5);
  const r = Math.max(w * 0.018, 8);
  return (
    <div className="relative flex flex-col items-center">
      <div
        className="relative"
        style={{
          padding: bezel,
          borderRadius: r,
          background: "linear-gradient(155deg,#333336,#0f0f11 60%,#242427)",
          boxShadow:
            "0 0 0 1px rgba(0,0,0,0.4), 0 1px 1px rgba(255,255,255,0.2) inset, 0 55px 110px -35px rgba(0,0,0,0.5)",
        }}
      >
        <div
          className="relative overflow-hidden"
          style={{ borderRadius: r * 0.5 }}
        >
          {children}
          <Sheen radius={r * 0.5} />
        </div>
      </div>
      {/* Aluminum neck (widens toward the base). */}
      <div
        style={{
          width: w * 0.11,
          height: w * 0.055,
          clipPath: "polygon(32% 0, 68% 0, 82% 100%, 18% 100%)",
          background: "linear-gradient(90deg,#8f8f94,#d7d7dc 45%,#9a9aa0)",
        }}
      />
      {/* Aluminum foot. */}
      <div
        style={{
          width: w * 0.26,
          height: w * 0.02,
          borderRadius: 999,
          background: "linear-gradient(180deg,#c9c9ce,#8c8c92)",
          boxShadow: "0 18px 26px -16px rgba(0,0,0,0.5)",
        }}
      />
    </div>
  );
}

/** Browser window with traffic-light dots + an address pill — great for web headers. */
export function Browser({ w, children }: FrameProps) {
  const r = Math.max(w * 0.014, 8);
  const chromeH = Math.max(w * 0.034, 20);
  const dot = Math.max(w * 0.009, 6);
  return (
    <div
      className="relative overflow-hidden"
      style={{
        borderRadius: r,
        boxShadow:
          "0 0 0 1px rgba(0,0,0,0.08), 0 50px 110px -35px rgba(0,0,0,0.45)",
      }}
    >
      <div
        className="flex items-center"
        style={{
          height: chromeH,
          paddingLeft: chromeH * 0.5,
          paddingRight: chromeH * 0.5,
          gap: dot * 0.9,
          background: "linear-gradient(180deg,#f1f1f3,#e4e4e7)",
        }}
      >
        <span style={{ width: dot, height: dot, borderRadius: 999, background: "#ff5f57" }} />
        <span style={{ width: dot, height: dot, borderRadius: 999, background: "#febc2e" }} />
        <span style={{ width: dot, height: dot, borderRadius: 999, background: "#28c840" }} />
        <div
          className="mx-auto"
          style={{
            height: chromeH * 0.52,
            width: "44%",
            borderRadius: 999,
            background: "rgba(255,255,255,0.85)",
            boxShadow: "0 0 0 1px rgba(0,0,0,0.05) inset",
          }}
        />
      </div>
      <div className="relative overflow-hidden">
        {children}
        <Sheen />
      </div>
    </div>
  );
}

/** The poster as a macOS desktop wallpaper: translucent menu bar + dock. */
export function MacOSDesktop({ w, children }: FrameProps) {
  const r = Math.max(w * 0.016, 8);
  const menuH = Math.max(w * 0.02, 15);
  const icon = Math.max(w * 0.03, 20);
  return (
    <div
      className="relative overflow-hidden"
      style={{
        borderRadius: r,
        boxShadow:
          "0 0 0 1px rgba(0,0,0,0.08), 0 50px 110px -35px rgba(0,0,0,0.45)",
      }}
    >
      {children}

      {/* Menu bar */}
      <div
        className="absolute inset-x-0 top-0 flex items-center justify-between text-[#1d1d1f] backdrop-blur-md"
        style={{
          height: menuH,
          paddingLeft: menuH * 0.7,
          paddingRight: menuH * 0.7,
          gap: menuH * 0.7,
          background: "rgba(245,245,247,0.6)",
          fontSize: w * 0.011,
        }}
      >
        <div className="flex items-center" style={{ gap: menuH * 0.6 }}>
          <svg
            viewBox="0 0 24 24"
            width={w * 0.014}
            height={w * 0.014}
            fill="#1d1d1f"
          >
            <path d={APPLE_PATH} />
          </svg>
          <span className="font-semibold">Finder</span>
          <span className="opacity-70">File</span>
          <span className="opacity-70">Edit</span>
          <span className="opacity-70">View</span>
        </div>
        <span className="tabular-nums opacity-80">9:41</span>
      </div>

      {/* Dock */}
      <div
        className="absolute left-1/2 flex -translate-x-1/2 items-end backdrop-blur-md"
        style={{
          bottom: "3.5%",
          gap: icon * 0.32,
          padding: icon * 0.28,
          borderRadius: icon * 0.5,
          background: "rgba(255,255,255,0.3)",
          boxShadow: "0 0 0 1px rgba(255,255,255,0.35) inset, 0 10px 24px -12px rgba(0,0,0,0.4)",
        }}
      >
        {DOCK_COLORS.map((c, i) => (
          <div
            key={i}
            style={{
              width: icon,
              height: icon,
              borderRadius: icon * 0.26,
              background: `linear-gradient(160deg,${c},color-mix(in oklch,${c},black 18%))`,
              boxShadow: "0 1px 1px rgba(255,255,255,0.4) inset",
            }}
          />
        ))}
      </div>

      <Sheen radius={r} />
    </div>
  );
}

/** Open-clamshell MacBook: screen on top, aluminum deck receding below. */
export function MacBook({ w, children }: FrameProps) {
  const bezel = Math.max(w * 0.02, 8);
  const r = Math.max(w * 0.02, 10);
  const deckH = w * 0.05;
  return (
    <div className="relative flex flex-col items-center">
      {/* Screen */}
      <div
        className="relative"
        style={{
          padding: bezel,
          paddingBottom: bezel * 1.3,
          borderRadius: r,
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
          background: "linear-gradient(155deg,#303033,#0f0f11 60%,#242427)",
          boxShadow:
            "0 0 0 1px rgba(0,0,0,0.4), 0 1px 1px rgba(255,255,255,0.18) inset",
        }}
      >
        {/* camera dot */}
        <div
          className="absolute left-1/2 top-[3%] -translate-x-1/2 rounded-full"
          style={{ width: w * 0.006, height: w * 0.006, background: "#3a3a3d" }}
        />
        <div
          className="relative overflow-hidden"
          style={{ borderRadius: r * 0.4 }}
        >
          {children}
          <Sheen radius={r * 0.4} />
        </div>
      </div>
      {/* Deck (keyboard base), slightly wider and receding via a trapezoid. */}
      <div
        className="relative"
        style={{
          width: "108%",
          height: deckH,
          clipPath: "polygon(1.5% 0, 98.5% 0, 100% 100%, 0 100%)",
          background: "linear-gradient(180deg,#d4d4d9,#a7a7ae 65%,#c3c3c9)",
          boxShadow: "0 30px 45px -22px rgba(0,0,0,0.5)",
        }}
      >
        {/* hinge shadow */}
        <div
          className="absolute inset-x-0 top-0"
          style={{
            height: deckH * 0.16,
            background: "linear-gradient(180deg,#5b5b60,#c3c3c9)",
          }}
        />
        {/* front lip notch */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-t-full"
          style={{ width: "14%", height: deckH * 0.34, background: "#9a9aa1" }}
        />
      </div>
    </div>
  );
}
