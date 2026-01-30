import { db } from './firebase'
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore'

/* =========================
   CONSTANTS
========================= */

const FREE_DAILY_LIMIT = 3
const FREE_MONTHLY_LIMIT = 15

const PRO_DAILY_LIMIT = 9
const PRO_MONTHLY_LIMIT = 99

const PRO_DURATION_DAYS = 30

/* =========================
   DATE HELPERS
========================= */

function getNextMidnight() {
  const now = new Date()
  const next = new Date(now)
  next.setDate(now.getDate() + 1)
  next.setHours(0, 0, 0, 0)
  return Timestamp.fromDate(next)
}

function getNextMonthStart() {
  const now = new Date()
  const next = new Date(now.getFullYear(), now.getMonth() + 1, 1)
  next.setHours(0, 0, 0, 0)
  return Timestamp.fromDate(next)
}

function getProExpiryDate() {
  const date = new Date()
  date.setDate(date.getDate() + PRO_DURATION_DAYS)
  return Timestamp.fromDate(date)
}

/* =========================
   USER CREATION
========================= */

export const createUserDocument = async (user, { name, gender }) => {
  const ref = doc(db, 'users', user.uid)
  const snap = await getDoc(ref)

  if (snap.exists()) return

  await setDoc(ref, {
    uid: user.uid,
    name,
    email: user.email,
    gender,
    isPro: false,

    usage: {
      dailyRemaining: FREE_DAILY_LIMIT,
      dailyResetAt: getNextMidnight(),

      monthlyRemaining: FREE_MONTHLY_LIMIT,
      monthlyResetAt: getNextMonthStart(),

      lifetimeTotal: 0
    },

    subscription: null,
    createdAt: serverTimestamp()
  })
}

/* =========================
   PROFILE FETCH + AUTO LOGIC
========================= */

export const getUserProfile = async (uid) => {
  const ref = doc(db, 'users', uid)
  const snap = await getDoc(ref)

  if (!snap.exists()) return null

  const data = snap.data()
  const now = Timestamp.now()

  let { usage = {}, subscription = null } = data
  let updated = false

  /* ---- PRO EXPIRY CHECK ---- */
  if (
    data.isPro &&
    subscription?.expiresAt &&
    now.seconds >= subscription.expiresAt.seconds
  ) {
    data.isPro = false
    subscription.status = 'expired'

    usage.dailyRemaining = FREE_DAILY_LIMIT
    usage.monthlyRemaining = FREE_MONTHLY_LIMIT

    updated = true
  }

  /* ---- DAILY RESET ---- */
  if (!usage.dailyResetAt || now.seconds >= usage.dailyResetAt.seconds) {
    usage.dailyRemaining = data.isPro
      ? PRO_DAILY_LIMIT
      : FREE_DAILY_LIMIT

    usage.dailyResetAt = getNextMidnight()
    updated = true
  }

  /* ---- MONTHLY RESET ---- */
  if (!usage.monthlyResetAt || now.seconds >= usage.monthlyResetAt.seconds) {
    usage.monthlyRemaining = data.isPro
      ? PRO_MONTHLY_LIMIT
      : FREE_MONTHLY_LIMIT

    usage.monthlyResetAt = getNextMonthStart()
    updated = true
  }

  /* ---- SAFETY ---- */
  if (typeof usage.lifetimeTotal !== 'number') {
    usage.lifetimeTotal = 0
    updated = true
  }

  if (updated) {
    await updateDoc(ref, {
      isPro: data.isPro,
      usage,
      subscription
    })
  }

  return { ...data, usage, subscription }
}

/* =========================
   CONSUME USAGE (ON SUCCESS)
========================= */

export const consumeUsage = async (uid) => {
  const ref = doc(db, 'users', uid)
  const snap = await getDoc(ref)

  if (!snap.exists()) throw new Error('User not found')

  const data = snap.data()
  const { usage } = data

  if (usage.dailyRemaining <= 0) {
    throw new Error('Daily limit reached')
  }

  if (usage.monthlyRemaining <= 0) {
    throw new Error('Monthly limit reached')
  }

  await updateDoc(ref, {
    'usage.dailyRemaining': usage.dailyRemaining - 1,
    'usage.monthlyRemaining': usage.monthlyRemaining - 1,
    'usage.lifetimeTotal': usage.lifetimeTotal + 1
  })
}

/* =========================
   ACTIVATE PRO (CALLED AFTER PAYMENT)
========================= */

export const activateProSubscription = async (uid) => {
  const ref = doc(db, 'users', uid)

  await updateDoc(ref, {
    isPro: true,
    subscription: {
      provider: 'razorpay',
      status: 'active',
      activatedAt: serverTimestamp(),
      expiresAt: getProExpiryDate()
    },
    usage: {
      dailyRemaining: PRO_DAILY_LIMIT,
      dailyResetAt: getNextMidnight(),

      monthlyRemaining: PRO_MONTHLY_LIMIT,
      monthlyResetAt: getNextMonthStart(),

      lifetimeTotal: 0
    }
  })
}
