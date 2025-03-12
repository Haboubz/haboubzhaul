import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { getAuth, signOut } from "firebase/auth";
import { db } from "../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

export default function Dashboard() {
  const [username, setUsername] = useState("");
  const router = useRouter();
  const auth = getAuth();

  useEffect(() => {
    const fetchUsername = async () => {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUsername(docSnap.data().username);
        }
      }
    };

    fetchUsername();
  }, []);

  return (
    <div style={{ textAlign: "center", color: "yellow", backgroundColor: "black", height: "100vh" }}>
      <h1>Dashboard</h1>
      <p>Logged in as: <strong>{username || "Loading..."}</strong></p>
      <button onClick={() => router.push("/leaderboard")} style={{ padding: "10px", background: "gray" }}>View Leaderboard</button>
      <button onClick={() => signOut(auth)} style={{ padding: "10px", background: "red", color: "white", marginLeft: "10px" }}>Sign Out</button>
    </div>
  );
}
