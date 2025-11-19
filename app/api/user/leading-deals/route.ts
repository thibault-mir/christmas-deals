/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/user/leading-deals/route.ts
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

    const leadingDeals = await prisma.$queryRaw<any[]>`
      SELECT DISTINCT a.*, p.name as "productName", p."imageUrl", b.amount as "currentBid"
      FROM "Auction" a
      INNER JOIN "Bid" b ON a.id = b."auctionId"
      INNER JOIN "Product" p ON a."productId" = p.id
      WHERE a.status = 'ACTIVE'
      AND b."userId" = ${decoded.userId}
      AND b.amount = (
        SELECT MAX(b2.amount) 
        FROM "Bid" b2 
        WHERE b2."auctionId" = a.id
      )
      ORDER BY a."endsAt" ASC
    `;

    return NextResponse.json({
      leadingDeals: leadingDeals.map((deal) => ({
        id: deal.id,
        productName: deal.productName,
        imageUrl: deal.imageUrl,
        currentBid: deal.currentBid,
        endsAt: deal.endsAt,
        currentPrice: deal.currentPrice,
      })),
    });
  } catch (error) {
    console.error("Leading deals fetch error:", error);
    return NextResponse.json(
      { error: "Error fetching leading deals" },
      { status: 500 }
    );
  }
}
