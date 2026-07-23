# Nuxt Auth App

Auth-gated application built with **Nuxt 4** and **Nuxt UI**. Current state: initial scaffold (v0.1.0) — project foundation without an auth flow yet.

## Stack

- [Nuxt 4](https://nuxt.com)
- [Nuxt UI 4](https://ui.nuxt.com) + Tailwind CSS 4
- TypeScript (strict)
- [vee-validate](https://vee-validate.logaretm.com/) + [Zod](https://zod.dev) — form validation
- ESLint (`@nuxt/eslint`)
- pnpm

## Requirements

- Node.js 20+
- pnpm 11+

## Setup

```bash
pnpm install
```

## Development

```bash
pnpm dev
```

Server: `http://localhost:3000`

## Scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Dev server |
| `pnpm build` | Production build |
| `pnpm preview` | Preview production build locally |
| `pnpm lint` | ESLint |
| `pnpm typecheck` | Type check |

## Structure

```
app/
  app.vue          # Root + SEO
  app.config.ts    # Nuxt UI theme
  assets/css/      # Global styles
  pages/           # Routes
public/            # Static assets
nuxt.config.ts
```

## Changelog

See [CHANGELOG.md](./CHANGELOG.md).
