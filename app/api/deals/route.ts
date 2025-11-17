// app/api/deals/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const now = new Date();

    const auctions = await prisma.auction.findMany({
      where: {
        status: "ACTIVE",
        startsAt: { lte: now },
        endsAt: { gt: now },
      },
      include: {
        product: true,
      },
      orderBy: {
        endsAt: "asc",
      },
    });

    const payload = auctions.map((a) => ({
      id: a.id,
      name: a.product.name,
      description: a.product.description,
      condition: a.product.condition,
      category: a.product.category,
      imageUrl: a.product.imageUrl,
      currentPrice: Number(a.currentPrice),
      startingPrice: Number(a.startingPrice),
      bidStep: Number(a.bidStep),
      endsAt: a.endsAt.toISOString(),
    }));

    return NextResponse.json(payload);
  } catch (error) {
    console.error("Erreur /api/deals:", error);
    return NextResponse.json(
      { error: "Impossible de charger les deals" },
      { status: 500 }
    );
  }
}
