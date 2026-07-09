"use client";

import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  restrictToParentElement,
  restrictToVerticalAxis,
} from "@dnd-kit/modifiers";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { memo } from "react";
import { GripVertical, Link2, Plus, RotateCcw, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useShallow } from "zustand/react/shallow";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BrandMark } from "@/components/Brand";
import { SectionLabel } from "@/components/editor/SectionLabel";
import { buildShareUrl } from "@/lib/share";
import { RECOMMENDED_MAX_ITEMS, useEditorStore } from "@/lib/store";
import { useI18n } from "@/lib/i18n/provider";

const inputClass =
  "h-11 rounded-xl border-input/80 bg-white text-[15px] shadow-none focus-visible:ring-primary/25";

/** One draggable item row. Its own component because `useSortable` is a hook;
 * the grip is the activator (drag starts only there) while the whole row is the
 * sortable node, so it slides to make room as siblings reorder in real time.
 *
 * `memo`'d with index-carrying callbacks (`onChange`/`onRemove` take the index
 * and are the store's stable action refs), so editing one row re-renders only
 * that row instead of the whole list. */
const SortableRow = memo(function SortableRow({
  id,
  index,
  value,
  placeholder,
  dragLabel,
  removeLabel,
  onChange,
  onRemove,
}: {
  id: string;
  index: number;
  value: string;
  placeholder: string;
  dragLabel: string;
  removeLabel: string;
  onChange: (index: number, value: string) => void;
  onRemove: (index: number) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-1.5 rounded-xl ${
        isDragging ? "bg-background relative z-10 opacity-80 shadow-sm" : ""
      }`}
    >
      <button
        type="button"
        ref={setActivatorNodeRef}
        {...attributes}
        {...listeners}
        aria-label={dragLabel}
        className="text-muted-foreground/40 hover:text-foreground flex size-7 shrink-0 cursor-grab touch-none items-center justify-center active:cursor-grabbing"
      >
        <GripVertical className="size-4" />
      </button>
      <span className="text-muted-foreground/50 w-4 shrink-0 text-right font-serif text-[13px] tabular-nums">
        {index + 1}
      </span>
      <Input
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(index, e.target.value)}
        className={inputClass}
      />
      <Button
        variant="ghost"
        size="icon"
        className="text-muted-foreground/70 hover:text-destructive size-7 shrink-0"
        onClick={() => onRemove(index)}
        aria-label={removeLabel}
      >
        <Trash2 className="size-3.5" />
      </Button>
    </div>
  );
});

/**
 * The "document" side of the editor: everything the user actually types.
 * Style presets live in the floating StyleRail — kept apart on purpose so
 * typing has room and quick toggles stay out of the way.
 */
export function ContentPanel({
  // Distinguishes DndContexts when the panel is mounted more than once (the
  // desktop drawer and the mobile sheet both render it), so their generated
  // accessibility ids don't collide in the DOM.
  dndId = "stop-doing-items",
}: {
  dndId?: string;
} = {}) {
  // Subscribe only to the editable content (`data`/`itemIds`) plus the stable
  // actions, so style-rail toggles (template/ratio/theme/…) don't re-render the
  // panel or its item rows.
  const {
    data,
    itemIds,
    setTitle,
    addItem,
    updateItem,
    removeItem,
    reorderItem,
    setSignature,
    setDate,
    reset,
  } = useEditorStore(
    useShallow((s) => ({
      data: s.data,
      itemIds: s.itemIds,
      setTitle: s.setTitle,
      addItem: s.addItem,
      updateItem: s.updateItem,
      removeItem: s.removeItem,
      reorderItem: s.reorderItem,
      setSignature: s.setSignature,
      setDate: s.setDate,
      reset: s.reset,
    })),
  );
  const { dict } = useI18n();
  const t = dict.content;

  const items = data.items;
  const tooMany = items.length > RECOMMENDED_MAX_ITEMS;

  const sensors = useSensors(
    // A small drag threshold so clicking the grip (e.g. to focus) doesn't drag.
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const from = itemIds.indexOf(String(active.id));
    const to = itemIds.indexOf(String(over.id));
    if (from === -1 || to === -1) return;
    reorderItem(from, to);
  };

  const handleShare = async () => {
    const { data, template, ratio, theme, align, scale } =
      useEditorStore.getState();
    const url = buildShareUrl(window.location.origin, {
      data,
      template,
      ratio,
      theme,
      align,
      scale,
    });
    try {
      await navigator.clipboard.writeText(url);
      toast.success(t.shareSuccess, {
        description: t.shareSuccessDesc,
      });
    } catch {
      toast.error(t.shareError);
    }
  };

  return (
    <div className="flex h-full flex-col">
      <header className="flex items-start justify-between gap-3 px-5 pt-5 pb-4">
        <div className="space-y-1">
          <h1 className="flex items-center gap-2 font-serif text-[20px] leading-none font-semibold tracking-tight">
            <BrandMark className="size-5" />
            {t.heading}
          </h1>
          <p className="text-muted-foreground pl-7 text-[12px]">{t.tagline}</p>
        </div>
        <div className="-mr-2 flex shrink-0 items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleShare}
            className="text-primary hover:text-primary h-8 gap-1.5 text-xs"
          >
            <Link2 className="size-3.5" />
            {t.share}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={reset}
            className="text-muted-foreground h-8 gap-1.5 text-xs"
          >
            <RotateCcw className="size-3.5" />
            {t.reset}
          </Button>
        </div>
      </header>

      <div className="border-border/70 min-h-0 flex-1 space-y-6 overflow-y-auto border-t px-5 pt-5 pb-8">
        {/* Title */}
        <section>
          <SectionLabel>{t.titleLabel}</SectionLabel>
          <Input
            value={data.title}
            placeholder={t.titlePlaceholder}
            onChange={(e) => setTitle(e.target.value)}
            className={inputClass}
          />
        </section>

        {/* Items */}
        <section>
          <div className="mb-2.5 flex items-baseline justify-between">
            <SectionLabel>
              <span className="mb-0">{t.listLabel}</span>
            </SectionLabel>
            <span
              className={
                tooMany
                  ? "text-[11px] text-amber-600"
                  : "text-muted-foreground text-[11px] tabular-nums"
              }
            >
              {t.itemsCount(items.length)}
              {tooMany ? t.tooManySuffix : ""}
            </span>
          </div>

          <DndContext
            id={dndId}
            sensors={sensors}
            collisionDetection={closestCenter}
            modifiers={[restrictToVerticalAxis, restrictToParentElement]}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={itemIds}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2">
                {items.map((item, i) => (
                  <SortableRow
                    key={itemIds[i]}
                    id={itemIds[i]}
                    index={i}
                    value={item}
                    placeholder={t.itemPlaceholder(i + 1)}
                    dragLabel={t.reorder}
                    removeLabel={t.remove}
                    onChange={updateItem}
                    onRemove={removeItem}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>

          <Button
            variant="outline"
            className="mt-2.5 h-10 w-full rounded-xl border-dashed text-[13px]"
            onClick={addItem}
          >
            <Plus className="size-4" />
            {t.addItem}
          </Button>
        </section>

        {/* Signature & date */}
        <section className="grid grid-cols-2 gap-3">
          <div>
            <SectionLabel>{t.signatureLabel}</SectionLabel>
            <Input
              value={data.signature}
              placeholder={t.signaturePlaceholder}
              onChange={(e) => setSignature(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <SectionLabel>{t.dateLabel}</SectionLabel>
            <Input
              type="date"
              value={data.date}
              onChange={(e) => setDate(e.target.value)}
              className={inputClass}
            />
          </div>
        </section>
      </div>
    </div>
  );
}
