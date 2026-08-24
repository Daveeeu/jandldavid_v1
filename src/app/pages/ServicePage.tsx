import { useNavigate, useParams } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowRight, CheckCircle2, ChevronRight } from "lucide-react";
import { scrollToContact } from "../utils/navigation";
import { SERVICE_PAGES, SERVICE_PAGE_ORDER } from "../servicePages";

function goToContact(navigate: ReturnType<typeof useNavigate>) {
  navigate("/");
  setTimeout(scrollToContact, 140);
}

export default function ServicePage() {
  const navigate = useNavigate();
  const params = useParams();
  const page = params.slug ? SERVICE_PAGES[params.slug] : undefined;

  if (!page) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem", background: "#f9f9fb" }}>
        <div style={{ maxWidth: "36rem", textAlign: "center" }}>
          <h1 style={{ margin: "0 0 1rem", fontSize: "clamp(2rem, 5vw, 3rem)", lineHeight: 1.1, letterSpacing: "-0.04em", color: "#0f1117" }}>
            Ez a szolgáltatási oldal nem található.
          </h1>
          <p style={{ margin: 0, color: "#6e6e80", lineHeight: 1.7 }}>
            A keresett tartalom jelenleg nem érhető el. A főoldalon megtalálod a projektek, szolgáltatások és kapcsolatfelvétel lehetőségeit.
          </p>
        </div>
      </div>
    );
  }

  const currentIndex = SERVICE_PAGE_ORDER.indexOf(page.path);
  const siblingLinks = SERVICE_PAGE_ORDER.filter((path) => path !== page.path).slice(Math.max(0, currentIndex - 1), Math.max(0, currentIndex - 1) + 3);

  return (
    <div style={{ minHeight: "100vh", background: "#ffffff", fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}>
      <section style={{ background: "linear-gradient(160deg, #f7fcf8 0%, #f0fdf4 38%, #ffffff 100%)", padding: "4.5rem 1.5rem 3.5rem" }}>
        <div style={{ maxWidth: "72rem", margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
            <button onClick={() => navigate("/")} style={{ background: "none", border: "none", padding: 0, cursor: "pointer", color: "#6e6e80", fontSize: "0.875rem", fontWeight: 500 }}>
              Főoldal
            </button>
            <ChevronRight size={14} color="#9ca3af" />
            <span style={{ color: "#9ca3af", fontSize: "0.875rem", fontWeight: 500 }}>Szolgáltatások</span>
            <ChevronRight size={14} color="#9ca3af" />
            <span style={{ color: "#0f1117", fontSize: "0.875rem", fontWeight: 600 }}>{page.primaryKeyword}</span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.2fr) minmax(300px, 0.8fr)", gap: "3rem", alignItems: "start" }} className="service-hero-grid">
            <div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", borderRadius: "9999px", background: "#f0fdf4", border: "1px solid #bbf7d0", color: "#16a34a", padding: "0.375rem 1rem", fontSize: "0.8125rem", fontWeight: 700, letterSpacing: "-0.01em", marginBottom: "1.25rem" }}>
                <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#22c55e", display: "inline-block" }} />
                {page.eyebrow}
              </div>
              <h1 style={{ margin: 0, fontSize: "clamp(2.25rem, 5vw, 4rem)", lineHeight: 1.05, letterSpacing: "-0.045em", color: "#0f1117", maxWidth: "14ch" }}>
                {page.h1}
              </h1>
              <p style={{ margin: "1.5rem 0 0", maxWidth: "44rem", fontSize: "1.0625rem", lineHeight: 1.8, color: "#4b5563" }}>
                {page.lead}
              </p>
              <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginTop: "1.75rem" }}>
                <button
                  onClick={() => goToContact(navigate)}
                  style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", border: "none", borderRadius: "0.875rem", background: "#0f1117", color: "#ffffff", padding: "0.9rem 1.5rem", fontSize: "0.9375rem", fontWeight: 700, cursor: "pointer" }}
                >
                  {page.ctaLabel}
                  <ArrowRight size={16} />
                </button>
                <button
                  onClick={() => navigate("/")}
                  style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", border: "1.5px solid rgba(0,0,0,0.12)", borderRadius: "0.875rem", background: "transparent", color: "#0f1117", padding: "0.9rem 1.35rem", fontSize: "0.9375rem", fontWeight: 650, cursor: "pointer" }}
                >
                  Vissza a főoldalra
                </button>
              </div>
            </div>

            <motion.aside
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              style={{ background: "#ffffff", border: "1px solid rgba(0,0,0,0.07)", borderRadius: "1.5rem", padding: "1.5rem", boxShadow: "0 8px 30px rgba(15,17,23,0.05)" }}
            >
              <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#9ca3af", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "1rem" }}>
                SEO fókusz
              </div>
              <div style={{ marginBottom: "1rem" }}>
                <div style={{ fontSize: "0.8125rem", color: "#9ca3af", marginBottom: "0.3rem" }}>Elsődleges kulcsszó</div>
                <div style={{ fontSize: "1rem", color: "#0f1117", fontWeight: 700 }}>{page.primaryKeyword}</div>
              </div>
              <div style={{ marginBottom: "1rem" }}>
                <div style={{ fontSize: "0.8125rem", color: "#9ca3af", marginBottom: "0.5rem" }}>Kapcsolódó kulcsszavak</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                  {page.secondaryKeywords.map((keyword) => (
                    <span key={keyword} style={{ borderRadius: "9999px", background: "#f5f5f7", border: "1px solid rgba(0,0,0,0.06)", color: "#374151", padding: "0.35rem 0.7rem", fontSize: "0.8125rem", fontWeight: 600 }}>
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <div style={{ fontSize: "0.8125rem", color: "#9ca3af", marginBottom: "0.3rem" }}>Keresési szándék</div>
                <div style={{ fontSize: "0.9375rem", color: "#4b5563", lineHeight: 1.65 }}>{page.searchIntent}</div>
              </div>
            </motion.aside>
          </div>
        </div>
      </section>

      <section style={{ padding: "0 1.5rem 6rem" }}>
        <div style={{ maxWidth: "72rem", margin: "0 auto", display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(280px, 0.38fr)", gap: "2rem" }} className="service-content-grid">
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div style={{ background: "#ffffff", border: "1px solid rgba(0,0,0,0.07)", borderRadius: "1.5rem", padding: "1.75rem" }}>
              <h2 style={{ margin: "0 0 1rem", fontSize: "clamp(1.5rem, 2.8vw, 2rem)", lineHeight: 1.15, letterSpacing: "-0.04em", color: "#0f1117" }}>
                Mire számíthatsz ebben a szolgáltatásban
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                {page.introPoints.map((point) => (
                  <div key={point} style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
                    <CheckCircle2 size={18} color="#22c55e" style={{ flexShrink: 0, marginTop: "0.15rem" }} />
                    <p style={{ margin: 0, color: "#4b5563", lineHeight: 1.75, fontSize: "1rem" }}>{point}</p>
                  </div>
                ))}
              </div>
            </div>

            {page.sections.map((section, index) => (
              <div key={section.title} style={{ background: "#ffffff", border: "1px solid rgba(0,0,0,0.07)", borderRadius: "1.5rem", padding: "1.75rem" }}>
                <h2 style={{ margin: 0, fontSize: index === 0 ? "clamp(1.45rem, 2.5vw, 1.85rem)" : "clamp(1.35rem, 2.2vw, 1.7rem)", lineHeight: 1.18, letterSpacing: "-0.04em", color: "#0f1117" }}>
                  {section.title}
                </h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.95rem", marginTop: "1rem" }}>
                  {section.body.map((paragraph) => (
                    <p key={paragraph} style={{ margin: 0, color: "#4b5563", lineHeight: 1.8, fontSize: "1rem" }}>
                      {paragraph}
                    </p>
                  ))}
                </div>
                {section.bullets?.length ? (
                  <ul style={{ margin: "1rem 0 0", paddingLeft: "1.25rem", color: "#374151", lineHeight: 1.8 }}>
                    {section.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ))}
          </div>

          <aside style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ background: "#f9f9fb", border: "1px solid rgba(0,0,0,0.06)", borderRadius: "1.25rem", padding: "1.25rem" }}>
              <h2 style={{ margin: 0, fontSize: "1.125rem", lineHeight: 1.2, letterSpacing: "-0.03em", color: "#0f1117" }}>
                Kapcsolódó oldalak
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem", marginTop: "1rem" }}>
                {[...new Map(page.relatedLinks.map((link) => [link.href, link])).values()].map((link) => (
                  <a key={link.href} href={link.href} style={{ color: "#0f1117", textDecoration: "none", fontWeight: 600, lineHeight: 1.5 }}>
                    {link.label}
                  </a>
                ))}
              </div>
            </div>

            <div style={{ background: "#0f1117", borderRadius: "1.25rem", padding: "1.25rem", color: "#ffffff" }}>
              <h2 style={{ margin: 0, fontSize: "1.125rem", lineHeight: 1.2, letterSpacing: "-0.03em", color: "#ffffff" }}>
                További releváns szolgáltatások
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginTop: "1rem" }}>
                {siblingLinks.map((path) => {
                  const sibling = Object.values(SERVICE_PAGES).find((entry) => entry.path === path);
                  if (!sibling) return null;
                  return (
                    <button
                      key={sibling.path}
                      onClick={() => navigate(sibling.path)}
                      style={{ textAlign: "left", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "1rem", padding: "0.9rem 1rem", color: "#ffffff", cursor: "pointer" }}
                    >
                      <div style={{ fontSize: "0.8125rem", color: "rgba(255,255,255,0.5)", marginBottom: "0.2rem" }}>{sibling.eyebrow}</div>
                      <div style={{ fontSize: "0.9375rem", fontWeight: 700, lineHeight: 1.4 }}>{sibling.primaryKeyword}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>
        </div>
      </section>

      <style>{`
        @media (max-width: 920px) {
          .service-hero-grid,
          .service-content-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
