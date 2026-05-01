# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Quick Reference

| Task | Command |
|------|---------|
| Full dev (H5 + server) | `pnpm dev` |
| H5 only | `pnpm dev:web` |
| WeChat mini program (watch) | `pnpm dev:weapp` |
| Server only (watch) | `pnpm dev:server` |
| Full CI build | `pnpm build` |
| CI validation | `pnpm validate` |
| Lint auto-fix | `pnpm lint:fix` |
| Type check | `pnpm tsc` |
| Preview QR (WeChat) | `pnpm preview:weapp` |
| Add dependency | `pnpm add <pkg>` (NOT npm/yarn) |
| Scaffold new page | `pnpm new` |

## Architecture

**Monorepo: Taro 4 frontend + NestJS backend**, built for cross-platform delivery (H5, WeChat mini program, ByteDance mini program).

- **Frontend**: `src/` — Taro (React 18), compiled by Vite. Pages in `src/pages/`, registered in `src/app.config.ts`. App root in `src/app.tsx`.
- **Backend**: `server/` — NestJS on Express, prefix `api` (set in `main.ts`). Modules follow NestJS conventions (`*.module.ts`, `*.controller.ts`, `*.service.ts`, `*.dto.ts`).
- **Dev proxy**: Vite proxies `/api/*` → `localhost:3000`. In production, `Network` wrapper (`src/network.ts`) auto-prepends `PROJECT_DOMAIN`.
- **State**: Single Zustand store (`src/store/quiz-store.ts`) with hardcoded question bank. Quiz flows through a state machine: `scene → selecting → revealed → scene`.
- **Styling**: Tailwind CSS 4 + `weapp-tailwindcss` adapter for mini program WXSS. `cn()` (clsx + twMerge) for class merging. Custom CSS only allowed for animations, gradients, or complex selectors.

## Hard Constraints (ESLint-enforced)

- **Use `@/components/ui/*` for all generic UI**: Button, Input, Textarea, Label, Switch, Slider, Progress. Do NOT import these from `@tarojs/components` in pages. Missing components must be added to the UI library, not hand-rolled in pages.
- **Use `Network` for all API calls**: `import { Network } from '@/network'`. Never use `Taro.request/uploadFile/downloadFile` directly. Never hardcode `localhost` or domains in URLs; always use relative paths like `/api/...`.
- **Tailwind only — no px arbitrary values**: `w-[340px]`, `text-[14px]`, `p-[16px]` are banned. Use preset classes (`w-full`, `text-sm`, `p-4`). `style={{ }}` is only for cross-platform fixes (fixed+flex).
- **Mini program compatibility**: No `:has(...)`, `peer-*`, `group-*`, Tailwind color opacity shorthand (`bg-primary/10` → `bg-primary bg-opacity-10`), or fractional utility values.

## Cross-Platform Rules

- **Platform check**: `Taro.getEnv() === Taro.ENV_TYPE.WEAPP` directly, NOT via `useState` (causes H5 white screen).
- **Text**: All vertical `Text` elements must have `className="block"` (inline on H5 → white screen).
- **Input/Textarea**: Always wrap in `<View>` with styles on the View, not the Input (H5 inline element doesn't respect styles).
- **Input + Button Flex**: Use `<View style={{ display: 'flex' }}>` wrapping, NOT `className="flex"` on Taro primitives.
- **Fixed + Flex**: Must use inline `style` (Tailwind `fixed flex` fails on H5). Bottom fixed elements need `bottom: 50` to avoid TabBar overlap.
- **Icons**: Use `lucide-react-taro`, NOT `lucide-react`. Set color via `color` prop, NOT `className="text-*"` (icons render as `<Image>` in mini programs).
- **Router paths**: Always start with `./` for Taro router URLs, e.g., `Taro.navigateTo({ url: '/pages/detail/index' })`.

## Backend Patterns

- **Never add `api` in `@Controller()` decorators** — server already sets global prefix. `@Controller('users')` becomes `/api/users`.
- **Response format**: `{ code: 200, msg: 'success', data: ... }`. POST returns 200 (not 201), enforced by `HttpStatusInterceptor`.
- **Hardcoded data**: The quiz module (`server/src/quiz/`) has in-memory data. PostgreSQL + Drizzle ORM are installed but not wired up.

## Naming

- Files: `kebab-case` (`user-profile.tsx`)
- Components: `PascalCase` (`UserProfile`)
- Variables/functions: `camelCase` (`getUserInfo`)
- Constants: `UPPER_SNAKE_CASE` (`API_BASE_URL`)

## Git

Commit format: `type: description` (e.g., `feat:`, `fix:`, `style:`, `refactor:`). Enforced by Commitlint.
