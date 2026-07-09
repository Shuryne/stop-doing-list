import type { TemplateId, TemplateMeta } from "@/lib/types";
import { SilenceTemplate } from "./silence";
import { InkTemplate } from "./ink";
import { GridTemplate } from "./grid";
import { DuskTemplate } from "./dusk";

/**
 * The template registry. To contribute a template: add a file exporting a
 * component of type `ComponentType<TemplateProps>`, then register it here.
 */
export const TEMPLATES: Record<TemplateId, TemplateMeta> = {
  silence: {
    id: "silence",
    name: "静默",
    nameEn: "Silence",
    Component: SilenceTemplate,
  },
  ink: {
    id: "ink",
    name: "墨",
    nameEn: "Ink",
    Component: InkTemplate,
  },
  grid: {
    id: "grid",
    name: "格",
    nameEn: "Grid",
    Component: GridTemplate,
  },
  dusk: {
    id: "dusk",
    name: "暮",
    nameEn: "Dusk",
    Component: DuskTemplate,
  },
};

export const TEMPLATE_LIST: TemplateMeta[] = Object.values(TEMPLATES);
