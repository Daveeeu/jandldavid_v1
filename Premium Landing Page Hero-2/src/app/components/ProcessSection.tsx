import { useRef } from "react";
import { motion, useInView } from "motion/react";
import {
  MessageCircle,
  LayoutTemplate,
  Code2,
  ShieldCheck,
  Rocket,
  Check,
  Zap,
  CalendarCheck,
  Lock,
  Handshake,
} from "lucide-react";

const STEPS = [
  {
    number: "01",
    title: "Konzultáció",
    icon: MessageCircle,
    description: "Átbeszéljük a célokat, az igényeket és a projekt valódi problémáit.",
    badges: ["Ingyenes első egyeztetés"],
  },
  {
    number: "02",
    title: "Tervezés",
    icon: LayoutTemplate,
    description: "Megtervezem a felhasználói élményt, a technikai architektúrát és a megfelelő megoldást.",
    badges: ["Egyedi megoldás"],
  },
  {
    number: "03",
    title: "Fejlesztés",
    icon: Code2,
    description: "Modern technológiákkal, folyamatos kommunikáció mellett épül a rendszer.",
    badges: ["Verziókövetés", "Átlátható haladás"],
  },
  {
    number: "04",
    title: "Tesztelés",
    icon: ShieldCheck,
    description: "Performance, stabilitás és biztonsági ellenőrzések az élesítés előtt.",
    badges: ["Security-first"],
  },
  {
    number: "05",
    title: "Élesítés & Support",
    icon: Rocket,
    description: "A projekt átadása után is rendelkezésre állok supporttal és továbbfejlesztésekkel.",
    badges: ["Hosszú távú partner"],
  },
];

const TRUST_METRICS = [
  { icon: <Zap size={16} />, label: "Gyors kommunikáció", color: "#f59e0b", bg: "#fffbeb" },
  { icon: <CalendarCheck size={16} />, label: "Átlátható státuszok", color: "#3b82f6", bg: "#eff6ff" },
  { icon: <Lock size={16} />, label: "Biztonságos fejlesztés", color: "#22c55e", bg: "#f0fdf4" },
  { icon: <Handshake size={16} />, label: "Hosszú távú támogatás", color: "#8b5cf6", bg: "#faf5ff" },
];

