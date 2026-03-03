// Stub: replace with Auth.js when using a Nuxt 3–compatible auth module.
// Set event.context.auth in a middleware from your auth solution.
export default defineEventHandler((event) => {
  const auth = event.context.auth as { userId?: string; role?: string } | undefined
  if (!auth?.userId) return { user: null, session: null }
  return {
    user: { id: auth.userId, role: auth.role ?? 'student' },
    session: { user: { id: auth.userId, role: auth.role ?? 'student' } },
  }
})
