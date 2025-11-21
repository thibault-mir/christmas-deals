/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
// app/homepage/page.tsx
"use client";
import { useState, useEffect, useMemo, FormEvent } from "react";
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
  const [deals, setDeals] = useState<DealCardProps[]>([]);
  const [loadingDeals, setLoadingDeals] = useState(true);
  const [dealsError, setDealsError] = useState("");

  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<"PRICE_ASC" | "PRICE_DESC">("PRICE_ASC");
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

  const [favorites, setFavorites] = useState<string[]>([]);
  const [leadingDeals, setLeadingDeals] = useState<string[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<{ type: string; message: string }>({
    type: "",
    message: "",
  });

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

  const handleSubmitContact = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus({ type: "", message: "" });

    // Stocke la référence du formulaire avant la requête async
    const form = e.currentTarget;

    try {
      const formData = new FormData(form);
      const data = {
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        message: formData.get("message") as string,
      };

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        setStatus({
          type: "success",
          message: result.message || "Message envoyé avec succès !",
        });
        // Utilise la référence stockée
        form.reset();
      } else {
        setStatus({
          type: "error",
          message: result.error || "Erreur lors de l'envoi",
        });
      }
    } catch (error) {
      console.error("Erreur:", error);
      setStatus({
        type: "error",
        message: "Erreur de connexion avec le serveur",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Récupère les leading deals au mount
  useEffect(() => {
    const fetchLeadingDeals = async () => {
      try {
        const response = await fetch("/api/user/leading-deals");
        const data = await response.json();
        setLeadingDeals(data.leadingDeals.map((deal: any) => deal.id));
      } catch (error) {
        console.error("Error fetching leading deals:", error);
      }
    };

    fetchLeadingDeals();
  }, []);

  const isUserLeadingAuction = (auctionId: string) => {
    return leadingDeals.includes(auctionId);
  };

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const res = await fetch("/api/favorites");
        if (!res.ok) {
          console.error("Error loading favorites");
          return;
        }

        const data = await res.json();
        // data = user.favorites venant du GET
        const productIds = data.map((fav: any) => fav.productId);
        setFavorites(productIds);
      } catch (err) {
        console.error("Error fetching favorites", err);
      }
    };

    loadFavorites();
  }, []);

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

    // Filtres...
    if (showOnlyFavorites) {
      list = list.filter((d) => favorites.includes(d.productId));
    }
    if (selectedCategory !== "ALL") {
      list = list.filter((d) => d.category === selectedCategory);
    }

    // Tri : leader → favoris → puis tri par prix
    list.sort((a, b) => {
      const isLeaderA = isUserLeadingAuction(a.id);
      const isLeaderB = isUserLeadingAuction(b.id);
      const favA = favorites.includes(a.productId) ? 1 : 0;
      const favB = favorites.includes(b.productId) ? 1 : 0;

      // 1. Leader en ABSOLU premier
      if (isLeaderA !== isLeaderB) {
        return isLeaderB ? 1 : -1; // true (1) avant false (0)
      }

      // 2. Ensuite les favoris
      if (favA !== favB) {
        return favB - favA;
      }

      // 3. Ensuite tri selon sortBy
      if (sortBy === "PRICE_ASC") {
        return a.currentPrice - b.currentPrice;
      }
      if (sortBy === "PRICE_DESC") {
        return b.currentPrice - a.currentPrice;
      }

      return new Date(a.endsAt).getTime() - new Date(b.endsAt).getTime();
    });

    return list;
  }, [
    deals,
    showOnlyFavorites,
    selectedCategory,
    favorites,
    isUserLeadingAuction,
    sortBy,
  ]);

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
                  src="/images/about-santa.png"
                  alt="Christmas Deals Event"
                  className="about-image"
                />
              </div>
            </div>
          </div>
        </section>

        {/* DEALS - FOND ROUGE NOËL */}
        <section id="deals" className="section section-deals section-about">
          {/* {!loadingDeals && deals.length > 0 && (
            // <ParticlesBackground
            //   key={`particles-${selectedCategory}-${sortBy}-${visibleDeals.length}`}
            //   mode="section"
            //   id="particles-deals"
            //   density={140}
            //   size={4}
            // />
          )} */}
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
                    {/* ⭐ Bouton favoris */}
                    <button
                      type="button"
                      className={
                        showOnlyFavorites
                          ? "deals-filter-chip active favorites-chip"
                          : "deals-filter-chip favorites-chip"
                      }
                      onClick={() => setShowOnlyFavorites((prev) => !prev)}
                    >
                      ⭐
                    </button>
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
                        {cat
                          .toLowerCase()
                          .replace(/_/g, " ")
                          .replace(/\b\w/g, (l) => l.toUpperCase())}
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
                  <DealCard
                    key={deal.id}
                    {...deal}
                    productId={deal.productId}
                    isFavorite={favorites.includes(deal.productId)}
                    onFavoriteChange={(productId, next) => {
                      setFavorites(
                        (prev) =>
                          next
                            ? [...prev, productId] // ajoute
                            : prev.filter((id) => id !== productId) // retire
                      );
                    }}
                  />
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
                Find out what’s happening for our end-of-year dinner. It all
                takes place in Katterbroek, with everyone bringing a little
                touch of boho chic—just come ready to enjoy good vibes and a
                great night.
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
                      <span>Thursday 18 December - 18h30</span>
                    </p>
                    <p className="about-detail-text">
                      The evening kicks off at 18:30 and flows until around
                      00:30. You’re free to enjoy the night’s vibe from start to
                      finish.
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
                      <span>Elegemstraat 160 - 1700 Dilbeek</span>
                    </p>
                    <p className="about-detail-text">
                      The party happens in a place so fucking beautiful even the
                      great Chuck Norris knocks before entering.
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
                <a
                  href="https://kattebroek.be/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="about-image-link"
                >
                  <img
                    src="/images/celebrate.jpg"
                    alt="Christmas Deals Event"
                    className="about-image"
                  />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* CONTACTS */}
        <section id="contacts" className="section section-contacts">
          <ParticlesBackground
            mode="section"
            id="particles-contacts"
            density={140}
            size={4}
          />
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
                      care4all.belux@servier.com
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
              <form className="contacts-form" onSubmit={handleSubmitContact}>
                <h3 className="contacts-form-title">Send us a message</h3>

                <div className="contacts-form-group">
                  <label className="contacts-label" htmlFor="contact-name">
                    Name
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    className="contacts-input"
                    placeholder="Your name"
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="contacts-form-group">
                  <label className="contacts-label" htmlFor="contact-email">
                    Email
                  </label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    className="contacts-input"
                    placeholder="you@servier.com"
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="contacts-form-group">
                  <label className="contacts-label" htmlFor="contact-message">
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    className="contacts-textarea"
                    placeholder="How can we help you?"
                    rows={4}
                    required
                    disabled={isLoading}
                  />
                </div>

                <button
                  type="submit"
                  className={`contacts-submit ${
                    status.type === "success"
                      ? "contacts-submit-success"
                      : status.type === "error"
                      ? "contacts-submit-error"
                      : ""
                  }`}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="contacts-submit-spinner"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="2"
                          fill="none"
                          strokeDasharray="15.85 15.85"
                        />
                      </svg>
                      Sending...
                    </>
                  ) : status.type === "success" ? (
                    <>🎉 Message Sent !</>
                  ) : status.type === "error" ? (
                    <>⚠️ Something went wrong</>
                  ) : (
                    "Send message"
                  )}
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
              for Servier Belgium
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
