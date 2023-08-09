const functions = require("@google-cloud/functions-framework");
const admin = require("firebase-admin");
const serviceAccountKey = require("./service-account-key.json");

// Initialize the Firestore admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccountKey),
});

// Create a reference to the Firestore collection
const leaderboardCollection = admin.firestore().collection("Score");

// Define the routes for leaderboard operations
functions.http("get-data-by-name", async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");

  if (req.method === "OPTIONS") {
    res.set("Access-Control-Allow-Methods", "GET");
    res.set("Access-Control-Allow-Headers", "Content-Type");
    res.set("Access-Control-Max-Age", "3600");
    res.status(204).send("");
  } else {
    const { name } = req.body;

    const query = leaderboardCollection.where("name", "==", name);

    try {
      const snapshot = await query.get();
      const leaderboardData = snapshot.docs.map((doc) => doc.data());
      res.json({ data: leaderboardData });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "Failed to retrieve leaderboard data", error });
    }
  }
});
