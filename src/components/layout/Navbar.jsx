import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { User } from 'lucide-react'

import logo from '../../assets/devro-logo.svg'

const Navbar = () => {
  // TEMP auth state (replace with Firebase later)
  const isAuthenticated = false

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
          <Link to="/" className="flex items-center">
            <motion.img
              src={logo}
              alt="DevRo AI"
              className="h-9"
              whileHover={{ scale: 1.04 }}
            />
          </Link>

          {/* RIGHT — AUTH ACTIONS */}
          <div className="flex items-center gap-3">
            {!isAuthenticated ? (
              <>
                <Link to="/login">
                  <button className="px-4 py-2 text-sm text-neutral-300 hover:text-neutral-100 transition">
                    Login
                  </button>
                </Link>

                <Link to="/signup">
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    className="px-4 py-2 rounded-md bg-neutral-100 text-neutral-900 text-sm font-medium"
                  >
                    Sign up
                  </motion.button>
                </Link>
              </>
            ) : (
              <Link to="/profile">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 px-4 py-2 rounded-md bg-neutral-100 text-neutral-900 text-sm font-medium"
                >
                  <User size={16} />
                  Profile
                </motion.button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  )
}

export default Navbar
