/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
// app/homepage/page.tsx
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ParticlesBackground from "@/components/ParticlesBackground";
import Navbar from "@/components/NavBar";
import CountdownTimer from "@/components/CountdownTimer";
import DealCard, { DealCardProps } from "@/components/DealCard";

export default function Homepage() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/check");
        const data = await res.json();

        if (!data.authenticated) {
          router.push("/login");
        }
      } catch (error) {
        router.push("/login");
      }
    };

    checkAuth();
  }, [router]);

  const [deals, setDeals] = useState<DealCardProps[]>([]);
  const [loadingDeals, setLoadingDeals] = useState(true);
  const [dealsError, setDealsError] = useState("");

  useEffect(() => {
    const loadDeals = async () => {
      try {
        const res = await fetch("/api/deals");
        if (!res.ok) {
          throw new Error("Erreur lors du chargement des enchères");
        }
        const data = await res.json();
        setDeals(data);
      } catch (err: any) {
        console.error(err);
        setDealsError(err.message || "Erreur lors du chargement des enchères");
      } finally {
        setLoadingDeals(false);
      }
    };

    loadDeals();
  }, []);

  return (
    <div className="site-wrapper">
      {/* NAVBAR FLOTTANTE */}
      <Navbar />

      <main>
        {/* HERO / HOME AVEC BACKGROUND + NEIGE */}
        <section id="home" className="section section-hero">
          {/* Neige uniquement sur le hero */}
          <ParticlesBackground mode="section" />

          <div className="section-inner hero-content">
            <h1 className="hero-title title-christmas">
              Christmas Deals <br />
              by Servier
            </h1>
            <p className="hero-subtitle">
              Chuck Norris is back with his new Christmas Deals website.
              Participate in exclusive auctions featuring items and objects
              available only to Servier employees.
            </p>
            <CountdownTimer />
            <div className="hero-actions">
              <a href="#deals" className="btn-primary">
                See Deals
              </a>
              <a href="#about" className="btn-secondary">
                Learn more
              </a>
            </div>
          </div>
        </section>

        {/* ABOUT - FOND BLANC */}
        <section id="about" className="section section-about">
          <div className="section-inner about-grid">
            {/* TEXT COLUMN */}
            <div className="about-text-col">
              <h2 className="about-title">
                About Christmas <br /> Deals
              </h2>

              <p className="about-lead">
                Discover how this exclusive Christmas auction event works. Learn
                about participation rules, auction mechanisms, and when you’ll
                be able to place bids and win amazing holiday gifts.
              </p>

              <div className="about-detail-list">
                {/* Platform */}
                <div className="about-detail-item">
                  <div>
                    <p className="about-detail-title">
                      <span>Christmas Deals by Servier</span>
                    </p>
                    <p className="about-detail-text">
                      Accessible from any Servier workstation or from home using
                      your secure employee account.
                    </p>
                  </div>
                </div>

                {/* Dates */}
                <div className="about-detail-item">
                  <div>
                    <p className="about-detail-title">
                      <span>December 01–18</span>
                    </p>
                    <p className="about-detail-text">
                      Auctions remain open 24/7 throughout the entire event.
                      Winners are notified immediately once bidding closes.
                    </p>
                  </div>
                </div>

                {/* Rules */}
                <div className="about-detail-item">
                  <div>
                    <p className="about-detail-title">
                      <span>Fixed-increment bidding</span>
                    </p>
                    <p className="about-detail-text">
                      Every time you click “Bid”, the price increases by a fixed
                      amount. When the timer hits zero, the highest bidder wins.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* IMAGE COLUMN */}
            <div className="about-image-col">
              <div className="about-image-wrapper">
                <img
                  src="/images/about-santa.jpg"
                  alt="Christmas Deals Event"
                  className="about-image"
                />
              </div>
            </div>
          </div>
        </section>

        {/* DEALS - FOND ROUGE NOËL */}
        <section id="deals" className="section section-deals section-about">
          <div className="section-inner">
            <h1 className="hero-title title-christmas">Deals</h1>

            {loadingDeals && <p>Chargement des enchères…</p>}

            {dealsError && !loadingDeals && (
              <p style={{ color: "#ffdddd" }}>{dealsError}</p>
            )}

            {!loadingDeals && deals.length === 0 && !dealsError && (
              <p>Aucune enchère active pour le moment.</p>
            )}

            {!loadingDeals && deals.length > 0 && (
              <div className="deals-grid" style={{ marginTop: "24px" }}>
                {deals.map((deal) => (
                  <DealCard key={deal.id} {...deal} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* CELEBRATE */}
        <section id="celebrate" className="section section-celebrate">
          <div className="section-inner">
            <h2>Celebrate</h2>
            <p>Un bloc plus “émotion”, images, texte, storytelling.</p>
          </div>
        </section>

        {/* CONTACTS */}
        <section id="contacts" className="section section-contacts">
          <div className="section-inner">
            <h2>Contacts</h2>
            <p>Formulaire, email, etc.</p>
          </div>
        </section>
      </main>
    </div>
  );
}
