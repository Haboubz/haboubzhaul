const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

exports.incrementEntry = functions.https.onRequest(async (req, res) => {
    // Check if Authorization header exists
    if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
        return res.status(403).json({ error: 'Unauthorized - Missing Token' });
    }

    let idToken = req.headers.authorization.split('Bearer ')[1];

    try {
        // Verify the Firebase Authentication Token
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const userEmail = decodedToken.email;

        if (!userEmail) {
            return res.status(400).json({ error: 'User email is required' });
        }

        const userRef = admin.firestore().collection("Users").doc(userEmail);
        const userDoc = await userRef.get();

        if (userDoc.exists) {
            return res.status(400).json({ error: 'You have already submitted an entry!' });
        }

        await userRef.set({ entries: 1 });
        return res.json({ success: true, message: "Entry count updated successfully!" });

    } catch (error) {
        console.error("Error verifying token:", error);
        return res.status(401).json({ error: 'Invalid or Expired Token' });
    }
});
