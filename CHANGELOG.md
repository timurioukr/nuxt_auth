## [1.0.0] - 2026-07-23

### Added

- Auth-gated Nuxt 4 app with Nuxt UI: login, BFF httpOnly session (DummyJSON), route guards, `/dashboard` and `/profile`
- Authenticated shell: sidebar nav, collapse state in cookie (SSR-safe), mobile drawer, logout
- Profile details card (avatar, email, phone, birth date, location, gender)
- i18n (English), Zod + vee-validate login schema shared client/server
- Custom `error.vue` (404 + generic), app theme (Montserrat, green/slate palette)
- Vitest coverage for auth BFF helpers and API handlers

### Changed

- Refactor profile details into a declarative `v-for` list
- Deduplicate authenticated layout icon-button UI config
- Drop redundant component imports (Nuxt auto-import)

## [0.4.0] - 2026-07-23

### Added

- Profile details card on `/profile` (avatar, contact, birth date, location)
- App theme: Montserrat + custom green/slate palette

## [0.3.0] - 2026-07-23

### Added

- Authenticated shell: `/dashboard`, `/profile`, sidebar nav with logout, and custom 404/`error.vue`

### Fixed

- Map DummyJSON invalid-credentials `400` to app `401`
- Show login API errors as field validation under password (no alert banner)
- Center icons in the collapsed sidebar

## [0.2.0] - 2026-07-23

### Added

- Login with BFF httpOnly session, route guards, i18n, and Vitest coverage

## [0.1.0] - 2026-07-23

### Added

- Initial project scaffold and foundation
