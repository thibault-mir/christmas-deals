/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/bid/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

// le type du user renvoyé par verifyToken (d'après ton JWT)
type AuthUser = {
  userId: string;
  email?: string;
  name?: string | null;
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { auctionId } = body as { auctionId?: string };

    if (!auctionId) {
      return NextResponse.json({ error: "Missing auctionId" }, { status: 400 });
    }

    // 🔥 même méthode que /api/auth/check : on lit le cookie manuellement
    const cookieHeader = request.headers.get("cookie") || "";
    const tokenMatch = cookieHeader.match(/auth-token=([^;]+)/);
    const token = tokenMatch?.[1];

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const userData = (await verifyToken(token)) as AuthUser | null;

    // ICI : on utilise userId, pas id
    if (!userData || !userData.userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const userId: string = userData.userId;

    const now = new Date();

    const updatedAuction = await prisma.$transaction(async (tx) => {
      const auction = await tx.auction.findUnique({
        where: { id: auctionId },
      });

      if (!auction) {
        throw new Error("NOT_FOUND");
      }

      if (
        auction.status !== "ACTIVE" ||
        auction.startsAt > now ||
        auction.endsAt <= now
      ) {
        throw new Error("NOT_BIDABLE");
      }

      const current = Number(auction.currentPrice);
      const step = Number(auction.bidStep);
      const newPrice = current + step;

      // Créer le Bid
      await tx.bid.create({
        data: {
          auctionId: auction.id,
          userId, // 👈 string OK
          amount: newPrice,
        },
      });

      // Mettre à jour le prix de l'enchère
      const updated = await tx.auction.update({
        where: { id: auction.id },
        data: {
          currentPrice: newPrice,
        },
      });

      return updated;
    });

    return NextResponse.json({
      ok: true,
      auctionId: updatedAuction.id,
      currentPrice: Number(updatedAuction.currentPrice),
    });
  } catch (err: any) {
    console.error("Erreur /api/bid:", err);

    if (err instanceof Error) {
      if (err.message === "NOT_FOUND") {
        return NextResponse.json(
          { error: "Auction not found" },
          { status: 404 }
        );
      }
      if (err.message === "NOT_BIDABLE") {
        return NextResponse.json(
          { error: "Auction is not active or already ended" },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { error: "Error - Refresh the page and try again." },
      { status: 500 }
    );
  }
}
