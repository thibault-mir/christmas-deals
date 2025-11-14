/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/login/route.ts
import { NextResponse } from "next/server";
import { loginUser } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    const { user, token } = await loginUser(email, password);

    const response = NextResponse.json({ user });
    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7 jours
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}
