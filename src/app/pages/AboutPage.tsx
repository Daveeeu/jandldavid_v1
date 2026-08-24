import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "motion/react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Check,
  Code2,
  Shield,
  Zap,
  Target,
  Layers,
  Menu,
  X,
  Mail,
  Linkedin,
  Github,
  ExternalLink,
} from "lucide-react";
import { SECTION_IDS, scrollToSection, scrollToContact, scrollToContactAndConsult } from "../utils/navigation";
import profileHero from "@/imports/profile-hero.jpg";
import profileAbout from "@/imports/profile-about.jpeg";

// ─── Shared scroll-triggered wrapper ────────────────────────────────────────

function Reveal({ children, delay = 0, className }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 22 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.58, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Section label ────────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: "0.6875rem", fontWeight: 750, color: "#9ca3af", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "1.25rem" }}>
      {children}
    </div>
  );
}

// ─── Section heading ──────────────────────────────────────────────────────────

function SectionHeading({ children, accent }: { children: React.ReactNode; accent?: string }) {
  return (
    <h2 style={{ fontSize: "clamp(1.625rem, 2.8vw, 2.375rem)", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.18, color: "#0f1117", margin: "0 0 1.5rem" }}>
      {children}
    </h2>
  );
}

// ─── Body text ────────────────────────────────────────────────────────────────

function BodyText({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <p style={{ fontSize: "1.0625rem", color: "#4b5563", lineHeight: 1.78, margin: "0 0 1rem", letterSpacing: "-0.01em", ...style }}>
      {children}
    </p>
  );
}

// ─── CTA button ───────────────────────────────────────────────────────────────

