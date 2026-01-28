import { motion } from 'framer-motion'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'

import { auth, db } from '../firebase/firebase'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'

export default function Signup() {
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [gender, setGender] = useState('male')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const createUserDoc = async (user, extra = {}) => {
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      name,
      email: user.email,
      gender,
      isPro: false,
      usageLimit: 3,
      createdAt: serverTimestamp(),
      ...extra
    })
  }

  const handleSignup = async () => {
    try {
      setLoading(true)
      setError('')
      const res = await createUserWithEmailAndPassword(auth, email, password)
      await createUserDoc(res.user)
      navigate('/coding')
    } catch {
      setError('Failed to create account')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider()
      const res = await signInWithPopup(auth, provider)
      await createUserDoc(res.user, {
        name: res.user.displayName || 'User',
        gender: 'unspecified'
      })
      navigate('/coding')
    } catch {
      setError('Google sign up failed')
    }
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
            Create your account
          </h1>
          <p className="text-sm text-neutral-400 text-center mb-6">
            Start building with DevRo AI
          </p>

          <input
            placeholder="Rohit Kumar"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full mb-3 px-4 py-3 rounded-md bg-neutral-800 border border-neutral-700"
          />

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
            className="w-full mb-5 px-4 py-3 rounded-md bg-neutral-800 border border-neutral-700"
          />

          {/* Gender */}
          <div className="mb-6">
            <p className="text-sm text-neutral-400 mb-3 text-center">
              Select your gender
            </p>
            <div className="flex gap-4 justify-center">
              {['male', 'female'].map(g => (
                <button
                  key={g}
                  onClick={() => setGender(g)}
                  className={`p-2 rounded-xl border transition ${
                    gender === g
                      ? 'border-neutral-100'
                      : 'border-neutral-700'
                  }`}
                >
                  <img
                    src={`/avatars/${g}-avatar.png`}
                    alt={g}
                    className="w-16 h-16"
                  />
                </button>
              ))}
            </div>
          </div>

          {error && (
            <p className="text-red-400 text-sm mb-4 text-center">
              {error}
            </p>
          )}

          <button
            onClick={handleSignup}
            disabled={loading}
            className="w-full py-3 rounded-md bg-neutral-100 text-neutral-900 font-medium mb-4"
          >
            {loading ? 'Creating account…' : 'Create account'}
          </button>

          <button
            onClick={handleGoogle}
            className="w-full py-3 rounded-md border border-neutral-700 hover:bg-neutral-800 transition mb-6"
          >
            Continue with Google
          </button>

          {/* Switch */}
          <button
            onClick={() => navigate('/login')}
            className="w-full py-2.5 rounded-md border border-neutral-800 text-neutral-300 hover:bg-neutral-800 transition text-sm"
          >
            Already have an account? Sign in
          </button>
        </motion.div>
      </section>

      <Footer />
    </div>
  )
}
