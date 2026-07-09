import type { CardState } from "./types";

/**
 * The card the editor opens on and returns to on reset, and the per-field
 * fallback the share codec applies to anything missing or invalid in a link.
 * `data` is supplied separately since it's locale-dependent sample content
 * (see lib/sample). Kept as the single source so the store's initial state,
 * `reset()`, and `decodeShare` can never disagree on a default.
 */
export const DEFAULT_CARD: Omit<CardState, "data"> = {
  template: "silence",
  ratio: "wallpaper",
  theme: "light",
  align: "auto",
  scale: "normal",
};
