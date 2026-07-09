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
 * 「格 Grid」— Swiss / International Typographic style.
 * Heavy sans-serif, strong alignment, numbered rows with hairline rules,
 * cinnabar index numbers. Reads --sdl-* design tokens (plus --font-* families).
 */
export function GridTemplate(props: TemplateProps) {
  const { data } = props;
  const { items, m, a, flex, date, showFooter, sealText, showSeal } =
    templateModel(props, "left");
  const rowPad = Math.round(m.itemGap * 0.55);

  const root: CSSProperties = {
    position: "relative",
    width: "100%",
    height: "100%",
    boxSizing: "border-box",
    padding: m.pad,
    background: "var(--sdl-bg)",
    color: "var(--sdl-fg)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    overflow: "hidden",
    fontFamily: "var(--font-sans)",
  };

  const inner = posterInner(m.contentWidth);

  // Grid is Swiss/sans, so the chop drops the serif to stay in the family.
  const seal: CSSProperties = {
    ...sealStyle(Math.round(m.titleSize * 0.5), a, "filled"),
    fontFamily: "var(--font-sans)",
    borderRadius: 0,
  };

  const title: CSSProperties = {
    fontSize: m.titleSize,
    lineHeight: 0.98,
    fontWeight: 800,
    letterSpacing: -2,
    textAlign: a,
    margin: `${Math.round(m.titleSize * 0.24)}px 0 0`,
  };

  const topRule: CSSProperties = {
    height: Math.max(4, Math.round(5 * m.unit)),
    background: "var(--sdl-fg)",
    margin: `${Math.round(m.itemGap * 0.9)}px 0 0`,
  };

  const itemsWrap = posterItemsWrap();

  const list: CSSProperties = {
    listStyle: "none",
    margin: 0,
    padding: 0,
    width: "100%",
  };

  const row: CSSProperties = {
    display: "flex",
    alignItems: "baseline",
    justifyContent: flex,
    gap: Math.round(m.itemSize * 0.7),
    padding: `${rowPad}px 0`,
    borderBottom: "1px solid var(--sdl-line)",
  };

  const index: CSSProperties = {
    flexShrink: 0,
    width: Math.round(m.itemSize * 1.7),
    fontSize: Math.round(m.itemSize * 0.72),
    fontWeight: 700,
    color: "var(--sdl-accent)",
    fontVariantNumeric: "tabular-nums",
  };

  const itemText: CSSProperties = {
    fontSize: m.itemSize,
    lineHeight: 1.25,
    fontWeight: 500,
    textAlign: a,
    color: "var(--sdl-fg)",
  };

  const footer: CSSProperties = {
    flexShrink: 0,
    display: "flex",
    justifyContent: "space-between",
    paddingTop: Math.round(m.footerSize * 1.1),
    fontSize: m.footerSize,
    fontWeight: 600,
    letterSpacing: 1,
    textTransform: "uppercase",
    color: "var(--sdl-muted)",
  };

  return (
    <TemplateShell
      root={root}
      inner={inner}
      header={
        <TemplateHeader
          style={{ flexShrink: 0, textAlign: a }}
          sealStyle={seal}
          sealText={sealText}
          showSeal={showSeal}
          title={data.title}
          titleStyle={title}
          divider={<div style={topRule} />}
        />
      }
      itemsWrap={itemsWrap}
      list={list}
      footer={
        showFooter && (
          <TemplateFooter style={footer} date={date} signature={data.signature} />
        )
      }
    >
      {items.map((text, i) => (
        <li key={i} style={row}>
          <span style={index}>{String(i + 1).padStart(2, "0")}</span>
          <span style={itemText}>{text}</span>
        </li>
      ))}
    </TemplateShell>
  );
}
