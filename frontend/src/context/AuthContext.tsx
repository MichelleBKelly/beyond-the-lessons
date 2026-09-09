import { onAuthStateChanged, type User } from 'firebase/auth'
import { useEffect, useState, type ReactNode } from 'react'
import { auth } from '../lib/firebase'
import { getUserProfile } from '../services/firestore'
import type { UserProfile } from '../types/domain'
import { createContext, useContext } from 'react'

interface AuthContextValue {
  user: User | null
  profile: UserProfile | null
  loading: boolean
}

const AuthContext = createContext<AuthContextValue>({ user: null, profile: null, loading: true })

async function loadProfileWithRetry(user: User) {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const profile = await getUserProfile(user.uid)
    if (profile) return profile
    await new Promise((resolve) => setTimeout(resolve, 200))
  }
  return null
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => onAuthStateChanged(auth, (nextUser) => {
    setUser(nextUser)
    if (!nextUser) {
      setProfile(null)
      setLoading(false)
      return
    }
    setLoading(true)
    void loadProfileWithRetry(nextUser).then((nextProfile) => {
      setProfile(nextProfile)
      setLoading(false)
    })
  }), [])

  return <AuthContext.Provider value={{ user, profile, loading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
