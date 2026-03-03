export default defineNuxtRouteMiddleware((to) => {
  // TODO: get session from Auth.js and check role === 'admin'
  // For now allow all; once auth is wired, reject non-admins
  const isAdmin = true // placeholder
  if (!isAdmin) {
    return navigateTo('/')
  }
})
