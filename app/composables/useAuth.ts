import type { ComputedRef, Ref } from 'vue'
import type { LoginCredentials } from '#shared/utils/login-schema'

interface UseAuthReturn {
  isAuthenticated: ComputedRef<boolean>
  sessionChecked: Ref<boolean>
  refreshSession: () => Promise<void>
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => Promise<void>
  clearSession: () => void
}

/*
 * The session only tracks whether someone is authenticated — not who. User
 * data (name, avatar, …) is read from /api/auth/me where it is actually
 * rendered (the profile page), so there is no user object to keep in sync.
 */
export function useAuth(): UseAuthReturn {
  const authenticated = useState('auth:authenticated', () => false)
  const sessionChecked = useState('auth:session-checked', () => false)

  const isAuthenticated = computed(() => authenticated.value)

  /* Validates the httpOnly-cookie session against the API. useRequestFetch
     forwards the incoming request's cookies to /api routes during SSR — a
     plain $fetch would silently drop them (nuxt/nuxt#27996). Call only from a
     Nuxt context (route middleware, setup). */
  async function refreshSession(): Promise<void> {
    const requestFetch = useRequestFetch()
    try {
      await requestFetch('/api/auth/me')
      authenticated.value = true
    } catch {
      authenticated.value = false
    } finally {
      sessionChecked.value = true
    }
  }

  async function login(credentials: LoginCredentials): Promise<void> {
    await $fetch('/api/auth/login', { method: 'POST', body: credentials })
    authenticated.value = true
  }

  async function logout(): Promise<void> {
    await $fetch('/api/auth/logout', { method: 'POST' })
    authenticated.value = false
    await navigateTo('/')
  }

  function clearSession(): void {
    authenticated.value = false
  }

  return { isAuthenticated, sessionChecked, refreshSession, login, logout, clearSession }
}
