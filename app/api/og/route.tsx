import { ImageResponse } from "next/og";
import { decodeShare, type ShareState } from "@/lib/share";
import { formatDateDot } from "@/lib/format";
import { hasLocale, defaultLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { SAMPLE_ITEMS } from "@/lib/sample";
import { SDL_TOKENS } from "@/lib/theme-tokens";
import { OG_IMAGE_SIZE, PRODUCT_NAME, SITE_HOST } from "@/lib/site";
import type { ResolvedAlign, TextAlign } from "@/lib/types";

// Node runtime so we can fetch the (subsetted) CJK font at request time.
export const runtime = "nodejs";

/**
 * The OG card is its own Satori-safe landscape layout rather than a render of
 * the in-app template: Satori (next/og) supports only flexbox and can't
 * faithfully lay out the templates' nested content column, so we keep a bespoke
 * card here. It still honors the shared card state — the light/dark **theme**
 * and the **alignment** — and reads the same design tokens and sample content
 * as the app, so a shared light card no longer produces a dark OG image.
 */

/** Card the OG image shows for a bare link (no `?d=` share code). */
function defaultCard(locale: Locale): ShareState {
  return {
    data: { title: PRODUCT_NAME, items: SAMPLE_ITEMS[locale], signature: "", date: "" },
    template: "silence",
    ratio: "wallpaper",
    theme: "dark",
    align: "auto",
    scale: "normal",
  };
}

/** "+3 more" / "还有 3 条" — the overflow line under the list. */
function moreLabel(locale: Locale, extra: number): string {
  return locale === "zh" ? `还有 ${extra} 条` : `+${extra} more`;
}

/** Resolve the global alignment (OG is designed left-aligned) to flex + text. */
function resolve(align: TextAlign): { align: ResolvedAlign; flex: string } {
  const a: ResolvedAlign = align === "auto" ? "left" : align;
  return { align: a, flex: a === "center" ? "center" : a === "right" ? "flex-end" : "flex-start" };
}

/**
 * Satori (next/og) ships no CJK glyphs. We ask Google Fonts for a subset
 * containing only the characters we render, and grab the ttf/otf `src` (the
 * default UA doesn't advertise woff2, so css2 returns a Satori-compatible
 * format). Tiny payload, correct Chinese.
 */
async function fetchFontSubset(weight: number, text: string): Promise<ArrayBuffer> {
  const url = `https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@${weight}&text=${encodeURIComponent(
    text,
  )}`;
  const cssRes = await fetch(url);
  if (!cssRes.ok) throw new Error(`Font CSS fetch failed: ${cssRes.status}`);
  const css = await cssRes.text();
  const match = css.match(/src: url\((.+?)\) format\('(?:opentype|truetype)'\)/);
  if (!match) throw new Error("Could not parse font subset URL");
  const res = await fetch(match[1]);
  if (!res.ok) throw new Error(`Font fetch failed: ${res.status}`);
  return res.arrayBuffer();
}

/**
 * In-process cache of subset fetches. A bare link (the default card) has a fixed
 * glyph set, so repeat OG requests reuse the same bytes instead of hitting
 * Google Fonts every time. A rejected fetch is evicted so a transient network
 * failure doesn't poison the cache for the lifetime of the process.
 */
const fontSubsetCache = new Map<string, Promise<ArrayBuffer>>();

function loadFontSubset(weight: number, text: string): Promise<ArrayBuffer> {
  const key = `${weight}:${text}`;
  const cached = fontSubsetCache.get(key);
  if (cached) return cached;
  const pending = fetchFontSubset(weight, text).catch((err) => {
    fontSubsetCache.delete(key);
    throw err;
  });
  fontSubsetCache.set(key, pending);
  return pending;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const langParam = searchParams.get("lang");
  const locale: Locale = langParam && hasLocale(langParam) ? langParam : defaultLocale;
  const code = searchParams.get("d");
  const state = (code && decodeShare(code)) || defaultCard(locale);
  const { data, theme, align } = state;

  const c = SDL_TOKENS[theme];
  const { align: a, flex } = resolve(align);

  const all = data.items.filter((t) => t.trim().length > 0);
  const items = all.slice(0, 5);
  const extra = all.length - items.length;
  const moreText = extra > 0 ? moreLabel(locale, extra) : "";
  const date = formatDateDot(data.date);
  const title = data.title.trim() || PRODUCT_NAME;
  const seal = getDictionary(locale).seal;
  const mark = "止";

  // Every glyph that appears anywhere in the card must be in the subset.
  const glyphText =
    title + items.join("") + data.signature + date + SITE_HOST + seal + mark + moreText + " 0123456789+·—";

  // Fetch the CJK subset, but never let a font hiccup 500 the card: on failure,
  // fall back to Satori's built-in font (Latin renders; CJK may tofu) so a
  // shared link always yields an OG image rather than a broken social embed.
  type FontOption = {
    name: string;
    data: ArrayBuffer;
    weight: 400 | 700;
    style: "normal";
  };
  let fonts: FontOption[] = [];
  try {
    const [regular, bold] = await Promise.all([
      loadFontSubset(400, glyphText),
      loadFontSubset(700, glyphText),
    ]);
    fonts = [
      { name: "Noto Sans SC", data: regular, weight: 400, style: "normal" },
      { name: "Noto Sans SC", data: bold, weight: 700, style: "normal" },
    ];
  } catch (err) {
    console.error("OG font subset failed; rendering with default font", err);
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          overflow: "hidden",
          background: c.bg,
          color: c.fg,
          fontFamily: "Noto Sans SC",
        }}
      >
        {/* Brand watermark */}
        <div
          style={{
            position: "absolute",
            top: -140,
            right: -30,
            display: "flex",
            fontSize: 640,
            fontWeight: 700,
            color: c.accentGlow,
          }}
        >
          {mark}
        </div>

        {/* Accent spine */}
        <div style={{ width: 14, height: "100%", background: c.accent, display: "flex" }} />

        {/* Content */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: flex,
            textAlign: a,
            padding: "0 84px",
          }}
        >
          {/* Cinnabar seal — a brand chop, not a repeat of the title. */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minWidth: 46,
              height: 46,
              padding: "0 10px",
              borderRadius: 7,
              background: c.accent,
              color: c.accentInk,
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: 2,
            }}
          >
            {seal}
          </div>
          <div style={{ display: "flex", fontSize: 74, fontWeight: 700, lineHeight: 1.12, marginTop: 18 }}>
            {title}
          </div>
          <div style={{ display: "flex", width: 96, height: 6, background: c.accent, margin: "30px 0 34px" }} />
          <div style={{ display: "flex", flexDirection: "column", alignItems: flex, gap: 20 }}>
            {items.map((t, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", fontSize: 34 }}>
                <div
                  style={{
                    width: 14,
                    height: 14,
                    borderRadius: 14,
                    background: c.accent,
                    marginRight: 22,
                    display: "flex",
                  }}
                />
                <div style={{ display: "flex", color: c.fgSoft }}>{t}</div>
              </div>
            ))}
            {extra > 0 && (
              <div style={{ display: "flex", fontSize: 26, color: c.muted, marginLeft: 36 }}>{moreText}</div>
            )}
          </div>
        </div>

        {/* Footer brand */}
        <div
          style={{
            position: "absolute",
            bottom: 44,
            right: 64,
            display: "flex",
            fontSize: 24,
            letterSpacing: 1,
            color: c.muted,
          }}
        >
          {SITE_HOST}
        </div>
      </div>
    ),
    {
      ...OG_IMAGE_SIZE,
      fonts,
      headers: {
        "Cache-Control": "public, max-age=86400, s-maxage=604800, immutable",
      },
    },
  );
}
