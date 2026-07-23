import type { UserProfile } from '#shared/types/user'
import { dummyJsonUserProfileSchema } from '#shared/utils/user-schema'

export const AUTH_COOKIE_NAME = import.meta.dev ? 'auth_token' : '__Host-auth_token'

export const DUMMY_JSON_BASE = 'https://dummyjson.com'

/* Two session lengths. Without "remember me" the cookie is a session
   cookie (dies with the browser) and the token is short-lived. With it,
   both the cookie and the DummyJSON token live for REMEMBER_TTL so they
   expire together — DummyJSON honours expiresInMins up to at least this. */
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
    // Persistent cookie when remembered; otherwise a session cookie (no maxAge).
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

/* Validate the untrusted upstream payload before returning its whitelisted,
   flattened profile fields to the client. */
export function pickUserProfile(source: unknown): UserProfile {
  return dummyJsonUserProfileSchema.parse(source)
}
