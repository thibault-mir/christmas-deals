/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/favorites/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    // Vérifier l'authentification avec ton système
    const token = request.headers
      .get("cookie")
      ?.match(/auth-token=([^;]+)/)?.[1];

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userData = await verifyToken(token);
    if (!userData) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Type assertion basée sur ce que verifyToken retourne normalement
    const userEmail = (userData as any).email;
    if (!userEmail || typeof userEmail !== "string") {
      return NextResponse.json(
        { error: "Invalid token data" },
        { status: 401 }
      );
    }

    const { productId, action } = await request.json();

    if (!productId || !action) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    // Trouver l'user par email depuis le token
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (action === "add") {
      await prisma.favorite.upsert({
        where: {
          userId_productId: {
            userId: user.id,
            productId,
          },
        },
        update: {}, // rien à update
        create: {
          userId: user.id,
          productId,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Favorite error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// Récupérer les favoris d'un user
export async function GET(request: Request) {
  try {
    // Vérifier l'authentification avec ton système
    const token = request.headers
      .get("cookie")
      ?.match(/auth-token=([^;]+)/)?.[1];

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userData = await verifyToken(token);
    if (!userData) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Type assertion
    const userEmail = (userData as any).email;
    if (!userEmail || typeof userEmail !== "string") {
      return NextResponse.json(
        { error: "Invalid token data" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: userEmail },
      include: {
        favorites: {
          include: {
            product: {
              include: {
                auctions: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user.favorites);
  } catch (error) {
    console.error("Get favorites error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
