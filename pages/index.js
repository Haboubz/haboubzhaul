import { useState } from "react";
import { auth } from "../firebaseConfig";  // ✅ Corrected import path
import { signInWithPopup, GoogleAuthProvider, getIdToken } from "firebase/auth";

const provider = new GoogleAuthProvider();

const HomePage = () => {
  const [username, setUsername] = useState("");

  const handleSubmit = async () => {
    try {
      // Authenticate user with Google Sign-In
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const token = await getIdToken(user);

      console.log("User Token:", token);

      // Send request to Firebase Function
      const response = await fetch(
        "https://us-central1-haboubzhaul.cloudfunctions.net/incrementEntry",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({ username: username, userEmail: user.email }),
        }
      );

      const data = await response.json();
      if (data.success) {
        alert("Entry submitted successfully!");
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Authentication error", error);
      alert("Failed to authenticate. Please try again.");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>Welcome to Haboubz Haul!</h1>
      <p>Enter your OSRS username to get started.</p>
      <input
        type="text"
        placeholder="Enter Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <button onClick={handleSubmit}>Continue</button>
    </div>
  );
};

export default HomePage;
