// app/login/page.tsx
"use client";

import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!agreed) {
      setError("Please agree to the Terms of Service and Privacy Policy to continue.");
      return;
    }
    setError("");
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: typeof window !== "undefined" ? window.location.origin : undefined,
      },
    });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setSent(true);
    }
  }

  return (
    <main style={styles.body}>
      <div style={styles.card}>
        <div style={styles.eyebrow}>Word Spring</div>
        <h1 style={styles.h1}>Sign in</h1>
        {sent ? (
          <p style={styles.p}>
            Check your inbox — we sent a sign-in link to <b>{email}</b>. Click it to continue.
          </p>
        ) : (
          <form onSubmit={handleLogin}>
            <label style={styles.label}>Email address</label>
            <input
              style={styles.input}
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
            <label style={styles.agreeRow}>
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                style={styles.checkbox}
              />
              <span>
                I agree to the{" "}
                <a href="/terms" target="_blank" rel="noopener noreferrer" style={styles.link}>
                  Terms of Service
                </a>
                ,{" "}
                <a href="/privacy" target="_blank" rel="noopener noreferrer" style={styles.link}>
                  Privacy Policy
                </a>
                , and{" "}
                <a href="/usage-policy" target="_blank" rel="noopener noreferrer" style={styles.link}>
                  Usage Policy
                </a>
                .
              </span>
            </label>
            <button style={styles.btn} type="submit" disabled={loading || !agreed}>
              {loading ? "Sending…" : "Send sign-in link"}
            </button>
            {error && <div style={styles.error}>{error}</div>}
          </form>
        )}
      </div>

      <p style={styles.blurb}>
        Word Spring turns what you say out loud into a polished, formal email — dictate your message, pick a
        language and tone, and get a ready-to-send draft in seconds. No password to remember: we email you a
        one-time sign-in link instead.
      </p>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  body: { background: "#1C2333", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 20, fontFamily: "sans-serif" },
  card: { background: "#262E44", border: "1px solid rgba(154,166,190,0.18)", borderRadius: 14, padding: 32, maxWidth: 380, width: "100%" },
  eyebrow: { fontSize: 12, letterSpacing: "0.28em", color: "#7C8BA3", textTransform: "uppercase", marginBottom: 10 },
  h1: { fontWeight: 700, fontSize: 26, margin: "0 0 20px", color: "#E9E5D8" },
  label: { display: "block", fontSize: 12, color: "#9AA6BE", marginBottom: 6 },
  input: { width: "100%", background: "#1C2333", color: "#E9E5D8", border: "1px solid rgba(154,166,190,0.3)", borderRadius: 8, padding: "10px 12px", fontSize: 14, marginBottom: 16, boxSizing: "border-box" },
  agreeRow: { display: "flex", alignItems: "flex-start", gap: 8, fontSize: 12, color: "#9AA6BE", marginBottom: 18, lineHeight: 1.6, cursor: "pointer" },
  checkbox: { marginTop: 2, flexShrink: 0 },
  link: { color: "#E9A5A5", textDecoration: "underline" },
  btn: { width: "100%", background: "#B33A3A", color: "#E9E5D8", border: "none", borderRadius: 10, padding: 13, fontSize: 15, fontWeight: 600, cursor: "pointer" },
  error: { color: "#F1C9C9", fontSize: 13, marginTop: 12 },
  p: { color: "#E9E5D8", fontSize: 14, lineHeight: 1.7 },
  blurb: { color: "#7C8BA3", fontSize: 13, lineHeight: 1.8, maxWidth: 380, textAlign: "center", marginTop: 24 },
};
