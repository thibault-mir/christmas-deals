/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// app/admin/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./AdminTabs.module.css";
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
  leadingDeals?: number;
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
  totalBids: number; // ← Nouvelle propriété
  auctions: Array<{
    // ← Ajouté pour le calcul
    _count: {
      bids: number;
    };
  }>;
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
            {/* Bouton Back à droite */}
            <Link
              href="/homepage"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                background: "rgba(0, 201, 167, 0.2)",
                color: "#00c9a7",
                border: "1px solid rgba(0, 201, 167, 0.3)",
                padding: "10px 16px",
                borderRadius: "8px",
                textDecoration: "none",
                fontWeight: "600",
                transition: "all 0.3s ease",
                fontSize: "0.9rem",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(0, 201, 167, 0.3)";
                e.currentTarget.style.transform = "translateX(2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(0, 201, 167, 0.2)";
                e.currentTarget.style.transform = "translateX(0)";
              }}
            >
              <span style={{ fontSize: "1.1rem" }}>←</span>
              Back to Site
            </Link>
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
          <div
            style={{
              display: "flex",
              gap: "10px",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
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
                  padding: "12px 16px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "600",
                  transition: "all 0.3s ease",
                  fontSize: "0.9rem",
                  flex: "1",
                  minWidth: "120px",
                  maxWidth: "200px",
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
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "20px 15px",
          overflowX: "hidden",
        }}
      >
        {activeTab === "users" && <UsersTab users={users} />}
        {activeTab === "products" && <ProductsTab products={products} />}
        {activeTab === "auctions" && <AuctionsTab auctions={auctions} />}
      </div>
    </div>
  );
}

// Composant pour l'onglet Users - Version Mobile

