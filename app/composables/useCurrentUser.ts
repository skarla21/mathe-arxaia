export function useCurrentUser() {
  const session = useState<{
    user: { id: string; role: 'admin' | 'student'; email?: string | null } | null
  }>('current-user-session', () => ({ user: null }))

  const fetchSession = async () => {
    const result = await $fetch('/api/auth/session', {
      method: 'GET',
      credentials: 'include',
    }).catch(() => ({ user: null, session: null }))

    session.value.user = (result as any)?.user ?? null
  }

  if (process.client && session.value.user === null) {
    fetchSession()
  }

  const isAdmin = computed(() => session.value.user?.role === 'admin')
  const isStudent = computed(() => session.value.user?.role === 'student')

  return {
    session,
    fetchSession,
    isAdmin,
    isStudent,
  }
}

