// scripts/create-user.ts
import { prisma } from "../lib/auth";
import bcrypt from "bcryptjs";

async function createUser() {
  try {
    const hashedPassword = await bcrypt.hash("test123", 12);

    const user = await prisma.user.create({
      data: {
        email: "test@test.com",
        password: hashedPassword,
        name: "Test User",
      },
    });

    console.log("✅ User created:", user);
  } catch (error) {
    console.error("❌ Error creating user:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createUser();
