import fs from "fs";
import path from "path";

// Icon sizes needed for the app
const iconSizes = [
  { size: 72, filename: "icon-72x72.png" },
  { size: 96, filename: "icon-96x96.png" },
  { size: 128, filename: "icon-128x128.png" },
  { size: 144, filename: "icon-144x144.png" },
  { size: 152, filename: "icon-152x152.png" },
  { size: 180, filename: "apple-touch-icon.png" }, // Apple touch icon
  { size: 192, filename: "icon-192x192.png" },
  { size: 384, filename: "icon-384x384.png" },
  { size: 512, filename: "icon-512x512.png" },
];

// Generate SVG icon for each size
function generateIconSVG(size) {
  const padding = Math.max(8, size * 0.1);
  const logoSize = size - padding * 2;
  const fontSize = Math.max(12, logoSize * 0.4);

  return `
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#8b5cf6;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="text" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#ffffff;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#f1f5f9;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Background with rounded corners -->
  <rect width="${size}" height="${size}" rx="${size * 0.2}" ry="${size * 0.2}" fill="url(#bg)" />
  
  <!-- Fluenta text -->
  <text x="${size / 2}" y="${size / 2 + fontSize * 0.3}" 
        text-anchor="middle" 
        font-family="Arial, sans-serif" 
        font-weight="900" 
        font-size="${fontSize}" 
        fill="url(#text)">F</text>
        
  <!-- Small dot accent -->
  <circle cx="${size * 0.75}" cy="${size * 0.3}" r="${Math.max(2, size * 0.04)}" fill="#ffffff" opacity="0.8"/>
</svg>`.trim();
}

// Generate favicon ICO (contains multiple sizes)
function generateFaviconSVG() {
  return `
<svg width="48" height="48" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#8b5cf6;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <rect width="48" height="48" rx="8" ry="8" fill="url(#bg)" />
  <text x="24" y="32" text-anchor="middle" font-family="Arial" font-weight="900" font-size="28" fill="white">F</text>
  <circle cx="36" cy="14" r="2" fill="#ffffff" opacity="0.8"/>
</svg>`.trim();
}

