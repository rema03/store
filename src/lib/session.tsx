'use client'

import { useState, useEffect, createContext, useContext } from 'react'

interface SessionUser {
  id: string
  email: string
  username: string | null
  name: string
  role: string
}

interface Session {
  user: SessionUser
}

interface SessionContextValue {
  session: Session | null
  status: 'loading' | 'authenticated' | 'unauthenticated'
  refresh: () => void
}

const SessionContext = createContext<SessionContextValue>({
  session: null,
  status: 'loading',
  refresh: () => {},
})

export function JiminSessionProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [status, setStatus] = useState<'loading' | 'authenticated' | 'unauthenticated'>('loading')

  const fetchSession = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_ACCOUNTS_URL || 'https://accounts.jimindev.com'}/api/auth/me`,
        { credentials: 'include' }
      )
      if (res.ok) {
        const data = await res.json()
        setSession({ user: data.user })
        setStatus('authenticated')
      } else {
        setSession(null)
        setStatus('unauthenticated')
      }
    } catch {
      setSession(null)
      setStatus('unauthenticated')
    }
  }

  useEffect(() => {
    fetchSession()
  }, [])

  return (
    <SessionContext.Provider value={{ session, status, refresh: fetchSession }}>
      {children}
    </SessionContext.Provider>
  )
}

export function useJiminSession() {
  return useContext(SessionContext)
}
