import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

import { useAuth } from '../../context/AuthContext'
import logo from '../../assets/devro-logo.svg'

const Navbar = () => {
  const navigate = useNavigate()
  const { isAuthenticated, profile } = useAuth()

  const getAvatar = () => {
    if (!profile || profile.gender === 'unspecified') {
      return '/avatars/default-avatar.png'
    }
    if (profile.gender === 'male') {
      return '/avatars/male-avatar.png'
    }
    if (profile.gender === 'female') {
      return '/avatars/female-avatar.png'
    }
    return '/avatars/default-avatar.png'
  }

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed top-0 left-0 right-0 z-50 bg-neutral-950/80 backdrop-blur border-b border-neutral-900"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="h-16 flex items-center justify-between">

          {/* LEFT — LOGO */}
          <button
            onClick={() => navigate(isAuthenticated ? '/coding' : '/')}
            className="flex items-center"
          >
            <motion.img
              src={logo}
              alt="DevRo AI"
              className="h-9"
              whileHover={{ scale: 1.04 }}
            />
          </button>

          {/* RIGHT — AUTH ACTIONS */}
          {!isAuthenticated ? (
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/login')}
                className="px-4 py-2 text-sm text-neutral-300 hover:text-neutral-100 transition"
              >
                Login
              </button>

              <motion.button
                onClick={() => navigate('/signup')}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="px-4 py-2 rounded-md bg-neutral-100 text-neutral-900 text-sm font-medium"
              >
                Sign up
              </motion.button>
            </div>
          ) : (
            <button
              onClick={() => navigate('/profile')}
              className="flex items-center"
            >
              <motion.img
                src={getAvatar()}
                alt="Profile"
                whileHover={{ scale: 1.05 }}
                className="w-9 h-9 rounded-full border border-neutral-700 hover:border-neutral-500 transition"
              />
            </button>
          )}

        </div>
      </div>
    </motion.nav>
  )
}

export default Navbar
