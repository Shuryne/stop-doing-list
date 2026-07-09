import type { Locale } from "./i18n/config";
import type { StopDoingListData } from "./types";
import { todayISO } from "./format";
import { PRODUCT_NAME } from "./site";

/**
 * Sample content shown on first load — a stop-doing-list in the spirit of
 * long-termism (the whole point of the app), so the canvas is never empty.
 * Per-locale so the first impression reads natively in the visitor's language.
 * Shared by the editor store (initial + reset state) and the OG route's
 * fallback card, so the two never drift.
 */
export const SAMPLE_ITEMS: Record<Locale, string[]> = {
  zh: [
    "不做自己不懂的事",
    "不赚认知以外的钱",
    "不为短期增长牺牲长期",
    "不追热点，不随波逐流",
    "不轻易改变已想清楚的原则",
  ],
  en: [
    "Don't work on what I don't understand",
    "Don't chase money beyond my competence",
    "Don't trade the long term for short-term growth",
    "Don't chase trends or follow the crowd",
    "Don't lightly abandon principles I've thought through",
  ],
};

/** A full sample card for the given locale. `title` stays the product mark in
 * both languages — it's the brand, not copy. */
export function sampleData(locale: Locale): StopDoingListData {
  return {
    title: PRODUCT_NAME,
    items: SAMPLE_ITEMS[locale].slice(),
    signature: "",
    date: todayISO(),
  };
}
