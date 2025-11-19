// app/api/user/me/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

// Interface pour le payload JWT
interface JWTPayload {
  userId: string;
  email: string;
  exp?: number;
}

export async function GET(request: Request) {
  try {
    // Récupère le token depuis les cookies
    const cookieHeader = request.headers.get("cookie");
    const token = cookieHeader?.match(/auth-token=([^;]+)/)?.[1];

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Vérifie le token (await car c'est une promesse)
    const decoded = (await verifyToken(token)) as JWTPayload | null;

    if (!decoded || !decoded.userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Récupère l'utilisateur depuis la DB avec le name
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("User me error:", error);
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
