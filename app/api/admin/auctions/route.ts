// app/api/admin/auctions/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const auctions = await prisma.auction.findMany({
      select: {
        id: true,
        startingPrice: true,
        currentPrice: true,
        status: true,
        startsAt: true,
        endsAt: true,
        product: {
          select: {
            name: true,
          },
        },
        _count: {
          select: {
            bids: true,
          },
        },
        // Récupère la meilleure enchère avec l'utilisateur
        bids: {
          select: {
            amount: true,
            user: {
              select: {
                id: true,
                email: true,
                name: true,
              },
            },
            createdAt: true,
          },
          orderBy: {
            amount: "desc",
          },
          take: 1, // Prend seulement la meilleure enchère
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Formate les données pour inclure le meilleur enchérisseur
    const auctionsWithTopBidder = auctions.map((auction) => ({
      ...auction,
      topBidder:
        auction.bids.length > 0
          ? {
              user: auction.bids[0].user,
              amount: auction.bids[0].amount,
              bidAt: auction.bids[0].createdAt,
            }
          : null,
    }));

    return NextResponse.json({ auctions: auctionsWithTopBidder });
  } catch (error) {
    console.error("Error fetching auctions:", error);
    return NextResponse.json(
      { error: "Error fetching auctions" },
      { status: 500 }
    );
  }
}
