import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { auth, db } from "../firebaseConfig";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

const Dashboard = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists()) {
          setUsername(userDoc.data().username);
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
      {user ? (
        <>
          <p>Logged in as: {username || user.displayName}</p>
          <button onClick={() => router.push("/leaderboard")} style={{ padding: "10px", background: "gray" }}>
            View Leaderboard
          </button>
          <br />
          <button onClick={handleSignOut} style={{ marginTop: "10px", padding: "10px", background: "red", color: "white" }}>
            Sign Out
          </button>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Dashboard;
