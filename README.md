# Nuxt Auth App

Auth-gated **Nuxt 4** app with **Nuxt UI**: login form, Backend-for-Frontend (BFF) session (httpOnly cookie + DummyJSON), protected `/dashboard` and `/profile`, and route guards.

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

## Why pnpm

- The official Nuxt UI starter ships with `packageManager: pnpm@…`, so installs and tooling match upstream defaults.
- It is stricter about the dependency graph than npm/yarn classic: undeclared dependencies fail early instead of being "accidentally" resolved from a flat `node_modules`.
- Content-addressable storage makes installs faster and uses less disk when several projects share the same packages.
- Project settings such as `peerDependencyRules` live in `pnpm-workspace.yaml`, which we already use to allow Zod 4 alongside `@vee-validate/zod@4.15`.

## Setup

```bash
pnpm install
pnpm dev
```

Server: `http://localhost:3000`

Demo credentials ([DummyJSON users](https://dummyjson.com/users)): `emilys` / `emilyspass`

Quality gates (also run in CI): `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`.

## Scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Dev server |
| `pnpm build` | Production build |
| `pnpm preview` | Preview production build |
| `pnpm lint` | ESLint |
| `pnpm typecheck` | Type check |
| `pnpm test` | Vitest |

## Rendering mode: universal SSR (Nuxt default)

Not for SEO — the only public page is a login form. SSR is kept because it is the only mode where auth is correct end-to-end: global route middleware runs on the server for the initial request, so an unauthenticated hit on `/dashboard` is redirected before any protected markup renders, an authenticated user hitting `/` is bounced to `/dashboard` with zero flash, and a page reload delivers a fully rendered page instead of a "checking session" spinner. With `ssr: false`, middleware runs client-only, which means either a flash of the wrong page or a loading gate on every hard refresh.

## Auth & security

The DummyJSON access token never reaches browser JavaScript. Three small Nitro routes act as a **Backend for Frontend (BFF)** — a thin server layer between the browser and the upstream API (`server/api/auth/`):

- `login` validates both request and upstream response, then stores the token in an **httpOnly, Secure, SameSite=Lax** cookie (a session cookie for the 60-minute flow, or a persistent cookie matching the 7-day remembered-token TTL);
- `me` reads the cookie server-side, forwards the Bearer token, and returns a whitelisted subset of profile fields (DummyJSON returns bank/crypto/address data that must not leak past the BFF);
- `logout` clears the cookie.

Production uses the `__Host-` cookie prefix (Secure, host-only, `Path=/`) to prevent cookie tossing. Auth responses explicitly set `Cache-Control: no-store`; global response headers deny framing and MIME sniffing, restrict referrers and browser capabilities, and set a minimal CSP (`base-uri`, `frame-ancestors`, `object-src`). This closes the XSS-exfiltration path that `localStorage` or a JS-readable cookie would leave open. The CSRF surface of a Lax cookie is effectively nil here: the only mutating cookie-bearing endpoint is logout. This is Nuxt's documented [sessions-and-authentication](https://nuxt.com/docs/4.x/guide/recipes/sessions-and-authentication) pattern.

**Why not the cookies DummyJSON sets itself?** Its `Set-Cookie` headers carry no `SameSite` attribute, so browsers treat them as `Lax` and reject them in cross-site responses — they only work same-site (on dummyjson.com itself). For a third-party frontend, the JSON body is the only reliable token channel.

Trade-offs: a server runtime is required (no static hosting), and client auth state must be invalidated on 401 — handled centrally in `useAuth`. No refresh-token rotation, per the assignment brief.

## Structure

```
app/
  pages/           # /, /dashboard, /profile
  components/      # login form, brand, navigation, profile card
  composables/     # useAuth
  middleware/      # auth.global
  layouts/         # default, authenticated
  error.vue        # 404 / generic errors
  assets/css/      # theme (Montserrat, palette)
server/api/auth/   # login, logout, me (BFF)
shared/            # Zod schemas + types
i18n/              # locales
```

## Assumptions & trade-offs

- **Username, not email.** DummyJSON authenticates by `username` (e.g. `emilys`), so the first field is Username. An email field would break login for the provided test credentials.
- **i18n with one locale (English).** Wired via `@nuxtjs/i18n` (`no_prefix`) so a second language is just a new locale file. Login Zod messages come from `login.validation.*` via `createLoginSchema(t)` (client `useI18n`, server `useTranslation` + `localeDetector`).
- **Session lifecycle & "Remember me".** Without the checkbox, the auth cookie is a **session cookie** (cleared when the browser closes) and the DummyJSON token is requested for 60 min. With it, the cookie is **persistent (7 days)** and the token TTL is requested to match (`expiresInMins`) so they expire together. A 401 from the BFF clears client state and redirects to login. No refresh-token rotation (per the brief); seven days limits exposure while keeping the requested convenience.
- **Profile data is not kept in global auth state.** The middleware validates the cookie through `/api/auth/me`, while `/profile` fetches its own data. A direct profile load therefore makes two upstream checks, but avoids serializing email, phone, birth date and location into the global Nuxt payload on every authenticated page.
- **Sidebar state** is persisted in a (non-sensitive) cookie so SSR renders the correct width with no hydration jump.

## Note on Zod + VeeValidate

`@vee-validate/zod@4.15` declares a peer on Zod 3, while the project uses Zod 4 (latest stable). Basic schemas work; `peerDependencyRules` in `pnpm-workspace.yaml` allows Zod 4. Full native Zod 4 support lands in VeeValidate 5 (still beta).

## Changelog

See [CHANGELOG.md](./CHANGELOG.md).
