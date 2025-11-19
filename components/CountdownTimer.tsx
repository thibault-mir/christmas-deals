// components/CountdownTimer.tsx
"use client";

import { useState, useEffect } from "react";

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 34,
    hours: 1,
    minutes: 58,
    seconds: 9,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = { ...prev };

        if (newTime.seconds > 0) {
          newTime.seconds--;
        } else {
          newTime.seconds = 59;
          if (newTime.minutes > 0) {
            newTime.minutes--;
          } else {
            newTime.minutes = 59;
            if (newTime.hours > 0) {
              newTime.hours--;
            } else {
              newTime.hours = 23;
              if (newTime.days > 0) {
                newTime.days--;
              }
            }
          }
        }

        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="countdown">
      <div className="countdown-grid">
        <div className="countdown-item">
          <div className="countdown-number">{timeLeft.days}</div>
          <div className="countdown-label">DAYS</div>
        </div>
        <div className="countdown-item">
          <div className="countdown-number">{timeLeft.hours}</div>
          <div className="countdown-label">HOURS</div>
        </div>
        <div className="countdown-item">
          <div className="countdown-number">{timeLeft.minutes}</div>
          <div className="countdown-label">MINUTES</div>
        </div>
        <div className="countdown-item">
          <div className="countdown-number">{timeLeft.seconds}</div>
          <div className="countdown-label">SECONDS</div>
        </div>
      </div>

      <style jsx>{`
        .countdown {
          margin-top: 2rem;
          margin-bottom: 2rem;
        }

        .countdown-grid {
          display: flex;
          gap: 3rem;
        }

        .countdown-item {
          text-align: center;
        }

        .countdown-number {
          font-family: "Fredoka One", cursive;
          font-size: 5.5rem;
          font-weight: 100;
          color: white;
          margin-bottom: 0.1rem;
        }

        .countdown-label {
          font-family: "Fredoka One", cursive;
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.8);
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        @media (max-width: 768px) {
          .countdown-grid {
            gap: 1.5rem;
          }

          .countdown-number {
            font-size: 2rem;
          }

          .countdown-label {
            font-size: 0.8rem;
          }
        }
      `}</style>
    </div>
  );
};

export default CountdownTimer;
