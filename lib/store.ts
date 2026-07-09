import { create } from "zustand";
import type {
  CardState,
  RatioId,
  TemplateId,
  TextAlign,
  ThemeId,
  TypeScale,
} from "./types";
import type { ShareState } from "./share";
import { DEFAULT_CARD } from "./defaults";
import { sampleData } from "./sample";
import { defaultLocale, type Locale } from "./i18n/config";
import { RATIOS } from "./ratios";
import {
  defaultFrameForOrientation,
  frameFitsOrientation,
  type FrameId,
} from "./frames";

/** The frame the default ratio opens with (derived, so it stays valid if the
 * default ratio ever changes orientation). */
const DEFAULT_FRAME = defaultFrameForOrientation(
  RATIOS[DEFAULT_CARD.ratio].orientation,
);

/** Monotonic source of stable row ids for drag-and-drop. Kept out of the shared
 * `data` (so share links / export stay a plain string[]) but owned by the store
 * so every items mutation can keep the id list in lockstep — the editor reads
 * these as dnd-kit keys. The initial ids are index-based so server and client
 * render the same first paint; the counter only advances on client edits. */
let idSeq = 0;
const nextId = (): string => `item-${idSeq++}`;
function makeIds(count: number): string[] {
  return Array.from({ length: count }, nextId);
}

/** Soft guidance only — we warn past this, never block. */
export const RECOMMENDED_MAX_ITEMS = 7;

type EditorState = CardState & {
  /** Stable per-row ids parallel to `data.items`, for drag-and-drop reordering.
   * Always the same length as `data.items`; not part of the shared/exported data. */
  itemIds: string[];
  /** Preview-only shell (phone / monitor / frame / none) wrapped around the
   * poster. Never exported. Must fit the current ratio's orientation. */
  frame: FrameId;

  /** Active UI locale, mirrored from the route by the I18nProvider. Drives which
   * sample content `reset()` restores. */
  locale: Locale;
  /** True while the canvas still shows untouched sample content — so switching
   * language can swap the sample without clobbering anything the user typed. */
  pristine: boolean;

  /** Set the active locale; while still pristine, swap in that locale's sample. */
  setLocale: (locale: Locale) => void;

  setTitle: (title: string) => void;
  addItem: () => void;
  updateItem: (index: number, value: string) => void;
  removeItem: (index: number) => void;
  /** Move the item at `from` to sit at `to` (drag-and-drop reorder). */
  reorderItem: (from: number, to: number) => void;
  setSignature: (signature: string) => void;
  setDate: (date: string) => void;

  setTemplate: (template: TemplateId) => void;
  setRatio: (ratio: RatioId) => void;
  setTheme: (theme: ThemeId) => void;
  setAlign: (align: TextAlign) => void;
  setScale: (scale: TypeScale) => void;
  setFrame: (frame: FrameId) => void;
  reset: () => void;

  /** Replace the entire editor state from a decoded share link. */
  loadShared: (shared: ShareState) => void;
};

export const useEditorStore = create<EditorState>((set) => ({
  data: sampleData(defaultLocale),
  itemIds: makeIds(sampleData(defaultLocale).items.length),
  ...DEFAULT_CARD,
  frame: DEFAULT_FRAME,
  locale: defaultLocale,
  pristine: true,

  setLocale: (locale) =>
    set((s) => {
      if (s.locale === locale) return s;
      if (!s.pristine) return { locale };
      // Still untouched: swap in this locale's sample and fresh ids to match.
      const data = sampleData(locale);
      return { locale, data, itemIds: makeIds(data.items.length) };
    }),

  setTitle: (title) =>
    set((s) => ({ data: { ...s.data, title }, pristine: false })),

  addItem: () =>
    set((s) => ({
      data: { ...s.data, items: [...s.data.items, ""] },
      itemIds: [...s.itemIds, nextId()],
      pristine: false,
    })),

  updateItem: (index, value) =>
    set((s) => {
      const items = s.data.items.slice();
      items[index] = value;
      return { data: { ...s.data, items }, pristine: false };
    }),

  removeItem: (index) =>
    set((s) => ({
      data: { ...s.data, items: s.data.items.filter((_, i) => i !== index) },
      itemIds: s.itemIds.filter((_, i) => i !== index),
      pristine: false,
    })),

  reorderItem: (from, to) =>
    set((s) => {
      const len = s.data.items.length;
      if (from === to || from < 0 || to < 0 || from >= len || to >= len)
        return s;
      const items = s.data.items.slice();
      const [movedItem] = items.splice(from, 1);
      items.splice(to, 0, movedItem);
      const itemIds = s.itemIds.slice();
      const [movedId] = itemIds.splice(from, 1);
      itemIds.splice(to, 0, movedId);
      return { data: { ...s.data, items }, itemIds, pristine: false };
    }),

  setSignature: (signature) =>
    set((s) => ({ data: { ...s.data, signature }, pristine: false })),
  setDate: (date) =>
    set((s) => ({ data: { ...s.data, date }, pristine: false })),

  setTemplate: (template) => set({ template }),
  // Changing ratio can change orientation; if the current frame no longer fits
  // (e.g. a phone frame on a landscape ratio), fall back to that orientation's
  // default. "纯图" fits everything, so a user's plain choice always sticks.
  setRatio: (ratio) =>
    set((s) => {
      const orientation = RATIOS[ratio].orientation;
      const frame = frameFitsOrientation(s.frame, orientation)
        ? s.frame
        : defaultFrameForOrientation(orientation);
      return { ratio, frame };
    }),
  setTheme: (theme) => set({ theme }),
  setAlign: (align) => set({ align }),
  setScale: (scale) => set({ scale }),
  setFrame: (frame) => set({ frame }),

  reset: () =>
    set((s) => {
      const data = sampleData(s.locale);
      return {
        data,
        itemIds: makeIds(data.items.length),
        ...DEFAULT_CARD,
        frame: DEFAULT_FRAME,
        pristine: true,
      };
    }),

  loadShared: (shared) =>
    set({
      data: shared.data,
      itemIds: makeIds(shared.data.items.length),
      template: shared.template,
      ratio: shared.ratio,
      theme: shared.theme,
      align: shared.align,
      scale: shared.scale,
      // Frame isn't shared (it's a preview pref); pick one that fits the ratio.
      frame: defaultFrameForOrientation(RATIOS[shared.ratio].orientation),
      pristine: false,
    }),
}));
