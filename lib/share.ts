import {
  RATIO_IDS,
  TEMPLATE_IDS,
  TEXT_ALIGNS,
  THEME_IDS,
  TYPE_SCALES,
  type CardState,
} from "./types";
import { DEFAULT_CARD } from "./defaults";

/**
 * Share codec — encodes the whole editor state into a URL-safe string so a link
 * fully reconstructs a card with no backend or storage. Works in the browser,
 * Node, and the edge runtime (used by both the share button and the OG route).
 */

const MAX_ITEMS = 20;
const MAX_LEN = 200;
const MAX_SIGNATURE_LEN = 80;
const MAX_DATE_LEN = 10;

/** The share codec carries exactly a card's serializable state. */
export type ShareState = CardState;

/** Narrow an untrusted value to a member of an enum tuple, or fall back. */
function pick<T extends string>(list: readonly T[], value: unknown, fallback: T): T {
  return typeof value === "string" && (list as readonly string[]).includes(value)
    ? (value as T)
    : fallback;
}

/** Compact on-the-wire shape — short keys keep the URL short. */
type Wire = {
  t: string;
  i: string[];
  s: string;
  d: string;
  p: string;
  r: string;
  h: string;
  /** Alignment + size; absent in links made before these controls existed. */
  a?: string;
  z?: string;
};

function str(v: unknown, max = MAX_LEN): string {
  return typeof v === "string" ? v.slice(0, max) : "";
}

export function encodeShare(state: ShareState): string {
  const wire: Wire = {
    t: str(state.data.title),
    i: state.data.items.slice(0, MAX_ITEMS).map((s) => str(s)),
    s: str(state.data.signature, MAX_SIGNATURE_LEN),
    d: str(state.data.date, MAX_DATE_LEN),
    p: state.template,
    r: state.ratio,
    h: state.theme,
    a: state.align,
    z: state.scale,
  };
  return toBase64Url(JSON.stringify(wire));
}

export function decodeShare(code: string): ShareState | null {
  try {
    const c = JSON.parse(fromBase64Url(code)) as Partial<Wire>;
    if (!c || typeof c !== "object") return null;
    return {
      data: {
        title: str(c.t),
        items: Array.isArray(c.i)
          ? c.i.slice(0, MAX_ITEMS).map((s) => str(s))
          : [],
        signature: str(c.s, MAX_SIGNATURE_LEN),
        date: str(c.d, MAX_DATE_LEN),
      },
      template: pick(TEMPLATE_IDS, c.p, DEFAULT_CARD.template),
      ratio: pick(RATIO_IDS, c.r, DEFAULT_CARD.ratio),
      theme: pick(THEME_IDS, c.h, DEFAULT_CARD.theme),
      align: pick(TEXT_ALIGNS, c.a, DEFAULT_CARD.align),
      scale: pick(TYPE_SCALES, c.z, DEFAULT_CARD.scale),
    };
  } catch {
    return null;
  }
}

export function buildShareUrl(origin: string, state: ShareState): string {
  return `${origin}/?d=${encodeShare(state)}`;
}

// --- base64url over UTF-8, runtime-agnostic (btoa/atob exist in browser, edge,
// and Node 18+). Content is small, so String.fromCharCode over the byte array
// is safe. ---

function toBase64Url(input: string): string {
  const bytes = new TextEncoder().encode(input);
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(input: string): string {
  const b64 = input.replace(/-/g, "+").replace(/_/g, "/");
  const bin = atob(b64);
  const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}
