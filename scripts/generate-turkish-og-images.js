const { createCanvas, loadImage, registerFont } = require("canvas");
const fs = require("fs");
const path = require("path");

// Turkish OG image configurations
const ogImages = [
  {
    filename: "og-home-tr.png",
    title: "Fluenta - AI Destekli İngilizce Öğrenme Platformu",
    subtitle: "Yapay zeka ile İngilizce'de ustalaşın",
    gradient: ["#3b82f6", "#8b5cf6"],
    textColor: "#ffffff",
  },
  {
    filename: "og-blog-tr.png",
    title: "İngilizce Öğrenme Blog - Fluenta",
    subtitle: "AI destekli stratejiler ve uzman ipuçları",
    gradient: ["#ffffff", "#f8fafc"],
    textColor: "#1e293b",
    accentColor: "#3b82f6",
  },
  {
    filename: "og-pricing-tr.png",
    title: "Fiyatlandırma - Fluenta",
    subtitle: "Size uygun planı seçin - 7 gün ücretsiz",
    gradient: ["#1e293b", "#475569"],
    textColor: "#ffffff",
    priceHighlight: "₺149 - ₺249",
  },
  {
    filename: "og-about-tr.png",
    title: "Hakkımızda - Fluenta",
    subtitle: "İngilizce öğrenmenin geleceğini şekillendiriyoruz",
    gradient: ["#f8fafc", "#e2e8f0"],
    textColor: "#1e293b",
    accentColor: "#3b82f6",
  },
  {
    filename: "og-contact-tr.png",
    title: "İletişim - Fluenta",
    subtitle: "Size nasıl yardımcı olabiliriz?",
    gradient: ["#ffffff", "#f1f5f9"],
    textColor: "#334155",
    accentColor: "#3b82f6",
  },
  {
    filename: "og-faq-tr.png",
    title: "Sık Sorulan Sorular - Fluenta",
    subtitle: "Merak ettiklerinizin yanıtları",
    gradient: ["#f8fafc", "#e2e8f0"],
    textColor: "#1e293b",
    accentColor: "#3b82f6",
  },
  {
    filename: "og-ai-learning-tr.png",
    title: "AI ile İngilizce Öğrenme - Fluenta Blog",
    subtitle: "Geleceğin eğitim yöntemi",
    gradient: ["#1e293b", "#3b82f6"],
    textColor: "#ffffff",
    futuristic: true,
  },
];

// Create gradient
function createGradient(ctx, colors, width, height) {
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, colors[0]);
  gradient.addColorStop(1, colors[1]);
  return gradient;
}

