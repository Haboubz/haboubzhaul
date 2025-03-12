import { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { useRouter } from "next/router";

export default function Leaderboard() {
  const [entries, setEntries] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchEntries = async () => {
      const querySnapshot = await getDocs(collection(db, "users"));
      const data = querySnapshot.docs.map((doc) => doc.data());
      setEntries(data);
    };

    fetchEntries();
  }, []);

  return (
    <div style={{ textAlign: "center", color: "yellow", backgroundColor: "black", height: "100vh" }}>
      <h1>Leaderboard</h1>
      <table border="1" style={{ color: "yellow", margin: "auto" }}>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Username</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{entry.username}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={() => router.push("/dashboard")} style={{ padding: "10px", background: "yellow", marginTop: "10px" }}>Back to Dashboard</button>
    </div>
  );
}
