"use client";

import type { ReactNode } from "react";
import { AlignLeft, Contrast, Frame, LayoutGrid, Ratio, Type } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group";
import { useShallow } from "zustand/react/shallow";
import { SectionLabel } from "@/components/editor/SectionLabel";
import { useEditorStore } from "@/lib/store";
import { RATIO_LIST, RATIOS } from "@/lib/ratios";
import { framesForOrientation, type FrameId } from "@/lib/frames";
import { TEMPLATE_LIST } from "@/templates/registry";
import { useI18n } from "@/lib/i18n/provider";
import type { RatioId, TemplateId, TextAlign, ThemeId, TypeScale } from "@/lib/types";

const toggleItemClass =
  "flex-1 rounded-lg text-[13px] font-medium transition-colors data-[state=on]:border-primary data-[state=on]:bg-primary/12 data-[state=on]:text-primary data-[state=on]:shadow-[inset_0_0_0_1px_var(--primary)]";

/** Literal column classes (Tailwind can't see interpolated ones). */
const GRID_COLS: Record<2 | 3, string> = {
  2: "grid-cols-2",
  3: "grid-cols-3",
};

type RailOption = { value: string; label: string; sub?: string };

/** The single-select toggle grid every rail control renders. Options carry a
 * `sub` caption (used by the ratio dimensions) and the group can render its
 * primary label larger (`strong`, for the template names). */
