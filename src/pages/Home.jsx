import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Lock } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import { useAuth } from '../context/AuthContext'

export default function Home() {
  const { profile } = useAuth()
  const navigate = useNavigate()

  const isPro = profile?.isPro

  const [stack, setStack] = useState('html')
  const [prompt, setPrompt] = useState('')
  const [showModal, setShowModal] = useState(false)

  // ✅ Set default stack based on plan
  useEffect(() => {
    if (isPro) {
      setStack('react')
    } else {
      setStack('html')
    }
  }, [isPro])

  const handleStackChange = (value) => {
    if (value === 'react' && !isPro) {
      setShowModal(true)
      return
    }
    setStack(value)
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col">
      <Navbar />

      <section className="flex-grow pt-28 pb-24 flex flex-col items-center px-6">

        {/* PROJECT PILL */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="relative mb-6"
        >
          <div className="absolute inset-0 bg-cyan-400/30 blur-2xl rounded-full" />
          <div className="
            relative px-5 py-1.5 rounded-full
            bg-neutral-900 border border-cyan-400/20 text-sm
          ">
            {profile?.name || 'Your'}’s Project
          </div>
        </motion.div>

        {/* HEADING */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative text-4xl sm:text-5xl font-semibold text-center mb-6"
        >
          <span className="absolute inset-0 bg-white/30 blur-3xl" />
          <span className="
            relative bg-gradient-to-b from-white to-neutral-400
            bg-clip-text text-transparent
          ">
            Where ideas become reality
          </span>
        </motion.h1>

        {/* SUBHEADING */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="relative text-neutral-400 text-center max-w-2xl mb-14"
        >
          <span className="absolute inset-0 bg-white/10 blur-2xl" />
          <span className="relative">
            Build fully functional apps and websites through simple conversations
          </span>
        </motion.p>

        {/* PROMPT CONTAINER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-3xl"
        >
          <div className="
            rounded-2xl bg-neutral-900/90 backdrop-blur
            border border-neutral-800 p-5
          ">

            {/* STACK TOGGLE */}
            <div className="inline-flex mb-4 rounded-full border border-neutral-800 overflow-hidden">
              {['html', 'react'].map(item => (
                <motion.button
                  key={item}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleStackChange(item)}
                  className={`
                    px-5 py-1.5 text-sm flex items-center gap-2 transition
                    ${stack === item
                      ? 'bg-neutral-800 text-white font-medium'
                      : 'text-neutral-400 hover:text-neutral-200'
                    }
                  `}
                >
                  {item.toUpperCase()}
                  {item === 'react' && !isPro && (
                    <Lock size={14} className="text-neutral-400" />
                  )}
                </motion.button>
              ))}
            </div>

            {/* TEXTAREA */}
            <textarea
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              placeholder={
                stack === 'react'
                  ? 'Build me a React dashboard with authentication...'
                  : 'Build me a responsive HTML landing page...'
              }
              rows={5}
              className="
                w-full bg-transparent resize-none outline-none
                text-sm text-neutral-100 placeholder:text-neutral-500
                scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-transparent
              "
            />

            {/* BOTTOM BAR */}
            <div className="flex items-center justify-between mt-5">
              <span className="px-3 py-1 rounded-full bg-neutral-800 text-xs text-neutral-300">
                Gemini 2.5 Flash
              </span>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="
                  flex items-center gap-2 px-5 py-2
                  rounded-full bg-neutral-800 hover:bg-neutral-700 transition
                "
              >
                <Send size={14} />
                <span className="text-sm">Generate</span>
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* SUGGESTIONS */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="flex flex-wrap justify-center gap-3 mt-12"
        >
          {[
            'Create a personal portfolio website',
            'Build a calculator app',
            'Create a todo list app'
          ].map(text => (
            <motion.button
              key={text}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setPrompt(text)}
              className="
                px-4 py-2 rounded-full bg-neutral-900
                border border-neutral-800/50 text-sm text-neutral-300
                hover:bg-neutral-800 transition
              "
            >
              {text}
            </motion.button>
          ))}
        </motion.div>

      </section>

      <Footer />

      {/* UPGRADE MODAL */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center px-6"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 max-w-sm w-full text-center"
            >
              <h3 className="text-lg font-semibold mb-2">
                Upgrade required
              </h3>
              <p className="text-sm text-neutral-400 mb-6">
                To use React, you need to upgrade your plan to Pro.
              </p>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm text-neutral-400 hover:text-neutral-200 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={() => navigate('/pricing')}
                  className="px-4 py-2 text-sm rounded-md bg-neutral-100 text-neutral-900 font-medium"
                >
                  Continue
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}
