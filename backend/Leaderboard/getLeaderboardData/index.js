const functions = require("@google-cloud/functions-framework");
const admin = require("firebase-admin");
const { Timestamp } = require("firebase-admin/firestore");

const serviceAccountKey = require("./service-account-key.json");

// Initialize the Firestore admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccountKey),
});

// Create a reference to the Firestore collection
const leaderboardCollection = admin.firestore().collection("Score");

// Define the route for leaderboard operations
functions.http("get-leaderboard-data", async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");

  if (req.method === "OPTIONS") {
    res.set("Access-Control-Allow-Methods", "GET");
    res.set("Access-Control-Allow-Headers", "Content-Type");
    res.set("Access-Control-Max-Age", "3600");
    res.status(204).send("");
  } else {
    // Extract parameters from the body
    const { entity_type, category, time_frame } = req.body;

    // Apply filter by the "entity_type" key
    let query = leaderboardCollection.where("entity_type", "==", entity_type);

    // Apply filter by the "category" key
    if (category !== "all") {
      query = query.where("category", "==", category);
    }

    // Apply filter by the "time_frame" key
    if (time_frame === "daily") {
      const today = new Date();
      const startOfDay = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        0,
        0,
        0,
        0
      );
      query = query.where("timestamp", ">=", Timestamp.fromDate(startOfDay));
    } else if (time_frame === "weekly") {
      const today = new Date();
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      query = query.where("timestamp", ">=", Timestamp.fromDate(weekAgo));
    } else if (time_frame === "monthly") {
      const today = new Date();
      const monthAgo = new Date(
        today.getFullYear(),
        today.getMonth() - 1,
        today.getDate(),
        0,
        0,
        0,
        0
      );
      query = query.where("timestamp", ">=", Timestamp.fromDate(monthAgo));
    }

    try {
      // Execute the query and retrieve the snapshot of documents
      const snapshot = await query.get();
      const leaderboardData = snapshot.docs.map((doc) => doc.data());

      // Sort the data based on the score in descending order
      leaderboardData.sort((a, b) => b.score - a.score);

      res.json({ total: leaderboardData.length, result: leaderboardData });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Failed to retrieve leaderboard data", error });
    }
  }
});
