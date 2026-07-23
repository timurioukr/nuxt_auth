import { z } from 'zod'

/** Minimal translate fn shared by Vue i18n (client) and Nitro useTranslation (server). */
export type TranslateFn = (key: string) => string

export function createLoginSchema(t: TranslateFn) {
  return z.object({
    username: z
      .string(t('login.validation.usernameRequired'))
      .trim()
      .min(1, t('login.validation.usernameRequired'))
      .min(3, t('login.validation.usernameMin')),
    password: z
      .string(t('login.validation.passwordRequired'))
      .min(1, t('login.validation.passwordRequired'))
      .min(6, t('login.validation.passwordMin')),
    rememberMe: z.boolean().optional()
  })
}

export type LoginCredentials = z.infer<ReturnType<typeof createLoginSchema>>
