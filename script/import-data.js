/* eslint-disable @typescript-eslint/no-require-imports */
// scripts/import-data.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Charge ton JSON
const excelData = require("./data.json");

async function importData() {
  try {
    console.log("🚀 Starting import of", excelData.length, "items...");
    // Ajoute dans la boucle

    for (const [index, item] of excelData.entries()) {
      if (index > 0 && index % 10 === 0) {
        await new Promise((resolve) => setTimeout(resolve, 100)); // 100ms pause
      }
      try {
        // 1. Créer le Product
        const product = await prisma.product.create({
          data: {
            name: item.name,
            description: item.description,
            condition: item.condition,
            imageUrl: item.imageUrl,
            category: item.category,
          },
        });

        // 2. Créer l'Auction liée
        await prisma.auction.create({
          data: {
            productId: product.id,
            estimatePrice: parseFloat(item.estimatePrice),
            startingPrice: parseFloat(item.startingPrice),
            currentPrice: parseFloat(item.currentPrice),
            bidStep: parseFloat(item.bidStep),
            status: item.status,
            startsAt: new Date(item.startsAt),
            endsAt: new Date(item.endsAt),
          },
        });

        console.log(`✅ [${index + 1}/${excelData.length}] ${item.name}`);
      } catch (error) {
        console.error(`❌ [${index + 1}] Failed: ${item.name}`, error.message);
      }
    }

    console.log("🎉 Import completed successfully!");
  } catch (error) {
    console.error("❌ Fatal error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

importData();
