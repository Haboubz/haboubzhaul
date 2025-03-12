import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { auth, db } from "../firebaseConfig";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";

const Dashboard = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [osrsUsername, setOsrsUsername] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);

        // Fetch OSRS username from Firestore
        const userRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(userRef);

        if (docSnap.exists()) {
          setOsrsUsername(docSnap.data().osrsUsername || "Unknown");
        }
      } else {
        router.push("/");
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleSignOut = async () => {
    await signOut(auth);
    router.push("/");
  };

  return (
    <div style={{ textAlign: "center", padding: "50px", color: "yellow" }}>
      <h1>Dashboard</h1>
      {user ? <p>Logged in as: {osrsUsername}</p> : <p>Loading...</p>}
      <button onClick={() => router.push("/leaderboa
