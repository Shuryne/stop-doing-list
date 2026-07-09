import type { CSSProperties } from "react";
import type { TemplateProps } from "@/lib/types";
import { barMarginX, sealStyle } from "@/lib/style";
import { templateModel, TemplateShell } from "./shared";

/**
 * 「静默 Silence」— minimalist black & white.
 * Big serif title, generous whitespace, a cinnabar ✕ as the "stop" mark.
 * Reads only --sdl-* tokens, so it renders identically in light/dark.
 */
export function SilenceTemplate(props: TemplateProps) {
  const { data } = props;
  const { items, m, a, flex, date, showFooter, sealText, showSeal } =
    templateModel(props, "left");

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
  };

  const inner: CSSProperties = {
    width: m.contentWidth,
    height: "100%",
    display: "flex",
    flexDirection: "column",
  };

  const seal = sealStyle(Math.round(m.titleSize * 0.54), a, "outline");

  const title: CSSProperties = {
    fontFamily: "var(--font-serif)",
    fontSize: m.titleSize,
    lineHeight: 1.12,
    fontWeight: 600,
    letterSpacing: -1,
    margin: `${Math.round(m.titleSize * 0.28)}px 0 0`,
  };

  const rule: CSSProperties = {
    width: Math.round(m.ruleWidth * 0.72),
    height: Math.max(3, Math.round(4 * m.unit)),
    background: "var(--sdl-accent)",
    marginTop: Math.round(m.itemGap * 1.1),
    marginBottom: Math.round(m.itemGap * 1.1),
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
    gap: m.itemSize * 0.6,
  };

  const mark: CSSProperties = {
    flexShrink: 0,
    fontFamily: "var(--font-sans)",
    fontSize: m.itemSize * 0.82,
    fontWeight: 700,
    lineHeight: 1,
    color: "var(--sdl-accent)",
  };

  const itemText: CSSProperties = {
    fontFamily: "var(--font-sans)",
    fontSize: m.itemSize,
    lineHeight: 1.35,
    fontWeight: 400,
    textAlign: a,
    color: "var(--sdl-fg-soft)",
  };

  const footer: CSSProperties = {
    flexShrink: 0,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: Math.round(m.footerSize * 1.1),
    borderTop: "1px solid var(--sdl-line)",
    fontFamily: "var(--font-sans)",
    fontSize: m.footerSize,
    letterSpacing: 1,
    color: "var(--sdl-muted)",
  };

  return (
    <TemplateShell
      root={root}
      inner={inner}
      header={
        <div style={{ flexShrink: 0, textAlign: a }}>
          {showSeal && <div style={seal}>{sealText}</div>}
          {data.title.trim() && <h1 style={title}>{data.title}</h1>}
          <div style={rule} />
        </div>
      }
      itemsWrap={itemsWrap}
      list={list}
      footer={
        showFooter && (
          <div style={footer}>
            <span>{date}</span>
            <span>{data.signature}</span>
          </div>
        )
      }
    >
      {items.map((text, i) => (
        <li key={i} style={row}>
          <span style={mark}>✕</span>
          <span style={itemText}>{text}</span>
        </li>
      ))}
    </TemplateShell>
  );
}
