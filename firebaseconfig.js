import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "YOUR_FIREBASE_API_KEY",
  authDomain: "haboubzhaul.firebaseapp.com",
  projectId: "haboubzhaul",
  storageBucket: "haboubzhaul.firebasestorage.app",  // Use exactly what Firebase provides
  messagingSenderId: "665091740041",
  appId: "1:665091740041:web:c0f471cd9b0e7cce591158"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
