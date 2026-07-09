/**
 * i18n configuration — the single source of truth for which locales exist.
 * Kept dependency-free so it can be imported from the proxy (edge/node),
 * server components, and client components alike.
 */

export const locales = ["en", "zh"] as const;
export type Locale = (typeof locales)[number];

/** Fallback when the visitor's language can't be matched. */
export const defaultLocale: Locale = "zh";

/** Narrows an arbitrary string to a supported Locale. */
export function hasLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/** BCP-47 value for the `<html lang>` attribute. */
export const htmlLang: Record<Locale, string> = {
  en: "en",
  zh: "zh-CN",
};

/** Human label shown in the language switcher. */
export const localeLabel: Record<Locale, string> = {
  en: "EN",
  zh: "中",
};
