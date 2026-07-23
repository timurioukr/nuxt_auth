import { FetchError } from 'ofetch'
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'

type MeHandler = typeof import('./me.get').default
type MeEvent = Parameters<MeHandler>[0]

const deleteCookie = vi.fn()
const clearAuthCookie = vi.fn()
const setAuthResponseNoStore = vi.fn()
let upstreamError: unknown
let handler: MeHandler

beforeAll(async () => {
  vi.stubGlobal('defineEventHandler', (eventHandler: MeHandler) => eventHandler)
  vi.stubGlobal('AUTH_COOKIE_NAME', 'auth_token')
  vi.stubGlobal('DUMMY_JSON_BASE', 'https://dummyjson.com')
  vi.stubGlobal('getCookie', () => 'token')
  vi.stubGlobal('$fetch', () => Promise.reject(upstreamError))
  vi.stubGlobal('pickUserProfile', (profile: unknown) => profile)
  vi.stubGlobal('deleteCookie', deleteCookie)
  vi.stubGlobal('clearAuthCookie', clearAuthCookie)
  vi.stubGlobal('setAuthResponseNoStore', setAuthResponseNoStore)
  vi.stubGlobal('createError', ({ statusCode, message }: {
    statusCode: number
    message: string
  }) => Object.assign(new Error(message), { statusCode }))

  handler = (await import('./me.get')).default
})

beforeEach(() => {
  deleteCookie.mockClear()
  clearAuthCookie.mockClear()
  setAuthResponseNoStore.mockClear()
})

describe('GET /api/auth/me', () => {
  it('does not trust status-like properties on arbitrary errors', async () => {
    upstreamError = { statusCode: 401 }

    await expect(handler({} as MeEvent)).rejects.toMatchObject({ statusCode: 502 })
    expect(deleteCookie).not.toHaveBeenCalled()
  })

  it('clears the session for a genuine upstream 401', async () => {
    const error = new FetchError('Unauthorized')
    Object.defineProperties(error, {
      status: { value: 401 },
      statusCode: { value: 401 }
    })
    upstreamError = error

    await expect(handler({} as MeEvent)).rejects.toMatchObject({ statusCode: 401 })
    expect(clearAuthCookie).toHaveBeenCalledWith({})
    expect(deleteCookie).not.toHaveBeenCalled()
    expect(setAuthResponseNoStore).toHaveBeenCalledWith({})
  })
})
