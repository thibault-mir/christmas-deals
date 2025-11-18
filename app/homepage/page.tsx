/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
// app/homepage/page.tsx
"use client";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import ParticlesBackground from "@/components/ParticlesBackground";
import Navbar from "@/components/NavBar";
import CountdownTimer from "@/components/CountdownTimer";
import DealCard, { DealCardProps } from "@/components/DealCard";
import { useReveal } from "@/app/utils/useReveal";

export default function Homepage() {
  const router = useRouter();
  const textAbout = useReveal();
  const imageAbout = useReveal();
  const textCelebrate = useReveal();
  const imageCelebrate = useReveal();
  const textContacts = useReveal();
  const imageContacts = useReveal();

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

  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<"PRICE_ASC" | "PRICE_DESC">("PRICE_ASC");

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

  const categories = useMemo(() => {
    const cats = Array.from(
      new Set(deals.map((d) => d.category).filter((c): c is string => !!c))
    );
    return cats;
  }, [deals]);

  const visibleDeals = useMemo(() => {
    let list = [...deals];

    if (selectedCategory !== "ALL") {
      list = list.filter((d) => d.category === selectedCategory);
    }

    switch (sortBy) {
      case "PRICE_ASC":
        list.sort((a, b) => a.currentPrice - b.currentPrice);
        break;
      case "PRICE_DESC":
        list.sort((a, b) => b.currentPrice - a.currentPrice);
        break;
      default:
        list.sort(
          (a, b) => new Date(a.endsAt).getTime() - new Date(b.endsAt).getTime()
        );
        break;
    }

    return list;
  }, [deals, selectedCategory, sortBy]);

  return (
    <div className="site-wrapper">
      {/* NAVBAR FLOTTANTE */}
      <Navbar />

      <main>
        {/* HERO / HOME AVEC BACKGROUND + NEIGE */}
        <section id="home" className="section section-hero">
          {/* Neige uniquement sur le hero */}
          <ParticlesBackground
            mode="section"
            id="particles-hero"
            density={140}
            size={4}
          />

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
            <div
              data-reveal="left"
              ref={textAbout.ref}
              className={`about-text-col ${textAbout.visible ? "visible" : ""}`}
            >
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
                    <img
                      src="/images/website.png"
                      width={40}
                      height={40}
                      style={{ float: "left" }}
                      alt="Website Icon"
                    />
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
                    <img
                      src="/images/calendar.png"
                      width={37}
                      height={37}
                      style={{ float: "left" }}
                      alt="Website Icon"
                    />
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
                    <img
                      src="/images/rules.png"
                      width={37}
                      height={37}
                      style={{ float: "left" }}
                      alt="Website Icon"
                    />
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
            <div
              data-reveal="right"
              ref={imageAbout.ref}
              className={`about-image-col ${
                imageAbout.visible ? "visible" : ""
              }`}
            >
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
          {!loadingDeals && deals.length > 0 && (
            <ParticlesBackground
              mode="section"
              id="particles-deals"
              density={140}
              size={4}
            />
          )}
          <div className="section-inner">
            <h2 className="about-title" style={{ color: "#fff" }}>
              Deals
            </h2>

            {/* FILTRES */}
            {!loadingDeals && deals.length > 0 && (
              <div className="deals-filters">
                <div className="deals-filter-group">
                  <span className="deals-filter-label">Category</span>
                  <div className="deals-filter-chips">
                    <button
                      type="button"
                      className={
                        selectedCategory === "ALL"
                          ? "deals-filter-chip active"
                          : "deals-filter-chip"
                      }
                      onClick={() => setSelectedCategory("ALL")}
                    >
                      All
                    </button>
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        className={
                          selectedCategory === cat
                            ? "deals-filter-chip active"
                            : "deals-filter-chip"
                        }
                        onClick={() => setSelectedCategory(cat)}
                      >
                        {cat.toLowerCase().replace(/_/g, " ")}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="deals-filter-group">
                  <span className="deals-filter-label">Sort by</span>
                  <div className="deals-filter-chips">
                    <button
                      type="button"
                      className={
                        sortBy === "PRICE_ASC"
                          ? "deals-filter-chip active"
                          : "deals-filter-chip"
                      }
                      onClick={() => setSortBy("PRICE_ASC")}
                    >
                      Price ↑
                    </button>
                    <button
                      type="button"
                      className={
                        sortBy === "PRICE_DESC"
                          ? "deals-filter-chip active"
                          : "deals-filter-chip"
                      }
                      onClick={() => setSortBy("PRICE_DESC")}
                    >
                      Price ↓
                    </button>
                  </div>
                </div>
              </div>
            )}
            {loadingDeals && <p>Loading Deals…</p>}

            {dealsError && !loadingDeals && (
              <p style={{ color: "#ffdddd" }}>{dealsError}</p>
            )}

            {!loadingDeals && deals.length === 0 && !dealsError && (
              <p>No active deals at the moment.</p>
            )}

            {!loadingDeals && visibleDeals.length === 0 && !dealsError && (
              <p>No deals match your filters.</p>
            )}

            {!loadingDeals && visibleDeals.length > 0 && (
              <div className="deals-grid">
                {visibleDeals.map((deal) => (
                  <DealCard key={deal.id} {...deal} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* CELEBRATE */}
        <section
          id="celebrate"
          className="section section-celebrate section-about"
        >
          <div className="section-inner about-grid">
            {/* TEXT COLUMN */}
            <div
              data-reveal="left"
              ref={textCelebrate.ref}
              className={`about-text-col ${
                textCelebrate.visible ? "visible" : ""
              }`}
            >
              <h2 className="about-title">Celebrate</h2>

              <p className="about-lead">
                Discover how this exclusive Christmas auction event works. Learn
                about participation rules, auction mechanisms, and when you’ll
                be able to place bids and win amazing holiday gifts.
              </p>

              <div className="about-detail-list">
                {/* Dates */}
                <div className="about-detail-item">
                  <div>
                    <img
                      src="/images/calendar.png"
                      width={37}
                      height={37}
                      style={{ float: "left" }}
                      alt="Website Icon"
                    />
                    <p className="about-detail-title">
                      <span>December 18 - 17h</span>
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
                    <img
                      src="/images/lieu.png"
                      width={37}
                      height={37}
                      style={{ float: "left" }}
                      alt="Website Icon"
                    />
                    <p className="about-detail-title">
                      <span>Buxelles, 57 Boulevard International</span>
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
            <div
              data-reveal="right"
              ref={imageCelebrate.ref}
              className={`about-image-col ${
                imageCelebrate.visible ? "visible" : ""
              }`}
            >
              <div className="about-image-wrapper">
                <img
                  src="/images/celebrate.jpg"
                  alt="Christmas Deals Event"
                  className="about-image"
                />
              </div>
            </div>
          </div>
        </section>

        {/* CONTACTS */}
        <section id="contacts" className="section section-contacts">
          <div className="section-inner contacts-grid">
            <div
              data-reveal="left"
              ref={textContacts.ref}
              className={`contacts-text-col ${
                textContacts.visible ? "visible" : ""
              }`}
            >
              <h2 className="contacts-title">Contact us</h2>
              <p className="contacts-lead">
                Have a question about Christmas Deals, bidding rules or your
                account? Feel free to reach out — the organizing team will get
                back to you as soon as possible.
              </p>

              <div className="contacts-info-list">
                <div className="contacts-info-item">
                  <span className="contacts-info-icon">📧</span>
                  <div>
                    <p className="contacts-info-label">Email</p>
                    <p className="contacts-info-value">
                      christmas.deals@servier.com
                    </p>
                  </div>
                </div>

                <div className="contacts-info-item">
                  <span className="contacts-info-icon">💼</span>
                  <div>
                    <p className="contacts-info-label">Internal chat</p>
                    <p className="contacts-info-value">
                      Servier Teams &nbsp;→&nbsp; “Christmas Deals Support”
                    </p>
                  </div>
                </div>

                <div className="contacts-info-item">
                  <span className="contacts-info-icon">⏰</span>
                  <div>
                    <p className="contacts-info-label">Response time</p>
                    <p className="contacts-info-value">
                      Usually within 1–2 working days during the event period.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Colonne formulaire */}
            <div
              data-reveal="right"
              ref={imageContacts.ref}
              className={`contacts-text-col ${
                imageContacts.visible ? "visible" : ""
              }`}
            >
              <form
                className="contacts-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  alert("This is a demo form for now 🤭");
                }}
              >
                <h3 className="contacts-form-title">Send us a message</h3>

                <div className="contacts-form-group">
                  <label className="contacts-label" htmlFor="contact-name">
                    Name
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    className="contacts-input"
                    placeholder="Your name"
                    required
                  />
                </div>

                <div className="contacts-form-group">
                  <label className="contacts-label" htmlFor="contact-email">
                    Email
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    className="contacts-input"
                    placeholder="you@servier.com"
                    required
                  />
                </div>

                <div className="contacts-form-group">
                  <label className="contacts-label" htmlFor="contact-message">
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    className="contacts-textarea"
                    placeholder="How can we help you?"
                    rows={4}
                    required
                  />
                </div>

                <button type="submit" className="contacts-submit">
                  Send message
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="site-footer">
          <div className="footer-inner">
            <p className="footer-text">
              © {new Date().getFullYear()} Christmas Deals — Internal project
              for Servier Belgium.
            </p>

            <p className="footer-powered">
              Powered by <span>🎄 Chuck Norris Touch</span>
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}
