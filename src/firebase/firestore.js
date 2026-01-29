import { db } from './firebase'
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore'

/**
 * Get next local midnight
 */
function getNextMidnight() {
  const now = new Date()
  const next = new Date(now)
  next.setDate(now.getDate() + 1)
  next.setHours(0, 0, 0, 0)
  return Timestamp.fromDate(next)
}

/**
 * Create user document on signup
 */
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
      lifetimeTotal: 0
    },

    createdAt: serverTimestamp()
  })
}

/**
 * Get user profile + auto reset daily usage
 */
export const getUserProfile = async (uid) => {
  const ref = doc(db, 'users', uid)
  const snap = await getDoc(ref)

  if (!snap.exists()) return null

  const data = snap.data()
  const now = Timestamp.now()

  if (
    data.usage &&
    now.seconds >= data.usage.dailyResetAt.seconds
  ) {
    const updatedUsage = {
      dailyRemaining: 3,
      dailyResetAt: getNextMidnight(),
      lifetimeTotal: data.usage.lifetimeTotal || 0
    }

    await updateDoc(ref, { usage: updatedUsage })
    return { ...data, usage: updatedUsage }
  }

  return data
}

/**
 * Consume one generation (call ONLY on success)
 */
export const consumeUsage = async (uid) => {
  const ref = doc(db, 'users', uid)
  const snap = await getDoc(ref)

  if (!snap.exists()) throw new Error('User not found')

  const { usage } = snap.data()

  if (usage.dailyRemaining <= 0) {
    throw new Error('Daily limit reached')
  }

  await updateDoc(ref, {
    'usage.dailyRemaining': usage.dailyRemaining - 1,
    'usage.lifetimeTotal': usage.lifetimeTotal + 1
  })
}
