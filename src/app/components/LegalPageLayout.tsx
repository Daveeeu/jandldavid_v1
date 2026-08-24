import type { ReactNode } from "react";
import { Link } from "react-router-dom";

type LegalSection = {
  title: string;
  body: ReactNode;
};

type LegalPageLayoutProps = {
  eyebrow: string;
  title: string;
  intro: string;
  lastUpdated: string;
  sections: LegalSection[];
};

export function LegalPageLayout({
  eyebrow,
  title,
  intro,
  lastUpdated,
  sections,
}: LegalPageLayoutProps) {
  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, rgba(34,197,94,0.14), transparent 32%), linear-gradient(180deg, #0a0c10 0%, #10151a 100%)",
        color: "#f5f7fb",
        padding: "2rem 1.5rem 4rem",
      }}
    >
      <div style={{ maxWidth: "58rem", margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "1rem",
            flexWrap: "wrap",
            alignItems: "center",
            marginBottom: "2.5rem",
          }}
        >
          <Link
            to="/"
            style={{
              color: "#86efac",
              textDecoration: "none",
              fontWeight: 700,
              letterSpacing: "-0.02em",
            }}
          >
            Vissza a főoldalra
          </Link>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <Link to="/adatvedelem" style={{ color: "rgba(255,255,255,0.72)", textDecoration: "none" }}>
              Adatvédelem
            </Link>
            <Link to="/sutik" style={{ color: "rgba(255,255,255,0.72)", textDecoration: "none" }}>
              Sütik
            </Link>
          </div>
        </div>

        <section
          style={{
            padding: "1.5rem",
            borderRadius: "1.5rem",
            border: "1px solid rgba(255,255,255,0.08)",
            background: "rgba(255,255,255,0.04)",
            boxShadow: "0 16px 40px rgba(0,0,0,0.18)",
            marginBottom: "1.5rem",
          }}
        >
          <p
            style={{
              margin: "0 0 0.5rem",
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              color: "#22c55e",
              fontSize: "0.78rem",
              fontWeight: 800,
            }}
          >
            {eyebrow}
          </p>
          <h1
            style={{
              margin: "0 0 1rem",
              fontSize: "clamp(2rem, 4vw, 3.25rem)",
              lineHeight: 1.05,
              letterSpacing: "-0.05em",
            }}
          >
            {title}
          </h1>
          <p
            style={{
              margin: "0 0 1rem",
              maxWidth: "46rem",
              lineHeight: 1.7,
              color: "rgba(255,255,255,0.78)",
              fontSize: "1rem",
            }}
          >
            {intro}
          </p>
          <p style={{ margin: 0, color: "rgba(255,255,255,0.5)", fontSize: "0.92rem" }}>
            Utolsó frissítés: {lastUpdated}
          </p>
        </section>

        <div style={{ display: "grid", gap: "1rem" }}>
          {sections.map((section) => (
            <section
              key={section.title}
              style={{
                padding: "1.5rem",
                borderRadius: "1.25rem",
                border: "1px solid rgba(255,255,255,0.08)",
                background: "rgba(255,255,255,0.03)",
              }}
            >
              <h2
                style={{
                  margin: "0 0 0.875rem",
                  fontSize: "1.2rem",
                  letterSpacing: "-0.03em",
                }}
              >
                {section.title}
              </h2>
              <div
                style={{
                  color: "rgba(255,255,255,0.76)",
                  lineHeight: 1.75,
                  fontSize: "0.98rem",
                }}
              >
                {section.body}
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
