import type { FrameProps } from "@/lib/frames";

/** No shell — the bare poster with a soft studio shadow (matches export). */
export function NoneFrame({ children }: FrameProps) {
  return (
    <div className="relative shadow-[0_40px_90px_-30px_rgba(0,0,0,0.45)] ring-1 ring-black/10">
      {children}
    </div>
  );
}
