/* eslint-disable @typescript-eslint/no-wrapper-object-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/user/stats/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    // Récupère le token depuis les cookies
    const cookieHeader = request.headers.get("cookie");
    const token = cookieHeader?.match(/auth-token=([^;]+)/)?.[1];

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Vérifie le token
    const decoded = (await verifyToken(token)) as any;

    if (!decoded || !decoded.userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const userId = decoded.userId;

    // Récupère les stats en parallèle pour plus de performance
    const [bidsCount, favoritesCount, leadingDealsCount] = await Promise.all([
      // Nombre de bids placés
      prisma.bid.count({
        where: { userId },
      }),

      // Nombre de favoris
      prisma.favorite.count({
        where: { userId },
      }),

      // Nombre de deals où l'utilisateur est le meilleur enchérisseur - VERSION OPTIMISÉE
      prisma.$queryRaw<[{ count: BigInt }]>`
        SELECT COUNT(DISTINCT a.id) 
        FROM "Auction" a
        INNER JOIN "Bid" b ON a.id = b."auctionId"
        WHERE a.status = 'ACTIVE'
        AND b."userId" = ${userId}
        AND b.amount = (
          SELECT MAX(b2.amount) 
          FROM "Bid" b2 
          WHERE b2."auctionId" = a.id
        )
      `.then((result: any) => {
        // Convertit le BigInt en number
        return Number(result[0]?.count || 0);
      }),
    ]);

    return NextResponse.json({
      stats: {
        bids: bidsCount,
        favorites: favoritesCount,
        leadingDeals: leadingDealsCount,
      },
    });
  } catch (error) {
    console.error("User stats error:", error);
    return NextResponse.json(
      { error: "Error fetching user stats" },
      { status: 500 }
    );
  }
}
