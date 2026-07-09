# Stop Doing List · 不做清单

**English** · [简体中文](README.zh-CN.md)

🔗 **[stop-doing-list.shuryne.com](https://stop-doing-list.shuryne.com)**

> A minimalist web tool that turns your **stop-doing list** into beautiful wallpapers and posters. No login — nothing ever leaves your browser.

Inspired by Duan Yongping's idea of a corporate **stop doing list**: people tend to notice what you *did*, and overlook that it was often the things you **chose not to do** — the deliberate subtractions — that cleared the path to what came later.

## ✨ Features

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

## 🧱 Tech stack

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

## 🚀 Getting started

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

## 🎨 Add a template

Templates are pluggable components:

1. Create `your-template.tsx` under [`templates/`](templates/) exporting a `ComponentType<TemplateProps>` (see [`silence.tsx`](templates/silence.tsx)). Read only the `--sdl-*` design variables (see [`app/globals.css`](app/globals.css)) so light/dark adapt automatically.
2. Add its id to `TEMPLATE_IDS` in [`lib/types.ts`](lib/types.ts) — this is what the `TemplateId` union is derived from.
3. Register it in [`templates/registry.ts`](templates/registry.ts).

PRs welcome.

## 📄 License

[MIT](LICENSE)
