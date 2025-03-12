import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { db } from "../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

const Leaderboard = () => {
  const router = useRouter();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const querySnapshot = await getDocs(collection(db, "users"));
      const usersList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(usersList);
    };

    fetchLeaderboard();
  }, []);

  return (
    <div style={{ textAlign: "center", padding: "50px", color: "yellow" }}>
      <h1>Leaderboard</h1>
      <table style={{ margin: "auto", border: "1px solid yellow", color: "yellow" }}>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Username</th>
            <th>Entries</th>
          </tr>
        </thead>
        <tbody>
          {users
            .sort((a, b) => b.entries - a.entries)
            .map((user, index) => (
              <tr key={user.id}>
                <td>{index + 1}</td>
                <td>{user.osrsUsername}</td>
                <td>{user.entries}</td>
              </tr>
            ))}
        </tbody>
      </table>
      <br />
      <button onClick={() => router.push("/dashboard")} style={{ padding: "10px", background: "yellow", fontWeight: "bold" }}>
        Back to Dashboard
      </button>
    </div>
  );
};

export default Leaderboard;
