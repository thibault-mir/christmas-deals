/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/user/favorites/route.ts
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

    const favorites = await prisma.favorite.findMany({
      where: { userId: decoded.userId },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            description: true,
            imageUrl: true,
            category: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      favorites: favorites.map((fav) => ({
        id: fav.id,
        createdAt: fav.createdAt,
        product: fav.product,
      })),
    });
  } catch (error) {
    console.error("Favorites fetch error:", error);
    return NextResponse.json(
      { error: "Error fetching favorites" },
      { status: 500 }
    );
  }
}
