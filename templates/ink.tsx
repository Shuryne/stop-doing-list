import type { CSSProperties } from "react";
import type { TemplateProps } from "@/lib/types";
import { barMarginX, sealStyle } from "@/lib/style";
import { templateModel, TemplateShell } from "./shared";

/**
 * 「墨 Ink」— Eastern ink aesthetic.
 * Faint 「止」(stop) watermark, subtle paper vignette, a cinnabar seal as the
 * signature stamp. Reads only --sdl-* tokens.
 */
export function InkTemplate(props: TemplateProps) {
  const { data } = props;
  // `showSeal` here hides the stamp when it would just repeat the title.
  const { items, m, a, flex, date, showFooter, sealText, showSeal } =
    templateModel(props, "left");

  const root: CSSProperties = {
    position: "relative",
    width: "100%",
    height: "100%",
    boxSizing: "border-box",
    padding: m.pad,
    background:
      "radial-gradient(120% 80% at 78% 12%, var(--sdl-bg-dim) 0%, var(--sdl-bg) 55%)",
    color: "var(--sdl-fg)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    overflow: "hidden",
    fontFamily: "var(--font-serif)",
  };

  const watermark: CSSProperties = {
    position: "absolute",
    right: Math.round(-0.05 * m.width),
    top: m.orientation === "tall" ? "12%" : Math.round(-0.06 * m.height),
    fontFamily: "var(--font-serif)",
    fontSize: Math.round(Math.min(m.width, m.height) * 0.62),
    lineHeight: 1,
    fontWeight: 700,
    color: "var(--sdl-fg)",
    opacity: 0.05,
    userSelect: "none",
    pointerEvents: "none",
  };

  const inner: CSSProperties = {
    position: "relative",
    width: m.contentWidth,
    height: "100%",
    display: "flex",
    flexDirection: "column",
  };

  const stamp = sealStyle(Math.round(m.titleSize * 0.54), a, "filled");

  const title: CSSProperties = {
    fontSize: m.titleSize,
    lineHeight: 1.1,
    fontWeight: 700,
    margin: `${Math.round(m.titleSize * 0.26)}px 0 0`,
    color: "var(--sdl-fg)",
  };

  const rule: CSSProperties = {
    width: Math.round(m.ruleWidth * 1.25),
    height: 2,
    background: "var(--sdl-line)",
    marginTop: Math.round(m.itemGap),
    marginBottom: Math.round(m.itemGap),
    ...barMarginX(a),
  };

  const itemsWrap: CSSProperties = {
    flex: 1,
    minHeight: 0,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    overflow: "hidden",
  };

  const list: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: m.itemGap,
    listStyle: "none",
    margin: 0,
    padding: 0,
  };

  const row: CSSProperties = {
    display: "flex",
    alignItems: "baseline",
    justifyContent: flex,
    gap: m.itemSize * 0.62,
  };

  const dotSize = Math.round(m.itemSize * 0.32);
  const dot: CSSProperties = {
    flexShrink: 0,
    width: dotSize,
    height: dotSize,
    borderRadius: "50%",
    background: "var(--sdl-accent)",
    transform: `translateY(-${Math.round(m.itemSize * 0.18)}px)`,
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
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingTop: Math.round(m.footerSize),
  };

  const dateText: CSSProperties = {
    fontFamily: "var(--font-sans)",
    fontSize: m.footerSize,
    letterSpacing: 1,
    color: "var(--sdl-muted)",
  };

  const sealSize = Math.round(m.itemSize * 2);
  const seal: CSSProperties = {
    minWidth: sealSize,
    height: sealSize,
    padding: `0 ${Math.round(m.itemSize * 0.4)}px`,
    borderRadius: Math.round(m.itemSize * 0.3),
    background: "var(--sdl-accent)",
    color: "var(--sdl-accent-ink)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "var(--font-serif)",
    fontSize: Math.round(m.itemSize * 0.78),
    fontWeight: 600,
    letterSpacing: 2,
  };

  return (
    <TemplateShell
      root={root}
      inner={inner}
      backdrop={<div style={watermark}>止</div>}
      header={
        <div style={{ flexShrink: 0, textAlign: a }}>
          {showSeal && <div style={stamp}>{sealText}</div>}
          {data.title.trim() && <h1 style={title}>{data.title}</h1>}
          <div style={rule} />
        </div>
      }
      itemsWrap={itemsWrap}
      list={list}
      footer={
        showFooter && (
          <div style={footer}>
            <span style={dateText}>{date}</span>
            {data.signature.trim() && (
              <span style={seal}>{data.signature}</span>
            )}
          </div>
        )
      }
    >
      {items.map((text, i) => (
        <li key={i} style={row}>
          <span style={dot} />
          <span style={itemText}>{text}</span>
        </li>
      ))}
    </TemplateShell>
  );
}
