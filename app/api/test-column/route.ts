// app/api/test-column/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const auction = await prisma.auction.findFirst({
      select: {
        id: true,
        estimatePrice: true,
      },
    });

    return NextResponse.json({
      hasEstimatePrice: auction ? "estimatePrice" in auction : false,
      sample: auction,
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
