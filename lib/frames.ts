import type { ReactNode } from "react";
import type { Orientation } from "./ratios";

/**
 * Frames = the preview-only "shells" the poster is shown inside on the editing
 * stage (a phone, a monitor, a picture frame…). They never affect the exported
 * PNG. This module is the PURE metadata layer — no components — so the store and
 * controls can reason about which frames fit the current ratio without pulling
 * in any JSX. The component for each id lives in
 * `components/canvas/frames/registry.tsx`, mirrored 1:1 by id.
 */

export type FrameId =
  | "none"
  | "iphone-black"
  | "iphone-silver"
  | "phone-plain"
  | "ios-lock"
  | "iphone-angled"
  | "monitor"
  | "browser"
  | "macos-desktop"
  | "macbook"
  | "frame-dark"
  | "frame-wood"
  | "frame-metal"
  | "mat"
  | "frame-angled"
  | "polaroid"
  | "sticky-note"
  | "flatlay";

export type FrameCategory = "none" | "phone" | "screen" | "print" | "paper";

/** Props every frame component receives. `children` is the on-screen poster. */
export type FrameProps = {
  /** On-screen width of the poster (px); all chrome scales from this. */
  w: number;
  children: ReactNode;
};

export type FrameMeta = {
  id: FrameId;
  /** Chinese display name. */
  name: string;
  /** English display name. */
  nameEn: string;
  category: FrameCategory;
  /** Poster orientations this frame fits (a phone can't wrap a landscape). */
  orientations: Orientation[];
};

const ALL: Orientation[] = ["tall", "portrait", "square", "landscape"];

/** Registered frames, in picker order. Adding one = add a meta entry + a
 * component in the registry with the same id. */
export const FRAME_META: Record<FrameId, FrameMeta> = {
  none: { id: "none", name: "纯图", nameEn: "None", category: "none", orientations: ALL },

  "iphone-black": { id: "iphone-black", name: "iPhone", nameEn: "iPhone", category: "phone", orientations: ["tall"] },
  "iphone-silver": { id: "iphone-silver", name: "iPhone 银", nameEn: "Silver", category: "phone", orientations: ["tall"] },
  "phone-plain": { id: "phone-plain", name: "无边框", nameEn: "Bezel-less", category: "phone", orientations: ["tall"] },
  "ios-lock": { id: "ios-lock", name: "锁屏", nameEn: "Lock Screen", category: "phone", orientations: ["tall"] },
  "iphone-angled": { id: "iphone-angled", name: "悬浮", nameEn: "Floating", category: "phone", orientations: ["tall"] },

  monitor: { id: "monitor", name: "显示器", nameEn: "Display", category: "screen", orientations: ["landscape"] },
  browser: { id: "browser", name: "浏览器", nameEn: "Browser", category: "screen", orientations: ["landscape"] },
  "macos-desktop": { id: "macos-desktop", name: "Mac 桌面", nameEn: "macOS", category: "screen", orientations: ["landscape"] },
  macbook: { id: "macbook", name: "笔记本", nameEn: "MacBook", category: "screen", orientations: ["landscape"] },

  "frame-dark": { id: "frame-dark", name: "深色框", nameEn: "Dark", category: "print", orientations: ["portrait", "square"] },
  "frame-wood": { id: "frame-wood", name: "原木框", nameEn: "Wood", category: "print", orientations: ["portrait", "square"] },
  "frame-metal": { id: "frame-metal", name: "金属框", nameEn: "Metal", category: "print", orientations: ["portrait", "square"] },
  mat: { id: "mat", name: "无框裱", nameEn: "Mat", category: "print", orientations: ["portrait", "square"] },
  "frame-angled": { id: "frame-angled", name: "斜挂框", nameEn: "Angled", category: "print", orientations: ["portrait", "square"] },

  polaroid: { id: "polaroid", name: "拍立得", nameEn: "Polaroid", category: "paper", orientations: ["square", "portrait"] },
  "sticky-note": { id: "sticky-note", name: "便签", nameEn: "Sticky", category: "paper", orientations: ["square", "portrait"] },
  flatlay: { id: "flatlay", name: "俯拍", nameEn: "Flatlay", category: "paper", orientations: ["square", "portrait"] },
};

export const FRAME_LIST: FrameMeta[] = Object.values(FRAME_META);

/** Frames compatible with a given orientation ("纯图" is always included). */
export function framesForOrientation(o: Orientation): FrameMeta[] {
  return FRAME_LIST.filter((f) => f.orientations.includes(o));
}

export function frameFitsOrientation(id: FrameId, o: Orientation): boolean {
  return FRAME_META[id].orientations.includes(o);
}

const DEFAULT_BY_ORIENTATION: Record<Orientation, FrameId> = {
  tall: "iphone-black",
  landscape: "monitor",
  portrait: "frame-dark",
  square: "frame-dark",
};

/** The frame a ratio should fall back to when its current frame doesn't fit. */
export function defaultFrameForOrientation(o: Orientation): FrameId {
  return DEFAULT_BY_ORIENTATION[o];
}
