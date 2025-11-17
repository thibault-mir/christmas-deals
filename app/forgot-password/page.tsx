/* eslint-disable @next/next/no-img-element */
// app/forgot-password/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ParticlesBackground from "@/components/ParticlesBackground";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message);
        setEmail("");
      } else {
        setError(data.error);
      }
    } catch {
      setError("Error processing request");
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
          <h1 className="login-title">Reset Password</h1>
          <p className="login-subtitle">
            Enter your email to receive your password.
          </p>

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
              }}
            >
              ❌ {error}
            </div>
          )}

          {message && (
            <div
              style={{
                background: "rgba(0, 201, 167, 0.1)",
                color: "#00c9a7",
                padding: "12px 16px",
                borderRadius: "12px",
                marginBottom: "20px",
                textAlign: "center",
                border: "1px solid rgba(0, 201, 167, 0.3)",
                fontSize: "14px",
                fontWeight: "600",
                backdropFilter: "blur(8px)",
              }}
            >
              ✅ {message}
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
                placeholder="your@email.com"
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
              }}
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>

          <p className="login-footer-text">
            Remember your password?{" "}
            <Link
              href="/login"
              style={{
                color: "#00c9a7",
                textDecoration: "none",
                fontWeight: "600",
              }}
            >
              Back to Login
            </Link>
          </p>
        </section>
      </main>
    </div>
  );
}
