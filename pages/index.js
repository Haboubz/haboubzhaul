import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { auth, db } from "../firebaseConfig";
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";

const Index = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        router.push("/dashboard"); // Redirect logged-in users to the dashboard
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Store the username in Firestore
      await setDoc(doc(db, "users", user.uid), {
        username: username,
        email: user.email,
        entries: 1,
      });

      router.push("/dashboard"); // Redirect to dashboard
    } catch (error) {
      console.error("Sign-in error:", error);
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "50px", color: "yellow" }}>
      <h1>Welcome to Haboubz Haul!</h1>
      <p>Enter your OSRS username to get started.</p>
      <input
        type="text"
        placeholder="Enter Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={{ padding: "10px", marginBottom: "10px" }}
      />
      <br />
      <button onClick={handleSignIn} style={{ padding: "10px", background: "yellow", fontWeight: "bold" }}>
        Join In!
      </button>
      <br />
      <button onClick={() => router.push("/leaderboard")} style={{ marginTop: "10px", padding: "10px", background: "gray" }}>
        View Leaderboard
      </button>
    </div>
  );
};

export default Index;
