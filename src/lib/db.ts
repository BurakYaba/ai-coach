import mongoose from "mongoose";

// Define the interface for the cached mongoose connection
interface CachedConnection {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
  isEventsRegistered?: boolean; // Add this flag to track if events are registered
}

// Define the global type for mongoose cache
declare global {
  var mongoose: CachedConnection | undefined;
}

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
const cached: CachedConnection = global.mongoose || {
  conn: null,
  promise: null,
  isEventsRegistered: false, // Initialize the flag
};

// Initialize the cached connection if it doesn't exist
if (!global.mongoose) {
  global.mongoose = cached;
}

// Set the maximum number of listeners to avoid memory leak warnings
mongoose.connection.setMaxListeners(20);

// Register event listeners only once
if (!cached.isEventsRegistered) {
  // Handle connection events
  mongoose.connection.on("connected", () => {
    console.log("MongoDB connection established");
  });

  mongoose.connection.on("error", err => {
    console.error("MongoDB connection error:", err);
  });

  mongoose.connection.on("disconnected", () => {
    console.log("MongoDB connection disconnected");
  });

  // Handle process termination
  const gracefulShutdown = () => {
    mongoose.connection.close(false).then(() => {
      console.log("MongoDB connection closed through app termination");
      process.exit(0);
    });
  };

  // Only add these event listeners once
  if (process.env.NODE_ENV !== "test") {
    process.on("SIGINT", gracefulShutdown);
    process.on("SIGTERM", gracefulShutdown);
  }

  // Mark event listeners as registered
  cached.isEventsRegistered = true;
}

export async function dbConnect() {
  if (cached.conn) {
    // Return immediately if we already have a connection
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      // Add connection pool options
      maxPoolSize: 10,
      minPoolSize: 5,
      socketTimeoutMS: 30000,
      connectTimeoutMS: 5000,
      serverSelectionTimeoutMS: 5000,
      heartbeatFrequencyMS: 10000,
    };

    cached.promise = mongoose.connect(MONGODB_URI!, opts).then(mongoose => {
      console.log("MongoDB connected successfully");
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error("MongoDB connection error:", e);
    throw e;
  }

  return cached.conn;
}

export default dbConnect;
