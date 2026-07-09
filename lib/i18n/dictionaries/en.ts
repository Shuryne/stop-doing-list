/**
 * English message catalog — the source-of-truth SHAPE for every locale.
 * `Dictionary` is derived from this object, so any other locale (see `zh.ts`)
 * is structurally checked against it: add a key here and TypeScript flags the
 * others until they're translated.
 *
 * Interpolation is expressed as functions (e.g. `itemsCount`). These are only
 * ever called on the client via `useI18n()`, never serialized across the
 * server→client boundary, so functions are safe to keep here.
 */
export const en = {
  meta: {
    title: "Stop Doing List",
    titleTemplate: "%s · Stop Doing List",
    description:
      "Write down what you've decided not to do, then turn it into a beautiful wallpaper or poster. Deliberate subtraction, in service of the long game.",
    keywords: [
      "stop doing list",
      "not-to-do list",
      "wallpaper generator",
      "poster generator",
      "minimalism",
      "long-termism",
    ],
  },

  content: {
    heading: "Stop Doing List",
    tagline: "Write down what you've decided not to do",
    share: "Share",
    reset: "Reset",
    titleLabel: "Title",
    titlePlaceholder: "Stop Doing List",
    listLabel: "Stop-Doing List",
    itemsCount: (n: number) => `${n} ${n === 1 ? "item" : "items"}`,
    tooManySuffix: " · keep it under 7",
    itemPlaceholder: (i: number) => `Thing #${i} to stop doing`,
    reorder: "Drag to reorder",
    remove: "Remove",
    addItem: "Add an item",
    signatureLabel: "Signature",
    signaturePlaceholder: "Optional",
    dateLabel: "Date",
    shareSuccess: "Share link copied",
    shareSuccessDesc: "Send it to anyone — it opens to this exact card",
    shareError: "Copy failed — copy the address bar manually",
  },

  rail: {
    template: "Template",
    ratio: "Ratio",
    frame: "Frame",
    theme: "Theme",
    light: "Light",
    dark: "Dark",
    align: "Align",
    alignAuto: "Auto",
    alignLeft: "Left",
    alignCenter: "Center",
    alignRight: "Right",
    size: "Size",
    sizeCompact: "Compact",
    sizeNormal: "Normal",
    sizeRelaxed: "Relaxed",
  },

  canvas: {
    export: "Export",
    exporting: "Exporting…",
    exportSuccess: "Exported in high resolution",
    exportError: "Export failed, please try again",
    includeFrame: "Frame",
  },

  studio: {
    collapsePanel: "Collapse editor",
    expandPanel: "Expand editor",
    editContent: "Edit content",
  },

  /**
   * The cinnabar seal (印章) stamped above the title — a compact brand chop, not
   * a sentence, so it reads as a stamp rather than echoing the headline. Keep it
   * short (a 2–4 char mark); it's rendered inside a fixed square. Localized, but
   * a Chinese chop ("不做") on Latin cards is a valid editorial choice too.
   */
  seal: "STOP",

  /**
   * Ambient quotes shown in the canvas negative space (desktop only). On the
   * philosophy of subtraction — saying no, avoiding the wrong things. Rotated at
   * random and localized so they follow the language switch.
   */
  quotes: [
    {
      text: "The difference between successful people and really successful people is that really successful people say no to almost everything.",
      author: "Warren Buffett",
    },
    {
      text: "It is remarkable how much long-term advantage people like us have gotten by trying to be consistently not stupid, instead of trying to be very intelligent.",
      author: "Charlie Munger",
    },
    {
      text: "All I want to know is where I'm going to die, so I'll never go there.",
      author: "Charlie Munger",
    },
    {
      text: "A stop-doing list is sometimes more important than a to-do list.",
      author: "Duan Yongping",
    },
    {
      text: "Doing the right thing means stopping the wrong things.",
      author: "Duan Yongping",
    },
    {
      text: "An even keel is simply not doing the things you shouldn't.",
      author: "Duan Yongping",
    },
  ],
};

/** The shape every locale must satisfy. */
export type Dictionary = typeof en;
