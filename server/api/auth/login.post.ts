import { FetchError } from 'ofetch'
import { dummyJsonLoginResponseSchema } from '#shared/utils/user-schema'

export default defineEventHandler(async (event) => {
  setAuthResponseNoStore(event)

  const t = await useTranslation(event)
  const loginSchema = createLoginSchema(key => t(key))
  const { rememberMe = false, ...credentials } = await readValidatedBody(event, body => loginSchema.parse(body))

  let response
  try {
    const payload = await $fetch<unknown>(`${DUMMY_JSON_BASE}/auth/login`, {
      method: 'POST',
      body: { ...credentials, expiresInMins: tokenTtlMinutes(rememberMe) }
    })
    response = dummyJsonLoginResponseSchema.parse(payload)
  } catch (error: unknown) {
    /* DummyJSON returns 400 for bad credentials (not 401). */
    if (error instanceof FetchError && (error.status === 400 || error.status === 401)) {
      throw createError({ statusCode: 401, message: 'Invalid username or password' })
    }
    throw createError({ statusCode: 502, message: 'Sign-in is temporarily unavailable. Please try again later.' })
  }

  setAuthCookie(event, response.accessToken, rememberMe)

  // Login only authenticates; the profile is read from /api/auth/me when needed.
  return { ok: true }
})
