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
  const date = formatDateDot(data.date);
  return {
    items,
    m,
    a,
    flex: FLEX_ALIGN[a],
    date,
    showFooter: Boolean(date || data.signature.trim()),
    sealText,
    showSeal:
      data.title.trim().toLowerCase() !== sealText.trim().toLowerCase(),
  };
}

/**
 * The fixed-width content column every template centers its poster content in.
 * A purely structural style (no color/type), shared so the four templates can't
 * drift on the column geometry; a template spreads it and adds its own extras
 * (e.g. Ink layers `position: relative` for its absolute watermark).
 */
export function posterInner(contentWidth: number): CSSProperties {
  return {
    width: contentWidth,
    height: "100%",
    display: "flex",
    flexDirection: "column",
  };
}

/**
 * The vertically-centered, overflow-clipped zone the items list fills — the
 * `flex: 1` middle of the three-zone column, between header and footer. Pass
 * `alignItems` when the template also aligns the list block itself (e.g. Dusk).
 */
export function posterItemsWrap(
  alignItems?: CSSProperties["alignItems"],
): CSSProperties {
  return {
    flex: 1,
    minHeight: 0,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    overflow: "hidden",
    ...(alignItems !== undefined ? { alignItems } : {}),
  };
}

/**
 * The header block every template renders: an optional cinnabar seal, the
 * optional title, then a divider (each template's own rule/dot). The seal- and
 * title-visibility guards live here so the four templates can't re-type them
 * inconsistently; only `style` (the container) and `divider` vary by template.
 */
export function TemplateHeader({
  style,
  sealStyle,
  sealText,
  showSeal,
  title,
  titleStyle,
  divider,
}: {
  style: CSSProperties;
  sealStyle: CSSProperties;
  sealText: string;
  showSeal: boolean;
  title: string;
  titleStyle: CSSProperties;
  divider: ReactNode;
}) {
  return (
    <div style={style}>
      {showSeal && <div style={sealStyle}>{sealText}</div>}
      {title.trim() && <h1 style={titleStyle}>{title}</h1>}
      {divider}
    </div>
  );
}

/**
 * The footer block: the date and the optional signature. The signature-visible
 * guard (drop it when blank) is centralized here. `reverse` swaps the order
 * (Dusk leads with the signature); `dateStyle`/`signatureStyle` let a template
 * style each span (Ink stamps the signature as a seal).
 */
export function TemplateFooter({
  style,
  date,
  signature,
  reverse = false,
  dateStyle,
  signatureStyle,
}: {
  style: CSSProperties;
  date: string;
  signature: string;
  reverse?: boolean;
  dateStyle?: CSSProperties;
  signatureStyle?: CSSProperties;
}) {
  const dateEl = <span style={dateStyle}>{date}</span>;
  const signatureEl = signature.trim() ? (
    <span style={signatureStyle}>{signature}</span>
  ) : null;
  return (
    <div style={style}>
      {reverse ? (
        <>
          {signatureEl}
          {dateEl}
        </>
      ) : (
        <>
          {dateEl}
          {signatureEl}
        </>
      )}
    </div>
  );
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
