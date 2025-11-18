/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";

type Condition = "NEW" | "LIKE_NEW" | "VERY_GOOD" | "GOOD" | "USED" | string;

type BidHistoryItem = {
  id: string;
  amount: number;
  createdAt: string;
  userName: string | null;
  userEmail: string | null;
};

export interface DealCardProps {
  id: string; // <-- c'est l'id de l'Auction
  name: string;
  description: string;
  condition: Condition;
  category?: string;
  imageUrl?: string | null;
  currentPrice: number;
  startingPrice: number;
  bidStep: number;
  endsAt: string; // ISO string
  isLeadingForCurrentUser?: boolean;
  productId: string; // <-- Ajouter productId pour les favoris
  isFavorite?: boolean; // <-- État initial du favori
  onFavoriteChange?: (productId: string, next: boolean) => void; // 👈 new
}

function formatCondition(condition: Condition) {
  switch (condition) {
    case "NEW":
      return "New";
    case "LIKE_NEW":
      return "Like New";
    case "VERY_GOOD":
      return "Very Good";
    case "GOOD":
      return "Good";
    case "USED":
      return "Used";
    default:
      return condition;
  }
}

function formatTimeLeft(ms: number) {
  if (ms <= 0) return "Enchère terminée";

  const totalSeconds = Math.floor(ms / 1000);
  const days = Math.floor(totalSeconds / (3600 * 24));
  const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (days > 0) return `${days}j ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m ${seconds}s`;
  return `${seconds}s`;
}

