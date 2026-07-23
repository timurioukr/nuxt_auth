export default defineNuxtRouteMiddleware(async (to) => {
  if (to.matched.length === 0) {
    return
  }

  const { isAuthenticated, sessionChecked, refreshSession } = useAuth()

  if (!sessionChecked.value) {
    await refreshSession()
  }

  const isLoginPage = to.path === '/'

  if (!isAuthenticated.value && !isLoginPage) {
    return navigateTo('/')
  }

  if (isAuthenticated.value && isLoginPage) {
    return navigateTo('/dashboard')
  }
})
