// Initialize Firebase
import { initializeApp, getApps } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

// ✅ Protegido con typeof window
if (typeof window !== "undefined") {
  try {
    const analytics = getAnalytics(app);
  } catch (err) {
    console.warn("Analytics no disponible:", err.message);
  }
}

//console.log("apiKey", process.env.NEXT_PUBLIC_FIREBASE_API_KEY);

const db = getFirestore(app);
const storage = getStorage(app);

export { app, db, storage };
