import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { locales, defaultLocale, type Locale } from "@/lib/i18n/config";

/**
 * Locale routing. Every page lives under `/[lang]`, so a request without a
 * locale prefix (`/`, `/?d=...`) is redirected to the visitor's best-match
 * locale. Preference order: an explicit cookie (set when they pick a language),
 * then the `Accept-Language` header, then the default.
 */

const COOKIE = "locale";

function pickLocale(request: NextRequest): Locale {
  const cookie = request.cookies.get(COOKIE)?.value;
  if (cookie && (locales as readonly string[]).includes(cookie)) {
    return cookie as Locale;
  }

  // Lightweight Accept-Language match — we only support two locales, so a
  // substring scan is enough (avoids pulling in a negotiator dependency).
  const header = request.headers.get("accept-language")?.toLowerCase() ?? "";
  for (const part of header.split(",")) {
    const tag = part.split(";")[0].trim();
    if (tag.startsWith("zh")) return "zh";
    if (tag.startsWith("en")) return "en";
  }
  return defaultLocale;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasLocalePrefix = locales.some(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`),
  );
  if (hasLocalePrefix) return NextResponse.next();

  const locale = pickLocale(request);
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  // Run on everything except API routes, Next internals, and static assets.
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\..*).*)",
  ],
};
