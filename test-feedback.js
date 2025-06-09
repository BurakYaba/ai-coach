const { MongoClient } = require("mongodb");

async function addTestFeedback() {
  // Use the connection string from your .env.local file
  const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/fluenta";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db();
    const feedbackCollection = db.collection("feedbacks");

    // Sample feedback data
    const sampleFeedback = [
      {
        userId: new ObjectId(), // Random ObjectId for testing
        user: {
          name: "John Doe",
          email: "john@example.com",
        },
        rating: 5,
        category: "general",
        subject: "Great app!",
        message:
          "I love using this language learning app. The UI is intuitive and the lessons are very engaging. Keep up the great work!",
        status: "new",
        metadata: {
          userAgent:
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          currentPage: "/dashboard",
          deviceInfo: "1920x1080",
          appVersion: "1.0.0",
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: new ObjectId(),
        user: {
          name: "Jane Smith",
          email: "jane@example.com",
        },
        rating: 4,
        category: "features",
        subject: "Feature request: Dark mode",
        message:
          "Could you please add a dark mode option? It would be great for using the app in the evening.",
        status: "new",
        metadata: {
          userAgent:
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
          currentPage: "/dashboard/settings",
          deviceInfo: "1440x900",
          appVersion: "1.0.0",
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: new ObjectId(),
        user: {
          name: "Mike Johnson",
          email: "mike@example.com",
        },
        rating: 3,
        category: "bug_report",
        subject: "Audio playback issue",
        message:
          "Sometimes the audio doesn't play correctly in the listening exercises. It seems to happen randomly.",
        status: "in_review",
        metadata: {
          userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X)",
          currentPage: "/dashboard/listening",
          deviceInfo: "375x667",
          appVersion: "1.0.0",
        },
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        updatedAt: new Date(),
      },
    ];

    const result = await feedbackCollection.insertMany(sampleFeedback);
    console.log(`Inserted ${result.insertedCount} feedback entries`);
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await client.close();
  }
}

// Note: You'll need to import ObjectId
const { ObjectId } = require("mongodb");

addTestFeedback();
