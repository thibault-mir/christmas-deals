// app/api/auth/check/route.ts
import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

export async function GET(request: Request) {
  const token = request.headers.get("cookie")?.match(/auth-token=([^;]+)/)?.[1];

  if (!token) {
    return NextResponse.json({ authenticated: false });
  }

  const userData = await verifyToken(token);

  if (userData) {
    return NextResponse.json({
      authenticated: true,
      user: userData,
    });
  } else {
    return NextResponse.json({ authenticated: false });
  }
}
