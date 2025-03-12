import { useState } from "react";
import { useRouter } from "next/router";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { db } from "../firebaseConfig";
import { doc, setDoc } from "firebase/firestore";

export default function Home() {
  const [username, setUsername] = useState("");
  const router = useRouter();
  const auth = getAuth();
  const provider = new GoogleAuthProvider();

  const handleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Store username in Firestore
      if (username) {
        await setDoc(doc(db, "users", user.uid), {
          username: username,
          email: user.email
        });
      }

      router.push("/dashboard");
    } catch (error) {
      console.error("Error signing in:", error);
    }
  };

  return (
    <div style={{ textAlign: "center", color: "yellow", backgroundColor: "black", height: "100vh" }}>
      <h1>Welcome to Haboubz Haul!</h1>
      <p>Enter your OSRS username to get started.</p>
      <input
        type="text"
        placeholder="Enter Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={{ padding: "10px", marginBottom: "10px" }}
      />
      <button onClick={handleSignIn} style={{ padding: "10px", marginLeft: "10px" }}>Continue</button>
    </div>
  );
}
