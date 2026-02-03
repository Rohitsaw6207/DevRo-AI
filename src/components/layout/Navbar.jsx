import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { LogOut } from 'lucide-react'

import { useAuth } from '../../context/AuthContext'
import logo from '../../assets/devro-logo.svg'

const Navbar = () => {
  const navigate = useNavigate()
  const { isAuthenticated, profile, logout } = useAuth()

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
      initial={{ y: -90 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className="
        fixed top-0 left-0 right-0 z-50
        bg-neutral-950/85 backdrop-blur-xl
        border-b border-neutral-900
        py-3 sm:py-4
      "
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between">

          {/* LEFT — LOGO */}
          <motion.div
            onClick={handleLogoClick}
            initial="rest"
            whileHover="hover"
            animate="rest"
            className="relative cursor-pointer"
          >
            {/* 🔽 SOFT GREY GLOW (NOT WHITE) */}
            <motion.div
              variants={{
                rest: { opacity: 0.08, scale: 0.98 },
                hover: { opacity: 0.16, scale: 1.06 }
              }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="
                absolute inset-0 -z-10
                rounded-full
                bg-neutral-300
                blur-lg
              "
            />

            {/* Logo */}
            <motion.img
              src={logo}
              alt="DevRo AI"
              variants={{
                rest: { scale: 1 },
                hover: { scale: 1.03 }
              }}
              transition={{ type: 'spring', stiffness: 260, damping: 24 }}
              className="
                h-11 sm:h-12 md:h-14
                relative z-10
                select-none
              "
            />
          </motion.div>

          {/* RIGHT — AUTH */}
          {!isAuthenticated ? (
            <div className="flex items-center gap-2 sm:gap-4">
              <button
                onClick={() => navigate('/login')}
                className="px-3 sm:px-4 py-2 text-sm text-neutral-300 hover:text-neutral-100 transition"
              >
                Login
              </button>

              <motion.button
                onClick={() => navigate('/signup')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.96 }}
                className="px-4 py-2 rounded-md bg-neutral-100 text-neutral-900 text-sm font-medium"
              >
                Sign up
              </motion.button>
            </div>
          ) : (
            <div className="flex items-center gap-2 sm:gap-4">

              <button
                onClick={() => navigate('/pricing')}
                className="
                  hidden sm:inline-flex
                  px-3 py-1.5
                  rounded-md
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

              <button
                onClick={handleLogout}
                className="
                  px-3 py-1.5
                  rounded-md
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
                <span className="hidden sm:inline">Logout</span>
              </button>

              <button onClick={() => navigate('/profile')}>
                <motion.img
                  src={getAvatar()}
                  alt="Profile"
                  whileHover={{ scale: 1.05 }}
                  className="
                    w-10 h-10 sm:w-11 sm:h-11
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
