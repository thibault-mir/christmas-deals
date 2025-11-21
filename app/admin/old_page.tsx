/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// app/admin/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface User {
  id: string;
  email: string;
  name: string | null;
  createdAt: string;
  _count: {
    bids: number;
    favorites: number;
  };
  leadingDeals?: number; // ← Nouvelle propriété
}

interface Product {
  id: string;
  name: string;
  description: string;
  condition: string;
  category: string;
  createdAt: string;
  _count: {
    auctions: number;
    favorites: number;
  };
}

interface Auction {
  id: string;
  product: {
    name: string;
  };
  startingPrice: string;
  currentPrice: string;
  status: string;
  startsAt: string;
  endsAt: string;
  _count: {
    bids: number;
  };
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<"users" | "products" | "auctions">(
    "users"
  );
  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/check");
        const data = await res.json();

        if (!data.authenticated) {
          router.push("/login");
        } else {
          loadData();
        }
      } catch (error) {
        router.push("/login");
      }
    };

    checkAuth();
  }, [router]);

  const loadData = async () => {
    try {
      setLoading(true);

      // En vrai, tu ferais des appels API séparés
      // Pour l'instant on simule avec des données
      const usersRes = await fetch("/api/admin/users");
      const productsRes = await fetch("/api/admin/products");
      const auctionsRes = await fetch("/api/admin/auctions");

      const usersData = await usersRes.json();
      const productsData = await productsRes.json();
      const auctionsData = await auctionsRes.json();

      setUsers(usersData.users || []);
      setProducts(productsData.products || []);
      setAuctions(auctionsData.auctions || []);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          background: "#013932",
          color: "white",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div>Loading admin data...</div>
      </div>
    );
  }

  return (
    <div style={{ background: "#013932", color: "white", minHeight: "100vh" }}>
      {/* Header */}
      <header
        style={{
          background: "rgba(1, 57, 50, 0.95)",
          padding: "20px 0",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <div
          style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px" }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <h1 style={{ margin: 0, fontSize: "1.8rem" }}>🎄 Admin Panel</h1>
              <p style={{ margin: 0, opacity: 0.7 }}>
                Christmas Deals - BackOffice
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div
        style={{
          background: "rgba(2, 37, 34, 0.8)",
          padding: "20px 0",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <div
          style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px" }}
        >
          <div style={{ display: "flex", gap: "30px" }}>
            {[
              { key: "users", label: `Users (${users.length})`, icon: "👥" },
              {
                key: "products",
                label: `Products (${products.length})`,
                icon: "📦",
              },
              {
                key: "auctions",
                label: `Auctions (${auctions.length})`,
                icon: "💰",
              },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                style={{
                  background: activeTab === tab.key ? "#00c9a7" : "transparent",
                  color: activeTab === tab.key ? "#013932" : "white",
                  border: "none",
                  padding: "12px 24px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "600",
                  transition: "all 0.3s ease",
                }}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div
        style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 20px" }}
      >
        {activeTab === "users" && <UsersTab users={users} />}
        {activeTab === "products" && <ProductsTab products={products} />}
        {activeTab === "auctions" && <AuctionsTab auctions={auctions} />}
      </div>
    </div>
  );
}

// Composant pour l'onglet Users
function UsersTab({ users }: { users: User[] }) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      timeZone: "Europe/Brussels",
    };
    return date.toLocaleDateString("fr-FR", options);
  };

  return (
    <div>
      <h2 style={{ marginBottom: "30px" }}>Users Management</h2>
      <div
        style={{
          background: "rgba(2, 37, 34, 0.6)",
          borderRadius: "12px",
          overflow: "hidden",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "rgba(0, 201, 167, 0.2)" }}>
              <th
                style={{
                  padding: "16px",
                  textAlign: "left",
                  borderBottom: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                User
              </th>
              <th
                style={{
                  padding: "16px",
                  textAlign: "left",
                  borderBottom: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                Bids
              </th>
              <th
                style={{
                  padding: "16px",
                  textAlign: "left",
                  borderBottom: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                Favorites
              </th>
              <th
                style={{
                  padding: "16px",
                  textAlign: "left",
                  borderBottom: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                Deals Leading
              </th>
              <th
                style={{
                  padding: "16px",
                  textAlign: "left",
                  borderBottom: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                Joined
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
              >
                <td style={{ padding: "16px" }}>
                  <div>
                    <div style={{ fontWeight: "600" }}>
                      {user.name || "No name"}
                    </div>
                    <div style={{ opacity: 0.7, fontSize: "0.9rem" }}>
                      {user.email}
                    </div>
                  </div>
                </td>
                <td style={{ padding: "16px" }}>{user._count.bids}</td>
                <td style={{ padding: "16px" }}>{user._count.favorites}</td>
                <td style={{ padding: "16px" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      color:
                        user.leadingDeals && user.leadingDeals > 0
                          ? "#fff"
                          : "inherit",
                    }}
                  >
                    {user.leadingDeals}
                  </div>
                </td>
                <td style={{ padding: "16px" }}>
                  {formatDate(user.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Composant pour l'onglet Products
function ProductsTab({ products }: { products: Product[] }) {
  // Fonction de formatage des dates
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);

    const options: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      timeZone: "Europe/Brussels",
    };

    return date.toLocaleDateString("fr-FR", options);
  };

  return (
    <div>
      <h2 style={{ marginBottom: "30px" }}>Products Management</h2>
      <div style={{ display: "grid", gap: "20px" }}>
        {products.map((product) => (
          <div
            key={product.id}
            style={{
              background: "rgba(2, 37, 34, 0.6)",
              padding: "20px",
              borderRadius: "12px",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "start",
              }}
            >
              <div>
                <h3 style={{ margin: "0 0 8px 0" }}>{product.name}</h3>
                <p style={{ margin: "0 0 12px 0", opacity: 0.8 }}>
                  {product.description}
                </p>
                <div
                  style={{ display: "flex", gap: "15px", fontSize: "0.9rem" }}
                >
                  <span>Condition: {product.condition}</span>
                  <span>Category: {product.category}</span>
                  <span>Auctions: {product._count.auctions}</span>
                  <span>Favorites: {product._count.favorites}</span>
                </div>
              </div>
              <div style={{ fontSize: "0.9rem", opacity: 0.7 }}>
                Created: {formatDate(product.createdAt)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Composant pour l'onglet Auctions
// Dans app/admin/page.tsx - Composant AuctionsTab complet
function AuctionsTab({ auctions }: { auctions: any[] }) {
  const [selectedAuction, setSelectedAuction] = useState<any>(null);
  const [allBids, setAllBids] = useState<any[]>([]);
  const [loadingBids, setLoadingBids] = useState(false);

  // Fonctions de formatage des dates
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);

    const options: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Europe/Brussels",
    };

    return date.toLocaleString("fr-FR", options);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);

    const options: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      timeZone: "Europe/Brussels",
    };

    return date.toLocaleDateString("fr-FR", options);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "#00c9a7";
      case "UPCOMING":
        return "#ffa502";
      case "ENDED":
        return "#ff6b6b";
      default:
        return "#ffffff";
    }
  };

  const formatPrice = (price: string) => {
    return `€${parseFloat(price).toFixed(2)}`;
  };

  const handleViewAllBids = async (auction: any) => {
    setSelectedAuction(auction);
    setLoadingBids(true);

    try {
      const res = await fetch(`/api/admin/auctions/${auction.id}/bids`);
      const data = await res.json();
      setAllBids(data.bids || []);
    } catch (error) {
      console.error("Error fetching bids:", error);
      setAllBids([]);
    } finally {
      setLoadingBids(false);
    }
  };

  const closeModal = () => {
    setSelectedAuction(null);
    setAllBids([]);
  };

  return (
    <div>
      <h2 style={{ marginBottom: "30px" }}>Auctions Management</h2>

      {/* Overlay/Modal pour toutes les enchères */}
      {selectedAuction && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(1, 57, 50, 0.95)",
            backdropFilter: "blur(10px)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
        >
          <div
            style={{
              background: "rgba(2, 37, 34, 0.95)",
              borderRadius: "16px",
              padding: "30px",
              maxWidth: "800px",
              width: "100%",
              maxHeight: "80vh",
              overflow: "auto",
              border: "1px solid rgba(255,255,255,0.2)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
            }}
          >
            {/* Header du modal */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "25px",
                borderBottom: "1px solid rgba(255,255,255,0.1)",
                paddingBottom: "15px",
              }}
            >
              <div>
                <h2 style={{ margin: 0, color: "#00c9a7" }}>
                  All Bids for {selectedAuction.product.name}
                </h2>
                <p style={{ margin: "5px 0 0 0", opacity: 0.7 }}>
                  Current Price: {formatPrice(selectedAuction.currentPrice)} •{" "}
                  {selectedAuction._count.bids} bids total
                </p>
              </div>
              <button
                onClick={closeModal}
                style={{
                  background: "rgba(255, 107, 107, 0.2)",
                  color: "#ff6b6b",
                  border: "1px solid rgba(255, 107, 107, 0.3)",
                  padding: "8px 16px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "1rem",
                }}
              >
                ✕ Close
              </button>
            </div>

            {/* Liste des enchères */}
            {loadingBids ? (
              <div style={{ textAlign: "center", padding: "40px" }}>
                <div>Loading bids...</div>
              </div>
            ) : allBids.length > 0 ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                {allBids.map((bid, index) => (
                  <div
                    key={bid.id}
                    style={{
                      background:
                        index === 0
                          ? "rgba(0, 201, 167, 0.15)"
                          : "rgba(255, 255, 255, 0.05)",
                      padding: "16px",
                      borderRadius: "10px",
                      border:
                        index === 0
                          ? "2px solid #00c9a7"
                          : "1px solid rgba(255,255,255,0.1)",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "15px",
                      }}
                    >
                      <div
                        style={{
                          background:
                            index === 0 ? "#00c9a7" : "rgba(255,255,255,0.2)",
                          color: index === 0 ? "#013932" : "white",
                          width: "32px",
                          height: "32px",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "0.8rem",
                          fontWeight: "bold",
                        }}
                      >
                        {index + 1}
                      </div>
                      <div>
                        <div style={{ fontWeight: "600", marginBottom: "4px" }}>
                          {bid.user.name || bid.user.email}
                          {index === 0 && (
                            <span
                              style={{
                                background: "#00c9a7",
                                color: "#013932",
                                fontSize: "0.7rem",
                                padding: "2px 6px",
                                borderRadius: "10px",
                                marginLeft: "8px",
                                fontWeight: "bold",
                              }}
                            >
                              👑 WINNING
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: "0.8rem", opacity: 0.7 }}>
                          {bid.user.email}
                        </div>
                      </div>
                    </div>

                    <div style={{ textAlign: "right" }}>
                      <div
                        style={{
                          fontSize: "1.2rem",
                          fontWeight: "bold",
                          color: index === 0 ? "#00c9a7" : "white",
                          marginBottom: "4px",
                        }}
                      >
                        {formatPrice(bid.amount)}
                      </div>
                      <div style={{ fontSize: "0.7rem", opacity: 0.6 }}>
                        {formatDateTime(bid.createdAt)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div
                style={{
                  textAlign: "center",
                  padding: "40px",
                  opacity: 0.6,
                  fontStyle: "italic",
                }}
              >
                No bids found for this auction
              </div>
            )}

            {/* Résumé */}
            {allBids.length > 0 && (
              <div
                style={{
                  marginTop: "25px",
                  padding: "15px",
                  background: "rgba(0, 201, 167, 0.1)",
                  borderRadius: "8px",
                  border: "1px solid rgba(0, 201, 167, 0.3)",
                }}
              >
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <div>
                    <strong>Highest Bid:</strong>{" "}
                    {formatPrice(allBids[0]?.amount || "0")}
                  </div>
                  <div>
                    <strong>Lowest Bid:</strong>{" "}
                    {formatPrice(allBids[allBids.length - 1]?.amount || "0")}
                  </div>
                  <div>
                    <strong>Total Bids:</strong> {allBids.length}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Liste des enchères principale */}
      <div style={{ display: "grid", gap: "20px" }}>
        {auctions.map((auction) => (
          <div
            key={auction.id}
            style={{
              background: "rgba(2, 37, 34, 0.6)",
              padding: "20px",
              borderRadius: "12px",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "start",
                marginBottom: "15px",
              }}
            >
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: "0 0 8px 0" }}>{auction.product.name}</h3>
                <div
                  style={{
                    display: "flex",
                    gap: "20px",
                    marginBottom: "12px",
                    flexWrap: "wrap",
                  }}
                >
                  <span>Start: {formatPrice(auction.startingPrice)}</span>
                  <span>Current: {formatPrice(auction.currentPrice)}</span>
                  <span>Bids: {auction._count.bids}</span>
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: "15px",
                    fontSize: "0.9rem",
                    opacity: 0.8,
                    flexWrap: "wrap",
                  }}
                >
                  <span>Starts: {formatDateTime(auction.startsAt)}</span>
                  <span>Ends: {formatDateTime(auction.endsAt)}</span>
                </div>
              </div>
              <div
                style={{
                  background: getStatusColor(auction.status),
                  color: "#013932",
                  padding: "6px 12px",
                  borderRadius: "20px",
                  fontSize: "0.8rem",
                  fontWeight: "600",
                  whiteSpace: "nowrap",
                }}
              >
                {auction.status}
              </div>
            </div>

            {/* Section Meilleur Enchérisseur */}
            <div
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                padding: "15px",
                borderRadius: "8px",
                border: "1px solid rgba(255, 255, 255, 0.1)",
              }}
            >
              <h4
                style={{
                  margin: "0 0 12px 0",
                  fontSize: "0.9rem",
                  color: "#00c9a7",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                👑 Top Bidder
              </h4>

              {auction.topBidder ? (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <div style={{ fontWeight: "600", marginBottom: "4px" }}>
                      {auction.topBidder.user.name ||
                        auction.topBidder.user.email}
                    </div>
                    <div style={{ fontSize: "0.8rem", opacity: 0.7 }}>
                      {auction.topBidder.user.email}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div
                      style={{
                        fontSize: "1.1rem",
                        fontWeight: "bold",
                        color: "#00c9a7",
                        marginBottom: "4px",
                      }}
                    >
                      {formatPrice(auction.topBidder.amount)}
                    </div>
                    <div style={{ fontSize: "0.7rem", opacity: 0.6 }}>
                      {formatDateTime(auction.topBidder.bidAt)}
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  style={{
                    textAlign: "center",
                    opacity: 0.6,
                    fontStyle: "italic",
                  }}
                >
                  No bids yet
                </div>
              )}
            </div>

            {/* Boutons d'action */}
            {auction.status === "ACTIVE" && (
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  marginTop: "15px",
                  justifyContent: "flex-end",
                }}
              >
                <button
                  onClick={() => handleViewAllBids(auction)}
                  style={{
                    background: "rgba(0, 201, 167, 0.2)",
                    color: "#00c9a7",
                    border: "1px solid rgba(0, 201, 167, 0.3)",
                    padding: "6px 12px",
                    borderRadius: "6px",
                    fontSize: "0.8rem",
                    cursor: "pointer",
                  }}
                >
                  View All Bids ({auction._count.bids})
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
