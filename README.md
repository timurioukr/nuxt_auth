# Nuxt Auth App

Auth-gated **Nuxt 4** app with **Nuxt UI**: login form, BFF session (httpOnly cookie + DummyJSON), and route guards.

## Stack

- [Nuxt 4](https://nuxt.com)
- [Nuxt UI 4](https://ui.nuxt.com) + Tailwind CSS 4
- TypeScript (strict)
- [vee-validate](https://vee-validate.logaretm.com/) + [Zod](https://zod.dev)
- [@nuxtjs/i18n](https://i18n.nuxtjs.org)
- Vitest
- ESLint (`@nuxt/eslint`)
- pnpm

## Requirements

- Node.js 20+
- pnpm 11+

## Setup

```bash
pnpm install
pnpm dev
```

Server: `http://localhost:3000`

Demo credentials ([DummyJSON users](https://dummyjson.com/users)): `emilys` / `emilyspass`

## Scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Dev server |
| `pnpm build` | Production build |
| `pnpm preview` | Preview production build |
| `pnpm lint` | ESLint |
| `pnpm typecheck` | Type check |
| `pnpm test` | Vitest |

## Structure

```
app/
  pages/           # / login, /dashboard stub
  composables/     # useAuth
  middleware/      # auth.global
  layouts/         # default
server/api/auth/   # login, logout, me (BFF)
shared/            # Zod schemas + types
i18n/              # locales
```

## Changelog

See [CHANGELOG.md](./CHANGELOG.md).
