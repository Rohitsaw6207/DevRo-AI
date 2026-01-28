import { createContext, useContext, useEffect, useState } from 'react'
import { listenToAuthChanges } from '../firebase/auth'
import { getUserProfile } from '../firebase/firestore'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = listenToAuthChanges(async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser)

        const data = await getUserProfile(firebaseUser.uid)
        setProfile(data)
      } else {
        setUser(null)
        setProfile(null)
      }

      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isAuthenticated: !!user,
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  return useContext(AuthContext)
}
