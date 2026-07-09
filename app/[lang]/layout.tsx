import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { I18nProvider } from "@/lib/i18n/provider";
import {
  htmlLang,
  hasLocale,
  locales,
  type Locale,
} from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { OG_IMAGE_SIZE, PRODUCT_NAME, SITE_URL } from "@/lib/site";
import "../globals.css";

// Latin UI + Latin glyphs on the canvas. CJK falls back to a high-quality
// system stack (see globals.css) — no heavy CJK webfont to keep the build fast
// and downloads light. TODO(v1): self-host a subsetted CJK webfont so exports
// look identical across OSes.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

/** Pre-render both locales at build time. */
export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const { meta } = getDictionary(lang);

  return {
    metadataBase: new URL(SITE_URL),
    title: { default: meta.title, template: meta.titleTemplate },
    description: meta.description,
    keywords: meta.keywords,
    alternates: {
      canonical: `/${lang}`,
      languages: Object.fromEntries(
        locales.map((l) => [htmlLang[l], `/${l}`]),
      ),
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: `${SITE_URL}/${lang}`,
      siteName: PRODUCT_NAME,
      locale: htmlLang[lang],
      type: "website",
      images: [{ url: `/api/og?lang=${lang}`, ...OG_IMAGE_SIZE }],
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
      images: [`/api/og?lang=${lang}`],
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const locale = lang as Locale;

  return (
    <html
      lang={htmlLang[locale]}
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <I18nProvider locale={locale}>{children}</I18nProvider>
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
