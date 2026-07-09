"use client";

import { useEffect, useState } from "react";
import { PanelLeftClose, PanelLeftOpen, Pencil, X } from "lucide-react";
import { Canvas } from "@/components/canvas/Canvas";
import { ContentPanel } from "@/components/editor/ContentPanel";
import { StyleRail } from "@/components/editor/StyleRail";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Brand } from "@/components/Brand";
import { Quotes } from "@/components/Quotes";
import { useI18n } from "@/lib/i18n/provider";

const PANEL_W = 360;

/**
 * Editing stage. The canvas is the full-bleed subject; controls come to it.
 *
 * Desktop (lg+): a collapsible content drawer on the left, a floating style
 * rail on the right.
 * Mobile: the canvas fills the screen; content editing lives in a bottom sheet
 * and the style toggles sit in a horizontal bar up top — the touch-native
 * equivalent of the desktop rail.
 */
export function Studio() {
  const [open, setOpen] = useState(false);
  const { dict } = useI18n();
  const t = dict.studio;

  // Desktop shows the drawer; mobile stays immersive (canvas first). Synced to
  // the breakpoint (not a one-shot) so it's right regardless of load-time width;
  // crossing the breakpoint resets it, but manual toggles within a breakpoint stick.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const apply = () => setOpen(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* Base layer: the preview stage fills everything. */}
      <div className="absolute inset-0">
        <Canvas />
      </div>

      {/* Brand anchor — top-left of the stage. Fades out while the drawer is
          open (the drawer's own header carries the mark then). Desktop only. */}
      <div
        className={`absolute top-4 left-5 z-20 hidden transition-opacity duration-300 lg:block ${
          open ? "pointer-events-none opacity-0" : "opacity-100"
        }`}
      >
        <Brand label={dict.content.heading} />
      </div>

      {/* Ambient rotating quote — canvas negative space, bottom-right. Desktop
          only; clear of the right rail (center) and export bar (bottom-center). */}
      <div className="absolute right-6 bottom-8 z-10 hidden max-w-[24rem] lg:block">
        <Quotes />
      </div>

      {/* ---- Style controls ---- */}
      {/* Desktop: vertical rail, right-center. */}
      <div className="absolute top-1/2 right-4 z-20 hidden -translate-y-1/2 lg:block">
        <StyleRail layout="vertical" />
      </div>
      {/* Mobile: horizontal bar, top-center. */}
      <div className="absolute top-3 left-1/2 z-20 -translate-x-1/2 lg:hidden">
        <StyleRail layout="horizontal" />
      </div>

      {/* Language switch — top-right, clear of both rails. */}
      <div className="absolute top-3 right-3 z-30 lg:top-4 lg:right-4">
        <LanguageSwitcher />
      </div>

      {/* ---- Desktop content drawer ---- */}
      <aside
        className="absolute inset-y-0 left-0 z-20 hidden flex-col border-r border-border/70 bg-[#f7f5f0] shadow-[8px_0_40px_-24px_rgba(0,0,0,0.35)] transition-transform duration-300 ease-out lg:flex"
        style={{
          width: PANEL_W,
          transform: open ? "translateX(0)" : `translateX(-${PANEL_W}px)`,
        }}
        aria-hidden={!open}
      >
        <ContentPanel dndId="stop-doing-desktop" />
      </aside>
      {/* Desktop drawer toggle — rides the panel's edge. */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="absolute top-1/2 z-30 hidden h-16 w-7 -translate-y-1/2 items-center justify-center rounded-r-xl border border-l-0 border-border/70 bg-[#f7f5f0] text-muted-foreground shadow-[6px_0_20px_-12px_rgba(0,0,0,0.3)] transition-[left] duration-300 ease-out hover:text-foreground lg:flex"
        style={{ left: open ? PANEL_W : 0 }}
        aria-label={open ? t.collapsePanel : t.expandPanel}
      >
        {open ? (
          <PanelLeftClose className="size-4" />
        ) : (
          <PanelLeftOpen className="size-4" />
        )}
      </button>

      {/* ---- Mobile content sheet ---- */}
      {/* Scrim */}
      <div
        onClick={() => setOpen(false)}
        className={`absolute inset-0 z-30 bg-black/30 transition-opacity duration-300 lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden
      />
      {/* Sheet */}
      <div
        className={`absolute inset-x-0 bottom-0 z-40 flex h-[82dvh] flex-col rounded-t-2xl border-t border-border/70 bg-[#f7f5f0] shadow-[0_-10px_40px_-16px_rgba(0,0,0,0.35)] transition-transform duration-300 ease-out lg:hidden ${
          open ? "translate-y-0" : "translate-y-full"
        }`}
        aria-hidden={!open}
      >
        <button
          onClick={() => setOpen(false)}
          className="flex items-center justify-center gap-2 pt-2.5 pb-1 text-muted-foreground"
          aria-label={t.collapsePanel}
        >
          <span className="h-1.5 w-10 rounded-full bg-black/15" />
          <X className="absolute right-4 size-4" />
        </button>
        <div className="min-h-0 flex-1">
          <ContentPanel dndId="stop-doing-mobile" />
        </div>
      </div>
      {/* Mobile "edit content" pill — visible when the sheet is closed. */}
      <button
        onClick={() => setOpen(true)}
        className={`absolute bottom-6 left-4 z-20 flex h-10 items-center gap-1.5 rounded-full border border-black/5 bg-white/85 px-4 text-[13px] font-medium text-foreground shadow-[0_10px_30px_-12px_rgba(0,0,0,0.3)] backdrop-blur-md transition-opacity lg:hidden ${
          open ? "pointer-events-none opacity-0" : "opacity-100"
        }`}
      >
        <Pencil className="size-3.5" />
        {t.editContent}
      </button>
    </div>
  );
}
