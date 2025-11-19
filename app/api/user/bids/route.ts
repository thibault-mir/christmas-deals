/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/user/bids/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const cookieHeader = request.headers.get("cookie");
    const token = cookieHeader?.match(/auth-token=([^;]+)/)?.[1];

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const decoded = (await verifyToken(token)) as any;
    if (!decoded || !decoded.userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const bids = await prisma.bid.findMany({
      where: { userId: decoded.userId },
      include: {
        auction: {
          include: {
            product: {
              select: {
                name: true,
                imageUrl: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      bids: bids.map((bid) => ({
        id: bid.id,
        amount: bid.amount,
        createdAt: bid.createdAt,
        productName: bid.auction.product.name,
        productImage: bid.auction.product.imageUrl,
        auctionId: bid.auctionId,
      })),
    });
  } catch (error) {
    console.error("Bids fetch error:", error);
    return NextResponse.json({ error: "Error fetching bids" }, { status: 500 });
  }
}
