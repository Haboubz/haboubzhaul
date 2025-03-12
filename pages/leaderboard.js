import { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { useRouter } from "next/router";

const Leaderboard = () => {
  const [entries, setEntries] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchEntries = async () => {
      const querySnapshot = await getDocs(collection(db, "users"));
      const entriesList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      entriesList.sort((a, b) => b.entries - a.entries);
      setEntries(entriesList);
    };
    fetchEntries();
  }, []);

  return (
    <div style={{ textAlign: "center", padding: "50px", color: "yellow" }}>
      <h1>Leaderboard</h1>
      <table style={{ margin: "auto", border: "1px solid yellow", padding: "10px" }}>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Username</th>
            <th>Entries</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry, index) => (
            <tr key={entry.id}>
              <td>{index + 1}</td>
              <td>{entry.username}</td>
              <td>{entry.entries}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <br />
      <button onClick={() => router.push("/")} style={{ padding: "10px", background: "yellow", fontWeight: "bold" }}>
        Back to Home
      </button>
    </div>
  );
};

export default Leaderboard;
