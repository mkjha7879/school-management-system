import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

const PROJECT_ID = 'school-management-system-79732'

// Public web config. Fill the three values marked below from:
// Firebase Console -> Project settings -> General -> Your apps -> Web app (SDK setup)
// They can be provided via a .env file (see .env.example) or pasted here directly.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ?? '',
  authDomain:
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ?? `${PROJECT_ID}.firebaseapp.com`,
  databaseURL:
    import.meta.env.VITE_FIREBASE_DATABASE_URL ??
    `https://${PROJECT_ID}-default-rtdb.firebaseio.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ?? PROJECT_ID,
  storageBucket:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ?? `${PROJECT_ID}.appspot.com`,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID ?? '',
}

export const isFirebaseConfigured = Boolean(firebaseConfig.apiKey)

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
