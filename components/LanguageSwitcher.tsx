"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Languages } from "lucide-react";
import { useI18n } from "@/lib/i18n/provider";
import { locales, localeLabel, type Locale } from "@/lib/i18n/config";

/** Persist the choice so the proxy honors it on the next bare-URL visit.
 * Module-scoped (not inside the component) so the React Compiler doesn't read
 * the `document.cookie` write as a render-time mutation. */
function persistLocale(next: Locale) {
  document.cookie = `locale=${next}; path=/; max-age=31536000; samesite=lax`;
}

/**
 * A single toggle button that flips between the two locales. It shows the
 * label of the locale you'll switch *to* (with a translate icon), so one click
 * takes you there — no menu, no second click. Swaps the leading `/[lang]` path
 * segment while preserving the rest of the path and the `?d=` share query, so
 * language is a pure UI switch — the card you're looking at stays put. Also
 * writes a `locale` cookie the proxy reads, so the choice sticks on the next
 * bare-URL visit.
 */
export function LanguageSwitcher() {
  const { locale } = useI18n();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // With two locales, "the next one" is simply the other one.
  const next: Locale = locales.find((l) => l !== locale) ?? locale;

  const toggle = () => {
    persistLocale(next);
    // pathname is `/{locale}` or `/{locale}/...`; replace the first segment.
    const rest = pathname.replace(/^\/[^/]+/, "");
    const query = searchParams.toString();
    router.push(`/${next}${rest}${query ? `?${query}` : ""}`);
  };

  return (
    <button
      onClick={toggle}
      aria-label={`Switch to ${localeLabel[next]}`}
      title={`Switch to ${localeLabel[next]}`}
      className="flex h-8 items-center gap-1.5 rounded-full border border-black/5 bg-white/85 px-3 text-[12px] font-medium text-muted-foreground shadow-[0_10px_30px_-12px_rgba(0,0,0,0.25)] backdrop-blur-md transition-colors hover:text-foreground"
    >
      <Languages className="size-3.5" aria-hidden />
      {localeLabel[next]}
    </button>
  );
}
