import type { ThemeId } from "./types";

/**
 * Concrete values for the poster's `--sdl-*` design tokens, per theme.
 *
 * The in-app canvas gets these from `app/globals.css` via the CSS cascade
 * (`[data-sdl-theme=…]`). The OG image route (Satori/next-og) has no stylesheet
 * cascade, so it reads these values directly to render a theme-matched card.
 * Keep this table in sync with globals.css.
 */
export type SdlTokens = {
  bg: string;
  bgDim: string;
  fg: string;
  fgSoft: string;
  muted: string;
  line: string;
  accent: string;
  accentInk: string;
  /** Accent pre-multiplied to 24% alpha (Satori-safe stand-in for color-mix). */
  accentGlow: string;
};

export const SDL_TOKENS: Record<ThemeId, SdlTokens> = {
  light: {
    bg: "#faf9f6",
    bgDim: "#f0eee8",
    fg: "#1a1a1a",
    fgSoft: "#3d3d3d",
    muted: "#8a8578",
    line: "#d9d5cb",
    accent: "#c0392b",
    accentInk: "#ffffff",
    accentGlow: "rgba(192, 57, 43, 0.24)",
  },
  dark: {
    bg: "#16150f",
    bgDim: "#201e16",
    fg: "#f3f1ea",
    fgSoft: "#cbc7bb",
    muted: "#7d786c",
    line: "#34322a",
    accent: "#d9563f",
    accentInk: "#16150f",
    accentGlow: "rgba(217, 86, 63, 0.24)",
  },
};
