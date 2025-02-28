import { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function Leaderboard() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const querySnapshot = await getDocs(collection(db, "Users"));
      const usersList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Sort by highest entries
      usersList.sort((a, b) => b.entries - a.entries);
      setUsers(usersList);
    };

    fetchUsers();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">Leaderboard</h1>
      <ul className="w-1/2 bg-white shadow-md rounded p-4">
        {users.map((user, index) => (
          <li key={user.id} className="border-b p-2">
            {index + 1}. {user.username} - {user.entries} Entries
          </li>
        ))}
      </ul>
    </div>
  );
}