function RailToggleGroup({
  value,
  onChange,
  cols,
  options,
  itemHeight = "h-10",
  strong = false,
}: {
  value: string;
  onChange: (v: string) => void;
  cols: 2 | 3;
  options: RailOption[];
  itemHeight?: string;
  strong?: boolean;
}) {
  return (
    <ToggleGroup
      type="single"
      value={value}
      onValueChange={(v) => v && onChange(v)}
      variant="outline"
      className={`grid w-full ${GRID_COLS[cols]} gap-2 border-0`}
    >
      {options.map((o) => (
        <ToggleGroupItem
          key={o.value}
          value={o.value}
          className={`${toggleItemClass} ${itemHeight} border ${o.sub ? "flex-col gap-0.5" : ""}`}
        >
          <span className={strong ? "text-[14px] font-semibold" : "text-[13px] font-medium"}>
            {o.label}
          </span>
          {o.sub && (
            <span className="text-muted-foreground text-[9px] tracking-wide tabular-nums">
              {o.sub}
            </span>
          )}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}

/** One icon button on the rail that pops its settings out toward the stage. */
function RailItem({
  icon,
  label,
  value,
  side,
  children,
}: {
  icon: ReactNode;
  label: string;
  /** Short current-value caption under the label. */
  value: string;
  /** Which way the popover opens (away from the rail). */
  side: "left" | "bottom";
  children: ReactNode;
}) {
  return (
    <Popover>
      <PopoverTrigger
        className="group flex w-14 flex-col items-center gap-1 rounded-xl px-2 py-2.5 text-muted-foreground outline-none transition-colors hover:bg-black/[0.04] hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary/30 aria-expanded:bg-primary/10 aria-expanded:text-primary"
        aria-label={label}
      >
        <span className="[&_svg]:size-[18px]">{icon}</span>
        <span className="text-[10px] leading-none font-medium">{label}</span>
        <span className="text-[9px] leading-none text-muted-foreground/70 tabular-nums">
          {value}
        </span>
      </PopoverTrigger>
      <PopoverContent side={side} align="center" className="w-64">
        <SectionLabel>{label}</SectionLabel>
        {children}
      </PopoverContent>
    </Popover>
  );
}

export function StyleRail({
  layout = "vertical",
}: {
  layout?: "vertical" | "horizontal";
}) {
  // Subscribe only to the style fields (and the stable setters) so typing in the
  // content panel — which mutates `data`/`itemIds` — never re-renders this rail.
  const {
    template,
    ratio,
    theme,
    align,
    scale,
    frame,
    setTemplate,
    setRatio,
    setTheme,
    setAlign,
    setScale,
    setFrame,
  } = useEditorStore(
    useShallow((s) => ({
      template: s.template,
      ratio: s.ratio,
      theme: s.theme,
      align: s.align,
      scale: s.scale,
      frame: s.frame,
      setTemplate: s.setTemplate,
      setRatio: s.setRatio,
      setTheme: s.setTheme,
      setAlign: s.setAlign,
      setScale: s.setScale,
      setFrame: s.setFrame,
    })),
  );
  const { locale, dict } = useI18n();
  const rail = dict.rail;

  // Every option carries Chinese + English wording; show only the active one.
  const L = (zh: string, en: string) => (locale === "zh" ? zh : en);

  const alignLabels: Record<TextAlign, string> = {
    auto: rail.alignAuto,
    left: rail.alignLeft,
    center: rail.alignCenter,
    right: rail.alignRight,
  };
  const sizeLabels: Record<TypeScale, string> = {
    compact: rail.sizeCompact,
    normal: rail.sizeNormal,
    relaxed: rail.sizeRelaxed,
  };
  const alignOptions: TextAlign[] = ["auto", "left", "center", "right"];
  const sizeOptions: TypeScale[] = ["compact", "normal", "relaxed"];

  const currentTemplate = TEMPLATE_LIST.find((t) => t.id === template);
  const currentRatio = RATIO_LIST.find((r) => r.id === ratio);
  const availableFrames = framesForOrientation(RATIOS[ratio].orientation);
  const currentFrame = availableFrames.find((f) => f.id === frame);
  const side = layout === "vertical" ? "left" : "bottom";

  return (
    <div
      className={`flex gap-1 rounded-2xl border border-black/5 bg-white/85 p-1.5 shadow-[0_16px_40px_-18px_rgba(0,0,0,0.3)] backdrop-blur-md ${
        layout === "vertical" ? "flex-col" : "flex-row"
      }`}
    >
      <RailItem
        icon={<LayoutGrid />}
        label={rail.template}
        side={side}
        value={currentTemplate ? L(currentTemplate.name, currentTemplate.nameEn) : ""}
      >
        <RailToggleGroup
          value={template}
          onChange={(v) => setTemplate(v as TemplateId)}
          cols={3}
          itemHeight="h-12"
          strong
          options={TEMPLATE_LIST.map((t) => ({
            value: t.id,
            label: L(t.name, t.nameEn),
          }))}
        />
      </RailItem>

      <RailItem
        icon={<Ratio />}
        label={rail.ratio}
        side={side}
        value={currentRatio ? L(currentRatio.label, currentRatio.labelEn) : ""}
      >
        <RailToggleGroup
          value={ratio}
          onChange={(v) => setRatio(v as RatioId)}
          cols={2}
          itemHeight="h-12"
          options={RATIO_LIST.map((r) => ({
            value: r.id,
            label: L(r.label, r.labelEn),
            sub: `${r.width}×${r.height}`,
          }))}
        />
      </RailItem>

      <RailItem
        icon={<Frame />}
        label={rail.frame}
        side={side}
        value={currentFrame ? L(currentFrame.name, currentFrame.nameEn) : ""}
      >
        <RailToggleGroup
          value={frame}
          onChange={(v) => setFrame(v as FrameId)}
          cols={2}
          options={availableFrames.map((f) => ({
            value: f.id,
            label: L(f.name, f.nameEn),
          }))}
        />
      </RailItem>

      <RailItem
        icon={<Contrast />}
        label={rail.theme}
        side={side}
        value={theme === "light" ? rail.light : rail.dark}
      >
        <RailToggleGroup
          value={theme}
          onChange={(v) => setTheme(v as ThemeId)}
          cols={2}
          options={[
            { value: "light", label: rail.light },
            { value: "dark", label: rail.dark },
          ]}
        />
      </RailItem>

      <RailItem icon={<AlignLeft />} label={rail.align} side={side} value={alignLabels[align]}>
        <RailToggleGroup
          value={align}
          onChange={(v) => setAlign(v as TextAlign)}
          cols={2}
          options={alignOptions.map((v) => ({ value: v, label: alignLabels[v] }))}
        />
      </RailItem>

      <RailItem icon={<Type />} label={rail.size} side={side} value={sizeLabels[scale]}>
        <RailToggleGroup
          value={scale}
          onChange={(v) => setScale(v as TypeScale)}
          cols={3}
          options={sizeOptions.map((v) => ({ value: v, label: sizeLabels[v] }))}
        />
      </RailItem>
    </div>
  );
}
