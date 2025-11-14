/* eslint-disable @next/next/no-img-element */
// app/page.tsx
import Link from "next/link";
import ParticlesBackground from "@/components/ParticlesBackground";

export default function HomePage() {
  return (
    <div className="home-page">
      <ParticlesBackground />
      {/* Même background que login */}
      <div className="login-bg"></div>

      <div
        style={{
          position: "relative",
          zIndex: 1,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
          textAlign: "center",
        }}
      >
        {/* Logo */}
        <img
          src="/images/logo.png"
          alt="Christmas Deals by Servier"
          width="280"
          height="70"
          style={{ marginBottom: "40px" }}
        />

        <h1
          style={{
            fontFamily: "Fredoka One, cursive",
            fontSize: "3rem",
            marginBottom: "20px",
            background: "linear-gradient(120deg, #ff4c73, #ff9552)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Christmas Deals 2025
        </h1>

        <p
          style={{
            marginBottom: "40px",
            fontSize: "1.2rem",
            maxWidth: "500px",
            lineHeight: "1.6",
          }}
        >
          Discover the exceptional Christmas Deals we have prepared for you
        </p>

        <div
          style={{
            display: "flex",
            gap: "20px",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <Link
            href="/login"
            className="login-button"
            style={{ textDecoration: "none", display: "inline-block" }}
          >
            Log in
          </Link>

          <Link
            href="/register"
            style={{
              padding: "12px 30px",
              background: "transparent",
              color: "white",
              textDecoration: "none",
              borderRadius: "999px",
              border: "2px solid #00c9a7",
              fontFamily: "Fredoka One, cursive",
              fontSize: "1.1rem",
              transition: "all 0.3s ease",
            }}
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
