const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors")({ origin: true });

admin.initializeApp();
const db = admin.firestore();

exports.incrementEntry = functions.https.onRequest(async (req, res) => {
    cors(req, res, async () => {
        if (req.method !== "POST") {
            return res.status(405).send({ error: "Method Not Allowed" });
        }

        try {
            const { username, userEmail } = req.body;

            if (!username || !userEmail) {
                return res.status(400).send({ error: "Missing username or email" });
            }

            // Log request for debugging
            console.log(`Processing entry for: ${username} (${userEmail})`);

            // Reference to user entry
            const userRef = db.collection("entries").doc(userEmail);
            const doc = await userRef.get();

            // If user already exists, prevent duplicate entries
            if (doc.exists) {
                console.log(`Duplicate entry detected for ${userEmail}`);
                return res.status(400).send({ error: "You have already submitted an entry!" });
            }

            // Save new entry
            await userRef.set({
                username: username,
                email: userEmail,
                entries: 1,
                timestamp: admin.firestore.FieldValue.serverTimestamp(),
            });

            console.log(`Entry recorded for ${username}`);

            // Redirect to leaderboard after successful entry
            return res.status(200).send({ success: true, redirect: "/leaderboard" });
        } catch (error) {
            console.error("Error processing entry:", error);
            return res.status(500).send({ error: "Internal Server Error" });
        }
    });
});

// Function to retrieve leaderboard data
exports.getLeaderboard = functions.https.onRequest(async (req, res) => {
    cors(req, res, async () => {
        try {
            const snapshot = await db.collection("entries").orderBy("entries", "desc").get();
            const leaderboard = [];

            snapshot.forEach(doc => {
                leaderboard.push({
                    username: doc.data().username,
                    entries: doc.data().entries || 1,
                });
            });

            return res.status(200).json(leaderboard);
        } catch (error) {
            console.error("Error fetching leaderboard:", error);
            return res.status(500).send({ error: "Internal Server Error" });
        }
    });
});
