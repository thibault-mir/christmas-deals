/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";

type Condition = "NEW" | "LIKE_NEW" | "VERY_GOOD" | "GOOD" | "USED" | string;

export interface DealCardProps {
  id: string;
  name: string;
  description: string;
  condition: Condition;
  imageUrl?: string | null;
  currentPrice: number;
  startingPrice: number;
  bidStep: number;
  endsAt: string; // ISO string
}

function formatCondition(condition: Condition) {
  switch (condition) {
    case "NEW":
      return "Neuf";
    case "LIKE_NEW":
      return "Comme neuf";
    case "VERY_GOOD":
      return "Très bon état";
    case "GOOD":
      return "Bon état";
    case "USED":
      return "Utilisé";
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
            <span className="deal-card-label">Prix actuel</span>
            <div className="deal-card-price">{currentPrice.toFixed(2)} €</div>
          </div>
          <div>
            <span className="deal-card-label">Prix de départ</span>
            <div className="deal-card-subprice">
              {startingPrice.toFixed(2)} €
            </div>
          </div>
          <div>
            <span className="deal-card-label">Mise</span>
            <div className="deal-card-subprice">+{bidStep.toFixed(2)} €</div>
          </div>
        </div>

        <div className="deal-card-footer">
          <div className="deal-card-countdown">
            <span className="deal-card-label">Temps restant</span>
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
            {isEnded ? "Terminé" : "Enchérir"}
          </button>
        </div>
      </div>
    </article>
  );
}
