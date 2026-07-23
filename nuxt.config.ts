// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@nuxtjs/i18n'
  ],

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  routeRules: {
    '/**': {
      headers: {
        'Content-Security-Policy': 'base-uri \'self\'; frame-ancestors \'none\'; object-src \'none\'',
        'Permissions-Policy': 'camera=(), geolocation=(), microphone=()',
        'Referrer-Policy': 'no-referrer',
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY'
      }
    },
    '/login': { redirect: '/' }
  },

  compatibilityDate: '2026-07-23',

  typescript: {
    strict: true
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  },

  i18n: {
    strategy: 'no_prefix',
    defaultLocale: 'en',
    locales: [
      { code: 'en', name: 'English', file: 'en.json' }
    ],
    experimental: {
      localeDetector: 'localeDetector.ts'
    }
  }
})
