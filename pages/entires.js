import { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function Entries() {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "Users"));
        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        // Sort entries from highest to lowest
        data.sort((a, b) => b.entries - a.entries);

        setEntries(data);
      } catch (error) {
        console.error("Error fetching entries:", error);
      }
    };

    fetchEntries();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">Leaderboard</h1>
      <table className="border-collapse border border-gray-500">
        <thead>
          <tr>
            <th className="border border-gray-500 p-2">Username</th>
            <th className="border border-gray-500 p-2">Entries</th>
          </tr>
        </thead>
        <tbody>
          {entries.map(user => (
            <tr key={user.id}>
              <td className="border border-gray-500 p-2">{user.username}</td>
              <td className="border border-gray-500 p-2">{user.entries}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
