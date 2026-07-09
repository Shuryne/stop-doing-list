"use client";

import { useEffect } from "react";
import { decodeShare } from "@/lib/share";
import { useEditorStore } from "@/lib/store";

/**
 * Hydrates the editor from a `?d=` share link on load. Renders nothing.
 * A brief flash of the default sample before hydration is acceptable.
 */
export function ShareLoader({ code }: { code?: string }) {
  useEffect(() => {
    if (!code) return;
    const shared = decodeShare(code);
    if (shared) useEditorStore.getState().loadShared(shared);
  }, [code]);

  return null;
}
