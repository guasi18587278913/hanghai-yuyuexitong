import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Session } from 'next-auth'

interface UserState {
  // Allow session to be null, and user within session to be optional
  userSession: (Omit<Session, 'user'> & { user?: Session['user'] }) | null
  setUserSession: (session: (Omit<Session, 'user'> & { user?: Session['user'] }) | null) => void
  clearUserSession: () => void
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      userSession: null,
      setUserSession: (session) => set({ userSession: session }),
      clearUserSession: () => set({ userSession: null }),
    }),
    {
      name: 'user-session-storage', // Name for localStorage key
    }
  )
) 