async function generateIcons() {
  console.log("🎨 Starting icon generation...");

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const outputDir = path.join(process.cwd(), "public");

  // Create output directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Generate regular icons
  for (const icon of iconSizes) {
    try {
      console.log(
        `🖼️  Generating: ${icon.filename} (${icon.size}x${icon.size})`
      );

      const svg = generateIconSVG(icon.size);
      const svgDataUrl = `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;

      // Use a simple approach - create an API endpoint to convert SVG to PNG
      const url = new URL("/api/generate-icon", baseUrl);
      url.searchParams.set("svg", svgDataUrl);
      url.searchParams.set("size", icon.size.toString());

      const response = await fetch(url.toString());

      if (!response.ok) {
        // Fallback: save as SVG if PNG conversion fails
        console.log(
          `⚠️  PNG conversion failed for ${icon.filename}, saving as SVG`
        );
        const svgPath = path.join(
          outputDir,
          icon.filename.replace(".png", ".svg")
        );
        fs.writeFileSync(svgPath, svg);
        continue;
      }

      const buffer = await response.arrayBuffer();
      const filePath = path.join(outputDir, icon.filename);

      fs.writeFileSync(filePath, Buffer.from(buffer));
      console.log(`✅ Generated: ${filePath}`);
    } catch (error) {
      console.error(`❌ Error generating ${icon.filename}:`, error.message);

      // Fallback: create SVG version
      const svg = generateIconSVG(icon.size);
      const svgPath = path.join(
        outputDir,
        icon.filename.replace(".png", ".svg")
      );
      fs.writeFileSync(svgPath, svg);
      console.log(`📝 Created SVG fallback: ${svgPath}`);
    }
  }

  // Generate favicon.ico
  try {
    console.log("🎯 Generating favicon.ico...");

    const faviconSvg = generateFaviconSVG();
    const svgDataUrl = `data:image/svg+xml;base64,${Buffer.from(faviconSvg).toString("base64")}`;

    const url = new URL("/api/generate-icon", baseUrl);
    url.searchParams.set("svg", svgDataUrl);
    url.searchParams.set("size", "48");
    url.searchParams.set("format", "ico");

    const response = await fetch(url.toString());

    if (response.ok) {
      const buffer = await response.arrayBuffer();
      const faviconPath = path.join(outputDir, "favicon.ico");
      fs.writeFileSync(faviconPath, Buffer.from(buffer));
      console.log(`✅ Generated: ${faviconPath}`);
    } else {
      // Fallback: create a simple PNG favicon
      const response2 = await fetch(
        url.toString().replace("format=ico", "format=png")
      );
      if (response2.ok) {
        const buffer = await response2.arrayBuffer();
        const faviconPath = path.join(outputDir, "favicon.png");
        fs.writeFileSync(faviconPath, Buffer.from(buffer));
        console.log(`✅ Generated PNG favicon: ${faviconPath}`);
      }
    }
  } catch (error) {
    console.error("❌ Error generating favicon:", error.message);

    // Fallback: create SVG favicon
    const faviconSvg = generateFaviconSVG();
    const faviconPath = path.join(outputDir, "favicon.svg");
    fs.writeFileSync(faviconPath, faviconSvg);
    console.log(`📝 Created SVG favicon: ${faviconPath}`);
  }

  console.log("🎉 Icon generation complete!");

  // Generate icon preview HTML
  generateIconPreview(iconSizes);
}

function generateIconPreview(icons) {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Fluenta Icons Preview</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
        h1 { color: #3b82f6; text-align: center; }
        .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-top: 20px; }
        .card { background: white; border-radius: 12px; padding: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); text-align: center; }
        .card h3 { margin: 0 0 15px 0; color: #1e293b; font-size: 14px; }
        .card img { max-width: 100px; max-height: 100px; border-radius: 8px; border: 1px solid #e2e8f0; }
        .dimensions { color: #64748b; font-size: 12px; margin-top: 8px; }
        .favicon-section { background: white; border-radius: 12px; padding: 20px; margin: 20px 0; }
    </style>
</head>
<body>
    <h1>Fluenta App Icons</h1>
    <p style="text-align: center; color: #64748b;">Generated icons for PWA and mobile installation</p>
    
    <div class="favicon-section">
        <h2>Favicon</h2>
        <div style="display: flex; align-items: center; gap: 20px;">
            <img src="/favicon.ico" alt="Favicon" style="width: 32px; height: 32px;" />
            <div>
                <strong>favicon.ico</strong><br>
                <span style="color: #64748b;">Used in browser tabs and bookmarks</span>
            </div>
        </div>
    </div>
    
    <div class="grid">
        ${icons
          .map(
            icon => `
            <div class="card">
                <h3>${icon.filename}</h3>
                <img src="/${icon.filename}" alt="${icon.filename}" />
                <div class="dimensions">${icon.size}×${icon.size}px</div>
            </div>
        `
          )
          .join("")}
    </div>
    
    <div style="margin-top: 40px; padding: 20px; background: white; border-radius: 12px;">
        <h2>Usage</h2>
        <p>These icons are automatically used by:</p>
        <ul>
            <li><strong>PWA Manifest</strong>: For app installation on mobile devices</li>
            <li><strong>Apple Touch Icon</strong>: When users add to iOS home screen</li>
            <li><strong>Favicon</strong>: Browser tabs and bookmarks</li>
            <li><strong>Android Icons</strong>: Various densities for Android devices</li>
        </ul>
    </div>
</body>
</html>`;

  const previewPath = path.join(process.cwd(), "public", "icons-preview.html");
  fs.writeFileSync(previewPath, html);
  console.log(`📋 Preview file created: ${previewPath}`);
  console.log(`🌐 View at: http://localhost:3000/icons-preview.html`);
}

// Run the generator
generateIcons().catch(console.error);
