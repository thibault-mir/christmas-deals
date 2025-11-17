// app/api/bids/[auctionId]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ auctionId: string }> } // params est une Promise
) {
  try {
    const { auctionId } = await params; // Ajoute 'await' ici

    if (!auctionId) {
      return NextResponse.json({ error: "Missing auctionId" }, { status: 400 });
    }

    const bids = await prisma.bid.findMany({
      where: { auctionId },
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    const payload = bids.map((b) => ({
      id: b.id,
      amount: Number(b.amount),
      createdAt: b.createdAt.toISOString(),
      userName: b.user?.name || null,
      userEmail: b.user?.email || null,
    }));

    return NextResponse.json(payload);
  } catch (err) {
    console.error("Erreur /api/bids:", err);
    return NextResponse.json(
      { error: "Error while loading bid history" },
      { status: 500 }
    );
  }
}
