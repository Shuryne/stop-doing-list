import type { Dictionary } from "./en";

/**
 * Chinese message catalog. Typed as `Dictionary` so it's structurally checked
 * against the English source-of-truth shape in `en.ts`.
 */
export const zh: Dictionary = {
  meta: {
    title: "Stop Doing List · 不做清单",
    titleTemplate: "%s · Stop Doing List",
    description:
      "写下你决定不做的事，一键生成精美的壁纸与海报。用主动的减法，为长期主义铺路。",
    keywords: [
      "stop doing list",
      "不做清单",
      "壁纸生成",
      "海报生成",
      "段永平",
      "长期主义",
    ],
  },

  content: {
    heading: "Stop Doing List",
    tagline: "写下你决定不做的事",
    share: "分享",
    reset: "重置",
    titleLabel: "标题",
    titlePlaceholder: "Stop Doing List",
    listLabel: "不做清单",
    itemsCount: (n: number) => `${n} 条`,
    tooManySuffix: " · 建议精简到 7 条内",
    itemPlaceholder: (i: number) => `第 ${i} 件不做的事`,
    reorder: "拖动排序",
    remove: "删除",
    addItem: "添加一条",
    signatureLabel: "署名",
    signaturePlaceholder: "可选",
    dateLabel: "日期",
    shareSuccess: "已复制分享链接",
    shareSuccessDesc: "把它发给别人，打开即是这一份",
    shareError: "复制失败，请手动复制地址栏",
  },

  rail: {
    template: "模板",
    ratio: "比例",
    frame: "外框",
    theme: "明暗",
    light: "浅色",
    dark: "深色",
    align: "对齐",
    alignAuto: "默认",
    alignLeft: "左",
    alignCenter: "居中",
    alignRight: "右",
    size: "字号",
    sizeCompact: "紧凑",
    sizeNormal: "标准",
    sizeRelaxed: "宽松",
  },

  canvas: {
    export: "导出图片",
    exporting: "导出中…",
    exportSuccess: "已导出高清图片",
    exportError: "导出失败，请重试",
    includeFrame: "含边框",
  },

  studio: {
    collapsePanel: "收起编辑面板",
    expandPanel: "展开编辑面板",
    editContent: "编辑内容",
  },

  seal: "不做",

  quotes: [
    {
      text: "成功者与真正的成功者之间的区别，在于后者几乎对一切都说「不」。",
      author: "沃伦·巴菲特",
    },
    {
      text: "持续地不犯蠢，比一味追求聪明，更能带来惊人的长期优势。",
      author: "查理·芒格",
    },
    {
      text: "我只想知道我将来会死在哪里，这样我就永远不去那里。",
      author: "查理·芒格",
    },
    {
      text: "Stop doing list 有时候比 to do list 更重要。",
      author: "段永平",
    },
    {
      text: "做对的事情，就是把不对的事情停下来。",
      author: "段永平",
    },
    {
      text: "平常心，就是不做那些不该做的事。",
      author: "段永平",
    },
  ],
};
