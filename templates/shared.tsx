import type { CSSProperties, ReactNode } from "react";
import type { ResolvedAlign, TemplateProps } from "@/lib/types";
import type { LayoutMetrics } from "@/lib/metrics";
import { formatDateDot } from "@/lib/format";
import { templateMetrics } from "@/lib/metrics";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { FLEX_ALIGN, resolveAlign, SCALE_FACTOR } from "@/lib/style";

/**
 * The derived values every template computes identically from its props: the
 * fitted metrics, the resolved alignment, the formatted date, and whether the
 * footer / seal should show. Templates then build their own (visually distinct)
 * style objects on top of this. Declared once so the four templates can't drift
 * on the shared logic — e.g. the "hide the seal when it just repeats the title"
 * rule lives here, not copy-pasted four times.
 */
export type TemplateModel = {
  /** Non-empty items only (blank rows are dropped from the render). */
  items: string[];
  /** Fitted sizes/spacing for this ratio + item count + size scale. */
  m: LayoutMetrics;
  /** Effective alignment (the template's native default while align is "auto"). */
  a: ResolvedAlign;
  /** Flexbox main-axis value matching `a`, for row/column alignment. */
  flex: (typeof FLEX_ALIGN)[ResolvedAlign];
  /** Formatted date (empty string when unset). */
  date: string;
  /** Whether to render the footer (has a date or a signature). */
  showFooter: boolean;
  /** The localized seal/chop text. */
  sealText: string;
  /** Whether to stamp the seal (hidden when it would just repeat the title). */
  showSeal: boolean;
};

export function templateModel(
  { data, ratio, locale, align, scale }: TemplateProps,
  /** The alignment this template is designed around, used while align is "auto". */
  nativeAlign: ResolvedAlign,
): TemplateModel {
  const items = data.items.filter((t) => t.trim().length > 0);
  const m = templateMetrics(ratio, items, SCALE_FACTOR[scale]);
  const a = resolveAlign(align, nativeAlign);
  const sealText = getDictionary(locale).seal;
  return {
    items,
    m,
    a,
    flex: FLEX_ALIGN[a],
    date: formatDateDot(data.date),
    showFooter: Boolean(formatDateDot(data.date) || data.signature.trim()),
    sealText,
    showSeal:
      data.title.trim().toLowerCase() !== sealText.trim().toLowerCase(),
  };
}

/**
 * The three-zone flex shell every template lays out in: an optional absolutely-
 * positioned backdrop, then a header, a vertically-centered items list that
 * takes the remaining height, and an optional footer. Each template supplies
 * its own fully-computed style objects and row markup, so the shell unifies the
 * (identical) structure without constraining any template's look.
 */
export function TemplateShell({
  root,
  inner,
  backdrop,
  header,
  itemsWrap,
  list,
  children,
  footer,
}: {
  root: CSSProperties;
  inner: CSSProperties;
  /** Absolutely-positioned decoration rendered before the content (e.g. Ink's watermark). */
  backdrop?: ReactNode;
  header: ReactNode;
  itemsWrap: CSSProperties;
  list: CSSProperties;
  /** The `<li>` rows. */
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div style={root}>
      {backdrop}
      <div style={inner}>
        {header}
        <div style={itemsWrap}>
          <ul style={list}>{children}</ul>
        </div>
        {footer}
      </div>
    </div>
  );
}
