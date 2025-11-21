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

interface User {
  id: string;
  email: string;
  name: string | null;
}

export default function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<SectionId>("home");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [accountDropdown, setAccountDropdown] = useState(false);

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Récupère l'utilisateur connecté
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/user/me");
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        } else {
          console.log("User not authenticated");
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // Fonction pour vérifier si l'utilisateur est admin
  const isAdmin = user?.email === "test@test.com";

  // Fonction pour obtenir l'initial depuis le name ou l'email
  const getUserInitial = () => {
    if (!user) return "U";

    if (user.name) {
      return user.name.charAt(0).toUpperCase();
    }

    return user.email.charAt(0).toUpperCase();
  };

  // Fonction pour obtenir le nom affichable
  const getDisplayName = () => {
    if (!user) return "User";

    if (user.name) {
      return user.name;
    }

    return user.email.split("@")[0];
  };

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);

      const offset = 140;
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
    setMobileOpen(false);
  };

  const toggleAccountDropdown = () => {
    setAccountDropdown(!accountDropdown);
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
        <nav
          className={`nav-menu ${mobileOpen ? "nav-menu-open" : ""} ${
            mobileOpen && isAdmin ? "nav-menu-open-admin" : ""
          }`}
        >
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

          {/* Section Account - Visible seulement en mobile */}
          <div className="nav-mobile-account">
            <div className="nav-link">Welcome {getDisplayName()} !</div>
            <Link
              href="/account"
              className="nav-link"
              onClick={() => setMobileOpen(false)}
            >
              My Account
            </Link>

            {/* Lien Admin Console pour mobile */}
            {isAdmin && (
              <Link
                href="/admin"
                className="nav-link"
                onClick={() => setMobileOpen(false)}
                style={{
                  color: "#00c9a7",
                }}
              >
                Admin Console
              </Link>
            )}

            <Link
              href="#"
              className="nav-link nav-mobile-account-logout"
              onClick={async (e) => {
                e.preventDefault();
                try {
                  const response = await fetch("/api/logout", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                  });

                  if (response.ok) {
                    console.log("✅ Logout successful");
                    window.location.href = "/";
                  } else {
                    console.error("❌ Logout failed");
                  }
                } catch (error) {
                  console.error("❌ Logout error:", error);
                } finally {
                  setMobileOpen(false);
                }
              }}
            >
              <img
                src="/images/logoff.png"
                alt="Log Out"
                style={{
                  width: "3%",
                  marginRight: "8px",
                }}
              />
              Log Out
            </Link>
          </div>

          {!loading && user && (
            <div className="nav-account-wrapper">
              <button
                className="nav-avatar"
                onClick={toggleAccountDropdown}
                aria-label="Account menu"
              >
                <span className="nav-avatar-initial">{getUserInitial()}</span>
                {isAdmin && (
                  <span
                    className="nav-avatar-badge"
                    style={{
                      position: "absolute",
                      top: "-2px",
                      right: "-2px",
                      background: "#00c9a7",
                      color: "#013932",
                      borderRadius: "50%",
                      width: "12px",
                      height: "12px",
                      fontSize: "8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: "bold",
                    }}
                  >
                    A
                  </span>
                )}
              </button>

              {accountDropdown && (
                <div className="nav-dropdown">
                  <div className="nav-dropdown-user-info">
                    <div className="nav-dropdown-user-name">
                      Welcome <br />
                      {getDisplayName()} !
                      {isAdmin && (
                        <span
                          style={{
                            background: "#00c9a7",
                            color: "#013932",
                            fontSize: "0.7rem",
                            padding: "2px 6px",
                            borderRadius: "10px",
                            marginLeft: "8px",
                            fontWeight: "bold",
                          }}
                        >
                          ADMIN
                        </span>
                      )}
                    </div>
                  </div>

                  <Link
                    href="/account"
                    className="nav-dropdown-item"
                    onClick={() => setAccountDropdown(false)}
                  >
                    My Account
                  </Link>

                  {/* Lien Admin Console pour desktop */}
                  {isAdmin && (
                    <Link
                      href="/admin"
                      className="nav-dropdown-item"
                      onClick={() => setAccountDropdown(false)}
                      style={{
                        color: "#00c9a7",
                      }}
                    >
                      Admin Console
                    </Link>
                  )}

                  <button
                    className="nav-dropdown-item nav-dropdown-logout"
                    onClick={async () => {
                      try {
                        await fetch("/api/logout", { method: "POST" });
                        window.location.href = "/";
                      } catch (error) {
                        console.error("Logout error:", error);
                      } finally {
                        setAccountDropdown(false);
                      }
                    }}
                  >
                    <img
                      src="/images/logoff.png"
                      alt="Log Out"
                      style={{ width: "8%" }}
                    />
                    Log Out
                  </button>
                </div>
              )}
            </div>
          )}
        </nav>
      </div>
      {/* Overlay pour fermer le dropdown en cliquant ailleurs */}
      {accountDropdown && (
        <div
          className="dropdown-overlay"
          onClick={() => setAccountDropdown(false)}
        />
      )}
    </header>
  );
}
