/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/forgot-password/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { SignJWT } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "ton-secret-pour-jwt"
);

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Vérifie si l'utilisateur existe
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Même si l'user n'existe pas, on retourne un succès pour la sécurité
    if (!user) {
      console.log("Password reset requested for non-existent email:", email);
      return NextResponse.json({
        message:
          "If an account with that email exists, you will receive a reset link",
      });
    }

    // Crée un token de réinitialisation (valide 1 heure)
    const resetToken = await new SignJWT({
      userId: user.id,
      email: user.email,
      type: "password_reset",
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("1h")
      .sign(JWT_SECRET);

    // En production, ici tu enverrais un email avec le lien
    console.log(
      "📧 Password reset link (in production this would be emailed):"
    );
    console.log(`http://localhost:3000/reset-password?token=${resetToken}`);

    // Enregistre le token dans la base (optionnel)
    // await prisma.passwordReset.create({ ... })

    return NextResponse.json({
      message:
        "If an account with that email exists, you will receive a reset link",
    });
  } catch (error: any) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Error processing request" },
      { status: 500 }
    );
  }
}
