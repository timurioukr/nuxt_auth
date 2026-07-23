export default defineNuxtRouteMiddleware(async (to) => {
  /* Unknown paths fall through to the 404 error page for everyone —
     without this, guests would be redirected to the login page instead
     of seeing the 404. */
  if (to.matched.length === 0) {
    return
  }

  const { isAuthenticated, sessionChecked, refreshSession } = useAuth()

  /* Runs once per app instance: on the server for the initial request
     (the flag then hydrates to the client), and again only after a full
     page reload. Login/logout update the state directly. */
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
