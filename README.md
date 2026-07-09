# Stop Doing List · 不做清单

> 写下你决定**不做**的事，一键生成精美的壁纸与海报。用主动的减法，为长期主义铺路。
>
> A minimalist web tool that turns your *stop-doing list* into beautiful wallpapers and posters. No login, nothing leaves your browser.

灵感来自段永平谈企业的 **stop doing list**：大家往往只看到你做了什么，却常常忽略——是那些你**没有做 / 放弃做**的事，从更高的层面为后来的成功铺平了道路。

🔗 **[stop-doing-list.shuryne.com](https://stop-doing-list.shuryne.com)**

---

## ✨ 特点 · Features

- **零门槛** — 无需登录，打开即用，边输入边预览（所见即所得）。
- **本地优先 · Privacy-first** — 内容只在浏览器里，不上传、不存储。
- **多模板 · Multiple templates** — 目前内置 5 套：
  - 「静默 Silence」极简黑白
  - 「墨 Ink」东方水墨
  - 「格 Grid」瑞士网格
  - 「便签 Note」笔记本
  - 「暮 Dusk」氛围光晕
- **多尺寸 · Ratios** — 手机壁纸（9:19.5）、竖屏 Story（9:16）、海报（3:4）、方图（1:1）、桌面壁纸（16:9）；模板按画布尺寸与条目数自适应，不溢出。
- **明暗双主题 · Light / Dark**。
- **高清导出 · Crisp export** — 2× 超采样 PNG（手机壁纸导出约 2580×5592）。
- **分享链接 · Shareable links** — 内容编码进 URL，别人打开即是同款；转发到社交平台时自动生成精美的 OG 预览图（`next/og`，动态子集化中文字体）。

## 🖼 截图 · Screenshots

> _TODO: 补充演示 GIF 与模板预览图。_

## 🧱 技术栈 · Tech stack

| | |
|---|---|
| 框架 | Next.js 16 (App Router) + React 19 |
| 语言 | TypeScript (strict) |
| 样式 | Tailwind CSS v4 + CSS 变量（design tokens） |
| 组件 | shadcn/ui (Radix) |
| 状态 | Zustand |
| 图片导出 | [modern-screenshot](https://github.com/qq15725/modern-screenshot)（纯客户端） |
| 包管理 | pnpm |
| 部署 | Vercel |

设计语言走「克制 · 笃定 · 留白」，中性墨色 + 暖纸白，强调色用**朱砂红**（`#c0392b`）——「停」的隐喻。

## 🚀 本地开发 · Getting started

需要 Node ≥ 20 与 pnpm。

```bash
pnpm install
pnpm dev        # http://localhost:3000
```

其它命令：

```bash
pnpm build      # 生产构建
pnpm lint       # ESLint
```

## ☁️ 部署 · Deploy

一键部署到 Vercel（导入本仓库即可，无需任何环境变量）：

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

自定义域名：在 Vercel 项目的 **Settings → Domains** 添加 `stop-doing-list.shuryne.com`，并在你的 DNS 处按提示加一条 `CNAME` 指向 `cname.vercel-dns.com`。

## 🎨 贡献一个模板 · Add a template

模板是可插拔组件，加一个模板 = 加一个文件 + 注册一行：

1. 在 [`templates/`](templates/) 下新建 `your-template.tsx`，导出一个 `ComponentType<TemplateProps>`（参考 [`silence.tsx`](templates/silence.tsx)）。
2. 只读 `--sdl-*` 设计变量（见 [`app/globals.css`](app/globals.css)），这样浅色/深色都能自动适配。
3. 在 [`templates/registry.ts`](templates/registry.ts) 里注册。

欢迎 PR。

## 🗺 路线图 · Roadmap

- [x] 补齐 5 套模板（静默 / 墨 / 格 / 便签 / 暮）
- [x] 内容编码进 URL 的分享链接 + 动态 OG 预览图
- [x] 全部比例（手机壁纸 / Story / 海报 3:4 / 方图 / 桌面壁纸）+ 模板自适应
- [ ] 语录预设库（段永平 / 巴菲特 / 芒格的「不做」名言）
- [ ] 自托管**子集化 CJK 字体**，让导出在不同系统上视觉一致（当前中文回退到系统字体）
- [ ] 完整 i18n

## 🖋 致谢 · Credits

Logo 是一枚朱砂印「止」。印中的「止」字取自开源字体 **志莽行书 / Zhi Mang Xing**（© 2018 The Zhi Mang Xing Project Authors，[SIL OFL 1.1](https://scripts.sil.org/OFL)），仅将该单字**描成静态矢量路径**嵌入图标,未打包字体本体。详见 [`NOTICE`](NOTICE)。

## 📄 License

[MIT](LICENSE)
