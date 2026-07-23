export default defineI18nLocaleDetector((_event, config) => {
  return config.defaultLocale || 'en'
})
