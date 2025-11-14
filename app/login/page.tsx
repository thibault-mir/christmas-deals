/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @next/next/no-img-element */
// app/login/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ParticlesBackground from "@/components/ParticlesBackground";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push("/homepage");
      } else {
        setError(data.error);
      }
    } catch {
      setError("Error Fatal Thanks Chuck Norris");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <ParticlesBackground />
      <div className="login-bg"></div>

      <header className="login-header">
        <Link href="/">
          <img src="/images/logo.png" alt="Logo" width="222" height="56" />
        </Link>
      </header>

      <main className="login-main">
        <section className="login-card">
          <h1 className="login-title">Welcome back</h1>
          <p className="login-subtitle">Log in to access Christmas Deals</p>

          {error && (
            <div
              style={{
                background: "rgba(255, 107, 107, 0.1)",
                color: "#ff6b6b",
                padding: "12px 16px",
                borderRadius: "12px",
                marginBottom: "20px",
                textAlign: "center",
                border: "1px solid rgba(255, 107, 107, 0.3)",
                fontSize: "14px",
                fontWeight: "600",
                backdropFilter: "blur(8px)",
                animation: "shake 0.5s ease-in-out",
              }}
            >
              ❌ {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="login-form-group">
              <label className="login-label">Email</label>
              <input
                className="login-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="login-form-group">
              <label className="login-label">Password</label>
              <input
                className="login-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <button type="submit" className="login-button" disabled={loading}>
              {loading ? "Logging in..." : "Log In"}
            </button>
          </form>
          <p className="login-footer-text">
            Don't have an account?{" "}
            <Link
              href="/register"
              style={{
                color: "#00c9a7",
                textDecoration: "none",
                fontWeight: "600",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.textDecoration = "underline";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.textDecoration = "none";
              }}
            >
              Sign up
            </Link>
          </p>
          <p className="login-footer-text">
            <Link
              href="/forgot-password"
              style={{
                color: "#00c9a7",
                textDecoration: "none",
                fontWeight: "600",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.textDecoration = "underline";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.textDecoration = "none";
              }}
            >
              Forgot Password?
            </Link>
          </p>
        </section>
      </main>
    </div>
  );
}
