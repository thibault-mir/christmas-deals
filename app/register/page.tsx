/* eslint-disable @next/next/no-img-element */
// app/register/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ParticlesBackground from "@/components/ParticlesBackground";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validation
    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Le mot de passe doit faire au moins 6 caractères");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await res.json();

      if (res.ok) {
        // Redirige vers la page de login avec un message de succès
        router.push("/login?message=Compte créé avec succès");
      } else {
        setError(data.error || "Erreur lors de la création du compte");
      }
    } catch {
      setError("Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-bg"></div>
      <ParticlesBackground />

      <header className="login-header">
        <div className="login-header-left">
          <Link href="/">
            <img
              src="/images/logo.png"
              alt="Christmas Deals by Servier"
              width="222"
              height="56"
              style={{ display: "block" }}
            />
          </Link>
        </div>
      </header>

      <main className="login-main">
        <section className="login-card">
          <h1 className="login-title">Create an account</h1>
          <p className="login-subtitle">Join Christmas Deals</p>

          {error && (
            <div
              style={{
                background: "rgba(255, 107, 107, 0.1)",
                color: "#ff6b6b",
                padding: "12px",
                borderRadius: "8px",
                marginBottom: "20px",
                textAlign: "center",
                border: "1px solid rgba(255, 107, 107, 0.3)",
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="login-form-group">
              <label className="login-label" htmlFor="name">
                Name
              </label>
              <input
                className="login-input"
                type="text"
                id="name"
                name="name"
                placeholder="Votre nom"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="login-form-group">
              <label className="login-label" htmlFor="email">
                Email
              </label>
              <input
                className="login-input"
                type="email"
                id="email"
                name="email"
                placeholder="you@servier.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="login-form-group">
              <label className="login-label" htmlFor="password">
                Password
              </label>
              <input
                className="login-input"
                type="password"
                id="password"
                name="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                minLength={6}
              />
              <small
                style={{
                  color: "rgba(255,255,255,0.6)",
                  fontSize: "12px",
                  marginTop: "5px",
                }}
              >
                Minimum 6 characters
              </small>
            </div>

            <div className="login-form-group">
              <label className="login-label" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <input
                className="login-input"
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              className="login-button"
              disabled={loading}
              style={{
                background: "linear-gradient(120deg, #00c9a7, #00a88a)",
                marginTop: "10px",
              }}
            >
              {loading ? "Creating..." : "Create my account"}
            </button>
          </form>

          <p className="login-footer-text">
            Already have an account? <Link href="/login">Log In</Link>
          </p>
        </section>
      </main>
    </div>
  );
}
