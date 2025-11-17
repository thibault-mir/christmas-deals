// app/api/deals/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

type AuthUser = {
  userId: string;
  email?: string;
  name?: string | null;
};

export async function GET(request: Request) {
  try {
    // Récupérer éventuellement l'utilisateur
    let currentUserId: string | null = null;

    const cookieHeader = request.headers.get("cookie") || "";
    const tokenMatch = cookieHeader.match(/auth-token=([^;]+)/);
    const token = tokenMatch?.[1];

    if (token) {
      try {
        const userData = (await verifyToken(token)) as AuthUser | null;
        if (userData?.userId) {
          currentUserId = userData.userId;
        }
      } catch {
        // pas grave, on considère juste qu'il n'est pas identifié
      }
    }

    const now = new Date();

    const auctions = await prisma.auction.findMany({
      where: {
        status: "ACTIVE",
        startsAt: { lte: now },
        endsAt: { gt: now },
      },
      include: {
        product: true,
        bids: {
          orderBy: { createdAt: "desc" },
          take: 1, // dernier bid (le leader)
          select: { userId: true },
        },
      },
      orderBy: {
        endsAt: "asc",
      },
    });

    const payload = auctions.map((a) => {
      const topBidUserId = a.bids[0]?.userId ?? null;
      const isLeadingForCurrentUser =
        currentUserId !== null &&
        topBidUserId !== null &&
        currentUserId === topBidUserId;

      return {
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
        isLeadingForCurrentUser,
      };
    });

    return NextResponse.json(payload);
  } catch (err) {
    console.error("Erreur /api/deals:", err);
    return NextResponse.json(
      { error: "Erreur lors du chargement des enchères" },
      { status: 500 }
    );
  }
}
