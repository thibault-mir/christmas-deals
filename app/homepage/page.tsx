/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
// app/homepage/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import ParticlesBackground from "@/components/ParticlesBackground";
import Navbar from "@/components/NavBar";
import CountdownTimer from "@/components/CountdownTimer";

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
              <span>
                <img src="images/chapeau.png" alt="" width="195" height="182" />
                C
              </span>
              hristmas Deals <br />
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
          <div className="section-inner">
            <h2>À propos</h2>
            <p>
              Explique ici le concept de tes enchères, les règles, le
              fonctionnement, etc.
            </p>
          </div>
        </section>

        {/* DEALS - FOND ROUGE NOËL */}
        <section id="deals" className="section section-deals">
          <div className="section-inner">
            <h2>Les enchères</h2>
            <p>Liste, cartes, tableaux… à toi de jouer ici 😈.</p>
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
