import { motion } from 'framer-motion'

import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'

const sections = [
  {
    title: '1. Information We Collect',
    content:
      'We collect information you provide directly to us, such as your name, email address, and account details. We may also collect limited technical information about your device and usage to ensure platform stability and security.'
  },
  {
    title: '2. How We Use Your Information',
    content:
      'Your information is used to operate, maintain, and improve DevRo AI, communicate with you about updates, and ensure a secure experience. We do not use your data for unrelated advertising.'
  },
  {
    title: '3. Information Sharing',
    content:
      'We do not sell or rent your personal information. Data may only be shared if legally required or necessary to protect DevRo AI and its users.'
  },
  {
    title: '4. Data Security',
    content:
      'We apply reasonable technical and organizational measures to protect your data. However, no system can guarantee absolute security.'
  },
  {
    title: '5. Your Rights',
    content:
      'You may access, update, or delete your personal information at any time. You can also opt out of non-essential communications.'
  },
  {
    title: '6. Cookies',
    content:
      'DevRo AI may use minimal cookies or similar technologies to support authentication and essential functionality. You can manage cookies through your browser settings.'
  },
  {
    title: '7. Policy Updates',
    content:
      'We may update this policy periodically. Any changes will be reflected on this page with an updated revision date.'
  }
]

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <Navbar />

      {/* HEADER */}
      <section className="pt-24 pb-12 px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h1 className="text-4xl sm:text-5xl font-semibold mb-4">
            Privacy Policy
          </h1>
          <p className="text-neutral-400">
            Last updated: February 1, 2026
          </p>
        </motion.div>
      </section>

      {/* CONTENT */}
      <section className="px-6 pb-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-neutral-300 leading-relaxed"
          >
            At DevRo AI, your privacy matters. This policy explains how we collect,
            use, and protect your information when you use our platform.
          </motion.p>

          {sections.map((section, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.04 }}
              className="border border-neutral-800 rounded-lg bg-neutral-900 p-6"
            >
              <h2 className="text-lg font-semibold mb-2">
                {section.title}
              </h2>
              <p className="text-neutral-400 text-sm leading-relaxed">
                {section.content}
              </p>
            </motion.div>
          ))}

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="border border-neutral-800 rounded-lg bg-neutral-900 p-6"
          >
            <p className="text-neutral-400 text-sm leading-relaxed">
              <strong className="text-neutral-200">Note:</strong> This policy is a
              general template. For production use, consult legal professionals to
              ensure compliance with applicable regulations.
            </p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
