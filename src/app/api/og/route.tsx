import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const title =
      searchParams.get("title") || "Fluenta - AI-Powered English Learning";
    const description =
      searchParams.get("description") ||
      "Master English with personalized AI tutoring";

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#0f172a",
            background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
            position: "relative",
          }}
        >
          {/* Background Pattern */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: `radial-gradient(circle at 25% 25%, #3b82f6 0%, transparent 50%),
                               radial-gradient(circle at 75% 75%, #8b5cf6 0%, transparent 50%)`,
              opacity: 0.1,
            }}
          />

          {/* Logo */}
          <div
            style={{
              fontSize: 64,
              fontWeight: 900,
              background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
              backgroundClip: "text",
              color: "transparent",
              marginBottom: 32,
            }}
          >
            Fluenta
          </div>

          {/* Title */}
          <div
            style={{
              fontSize: title.length > 50 ? 40 : 48,
              fontWeight: 700,
              color: "#ffffff",
              textAlign: "center",
              maxWidth: "80%",
              lineHeight: 1.2,
              marginBottom: 16,
            }}
          >
            {title}
          </div>

          {/* Description */}
          <div
            style={{
              fontSize: 24,
              color: "#94a3b8",
              textAlign: "center",
              maxWidth: "70%",
              lineHeight: 1.4,
            }}
          >
            {description}
          </div>

          {/* Bottom Badge */}
          <div
            style={{
              position: "absolute",
              bottom: 40,
              right: 40,
              background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
              color: "white",
              padding: "12px 24px",
              borderRadius: 25,
              fontSize: 18,
              fontWeight: 600,
            }}
          >
            AI-Powered Learning
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    console.log(`Error generating OG image: ${e.message}`);
    return new Response(`Failed to generate image`, {
      status: 500,
    });
  }
}