// Wrap text to fit within specified width
function wrapText(ctx, text, maxWidth) {
  const words = text.split(" ");
  const lines = [];
  let currentLine = words[0];

  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    const width = ctx.measureText(currentLine + " " + word).width;
    if (width < maxWidth) {
      currentLine += " " + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  lines.push(currentLine);
  return lines;
}

// Generate Turkish flag accent
function drawTurkishAccent(ctx, x, y, size = 30) {
  // Turkish flag colors
  const red = "#E30A17";

  // Draw small Turkish flag accent
  ctx.fillStyle = red;
  ctx.fillRect(x, y, size * 1.5, size);

  // Draw crescent and star (simplified)
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.arc(x + size * 0.4, y + size * 0.5, size * 0.15, 0, 2 * Math.PI);
  ctx.fill();

  // Draw star (simplified as a small circle)
  ctx.beginPath();
  ctx.arc(x + size * 0.8, y + size * 0.5, size * 0.08, 0, 2 * Math.PI);
  ctx.fill();
}

// Generate AI brain icon
function drawAIBrain(ctx, x, y, size = 40, color = "#ffffff") {
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 3;

  // Brain outline
  ctx.beginPath();
  ctx.ellipse(x, y, size * 0.6, size * 0.4, 0, 0, 2 * Math.PI);
  ctx.stroke();

  // Neural connections
  for (let i = 0; i < 6; i++) {
    const angle = (i * Math.PI) / 3;
    const startX = x + Math.cos(angle) * size * 0.3;
    const startY = y + Math.sin(angle) * size * 0.2;
    const endX = x + Math.cos(angle) * size * 0.5;
    const endY = y + Math.sin(angle) * size * 0.3;

    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();

    // Small circles at connection points
    ctx.beginPath();
    ctx.arc(endX, endY, 2, 0, 2 * Math.PI);
    ctx.fill();
  }
}

async function generateTurkishOGImage(config) {
  const width = 1200;
  const height = 630;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  // Create background gradient
  const gradient = createGradient(ctx, config.gradient, width, height);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // Add subtle pattern for texture
  ctx.globalAlpha = 0.1;
  for (let i = 0; i < 50; i++) {
    ctx.fillStyle = config.textColor;
    ctx.beginPath();
    ctx.arc(
      Math.random() * width,
      Math.random() * height,
      Math.random() * 3 + 1,
      0,
      2 * Math.PI
    );
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  // Add Turkish accent for Turkish-specific images
  if (config.filename.includes("-tr")) {
    drawTurkishAccent(ctx, width - 100, 30);
  }

  // Add AI brain for AI-related images
  if (config.futuristic) {
    drawAIBrain(ctx, width - 100, height - 100, 50, config.textColor);
  }

  // Set up text styling
  ctx.fillStyle = config.textColor;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  // Main title
  ctx.font = "bold 64px Arial, sans-serif";
  const titleLines = wrapText(ctx, config.title, width - 100);
  const titleStartY = height / 2 - titleLines.length * 35;

  titleLines.forEach((line, index) => {
    ctx.fillText(line, width / 2, titleStartY + index * 70);
  });

  // Subtitle
  ctx.font = "36px Arial, sans-serif";
  ctx.fillStyle = config.accentColor || config.textColor;
  ctx.globalAlpha = 0.9;

  const subtitleLines = wrapText(ctx, config.subtitle, width - 100);
  const subtitleStartY = titleStartY + titleLines.length * 70 + 40;

  subtitleLines.forEach((line, index) => {
    ctx.fillText(line, width / 2, subtitleStartY + index * 45);
  });

  // Add price highlight for pricing page
  if (config.priceHighlight) {
    ctx.font = "bold 42px Arial, sans-serif";
    ctx.fillStyle = "#10b981"; // Green for pricing
    ctx.globalAlpha = 1;
    ctx.fillText(
      config.priceHighlight,
      width / 2,
      subtitleStartY + subtitleLines.length * 45 + 60
    );
  }

  // Add Fluenta logo text
  ctx.font = "bold 32px Arial, sans-serif";
  ctx.fillStyle = config.textColor;
  ctx.globalAlpha = 0.8;
  ctx.textAlign = "left";
  ctx.fillText("Fluenta", 50, height - 50);

  // Add Turkish market indicator
  ctx.font = "24px Arial, sans-serif";
  ctx.fillStyle = config.accentColor || config.textColor;
  ctx.globalAlpha = 0.7;
  ctx.textAlign = "right";
  ctx.fillText("Türkiye", width - 50, height - 50);

  return canvas;
}

async function generateAllTurkishOGImages() {
  const outputDir = path.join(__dirname, "..", "public", "og-images");

  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log("🇹🇷 Generating Turkish OG images...");

  for (const config of ogImages) {
    try {
      console.log(`Generating ${config.filename}...`);
      const canvas = await generateTurkishOGImage(config);
      const buffer = canvas.toBuffer("image/png");
      const outputPath = path.join(outputDir, config.filename);

      fs.writeFileSync(outputPath, buffer);
      console.log(`✅ Generated ${config.filename}`);
    } catch (error) {
      console.error(`❌ Error generating ${config.filename}:`, error);
    }
  }

  console.log("🎉 Turkish OG image generation complete!");
}

// Run the generation
if (require.main === module) {
  generateAllTurkishOGImages().catch(console.error);
}

module.exports = { generateAllTurkishOGImages };
