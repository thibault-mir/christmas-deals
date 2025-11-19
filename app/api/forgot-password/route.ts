/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/forgot-password/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendMail } from "@/app/utils/sendMail";
import bcrypt from "bcryptjs";

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
          "If an account with that email exists, you will a new password",
      });
    }

    // Génère un nouveau mot de passe temporaire
    const tempPassword = Math.random().toString(36).slice(-8) + "!A1";
    const hashedPassword = await bcrypt.hash(tempPassword, 12);

    // Met à jour le mot de passe dans la base
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    // Envoie le nouveau mot de passe par email
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #013932;">Christmas Deals - Password Reset</h2>
        <p>Hello,</p>
        <p>You requested a password reset for the Christmas Deals platform.</p>
        
        <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <strong>Email:</strong> ${user.email}<br>
          <strong>Your new password:</strong> ${tempPassword}
        </div>

        <p><strong>Important:</strong> Please change your password in My Account page after logging in.</p>

        <p style="color: #666; font-size: 14px;">
          If you didn't request this, please contact support immediately.
        </p>
        
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
        <p style="color: #999; font-size: 12px;">
          Christmas Deals by Servier<br>
          This is an automated message, please do not reply.
        </p>
      </div>
    `;

    await sendMail({
      to: user.email,
      subject: "🔐 Your New Christmas Deals Password",
      html,
    });

    console.log(`📧 New password sent to: ${user.email}`);

    return NextResponse.json({
      message:
        "If an account with that email exists, you will receive a new password",
    });
  } catch (error: any) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Error processing request" },
      { status: 500 }
    );
  }
}
