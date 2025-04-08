import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { db } from "../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

export default function Leaderboard() {
  const [users, setUsers] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      const querySnapshot = await getDocs(collection(db, "users"));
      const userList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsers(userList);
    };

    fetchUsers();
  }, []);

  return (
    <div className="container">
      <img src="/logo.png" alt="Logo" className="logo" />
      <h2>Leaderboard</h2>
      <table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Username</th>
            <th>Entries</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user, index) => (
              <tr key={user.id}>
                <td>{index + 1}</td>
                <td>{user.username}</td>
                <td>1</td> {/* Placeholder for now */}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">No leaderboard data available.</td>
            </tr>
          )}
        </tbody>
      </table>
      <button onClick={() => router.push("/dashboard")}>Back to Dashboard</button>
    </div>
  );
}
