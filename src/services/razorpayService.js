/**
 * Load Razorpay Checkout script safely (once)
 */
export const loadRazorpay = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true)
      return
    }

    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true

    script.onload = () => {
      resolve(true)
    }

    script.onerror = () => {
      resolve(false)
    }

    document.body.appendChild(script)
  })
}

/**
 * Open Razorpay Checkout
 * This does NOT update Firestore.
 * That logic stays in the caller (Pricing page).
 */
export const openRazorpayCheckout = async ({
  amount,
  user,
  onSuccess,
  onFailure
}) => {
  const loaded = await loadRazorpay()

  if (!loaded) {
    throw new Error('Razorpay SDK failed to load')
  }

  const options = {
    key: import.meta.env.VITE_RAZORPAY_KEY_ID,
    amount: amount, // amount in paise
    currency: 'INR',
    name: 'DevRo AI',
    description: 'Pro Subscription (Test Mode)',
    prefill: {
      email: user?.email || ''
    },
    theme: {
      color: '#0f172a'
    },
    handler: function (response) {
      // Frontend-only success callback (accepted risk)
      if (typeof onSuccess === 'function') {
        onSuccess(response)
      }
    },
    modal: {
      ondismiss: function () {
        if (typeof onFailure === 'function') {
          onFailure()
        }
      }
    }
  }

  const rzp = new window.Razorpay(options)
  rzp.open()
}
