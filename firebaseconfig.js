import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "YOUR_FIREBASE_API_KEY",
  authDomain: "haboubzhaul.firebaseapp.com",
  projectId: "haboubzhaul",
  storageBucket: "haboubzhaul.firebasestorage.app",
  messagingSenderId: "665091740041",
  appId: "1:665091740041:web:c0f471cd9b0e7cce591158"
};

// Ensure Firebase is only initialized once
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
