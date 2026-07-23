import type { UserProfile } from '#shared/types/user'
import { dummyJsonUserProfileSchema } from '#shared/utils/user-schema'

export const AUTH_COOKIE_NAME = import.meta.dev ? 'auth_token' : '__Host-auth_token'

export const DUMMY_JSON_BASE = 'https://dummyjson.com'

export const SESSION_TTL_MINUTES = 60
export const REMEMBER_TTL_MINUTES = 60 * 24 * 7 // 7 days

export function tokenTtlMinutes(rememberMe: boolean): number {
  return rememberMe ? REMEMBER_TTL_MINUTES : SESSION_TTL_MINUTES
}

function authCookieBaseOptions(isDevelopment = import.meta.dev) {
  return {
    httpOnly: true,
    secure: !isDevelopment,
    sameSite: 'lax' as const,
    path: '/'
  }
}

export function sessionCookieOptions(
  rememberMe: boolean,
  isDevelopment = import.meta.dev
) {
  return {
    ...authCookieBaseOptions(isDevelopment),
    ...(rememberMe ? { maxAge: REMEMBER_TTL_MINUTES * 60 } : {})
  }
}

type AuthEvent = Parameters<typeof setCookie>[0]

export function setAuthCookie(
  event: AuthEvent,
  token: string,
  rememberMe: boolean
): void {
  setCookie(event, AUTH_COOKIE_NAME, token, sessionCookieOptions(rememberMe))
}

export function clearAuthCookie(event: AuthEvent): void {
  deleteCookie(event, AUTH_COOKIE_NAME, authCookieBaseOptions())
}

export function setAuthResponseNoStore(event: AuthEvent): void {
  setResponseHeader(event, 'Cache-Control', 'no-store')
}

export function pickUserProfile(source: unknown): UserProfile {
  return dummyJsonUserProfileSchema.parse(source)
}
