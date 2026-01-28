import { motion } from 'framer-motion'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
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

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password)
      navigate('/coding')
    } catch {
      setError('Invalid email or password')
    }
  }

  const handleGoogle = async () => {
    const provider = new GoogleAuthProvider()
    await signInWithPopup(auth, provider)
    navigate('/coding')
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col">
      <Navbar />

      <section className="px-6 pt-28 pb-20 flex justify-center flex-grow">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl p-8"
        >
          <h1 className="text-2xl font-semibold text-center mb-2">
            Welcome back
          </h1>
          <p className="text-sm text-neutral-400 text-center mb-6">
            Sign in to continue
          </p>

          <input
            placeholder="your@gmail.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full mb-3 px-4 py-3 rounded-md bg-neutral-800 border border-neutral-700"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full mb-4 px-4 py-3 rounded-md bg-neutral-800 border border-neutral-700"
          />

          {error && (
            <p className="text-red-400 text-sm mb-4 text-center">
              {error}
            </p>
          )}

          <button
            onClick={handleLogin}
            className="w-full py-3 rounded-md bg-neutral-100 text-neutral-900 font-medium mb-4"
          >
            Sign in
          </button>

          <button
            onClick={handleGoogle}
            className="w-full py-3 rounded-md border border-neutral-700 hover:bg-neutral-800 transition mb-6"
          >
            Continue with Google
          </button>

          <button
            onClick={() => navigate('/signup')}
            className="w-full py-2.5 rounded-md border border-neutral-800 text-neutral-300 hover:bg-neutral-800 transition text-sm"
          >
            New here? Create account
          </button>
        </motion.div>
      </section>

      <Footer />
    </div>
  )
}
