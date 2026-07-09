import type { RatioId } from "./types";

export type Orientation = "tall" | "portrait" | "square" | "landscape";

export type RatioSpec = {
  id: RatioId;
  /** Chinese label for the control. */
  label: string;
  /** English label. */
  labelEn: string;
  /** Export/render width in px (the canvas renders at this native size). */
  width: number;
  /** Export/render height in px. */
  height: number;
  /** Aspect bucket that drives layout adaptation (see lib/metrics.ts). */
  orientation: Orientation;
};

/**
 * Native render sizes. Templates lay out at these pixel dimensions via the
 * metrics layer; the preview scales them down with a CSS transform and export
 * captures at full size — so downloads are crisp regardless of viewport.
 */
export const RATIOS: Record<RatioId, RatioSpec> = {
  wallpaper: {
    id: "wallpaper",
    label: "手机壁纸",
    labelEn: "Phone",
    width: 1290, // iPhone 15 Pro class, 9 : 19.5
    height: 2796,
    orientation: "tall",
  },
  story: {
    id: "story",
    label: "社交竖版",
    labelEn: "Story",
    width: 1080,
    height: 1920, // 9 : 16
    orientation: "tall",
  },
  poster: {
    id: "poster",
    label: "海报",
    labelEn: "Poster",
    width: 1080,
    height: 1440, // 3 : 4
    orientation: "portrait",
  },
  square: {
    id: "square",
    label: "方图",
    labelEn: "Square",
    width: 1080,
    height: 1080,
    orientation: "square",
  },
  desktop: {
    id: "desktop",
    label: "桌面壁纸",
    labelEn: "Desktop",
    width: 2560,
    height: 1440, // 16 : 9
    orientation: "landscape",
  },
};

export const RATIO_LIST: RatioSpec[] = Object.values(RATIOS);
