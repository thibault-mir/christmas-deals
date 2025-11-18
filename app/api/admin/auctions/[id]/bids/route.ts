// app/api/admin/auctions/[id]/bids/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> } // ← params est une Promise
) {
  try {
    const { id } = await params; // ← Ajoute await ici

    const bids = await prisma.bid.findMany({
      where: {
        auctionId: id,
      },
      select: {
        id: true,
        amount: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
      orderBy: {
        amount: "desc",
      },
    });

    return NextResponse.json({ bids });
  } catch (error) {
    console.error("Error fetching bids:", error);
    return NextResponse.json({ error: "Error fetching bids" }, { status: 500 });
  }
}
