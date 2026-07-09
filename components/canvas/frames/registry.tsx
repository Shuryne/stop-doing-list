import type { ComponentType } from "react";
import type { FrameId, FrameProps } from "@/lib/frames";
import { NoneFrame } from "./none";
import { IPhoneBlack, IPhoneSilver, PhonePlain, IOSLock, IPhoneAngled } from "./phone";
import { Monitor, Browser, MacOSDesktop, MacBook } from "./screen";
import { FrameDark, FrameWood, FrameMetal, Mat, FramedAngled } from "./print";
import { Polaroid, StickyNote, Flatlay } from "./paper";

/** id → component, mirrored 1:1 with FRAME_META in lib/frames.ts. */
export const FRAME_COMPONENTS: Record<FrameId, ComponentType<FrameProps>> = {
  none: NoneFrame,
  "iphone-black": IPhoneBlack,
  "iphone-silver": IPhoneSilver,
  "phone-plain": PhonePlain,
  "ios-lock": IOSLock,
  "iphone-angled": IPhoneAngled,
  monitor: Monitor,
  browser: Browser,
  "macos-desktop": MacOSDesktop,
  macbook: MacBook,
  "frame-dark": FrameDark,
  "frame-wood": FrameWood,
  "frame-metal": FrameMetal,
  mat: Mat,
  "frame-angled": FramedAngled,
  polaroid: Polaroid,
  "sticky-note": StickyNote,
  flatlay: Flatlay,
};
