import Navbar from "@/components/Navbar";
import Link from "next/link";

export const metadata = {
  title: "Avian Haven - Katalog & Konservasi Burung Eksotis Indonesia",
  description: "Selamat datang di Avian Haven, platform katalog digital burung eksotis Indonesia. Temukan keindahan fauna nusantara di sini.",
};

export default function Home() {
  return (
    <>
      <Navbar />
      <main style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Hero Section */}
        <section style={{
          position: "relative",
          padding: "8rem 0 6rem 0",
          textAlign: "center",
          overflow: "hidden"
        }}>
          {/* Decorative background glow */}
          <div style={{
            position: "absolute",
            top: "-10%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "600px",
            height: "300px",
            background: "radial-gradient(50% 50% at 50% 50%, rgba(34, 197, 94, 0.15) 0%, rgba(34, 197, 94, 0) 100%)",
            filter: "blur(60px)",
            pointerEvents: "none"
          }} />

          <div className="container animate-fade">
            <span style={{
              display: "inline-block",
              padding: "0.4rem 1rem",
              background: "rgba(234, 179, 8, 0.1)",
              border: "1px solid rgba(234, 179, 8, 0.2)",
              borderRadius: "9999px",
              fontSize: "0.85rem",
              fontWeight: 600,
              color: "var(--accent-color)",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              marginBottom: "1.5rem"
            }}>
              🌿 Eksplorasi Keanekaragaman Hayati
            </span>
            <h1 style={{
              fontSize: "3.5rem",
              lineHeight: 1.15,
              marginBottom: "1.5rem",
              fontWeight: 800
            }}>
              Keindahan <span className="gold-gradient-text">Burung Eksotis</span> <br />
              Nusantara dalam Genggaman Anda
            </h1>
            <p style={{
              fontSize: "1.2rem",
              color: "var(--text-muted)",
              maxWidth: "680px",
              margin: "0 auto 2.5rem auto",
              lineHeight: 1.7
            }}>
              Selamat datang di **Avian Haven**. Kami menghadirkan katalog digital interaktif untuk mempelajari,
              mengapresiasi, dan menjaga kelestarian spesies burung paling langka dan eksotis di Indonesia.
            </p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
              <Link href="/dashboard" className="btn btn-primary">
                Jelajahi Katalog 🦜
              </Link>
              <Link href="/login" className="btn btn-secondary">
                Masuk Akun
              </Link>
            </div>
          </div>
        </section>

        {/* Stats / Highlight Cards Section */}
        <section style={{ padding: "4rem 0 6rem 0", background: "rgba(0, 0, 0, 0.2)" }}>
          <div className="container">
            <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
              <h2 style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>Spesies Ungkulan Nusantara</h2>
              <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>Tiga burung eksotis dengan keunikan tersendiri yang dilestarikan.</p>
            </div>
            
            <div className="grid-cards animate-fade">
              {/* Card 1 */}
              <div className="glass glass-hover" style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "2rem" }}>🦜</span>
                  <span className="badge badge-rarity-critical">Kritis (CR)</span>
                </div>
                <h3 style={{ fontSize: "1.25rem", color: "#fff" }}>Jalak Bali</h3>
                <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
                  Bulu putih salju yang bersih dengan aksen biru safir menawan di sekitar matanya. Endemik Pulau Bali yang terancam punah.
                </p>
              </div>

              {/* Card 2 */}
              <div className="glass glass-hover" style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "2rem" }}>🦚</span>
                  <span className="badge badge-rarity-vulnerable">Rentan (VU)</span>
                </div>
                <h3 style={{ fontSize: "1.25rem", color: "#fff" }}>Cendrawasih Kuning</h3>
                <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
                  Dikenal sebagai "Bird of Paradise" karena tarian kawin jantan yang luar biasa anggun dan bulu kuning keemasan yang menakjubkan.
                </p>
              </div>

              {/* Card 3 */}
              <div className="glass glass-hover" style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "2rem" }}>🦅</span>
                  <span className="badge badge-rarity-secure">Terlindungi</span>
                </div>
                <h3 style={{ fontSize: "1.25rem", color: "#fff" }}>Elang Jawa</h3>
                <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
                  Burung pemangsa gagah dengan jambul khas di kepalanya. Menjadi inspirasi lambang negara Republik Indonesia, Garuda.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer style={{
          marginTop: "auto",
          padding: "2.5rem 0",
          borderTop: "1px solid var(--border-color)",
          textAlign: "center",
          background: "rgba(0,0,0,0.4)"
        }}>
          <div className="container">
            <p style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>
              © {new Date().getFullYear()} Avian Haven. Dibuat dengan dedikasi untuk konservasi fauna Indonesia.
            </p>
          </div>
        </footer>
      </main>
    </>
  );
}
