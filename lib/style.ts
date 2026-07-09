import type { CSSProperties } from "react";
import type { ResolvedAlign, TextAlign, TypeScale } from "./types";

/**
 * Presentation helpers shared by every template so the global alignment / size
 * controls apply uniformly. Templates declare their own "native" alignment and
 * fall back to it while the user leaves alignment on "auto".
 */

/** Map an alignment to the flexbox main-axis value for a row/column. */
export const FLEX_ALIGN: Record<ResolvedAlign, "flex-start" | "center" | "flex-end"> = {
  left: "flex-start",
  center: "center",
  right: "flex-end",
};

/** Resolve the effective alignment, honoring each template's native default. */
export function resolveAlign(align: TextAlign, native: ResolvedAlign): ResolvedAlign {
  return align === "auto" ? native : align;
}

/**
 * Horizontal auto-margins that shift a fixed-width block (a rule bar, a dot) to
 * the aligned edge. Spread onto the element; keep vertical margins separate.
 */
export function barMarginX(a: ResolvedAlign): {
  marginLeft: number | "auto";
  marginRight: number | "auto";
} {
  return {
    marginLeft: a === "left" ? 0 : "auto",
    marginRight: a === "right" ? 0 : "auto",
  };
}

/**
 * Text-size multiplier applied to the auto-fitted item size. The fit loop still
 * caps the result, so "relaxed" can only grow into space that's actually free.
 */
export const SCALE_FACTOR: Record<TypeScale, number> = {
  compact: 0.85,
  normal: 1,
  relaxed: 1.2,
};

export type SealVariant = "filled" | "outline";

/**
 * The cinnabar seal (印章) stamped above the title. It carries the brand mark as
 * a *graphic* — a red chop — rather than a sentence, so it no longer reads as a
 * repeat of the headline the way a text eyebrow did. `filled` is the classic
 * white-on-red chop; `outline` is a lighter red-on-paper variant for restrained
 * templates. Sized as a square for short CJK text, stretching to a rounded
 * tablet for longer Latin text, and aligned to the active edge like a rule bar.
 * Satori-safe (mirrors Ink's footer seal), so it renders identically in the OG
 * image and the in-app canvas.
 */
export function sealStyle(
  size: number,
  a: ResolvedAlign,
  variant: SealVariant = "filled",
): CSSProperties {
  const filled = variant === "filled";
  const base: CSSProperties = {
    // inline-flex so the chop shrinks to its content instead of stretching to
    // the header width; the parent's textAlign / alignItems places it, and the
    // auto margins below pull it to the active edge inside a flex column.
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    boxSizing: "border-box",
    minWidth: size,
    height: size,
    padding: `0 ${Math.round(size * 0.18)}px`,
    borderRadius: Math.round(size * 0.16),
    background: filled ? "var(--sdl-accent)" : "transparent",
    color: filled ? "var(--sdl-accent-ink)" : "var(--sdl-accent)",
    fontFamily: "var(--font-serif)",
    fontSize: Math.round(size * 0.46),
    fontWeight: 700,
    lineHeight: 1,
    letterSpacing: Math.round(size * 0.04),
    ...barMarginX(a),
  };
  if (!filled) {
    base.border = `${Math.max(2, Math.round(size * 0.055))}px solid var(--sdl-accent)`;
  }
  return base;
}
