import { useState } from "react";
import { useRouter } from "next/router";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { db } from "../firebaseConfig";
import { doc, setDoc } from "firebase/firestore";

export default function Home() {
  const [username, setUsername] = useState("");
  const [error, setError] = useState(null);
  const router = useRouter();
  const auth = getAuth();
  const provider = new GoogleAuthProvider();

  // Function to check if OSRS username is real
  const isValidOSRSUsername = async (username) => {
    try {
      const response = await fetch(`https://corsproxy.io/?https://services.runescape.com/m=hiscore_oldschool/index_lite.ws?player=${encodeURIComponent(username)}`);
      return response.ok; // ✅ If response is OK, username exists
    } catch (error) {
      console.error("Error checking OSRS username:", error);
      return false;
    }
  };

  const handleSignIn = async () => {
    if (!username) {
      setError("Please enter an OSRS username.");
      return;
    }

    setError(null); // Reset error

    // ✅ Check if username is valid in OSRS Hiscores
    const isValid = await isValidOSRSUsername(username);
    if (!isValid) {
      setError("Invalid OSRS username. Please try again.");
      return;
    }

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // ✅ Save valid username in Firestore
      await setDoc(doc(db, "users", user.uid), {
        username: username,
        email: user.email
      });

      router.push("/dashboard");
    } catch (error) {
      console.error("Error signing in:", error);
      setError("Error signing in. Please try again.");
    }
  };

  return (
    <div className="container">
      <img src="/logo.png" alt="Logo" className="logo" />
      <h1>Welcome to Haboubz Haul!</h1>
      <p>Enter your OSRS username to get started.</p>
      <input
        type="text"
        placeholder="Enter Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={{ padding: "10px", marginBottom: "10px" }}
      />
      <button onClick={handleSignIn}>Continue</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
