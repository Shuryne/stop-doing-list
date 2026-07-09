/**
 * Brand + deployment constants. Declared once here and shared by the site
 * metadata (app/[lang]/layout), the share-link page (app/[lang]/page), and the
 * OG image route (app/api/og) so the product name, host, and card dimensions
 * never drift between them.
 */

/** Product mark. Not translated — it's the brand, not copy. */
export const PRODUCT_NAME = "Stop Doing List";

export const SITE_HOST = "stop-doing-list.shuryne.com";
export const SITE_URL = `https://${SITE_HOST}`;

/** Open Graph / Twitter card image dimensions (px). */
export const OG_IMAGE_SIZE = { width: 1200, height: 630 } as const;

/** The openGraph.images + twitter block for a given card image URL. Shared by
 * the base metadata and the per-share-link override so they can't disagree on
 * the card shape. */
export function shareCardMetadata(imageUrl: string): {
  openGraph: { images: [{ url: string; width: number; height: number }] };
  twitter: { card: "summary_large_image"; images: [string] };
} {
  return {
    openGraph: { images: [{ url: imageUrl, ...OG_IMAGE_SIZE }] },
    twitter: { card: "summary_large_image", images: [imageUrl] },
  };
}
