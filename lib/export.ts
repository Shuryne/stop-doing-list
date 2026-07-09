import { domToPng } from "modern-screenshot";

export type ExportOptions = {
  /** Native render width in px (the node's own width). */
  width: number;
  /** Native render height in px. */
  height: number;
  /** Download filename, without extension. */
  filename: string;
  /** Supersample factor for extra crispness. Default 2. */
  pixelRatio?: number;
};

function triggerDownload(dataUrl: string, filename: string) {
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = `${filename}.png`;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

function withTimeout<T>(p: Promise<T>, ms: number, label: string): Promise<T> {
  return Promise.race([
    p,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms),
    ),
  ]);
}

/**
 * Render `node` to a high-res PNG and download it.
 *
 * The node is expected to already be laid out at its native pixel size (e.g.
 * 1290×2796) — the on-screen preview scales it with a CSS transform on an
 * ancestor, which modern-screenshot ignores, so the capture is full resolution.
 */
export async function exportNodeToPng(
  node: HTMLElement,
  { width, height, filename, pixelRatio = 2 }: ExportOptions,
): Promise<void> {
  // Best-effort: make sure webfonts are ready, but never block on it.
  if (typeof document !== "undefined" && "fonts" in document) {
    await withTimeout(document.fonts.ready, 3000, "fonts.ready").catch(
      () => undefined,
    );
  }

  const dataUrl = await withTimeout(
    domToPng(node, {
      width,
      height,
      scale: pixelRatio,
      // The preview node is scaled down with a CSS transform on an ancestor;
      // reset it so we capture at native size.
      style: { margin: "0", transform: "none" },
    }),
    20000,
    "domToPng",
  );

  triggerDownload(dataUrl, filename);
}
