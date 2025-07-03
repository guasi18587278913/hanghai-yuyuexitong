'use client'

import { SessionProvider, useSession } from 'next-auth/react'
import { useEffect } from 'react'
import { useUserStore } from '@/lib/store/user-store'

function SessionSync() {
  const { data: session, status } = useSession()
  const { setUserSession } = useUserStore()

  useEffect(() => {
    if (status === 'authenticated') {
      setUserSession(session)
    } else if (status === 'unauthenticated') {
      setUserSession(null)
    }
  }, [status, session, setUserSession])

  return null // This component does not render anything
}

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SessionProvider>
      <SessionSync />
      {children}
    </SessionProvider>
  )
} 