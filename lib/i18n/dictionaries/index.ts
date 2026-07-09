import type { Locale } from "../config";
import { en, type Dictionary } from "./en";
import { zh } from "./zh";

/**
 * Synchronous dictionary lookup. Both catalogs are plain TS modules (tiny, and
 * containing interpolation functions), so we resolve them directly rather than
 * via async `import()` — usable from server components (metadata) and client
 * components (the provider) alike.
 */
const dictionaries: Record<Locale, Dictionary> = { en, zh };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

export type { Dictionary };
