/* eslint-disable @typescript-eslint/no-wrapper-object-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/admin/users-with-stats/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        _count: {
          select: {
            bids: true,
            favorites: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Pour chaque user, calcule le nombre de deals où il est leader
    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        const leadingDealsCount = await prisma.$queryRaw<[{ count: BigInt }]>`
          SELECT COUNT(DISTINCT a.id) 
          FROM "Auction" a
          INNER JOIN "Bid" b ON a.id = b."auctionId"
          WHERE a.status = 'ACTIVE'
          AND b."userId" = ${user.id}
          AND b.amount = (
            SELECT MAX(b2.amount) 
            FROM "Bid" b2 
            WHERE b2."auctionId" = a.id
          )
        `.then((result: any) => Number(result[0]?.count));

        return {
          ...user,
          leadingDeals: leadingDealsCount,
        };
      })
    );

    return NextResponse.json({ users: usersWithStats });
  } catch (error) {
    console.error("Admin users stats error:", error);
    return NextResponse.json(
      { error: "Error fetching users with stats" },
      { status: 500 }
    );
  }
}
