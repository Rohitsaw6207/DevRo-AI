import { motion } from 'framer-motion'
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth'

import { auth } from '../firebase/firebase'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    try {
      setLoading(true)
      setError('')
      await signInWithEmailAndPassword(auth, email, password)
      navigate('/home')
    } catch {
      setError('Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider()
      await signInWithPopup(auth, provider)
      navigate('/home')
    } catch {
      setError('Google sign-in failed')
    }
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col">
      <Navbar />

      <section className="flex-grow px-6 pt-28 pb-20 flex justify-center items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="
            w-full
            max-w-5xl
            grid
            grid-cols-1
            lg:grid-cols-2
            bg-neutral-900
            border
            border-neutral-800
            rounded-2xl
            overflow-hidden
          "
        >
          {/* LEFT — FORM */}
          <div className="p-8">
            <h1 className="text-2xl font-semibold mb-1">
              Welcome back
            </h1>
            <p className="text-sm text-neutral-400 mb-6">
              Sign in to continue building with Hitro AI.
            </p>

            {/* Email */}
            <label className="text-sm text-neutral-400 mb-1 block">
              Email address
            </label>
            <input
              placeholder="your@gmail.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full mb-4 px-4 py-3 rounded-md bg-neutral-800 border border-neutral-700"
            />

            {/* Password */}
            <label className="text-sm text-neutral-400 mb-1 block">
              Password
            </label>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full mb-6 px-4 py-3 rounded-md bg-neutral-800 border border-neutral-700"
            />

            {error && (
              <p className="text-red-400 text-sm mb-4">
                {error}
              </p>
            )}

            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full py-3 rounded-md bg-neutral-100 text-neutral-900 font-medium mb-4 disabled:opacity-60"
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>

            <button
              onClick={handleGoogle}
              className="w-full py-3 rounded-md border border-neutral-700 hover:bg-neutral-800 transition mb-6"
            >
              Continue with Google
            </button>

            {/* Switch to signup */}
            <p className="text-sm text-neutral-400 text-center">
              New here?{' '}
              <button
                onClick={() => navigate('/signup')}
                className="font-medium text-neutral-200 hover:underline"
              >
                Create account
              </button>
            </p>
          </div>

          {/* RIGHT — IMAGE */}
          <div className="hidden lg:flex flex-col justify-center items-center bg-neutral-950 p-10">
            <img
              src="/login-page.png"
              alt="DevRo AI preview"
              className="max-w-sm mb-6"
            />
            <h2 className="text-lg font-semibold mb-2 text-center">
              Pick up where you left off
            </h2>
            <p className="text-sm text-neutral-400 text-center max-w-xs">
              Continue generating structured projects with full control
              and production-ready code.
            </p>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  )
}
