/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const SECTION_IDS = [
  "home",
  "about",
  "deals",
  "celebrate",
  "contacts",
] as const;
type SectionId = (typeof SECTION_IDS)[number];

export default function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<SectionId>("home");
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);

      const offset = 140; // marge pour tenir compte de la navbar
      let current: SectionId = "home";

      SECTION_IDS.forEach((id) => {
        const el = document.getElementById(id);
        if (!el) return;

        const top = el.offsetTop - offset;
        const bottom = top + el.offsetHeight;

        if (y >= top && y < bottom) {
          current = id;
        }
      });

      setActiveSection(current);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const linkClass = (id: SectionId) =>
    `nav-link ${activeSection === id ? "nav-link-active" : ""}`;

  const handleLinkClick = (id: SectionId) => {
    setActiveSection(id);
    setMobileOpen(false); // on referme le menu sur mobile
  };

  return (
    <header className={`navbar ${scrolled ? "navbar-scrolled" : ""}`}>
      <div className="nav-container">
        {/* Logo gauche */}
        <div className="nav-logo" style={{ marginTop: "-10px" }}>
          <Link href="/">
            <img
              src="/images/logo.png"
              alt="Christmas Deals by Servier"
              width={222}
              height={56}
            />
          </Link>
        </div>

        {/* Bouton burger (mobile) */}
        <button
          className={`nav-toggle ${mobileOpen ? "nav-toggle-open" : ""}`}
          type="button"
          aria-label="Toggle navigation"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((prev) => !prev)}
        >
          <span />
          <span />
          <span />
        </button>

        {/* Menu */}
        <nav className={`nav-menu ${mobileOpen ? "nav-menu-open" : ""}`}>
          <Link
            href="#home"
            className={linkClass("home")}
            onClick={() => handleLinkClick("home")}
          >
            Home
          </Link>
          <Link
            href="#about"
            className={linkClass("about")}
            onClick={() => handleLinkClick("about")}
          >
            About
          </Link>
          <Link
            href="#deals"
            className={linkClass("deals")}
            onClick={() => handleLinkClick("deals")}
          >
            Deals
          </Link>
          <Link
            href="#celebrate"
            className={linkClass("celebrate")}
            onClick={() => handleLinkClick("celebrate")}
          >
            Celebrate
          </Link>
          <Link
            href="#contacts"
            className={linkClass("contacts")}
            onClick={() => handleLinkClick("contacts")}
          >
            Contacts
          </Link>
        </nav>
      </div>
    </header>
  );
}
