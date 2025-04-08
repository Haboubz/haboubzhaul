import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

export default function Dashboard() {
  const router = useRouter();
  const [osrsName, setOsrsName] = useState(null);
  const [isMember, setIsMember] = useState(false);
  const [xpEntries, setXpEntries] = useState(0);
  const [kcEntries, setKcEntries] = useState(0);
  const [totalEntries, setTotalEntries] = useState(0);
  const [loading, setLoading] = useState(true);

  const CLIENT_ID = "1352239826392449076";
  const REDIRECT_URI = "https://haboubzhaul.vercel.app/dashboard";
  const SERVER_ID = "1142757067652861965";
  const BOT_TOKEN = process.env.NEXT_PUBLIC_DISCORD_BOT_TOKEN;
  const CLIENT_SECRET = process.env.NEXT_PUBLIC_DISCORD_CLIENT_SECRET;

  const fetchDiscordData = useCallback(async (code) => {
    try {
      const tokenResponse = await axios.post(
        "https://discord.com/api/oauth2/token",
        new URLSearchParams({
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
          grant_type: "authorization_code",
          code,
          redirect_uri: REDIRECT_URI,
          scope: "identify guilds.members.read",
        }),
        {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        }
      );

      const accessToken = tokenResponse.data.access_token;

      const userResponse = await axios.get("https://discord.com/api/users/@me", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const discordUser = userResponse.data;

      const userRef = doc(db, "users", discordUser.id);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        const osrsFromStorage = localStorage.getItem("osrsName");
        if (osrsFromStorage) {
          await setDoc(userRef, {
            discordId: discordUser.id,
            osrsName: osrsFromStorage,
          });
          setOsrsName(osrsFromStorage);
        }
      } else {
        setOsrsName(userSnap.data().osrsName);
      }

      // Check if Discord user is in the server
      try {
        const memberResponse = await axios.get(
          `https://discord.com/api/guilds/${SERVER_ID}/members/${discordUser.id}`,
          {
            headers: { Authorization: `Bot ${BOT_TOKEN}` },
          }
        );
        if (memberResponse.status === 200) setIsMember(true);
      } catch {
        setIsMember(false);
      }
    } catch (error) {
      console.error("Discord auth failed:", error);
    } finally {
      setLoading(false);
    }
  }, [BOT_TOKEN, CLIENT_ID, CLIENT_SECRET]);

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get("code");

    if (code) {
      fetchDiscordData(code);
    } else {
      const auth = getAuth();
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          const userRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(userRef);
          if (docSnap.exists()) {
            const userData = docSnap.data();
            setOsrsName(userData.osrsName);
            try {
              const memberCheck = await axios.get(
                `https://discord.com/api/guilds/${SERVER_ID}/members/${user.uid}`,
                {
                  headers: {
                    Authorization: `Bot ${BOT_TOKEN}`,
                  },
                }
              );
              if (memberCheck.status === 200) setIsMember(true);
            } catch {
              setIsMember(false);
            }
          }
          setLoading(false);
        }
      });
    }
  }, [BOT_TOKEN, fetchDiscordData]);

  useEffect(() => {
    const fetchEntries = async () => {
      if (!osrsName) return;

      try {
        const res = await axios.get(`/api/osrs-data?username=${osrsName}`);
        const data = res.data;

        const totalXP = data.totalXP || 0;
        const bossKC = data.totalBossKC ?? 0;

        const xpPoints = Math.floor(totalXP / 1_000_000);
        const kcPoints = Math.floor(bossKC / 20);

        setXpEntries(xpPoints);
        setKcEntries(kcPoints);
        setTotalEntries(xpPoints + kcPoints);
      } catch (e) {
        console.error("Failed to fetch hiscore data:", e);
      }
    };

    fetchEntries();
  }, [osrsName]);

  const handleJoinDiscord = () => {
    window.open("https://discord.gg/bJwkKKRPms", "_blank");
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", backgroundColor: "black", color: "yellow", height: "100vh" }}>
        <h1>Dashboard</h1>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div style={{ textAlign: "center", backgroundColor: "black", color: "yellow", height: "100vh" }}>
      <img src="/logo.png" alt="Logo" style={{ width: 80, marginTop: 30 }} />
      <h1>Dashboard</h1>
      <p>Welcome, {osrsName || "Adventurer"}!</p>

      {!isMember ? (
        <>
          <p style={{ color: "red" }}>❌ You are not in the Discord server.</p>
          <button
            onClick={handleJoinDiscord}
            style={{ padding: "10px", backgroundColor: "gold", color: "black", marginBottom: 20 }}
          >
            Join the Discord to Start Earning Entries
          </button>
        </>
      ) : (
        <p style={{ color: "lightgreen" }}>✅ You are in the Discord server!</p>
      )}

      <p>Total XP Entries: {xpEntries}</p>
      <p>Boss KC Entries: {kcEntries}</p>
      <h3>Total Entries: {totalEntries}</h3>

      <button
        onClick={() => router.push("/leaderboard")}
        style={{ padding: "10px", marginTop: 10, backgroundColor: "gold", color: "black" }}
      >
        View Leaderboard
      </button>
    </div>
  );
}
