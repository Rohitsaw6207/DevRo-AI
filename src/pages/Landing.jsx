import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Code2, FolderTree, Download, Sparkles } from 'lucide-react'

import Navbar from '../components/layout/Navbar'
import Pricing from './Pricing'

const features = [
  {
    icon: Code2,
    title: 'Prompt to Structured Code',
    desc: 'Describe what you want and get real React + Tailwind projects — not snippets. You receive clean, readable code you can understand and extend.'
  },
  {
    icon: FolderTree,
    title: 'Real Project Structure',
    desc: 'Predictable folders, meaningful file names, and a production-ready layout that mirrors real-world React apps.'
  },
  {
    icon: Sparkles,
    title: 'Preview Before Download',
    desc: 'Understand what is generated before you download it. No surprises. No black-box output.'
  },
  {
    icon: Download,
    title: 'Download & Ship',
    desc: 'Own the output completely. Download the full project and deploy it anywhere without restrictions.'
  }
]

export default function Landing() {
  const navigate = useNavigate()

  // TEMP auth flag — replace later
  const isAuthenticated = false

  const handleStart = () => {
    if (isAuthenticated) {
      navigate('/coding')
    } else {
      navigate('/signup')
    }
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 overflow-hidden">
      <Navbar />

      {/* HERO */}
      <section className="relative px-6 pt-36 pb-32">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-14 items-center">

          {/* LEFT */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left"
          >
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight mb-5">
              Turn ideas into
              <br />
              <span className="text-neutral-400">real project code</span>
            </h1>

            <p className="text-neutral-300 text-base max-w-xl mx-auto lg:mx-0 mb-6">
              DevRo AI converts plain-language prompts into structured React projects —
              complete with folders, files, and code you can confidently ship.
            </p>

            <div className="flex justify-center lg:justify-start">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleStart}
                className="px-6 py-3 rounded-md bg-neutral-100 text-neutral-900 font-medium"
              >
                Start Building
              </motion.button>
            </div>
          </motion.div>

          {/* RIGHT — FLOATING APP MOCKUP (md+) */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="relative hidden md:flex justify-center"
          >
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
              className="relative"
            >
              {/* DESKTOP MOCKUP */}
              <div className="w-[440px] rounded-2xl bg-neutral-900 border border-neutral-800 shadow-2xl overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-3 border-b border-neutral-800 bg-neutral-900">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                </div>

                <div className="p-6 h-[280px] bg-gradient-to-br from-neutral-900 to-neutral-800 flex items-center justify-center">
                  <div className="text-center">
                    <FolderTree className="w-12 h-12 text-neutral-500 mx-auto mb-3" />
                    <p className="text-sm text-neutral-400">
                      Your App Preview
                    </p>
                  </div>
                </div>
              </div>

              {/* MOBILE MOCKUP */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: 1
                }}
                className="absolute -bottom-10 -left-16 w-44"
              >
                <div className="rounded-3xl bg-neutral-900 border border-neutral-800 shadow-2xl overflow-hidden">
                  <div className="h-6 bg-neutral-800 flex items-center justify-center">
                    <div className="w-14 h-1.5 rounded-full bg-neutral-700" />
                  </div>

                  <div className="p-4 h-[180px] bg-gradient-to-b from-neutral-900 to-neutral-800 flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-neutral-500" />
                  </div>

                  <div className="h-4 bg-neutral-900" />
                </div>
              </motion.div>
            </motion.div>
          </motion.div>

        </div>
      </section>

      {/* FEATURES */}
      <section className="px-6 py-12 border-t border-neutral-900">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-10">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.05 }}
              className="space-y-3 text-center md:text-left"
            >
              <div className="h-10 w-10 mx-auto md:mx-0 flex items-center justify-center rounded-md bg-neutral-800">
                <f.icon size={20} />
              </div>
              <h3 className="text-lg font-medium">{f.title}</h3>
              <p className="text-neutral-400 text-sm leading-relaxed">
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* PRODUCT SHOWCASE */}
      <section className="px-6 py-16 border-t border-neutral-900">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-14 items-center">

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="text-center md:text-left"
          >
            <h2 className="text-3xl sm:text-4xl font-semibold mb-4">
              Build faster.
              <span className="text-neutral-400"> Stay in control.</span>
            </h2>

            <p className="text-neutral-400 max-w-xl mx-auto md:mx-0 mb-5">
              Generate real projects with structure, clarity, and ownership —
              without surrendering control to black-box tools.
            </p>

            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleStart}
              className="px-6 py-3 rounded-md bg-neutral-100 text-neutral-900 font-medium"
            >
              Start Free
            </motion.button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="hidden md:block"
          >
            <img
              src="/product-preview.png"
              alt="DevRo AI preview"
              className="rounded-xl shadow-2xl"
            />
          </motion.div>

        </div>
      </section>

      {/* PRICING (includes Footer internally) */}
      <Pricing />
    </div>
  )
}
