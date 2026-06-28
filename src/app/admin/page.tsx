"use client";

import Navbar from "@/components/Navbar";
import React, { useEffect, useState } from "react";

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

export default function AdminPage() {
  const [birds, setBirds] = useState<Bird[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form states for adding bird
  const [name, setName] = useState("");
  const [scientificName, setScientificName] = useState("");
  const [origin, setOrigin] = useState("");
  const [rarity, setRarity] = useState("vulnerable");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  
  const [submitting, setSubmitting] = useState(false);
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const loadBirds = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/birds");
      if (!res.ok) throw new Error("Gagal memuat katalog burung.");
      const data = await res.json();
      setBirds(data);
    } catch (err: any) {
      setError(err.message || "Gagal memuat katalog.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBirds();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setAlert(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setImageUrl(data.imageUrl);
        setAlert({ type: "success", message: "Gambar berhasil diunggah!" });
      } else {
        setAlert({ type: "error", message: data.message || "Gagal mengunggah gambar." });
      }
    } catch (err) {
      setAlert({ type: "error", message: "Kesalahan koneksi saat mengunggah gambar." });
    } finally {
      setUploading(false);
    }
  };

  const handleAddBird = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !scientificName || !origin || !rarity || !description || !price) {
      setAlert({ type: "error", message: "Semua kolom wajib diisi kecuali URL Gambar." });
      return;
    }

    setSubmitting(true);
    setAlert(null);

    try {
      const res = await fetch("/api/birds", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, scientificName, origin, rarity, description, price, imageUrl }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setAlert({ type: "success", message: "Burung baru berhasil ditambahkan ke katalog!" });
        // Reset form
        setName("");
        setScientificName("");
        setOrigin("");
        setRarity("vulnerable");
        setDescription("");
        setPrice("");
        setImageUrl("");
        
        // Reset file input
        const fileInput = document.getElementById("bird-image-file") as HTMLInputElement;
        if (fileInput) fileInput.value = "";

        // Reload list
        loadBirds();
      } else {
        setAlert({ type: "error", message: data.message || "Gagal menambahkan burung." });
      }
    } catch (err) {
      setAlert({ type: "error", message: "Kesalahan koneksi saat menyimpan data." });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteBird = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus burung ini dari katalog?")) return;

    setAlert(null);
    try {
      const res = await fetch(`/api/birds/${id}`, { method: "DELETE" });
      const data = await res.json();

      if (res.ok && data.success) {
        setAlert({ type: "success", message: "Burung berhasil dihapus dari katalog." });
        loadBirds();
      } else {
        setAlert({ type: "error", message: data.message || "Gagal menghapus burung." });
      }
    } catch (err) {
      setAlert({ type: "error", message: "Kesalahan koneksi saat menghapus data." });
    }
  };

  return (
    <>
      <Navbar />
      <main className="container animate-fade" style={{ padding: "3rem 1.5rem", flex: 1 }}>
        <h1 style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>Admin Panel</h1>
        <p style={{ color: "var(--text-muted)", marginBottom: "3rem" }}>Kelola katalog burung eksotis nusantara.</p>

        {alert && (
          <div className={`alert alert-${alert.type}`}>
            <span>{alert.type === "success" ? "✅" : "⚠️"}</span>
            <span>{alert.message}</span>
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2.5rem" }}>
          {/* Left panel: Add Form */}
          <div className="glass" style={{ padding: "2rem", height: "fit-content" }}>
            <h2 style={{ fontSize: "1.5rem", marginBottom: "1.5rem", borderBottom: "1px solid var(--border-color)", paddingBottom: "0.5rem" }}>Tambah Burung Baru</h2>
            <form onSubmit={handleAddBird}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div className="form-group">
                  <label className="form-label">Nama Burung</label>
                  <input type="text" className="form-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Cendrawasih" />
                </div>
                <div className="form-group">
                  <label className="form-label">Nama Ilmiah (Spesies)</label>
                  <input type="text" className="form-input" value={scientificName} onChange={(e) => setScientificName(e.target.value)} placeholder="Paradisaea apoda" />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div className="form-group">
                  <label className="form-label">Asal Wilayah</label>
                  <input type="text" className="form-input" value={origin} onChange={(e) => setOrigin(e.target.value)} placeholder="Papua" />
                </div>
                <div className="form-group">
                  <label className="form-label">Estimasi Nilai / Harga</label>
                  <input type="text" className="form-input" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Rp 25.000.000" />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div className="form-group">
                  <label className="form-label">Status Konservasi</label>
                  <select className="form-input" value={rarity} onChange={(e) => setRarity(e.target.value)}>
                    <option value="critical">Kritis (CR)</option>
                    <option value="vulnerable">Rentan (VU)</option>
                    <option value="secure">Terlindungi</option>
                  </select>
                </div>
              </div>

              {/* Upload or URL Option */}
              <div className="form-group" style={{ border: "1px solid var(--border-color)", padding: "1rem", borderRadius: "10px", marginBottom: "1.25rem", background: "rgba(0,0,0,0.2)" }}>
                <label className="form-label" style={{ fontWeight: 600, color: "#fff", marginBottom: "0.75rem" }}>Media Gambar Burung</label>
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <div>
                    <label className="form-label" style={{ fontSize: "0.8rem", marginBottom: "0.25rem" }}>Pilihan 1: Upload dari Perangkat</label>
                    <input
                      id="bird-image-file"
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="form-input"
                      style={{ padding: "0.4rem" }}
                      disabled={uploading}
                    />
                    {uploading && <span style={{ fontSize: "0.8rem", color: "var(--accent-color)", display: "block", marginTop: "0.25rem" }}>⏳ Mengunggah file...</span>}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)", fontSize: "0.8rem" }}>
                    <span>— ATAU —</span>
                  </div>
                  <div>
                    <label className="form-label" style={{ fontSize: "0.8rem", marginBottom: "0.25rem" }}>Pilihan 2: Alamat URL Gambar</label>
                    <input
                      type="text"
                      className="form-input"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      disabled={uploading}
                    />
                  </div>
                  {imageUrl && (
                    <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", background: "rgba(0,0,0,0.3)", padding: "0.5rem", borderRadius: "8px" }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={imageUrl}
                        alt="Preview"
                        style={{ width: "60px", height: "45px", objectFit: "cover", borderRadius: "4px" }}
                      />
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Preview Gambar Terpilih</span>
                        <button type="button" onClick={() => setImageUrl("")} className="btn btn-danger" style={{ padding: "0.1rem 0.4rem", fontSize: "0.7rem", width: "fit-content", marginTop: "0.2rem" }}>
                          Hapus Gambar
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Deskripsi</label>
                <textarea
                  className="form-input"
                  style={{ minHeight: "100px", resize: "vertical", fontFamily: "inherit" }}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Deskripsi detail mengenai keunikan dan status konservasi burung..."
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: "100%", marginTop: "1rem" }} disabled={submitting}>
                {submitting ? "Menyimpan..." : "Simpan Burung Baru 💾"}
              </button>
            </form>
          </div>

          {/* Right panel: Table list */}
          <div className="glass" style={{ padding: "2rem" }}>
            <h2 style={{ fontSize: "1.5rem", marginBottom: "1.5rem", borderBottom: "1px solid var(--border-color)", paddingBottom: "0.5rem" }}>Daftar Katalog</h2>
            
            {loading ? (
              <p style={{ color: "var(--text-muted)" }}>Memuat katalog data burung...</p>
            ) : error ? (
              <p style={{ color: "var(--error-color)" }}>⚠️ Gagal memuat data: {error}</p>
            ) : birds.length === 0 ? (
              <p style={{ color: "var(--text-muted)" }}>Katalog masih kosong.</p>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                  <thead>
                    <tr style={{ borderBottom: "2px solid var(--border-color)" }}>
                      <th style={{ padding: "0.75rem 0.5rem", color: "var(--text-muted)", fontSize: "0.85rem" }}>Burung</th>
                      <th style={{ padding: "0.75rem 0.5rem", color: "var(--text-muted)", fontSize: "0.85rem" }}>Wilayah</th>
                      <th style={{ padding: "0.75rem 0.5rem", color: "var(--text-muted)", fontSize: "0.85rem", textAlign: "right" }}>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {birds.map((bird) => (
                      <tr key={bird.id} style={{ borderBottom: "1px solid var(--border-color)" }}>
                        <td style={{ padding: "0.75rem 0.5rem" }}>
                          <span style={{ fontWeight: 600, display: "block" }}>{bird.name}</span>
                          <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontStyle: "italic" }}>{bird.scientificName}</span>
                        </td>
                        <td style={{ padding: "0.75rem 0.5rem", fontSize: "0.9rem" }}>{bird.origin}</td>
                        <td style={{ padding: "0.75rem 0.5rem", textAlign: "right" }}>
                          <button onClick={() => handleDeleteBird(bird.id)} className="btn btn-danger" style={{ padding: "0.3rem 0.6rem", fontSize: "0.8rem" }}>
                            Hapus
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
