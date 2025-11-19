/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/user/update-name/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function POST(request: Request) {
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

    const { name } = await request.json();

    if (!name || typeof name !== "string") {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    // Met à jour l'utilisateur
    const updatedUser = await prisma.user.update({
      where: { id: decoded.userId },
      data: { name },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    console.error("Update name error:", error);
    return NextResponse.json({ error: "Error updating name" }, { status: 500 });
  }
}
