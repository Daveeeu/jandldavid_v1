import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { useCountUp } from "@/app/utils/animations";
import { Check, Quote, Star, Rocket, Zap, Lock, Handshake, Activity } from "lucide-react";

// ─── Data ─────────────────────────────────────────────────────────────────────

const TESTIMONIALS = [
  {
    title: "Nem csak egy fejlesztőt kaptunk.",
    body: "A teljes projekt során pontos kommunikációt, gyors reakcióidőt és átlátható fejlesztési folyamatot kaptunk. A végeredmény minden várakozásunkat felülmúlta.",
    role: "Startup Founder",
    company: "SaaS Platform",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&auto=format&q=80",
    initials: "SF",
    accentColor: "#22c55e",
    accentBg: "#f0fdf4",
  },
  {
    title: "Végre strukturált fejlesztés.",
    body: "A rendszer stabilabb lett, a deployment folyamat automatizált, és a kommunikáció végig kiszámítható maradt.",
    role: "Operations Lead",
    company: "Technology Company",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&auto=format&q=80",
    initials: "OL",
    accentColor: "#3b82f6",
    accentBg: "#eff6ff",
  },
  {
    title: "Security és teljesítmény egyszerre.",
    body: "Nemcsak gyorsabb lett a rendszer, hanem biztonságosabb is. Ritka kombináció ilyen szintű szakmai hozzáállással.",
    role: "Agency Partner",
    company: "Digital Product",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&auto=format&q=80",
    initials: "AP",
    accentColor: "#8b5cf6",
    accentBg: "#faf5ff",
  },
];

const TRUST_INDICATORS = [
  "Gyors kommunikáció",
  "Átlátható folyamat",
  "Hosszú távú támogatás",
  "Üzleti szemlélet",
];

const BOTTOM_METRICS = [
  { icon: <Rocket size={15} />, label: "60+ sikeres deployment", color: "#22c55e", bg: "#f0fdf4" },
  { icon: <Activity size={15} />, label: "99.9% uptime szemlélet", color: "#3b82f6", bg: "#eff6ff" },
  { icon: <Zap size={15} />, label: "<24 órás válaszidő", color: "#f59e0b", bg: "#fffbeb" },
  { icon: <Lock size={15} />, label: "Security-first megközelítés", color: "#8b5cf6", bg: "#faf5ff" },
  { icon: <Handshake size={15} />, label: "Hosszú távú partneri szemlélet", color: "#0f1117", bg: "#f3f4f6" },
];

// ─── Star row ─────────────────────────────────────────────────────────────────

function Stars({ color = "#f59e0b" }: { color?: string }) {
  return (
    <div style={{ display: "flex", gap: "2px" }}>
      {[...Array(5)].map((_, i) => (
        <Star key={i} size={13} fill={color} color={color} />
      ))}
    </div>
  );
}

// ─── Single testimonial card ──────────────────────────────────────────────────

