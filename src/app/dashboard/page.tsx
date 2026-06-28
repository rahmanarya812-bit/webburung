"use client";

import Navbar from "@/components/Navbar";
import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

interface Bird {
  id: string;
  name: string;
  scientificName: string;
  origin: string;
  rarity: "critical" | "vulnerable" | "secure" | "extinct";
  description: string;
  price: string;
  imageUrl: string;
}

function DashboardContent() {
  const searchParams = useSearchParams();
  const errorParam = searchParams.get("error");

  const [birds, setBirds] = useState<Bird[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filterRarity, setFilterRarity] = useState("all");

  const loadBirds = async () => {
    setLoading(true);
    setError(null);
    try {
      // AJAX load data
      const res = await fetch("/api/birds");
      if (!res.ok) throw new Error("Gagal mengambil data dari API.");
      const data = await res.json();
      setBirds(data);
    } catch (err: any) {
      setError(err.message || "Gagal memuat data burung.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBirds();
  }, []);

  const filteredBirds = birds.filter((bird) => {
    const matchesSearch =
      bird.name.toLowerCase().includes(search.toLowerCase()) ||
      bird.scientificName.toLowerCase().includes(search.toLowerCase()) ||
      bird.origin.toLowerCase().includes(search.toLowerCase());
    
    const matchesRarity = filterRarity === "all" || bird.rarity === filterRarity;

    return matchesSearch && matchesRarity;
  });

  return (
    <div className="container animate-fade" style={{ padding: "3rem 1.5rem" }}>
      {/* Alert if unauthorized (from middleware redirection) */}
      {errorParam === "unauthorized" && (
        <div className="alert alert-error" style={{ marginBottom: "2rem" }}>
          <span>🚫</span>
          <span>Akses ditolak! Halaman Admin hanya dapat diakses oleh Administrator.</span>
        </div>
      )}

      {/* Header Info */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "1rem", marginBottom: "3rem" }}>
        <div>
          <h1 style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>Katalog Burung Eksotis</h1>
          <p style={{ color: "var(--text-muted)" }}>Jelajahi dan pelajari keanekaragaman fauna eksotis nusantara.</p>
        </div>
        <button className="btn btn-secondary" onClick={loadBirds} disabled={loading} style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          <span>🔄</span> {loading ? "Memuat..." : "Refresh AJAX"}
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass" style={{ padding: "1.5rem", marginBottom: "2.5rem", display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ flex: 1, minWidth: "250px" }}>
          <label className="form-label" style={{ marginBottom: "0.3rem" }}>Pencarian</label>
          <input
            type="text"
            className="form-input"
            placeholder="Cari berdasarkan nama, spesies, atau asal..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div style={{ width: "200px" }}>
          <label className="form-label" style={{ marginBottom: "0.3rem" }}>Status Konservasi</label>
          <select
            className="form-input"
            value={filterRarity}
            onChange={(e) => setFilterRarity(e.target.value)}
            style={{ appearance: "none" }}
          >
            <option value="all">Semua Status</option>
            <option value="critical">Kritis (CR)</option>
            <option value="vulnerable">Rentan (VU)</option>
            <option value="secure">Terlindungi</option>
          </select>
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div style={{ textAlign: "center", padding: "4rem 0" }}>
          <div style={{
            display: "inline-block",
            width: "50px",
            height: "50px",
            border: "3px solid rgba(255, 255, 255, 0.1)",
            borderTopColor: "var(--accent-color)",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            marginBottom: "1rem"
          }} />
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
          <p style={{ color: "var(--text-muted)" }}>Mengambil data via AJAX...</p>
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div className="alert alert-error" style={{ textAlign: "center", padding: "2.5rem", justifyContent: "center" }}>
          <p>⚠️ Gagal mengambil data: {error}</p>
        </div>
      )}

      {/* Main Grid */}
      {!loading && !error && (
        <>
          {filteredBirds.length === 0 ? (
            <div style={{ textAlign: "center", padding: "5rem 0", border: "1px dashed var(--border-color)", borderRadius: "16px", width: "100%" }}>
              <p style={{ fontSize: "1.2rem", color: "var(--text-muted)" }}>Burung yang Anda cari tidak ditemukan.</p>
            </div>
          ) : (
            <div className="grid-cards">
              {filteredBirds.map((bird) => (
                <div key={bird.id} className="glass glass-hover" style={{ display: "flex", flexDirection: "column", overflow: "hidden", height: "100%" }}>
                  {/* Image container */}
                  <div style={{ height: "200px", width: "100%", position: "relative", background: "#111" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={bird.imageUrl}
                      alt={bird.name}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                    <div style={{ position: "absolute", top: "0.75rem", right: "0.75rem" }}>
                      <span className={`badge badge-rarity-${bird.rarity}`}>
                        {bird.rarity === "critical" ? "Kritis" : bird.rarity === "vulnerable" ? "Rentan" : "Terlindungi"}
                      </span>
                    </div>
                  </div>

                  {/* Content container */}
                  <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", flex: 1, gap: "0.75rem" }}>
                    <div>
                      <h3 style={{ fontSize: "1.25rem", color: "#fff", marginBottom: "0.25rem" }}>{bird.name}</h3>
                      <p style={{ fontStyle: "italic", fontSize: "0.85rem", color: "var(--text-muted)" }}>{bird.scientificName}</p>
                    </div>

                    <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", flex: 1 }}>{bird.description}</p>

                    <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: "0.75rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block" }}>Asal Wilayah</span>
                        <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>📍 {bird.origin}</span>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block" }}>Estimasi Nilai</span>
                        <span style={{ fontSize: "1rem", fontWeight: 700, color: "var(--accent-color)" }}>{bird.price}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function Dashboard() {
  return (
    <>
      <Navbar />
      <main style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Suspense fallback={
          <div style={{ display: "flex", flex: 1, alignItems: "center", justifyContent: "center" }}>
            <p>Loading...</p>
          </div>
        }>
          <DashboardContent />
        </Suspense>
      </main>
    </>
  );
}
