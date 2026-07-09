# Stop Doing List · 不做清单

**English** · [中文](#中文)

🔗 **[stop-doing-list.shuryne.com](https://stop-doing-list.shuryne.com)**

---

## English

> A minimalist web tool that turns your **stop-doing list** into beautiful wallpapers and posters. No login — nothing ever leaves your browser.

Inspired by Duan Yongping's idea of a corporate **stop doing list**: people tend to notice what you *did*, and overlook that it was often the things you **chose not to do** — the deliberate subtractions — that cleared the path to what came later.

### ✨ Features

- **Zero friction** — no login, open and go, live WYSIWYG preview as you type.
- **Privacy-first** — your content lives only in the browser; nothing is uploaded or stored.
- **Bilingual UI** — full English / 中文 interface with an in-app language switch.
- **Four templates**
  - **Silence** — minimalist black & white
  - **Ink** — Eastern ink wash
  - **Grid** — Swiss grid
  - **Dusk** — ambient glow
- **Five ratios** — Phone wallpaper (9:19.5), Story (9:16), Poster (3:4), Square (1:1), Desktop (16:9). Templates adapt to canvas size and item count so nothing overflows.
- **Light / Dark** themes.
- **Crisp export** — 2× supersampled PNG (phone wallpaper exports at ~2580×5592).
- **Shareable links** — your content is encoded into the URL, so anyone who opens it gets the same list; social shares get an auto-generated OG preview image (`next/og`).

### 🧱 Tech stack

| | |
|---|---|
| Framework | Next.js 16 (App Router) + React 19 (React Compiler) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 + CSS variables (design tokens) |
| Components | shadcn/ui (Radix) |
| State | Zustand |
| i18n | `[lang]` routes (`en` / `zh`) |
| Image export | [modern-screenshot](https://github.com/qq15725/modern-screenshot) (client-side only) |
| Package manager | pnpm |

The design language is *restraint · resolve · negative space* — neutral ink on warm paper white, with a single **cinnabar red** accent (`#c0392b`), the metaphor for "stop".

### 🚀 Getting started

Requires Node ≥ 20 and pnpm.

```bash
pnpm install
pnpm dev        # http://localhost:3000
```

Other commands:

```bash
pnpm build      # production build
pnpm lint       # ESLint
```

### 🎨 Add a template

Templates are pluggable components — a new template is one file plus one line of registration:

1. Create `your-template.tsx` under [`templates/`](templates/) exporting a `ComponentType<TemplateProps>` (see [`silence.tsx`](templates/silence.tsx)).
2. Read only the `--sdl-*` design variables (see [`app/globals.css`](app/globals.css)) so light/dark adapt automatically.
3. Register it in [`templates/registry.ts`](templates/registry.ts).

PRs welcome.

### 🖋 Credits

The logo is a cinnabar seal of the character 「止」 (*stop*). The glyph is drawn from the open-source font **Zhi Mang Xing / 志莽行书** (© 2018 The Zhi Mang Xing Project Authors, [SIL OFL 1.1](https://scripts.sil.org/OFL)) — only that single character is **traced into a static vector path** embedded in the icon; the font itself is not bundled. See [`NOTICE`](NOTICE).

### 📄 License

[MIT](LICENSE)

---

## 中文

[English](#stop-doing-list--不做清单) · **中文**

> 写下你决定**不做**的事，一键生成精美的壁纸与海报。无需登录，内容永不离开你的浏览器。

灵感来自段永平谈企业的 **stop doing list**：大家往往只看到你做了什么，却常常忽略——是那些你**没有做 / 放弃做**的事，从更高的层面为后来的成功铺平了道路。

### ✨ 特点

- **零门槛** — 无需登录，打开即用，边输入边预览（所见即所得）。
- **本地优先** — 内容只在浏览器里，不上传、不存储。
- **中英双语界面** — 完整的中 / EN 界面，应用内一键切换。
- **四套模板**
  - 「静默 Silence」极简黑白
  - 「墨 Ink」东方水墨
  - 「格 Grid」瑞士网格
  - 「暮 Dusk」氛围光晕
- **五种尺寸** — 手机壁纸（9:19.5）、社交竖版 Story（9:16）、海报（3:4）、方图（1:1）、桌面壁纸（16:9）；模板按画布尺寸与条目数自适应，不溢出。
- **明暗双主题**。
- **高清导出** — 2× 超采样 PNG（手机壁纸导出约 2580×5592）。
- **分享链接** — 内容编码进 URL，别人打开即是同款；转发到社交平台时自动生成精美的 OG 预览图（`next/og`）。

### 🧱 技术栈

| | |
|---|---|
| 框架 | Next.js 16 (App Router) + React 19（React Compiler） |
| 语言 | TypeScript (strict) |
| 样式 | Tailwind CSS v4 + CSS 变量（design tokens） |
| 组件 | shadcn/ui (Radix) |
| 状态 | Zustand |
| 国际化 | `[lang]` 路由（`en` / `zh`） |
| 图片导出 | [modern-screenshot](https://github.com/qq15725/modern-screenshot)（纯客户端） |
| 包管理 | pnpm |

设计语言走「克制 · 笃定 · 留白」，中性墨色 + 暖纸白，强调色用**朱砂红**（`#c0392b`）——「停」的隐喻。

### 🚀 本地开发

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

### 🎨 贡献一个模板

模板是可插拔组件，加一个模板 = 加一个文件 + 注册一行：

1. 在 [`templates/`](templates/) 下新建 `your-template.tsx`，导出一个 `ComponentType<TemplateProps>`（参考 [`silence.tsx`](templates/silence.tsx)）。
2. 只读 `--sdl-*` 设计变量（见 [`app/globals.css`](app/globals.css)），这样浅色/深色都能自动适配。
3. 在 [`templates/registry.ts`](templates/registry.ts) 里注册。

欢迎 PR。

### 🖋 致谢

Logo 是一枚朱砂印「止」。印中的「止」字取自开源字体 **志莽行书 / Zhi Mang Xing**（© 2018 The Zhi Mang Xing Project Authors，[SIL OFL 1.1](https://scripts.sil.org/OFL)），仅将该单字**描成静态矢量路径**嵌入图标，未打包字体本体。详见 [`NOTICE`](NOTICE)。

### 📄 License

[MIT](LICENSE)
