import { motion } from 'framer-motion'
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
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
  const [agree, setAgree] = useState(false)
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
    if (!agree) {
      setError('You must agree to the privacy policy')
      return
    }

    try {
      setLoading(true)
      setError('')
      const res = await createUserWithEmailAndPassword(auth, email, password)
      await createUserDoc(res.user)
      navigate('/home')
    } catch {
      setError('Failed to create account')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogle = async () => {
    if (!agree) {
      setError('You must agree to the privacy policy')
      return
    }

    try {
      const provider = new GoogleAuthProvider()
      const res = await signInWithPopup(auth, provider)

      await createUserDoc(res.user, {
        name: res.user.displayName || 'User',
        gender: 'unspecified'
      })

      navigate('/home')
    } catch {
      setError('Google sign up failed')
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
              Create your account
            </h1>
            <p className="text-sm text-neutral-400 mb-6">
              Join DevRo AI and start building faster and more efficiently.
            </p>

            {/* Full Name */}
            <label className="text-sm text-neutral-400 mb-1 block">
              Full name
            </label>
            <input
              placeholder="Rohit Kumar"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full mb-4 px-4 py-3 rounded-md bg-neutral-800 border border-neutral-700"
            />

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
              className="w-full mb-4 px-4 py-3 rounded-md bg-neutral-800 border border-neutral-700"
            />

            {/* Gender */}
            <div className="mb-6 text-center">
              <p className="text-sm text-neutral-400 mb-3">
                Select your gender
              </p>
              <div className="flex justify-center gap-6">
                {['male', 'female'].map(g => (
                  <button
                    key={g}
                    type="button"
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

            {/* Privacy Policy */}
            <label className="flex items-start gap-3 mb-5 text-sm text-neutral-400 cursor-pointer">
              <input
                type="checkbox"
                checked={agree}
                onChange={e => setAgree(e.target.checked)}
                className="mt-1"
              />
              <span>
                I agree to the{' '}
                <Link
                  to="/privacy-policy"
                  className="font-medium text-neutral-200 hover:underline"
                >
                  privacy policy
                </Link>
              </span>
            </label>

            {error && (
              <p className="text-red-400 text-sm mb-4">
                {error}
              </p>
            )}

            <button
              onClick={handleSignup}
              disabled={loading}
              className="w-full py-3 rounded-md bg-neutral-100 text-neutral-900 font-medium mb-4 disabled:opacity-60"
            >
              {loading ? 'Creating account…' : 'Create account'}
            </button>

            <button
              onClick={handleGoogle}
              className="w-full py-3 rounded-md border border-neutral-700 hover:bg-neutral-800 transition mb-6"
            >
              Continue with Google
            </button>

            {/* Switch to login */}
            <p className="text-sm text-neutral-400 text-center">
              Already have an account?{' '}
              <button
                onClick={() => navigate('/login')}
                className="font-medium text-neutral-200 hover:underline"
              >
                Sign in
              </button>
            </p>
          </div>

          {/* RIGHT — IMAGE */}
          <div className="hidden lg:flex flex-col justify-center items-center bg-neutral-950 p-10">
            <img
              src="/signup-page.png"
              alt="DevRo AI preview"
              className="max-w-sm mb-6"
            />
            <h2 className="text-lg font-semibold mb-2 text-center">
              Build real products faster
            </h2>
            <p className="text-sm text-neutral-400 text-center max-w-xs">
              Generate structured React projects with clean code,
              predictable files, and full ownership.
            </p>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  )
}
