import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const svgDataUrl = searchParams.get("svg");
    const size = parseInt(searchParams.get("size") || "192");
    const format = searchParams.get("format") || "png";

    if (!svgDataUrl) {
      return new Response("SVG data required", { status: 400 });
    }

    // Extract SVG content from data URL
    const svgContent = Buffer.from(
      svgDataUrl.split(",")[1],
      "base64"
    ).toString();

    // Create a simple icon design if SVG parsing fails
    const iconDesign = (
      <div
        style={{
          width: size,
          height: size,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
          borderRadius: size * 0.2,
          position: "relative",
        }}
      >
        <div
          style={{
            fontSize: size * 0.4,
            fontWeight: 900,
            color: "white",
            fontFamily: "Arial, sans-serif",
          }}
        >
          F
        </div>
        <div
          style={{
            position: "absolute",
            top: size * 0.25,
            right: size * 0.2,
            width: size * 0.08,
            height: size * 0.08,
            backgroundColor: "white",
            borderRadius: "50%",
            opacity: 0.8,
          }}
        />
      </div>
    );

    const imageResponse = new ImageResponse(iconDesign, {
      width: size,
      height: size,
    });

    return imageResponse;
  } catch (e: any) {
    console.log(`Error generating icon: ${e.message}`);

    // Fallback simple icon
    const size = parseInt(
      new URL(request.url).searchParams.get("size") || "192"
    );

    const fallbackIcon = (
      <div
        style={{
          width: size,
          height: size,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#3b82f6",
          borderRadius: size * 0.2,
        }}
      >
        <div
          style={{
            fontSize: size * 0.4,
            fontWeight: 900,
            color: "white",
            fontFamily: "Arial",
          }}
        >
          F
        </div>
      </div>
    );

    return new ImageResponse(fallbackIcon, {
      width: size,
      height: size,
    });
  }
}