export function ProcessSection({ onViewProjects }: { onViewProjects?: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section ref={ref} style={{ background: "#ffffff", padding: "7rem 1.5rem" }}>
      <div style={{ maxWidth: "72rem", margin: "0 auto" }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{ textAlign: "center", marginBottom: "4.5rem" }}
        >
          {/* Process badge */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.5rem" }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                background: "#f0fdf4",
                border: "1px solid #bbf7d0",
                borderRadius: "9999px",
                padding: "0.375rem 1rem",
                fontSize: "0.8125rem",
                fontWeight: 600,
                color: "#16a34a",
                letterSpacing: "-0.01em",
              }}
            >
              <span
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  background: "#22c55e",
                  display: "inline-block",
                }}
              />
              5 lépéses folyamat
            </span>
          </div>

          <h2
            style={{
              fontSize: "clamp(1.875rem, 3.2vw, 2.875rem)",
              fontWeight: 800,
              letterSpacing: "-0.04em",
              lineHeight: 1.15,
              color: "#0f1117",
              margin: "0 0 1.25rem",
            }}
          >
            Átlátható folyamat.{" "}
            <span style={{ position: "relative", display: "inline-block" }}>
              <span style={{ color: "#22c55e" }}>Stabil együttműködés</span>
              <span
                style={{
                  position: "absolute",
                  bottom: "-2px",
                  left: 0,
                  right: 0,
                  height: "3px",
                  background: "linear-gradient(90deg, #22c55e, #86efac)",
                  borderRadius: "9999px",
                  opacity: 0.45,
                  display: "block",
                }}
              />
            </span>
            .
          </h2>

          <p
            style={{
              fontSize: "1.0625rem",
              lineHeight: 1.75,
              color: "#6e6e80",
              margin: "0 auto",
              maxWidth: "580px",
            }}
          >
            A sikeres projektek nem véletlenül működnek jól. A megfelelő kommunikáció és egy átlátható fejlesztési folyamat legalább olyan fontos, mint maga a technológia.
          </p>
        </motion.div>

        {/* Timeline */}
        <div style={{ position: "relative", marginBottom: "4rem" }}>

          {/* Connecting line — desktop, draws left-to-right on entry */}
          <motion.div
            className="process-line"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={inView ? { scaleX: 1, opacity: 1 } : {}}
            transition={{ duration: 1.1, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: "absolute",
              top: "44px",
              left: "calc(10% + 22px)",
              right: "calc(10% + 22px)",
              height: "1px",
              background: "linear-gradient(90deg, transparent 0%, #e5e7eb 8%, #e5e7eb 92%, transparent 100%)",
              zIndex: 0,
              transformOrigin: "left center",
            }}
          />

          {/* Step cards */}
          <div
            className="process-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(5, 1fr)",
              gap: "1rem",
              position: "relative",
              zIndex: 1,
            }}
          >
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              const isActive = i === 2; // Fejlesztés — subtle emphasis on the central step

              return (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 24 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{
                    duration: 0.5,
                    delay: 0.1 + i * 0.1,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "1rem",
                  }}
                >
                  {/* Icon node */}
                  <div
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "50%",
                      background: isActive ? "#22c55e" : "#ffffff",
                      border: isActive
                        ? "none"
                        : "1.5px solid rgba(0,0,0,0.1)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: isActive ? "#ffffff" : "#6e6e80",
                      boxShadow: isActive
                        ? "0 4px 20px rgba(34,197,94,0.35), 0 0 0 6px rgba(34,197,94,0.1)"
                        : "0 2px 8px rgba(0,0,0,0.06)",
                      flexShrink: 0,
                      transition: "all 0.2s",
                      position: "relative",
                      zIndex: 1,
                    }}
                  >
                    <Icon size={20} strokeWidth={isActive ? 2.5 : 1.75} />
                  </div>

                  {/* Card body */}
                  <div
                    style={{
                      background: isActive ? "#f0fdf4" : "#ffffff",
                      border: isActive
                        ? "1px solid rgba(34,197,94,0.2)"
                        : "1px solid rgba(0,0,0,0.065)",
                      borderRadius: "1.125rem",
                      padding: "1.25rem 1rem",
                      width: "100%",
                      boxShadow: isActive
                        ? "0 4px 20px rgba(34,197,94,0.08), 0 1px 4px rgba(0,0,0,0.03)"
                        : "0 2px 12px rgba(0,0,0,0.04)",
                      transition: "border-color 0.15s, box-shadow 0.15s, transform 0.15s",
                      cursor: "default",
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.borderColor = "rgba(34,197,94,0.2)";
                        e.currentTarget.style.boxShadow = "0 4px 20px rgba(34,197,94,0.08)";
                        e.currentTarget.style.transform = "translateY(-2px)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.borderColor = "rgba(0,0,0,0.065)";
                        e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.04)";
                        e.currentTarget.style.transform = "translateY(0)";
                      }
                    }}
                  >
                    {/* Step number */}
                    <div
                      style={{
                        fontSize: "0.6875rem",
                        fontWeight: 700,
                        color: isActive ? "#22c55e" : "#b0b0be",
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        marginBottom: "0.375rem",
                      }}
                    >
                      {step.number}
                    </div>

                    {/* Title */}
                    <div
                      style={{
                        fontSize: "0.9375rem",
                        fontWeight: 750,
                        color: "#0f1117",
                        letterSpacing: "-0.025em",
                        lineHeight: 1.3,
                        marginBottom: "0.625rem",
                      }}
                    >
                      {step.title}
                    </div>

                    {/* Description */}
                    <p
                      style={{
                        fontSize: "0.8125rem",
                        color: "#6e6e80",
                        lineHeight: 1.65,
                        margin: "0 0 0.875rem",
                      }}
                    >
                      {step.description}
                    </p>

                    {/* Badges */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                      {step.badges.map((badge) => (
                        <span
                          key={badge}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.3rem",
                            fontSize: "0.6875rem",
                            fontWeight: 650,
                            color: "#16a34a",
                            background: "#f0fdf4",
                            border: "1px solid #bbf7d0",
                            borderRadius: "9999px",
                            padding: "0.25rem 0.625rem",
                            width: "fit-content",
                          }}
                        >
                          <Check size={9} strokeWidth={3} />
                          {badge}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Trust metrics strip */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="process-metrics-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "0.875rem",
            marginBottom: "3.5rem",
          }}
        >
          {TRUST_METRICS.map((m) => (
            <div
              key={m.label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                background: "#fafafa",
                border: "1px solid rgba(0,0,0,0.055)",
                borderRadius: "1rem",
                padding: "1rem 1.25rem",
                transition: "border-color 0.15s, box-shadow 0.15s, transform 0.12s",
                cursor: "default",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = m.color + "44";
                e.currentTarget.style.boxShadow = `0 4px 16px ${m.color}14`;
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(0,0,0,0.055)";
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <span
                style={{
                  width: "34px",
                  height: "34px",
                  borderRadius: "0.625rem",
                  background: m.bg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: m.color,
                  flexShrink: 0,
                }}
              >
                {m.icon}
              </span>
              <span
                style={{
                  fontSize: "0.875rem",
                  fontWeight: 650,
                  color: "#0f1117",
                  letterSpacing: "-0.02em",
                  lineHeight: 1.3,
                }}
              >
                {m.label}
              </span>
            </div>
          ))}
        </motion.div>

        {/* Bottom quote */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, delay: 0.72, ease: [0.22, 1, 0.36, 1] }}
          style={{
            background: "linear-gradient(135deg, #0f1117 0%, #1a1d27 100%)",
            borderRadius: "1.5rem",
            padding: "clamp(2rem, 4vw, 3rem)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "2rem",
            flexWrap: "wrap",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Subtle green glow in the corner */}
          <div
            style={{
              position: "absolute",
              width: "300px",
              height: "300px",
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(34,197,94,0.12) 0%, transparent 70%)",
              top: "-80px",
              right: "80px",
              pointerEvents: "none",
            }}
          />

          <p
            style={{
              fontSize: "clamp(1.1875rem, 2.2vw, 1.5rem)",
              fontWeight: 700,
              color: "rgba(255,255,255,0.92)",
              letterSpacing: "-0.035em",
              lineHeight: 1.4,
              margin: 0,
              maxWidth: "560px",
              position: "relative",
              zIndex: 1,
            }}
          >
            Nem csak fejlesztést kapsz. Egy átlátható{" "}
            <span style={{ color: "#22c55e" }}>technikai partnert</span>{" "}
            hosszú távra.
          </p>

          <button
            onClick={onViewProjects}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              background: "#22c55e",
              color: "#fff",
              border: "none",
              borderRadius: "0.75rem",
              padding: "0.875rem 1.625rem",
              fontSize: "0.9375rem",
              fontWeight: 650,
              cursor: "pointer",
              letterSpacing: "-0.02em",
              transition: "background 0.15s, transform 0.12s, box-shadow 0.15s",
              boxShadow: "0 4px 20px rgba(34,197,94,0.35)",
              whiteSpace: "nowrap",
              flexShrink: 0,
              position: "relative",
              zIndex: 1,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#16a34a";
              e.currentTarget.style.transform = "translateY(-1px)";
              e.currentTarget.style.boxShadow = "0 6px 24px rgba(34,197,94,0.45)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#22c55e";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 20px rgba(34,197,94,0.35)";
            }}
          >
            Nézzük meg a munkáimat
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </motion.div>

      </div>

      <style>{`
        @media (max-width: 900px) {
          .process-grid {
            grid-template-columns: 1fr 1fr !important;
            gap: 1rem !important;
          }
          .process-line {
            display: none !important;
          }
          .process-metrics-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }

        @media (max-width: 540px) {
          .process-grid {
            grid-template-columns: 1fr !important;
          }
          .process-metrics-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
