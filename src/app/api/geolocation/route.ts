import { NextRequest, NextResponse } from "next/server";
import { extractGeolocationData } from "@/lib/language-detection";

export async function GET(request: NextRequest) {
  try {
    // Extract geolocation data from request headers
    const geoData = extractGeolocationData(request.headers);

    // Return the geolocation data
    return NextResponse.json(geoData);
  } catch (error) {
    console.error("Geolocation API error:", error);
    return NextResponse.json(
      { error: "Failed to get geolocation data" },
      { status: 500 }
    );
  }
}
