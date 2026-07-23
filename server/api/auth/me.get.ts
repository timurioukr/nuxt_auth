import type { UserProfile } from '#shared/types/user'
import { FetchError } from 'ofetch'

export default defineEventHandler(async (event): Promise<UserProfile> => {
  setAuthResponseNoStore(event)

  const token = getCookie(event, AUTH_COOKIE_NAME)

  if (!token) {
    throw createError({ statusCode: 401, message: 'Not authenticated' })
  }

  try {
    const profile = await $fetch<unknown>(`${DUMMY_JSON_BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return pickUserProfile(profile)
  } catch (error: unknown) {
    if (error instanceof FetchError && error.status === 401) {
      clearAuthCookie(event)
      throw createError({ statusCode: 401, message: 'Your session has expired. Please sign in again.' })
    }
    throw createError({ statusCode: 502, message: 'Profile service is temporarily unavailable.' })
  }
})
