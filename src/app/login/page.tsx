"use client";

import Navbar from "@/components/Navbar";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState, Suspense } from "react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/dashboard";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError("Username dan password wajib diisi.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // Simpan info ke localStorage untuk Navbar dan Client-side UI
        localStorage.setItem("user_role", data.role);
        localStorage.setItem("user_name", data.name);
        
        // Redirect ke halaman asal atau dashboard
        router.push(from);
        router.refresh();
      } else {
        setError(data.message || "Gagal masuk. Coba lagi.");
      }
    } catch (err) {
      setError("Terjadi kesalahan koneksi. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const handleAutofill = (role: "admin" | "user") => {
    if (role === "admin") {
      setUsername("admin");
      setPassword("admin123");
    } else {
      setUsername("user");
      setPassword("user123");
    }
    setError(null);
  };

  return (
    <div style={{ display: "flex", flex: 1, alignItems: "center", justifyContent: "center", padding: "4rem 1rem" }}>
      <div className="glass animate-fade" style={{ width: "100%", maxWidth: "420px", padding: "2.5rem" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h2 style={{ fontSize: "1.75rem", marginBottom: "0.5rem" }}>Selamat Datang</h2>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Masuk ke akun Avian Haven Anda</p>
        </div>

        {error && (
          <div className="alert alert-error">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label" htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              className="form-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Masukkan username"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan password"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: "100%", marginTop: "1rem", padding: "0.85rem" }}
            disabled={loading}
          >
            {loading ? "Memproses..." : "Masuk"}
          </button>
        </form>

        <div style={{ marginTop: "2rem", borderTop: "1px solid var(--border-color)", paddingTop: "1.5rem" }}>
          <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", textAlign: "center", marginBottom: "0.75rem" }}>
            Pilih akun demo untuk masuk otomatis:
          </p>
          <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center" }}>
            <button
              onClick={() => handleAutofill("admin")}
              className="btn btn-secondary"
              style={{ padding: "0.4rem 0.8rem", fontSize: "0.75rem", display: "flex", alignItems: "center", gap: "0.25rem" }}
            >
              👑 Admin Demo
            </button>
            <button
              onClick={() => handleAutofill("user")}
              className="btn btn-secondary"
              style={{ padding: "0.4rem 0.8rem", fontSize: "0.75rem", display: "flex", alignItems: "center", gap: "0.25rem" }}
            >
              👤 Member Demo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <>
      <Navbar />
      <main style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Suspense fallback={
          <div style={{ display: "flex", flex: 1, alignItems: "center", justifyContent: "center" }}>
            <p>Loading...</p>
          </div>
        }>
          <LoginForm />
        </Suspense>
      </main>
    </>
  );
}
