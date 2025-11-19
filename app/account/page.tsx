/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
// app/account/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface User {
  id: string;
  email: string;
  name: string | null;
  createdAt: string;
}

export default function AccountPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    bids: 0,
    favorites: 0,
    leadingDeals: 0, // Remplace dealsViewed par leadingDeals
  });

  const [editPopup, setEditPopup] = useState(false);
  const [editName, setEditName] = useState("");
  const [saving, setSaving] = useState(false);

  // Ajoute ces states en haut de ton composant
  const [activeOverlay, setActiveOverlay] = useState<
    "bids" | "favorites" | "leadingDeals" | null
  >(null);
  const [overlayData, setOverlayData] = useState<any[]>([]);
  const [overlayLoading, setOverlayLoading] = useState(false);

  // Fonctions pour ouvrir les overlays
  const openBidsOverlay = async () => {
    setActiveOverlay("bids");
    setOverlayLoading(true);
    try {
      const response = await fetch("/api/user/bids");
      if (response.ok) {
        const data = await response.json();
        setOverlayData(data.bids);
      }
    } catch (error) {
      console.error("Error fetching bids:", error);
    } finally {
      setOverlayLoading(false);
    }
  };

  const openFavoritesOverlay = async () => {
    setActiveOverlay("favorites");
    setOverlayLoading(true);
    try {
      const response = await fetch("/api/user/favorites");
      if (response.ok) {
        const data = await response.json();
        setOverlayData(data.favorites);
      }
    } catch (error) {
      console.error("Error fetching favorites:", error);
    } finally {
      setOverlayLoading(false);
    }
  };

  const openLeadingDealsOverlay = async () => {
    setActiveOverlay("leadingDeals");
    setOverlayLoading(true);
    try {
      const response = await fetch("/api/user/leading-deals");
      if (response.ok) {
        const data = await response.json();
        setOverlayData(data.leadingDeals);
      }
    } catch (error) {
      console.error("Error fetching leading deals:", error);
    } finally {
      setOverlayLoading(false);
    }
  };

  // Fonction pour ouvrir la popup
  const openEditPopup = () => {
    setEditName(user?.name || "");
    setEditPopup(true);
  };

  // Fonction pour sauvegarder
  const saveName = async () => {
    if (!editName.trim()) {
      alert("Name cannot be empty");
      return;
    }

    setSaving(true);
    try {
      const response = await fetch("/api/user/update-name", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editName.trim() }),
      });

      const data = await response.json();

      if (response.ok) {
        setUser((prev) => (prev ? { ...prev, name: editName.trim() } : null));
        setEditPopup(false);
        alert("✅ Name updated successfully!");
      } else {
        alert("❌ Error updating name: " + (data.error || "Unknown error"));
      }
    } catch (error) {
      alert("❌ Error updating name");
      console.error("Update name error:", error);
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/user/me");
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);

          // Récupère les stats utilisateur
          const statsResponse = await fetch("/api/user/stats");
          if (statsResponse.ok) {
            const statsData = await statsResponse.json();
            setStats(statsData.stats);
          }
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <div className="account-loading">
        <div className="loading-spinner">⏳</div>
        <p>Loading your account...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="account-error">
        <h2>Access Required</h2>
        <p>Please log in to view your account.</p>
        <Link href="/login" className="account-login-btn">
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="account-container">
      {/* Header avec avatar */}
      <div className="account-header">
        <div className="account-avatar">
          <span className="account-avatar-initial">
            {user.name
              ? user.name.charAt(0).toUpperCase()
              : user.email.charAt(0).toUpperCase()}
          </span>
        </div>
        <div className="account-welcome">
          <h1>Welcome back{user.name ? `, ${user.name}` : ""} ! 🎄</h1>
          <p>Your Christmas Deals account</p>

          {/* Boutons d'action */}
          <div className="account-header-actions">
            <Link href="/homepage" className="account-action-btn back-btn">
              <span className="btn-icon">←</span>
              Back
            </Link>

            <button
              className="account-action-btn edit-btn"
              onClick={openEditPopup}
            >
              <span className="btn-icon">✎</span>
              Edit
            </button>

            <button
              className="account-action-btn logout-btn"
              onClick={async () => {
                try {
                  await fetch("/api/logout", { method: "POST" });
                  window.location.href = "/";
                } catch (error) {
                  console.error("Logout error:", error);
                }
              }}
            >
              <span className="btn-icon">⏻</span>
              Log Out
            </button>
          </div>
        </div>
      </div>

      {/* Cartes d'information */}
      <div className="account-cards">
        {/* Carte Profil */}
        <div className="account-card">
          <div className="account-card-header">
            <span className="account-card-icon">👤</span>
            <h2>Profile Information</h2>
          </div>
          <div className="account-card-content">
            <div className="account-field">
              <label>Name</label>
              <p>{user.name || "Not set"}</p>
            </div>
            <div className="account-field">
              <label>Email</label>
              <p>{user.email}</p>
            </div>
            <div className="account-field">
              <div className="password-action">
                <button
                  className="send-password-btn"
                  onClick={async () => {
                    try {
                      const response = await fetch("/api/forgot-password", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ email: user.email }),
                      });

                      const data = await response.json();

                      if (response.ok) {
                        alert("✅ New password sent to your email!");
                      } else {
                        alert(
                          "❌ Error sending password: " +
                            (data.error || "Unknown error")
                        );
                      }
                    } catch (error) {
                      alert("❌ Error sending password");
                      console.error("Send password error:", error);
                    }
                  }}
                >
                  <span className="send-password-icon">🔐</span>
                  Send New Password
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Carte Activité */}
        <div className="account-card">
          <div className="account-card-header">
            <span className="account-card-icon">🚀</span>
            <h2>Your Activity</h2>
          </div>
          <div className="account-stats">
            <div className="stat-item clickable" onClick={openBidsOverlay}>
              <div className="stat-number">{stats.bids}</div>
              <div className="stat-label">Bids Placed</div>
            </div>
            <div className="stat-item clickable" onClick={openFavoritesOverlay}>
              <div className="stat-number">{stats.favorites}</div>
              <div className="stat-label">Favorites</div>
            </div>
            <div
              className="stat-item clickable"
              onClick={openLeadingDealsOverlay}
            >
              <div className="stat-number">{stats.leadingDeals}</div>
              <div className="stat-label">Deals Leading</div>
            </div>
          </div>
        </div>
      </div>

      {/* Popup Overlay d'édition */}
      {editPopup && (
        <div className="edit-overlay">
          <div className="edit-popup">
            <div className="edit-popup-header">
              <h2>Edit Your Name</h2>
              <button
                className="edit-close-btn"
                onClick={() => setEditPopup(false)}
                disabled={saving}
              >
                ×
              </button>
            </div>

            <div className="edit-popup-content">
              <div className="edit-field">
                <label htmlFor="edit-name">Name</label>
                <input
                  id="edit-name"
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Enter your name"
                  disabled={saving}
                  className="edit-input"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") saveName();
                  }}
                />
              </div>

              <div className="edit-popup-actions">
                <button
                  className="edit-cancel-btn"
                  onClick={() => setEditPopup(false)}
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  className="edit-save-btn"
                  onClick={saveName}
                  disabled={saving || !editName.trim()}
                >
                  {saving ? (
                    <>
                      <span className="loading-spinner-mini"></span>
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Overlay pour les détails */}
      {activeOverlay && (
        <div className="stats-overlay">
          <div className="stats-overlay-content">
            <div className="stats-overlay-header">
              <h2>
                {activeOverlay === "bids" && "📨 Your Bids"}
                {activeOverlay === "favorites" && "❤️ Your Favorites"}
                {activeOverlay === "leadingDeals" && "👑 Deals You're Leading"}
              </h2>
              <button
                className="stats-close-btn"
                onClick={() => {
                  setActiveOverlay(null);
                  setOverlayData([]);
                }}
              >
                ×
              </button>
            </div>

            <div className="stats-overlay-body">
              {overlayLoading ? (
                <div className="stats-loading">
                  <div className="loading-spinner"></div>
                  <p>Loading...</p>
                </div>
              ) : overlayData.length === 0 ? (
                <div className="stats-empty">
                  <p>No items found</p>
                </div>
              ) : (
                <div className="stats-list">
                  {overlayData.map((item, index) => (
                    <div key={item.id || index} className="stats-item-detail">
                      {activeOverlay === "bids" && (
                        <>
                          <div className="item-image">
                            {item.productImage ? (
                              <img
                                src={item.productImage}
                                alt={item.productName}
                              />
                            ) : (
                              <div className="image-placeholder">🎁</div>
                            )}
                          </div>
                          <div className="item-info">
                            <h4>{item.productName}</h4>
                            <p>
                              Your bid: <strong>${item.amount}</strong>
                            </p>
                            <span className="item-date">
                              {new Date(item.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </>
                      )}

                      {activeOverlay === "favorites" && (
                        <>
                          <div className="item-image">
                            {item.product.imageUrl ? (
                              <img
                                src={item.product.imageUrl}
                                alt={item.product.name}
                              />
                            ) : (
                              <div className="image-placeholder">❤️</div>
                            )}
                          </div>
                          <div className="item-info">
                            <h4>{item.product.name}</h4>
                            <p>{item.product.description}</p>
                            <span className="item-category">
                              {item.product.category}
                            </span>
                          </div>
                        </>
                      )}

                      {activeOverlay === "leadingDeals" && (
                        <>
                          <div className="item-image">
                            {item.imageUrl ? (
                              <img src={item.imageUrl} alt={item.productName} />
                            ) : (
                              <div className="image-placeholder">👑</div>
                            )}
                          </div>
                          <div className="item-info">
                            <h4>{item.productName}</h4>
                            <p>
                              Your leading bid:{" "}
                              <strong>${item.currentBid}</strong>
                            </p>
                            <p>
                              Current price:{" "}
                              <strong>${item.currentPrice}</strong>
                            </p>
                            <span className="item-date">
                              Ends: {new Date(item.endsAt).toLocaleDateString()}
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
