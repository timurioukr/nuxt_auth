import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'

type LogoutHandler = typeof import('./logout.post').default
type LogoutEvent = Parameters<LogoutHandler>[0]

const deleteCookie = vi.fn()
const clearAuthCookie = vi.fn()
const setAuthResponseNoStore = vi.fn()
let handler: LogoutHandler

beforeAll(async () => {
  vi.stubGlobal('defineEventHandler', (eventHandler: LogoutHandler) => eventHandler)
  vi.stubGlobal('AUTH_COOKIE_NAME', 'auth_token')
  vi.stubGlobal('deleteCookie', deleteCookie)
  vi.stubGlobal('clearAuthCookie', clearAuthCookie)
  vi.stubGlobal('setAuthResponseNoStore', setAuthResponseNoStore)

  handler = (await import('./logout.post')).default
})

beforeEach(() => {
  deleteCookie.mockClear()
  clearAuthCookie.mockClear()
  setAuthResponseNoStore.mockClear()
})

describe('POST /api/auth/logout', () => {
  it('clears the hardened auth cookie and disables caching', () => {
    const event = {} as LogoutEvent

    expect(handler(event)).toEqual({ loggedOut: true })
    expect(clearAuthCookie).toHaveBeenCalledWith(event)
    expect(deleteCookie).not.toHaveBeenCalled()
    expect(setAuthResponseNoStore).toHaveBeenCalledWith(event)
  })
})
