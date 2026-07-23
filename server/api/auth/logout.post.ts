export default defineEventHandler((event) => {
  setAuthResponseNoStore(event)
  clearAuthCookie(event)

  return { loggedOut: true }
})