function CtaButton({ label, onClick, variant = "primary" }: { label: string; onClick: () => void; variant?: "primary" | "ghost" }) {
  const isPrimary = variant === "primary";
  return (
    <button
      onClick={onClick}
      style={{
        display: "inline-flex", alignItems: "center", gap: "0.5rem",
        background: isPrimary ? "#22c55e" : "transparent",
        color: isPrimary ? "#fff" : "rgba(255,255,255,0.6)",
        border: isPrimary ? "none" : "1.5px solid rgba(255,255,255,0.15)",
        borderRadius: "0.875rem",
        padding: "0.9rem 1.75rem",
        fontSize: "0.9375rem", fontWeight: 700, cursor: "pointer",
        letterSpacing: "-0.02em", whiteSpace: "nowrap",
        boxShadow: isPrimary ? "0 4px 20px rgba(34,197,94,0.3)" : "none",
        transition: "all 0.15s",
      }}
      onMouseEnter={(e) => {
        if (isPrimary) { e.currentTarget.style.background = "#16a34a"; e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 6px 24px rgba(34,197,94,0.42)"; }
        else { e.currentTarget.style.borderColor = "rgba(34,197,94,0.5)"; e.currentTarget.style.color = "#22c55e"; e.currentTarget.style.transform = "translateY(-1px)"; }
      }}
      onMouseLeave={(e) => {
        if (isPrimary) { e.currentTarget.style.background = "#22c55e"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(34,197,94,0.3)"; }
        else { e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"; e.currentTarget.style.color = "rgba(255,255,255,0.6)"; e.currentTarget.style.transform = "translateY(0)"; }
      }}
    >
      {label}
      <ArrowRight size={15} />
    </button>
  );
}

// ─── Timeline ────────────────────────────────────────────────────────────────

const TIMELINE = [
  { year: "2017", label: "Első szerver", desc: "Linux alapok, hálózati konfiguráció, első saját infrastruktúra." },
  { year: "2019", label: "Első saját projektek", desc: "PHP és MySQL alapú webalkalmazások, az első ügyfelek." },
  { year: "2022", label: "Professzionális fejlesztés", desc: "Laravel, Vue, Docker — modern stack, valódi produkciós rendszerek." },
  { year: "2026", label: "Saját technikai márka", desc: "Jandl Dávid · Webalkalmazások, automatizáció és infrastruktúra vállalkozások számára." },
];

// ─── Expertise cards ──────────────────────────────────────────────────────────

const EXPERTISE = [
  {
    icon: <Layers size={20} />,
    title: "SaaS rendszerek",
    desc: "Egyedi platformok, admin felületek és előfizetéses rendszerek fejlesztése.",
    color: "#22c55e", bg: "#f0fdf4",
  },
  {
    icon: <Zap size={20} />,
    title: "Automatizáció",
    desc: "Üzleti folyamatok automatizálása és hatékonyságnövelés.",
    color: "#f59e0b", bg: "#fffbeb",
  },
  {
    icon: <Shield size={20} />,
    title: "Biztonság",
    desc: "Security-first szemlélet és hosszú távon fenntartható architektúrák.",
    color: "#8b5cf6", bg: "#faf5ff",
  },
];

// ─── Trust traits ─────────────────────────────────────────────────────────────

const TRUST_TRAITS = [
  "Átlátható kommunikáció",
  "Hosszú távú gondolkodás",
  "Security-first szemlélet",
  "Üzleti fókusz",
  "Modern technológiai háttér",
];

// ─── Main page ────────────────────────────────────────────────────────────────

export default function AboutPage() {
  const navigate = useNavigate();

  function goHomeAndScroll(id: string) {
    navigate("/");
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 120);
  }

  return (
    <div style={{ minHeight: "100vh", background: "#fff", fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}>

      {/* ── Nav — identical to homepage ──────────────────────────────────── */}
      <AboutNav navigate={navigate} />

      {/* ── 01 HERO ───────────────────────────────────────────────────────── */}
      <section style={{ background: "linear-gradient(160deg, #fafffc 0%, #f0fdf4 35%, #fff 100%)", padding: "5rem 1.5rem 6rem" }}>
        <div style={{ maxWidth: "72rem", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "center" }} className="about-hero-grid">

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}
          >
            {/* Badge */}
            <div>
              <span style={{
                display: "inline-flex", alignItems: "center", gap: "0.5rem",
                background: "#f0fdf4", border: "1px solid #bbf7d0",
                borderRadius: "9999px", padding: "0.375rem 1rem",
                fontSize: "0.8125rem", fontWeight: 650, color: "#16a34a",
              }}>
                <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#22c55e", animation: "pulseGreen 2s ease-in-out infinite", flexShrink: 0 }} />
                Elérhető új együttműködésekre
              </span>
            </div>

            {/* Headline */}
            <h1 style={{ fontSize: "clamp(2.25rem, 3.8vw, 3.25rem)", fontWeight: 800, letterSpacing: "-0.045em", lineHeight: 1.1, color: "#0f1117", margin: 0 }}>
              Technikai háttér a{" "}
              <span style={{ position: "relative", display: "inline-block" }}>
                <span style={{ color: "#22c55e" }}>vállalkozásod</span>
                <span style={{ position: "absolute", bottom: "-2px", left: 0, right: 0, height: "3px", background: "linear-gradient(90deg, #22c55e, #86efac)", borderRadius: "9999px", opacity: 0.45, display: "block" }} />
              </span>
              {" "}mögé.
            </h1>

            {/* Subtitle */}
            <p style={{ fontSize: "1.0625rem", color: "#6e6e80", lineHeight: 1.75, margin: 0, maxWidth: "480px" }}>
              8+ éve foglalkozom technológiával. Technikai partnerként segítem a vállalkozásokat az ötlettől az éles rendszerig — tervezéssel, fejlesztéssel és üzemeltetéssel.
            </p>

            {/* Quick stats */}
            <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
              {[{ v: "8+", l: "Év tapasztalat" }, { v: "60+", l: "Sikeres projekt" }, { v: "< 24h", l: "Válaszidő" }].map((s) => (
                <div key={s.l}>
                  <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#0f1117", letterSpacing: "-0.05em", lineHeight: 1 }}>{s.v}</div>
                  <div style={{ fontSize: "0.8125rem", color: "#9ca3af", fontWeight: 500, marginTop: "0.25rem" }}>{s.l}</div>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              <button
                onClick={() => { navigate("/"); setTimeout(scrollToContact, 150); }}
                style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "#0f1117", color: "#fff", border: "none", borderRadius: "0.875rem", padding: "0.875rem 1.625rem", fontSize: "0.9375rem", fontWeight: 700, cursor: "pointer", letterSpacing: "-0.02em", boxShadow: "0 4px 16px rgba(0,0,0,0.12)", transition: "all 0.15s" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#22c55e"; e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(34,197,94,0.35)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "#0f1117"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.12)"; }}
              >
                Indítsük el a fejlesztést <ArrowRight size={15} />
              </button>
              <button
                onClick={() => { navigate("/"); setTimeout(() => scrollToSection(SECTION_IDS.projects), 150); }}
                style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "transparent", color: "#0f1117", border: "1.5px solid rgba(0,0,0,0.12)", borderRadius: "0.875rem", padding: "0.875rem 1.5rem", fontSize: "0.9375rem", fontWeight: 650, cursor: "pointer", letterSpacing: "-0.02em", transition: "all 0.15s" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#22c55e"; e.currentTarget.style.color = "#22c55e"; e.currentTarget.style.background = "#f0fdf4"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(0,0,0,0.12)"; e.currentTarget.style.color = "#0f1117"; e.currentTarget.style.background = "transparent"; }}
              >
                Projektek
              </button>
            </div>
          </motion.div>

          {/* Portrait */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            style={{ position: "relative", display: "flex", justifyContent: "center" }}
            className="about-portrait-col"
          >
            {/* Glow */}
            <div style={{ position: "absolute", width: "420px", height: "420px", borderRadius: "50%", background: "radial-gradient(circle, rgba(34,197,94,0.12) 0%, transparent 70%)", top: "50%", left: "50%", transform: "translate(-50%,-50%)", pointerEvents: "none" }} />

            {/* Portrait card */}
            <div style={{ position: "relative", zIndex: 1, width: "340px", height: "420px", borderRadius: "2rem", overflow: "hidden", boxShadow: "0 0 0 1px rgba(0,0,0,0.05), 0 28px 72px rgba(0,0,0,0.14), 0 8px 24px rgba(0,0,0,0.08)", background: "#ecfdf5", flexShrink: 0 }}>
              <img
                src={profileAbout}
                alt="Jandl Dávid a tengerparton"
                width={1050}
                height={1400}
                decoding="async"
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(15,17,23,0.18) 0%, transparent 50%)", pointerEvents: "none" }} />
            </div>

            {/* Floating badge — years */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              style={{
                position: "absolute", top: "28px", right: "-16px", zIndex: 2,
                background: "rgba(255,255,255,0.9)", backdropFilter: "blur(20px)",
                border: "1px solid rgba(255,255,255,0.95)", borderRadius: "1rem",
                padding: "0.875rem 1.125rem", boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                display: "flex", flexDirection: "column", alignItems: "center",
              }}
            >
              <span style={{ fontSize: "1.5rem", fontWeight: 800, color: "#0f1117", letterSpacing: "-0.05em", lineHeight: 1 }}>8+</span>
              <span style={{ fontSize: "0.7rem", color: "#6e6e80", fontWeight: 600, letterSpacing: "-0.01em", marginTop: "0.15rem" }}>Év tapasztalat</span>
            </motion.div>

            {/* Floating badge — stack */}
            <motion.div
              initial={{ opacity: 0, x: -20, y: 20 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ delay: 0.78, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              style={{
                position: "absolute", bottom: "32px", left: "-12px", zIndex: 2,
                background: "rgba(255,255,255,0.9)", backdropFilter: "blur(20px)",
                border: "1px solid rgba(255,255,255,0.95)", borderRadius: "1rem",
                padding: "0.75rem 1rem", boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                display: "flex", alignItems: "center", gap: "0.5rem",
              }}
            >
              <Code2 size={15} color="#22c55e" />
              <span style={{ fontSize: "0.8125rem", fontWeight: 700, color: "#0f1117", letterSpacing: "-0.02em" }}>Tervezés · Fejlesztés · Üzemeltetés</span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Divider ───────────────────────────────────────────────────────── */}
      <div style={{ borderTop: "1px solid rgba(0,0,0,0.055)", background: "#f9f9fb", padding: "0" }} />

      {/* ── 02 ORIGIN STORY ───────────────────────────────────────────────── */}
      <section style={{ background: "#fff", padding: "6.5rem 1.5rem" }}>
        <div style={{ maxWidth: "72rem", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "start" }} className="about-two-col">

          {/* Text */}
          <Reveal>
            <SectionLabel>Honnan indult minden?</SectionLabel>
            <SectionHeading>Honnan indult minden?</SectionHeading>

            <BodyText>
              13 éves koromban kezdtem programozni. Akkoriban rengeteg időt töltöttem online játékokkal, és egy idő után már nem csak játszani szerettem volna rajtuk, hanem megérteni, hogyan működnek a háttérben.
            </BodyText>
            <BodyText>
              Ez vezetett az első saját szerverekhez, az első konfigurációkhoz, majd később az első sor kódokhoz.
            </BodyText>
            <BodyText>
              A kezdeti hobbi az évek során valódi szakmává vált.
            </BodyText>
            <BodyText style={{ margin: 0 }}>
              Ma főállású fejlesztőként dolgozom, emellett saját vállalkozásomban webes és mobil alkalmazások fejlesztésével foglalkozom.
            </BodyText>
          </Reveal>

          {/* Timeline */}
          <Reveal delay={0.12}>
            <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
              {TIMELINE.map((item, i) => (
                <div
                  key={item.year}
                  style={{ display: "flex", gap: "1.25rem", paddingBottom: i < TIMELINE.length - 1 ? "2rem" : 0, position: "relative" }}
                >
                  {/* Connector line */}
                  {i < TIMELINE.length - 1 && (
                    <div style={{ position: "absolute", left: "19px", top: "40px", bottom: 0, width: "1px", background: "linear-gradient(to bottom, #22c55e, rgba(34,197,94,0.1))", zIndex: 0 }} />
                  )}

                  {/* Year chip */}
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0, zIndex: 1 }}>
                    <div style={{
                      width: "40px", height: "40px", borderRadius: "50%",
                      background: i === TIMELINE.length - 1 ? "#22c55e" : "#fff",
                      border: i === TIMELINE.length - 1 ? "none" : "2px solid #bbf7d0",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      boxShadow: i === TIMELINE.length - 1 ? "0 4px 16px rgba(34,197,94,0.3)" : "0 2px 8px rgba(0,0,0,0.06)",
                    }}>
                      {i === TIMELINE.length - 1
                        ? <Check size={16} color="#fff" strokeWidth={3} />
                        : <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#22c55e" }} />
                      }
                    </div>
                  </div>

                  {/* Content */}
                  <div style={{ paddingTop: "0.625rem" }}>
                    <div style={{ display: "flex", alignItems: "baseline", gap: "0.75rem", marginBottom: "0.375rem" }}>
                      <span style={{ fontSize: "0.75rem", fontWeight: 750, color: "#22c55e", letterSpacing: "0.04em" }}>{item.year}</span>
                      <span style={{ fontSize: "1rem", fontWeight: 700, color: "#0f1117", letterSpacing: "-0.025em" }}>{item.label}</span>
                    </div>
                    <p style={{ fontSize: "0.875rem", color: "#6e6e80", lineHeight: 1.65, margin: 0 }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── 03 PHILOSOPHY ─────────────────────────────────────────────────── */}
      <section style={{ background: "#f9f9fb", padding: "6.5rem 1.5rem" }}>
        <div style={{ maxWidth: "56rem", margin: "0 auto" }}>
          <Reveal>
            <SectionLabel>Szemléletem</SectionLabel>
            <SectionHeading>A technológia önmagában nem cél.</SectionHeading>

            <BodyText>
              Sok projekt azért válik problémássá, mert a fejlesztés túl korán a technológiáról kezd szólni.
            </BodyText>
            <BodyText>
              Frameworkök, adatbázisok, szerverek és eszközök helyett én először mindig azt próbálom megérteni: milyen problémát szeretnénk megoldani és mi a valódi üzleti cél.
            </BodyText>
            <BodyText style={{ margin: "0 0 2rem" }}>
              Ezután következik csak a megfelelő technikai megoldás kiválasztása. Ezért érzem magam sokkal inkább technikai partnernek, mint egyszerű fejlesztőnek.
            </BodyText>
          </Reveal>

          {/* Pull quote card */}
          <Reveal delay={0.12}>
            <div style={{
              background: "linear-gradient(145deg, #0f1117 0%, #1a1d27 100%)",
              borderRadius: "1.5rem",
              padding: "2.5rem 2.75rem",
              position: "relative",
              overflow: "hidden",
              boxShadow: "0 16px 48px rgba(0,0,0,0.14)",
            }}>
              <div style={{ position: "absolute", width: "300px", height: "300px", borderRadius: "50%", background: "radial-gradient(circle, rgba(34,197,94,0.1) 0%, transparent 70%)", top: "-80px", right: "40px", pointerEvents: "none" }} />
              <div style={{ position: "absolute", top: "1.5rem", left: "2rem", fontSize: "5rem", lineHeight: 1, color: "rgba(34,197,94,0.1)", fontFamily: "Georgia, serif", fontWeight: 900, pointerEvents: "none", userSelect: "none" }}>"</div>

              <p style={{ fontSize: "clamp(1.125rem, 2vw, 1.4375rem)", fontWeight: 700, color: "#fff", letterSpacing: "-0.035em", lineHeight: 1.5, margin: "0 0 1rem", position: "relative", zIndex: 1 }}>
                Először a problémát kell megérteni.{" "}
                <span style={{ color: "#22c55e" }}>A technológia csak az eszköz.</span>
              </p>

              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", position: "relative", zIndex: 1 }}>
                <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Target size={14} color="#22c55e" />
                </div>
                <span style={{ fontSize: "0.8125rem", color: "rgba(255,255,255,0.45)", fontWeight: 500 }}>Jandl Dávid — technikai partner szemlélet</span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── 04 EXPERTISE ──────────────────────────────────────────────────── */}
      <section style={{ background: "#fff", padding: "6.5rem 1.5rem" }}>
        <div style={{ maxWidth: "72rem", margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
              <SectionLabel>Szakterületek</SectionLabel>
              <SectionHeading>Amiben igazán otthon érzem magam</SectionHeading>
            </div>
          </Reveal>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.25rem" }} className="about-expertise-grid">
            {EXPERTISE.map((card, i) => (
              <Reveal key={card.title} delay={i * 0.1}>
                <div style={{
                  background: "#fff",
                  border: "1px solid rgba(0,0,0,0.07)",
                  borderRadius: "1.375rem",
                  padding: "2rem",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                  height: "100%",
                  transition: "transform 0.15s, box-shadow 0.15s, border-color 0.15s",
                  cursor: "default",
                }}
                  onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.transform = "translateY(-3px)"; el.style.boxShadow = `0 8px 32px ${card.color}14, 0 2px 8px rgba(0,0,0,0.04)`; el.style.borderColor = `${card.color}28`; }}
                  onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.transform = "translateY(0)"; el.style.boxShadow = "0 4px 20px rgba(0,0,0,0.05)"; el.style.borderColor = "rgba(0,0,0,0.07)"; }}
                >
                  <span style={{ width: "44px", height: "44px", borderRadius: "0.875rem", background: card.bg, border: `1px solid ${card.color}22`, display: "flex", alignItems: "center", justifyContent: "center", color: card.color, marginBottom: "1.25rem" }}>
                    {card.icon}
                  </span>
                  <div style={{ fontSize: "1.125rem", fontWeight: 750, color: "#0f1117", letterSpacing: "-0.03em", marginBottom: "0.625rem" }}>{card.title}</div>
                  <p style={{ fontSize: "0.9375rem", color: "#6e6e80", lineHeight: 1.65, margin: 0 }}>{card.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── 05 HOW I WORK ─────────────────────────────────────────────────── */}
      <section style={{ background: "#f9f9fb", padding: "6.5rem 1.5rem" }}>
        <div style={{ maxWidth: "72rem", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "start" }} className="about-two-col">

          {/* Text */}
          <Reveal>
            <SectionLabel>Munkamódszer</SectionLabel>
            <SectionHeading>Hogyan dolgozom</SectionHeading>
            <BodyText>A legtöbb projekt problémája nem a kóddal kezdődik.</BodyText>
            <BodyText>Sokkal gyakrabban találkozom ezekkel a kihívásokkal:</BodyText>
          </Reveal>

          {/* Process card */}
          <Reveal delay={0.12}>
            <div style={{
              background: "#fff",
              border: "1px solid rgba(0,0,0,0.07)",
              borderRadius: "1.375rem",
              padding: "2rem",
              boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
            }}>
              <div style={{ fontSize: "0.6875rem", fontWeight: 750, color: "#9ca3af", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "1rem" }}>Tipikus kihívások</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
                {[
                  "Hiányos vagy bizonytalan specifikáció",
                  "Gyenge kommunikáció a felek között",
                  "Nem egyértelmű üzleti célok",
                  "Felhalmozódott technikai adósság",
                ].map((item) => (
                  <div key={item} style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.75rem 1rem", background: "#fef2f2", border: "1px solid rgba(239,68,68,0.1)", borderRadius: "0.875rem" }}>
                    <span style={{ fontSize: "0.875rem", color: "#374151", fontWeight: 500 }}>{item}</span>
                  </div>
                ))}
              </div>

              <div style={{ borderTop: "1px solid rgba(0,0,0,0.07)", marginTop: "1.5rem", paddingTop: "1.5rem" }}>
                <div style={{ fontSize: "0.6875rem", fontWeight: 750, color: "#9ca3af", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "1rem" }}>A megközelítésem</div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
                  {[
                    "Részletes igényfelmérés a projekt elején",
                    "Kiszámítható, átlátható kommunikáció",
                    "Üzleti célok előtérben a technológiával szemben",
                    "Tiszta, dokumentált és bővíthető rendszerek",
                  ].map((item) => (
                    <div key={item} style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.75rem 1rem", background: "#f0fdf4", border: "1px solid rgba(34,197,94,0.12)", borderRadius: "0.875rem" }}>
                      <span style={{ width: "16px", height: "16px", borderRadius: "50%", background: "#f0fdf4", border: "1.5px solid #bbf7d0", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <Check size={8} color="#22c55e" strokeWidth={3} />
                      </span>
                      <span style={{ fontSize: "0.875rem", color: "#374151", fontWeight: 500 }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <p style={{ fontSize: "0.9rem", color: "#6e6e80", lineHeight: 1.7, margin: "1.5rem 0 0", fontStyle: "italic", borderLeft: "3px solid #22c55e", paddingLeft: "1rem" }}>
                Hiszek abban, hogy egy jól előkészített projekt gyorsabban, kiszámíthatóbban és jobb eredménnyel valósul meg.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── 06 WHY ME ─────────────────────────────────────────────────────── */}
      <section style={{ background: "#fff", padding: "6.5rem 1.5rem" }}>
        <div style={{ maxWidth: "72rem", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "start" }} className="about-two-col">

          {/* Trust traits */}
          <Reveal delay={0.08}>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
              <div style={{ fontSize: "0.6875rem", fontWeight: 750, color: "#9ca3af", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.25rem" }}>Miért velem?</div>
              {TRUST_TRAITS.map((trait) => (
                <div
                  key={trait}
                  style={{
                    display: "flex", alignItems: "center", gap: "1rem",
                    background: "#fafafa", border: "1px solid rgba(0,0,0,0.07)",
                    borderRadius: "1rem", padding: "1rem 1.25rem",
                    transition: "border-color 0.15s, background 0.15s, transform 0.12s",
                    cursor: "default",
                  }}
                  onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "rgba(34,197,94,0.25)"; el.style.background = "#f0fdf4"; el.style.transform = "translateX(4px)"; }}
                  onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "rgba(0,0,0,0.07)"; el.style.background = "#fafafa"; el.style.transform = "translateX(0)"; }}
                >
                  <span style={{ width: "22px", height: "22px", borderRadius: "50%", background: "#f0fdf4", border: "1.5px solid #bbf7d0", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Check size={11} color="#22c55e" strokeWidth={3} />
                  </span>
                  <span style={{ fontSize: "0.9375rem", color: "#0f1117", fontWeight: 600, letterSpacing: "-0.02em" }}>{trait}</span>
                </div>
              ))}
            </div>
          </Reveal>

          {/* Text */}
          <Reveal>
            <SectionLabel>A szemléletem</SectionLabel>
            <SectionHeading>Miért dolgoznak velem az ügyfelek?</SectionHeading>

            <BodyText>
              Mert nem egyszerre tíz projektre próbálok figyelni.
            </BodyText>
            <BodyText>
              Amikor elvállalok egy munkát, teljes figyelemmel és felelősséggel állok mögé.
            </BodyText>
            <BodyText>
              Fontos számomra, hogy az elkészült rendszer ne csak működjön, hanem hosszú távon is stabil, bővíthető és fenntartható legyen.
            </BodyText>
            <BodyText style={{ margin: 0 }}>
              Minden projektet úgy kezelek, mintha a sajátom lenne.
            </BodyText>

            {/* Workspace photo */}
            <div style={{ marginTop: "2rem", borderRadius: "1.25rem", overflow: "hidden", boxShadow: "0 8px 32px rgba(0,0,0,0.1)", background: "#f0fdf4", height: "200px" }}>
              <img
                src={profileHero}
                alt="Jandl Dávid portréja hajón"
                width={1200}
                height={1600}
                loading="lazy"
                decoding="async"
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── FINAL CTA ─────────────────────────────────────────────────────── */}
      <section style={{ background: "#f9f9fb", padding: "6.5rem 1.5rem" }}>
        <div style={{ maxWidth: "72rem", margin: "0 auto" }}>
          <Reveal>
            <div style={{
              background: "linear-gradient(135deg, #0f1117 0%, #1a1d27 100%)",
              borderRadius: "1.75rem",
              padding: "clamp(2.5rem, 5vw, 4rem)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              gap: "2rem",
              position: "relative",
              overflow: "hidden",
              boxShadow: "0 24px 64px rgba(0,0,0,0.2)",
            }}>
              {/* Glows */}
              <div style={{ position: "absolute", width: "500px", height: "500px", borderRadius: "50%", background: "radial-gradient(circle, rgba(34,197,94,0.09) 0%, transparent 70%)", top: "-150px", left: "50%", transform: "translateX(-50%)", pointerEvents: "none" }} />
              <div style={{ position: "absolute", width: "300px", height: "300px", borderRadius: "50%", background: "radial-gradient(circle, rgba(34,197,94,0.06) 0%, transparent 70%)", bottom: "-80px", right: "10%", pointerEvents: "none" }} />

              {/* Status */}
              <div style={{ position: "relative", zIndex: 1 }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.25)", borderRadius: "9999px", padding: "0.375rem 1rem", fontSize: "0.8125rem", fontWeight: 650, color: "#22c55e" }}>
                  <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#22c55e", animation: "pulseGreen 2s ease-in-out infinite" }} />
                  Elérhető új együttműködésekre
                </span>
              </div>

              <div style={{ position: "relative", zIndex: 1 }}>
                <h2 style={{ fontSize: "clamp(1.75rem, 3vw, 2.625rem)", fontWeight: 800, color: "#fff", letterSpacing: "-0.045em", lineHeight: 1.15, margin: "0 0 1rem" }}>
                  Készen állsz beszélni a{" "}
                  <span style={{ color: "#22c55e" }}>projektedről?</span>
                </h2>
                <p style={{ fontSize: "1.0625rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.7, margin: 0, maxWidth: "480px" }}>
                  Ha van egy ötleted vagy egy problémád, amire technikai megoldást keresel, beszéljünk róla.
                </p>
              </div>

              {/* Buttons */}
              <div style={{ display: "flex", gap: "0.875rem", flexWrap: "wrap", justifyContent: "center", position: "relative", zIndex: 1 }}>
                <button
                  onClick={() => { navigate("/"); setTimeout(scrollToContact, 150); }}
                  style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "#22c55e", color: "#fff", border: "none", borderRadius: "0.875rem", padding: "0.9375rem 1.875rem", fontSize: "1rem", fontWeight: 700, cursor: "pointer", letterSpacing: "-0.025em", boxShadow: "0 4px 20px rgba(34,197,94,0.35)", transition: "all 0.15s" }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "#16a34a"; e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 6px 28px rgba(34,197,94,0.45)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "#22c55e"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(34,197,94,0.35)"; }}
                >
                  Indítsük el a fejlesztést <ArrowRight size={16} />
                </button>
                <button
                  onClick={() => { navigate("/"); setTimeout(scrollToContactAndConsult, 150); }}
                  style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "transparent", color: "rgba(255,255,255,0.6)", border: "1.5px solid rgba(255,255,255,0.15)", borderRadius: "0.875rem", padding: "0.9375rem 1.625rem", fontSize: "1rem", fontWeight: 650, cursor: "pointer", letterSpacing: "-0.02em", transition: "all 0.15s" }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(34,197,94,0.5)"; e.currentTarget.style.color = "#22c55e"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"; e.currentTarget.style.color = "rgba(255,255,255,0.6)"; e.currentTarget.style.transform = "translateY(0)"; }}
                >
                  Kérj szakmai konzultációt
                </button>
              </div>

              {/* Trust row */}
              <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap", justifyContent: "center", position: "relative", zIndex: 1 }}>
                {["Ingyenes első egyeztetés", "24 órán belül válaszolok", "Nincs kötelezettség"].map((t) => (
                  <div key={t} style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <Check size={13} color="#22c55e" strokeWidth={2.5} />
                    <span style={{ fontSize: "0.8125rem", color: "rgba(255,255,255,0.4)", fontWeight: 500 }}>{t}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── About footer ──────────────────────────────────────────────────── */}
      <AboutFooter navigate={navigate} />

      <style>{`
        @keyframes pulseGreen {
          0%, 100% { box-shadow: 0 0 0 3px rgba(34,197,94,0.22); }
          50%       { box-shadow: 0 0 0 6px rgba(34,197,94,0.08); }
        }
        * { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
        html { scrollbar-width: none; }
        html::-webkit-scrollbar { display: none; }

        @media (max-width: 900px) {
          .about-hero-grid     { grid-template-columns: 1fr !important; gap: 3rem !important; }
          .about-two-col       { grid-template-columns: 1fr !important; gap: 2.5rem !important; }
          .about-expertise-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 640px) {
          .about-portrait-col  { display: none !important; }
          .about-expertise-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

// ─── About Nav ────────────────────────────────────────────────────────────────

const ABOUT_NAV = [
  { label: "Projektek",      sectionId: SECTION_IDS.projects },
  { label: "Szolgáltatások", sectionId: SECTION_IDS.services },
  { label: "Folyamat",       sectionId: SECTION_IDS.process },
  { label: "Rólam",          href: "/about" },
] as const;

function AboutNav({ navigate }: { navigate: (path: string) => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Prevent background scroll while mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  function handleNavClick(item: typeof ABOUT_NAV[number]) {
    setMenuOpen(false);
    if ("href" in item) { navigate(item.href); return; }
    // Navigate home first, then scroll after mount
    navigate("/");
    setTimeout(() => scrollToSection(item.sectionId), 120);
  }

  return (
    <nav
      style={{
        position: "sticky", top: 0, zIndex: 50,
        background: scrolled ? "rgba(255,255,255,0.88)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(0,0,0,0.06)" : "none",
        transition: "background 0.2s, border-color 0.2s",
      }}
    >
      <div style={{
        maxWidth: "72rem", margin: "0 auto",
        padding: "0 1.5rem", height: "64px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        {/* Wordmark */}
        <button
          onClick={() => navigate("/")}
          style={{ background: "none", border: "none", cursor: "pointer", padding: 0, textAlign: "left" }}
        >
          <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.1 }}>
            <span style={{ fontWeight: 800, fontSize: "0.9375rem", letterSpacing: "-0.03em", color: "#0f1117" }}>Jandl Dávid</span>
            <span style={{ fontSize: "0.6875rem", fontWeight: 600, color: "#22c55e", letterSpacing: "0.02em" }}>Technikai partner</span>
          </div>
        </button>

        {/* Desktop links */}
        <div className="hidden md:flex" style={{ alignItems: "center", gap: "1.75rem" }}>
          {ABOUT_NAV.map((item) => (
            <button
              key={item.label}
              onClick={() => handleNavClick(item)}
              style={{ fontSize: "0.875rem", color: item.label === "Rólam" ? "#22c55e" : "#6e6e80", background: "none", border: "none", cursor: "pointer", fontWeight: item.label === "Rólam" ? 650 : 500, padding: "0.25rem 0", letterSpacing: "-0.01em", transition: "color 0.15s", position: "relative" }}
              onMouseEnter={(e) => { if (item.label !== "Rólam") e.currentTarget.style.color = "#0f1117"; }}
              onMouseLeave={(e) => { if (item.label !== "Rólam") e.currentTarget.style.color = "#6e6e80"; }}
            >
              {item.label}
              {item.label === "Rólam" && (
                <span style={{ position: "absolute", bottom: "-2px", left: 0, right: 0, height: "2px", background: "#22c55e", borderRadius: "9999px" }} />
              )}
            </button>
          ))}
          <button
            onClick={() => { navigate("/"); setTimeout(scrollToContact, 150); }}
            style={{ fontSize: "0.875rem", fontWeight: 650, color: "#fff", background: "#0f1117", padding: "0.5rem 1.25rem", borderRadius: "0.625rem", border: "none", cursor: "pointer", letterSpacing: "-0.01em", transition: "background 0.15s" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#22c55e")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#0f1117")}
          >
            Lépjünk kapcsolatba
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden"
          style={{ background: "none", border: "none", cursor: "pointer", color: "#0f1117", padding: "0.5rem" }}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{ background: "rgba(255,255,255,0.97)", backdropFilter: "blur(20px)", borderTop: "1px solid rgba(0,0,0,0.06)", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
          <button onClick={() => navigate("/")} style={{ fontSize: "1rem", color: "#6e6e80", background: "none", border: "none", cursor: "pointer", fontWeight: 500, textAlign: "left", padding: "0.25rem 0" }}>← Főoldal</button>
          {ABOUT_NAV.map((item) => (
            <button key={item.label} onClick={() => handleNavClick(item)} style={{ fontSize: "1rem", color: item.label === "Rólam" ? "#22c55e" : "#0f1117", background: "none", border: "none", cursor: "pointer", fontWeight: 500, textAlign: "left", padding: "0.25rem 0" }}>
              {item.label}
            </button>
          ))}
          <button onClick={() => { setMenuOpen(false); navigate("/"); setTimeout(scrollToContact, 150); }} style={{ fontSize: "1rem", color: "#22c55e", background: "none", border: "none", cursor: "pointer", fontWeight: 700, textAlign: "left", padding: "0.25rem 0" }}>
            Lépjünk kapcsolatba →
          </button>
        </div>
      )}
    </nav>
  );
}

// ─── About Footer ─────────────────────────────────────────────────────────────

const FOOTER_NAV = [
  { label: "Projektek",      sectionId: SECTION_IDS.projects },
  { label: "Szolgáltatások", sectionId: SECTION_IDS.services },
  { label: "Rólam",          href: "/about" },
  { label: "Kapcsolat",      sectionId: SECTION_IDS.contact },
] as const;

const FOOTER_CONTACTS = [
  { icon: <Mail size={14} />, label: "jandldavid@gmail.com", href: "mailto:jandldavid@gmail.com" },
  { icon: <Linkedin size={14} />, label: "LinkedIn", href: "#" },
  { icon: <Github size={14} />, label: "GitHub", href: "#" },
];

function AboutFooter({ navigate }: { navigate: (path: string) => void }) {
  function goAndScroll(sectionId: string) {
    navigate("/");
    setTimeout(() => scrollToSection(sectionId), 120);
  }

  return (
    <footer style={{ fontFamily: "'Inter', -apple-system, sans-serif" }}>

      {/* ── Final CTA strip ─────────────────────────────────────────────── */}
      <div style={{ background: "#f9f9fb", borderTop: "1px solid rgba(0,0,0,0.055)", padding: "5rem 1.5rem" }}>
        <div style={{ maxWidth: "72rem", margin: "0 auto" }}>
          <div style={{
            background: "linear-gradient(135deg, #0f1117 0%, #1a1d27 100%)",
            borderRadius: "1.75rem",
            padding: "clamp(2.5rem, 5vw, 3.5rem)",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            gap: "2rem", flexWrap: "wrap",
            position: "relative", overflow: "hidden",
            boxShadow: "0 24px 64px rgba(0,0,0,0.2)",
          }}>
            {/* Glows */}
            <div style={{ position: "absolute", width: "400px", height: "400px", borderRadius: "50%", background: "radial-gradient(circle, rgba(34,197,94,0.09) 0%, transparent 70%)", top: "-120px", right: "60px", pointerEvents: "none" }} />
            <div style={{ position: "absolute", top: "1.5rem", left: "2.25rem", fontSize: "5.5rem", lineHeight: 1, color: "rgba(34,197,94,0.07)", fontFamily: "Georgia, serif", fontWeight: 900, pointerEvents: "none", userSelect: "none" }}>"</div>

            <div style={{ maxWidth: "520px", position: "relative", zIndex: 1 }}>
              <p style={{ fontSize: "clamp(1.25rem, 2.4vw, 1.75rem)", fontWeight: 800, color: "#fff", letterSpacing: "-0.04em", lineHeight: 1.25, margin: "0 0 0.75rem" }}>
                Van egy ötleted vagy{" "}
                <span style={{ color: "#22c55e" }}>problémád?</span>
              </p>
              <p style={{ fontSize: "1rem", color: "rgba(255,255,255,0.45)", lineHeight: 1.65, margin: 0 }}>
                Találjuk meg együtt a megfelelő technikai megoldást.
              </p>
            </div>

            <div style={{ display: "flex", gap: "0.875rem", flexWrap: "wrap", position: "relative", zIndex: 1 }}>
              <button
                onClick={() => { navigate("/"); setTimeout(scrollToContact, 150); }}
                style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "#22c55e", color: "#fff", border: "none", borderRadius: "0.875rem", padding: "0.9375rem 1.75rem", fontSize: "0.9375rem", fontWeight: 700, cursor: "pointer", letterSpacing: "-0.025em", boxShadow: "0 4px 20px rgba(34,197,94,0.35)", transition: "all 0.15s" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#16a34a"; e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 6px 28px rgba(34,197,94,0.45)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "#22c55e"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(34,197,94,0.35)"; }}
              >
                Indítsük el a fejlesztést <ArrowRight size={15} />
              </button>
              <button
                onClick={() => { navigate("/"); setTimeout(scrollToContactAndConsult, 150); }}
                style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "transparent", color: "rgba(255,255,255,0.6)", border: "1.5px solid rgba(255,255,255,0.15)", borderRadius: "0.875rem", padding: "0.9375rem 1.5rem", fontSize: "0.9375rem", fontWeight: 650, cursor: "pointer", letterSpacing: "-0.02em", transition: "all 0.15s" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(34,197,94,0.5)"; e.currentTarget.style.color = "#22c55e"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"; e.currentTarget.style.color = "rgba(255,255,255,0.6)"; e.currentTarget.style.transform = "translateY(0)"; }}
              >
                Kérj szakmai konzultációt
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main footer ─────────────────────────────────────────────────── */}
      <div style={{
        background: "linear-gradient(175deg, #0a0c10 0%, #0c1209 40%, #0a0c10 100%)",
        position: "relative", overflow: "hidden",
      }}>
        {/* Glows */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0 }}>
          <div style={{ position: "absolute", width: "600px", height: "600px", borderRadius: "50%", background: "radial-gradient(circle, rgba(34,197,94,0.05) 0%, transparent 65%)", top: "-200px", left: "50%", transform: "translateX(-50%)" }} />
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: "linear-gradient(90deg, transparent 0%, rgba(34,197,94,0.3) 30%, rgba(34,197,94,0.5) 50%, rgba(34,197,94,0.3) 70%, transparent 100%)" }} />
        </div>

        {/* Columns */}
        <div style={{ position: "relative", zIndex: 1, maxWidth: "72rem", margin: "0 auto", padding: "4rem 1.5rem 3rem" }}>
          <div className="about-footer-grid" style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr 1fr", gap: "3rem" }}>

            {/* Col 1 — Brand */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}>
                <span style={{ fontSize: "1.125rem", fontWeight: 800, letterSpacing: "-0.04em", color: "#fff" }}>Jandl Dávid</span>
                <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "#22c55e", letterSpacing: "0.02em" }}>Technikai partner</span>
              </div>

              <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.38)", lineHeight: 1.7, margin: 0, maxWidth: "260px", letterSpacing: "-0.01em" }}>
                Technikai partner vállalkozások számára. Webalkalmazások, automatizációk, infrastruktúra és security-first fejlesztés.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {["Full-stack fejlesztés", "Infrastruktúra", "Security szemlélet"].map((t) => (
                  <div key={t} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span style={{ width: "16px", height: "16px", borderRadius: "50%", background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.25)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Check size={8} color="#22c55e" strokeWidth={3} />
                    </span>
                    <span style={{ fontSize: "0.8125rem", color: "rgba(255,255,255,0.42)", fontWeight: 500 }}>{t}</span>
                  </div>
                ))}
              </div>

              <span style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.22)", borderRadius: "9999px", padding: "0.35rem 0.875rem", fontSize: "0.75rem", fontWeight: 650, color: "#22c55e", width: "fit-content" }}>
                <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#22c55e", animation: "pulseGreen 2s ease-in-out infinite" }} />
                Elérhető új együttműködésekre
              </span>
            </div>

            {/* Col 2 — Navigation */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <span style={{ fontSize: "0.6875rem", fontWeight: 750, color: "rgba(255,255,255,0.25)", letterSpacing: "0.1em", textTransform: "uppercase" }}>Navigáció</span>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
                {FOOTER_NAV.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => {
                      if ("href" in item) { navigate(item.href); return; }
                      goAndScroll(item.sectionId);
                    }}
                    style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.45)", background: "none", border: "none", fontWeight: 500, letterSpacing: "-0.01em", transition: "color 0.15s", textAlign: "left", cursor: "pointer", padding: 0 }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.45)")}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Col 3 — Contact */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <span style={{ fontSize: "0.6875rem", fontWeight: 750, color: "rgba(255,255,255,0.25)", letterSpacing: "0.1em", textTransform: "uppercase" }}>Kapcsolat</span>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
                {FOOTER_CONTACTS.map((c) => (
                  <a
                    key={c.label}
                    href={c.href}
                    style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", fontSize: "0.9rem", color: "rgba(255,255,255,0.45)", textDecoration: "none", fontWeight: 500, letterSpacing: "-0.01em", transition: "color 0.15s" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#22c55e")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.45)")}
                  >
                    <span style={{ opacity: 0.6 }}>{c.icon}</span>
                    {c.label}
                    {c.label !== "jandldavid@gmail.com" && <ExternalLink size={11} style={{ opacity: 0.35 }} />}
                  </a>
                ))}
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.625rem 0.875rem", background: "rgba(34,197,94,0.07)", border: "1px solid rgba(34,197,94,0.14)", borderRadius: "0.75rem" }}>
                <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#22c55e", flexShrink: 0, animation: "pulseGreen 2s ease-in-out infinite" }} />
                <span style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.45)", fontWeight: 500 }}>Általában 24 órán belül válaszolok</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ position: "relative", zIndex: 1, borderTop: "1px solid rgba(255,255,255,0.05)", padding: "1.5rem" }}>
          <div style={{ maxWidth: "72rem", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.75rem" }}>
            <span style={{ fontSize: "0.8125rem", color: "rgba(255,255,255,0.22)", fontWeight: 500 }}>© 2026 Jandl Dávid</span>
            <span style={{ fontSize: "0.8125rem", color: "rgba(255,255,255,0.18)", fontWeight: 500 }}>Built with performance & security in mind.</span>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .about-footer-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 560px) {
          .about-footer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  );
}
