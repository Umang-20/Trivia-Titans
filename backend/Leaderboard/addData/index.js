const functions = require("@google-cloud/functions-framework");
const admin = require("firebase-admin");
const serviceAccountKey = require("./service-account-key.json");

// Initialize the Firestore admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Create a reference to the Firestore collection
const leaderboardCollection = admin.firestore().collection("Score");

// Define the routes for leaderboard operations
functions.http("add-score", async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");

  if (req.method === "OPTIONS") {
    res.set("Access-Control-Allow-Methods", "GET");
    res.set("Access-Control-Allow-Headers", "Content-Type");
    res.set("Access-Control-Max-Age", "3600");
    res.status(204).send("");
  } else {
    const { entity_type, category, name, email, right_answers, wrong_answers } =
      req.body;

    if (
      !entity_type ||
      !name ||
      !category ||
      !email ||
      !right_answers ||
      !wrong_answers
    ) {
      res.status(400).json({ error: "Missing paramters in the request body" });
      return;
    }

    try {
      const timestamp = admin.firestore.Timestamp.now();
      const score = 2 * right_answers - wrong_answers;

      const resp = await leaderboardCollection.add({
        entity_type,
        name,
        email,
        category,
        score,
        timestamp,
        right_answers,
        wrong_answers,
      });
      res
        .status(200)
        .json({ message: "Leaderboard entry added successfully", resp });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Failed to add leaderboard entry", error });
    }
  }
});
