import { Auth } from '@auth/core'
import type { Session } from '@auth/core/types'
import { getAuthOptions } from './[...]'

export default defineEventHandler(async (event) => {
  const authOptions = getAuthOptions()
  const request = event.node.req
  const url = new URL('/api/auth/session', `https://${request.headers.host}`)

  const authRequest = new Request(url.toString(), {
    method: 'GET',
    headers: request.headers as unknown as HeadersInit,
  })

  const response = await Auth(authRequest, authOptions)

  if (!response.ok) {
    return { user: null, session: null }
  }

  const session = (await response.json()) as Session | null

  if (!session?.user) {
    return { user: null, session: null }
  }

  const user = session.user as Session['user'] & { id?: string; isAdmin?: boolean }

  return {
    user: {
      id: user.id ?? '',
      isAdmin: user.isAdmin ?? false,
      email: user.email,
    },
    session,
  }
})
