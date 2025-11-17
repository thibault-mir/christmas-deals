/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";

type Condition = "NEW" | "LIKE_NEW" | "VERY_GOOD" | "GOOD" | "USED" | string;

export interface DealCardProps {
  id: string;
  name: string;
  description: string;
  condition: Condition;
  category?: string;
  imageUrl?: string | null;
  currentPrice: number;
  startingPrice: number;
  bidStep: number;
  endsAt: string; // ISO string
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
  } = props;

  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const endTime = new Date(endsAt).getTime();
  const timeLeft = endTime - now;
  const timeLeftLabel = formatTimeLeft(timeLeft);
  const isEnded = timeLeft <= 0;

  return (
    <article className="deal-card">
      {imageUrl && (
        <div className="deal-card-image-wrapper">
          <img src={imageUrl} alt={name} className="deal-card-image" />
        </div>
      )}

      <div className="deal-card-body">
        <div className="deal-card-header">
          <h3 className="deal-card-title">{name}</h3>
          <span className="deal-card-condition">
            {formatCondition(condition)}
          </span>
        </div>

        <p className="deal-card-description">{description}</p>

        <div className="deal-card-prices">
          <div>
            <span className="deal-card-label">Actual Price</span>
            <div className="deal-card-price">{Math.floor(currentPrice)} €</div>
          </div>
          <div>
            <span className="deal-card-label">Starting Price</span>
            <div className="deal-card-subprice">
              {Math.floor(startingPrice)} €
            </div>
          </div>
          <div>
            <span className="deal-card-label">Bid Step</span>
            <div className="deal-card-subprice">{Math.floor(bidStep)} €</div>
          </div>
        </div>

        <div className="deal-card-footer">
          <div className="deal-card-countdown">
            <span className="deal-card-label">Time Left</span>
            <span
              className={`deal-card-countdown-value ${isEnded ? "ended" : ""}`}
            >
              {timeLeftLabel}
            </span>
          </div>

          <button
            type="button"
            className="deal-card-bid-button"
            disabled={isEnded}
          >
            {isEnded ? "Ended" : "Bid"}
          </button>
        </div>
      </div>
    </article>
  );
}
