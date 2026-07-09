import type { ComponentType } from "react";
import type { Locale } from "./i18n/config";

/** The user's content — the single thing this whole app renders. */
export type StopDoingListData = {
  /** Heading, e.g. "Stop Doing List". Empty string hides it. */
  title: string;
  /** The "things I've decided not to do". Suggested 3–7, not hard-capped. */
  items: string[];
  /** Optional signature / handle shown as the "commitment" mark. */
  signature: string;
  /** ISO date (yyyy-mm-dd). Empty string hides it. */
  date: string;
};

/**
 * Each enum is declared once as a `const` tuple and its union type is derived
 * from it, so the runtime list (used by the share codec to validate untrusted
 * input) and the compile-time type can never drift apart.
 */
export const RATIO_IDS = ["wallpaper", "story", "poster", "square", "desktop"] as const;
export type RatioId = (typeof RATIO_IDS)[number];

export const THEME_IDS = ["light", "dark"] as const;
export type ThemeId = (typeof THEME_IDS)[number];

export const TEMPLATE_IDS = ["silence", "ink", "grid", "dusk"] as const;
export type TemplateId = (typeof TEMPLATE_IDS)[number];

/**
 * Global horizontal alignment for the poster's title + list. "auto" defers to
 * each template's own designed alignment (e.g. Grid left, Dusk centered); any
 * explicit value overrides every template uniformly.
 */
export const TEXT_ALIGNS = ["auto", "left", "center", "right"] as const;
export type TextAlign = (typeof TEXT_ALIGNS)[number];

/** Global text-size preference — a density scale layered over the auto-fit. */
export const TYPE_SCALES = ["compact", "normal", "relaxed"] as const;
export type TypeScale = (typeof TYPE_SCALES)[number];

/** The effective (non-"auto") alignment a template lays out at. */
export type ResolvedAlign = "left" | "center" | "right";

/**
 * The full serializable state of a card — everything a share link carries and
 * everything the editor store owns beyond its preview-only extras (frame,
 * itemIds, locale). Both `ShareState` (lib/share) and `EditorState` (lib/store)
 * build on this so the shared fields are declared exactly once.
 */
export type CardState = {
  data: StopDoingListData;
  template: TemplateId;
  ratio: RatioId;
  theme: ThemeId;
  align: TextAlign;
  scale: TypeScale;
};

/** Props every template component receives. */
export type TemplateProps = {
  data: StopDoingListData;
  ratio: RatioId;
  /** Active UI locale — drives the localized seal/chop each template renders. */
  locale: Locale;
  /** Global alignment override (see TextAlign). */
  align: TextAlign;
  /** Global text-size preference (see TypeScale). */
  scale: TypeScale;
};

/** A registered template — adding one is a file + a TEMPLATE_IDS id + a registry entry. */
export type TemplateMeta = {
  id: TemplateId;
  /** Chinese display name. */
  name: string;
  /** English display name. */
  nameEn: string;
  Component: ComponentType<TemplateProps>;
};
