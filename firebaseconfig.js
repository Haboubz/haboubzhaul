// firebaseConfig.js
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// 🔥 Replace these with your actual Firebase credentials
const firebaseConfig = {
  apiKey: "AIzaSyDhFfGVlSLE7BT6LExo70EsiLgVYr3dvNg",
  authDomain: "haboubzhaul.firebaseapp.com",
  projectId: "haboubzhaul",
  storageBucket: "haboubzhaul.firebasestorage.app",
  messagingSenderId: "665091740041",
  appId: "1:665091740041:web:c0f471cd9b0e7cce591158"
};

// ✅ Check if Firebase is already initialized before calling initializeApp()
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };
