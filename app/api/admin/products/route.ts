// app/api/admin/products/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        condition: true,
        category: true,
        createdAt: true,
        _count: {
          select: {
            auctions: true,
            favorites: true,
            // On ne peut pas compter directement les bids depuis Product
            // car la relation passe par Auction
          },
        },
        // On récupère les auctions avec leurs bids pour compter
        auctions: {
          select: {
            _count: {
              select: {
                bids: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Calcul du total des bids pour chaque produit
    const productsWithBidCount = products.map((product) => ({
      ...product,
      totalBids: product.auctions.reduce(
        (total, auction) => total + auction._count.bids,
        0
      ),
    }));

    return NextResponse.json({ products: productsWithBidCount });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Error fetching products" },
      { status: 500 }
    );
  }
}
