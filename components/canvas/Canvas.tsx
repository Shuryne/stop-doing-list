"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { useEditorStore } from "@/lib/store";
import { RATIOS } from "@/lib/ratios";
import { exportNodeToPng } from "@/lib/export";
import { TEMPLATES } from "@/templates/registry";
import { useI18n } from "@/lib/i18n/provider";
import { FRAME_COMPONENTS } from "./frames/registry";

/** How much of the stage the poster is allowed to fill (leaves breathing room). */
const FIT_PLAIN = 0.84;
/** Frames add bezels around the poster, so give the poster itself less room. */
const FIT_FRAMED = 0.72;

/** Transparent breathing room (px, native scale) left around a framed cutout so
 * the frame's drop shadow isn't clipped at the capture edge. Sized to clear the
 * deepest frame shadow (the phone shell's ~150px reach). */
const CUTOUT_SHADOW_PAD = 160;

/** Resolve after two animation frames — long enough for a fresh subtree to lay
 * out and for imperative style changes to take effect before capture. */
const nextFrame = () =>
  new Promise<void>((resolve) =>
    requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
  );

export function Canvas() {
  const data = useEditorStore((s) => s.data);
  const templateId = useEditorStore((s) => s.template);
  const ratioId = useEditorStore((s) => s.ratio);
  const theme = useEditorStore((s) => s.theme);
  const align = useEditorStore((s) => s.align);
  const sizeScale = useEditorStore((s) => s.scale);
  const frameId = useEditorStore((s) => s.frame);

  const ratio = RATIOS[ratioId];
  const template = TEMPLATES[templateId];
  const Template = template.Component;
  const Frame = FRAME_COMPONENTS[frameId];
  const { locale, dict } = useI18n();

  const viewportRef = useRef<HTMLDivElement>(null);
  const captureRef = useRef<HTMLDivElement>(null);
  // Offscreen scene used only when exporting a framed cutout (see handleExport).
  const exportSceneRef = useRef<HTMLDivElement>(null);
  const exportFrameRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.2);
  const [exporting, setExporting] = useState(false);
  const [framedExport, setFramedExport] = useState(false);
  // Export preference: bake the selected frame into the PNG (as a tight cutout).
  // Only meaningful when a frame is selected; defaults on so the preview matches.
  const [includeFrame, setIncludeFrame] = useState(true);

  // Fit the native-size poster into the stage with a CSS transform.
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const fit = frameId === "none" ? FIT_PLAIN : FIT_FRAMED;
    const recompute = () => {
      const { width, height } = el.getBoundingClientRect();
      if (!width || !height) return;
      const s = Math.min(width / ratio.width, height / ratio.height) * fit;
      setScale(s > 0 ? s : 0.2);
    };
    recompute();
    const ro = new ResizeObserver(recompute);
    ro.observe(el);
    return () => ro.disconnect();
  }, [ratio.width, ratio.height, frameId]);

  const handleExport = useCallback(async () => {
    if (exporting) return;
    setExporting(true);
    const filename = `stop-doing-list-${templateId}-${data.date || "card"}`;
    try {
      if (frameId === "none" || !includeFrame) {
        // Plain poster: capture the native-size node directly.
        const node = captureRef.current;
        if (!node) throw new Error("capture node missing");
        await exportNodeToPng(node, {
          width: ratio.width,
          height: ratio.height,
          filename,
        });
      } else {
        // Framed cutout: mount the offscreen scene (frame + native poster) on a
        // transparent backdrop, measure the frame's rotated bounding box, size
        // the capture box to that box plus shadow padding, then capture it.
        setFramedExport(true);
        await nextFrame();
        const scene = exportSceneRef.current;
        const frameEl = exportFrameRef.current;
        if (!scene || !frameEl) throw new Error("export scene missing");
        const box = frameEl.getBoundingClientRect();
        if (box.width <= 0 || box.height <= 0)
          throw new Error("export frame measured zero size");
        const w = Math.ceil(box.width + CUTOUT_SHADOW_PAD * 2);
        const h = Math.ceil(box.height + CUTOUT_SHADOW_PAD * 2);
        scene.style.width = `${w}px`;
        scene.style.height = `${h}px`;
        await nextFrame();
        await exportNodeToPng(scene, { width: w, height: h, filename });
      }
      toast.success(dict.canvas.exportSuccess);
    } catch (err) {
      console.error(err);
      toast.error(dict.canvas.exportError);
    } finally {
      setExporting(false);
      setFramedExport(false);
    }
  }, [
    exporting,
    frameId,
    includeFrame,
    ratio.width,
    ratio.height,
    templateId,
    data.date,
    dict,
  ]);

  const footW = ratio.width * scale;
  const footH = ratio.height * scale;

  // The poster at on-screen size. Its inner node (captureRef) renders at native
  // pixels and is the one captured on export — frame chrome never touches it.
  const poster = (
    <div
      style={{ width: footW, height: footH }}
      className="relative overflow-hidden"
    >
      <div
        ref={captureRef}
        data-sdl-theme={theme}
        style={{
          width: ratio.width,
          height: ratio.height,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          fontFamily: "var(--font-sans)",
          background: "var(--sdl-bg)",
        }}
      >
        <Template
          data={data}
          ratio={ratioId}
          locale={locale}
          align={align}
          scale={sizeScale}
        />
      </div>
    </div>
  );

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-[#eceae3]">
      {/* Soft studio light + subtle vignette so the poster reads as the subject. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(70% 55% at 50% 38%, rgba(255,255,255,0.7), transparent 70%), radial-gradient(120% 100% at 50% 120%, rgba(0,0,0,0.06), transparent 60%)",
        }}
      />

      {/* Stage: measured area the poster is fit into. */}
      <div
        ref={viewportRef}
        className="relative flex min-h-0 flex-1 items-center justify-center px-6 pt-24 pb-28 lg:p-14"
      >
        <Frame w={footW}>{poster}</Frame>
      </div>

      {/* Floating tool bar. */}
      <div className="relative z-10 flex shrink-0 justify-center px-6 pb-6">
        <div className="flex items-center gap-1.5 rounded-full border border-black/5 bg-white/80 py-1.5 pr-1.5 pl-1.5 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.25)] backdrop-blur-md sm:pl-4">
          <span className="text-muted-foreground hidden text-[12px] tracking-wide tabular-nums sm:inline">
            {ratio.width}×{ratio.height}
          </span>
          {frameId !== "none" && (
            <Toggle
              size="sm"
              pressed={includeFrame}
              onPressedChange={setIncludeFrame}
              aria-label={dict.canvas.includeFrame}
              className="text-muted-foreground rounded-full text-[12px] data-[state=on]:text-foreground"
            >
              {dict.canvas.includeFrame}
            </Toggle>
          )}
          <Button
            size="icon"
            onClick={handleExport}
            disabled={exporting}
            aria-label={exporting ? dict.canvas.exporting : dict.canvas.export}
            className="rounded-full"
          >
            {exporting ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Download className="size-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Offscreen framed-cutout scene. Mounted only during a framed export: the
          poster renders at native pixels inside the frame on a transparent
          backdrop; the frame is centered and its rotated bounding box (plus
          shadow padding) becomes the captured PNG — a tight, edge-cropped cutout. */}
      {framedExport && (
        <div
          ref={exportSceneRef}
          aria-hidden
          style={{
            position: "fixed",
            left: -99999,
            top: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            background: "transparent",
          }}
        >
          <div ref={exportFrameRef}>
            <Frame w={ratio.width}>
              <div
                data-sdl-theme={theme}
                style={{
                  width: ratio.width,
                  height: ratio.height,
                  fontFamily: "var(--font-sans)",
                  background: "var(--sdl-bg)",
                }}
              >
                <Template
                  data={data}
                  ratio={ratioId}
                  locale={locale}
                  align={align}
                  scale={sizeScale}
                />
              </div>
            </Frame>
          </div>
        </div>
      )}
    </div>
  );
}
