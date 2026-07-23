import { FetchError } from 'ofetch'
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'

type LoginHandler = typeof import('./login.post').default
type LoginEvent = Parameters<LoginHandler>[0]

const setCookie = vi.fn()
const setAuthCookie = vi.fn()
const setAuthResponseNoStore = vi.fn()
let upstreamResult: unknown
let upstreamError: unknown
let handler: LoginHandler

beforeAll(async () => {
  vi.stubGlobal('defineEventHandler', (eventHandler: LoginHandler) => eventHandler)
  vi.stubGlobal('useTranslation', async () => (key: string) => key)
  vi.stubGlobal('createLoginSchema', () => ({
    parse: (body: unknown) => body
  }))
  vi.stubGlobal('readValidatedBody', async (_event: unknown, validate: (body: unknown) => unknown) =>
    validate({ username: 'emilys', password: 'emilyspass', rememberMe: false })
  )
  vi.stubGlobal('DUMMY_JSON_BASE', 'https://dummyjson.com')
  vi.stubGlobal('tokenTtlMinutes', () => 60)
  vi.stubGlobal('AUTH_COOKIE_NAME', 'auth_token')
  vi.stubGlobal('sessionCookieOptions', () => ({ httpOnly: true }))
  vi.stubGlobal('$fetch', async () => {
    if (upstreamError) {
      throw upstreamError
    }
    return upstreamResult
  })
  vi.stubGlobal('setCookie', setCookie)
  vi.stubGlobal('setAuthCookie', setAuthCookie)
  vi.stubGlobal('setAuthResponseNoStore', setAuthResponseNoStore)
  vi.stubGlobal('createError', ({ statusCode, message }: {
    statusCode: number
    message: string
  }) => Object.assign(new Error(message), { statusCode }))

  handler = (await import('./login.post')).default
})

beforeEach(() => {
  upstreamResult = { accessToken: 'valid-token' }
  upstreamError = undefined
  setCookie.mockClear()
  setAuthCookie.mockClear()
  setAuthResponseNoStore.mockClear()
})

describe('POST /api/auth/login', () => {
  it('does not trust status-like properties on arbitrary errors', async () => {
    upstreamError = { statusCode: 401 }

    await expect(handler({} as LoginEvent)).rejects.toMatchObject({ statusCode: 502 })
    expect(setCookie).not.toHaveBeenCalled()
  })

  it('maps a genuine upstream 401 to invalid credentials', async () => {
    const error = new FetchError('Unauthorized')
    Object.defineProperties(error, {
      status: { value: 401 },
      statusCode: { value: 401 }
    })
    upstreamError = error

    await expect(handler({} as LoginEvent)).rejects.toMatchObject({ statusCode: 401 })
    expect(setCookie).not.toHaveBeenCalled()
  })

  it('maps DummyJSON invalid-credentials 400 to 401', async () => {
    const error = new FetchError('Bad Request')
    Object.defineProperties(error, {
      status: { value: 400 },
      statusCode: { value: 400 }
    })
    upstreamError = error

    await expect(handler({} as LoginEvent)).rejects.toMatchObject({ statusCode: 401 })
    expect(setAuthCookie).not.toHaveBeenCalled()
  })

  it('does not persist malformed upstream tokens', async () => {
    upstreamResult = { accessToken: '   ' }

    await expect(handler({} as LoginEvent)).rejects.toMatchObject({ statusCode: 502 })
    expect(setCookie).not.toHaveBeenCalled()
  })

  it('persists a validated upstream token', async () => {
    await expect(handler({} as LoginEvent)).resolves.toEqual({ ok: true })
    expect(setAuthCookie).toHaveBeenCalledWith(
      {},
      'valid-token',
      false
    )
    expect(setCookie).not.toHaveBeenCalled()
    expect(setAuthResponseNoStore).toHaveBeenCalledWith({})
  })
})
