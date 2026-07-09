import type { CSSProperties } from "react";
import type { TemplateProps } from "@/lib/types";
import { sealStyle } from "@/lib/style";
import {
  posterInner,
  posterItemsWrap,
  templateModel,
  TemplateFooter,
  TemplateHeader,
  TemplateShell,
} from "./shared";

/**
 * 「暮 Dusk」— ambient, glow-lit poster.
 * A soft cinnabar-tinted light over a gentle gradient, centered serif title.
 * Designed dark-first but reads --sdl-* tokens, so light theme becomes a warm
 * ambient variant.
 */
export function DuskTemplate(props: TemplateProps) {
  const { data } = props;
  const { items, m, a, flex, date, showFooter, sealText, showSeal } =
    templateModel(props, "center");

  const root: CSSProperties = {
    position: "relative",
    width: "100%",
    height: "100%",
    boxSizing: "border-box",
    padding: m.pad,
    background:
      "radial-gradient(68% 42% at 50% 26%, var(--sdl-accent-glow), transparent 62%), linear-gradient(168deg, var(--sdl-bg-dim), var(--sdl-bg))",
    color: "var(--sdl-fg)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: a,
    overflow: "hidden",
    fontFamily: "var(--font-serif)",
  };

  // No alignItems on inner: children must stretch to the full content width so
  // the list's percentage maxWidth resolves against a definite box. Aligning
  // here would shrink-to-fit each child, collapsing the list's available width
  // and forcing otherwise-single lines to wrap. Each child aligns its own
  // content via `flex` below. (posterInner intentionally omits alignItems.)
  const inner = posterInner(m.contentWidth);

  const seal = sealStyle(Math.round(m.titleSize * 0.54), a, "filled");

  const title: CSSProperties = {
    fontSize: m.titleSize,
    lineHeight: 1.12,
    fontWeight: 600,
    margin: `${Math.round(m.titleSize * 0.26)}px 0 0`,
  };

  const dotSize = Math.max(6, Math.round(8 * m.unit));
  const dot: CSSProperties = {
    width: dotSize,
    height: dotSize,
    borderRadius: "50%",
    background: "var(--sdl-accent)",
    margin: `${Math.round(m.itemGap * 1.2)}px 0`,
  };

  const itemsWrap = posterItemsWrap(flex);

  const list: CSSProperties = {
    listStyle: "none",
    margin: 0,
    padding: 0,
    display: "flex",
    flexDirection: "column",
    alignItems: flex,
    gap: m.itemGap,
    maxWidth: "88%",
  };

  const itemText: CSSProperties = {
    fontSize: m.itemSize,
    lineHeight: 1.4,
    fontWeight: 400,
    textAlign: a,
    color: "var(--sdl-fg-soft)",
  };

  const footer: CSSProperties = {
    flexShrink: 0,
    display: "flex",
    flexDirection: "column",
    gap: Math.round(m.footerSize * 0.25),
    alignItems: flex,
    paddingTop: Math.round(m.footerSize),
    fontFamily: "var(--font-sans)",
    fontSize: m.footerSize,
    letterSpacing: 2,
    color: "var(--sdl-muted)",
  };

  return (
    <TemplateShell
      root={root}
      inner={inner}
      header={
        <TemplateHeader
          style={{
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: flex,
          }}
          sealStyle={seal}
          sealText={sealText}
          showSeal={showSeal}
          title={data.title}
          titleStyle={title}
          divider={<div style={dot} />}
        />
      }
      itemsWrap={itemsWrap}
      list={list}
      footer={
        showFooter && (
          <TemplateFooter
            style={footer}
            date={date}
            signature={data.signature}
            reverse
          />
        )
      }
    >
      {items.map((text, i) => (
        <li key={i} style={itemText}>
          {text}
        </li>
      ))}
    </TemplateShell>
  );
}