function TestimonialCard({
  card,
  index,
  inView,
}: {
  card: (typeof TESTIMONIALS)[0];
  index: number;
  inView: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.55, delay: 0.18 + index * 0.13, ease: [0.22, 1, 0.36, 1] }}
      style={{
        background: "rgba(255,255,255,0.92)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: "1px solid rgba(0,0,0,0.07)",
        borderRadius: "1.25rem",
        padding: "1.625rem",
        boxShadow: "0 4px 24px rgba(0,0,0,0.055), 0 1px 4px rgba(0,0,0,0.03)",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        transition: "box-shadow 0.2s, transform 0.18s, border-color 0.2s",
        cursor: "default",
        position: "relative",
        overflow: "hidden",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.boxShadow = `0 8px 36px rgba(0,0,0,0.09), 0 2px 8px rgba(0,0,0,0.04)`;
        el.style.transform = "translateY(-2px)";
        el.style.borderColor = `${card.accentColor}30`;
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.boxShadow = "0 4px 24px rgba(0,0,0,0.055), 0 1px 4px rgba(0,0,0,0.03)";
        el.style.transform = "translateY(0)";
        el.style.borderColor = "rgba(0,0,0,0.07)";
      }}
    >
      {/* Subtle accent bar at top */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "1.625rem",
          right: "1.625rem",
          height: "2px",
          background: `linear-gradient(90deg, ${card.accentColor}, transparent)`,
          borderRadius: "0 0 9999px 9999px",
          opacity: 0.5,
        }}
      />

      {/* Quote icon + stars */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "0.625rem",
            background: card.accentBg,
            border: `1px solid ${card.accentColor}24`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: card.accentColor,
            flexShrink: 0,
          }}
        >
          <Quote size={14} />
        </span>
        <Stars color="#f59e0b" />
      </div>

      {/* Title */}
      <div
        style={{
          fontSize: "1rem",
          fontWeight: 750,
          color: "#0f1117",
          letterSpacing: "-0.03em",
          lineHeight: 1.3,
        }}
      >
        {card.title}
      </div>

      {/* Body */}
      <p
        style={{
          fontSize: "0.875rem",
          color: "#6e6e80",
          lineHeight: 1.7,
          margin: 0,
          flexGrow: 1,
        }}
      >
        {card.body}
      </p>

      {/* Author row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          paddingTop: "0.75rem",
          borderTop: "1px solid rgba(0,0,0,0.06)",
        }}
      >
        <img
          src={card.avatar}
          alt={`${card.role} – ${card.company}`}
          loading="lazy"
          decoding="async"
          style={{
            width: "38px",
            height: "38px",
            borderRadius: "50%",
            objectFit: "cover",
            flexShrink: 0,
            background: card.accentBg,
            border: `2px solid ${card.accentColor}28`,
          }}
        />
        <div>
          <div style={{ fontSize: "0.8125rem", fontWeight: 700, color: "#0f1117", letterSpacing: "-0.02em" }}>
            {card.role}
          </div>
          <div
            style={{
              fontSize: "0.75rem",
              color: card.accentColor,
              fontWeight: 600,
              letterSpacing: "-0.01em",
            }}
          >
            {card.company}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main export ───────────────────────────────────────────────────────────────

export function TrustSection({ onStartProject }: { onStartProject?: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const bottomRef = useRef<HTMLDivElement>(null);
  const bottomInView = useInView(bottomRef, { once: true, margin: "-60px" });

  const projectCount = useCountUp(60, inView, 1200);

  return (
    <section style={{ background: "#ffffff", padding: "7rem 1.5rem" }}>
      <div style={{ maxWidth: "72rem", margin: "0 auto" }}>

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          ref={ref}
          style={{ textAlign: "center", marginBottom: "4.5rem" }}
        >
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
            Olyan együttműködésekre építek, amelyek{" "}
            <span style={{ position: "relative", display: "inline-block" }}>
              <span style={{ color: "#22c55e" }}>hosszú távon</span>
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
            </span>{" "}
            is működnek.
          </h2>
          <p
            style={{
              fontSize: "1.0625rem",
              lineHeight: 1.75,
              color: "#6e6e80",
              margin: "0 auto",
              maxWidth: "560px",
            }}
          >
            A sikeres projektek mögött nemcsak technológia, hanem kommunikáció, bizalom és közös gondolkodás áll.
          </p>
        </motion.div>

        {/* Two-column main layout */}
        <div
          className="trust-main-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.15fr",
            gap: "3rem",
            alignItems: "start",
            marginBottom: "4rem",
          }}
        >
          {/* ── Left: statement block ── */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            style={{ display: "flex", flexDirection: "column", gap: "2rem" }}
          >
            {/* Rating callout */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "1rem",
                background: "#fafafa",
                border: "1px solid rgba(0,0,0,0.07)",
                borderRadius: "1.25rem",
                padding: "1.25rem 1.5rem",
                boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
                <div
                  style={{
                    fontSize: "2.25rem",
                    fontWeight: 800,
                    color: "#0f1117",
                    letterSpacing: "-0.06em",
                    lineHeight: 1,
                  }}
                >
                  5.0
                </div>
                <Stars color="#f59e0b" />
              </div>
              <div
                style={{
                  width: "1px",
                  height: "40px",
                  background: "rgba(0,0,0,0.08)",
                  flexShrink: 0,
                }}
              />
              <div>
                <div
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: 700,
                    color: "#0f1117",
                    letterSpacing: "-0.025em",
                    marginBottom: "0.2rem",
                  }}
                >
                  Átlagos elégedettség
                </div>
                <div style={{ fontSize: "0.8125rem", color: "#6e6e80", fontWeight: 500 }}>
                  minden projekten
                </div>
              </div>
            </div>

            {/* Statement */}
            <div
              style={{
                background: "linear-gradient(145deg, #f0fdf4 0%, #fff 70%)",
                border: "1px solid rgba(34,197,94,0.14)",
                borderRadius: "1.25rem",
                padding: "1.875rem",
                boxShadow: "0 4px 20px rgba(34,197,94,0.06)",
              }}
            >
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "0.75rem",
                  background: "#22c55e",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "1.25rem",
                }}
              >
                <Handshake size={18} color="#fff" />
              </div>

              <p
                style={{
                  fontSize: "1.0625rem",
                  fontWeight: 650,
                  color: "#0f1117",
                  lineHeight: 1.6,
                  letterSpacing: "-0.025em",
                  margin: "0 0 1.5rem",
                }}
              >
                Nem csak fejlesztőként, hanem technikai partnerként veszek részt a projektekben.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
                {TRUST_INDICATORS.map((label) => (
                  <div key={label} style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
                    <span
                      style={{
                        width: "20px",
                        height: "20px",
                        borderRadius: "50%",
                        background: "#f0fdf4",
                        border: "1.5px solid #bbf7d0",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <Check size={10} color="#22c55e" strokeWidth={3} />
                    </span>
                    <span
                      style={{
                        fontSize: "0.9rem",
                        color: "#374151",
                        fontWeight: 550,
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Decorative mini stat row */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "0.75rem",
              }}
            >
              {[
                { value: `${projectCount}+`, label: "Sikeres projekt", color: "#22c55e", bg: "#f0fdf4" },
                { value: "< 24h", label: "Átlagos válaszidő", color: "#3b82f6", bg: "#eff6ff" },
              ].map((s) => (
                <div
                  key={s.label}
                  style={{
                    background: s.bg,
                    border: `1px solid ${s.color}22`,
                    borderRadius: "1rem",
                    padding: "1.125rem 1.25rem",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
                  }}
                >
                  <div
                    style={{
                      fontSize: "1.625rem",
                      fontWeight: 800,
                      color: s.color,
                      letterSpacing: "-0.05em",
                      lineHeight: 1,
                      marginBottom: "0.3rem",
                    }}
                  >
                    {s.value}
                  </div>
                  <div style={{ fontSize: "0.8125rem", color: "#6e6e80", fontWeight: 500 }}>
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── Right: testimonial stack ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {TESTIMONIALS.map((card, i) => (
              <TestimonialCard key={card.title} card={card} index={i} inView={inView} />
            ))}
          </div>
        </div>

        {/* Bottom metrics strip */}
        <div ref={bottomRef}>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={bottomInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            style={{
              background: "#fafafa",
              border: "1px solid rgba(0,0,0,0.06)",
              borderRadius: "1.25rem",
              padding: "1.5rem 2rem",
              marginBottom: "1.25rem",
              overflowX: "auto",
            }}
          >
            <div
              className="trust-metrics-row"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0",
                minWidth: "fit-content",
              }}
            >
              {BOTTOM_METRICS.map((m, i) => (
                <div
                  key={m.label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.625rem",
                    padding: "0 2rem",
                    borderRight: i < BOTTOM_METRICS.length - 1 ? "1px solid rgba(0,0,0,0.08)" : "none",
                    flexShrink: 0,
                  }}
                >
                  <span
                    style={{
                      width: "30px",
                      height: "30px",
                      borderRadius: "0.5rem",
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
                      fontSize: "0.8125rem",
                      fontWeight: 650,
                      color: "#0f1117",
                      letterSpacing: "-0.02em",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {m.label}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Bottom quote block */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={bottomInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
            style={{
              background: "linear-gradient(135deg, #0f1117 0%, #1a1d27 100%)",
              borderRadius: "1.5rem",
              padding: "clamp(2rem, 4vw, 2.875rem) clamp(2rem, 4vw, 3rem)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "2.5rem",
              flexWrap: "wrap",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Glow */}
            <div
              style={{
                position: "absolute",
                width: "350px",
                height: "350px",
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(34,197,94,0.1) 0%, transparent 70%)",
                top: "-120px",
                right: "40px",
                pointerEvents: "none",
              }}
            />

            {/* Large quote mark */}
            <div
              style={{
                position: "absolute",
                top: "1.25rem",
                left: "2.25rem",
                fontSize: "6rem",
                lineHeight: 1,
                color: "rgba(34,197,94,0.1)",
                fontFamily: "Georgia, serif",
                fontWeight: 900,
                pointerEvents: "none",
                userSelect: "none",
              }}
            >
              "
            </div>

            <p
              style={{
                fontSize: "clamp(1.125rem, 2.2vw, 1.5rem)",
                fontWeight: 700,
                color: "rgba(255,255,255,0.9)",
                letterSpacing: "-0.035em",
                lineHeight: 1.45,
                margin: 0,
                maxWidth: "560px",
                position: "relative",
                zIndex: 1,
              }}
            >
              A jó technikai partner nem csak fejleszt.{" "}
              <span style={{ color: "#22c55e" }}>Stabilitást és bizalmat</span> épít.
            </p>

            {/* CTA */}
            <button
              onClick={onStartProject}
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
                boxShadow: "0 4px 20px rgba(34,197,94,0.35)",
                whiteSpace: "nowrap",
                flexShrink: 0,
                zIndex: 1,
                position: "relative",
                transition: "background 0.15s, transform 0.12s, box-shadow 0.15s",
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
              Indítsük el a projektet
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </motion.div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .trust-main-grid {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
        }

        @media (max-width: 600px) {
          .trust-metrics-row {
            flex-direction: column !important;
            align-items: flex-start !important;
          }
          .trust-metrics-row > div {
            border-right: none !important;
            border-bottom: 1px solid rgba(0,0,0,0.08) !important;
            padding: 0.75rem 0 !important;
            width: 100% !important;
          }
          .trust-metrics-row > div:last-child {
            border-bottom: none !important;
          }
        }
      `}</style>
    </section>
  );
}
