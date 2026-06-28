"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<{ role: string; name: string } | null>(null);

  // Hook to check login state from localStorage on path changes
  useEffect(() => {
    const role = localStorage.getItem("user_role");
    const name = localStorage.getItem("user_name");
    if (role && name) {
      setUser({ role, name });
    } else {
      setUser(null);
    }
  }, [pathname]);

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (res.ok) {
        localStorage.removeItem("user_role");
        localStorage.removeItem("user_name");
        setUser(null);
        router.push("/login");
        router.refresh();
      }
    } catch (err) {
      console.error("Gagal logout:", err);
    }
  };

  return (
    <header className="header">
      <div className="container nav-container">
        <Link href="/" className="logo">
          <span>🦜</span> Avian Haven
        </Link>
        <nav>
          <ul className="nav-links">
            <li>
              <Link href="/" className={`nav-link ${pathname === "/" ? "active" : ""}`}>
                Beranda
              </Link>
            </li>
            {user ? (
              <>
                <li>
                  <Link
                    href="/dashboard"
                    className={`nav-link ${pathname === "/dashboard" ? "active" : ""}`}
                  >
                    Katalog Burung
                  </Link>
                </li>
                {user.role === "admin" && (
                  <li>
                    <Link
                      href="/admin"
                      className={`nav-link ${pathname === "/admin" ? "active" : ""}`}
                    >
                      Admin Panel
                    </Link>
                  </li>
                )}
                <li style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <span className={`badge ${user.role === "admin" ? "badge-admin" : "badge-user"}`}>
                    {user.role === "admin" ? "👑 Admin" : "👤 Member"}
                  </span>
                  <span style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>
                    {user.name}
                  </span>
                  <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: "0.4rem 0.8rem", fontSize: "0.85rem" }}>
                    Keluar
                  </button>
                </li>
              </>
            ) : (
              <li>
                <Link href="/login" className="btn btn-primary" style={{ padding: "0.5rem 1rem", fontSize: "0.9rem" }}>
                  Masuk
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}
