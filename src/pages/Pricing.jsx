import { motion } from 'framer-motion'
import { FiCheck } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'

import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import { useAuth } from '../context/AuthContext'
import { openRazorpayCheckout } from '../services/razorpayService'
import { activateProSubscription } from '../firebase/firestore'

const Pricing = () => {
  const { user, profile, refreshProfile } = useAuth()
  const navigate = useNavigate()

  const handleUpgrade = async () => {
    if (!user) {
      navigate('/signup')
      return
    }

    try {
      await openRazorpayCheckout({
        amount: 34900, // ₹349 in paise
        user,
        onSuccess: async () => {
          // ✅ SINGLE SOURCE OF TRUTH
          await activateProSubscription(user.uid)

          // ✅ REFRESH PROFILE STATE
          await refreshProfile(user.uid)

          navigate('/home')
        },
        onFailure: () => {
          // stay on pricing page
        }
      })
    } catch (err) {
      console.error('Razorpay error:', err)
    }
  }

  const plans = [
    {
      name: 'Free',
      price: '₹0',
      period: 'forever',
      description: 'For exploring DevRo AI',
      features: [
        '15 tokens per month',
        '3 tokens per day',
        'HTML projects only',
        'Basic code generation',
        'ZIP downloads',
        'Community support'
      ],
      cta: 'Start Free',
      action: () => navigate('/signup')
    },
    {
      name: 'Pro',
      price: '₹349',
      period: 'per month',
      description: 'For serious builders',
      features: [
        'Unlimited tokens',
        'HTML + React projects',
        'Advanced code generation',
        'Full file structure',
        'Priority support',
        'Future feature access'
      ],
      cta: profile?.isPro ? 'Start using' : 'Upgrade to Pro',
      action: profile?.isPro ? () => navigate('/home') : handleUpgrade
    }
  ]

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <Navbar />

      {/* HEADER */}
      <section className="pt-24 pb-12 px-6 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl sm:text-5xl font-semibold mb-4"
        >
          Simple pricing.
          <span className="text-neutral-400"> No surprises.</span>
        </motion.h1>

        <p className="text-neutral-400 max-w-xl mx-auto">
          Start free. Upgrade only when you actually need more.
        </p>
      </section>

      {/* PRICING CARDS */}
      <section className="px-6 pb-12">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className="rounded-xl border border-neutral-800 bg-neutral-900 p-7 shadow-lg"
            >
              <div className="mb-5">
                <h3 className="text-xl font-semibold mb-1">
                  {plan.name}
                </h3>
                <p className="text-neutral-400 text-sm">
                  {plan.description}
                </p>
              </div>

              <div className="mb-5">
                <div className="text-4xl font-semibold">
                  {plan.price}
                </div>
                <div className="text-sm text-neutral-400">
                  {plan.period}
                </div>
              </div>

              <ul className="space-y-2 mb-6">
                {plan.features.map((feature, fIndex) => (
                  <li key={fIndex} className="flex items-start text-sm">
                    <FiCheck className="w-4 h-4 mr-3 mt-0.5 text-neutral-300" />
                    <span className="text-neutral-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={plan.action}
                className="
                  w-full
                  py-2.5
                  rounded-md
                  bg-neutral-100
                  text-neutral-900
                  font-medium
                  hover:bg-white
                  transition
                "
              >
                {plan.cta}
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 pb-12 border-t border-neutral-900">
        <div className="max-w-3xl mx-auto pt-12">
          <h2 className="text-2xl font-semibold mb-8 text-center">
            Frequently asked questions
          </h2>

          <div className="space-y-4">
            {[
              {
                q: 'Can I upgrade later?',
                a: 'Yes. You can upgrade or downgrade your plan anytime.'
              },
              {
                q: 'Is there a free trial for Pro?',
                a: 'Yes. You can try Pro before committing.'
              },
              {
                q: 'Do I own the generated code?',
                a: 'Yes. You fully own and can deploy it anywhere.'
              }
            ].map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.08 }}
                className="rounded-lg border border-neutral-800 bg-neutral-900 p-5"
              >
                <h3 className="font-medium mb-1">
                  {faq.q}
                </h3>
                <p className="text-neutral-400 text-sm">
                  {faq.a}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default Pricing
