import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import { useAuth } from '../context/AuthContext'

export default function Profile() {
  const { user, profile } = useAuth()

  // -------- MEMBER SINCE --------
  const memberSince =
    profile?.createdAt && typeof profile.createdAt.toDate === 'function'
      ? profile.createdAt.toDate().toLocaleDateString('en-IN', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      : '—'

  // -------- AVATAR LOGIC --------
  const getAvatar = () => {
    if (profile?.avatar) return profile.avatar
    if (profile?.gender === 'male') return '/avatars/male-avatar.png'
    if (profile?.gender === 'female') return '/avatars/female-avatar.png'
    return '/avatars/default-avatar.png'
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <Navbar />

      <section className="px-6 pt-28 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="
            mx-auto
            w-full
            max-w-sm
            md:max-w-xl
            lg:max-w-2xl
            bg-neutral-900
            border border-neutral-800
            rounded-2xl
            p-8
          "
        >
          {/* HEADER */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-semibold">Profile</h1>
            <p className="text-sm text-neutral-400 mt-1">
              Your profile information
            </p>
          </div>

          {/* AVATAR */}
          <div className="flex justify-center mb-6">
            <img
              src={getAvatar()}
              alt="Profile"
              className="w-32 h-32 rounded-full border border-neutral-700 object-cover"
            />
          </div>

          {/* NAME */}
          <div className="mb-4">
            <label className="text-sm text-neutral-400">Full Name</label>
            <div className="mt-1 px-4 py-2.5 rounded-md border border-neutral-700 bg-neutral-900">
              {profile?.name || '—'}
            </div>
          </div>

          {/* EMAIL */}
          <div className="mb-8">
            <label className="text-sm text-neutral-400">Email Address</label>
            <div className="mt-1 px-4 py-2.5 rounded-md border border-neutral-700 bg-neutral-900">
              {user?.email || '—'}
            </div>
          </div>

          {/* ACCOUNT INFO */}
          <div className="mt-6">
            <h2 className="text-lg font-medium mb-4 text-neutral-200">
              Account Information
            </h2>

            <div className="space-y-4 text-sm">
              <div className="flex justify-between border-b border-neutral-800 pb-2">
                <span className="text-neutral-400">Member since</span>
                <span>{memberSince}</span>
              </div>

              <div className="flex justify-between border-b border-neutral-800 pb-2 items-center">
                <span className="text-neutral-400">Subscription</span>

                {profile?.isPro ? (
                  <span className="text-green-400 font-semibold">
                    Active
                  </span>
                ) : (
                  <Link
                    to="/pricing"
                    className="
                      font-semibold
                      text-neutral-100
                      hover:text-neutral-300
                      transition
                    "
                  >
                    Upgrade
                  </Link>
                )}
              </div>

              <div className="flex justify-between">
                <span className="text-neutral-400">Usage left</span>
                <span>{profile?.usageLimit ?? 0}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  )
}
