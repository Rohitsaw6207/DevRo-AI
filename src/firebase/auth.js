import { auth } from './firebase'
import {
  onAuthStateChanged,
  signOut
} from 'firebase/auth'

export const listenToAuthChanges = (callback) => {
  return onAuthStateChanged(auth, callback)
}

export const logoutUser = () => {
  return signOut(auth)
}
