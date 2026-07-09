import type { ReactNode } from "react";

/** The uppercase eyebrow above a control group — shared by the content panel
 * and the style rail so they read as one system. */
export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div className="text-muted-foreground mb-2.5 text-[11px] font-semibold tracking-[0.14em] uppercase">
      {children}
    </div>
  );
}
