import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyD33P5i4oyKv94F0OhcWeldqTJ1zkOKt7k',
  authDomain: 'hitro-dev.firebaseapp.com',
  projectId: 'hitro-dev',
  storageBucket: 'hitro-dev.appspot.com',
  messagingSenderId: '743160595391',
  appId: '1:743160595391:web:5769cf16b38448b4b3970a'
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Firebase services
export const auth = getAuth(app)
export const db = getFirestore(app)

export default app
