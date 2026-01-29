import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { LogOut } from 'lucide-react'

import { useAuth } from '../../context/AuthContext'
import logo from '../../assets/devro-logo.svg'

const Navbar = () => {
  const navigate = useNavigate()
  const { isAuthenticated, profile, logout } = useAuth()

  // ✅ FIXED LOGO LOGIC
  const handleLogoClick = () => {
    if (isAuthenticated) {
      navigate('/home')
    } else {
      navigate('/')
    }
  }

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

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
      className="
        fixed top-0 left-0 right-0 z-50
        bg-neutral-950/80 backdrop-blur
        border-b border-neutral-900
        py-3
      "
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between">

          {/* LEFT — LOGO */}
          <motion.div
            onClick={handleLogoClick}
            initial="rest"
            whileHover="hover"
            animate="rest"
            className="relative cursor-pointer"
          >
            {/* Glow */}
            <motion.div
              variants={{
                rest: { opacity: 0, scale: 0.9 },
                hover: { opacity: 0.25, scale: 1.2 }
              }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="
                absolute inset-0 -z-10
                rounded-full
                bg-neutral-500
                blur-xl
              "
            />

            {/* Logo */}
            <motion.img
              src={logo}
              alt="DevRo AI"
              variants={{
                rest: { scale: 1 },
                hover: { scale: 1.06 }
              }}
              transition={{ type: 'spring', stiffness: 260 }}
              className="h-10 relative z-10"
            />
          </motion.div>

          {/* RIGHT — AUTH */}
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
            <div className="flex items-center gap-4">

              {/* UPGRADE PLAN */}
              <button
                onClick={() => navigate('/pricing')}
                className="
                  px-3 py-1 rounded-md
                  border border-neutral-800
                  text-neutral-400
                  hover:text-neutral-100
                  hover:border-neutral-600
                  hover:bg-neutral-900
                  transition
                "
              >
                Upgrade Plan
              </button>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="
                  px-3 py-1 rounded-md
                  border border-neutral-800
                  text-neutral-400
                  hover:text-neutral-100
                  hover:border-neutral-600
                  hover:bg-neutral-900
                  transition
                  flex items-center gap-1.5
                "
              >
                <LogOut size={14} />
                Logout
              </button>

              {/* Avatar */}
              <button onClick={() => navigate('/profile')}>
                <motion.img
                  src={getAvatar()}
                  alt="Profile"
                  whileHover={{ scale: 1.08 }}
                  className="
                    w-11 h-11
                    rounded-full
                    border border-neutral-700
                    hover:border-neutral-500
                    transition
                    object-cover
                  "
                />
              </button>
            </div>
          )}

        </div>
      </div>
    </motion.nav>
  )
}

export default Navbar