function UsersTab({ users }: { users: User[] }) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      timeZone: "Europe/Brussels",
    });
  };

  return (
    <div>
      <h2 style={{ marginBottom: "20px", fontSize: "1.5rem" }}>
        Users Management
      </h2>

      {/* Version Desktop */}
      <div className={`${styles.desktopOnly} ${styles.cardBg}`}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "rgba(0, 201, 167, 0.2)" }}>
              <th style={{ padding: "16px", textAlign: "left" }}>User</th>
              <th style={{ padding: "16px", textAlign: "left" }}>Bids</th>
              <th style={{ padding: "16px", textAlign: "left" }}>Favorites</th>
              <th style={{ padding: "16px", textAlign: "left" }}>
                Deals Leading
              </th>
              <th style={{ padding: "16px", textAlign: "left" }}>Joined</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                style={{
                  borderBottom: "1px solid rgba(255,255,255,0.05)",
                }}
              >
                <td style={{ padding: "16px" }}>
                  <div>
                    <div style={{ fontWeight: "600" }}>
                      {user.name || "No name"}
                    </div>
                    <div style={{ opacity: 0.7 }}>{user.email}</div>
                  </div>
                </td>

                <td style={{ padding: "16px" }}>{user._count.bids}</td>
                <td style={{ padding: "16px" }}>{user._count.favorites}</td>

                <td style={{ padding: "16px" }}>{user.leadingDeals}</td>

                <td style={{ padding: "16px" }}>
                  {formatDate(user.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Version Mobile */}
      <div className={styles.mobileOnly}>
        {users.map((user) => (
          <div
            key={user.id}
            className={styles.cardBg}
            style={{ padding: "16px", marginBottom: "10px" }}
          >
            <div style={{ marginBottom: "12px" }}>
              <div style={{ fontWeight: "600", fontSize: "1.1rem" }}>
                {user.name || "No name"}
              </div>
              <div style={{ opacity: 0.7, fontSize: "0.9rem" }}>
                {user.email}
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "10px",
              }}
            >
              <div>
                <span style={{ opacity: 0.7 }}>Bids </span>
                <span style={{ fontWeight: "600" }}>{user._count.bids}</span>
              </div>

              <div>
                <span style={{ opacity: 0.7 }}>Favorites </span>
                <span style={{ fontWeight: "600" }}>
                  {user._count.favorites}
                </span>
              </div>

              <div>
                <span style={{ opacity: 0.7 }}>Deals Leading </span>
                <span style={{ fontWeight: "600" }}>
                  {user.leadingDeals || 0}
                </span>
              </div>

              <div>
                <span style={{ opacity: 0.7 }}>Joined </span>
                <span style={{ fontWeight: "600" }}>
                  {formatDate(user.createdAt)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Composant pour l'onglet Products - Version Mobile
function ProductsTab({ products }: { products: Product[] }) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      timeZone: "Europe/Brussels",
    });
  };

  return (
    <div>
      <h2
        style={{
          marginBottom: "24px",
          fontSize: "1.8rem",
          fontWeight: 600,
        }}
      >
        Products Management
      </h2>

      {/* DESKTOP */}
      <div className={styles.desktopGrid}>
        {products.map((product) => (
          <div
            key={product.id}
            className={styles.cardBg}
            style={{
              padding: "24px",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              marginBottom: "12px",
            }}
          >
            {/* Header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "start",
              }}
            >
              <div>
                <h3
                  style={{
                    margin: 0,
                    marginBottom: "8px",
                    fontSize: "1.4rem",
                    fontWeight: 600,
                  }}
                >
                  {product.name}
                </h3>

                <p
                  style={{
                    margin: 0,
                    opacity: 0.8,
                    fontSize: "0.95rem",
                    maxWidth: "600px",
                    lineHeight: "1.4",
                  }}
                >
                  {product.description}
                </p>
              </div>
            </div>

            {/* Stats badges */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "12px",
                marginTop: "8px",
              }}
            >
              <span
                style={{
                  padding: "6px 12px",
                  background: "rgba(0, 201, 167, 0.15)",
                  border: "1px solid rgba(0, 201, 167, 0.3)",
                  borderRadius: "8px",
                  fontSize: "0.85rem",
                }}
              >
                Condition: <strong>{product.condition}</strong>
              </span>

              <span
                style={{
                  padding: "6px 12px",
                  background: "rgba(0, 201, 167, 0.15)",
                  border: "1px solid rgba(0, 201, 167, 0.3)",
                  borderRadius: "8px",
                  fontSize: "0.85rem",
                }}
              >
                Category: <strong>{product.category}</strong>
              </span>

              <span
                style={{
                  padding: "6px 12px",
                  background: "rgba(0, 201, 167, 0.15)",
                  border: "1px solid rgba(0, 201, 167, 0.3)",
                  borderRadius: "8px",
                  fontSize: "0.85rem",
                }}
              >
                Auctions: <strong>{product._count.auctions}</strong>
              </span>

              <span
                style={{
                  padding: "6px 12px",
                  background: "rgba(0, 201, 167, 0.15)",
                  border: "1px solid rgba(0, 201, 167, 0.3)",
                  borderRadius: "8px",
                  fontSize: "0.85rem",
                }}
              >
                Favorites: <strong>{product._count.favorites}</strong>
              </span>

              <span
                style={{
                  padding: "6px 12px",
                  background: "rgba(255, 255, 255, 0.1)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: "8px",
                  fontSize: "0.85rem",
                }}
              >
                Total Bids:{" "}
                <strong
                  style={{
                    color: product.totalBids > 0 ? "#00c9a7" : "inherit",
                  }}
                >
                  {product.totalBids}
                </strong>
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* MOBILE */}
      <div className={styles.mobileOnly}>
        {products.map((product) => (
          <div
            key={product.id}
            className={styles.cardBg}
            style={{
              padding: "18px",
              marginBottom: "12px",
              display: "flex",
              flexDirection: "column",
              gap: "14px",
            }}
          >
            <h3
              style={{
                margin: 0,
                fontSize: "1.2rem",
                fontWeight: 600,
              }}
            >
              {product.name}
            </h3>

            <p
              style={{
                margin: 0,
                opacity: 0.8,
                fontSize: "0.9rem",
                lineHeight: "1.4",
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {product.description}
            </p>

            {/* Grid d’infos */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "10px 12px",
              }}
            >
              <div>
                <span style={{ opacity: 0.7 }}>Condition</span>
                <br />
                <strong>{product.condition}</strong>
              </div>

              <div>
                <span style={{ opacity: 0.7 }}>Category</span>
                <br />
                <strong>{product.category}</strong>
              </div>

              <div>
                <span style={{ opacity: 0.7 }}>Auctions</span>
                <br />
                <strong>{product._count.auctions}</strong>
              </div>

              <div>
                <span style={{ opacity: 0.7 }}>Favorites</span>
                <br />
                <strong>{product._count.favorites}</strong>
              </div>

              <div>
                <span style={{ opacity: 0.7 }}>Total Bids</span>
                <br />
                <strong
                  style={{
                    color: product.totalBids > 0 ? "#00c9a7" : "inherit",
                  }}
                >
                  {product.totalBids}
                </strong>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Composant pour l'onglet Auctions (inchangé)
function AuctionsTab({ auctions }: { auctions: any[] }) {
  const [selectedAuction, setSelectedAuction] = useState<any>(null);
  const [allBids, setAllBids] = useState<any[]>([]);
  const [loadingBids, setLoadingBids] = useState(false);

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
      <h2 style={{ marginBottom: "20px", fontSize: "1.5rem" }}>
        Auctions Management
      </h2>

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
              padding: "20px",
              maxWidth: "800px",
              width: "100%",
              maxHeight: "80vh",
              overflow: "auto",
              border: "1px solid rgba(255,255,255,0.2)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <h3 style={{ margin: 0, color: "#00c9a7" }}>
                All Bids for {selectedAuction.product.name}
              </h3>
              <button
                onClick={closeModal}
                style={{
                  background: "rgba(255, 107, 107, 0.2)",
                  color: "#ff6b6b",
                  border: "1px solid rgba(255, 107, 107, 0.3)",
                  padding: "8px 12px",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                ✕
              </button>
            </div>

            {loadingBids ? (
              <div style={{ textAlign: "center", padding: "20px" }}>
                Loading bids...
              </div>
            ) : allBids.length > 0 ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
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
                      padding: "12px",
                      borderRadius: "8px",
                      border:
                        index === 0
                          ? "1px solid #00c9a7"
                          : "1px solid rgba(255,255,255,0.1)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: "600", fontSize: "0.9rem" }}>
                          {bid.user.name || bid.user.email}
                          {index === 0 && (
                            <span
                              style={{ color: "#00c9a7", marginLeft: "8px" }}
                            >
                              👑
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: "0.8rem", opacity: 0.7 }}>
                          {formatDateTime(bid.createdAt)}
                        </div>
                      </div>
                      <div
                        style={{
                          fontSize: "1rem",
                          fontWeight: "bold",
                          color: index === 0 ? "#00c9a7" : "white",
                        }}
                      >
                        {formatPrice(bid.amount)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div
                style={{ textAlign: "center", padding: "20px", opacity: 0.6 }}
              >
                No bids found
              </div>
            )}
          </div>
        </div>
      )}

      <div style={{ display: "grid", gap: "16px" }}>
        {auctions.map((auction) => (
          <div
            key={auction.id}
            style={{
              background: "rgba(2, 37, 34, 0.6)",
              padding: "16px",
              borderRadius: "12px",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <div style={{ marginBottom: "12px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "start",
                  marginBottom: "8px",
                }}
              >
                <h3 style={{ margin: 0, fontSize: "1.1rem" }}>
                  {auction.product.name}
                </h3>
                <span
                  style={{
                    background: getStatusColor(auction.status),
                    color: "#013932",
                    padding: "4px 8px",
                    borderRadius: "12px",
                    fontSize: "0.7rem",
                    fontWeight: "600",
                  }}
                >
                  {auction.status}
                </span>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "8px",
                  fontSize: "0.85rem",
                }}
              >
                <div>
                  <span style={{ opacity: 0.7 }}>Start: </span>
                  {formatPrice(auction.startingPrice)}
                </div>
                <div>
                  <span style={{ opacity: 0.7 }}>Current: </span>
                  {formatPrice(auction.currentPrice)}
                </div>
                <div>
                  <span style={{ opacity: 0.7 }}>Bids: </span>
                  {auction._count.bids}
                </div>
              </div>
            </div>

            <div
              style={{
                background: "rgba(255,255,255,0.05)",
                padding: "12px",
                borderRadius: "8px",
                marginBottom: "12px",
              }}
            >
              <div
                style={{
                  fontSize: "0.9rem",
                  color: "#00c9a7",
                  marginBottom: "8px",
                }}
              >
                👑 Top Bidder
              </div>
              {auction.topBidder ? (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div style={{ fontSize: "0.85rem" }}>
                    <div style={{ fontWeight: "600" }}>
                      {auction.topBidder.user.name ||
                        auction.topBidder.user.email}
                    </div>
                    <div style={{ opacity: 0.7 }}>
                      {formatDateTime(auction.topBidder.bidAt)}
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: "1rem",
                      fontWeight: "bold",
                      color: "#00c9a7",
                    }}
                  >
                    {formatPrice(auction.topBidder.amount)}
                  </div>
                </div>
              ) : (
                <div
                  style={{
                    textAlign: "center",
                    opacity: 0.6,
                    fontSize: "0.85rem",
                  }}
                >
                  No bids yet
                </div>
              )}
            </div>

            {auction.status === "ACTIVE" && (
              <button
                onClick={() => handleViewAllBids(auction)}
                style={{
                  background: "rgba(0, 201, 167, 0.2)",
                  color: "#00c9a7",
                  border: "1px solid rgba(0, 201, 167, 0.3)",
                  padding: "8px 12px",
                  borderRadius: "6px",
                  fontSize: "0.8rem",
                  cursor: "pointer",
                  width: "100%",
                }}
              >
                View All Bids ({auction._count.bids})
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
