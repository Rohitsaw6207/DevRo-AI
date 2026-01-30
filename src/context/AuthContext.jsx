import { createContext, useContext, useEffect, useState } from 'react'
import { listenToAuthChanges, logoutUser } from '../firebase/auth'
import { getUserProfile } from '../firebase/firestore'

export const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = listenToAuthChanges(async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser)

        const profileData = await getUserProfile(firebaseUser.uid)
        setProfile(profileData)
      } else {
        setUser(null)
        setProfile(null)
      }

      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  // ✅ FORCE PROFILE REFRESH (used after payment, future upgrades, etc.)
  const refreshProfile = async (uid) => {
    if (!uid) return
    const profileData = await getUserProfile(uid)
    setProfile(profileData)
  }

  const logout = async () => {
    await logoutUser()
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isAuthenticated: !!user,
        loading,
        logout,
        refreshProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
