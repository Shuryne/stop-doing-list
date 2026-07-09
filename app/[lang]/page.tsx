import type { Metadata } from "next";
import { Studio } from "@/components/Studio";
import { ShareLoader } from "@/components/ShareLoader";
import { decodeShare } from "@/lib/share";
import { hasLocale } from "@/lib/i18n/config";
import { shareCardMetadata } from "@/lib/site";

type Params = Promise<{ lang: string }>;
type SearchParams = Promise<{ d?: string }>;

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}): Promise<Metadata> {
  const [{ lang }, { d }] = await Promise.all([params, searchParams]);
  if (typeof d === "string" && decodeShare(d)) {
    const langParam = hasLocale(lang) ? `&lang=${lang}` : "";
    const ogUrl = `/api/og?d=${encodeURIComponent(d)}${langParam}`;
    return shareCardMetadata(ogUrl);
  }
  return {};
}

export default async function Home({
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  const { d } = await searchParams;
  return (
    <main className="h-dvh">
      <ShareLoader code={typeof d === "string" ? d : undefined} />
      <Studio />
    </main>
  );
}