export default function DealCard(props: DealCardProps) {
  const {
    id,
    name,
    description,
    condition,
    category,
    imageUrl,
    currentPrice,
    startingPrice,
    bidStep,
    endsAt,
    isLeadingForCurrentUser = false,
    productId, // <-- Nouveau
    isFavorite = false,
    onFavoriteChange,
  } = props;

  const [now, setNow] = useState(() => Date.now());
  const [price, setPrice] = useState(currentPrice);
  const [isBidding, setIsBidding] = useState(false);
  const [bidError, setBidError] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isLeading, setIsLeading] = useState<boolean>(isLeadingForCurrentUser);
  const [favorite, setFavorite] = useState<boolean>(isFavorite);
  const [favoriteLoading, setFavoriteLoading] = useState(false);

  // Historique
  const [showHistory, setShowHistory] = useState(false);
  const [bids, setBids] = useState<BidHistoryItem[]>([]);
  const [loadingBids, setLoadingBids] = useState(false);
  const [bidsError, setBidsError] = useState<string | null>(null);
  const [hasLoadedBids, setHasLoadedBids] = useState(false);

  // 🔁 Sync quand la prop vient de changer (ex : après /api/favorites)
  useEffect(() => {
    setFavorite(isFavorite);
  }, [isFavorite]);

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Si le prix côté props change (reload de la page ou refetch global)
  useEffect(() => {
    setPrice(currentPrice);
  }, [currentPrice]);

  useEffect(() => {
    setIsLeading(isLeadingForCurrentUser);
  }, [isLeadingForCurrentUser]);

  const endTime = new Date(endsAt).getTime();
  const timeLeft = endTime - now;
  const timeLeftLabel = formatTimeLeft(timeLeft);
  const isEnded = timeLeft <= 0;

  // Fonction pour gérer les favoris
  const toggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (favoriteLoading) return;

    setFavoriteLoading(true);
    try {
      const res = await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          action: favorite ? "remove" : "add",
        }),
      });

      const data = await res.json();

      if (res.ok) {
        const next = !favorite;
        setFavorite(next);
        onFavoriteChange?.(productId, next); // 👈 on prévient le parent
      } else {
        console.error("Error toggling favorite:", data.error);
      }
    } catch (err) {
      console.error("Network error:", err);
    } finally {
      setFavoriteLoading(false);
    }
  };

  const handleBidClick = () => {
    setConfirmOpen(true);
  };

  const handleBid = async () => {
    if (isEnded || isBidding) return;

    setIsBidding(true);
    setBidError(null);

    try {
      const res = await fetch("/api/bid", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ auctionId: id }),
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        setBidError(data.error || "Unable to place bid");
        return;
      }

      if (typeof data.currentPrice === "number") {
        setPrice(data.currentPrice);
        setIsLeading(true);
      }
    } catch (err) {
      console.error(err);
      setBidError("Network error while placing bid");
    } finally {
      setIsBidding(false);
    }
  };

  const loadBids = async () => {
    if (hasLoadedBids || loadingBids) return;

    try {
      setLoadingBids(true);
      setBidsError(null);

      const res = await fetch(`/api/bids/${id}`);
      const data = await res.json();

      if (!res.ok) {
        setBidsError(data.error || "Error while loading bid history");
        return;
      }

      setBids(data);
      setHasLoadedBids(true);
    } catch (err) {
      console.error(err);
      setBidsError("Network error while loading bid history");
    } finally {
      setLoadingBids(false);
    }
  };

  const handleCardClick = async () => {
    const next = !showHistory;
    setShowHistory(next);
    if (next && !hasLoadedBids) {
      await loadBids();
    }
  };

  return (
    <>
      <article
        className={`deal-card ${isLeading ? "deal-card-leading" : ""} ${
          showHistory ? "history-mode" : ""
        }`}
        onClick={handleCardClick}
      >
        {/* Bouton favori en haut à droite */}
        <button
          className={`favorite-btn ${favorite ? "favorite-active" : ""} ${
            favoriteLoading ? "favorite-loading" : ""
          }`}
          onClick={toggleFavorite}
          aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
        >
          {favoriteLoading ? "☆" : favorite ? "★" : "☆"}
        </button>

        {/* Contenu normal de la carte */}
        <div className="card-content">
          {imageUrl && (
            <div className="deal-card-image-wrapper">
              <img src={imageUrl} alt={name} className="deal-card-image" />
            </div>
          )}

          <div className="deal-card-body">
            <div className="deal-card-header">
              <h3 className="deal-card-title">
                {name}
                {isLeading && <span className="leader-crown">👑</span>}
              </h3>
              <span className="deal-card-condition">
                {formatCondition(condition)}
              </span>
            </div>

            <p className="deal-card-description">{description}</p>

            <div className="deal-card-prices">
              <div>
                <span className="deal-card-label">Actual Price</span>
                <div className="deal-card-price">{Math.floor(price)} €</div>
              </div>
              <div>
                <span className="deal-card-label">Starting Price</span>
                <div className="deal-card-subprice">
                  {Math.floor(startingPrice)} €
                </div>
              </div>
              <div>
                <span className="deal-card-label">Bid Step</span>
                <div className="deal-card-subprice">
                  +{Math.floor(bidStep)} €
                </div>
              </div>
            </div>

            <div className="deal-card-footer">
              <div className="deal-card-countdown">
                <span className="deal-card-label">Time Left</span>
                <span
                  className={`deal-card-countdown-value ${
                    isEnded ? "ended" : ""
                  }`}
                >
                  {timeLeftLabel}
                </span>
              </div>

              {isEnded ? (
                <button type="button" className="deal-card-bid-button" disabled>
                  Ended
                </button>
              ) : isLeading ? (
                <div className="deal-card-leader-tag">
                  You are currently leading
                </div>
              ) : (
                <button
                  type="button"
                  className="deal-card-bid-button"
                  disabled={isEnded || isBidding}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleBidClick();
                  }}
                >
                  {isEnded ? "Ended" : isBidding ? "Bidding..." : "Bid"}
                </button>
              )}
            </div>

            {bidError && <p className="bid-error-message">{bidError}</p>}
          </div>
        </div>
      </article>

      {/* Modal d'historique */}
      {showHistory && (
        <div
          className="bid-modal-overlay"
          onClick={() => setShowHistory(false)}
        >
          <div
            className="bid-modal history-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="history-header">
              <h3>Bid History - {name}</h3>
              <button
                className="history-close"
                onClick={() => setShowHistory(false)}
              >
                ✕
              </button>
            </div>

            <div className="history-content">
              {loadingBids && <p className="history-loading">Loading bids…</p>}

              {bidsError && !loadingBids && (
                <p className="history-error">{bidsError}</p>
              )}

              {!loadingBids && !bidsError && bids.length === 0 && (
                <p className="history-empty">No bids yet on this item.</p>
              )}

              {!loadingBids && bids.length > 0 && (
                <div className="history-list">
                  {bids.map((bid) => (
                    <div key={bid.id} className="history-item">
                      <div className="bid-info">
                        <span className="bid-amount">
                          {Math.floor(bid.amount)} €
                        </span>
                        <span className="bid-user">
                          {bid.userName ||
                            bid.userEmail?.split("@")[0] ||
                            "Anonymous"}
                        </span>
                      </div>
                      <span className="bid-date">
                        {new Date(bid.createdAt).toLocaleString("fr-BE", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {confirmOpen && (
        <div
          className="bid-modal-overlay"
          onClick={() => setConfirmOpen(false)}
        >
          <div className="bid-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Confirm your bid</h3>
            <p>
              Are you sure you want to place a bid of{" "}
              <strong>{Math.floor(currentPrice + bidStep)} €</strong> ?
            </p>

            <div className="bid-modal-actions">
              <button
                className="btn-cancel"
                onClick={() => setConfirmOpen(false)}
              >
                Cancel
              </button>

              <button
                className="btn-confirm"
                onClick={async () => {
                  setConfirmOpen(false);
                  await handleBid();
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
