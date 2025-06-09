import fs from "fs";
import path from "path";

async function createFavicon() {
  console.log("🎯 Creating favicon...");

  // Simple favicon SVG
  const faviconSvg = `
<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#8b5cf6;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="32" height="32" rx="6" ry="6" fill="url(#bg)" />
  <text x="16" y="23" text-anchor="middle" font-family="Arial" font-weight="900" font-size="18" fill="white">F</text>
  <circle cx="24" cy="9" r="1.5" fill="#ffffff" opacity="0.8"/>
</svg>`.trim();

  // Save favicon as SVG (modern browsers support this)
  const faviconPath = path.join(process.cwd(), "public", "favicon.svg");
  fs.writeFileSync(faviconPath, faviconSvg);
  console.log(`✅ Created: ${faviconPath}`);

  // Also create a simple ICO fallback
  const icoContent = `
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="icon" type="image/png" href="/icon-192x192.svg">`;

  console.log(
    "✅ Favicon created! Using SVG format for modern browser support."
  );
  console.log(
    "📝 To use: Add <link rel='icon' href='/favicon.svg'> to your HTML head"
  );
}

createFavicon().catch(console.error);
