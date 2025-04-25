import mongoose from "mongoose";
import { NextResponse } from "next/server";

/**
 * Validates a MongoDB ObjectId
 * @param id The ID to validate
 * @returns Boolean indicating if the ID is valid
 */
export function isValidObjectId(id: string): boolean {
  return mongoose.Types.ObjectId.isValid(id);
}

/**
 * Standard error handler for Reading API routes
 * @param error The error object
 * @param message Optional custom message
 * @returns NextResponse with appropriate error details
 */
export function handleApiError(
  error: unknown,
  message = "Internal server error"
): NextResponse {
  console.error(`Reading API error: ${message}`, error);
  return NextResponse.json(
    {
      error: message,
      details: error instanceof Error ? error.message : "Unknown error",
    },
    { status: 500 }
  );
}

/**
 * Calculates reading level score based on CEFR level
 * @param level CEFR level (A1, A2, B1, B2, C1, C2)
 * @returns Numeric score (1-10)
 */
export function getReadingLevelScore(level: string): number {
  const levelScores: Record<string, number> = {
    A1: 1,
    A2: 3,
    B1: 5,
    B2: 7,
    C1: 9,
    C2: 10,
  };
  return levelScores[level] || 5; // Default to B1 (5) if unknown
}

/**
 * Calculates complexity score based on CEFR level
 * @param level CEFR level (A1, A2, B1, B2, C1, C2)
 * @returns Complexity score (1-10)
 */
export function getReadingComplexityScore(level: string): number {
  const levelComplexity: Record<string, number> = {
    A1: 2,
    A2: 3,
    B1: 5,
    B2: 7,
    C1: 9,
    C2: 10,
  };
  return levelComplexity[level] || 5; // Default to B1 (5) if unknown
}

/**
 * Generate cache control headers for GET requests
 * @param maxAge Maximum age in seconds
 * @returns Headers object with Cache-Control header
 */
export function getCacheHeaders(maxAge = 60): Headers {
  const headers = new Headers();
  headers.set("Cache-Control", `s-maxage=${maxAge}, stale-while-revalidate`);
  return headers;
}

/**
 * Simple in-memory cache for reading sessions
 * Resets on server restart, but avoids duplicate database queries during a session
 */
interface CacheEntry {
  timestamp: number;
  data: any;
}

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes in milliseconds
const sessionCache = new Map<string, CacheEntry>();

/**
 * Get item from cache if it exists and is not expired
 * @param key Cache key
 * @returns Cached item or null if not found/expired
 */
export function getCachedItem(key: string): any {
  if (sessionCache.has(key)) {
    const entry = sessionCache.get(key);
    if (entry && Date.now() - entry.timestamp < CACHE_TTL) {
      return entry.data;
    }
  }
  return null;
}

/**
 * Set item in cache
 * @param key Cache key
 * @param data Data to cache
 */
export function setCacheItem(key: string, data: any): void {
  sessionCache.set(key, {
    timestamp: Date.now(),
    data,
  });
}

/**
 * Clean expired items from cache
 * Called automatically on a timer
 */
function cleanupCache(): void {
  const now = Date.now();
  Array.from(sessionCache.entries()).forEach(([key, entry]) => {
    if (now - entry.timestamp > CACHE_TTL) {
      sessionCache.delete(key);
    }
  });
}

// Run cleanup every 10 minutes
setInterval(cleanupCache, 10 * 60 * 1000);
