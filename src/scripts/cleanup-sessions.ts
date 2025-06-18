#!/usr/bin/env tsx

/**
 * Session Cleanup Script
 *
 * This script cleans up expired and inactive sessions from the database.
 * It should be run periodically as a cron job to maintain database hygiene.
 *
 * Usage:
 * - Development: npm run cleanup:sessions
 * - Production: node dist/scripts/cleanup-sessions.js
 * - Cron: 0 2 * * * /usr/bin/node /path/to/app/dist/scripts/cleanup-sessions.js
 */

import dbConnect from "../lib/db";
import { cleanupExpiredSessions } from "../lib/session-manager";

async function main() {
  try {
    console.log("Starting session cleanup...");
    console.log(`Timestamp: ${new Date().toISOString()}`);

    // Connect to database
    await dbConnect();
    console.log("Connected to database");

    // Clean up expired sessions
    const cleanedCount = await cleanupExpiredSessions();

    console.log(`Session cleanup completed:`);
    console.log(`- Cleaned up ${cleanedCount} expired/inactive sessions`);
    console.log(`- Cleanup finished at: ${new Date().toISOString()}`);

    process.exit(0);
  } catch (error) {
    console.error("Session cleanup failed:", error);
    process.exit(1);
  }
}

// Run the cleanup if this script is executed directly
if (require.main === module) {
  main();
}

export default main;
