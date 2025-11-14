// lib/auth.ts
import { prisma } from "./prisma";
import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "ton-secret-pour-jwt"
);

export async function loginUser(email: string, password: string) {
  // Trouve l'user
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("User not found");

  // Vérifie le mot de passe
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new Error("Incorrect password");

  // Crée le token
  const token = await new SignJWT({
    userId: user.id,
    email: user.email,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(JWT_SECRET);

  return {
    user: { id: user.id, email: user.email, name: user.name },
    token,
  };
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload;
  } catch {
    return null;
  }
}
