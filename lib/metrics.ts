import { RATIOS, type Orientation } from "./ratios";
import type { RatioId } from "./types";

/**
 * The metrics layer. Given a ratio and how many items the card holds, it
 * computes every size a template needs so the result:
 *   1. scales proportionally to the canvas (a 2560px desktop looks like a
 *      bigger version of a 1080px square, not a differently-spaced one), and
 *   2. never overflows — item size shrinks as the count grows, within caps, so
 *      3 items breathe and 12 items still fit.
 *
 * Templates read these numbers instead of hard-coding px, and lay out as a
 * three-zone flex column (header / items(flex-1) / footer) so a fixed footer
 * can never overlap the list.
 */
export type LayoutMetrics = {
  width: number;
  height: number;
  orientation: Orientation;
  /** width / 1080 — the proportional unit. */
  unit: number;
  /** Outer padding. */
  pad: number;
  /** Usable content width; landscape caps it to a centered column. */
  contentWidth: number;
  titleSize: number;
  ruleWidth: number;
  itemSize: number;
  itemGap: number;
  footerSize: number;
};

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

/**
 * Rough rendered width of a string, in em (font-size units), so the metrics can
 * predict line wrapping without a DOM to measure against (templates also render
 * server-side via Satori). CJK glyphs are ~1em wide, Latin/space ~0.5em — good
 * enough to bias item sizing toward "fits", which is all we need.
 */
function textWidthEm(s: string): number {
  let w = 0;
  for (const ch of s.trim()) {
    w += /[⺀-鿿豈-﫿＀-￯　-〿]/.test(ch)
      ? 1
      : 0.5;
  }
  return w;
}

export function templateMetrics(
  ratio: RatioId,
  items: readonly string[],
  /** Text-size multiplier from the global size control (1 = auto default). */
  scale = 1,
): LayoutMetrics {
  const { width, height, orientation } = RATIOS[ratio];
  const short = Math.min(width, height);
  const unit = width / 1080;
  const pad = Math.round(short * 0.085);
  const n = Math.max(items.length, 1);

  const availH = height - pad * 2;
  // Share of vertical space the list may occupy. Kept conservative so a tall
  // header (big title) or footer (Ink's signature seal) still leaves room.
  // Landscape rows are wider, so they get a little less height.
  const itemsBudget = availH * (orientation === "landscape" ? 0.48 : 0.58);

  const contentWidth =
    orientation === "landscape"
      ? Math.min(width - pad * 2, Math.round(height * 1.25))
      : width - pad * 2;

  // Predict how tall the list renders at a candidate item size and shrink until
  // it fits the budget. Long items wrap to 2+ lines; the old formula assumed one
  // line per row, so multi-line content overflowed and collided with the header.
  // ~0.82 of the content width is usable text (index column / gutters eat the
  // rest); lineHeight/pad factors are held a touch generous so we err toward fit.
  const linesAtSize = (size: number): number => {
    const perLineEm = (contentWidth * 0.82) / size;
    return items.reduce(
      (sum, t) => sum + Math.max(1, Math.ceil(textWidthEm(t) / perLineEm)),
      0,
    );
  };
  const heightAtSize = (size: number): number => {
    const totalLines = linesAtSize(size);
    // 1.3 line-height + ~0.7 row padding per item.
    return totalLines * 1.3 * size + n * 0.7 * size;
  };

  // The size control moves the ceiling: "compact" caps text smaller even when
  // there's room; "relaxed" lets it grow into free space. The fit loop below
  // still guarantees it never overflows. The floor stays fixed for legibility.
  const sizeHi = 44 * unit * scale;
  const sizeLo = 15 * unit;
  let itemSize = clamp(itemsBudget / (n * 2.0), sizeLo, sizeHi);
  // Step down until the predicted wrapped height fits (or we hit the floor).
  const step = Math.max(0.5, unit * 0.5);
  while (itemSize > sizeLo && heightAtSize(itemSize) > itemsBudget) {
    itemSize = Math.max(sizeLo, itemSize - step);
  }
  const itemGap = clamp(itemSize * 0.6, 10 * unit, 40 * unit);

  // Title tracks the canvas but stays in a sane ratio to the item size, so it
  // doesn't dwarf the list when there are many (small) items.
  let titleSize = clamp(short * 0.105, itemSize * 1.6, itemSize * 3.2);
  titleSize = Math.min(titleSize, height * 0.16);

  const footerSize = clamp(itemSize * 0.62, 13, 26 * unit);
  const ruleWidth = Math.round(96 * unit);

  return {
    width,
    height,
    orientation,
    unit,
    pad,
    contentWidth,
    titleSize,
    ruleWidth,
    itemSize,
    itemGap,
    footerSize,
  };
}
