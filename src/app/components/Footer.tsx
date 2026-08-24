import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { ArrowRight, Check, Mail, Linkedin, Github, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { SECTION_IDS, scrollToSection, scrollToContact, scrollToContactAndConsult } from "../utils/navigation";

const NAV_LINKS = [
  { label: "Szolgáltatások", sectionId: SECTION_IDS.services },
  { label: "Folyamat",       sectionId: SECTION_IDS.process },
  { label: "Projektek",      sectionId: SECTION_IDS.projects },
  { label: "GYIK",           sectionId: SECTION_IDS.faq },
  { label: "Kapcsolat",      sectionId: SECTION_IDS.contact },
];

const TECH_STACK = [
  { name: "Laravel", color: "#FF2D20" },
  { name: "Vue.js", color: "#41B883" },
  { name: "React", color: "#61DAFB" },
  { name: "Docker", color: "#2496ED" },
  { name: "Linux", color: "#FCC624" },
  { name: "AWS", color: "#FF9900" },
];

const TRUST_ITEMS = ["Full-stack fejlesztés", "Infrastruktúra", "Security szemlélet"];

const CONTACT_LINKS = [
  { icon: <Mail size={14} />, label: "info@jandldavid.hu", href: "mailto:info@jandldavid.hu" },
  { icon: <Linkedin size={14} />, label: "LinkedIn", href: "#" },
  { icon: <Github size={14} />, label: "GitHub", href: "#" },
];

const LEGAL_LINKS = [
  { label: "Adatkezelési tájékoztató", href: "/adatvedelem" },
  { label: "Süti tájékoztató", href: "/sutik" },
];

export function Footer() {
  const ctaRef = useRef<HTMLDivElement>(null);
  const ctaInView = useInView(ctaRef, { once: true, margin: "-60px" });

  return (
    <footer
      style={{
        background: "linear-gradient(175deg, #0a0c10 0%, #0c1209 40%, #0a0c10 100%)",
        position: "relative",
        overflow: "hidden",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      {/* Large ambient glows */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        <div style={{
          position: "absolute", width: "700px", height: "700px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(34,197,94,0.055) 0%, transparent 65%)",
          top: "-200px", left: "50%", transform: "translateX(-50%)",
        }} />
        <div style={{
          position: "absolute", width: "400px", height: "400px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(34,197,94,0.04) 0%, transparent 70%)",
          bottom: "0", right: "10%",
        }} />
        {/* Hairline top border glow */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: "1px",
          background: "linear-gradient(90deg, transparent 0%, rgba(34,197,94,0.3) 30%, rgba(34,197,94,0.5) 50%, rgba(34,197,94,0.3) 70%, transparent 100%)",
        }} />
      </div>

      {/* ── Top CTA strip ─────────────────────────────────────────────────── */}
      <div
        ref={ctaRef}
        style={{
          position: "relative",
          zIndex: 1,
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          padding: "4rem 1.5rem",
        }}
      >
        <div
          style={{
            maxWidth: "72rem",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "2rem",
            flexWrap: "wrap",
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <div
              style={{
                fontSize: "clamp(1.25rem, 2.4vw, 1.75rem)",
                fontWeight: 800,
                color: "#fff",
                letterSpacing: "-0.04em",
                lineHeight: 1.2,
                marginBottom: "0.5rem",
              }}
            >
              Beszéljünk az{" "}
              <span style={{ color: "#22c55e" }}>ötletedről.</span>
            </div>
            <p
              style={{
                fontSize: "1rem",
                color: "rgba(255,255,255,0.45)",
                margin: 0,
                letterSpacing: "-0.01em",
                lineHeight: 1.6,
                maxWidth: "400px",
              }}
            >
              Találjuk meg együtt a megfelelő technikai megoldást. Közvetlen kommunikáció, hosszú távú együttműködés.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            style={{ display: "flex", alignItems: "center", gap: "0.875rem", flexWrap: "wrap" }}
          >
            <button
              onClick={scrollToContact}
              style={{
                display: "inline-flex", alignItems: "center", gap: "0.5rem",
                background: "#22c55e", color: "#fff", border: "none",
                borderRadius: "0.875rem", padding: "0.9375rem 1.75rem",
                fontSize: "0.9375rem", fontWeight: 700, cursor: "pointer",
                letterSpacing: "-0.025em", boxShadow: "0 4px 20px rgba(34,197,94,0.3)",
                transition: "background 0.15s, transform 0.12s, box-shadow 0.15s", whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#16a34a"; e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 6px 28px rgba(34,197,94,0.42)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "#22c55e"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(34,197,94,0.3)"; }}
            >
              Indítsük el a projektet
              <ArrowRight size={15} />
            </button>

            <button
              onClick={scrollToContactAndConsult}
              style={{
                display: "inline-flex", alignItems: "center", gap: "0.5rem",
                background: "transparent", color: "rgba(255,255,255,0.55)",
                border: "1.5px solid rgba(255,255,255,0.12)", borderRadius: "0.875rem",
                padding: "0.9375rem 1.5rem", fontSize: "0.9375rem", fontWeight: 600,
                cursor: "pointer", letterSpacing: "-0.02em",
                transition: "border-color 0.15s, color 0.15s, transform 0.12s", whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(34,197,94,0.4)"; e.currentTarget.style.color = "#22c55e"; e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; e.currentTarget.style.color = "rgba(255,255,255,0.55)"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              Kérj szakmai konzultációt
            </button>
          </motion.div>
        </div>
      </div>

      {/* ── Main footer columns ────────────────────────────────────────────── */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          padding: "4rem 1.5rem 3rem",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <div
          className="footer-grid"
          style={{
            maxWidth: "72rem",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "1.6fr 1fr 1fr 1fr",
            gap: "3rem",
          }}
        >
          {/* Col 1 — Brand */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {/* Logo */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}>
              <span style={{ fontSize: "1.125rem", fontWeight: 800, letterSpacing: "-0.04em", color: "#fff" }}>
                Jandl Dávid
              </span>
              <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "#22c55e", letterSpacing: "0.02em" }}>
                Technikai partner
              </span>
            </div>

            <p
              style={{
                fontSize: "0.875rem",
                color: "rgba(255,255,255,0.38)",
                lineHeight: 1.7,
                margin: 0,
                maxWidth: "260px",
                letterSpacing: "-0.01em",
              }}
            >
              Modern webes rendszerek, automatizációk, infrastruktúra és security-first fejlesztés vállalkozások számára.
            </p>

            {/* Trust items */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {TRUST_ITEMS.map((t) => (
                <div key={t} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span
                    style={{
                      width: "16px",
                      height: "16px",
                      borderRadius: "50%",
                      background: "rgba(34,197,94,0.12)",
                      border: "1px solid rgba(34,197,94,0.25)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Check size={8} color="#22c55e" strokeWidth={3} />
                  </span>
                  <span style={{ fontSize: "0.8125rem", color: "rgba(255,255,255,0.42)", fontWeight: 500, letterSpacing: "-0.01em" }}>
                    {t}
                  </span>
                </div>
              ))}
            </div>

            {/* Status badge */}
            <div style={{ display: "inline-flex", width: "fit-content" }}>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  background: "rgba(34,197,94,0.1)",
                  border: "1px solid rgba(34,197,94,0.22)",
                  borderRadius: "9999px",
                  padding: "0.35rem 0.875rem",
                  fontSize: "0.75rem",
                  fontWeight: 650,
                  color: "#22c55e",
                  letterSpacing: "-0.01em",
                }}
              >
                <span
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    background: "#22c55e",
                    animation: "pulseGreen 2s ease-in-out infinite",
                    flexShrink: 0,
                  }}
                />
                Elérhető új együttműködésekre
              </span>
            </div>
          </div>

          {/* Col 2 — Navigation */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <span
              style={{
                fontSize: "0.6875rem",
                fontWeight: 750,
                color: "rgba(255,255,255,0.25)",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              Navigáció
            </span>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
              {NAV_LINKS.map((link) => (
                <button
                  key={link.label}
                  onClick={() => scrollToSection(link.sectionId)}
                  style={{
                    fontSize: "0.9rem",
                    color: "rgba(255,255,255,0.45)",
                    background: "none",
                    border: "none",
                    fontWeight: 500,
                    letterSpacing: "-0.01em",
                    transition: "color 0.15s",
                    textAlign: "left",
                    cursor: "pointer",
                    padding: 0,
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.45)")}
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>

          {/* Col 3 — Contact */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <span
              style={{
                fontSize: "0.6875rem",
                fontWeight: 750,
                color: "rgba(255,255,255,0.25)",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              Kapcsolat
            </span>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
              {CONTACT_LINKS.map((c) => (
                <a
                  key={c.label}
                  href={c.href}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    fontSize: "0.9rem",
                    color: "rgba(255,255,255,0.45)",
                    textDecoration: "none",
                    fontWeight: 500,
                    letterSpacing: "-0.01em",
                    transition: "color 0.15s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#22c55e")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.45)")}
                >
                  <span style={{ opacity: 0.6 }}>{c.icon}</span>
                  {c.label}
                  {c.label !== "info@jandldavid.hu" && (
                    <ExternalLink size={11} style={{ opacity: 0.35 }} />
                  )}
                </a>
              ))}
            </div>

            {/* Response time note */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                marginTop: "0.25rem",
                padding: "0.625rem 0.875rem",
                background: "rgba(34,197,94,0.07)",
                border: "1px solid rgba(34,197,94,0.14)",
                borderRadius: "0.75rem",
              }}
            >
              <span
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  background: "#22c55e",
                  animation: "pulseGreen 2s ease-in-out infinite",
                  flexShrink: 0,
                }}
              />
              <span style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.45)", fontWeight: 500, letterSpacing: "-0.01em" }}>
                Általában 24 órán belül válaszolok
              </span>
            </div>
          </div>

          {/* Col 4 — Tech stack */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <span
              style={{
                fontSize: "0.6875rem",
                fontWeight: 750,
                color: "rgba(255,255,255,0.25)",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              Tech Stack
            </span>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {TECH_STACK.map((t) => (
                <div
                  key={t.name}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.625rem",
                    padding: "0.5rem 0.75rem",
                    borderRadius: "0.625rem",
                    border: "1px solid rgba(255,255,255,0.05)",
                    background: "rgba(255,255,255,0.02)",
                    transition: "background 0.15s, border-color 0.15s",
                    cursor: "default",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                    e.currentTarget.style.borderColor = `${t.color}30`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.02)";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)";
                  }}
                >
                  <span
                    style={{
                      width: "7px",
                      height: "7px",
                      borderRadius: "50%",
                      background: t.color,
                      flexShrink: 0,
                      opacity: 0.8,
                    }}
                  />
                  <span
                    style={{
                      fontSize: "0.85rem",
                      color: "rgba(255,255,255,0.5)",
                      fontWeight: 550,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {t.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ─────────────────────────────────────────────────────── */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          padding: "1.5rem",
        }}
      >
        <div
          className="footer-bottom"
          style={{
            maxWidth: "72rem",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "1rem",
            flexWrap: "wrap",
          }}
        >
          <span style={{ fontSize: "0.8125rem", color: "rgba(255,255,255,0.22)", letterSpacing: "-0.01em", fontWeight: 500 }}>
            © 2026 Jandl Dávid
          </span>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              flexWrap: "wrap",
            }}
          >
            {LEGAL_LINKS.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                style={{
                  fontSize: "0.8125rem",
                  color: "rgba(255,255,255,0.36)",
                  textDecoration: "none",
                  fontWeight: 500,
                  letterSpacing: "-0.01em",
                }}
              >
                {link.label}
              </Link>
            ))}
            <span style={{ fontSize: "0.8125rem", color: "rgba(255,255,255,0.18)", letterSpacing: "-0.01em", fontWeight: 500 }}>
              Technikai partnerként vállalkozások oldalán.
            </span>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 960px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr !important;
            gap: 2.5rem !important;
          }
        }
        @media (max-width: 560px) {
          .footer-grid {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
          .footer-bottom {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 0.375rem !important;
          }
        }
      `}</style>
    </footer>
  );
}
