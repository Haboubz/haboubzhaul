import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDhFfGVlSLE7BT6LExo70EsiLgVYr3dvNg",
  authDomain: "haboubzhaul.firebaseapp.com",
  projectId: "haboubzhaul",
  storageBucket: "haboubzhaul.appspot.com",
  messagingSenderId: "665091740041",
  appId: "1:665091740041:web:c0f471cd9b0e7cce591158",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
