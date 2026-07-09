"use client";

import { createContext, useContext, useEffect } from "react";
import type { ReactNode } from "react";
import type { Locale } from "./config";
import { getDictionary, type Dictionary } from "./dictionaries";
import { useEditorStore } from "@/lib/store";

type I18nValue = { locale: Locale; dict: Dictionary };

const I18nContext = createContext<I18nValue | null>(null);

/**
 * Seeds the whole client tree with the active locale + its dictionary. The
 * server passes only `locale` (a serializable string); the dictionary — which
 * holds interpolation functions that can't cross the RSC boundary — is resolved
 * here on the client.
 *
 * Also mirrors the locale into the editor store so sample content and `reset()`
 * follow the language (see `setLocale` in the store).
 */
export function I18nProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: ReactNode;
}) {
  const dict = getDictionary(locale);

  useEffect(() => {
    useEditorStore.getState().setLocale(locale);
  }, [locale]);

  return (
    <I18nContext.Provider value={{ locale, dict }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n(): I18nValue {
  const value = useContext(I18nContext);
  if (!value) {
    throw new Error("useI18n must be used within an <I18nProvider>");
  }
  return value;
}
