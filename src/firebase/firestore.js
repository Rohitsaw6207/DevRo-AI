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
   DATE HELPERS
========================= */

/**
 * Next local midnight
 */
function getNextMidnight() {
  const now = new Date()
  const next = new Date(now)
  next.setDate(now.getDate() + 1)
  next.setHours(0, 0, 0, 0)
  return Timestamp.fromDate(next)
}

/**
 * First day of next month (local)
 */
function getNextMonthStart() {
  const now = new Date()
  const next = new Date(now.getFullYear(), now.getMonth() + 1, 1)
  next.setHours(0, 0, 0, 0)
  return Timestamp.fromDate(next)
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
      dailyRemaining: 3,
      dailyResetAt: getNextMidnight(),

      monthlyRemaining: 15,
      monthlyResetAt: getNextMonthStart(),

      lifetimeTotal: 0
    },

    createdAt: serverTimestamp()
  })
}

/* =========================
   PROFILE FETCH + AUTO RESET
========================= */

export const getUserProfile = async (uid) => {
  const ref = doc(db, 'users', uid)
  const snap = await getDoc(ref)

  if (!snap.exists()) return null

  const data = snap.data()
  const now = Timestamp.now()

  let usage = data.usage || {}
  let updated = false

  // ---- DAILY RESET ----
  if (!usage.dailyResetAt || now.seconds >= usage.dailyResetAt.seconds) {
    usage.dailyRemaining = 3
    usage.dailyResetAt = getNextMidnight()
    updated = true
  }

  // ---- MONTHLY RESET (FREE USERS ONLY) ----
  if (!data.isPro) {
    if (
      !usage.monthlyResetAt ||
      now.seconds >= usage.monthlyResetAt.seconds
    ) {
      usage.monthlyRemaining = 15
      usage.monthlyResetAt = getNextMonthStart()
      updated = true
    }
  }

  // ---- LIFETIME SAFETY ----
  if (typeof usage.lifetimeTotal !== 'number') {
    usage.lifetimeTotal = 0
    updated = true
  }

  if (updated) {
    await updateDoc(ref, { usage })
    return { ...data, usage }
  }

  return data
}

/* =========================
   CONSUME TOKEN (ON SUCCESS)
========================= */

export const consumeUsage = async (uid) => {
  const ref = doc(db, 'users', uid)
  const snap = await getDoc(ref)

  if (!snap.exists()) throw new Error('User not found')

  const data = snap.data()
  const usage = data.usage

  // ---- DAILY CHECK ----
  if (usage.dailyRemaining <= 0) {
    throw new Error('Daily limit reached')
  }

  // ---- MONTHLY CHECK (FREE USERS ONLY) ----
  if (!data.isPro && usage.monthlyRemaining <= 0) {
    throw new Error('Monthly limit reached')
  }

  const updates = {
    'usage.dailyRemaining': usage.dailyRemaining - 1,
    'usage.lifetimeTotal': usage.lifetimeTotal + 1
  }

  if (!data.isPro) {
    updates['usage.monthlyRemaining'] = usage.monthlyRemaining - 1
  }

  await updateDoc(ref, updates)
}
