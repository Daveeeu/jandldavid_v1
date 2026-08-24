import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "motion/react";
import {
  Check,
  ChevronDown,
  TrendingUp,
  Users,
  ShoppingCart,
  Activity,
  Server,
  Cloud,
  CheckCircle,
  AlertCircle,
  ShieldCheck,
  Lock,
  Eye,
  Wifi,
} from "lucide-react";

// ─── Shared primitives ────────────────────────────────────────────────────────

const CARD_RADIUS = "1.75rem";
const ITEM_RADIUS = "0.875rem";

function Badge({ label, color = "#0f1117", bg = "#f3f4f6" }: { label: string; color?: string; bg?: string }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        background: bg,
        color,
        fontSize: "0.75rem",
        fontWeight: 650,
        letterSpacing: "-0.01em",
        padding: "0.3rem 0.75rem",
        borderRadius: "9999px",
        border: `1px solid ${color}22`,
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </span>
  );
}

function FeatureItem({ label }: { label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
      <span
        style={{
          width: "18px",
          height: "18px",
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
      <span style={{ fontSize: "0.9rem", color: "#4b5563", fontWeight: 500, letterSpacing: "-0.01em" }}>
        {label}
      </span>
    </div>
  );
}

// ─── Card 01 mockup: Dashboard ─────────────────────────────────────────────

const CHART_BARS = [42, 58, 45, 72, 65, 88, 76, 94, 82, 98, 87, 100];

function DashboardMockup() {
  return (
    <div
      style={{
        background: "#0f1117",
        borderRadius: "1.25rem",
        overflow: "hidden",
        boxShadow: "0 24px 64px rgba(0,0,0,0.22), 0 4px 16px rgba(0,0,0,0.14)",
        fontFamily: "'Inter', sans-serif",
        width: "100%",
        maxWidth: "480px",
      }}
    >
      {/* Top bar */}
      <div
        style={{
          background: "#1a1d27",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          padding: "0.75rem 1.125rem",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
        }}
      >
        <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#ef4444", opacity: 0.7 }} />
        <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#f59e0b", opacity: 0.7 }} />
        <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#22c55e", opacity: 0.7 }} />
        <span style={{ flex: 1, textAlign: "center", fontSize: "0.6875rem", color: "rgba(255,255,255,0.3)", letterSpacing: "0.02em" }}>
          dashboard.app
        </span>
      </div>

      <div style={{ padding: "1.25rem" }}>
        {/* Stat cards row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.625rem", marginBottom: "1rem" }}>
          {[
            { label: "Revenue", value: "€48.2K", delta: "+12.4%", color: "#22c55e" },
            { label: "Users", value: "3,841", delta: "+8.1%", color: "#3b82f6" },
            { label: "Conversion", value: "4.7%", delta: "+0.6%", color: "#8b5cf6" },
          ].map((s) => (
            <div
              key={s.label}
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: "0.75rem",
                padding: "0.75rem",
              }}
            >
              <div style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.38)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "0.3rem" }}>
                {s.label}
              </div>
              <div style={{ fontSize: "1rem", fontWeight: 700, color: "#fff", letterSpacing: "-0.03em", marginBottom: "0.2rem" }}>
                {s.value}
              </div>
              <div style={{ fontSize: "0.6875rem", color: s.color, fontWeight: 600 }}>{s.delta}</div>
            </div>
          ))}
        </div>

        {/* Chart */}
        <div
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: "0.875rem",
            padding: "1rem",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.875rem" }}>
            <div>
              <div style={{ fontSize: "0.6875rem", color: "rgba(255,255,255,0.38)", letterSpacing: "0.05em", textTransform: "uppercase" }}>Revenue trend</div>
              <div style={{ fontSize: "1.125rem", fontWeight: 700, color: "#fff", letterSpacing: "-0.03em" }}>€48,240</div>
            </div>
            <span style={{ fontSize: "0.7rem", background: "rgba(34,197,94,0.15)", color: "#22c55e", padding: "0.25rem 0.625rem", borderRadius: "9999px", fontWeight: 600 }}>
              +12.4% ↑
            </span>
          </div>
          {/* Bar chart */}
          <div style={{ display: "flex", alignItems: "flex-end", gap: "3px", height: "56px" }}>
            {CHART_BARS.map((h, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  height: `${h}%`,
                  borderRadius: "3px 3px 0 0",
                  background:
                    i === CHART_BARS.length - 1
                      ? "#22c55e"
                      : `rgba(34,197,94,${0.18 + (h / 100) * 0.35})`,
                  transition: "height 0.3s",
                }}
              />
            ))}
          </div>
        </div>

        {/* Bottom row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.625rem", marginTop: "0.625rem" }}>
          {[
            { label: "Active sessions", value: "247", icon: <Activity size={12} />, color: "#22c55e" },
            { label: "Orders today", value: "38", icon: <ShoppingCart size={12} />, color: "#3b82f6" },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: "0.75rem",
                padding: "0.75rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <span style={{ color: item.color }}>{item.icon}</span>
              <div>
                <div style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.35)", letterSpacing: "0.04em", textTransform: "uppercase" }}>{item.label}</div>
                <div style={{ fontSize: "0.9375rem", fontWeight: 700, color: "#fff", letterSpacing: "-0.02em" }}>{item.value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Card 02 mockup: Terminal + infra ─────────────────────────────────────

const TERMINAL_LINES = [
  { text: "$ docker compose up --build", color: "rgba(255,255,255,0.7)" },
  { text: "[+] Building 3/3 ✓", color: "#22c55e" },
  { text: "Container app_web     Started", color: "#86efac" },
  { text: "Container app_db      Started", color: "#86efac" },
  { text: "Container app_nginx   Started", color: "#86efac" },
  { text: "$ ./deploy.sh production", color: "rgba(255,255,255,0.7)" },
  { text: "✓ Health check passed", color: "#22c55e" },
  { text: "✓ Deployment successful  🚀", color: "#22c55e" },
];

function InfraMockup() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", width: "100%", maxWidth: "480px" }}>
      {/* Terminal */}
      <div
        style={{
          background: "#0c0e14",
          borderRadius: "1.125rem",
          overflow: "hidden",
          boxShadow: "0 16px 48px rgba(0,0,0,0.2), 0 4px 12px rgba(0,0,0,0.12)",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div
          style={{
            background: "#161820",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
            padding: "0.625rem 1rem",
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
          }}
        >
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#ef4444", opacity: 0.65 }} />
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#f59e0b", opacity: 0.65 }} />
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e", opacity: 0.65 }} />
          <span style={{ marginLeft: "0.5rem", fontSize: "0.6875rem", color: "rgba(255,255,255,0.3)", fontFamily: "monospace" }}>
            deploy — bash
          </span>
        </div>
        <div style={{ padding: "1rem 1.125rem", display: "flex", flexDirection: "column", gap: "0.3rem" }}>
          {TERMINAL_LINES.map((line, i) => (
            <div key={i} style={{ fontFamily: "monospace", fontSize: "0.75rem", color: line.color, lineHeight: 1.6 }}>
              {line.text}
            </div>
          ))}
          <div style={{ display: "flex", alignItems: "center", gap: "0.25rem", marginTop: "0.125rem" }}>
            <span style={{ fontFamily: "monospace", fontSize: "0.75rem", color: "rgba(255,255,255,0.5)" }}>$ </span>
            <span
              style={{
                width: "8px",
                height: "14px",
                background: "#22c55e",
                borderRadius: "1px",
                opacity: 0.85,
                animation: "blinkCursor 1.1s steps(1) infinite",
              }}
            />
          </div>
        </div>
      </div>

      {/* Metrics row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.625rem" }}>
        {[
          { label: "24/7", sublabel: "Monitoring", icon: <Activity size={14} />, color: "#22c55e", bg: "#f0fdf4" },
          { label: "Auto", sublabel: "Deployment", icon: <Cloud size={14} />, color: "#3b82f6", bg: "#eff6ff" },
          { label: "Daily", sublabel: "Backup", icon: <Server size={14} />, color: "#8b5cf6", bg: "#faf5ff" },
        ].map((m) => (
          <div
            key={m.label}
            style={{
              background: "#fff",
              border: "1px solid rgba(0,0,0,0.07)",
              borderRadius: "0.875rem",
              padding: "0.875rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.375rem",
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            }}
          >
            <span
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "0.5rem",
                background: m.bg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: m.color,
              }}
            >
              {m.icon}
            </span>
            <div style={{ fontSize: "0.9375rem", fontWeight: 750, color: "#0f1117", letterSpacing: "-0.03em" }}>{m.label}</div>
            <div style={{ fontSize: "0.6875rem", color: "#9ca3af", fontWeight: 500 }}>{m.sublabel}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Card 03 mockup: Security dashboard ──────────────────────────────────

const AUDIT_ITEMS = [
  { label: "SQL Injection", status: "pass" },
  { label: "XSS Protection", status: "pass" },
  { label: "CSRF Tokens", status: "pass" },
  { label: "Rate Limiting", status: "pass" },
  { label: "Auth Tokens", status: "warn" },
];

function SecurityMockup() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", width: "100%", maxWidth: "480px" }}>
      {/* Score card */}
      <div
        style={{
          background: "#fff",
          border: "1px solid rgba(0,0,0,0.07)",
          borderRadius: "1.125rem",
          padding: "1.25rem",
          boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
          display: "flex",
          alignItems: "center",
          gap: "1.25rem",
        }}
      >
        {/* Score ring */}
        <div style={{ position: "relative", flexShrink: 0 }}>
          <svg width="72" height="72" viewBox="0 0 72 72">
            <circle cx="36" cy="36" r="30" fill="none" stroke="#f0fdf4" strokeWidth="7" />
            <circle
              cx="36" cy="36" r="30"
              fill="none"
              stroke="#22c55e"
              strokeWidth="7"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 30 * 0.98} ${2 * Math.PI * 30}`}
              transform="rotate(-90 36 36)"
            />
          </svg>
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: "1.125rem", fontWeight: 800, color: "#0f1117", letterSpacing: "-0.04em", lineHeight: 1 }}>98</span>
            <span style={{ fontSize: "0.6rem", color: "#9ca3af", fontWeight: 600, letterSpacing: "0.04em" }}>SCORE</span>
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: "0.875rem", fontWeight: 700, color: "#0f1117", letterSpacing: "-0.025em", marginBottom: "0.25rem" }}>
            Security Score
          </div>
          <div style={{ fontSize: "0.8125rem", color: "#6e6e80", marginBottom: "0.625rem" }}>
            98% — Kiváló
          </div>
          <div style={{ display: "flex", gap: "0.375rem", flexWrap: "wrap" }}>
            {["Auth", "API", "Server"].map((t) => (
              <span
                key={t}
                style={{
                  fontSize: "0.6875rem",
                  fontWeight: 600,
                  background: "#f0fdf4",
                  color: "#16a34a",
                  border: "1px solid #bbf7d0",
                  borderRadius: "9999px",
                  padding: "0.2rem 0.5rem",
                }}
              >
                ✓ {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Audit list */}
      <div
        style={{
          background: "#fff",
          border: "1px solid rgba(0,0,0,0.07)",
          borderRadius: "1.125rem",
          padding: "1rem 1.125rem",
          boxShadow: "0 4px 16px rgba(0,0,0,0.05)",
        }}
      >
        <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#0f1117", letterSpacing: "-0.01em", marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.375rem" }}>
          <ShieldCheck size={14} color="#22c55e" />
          Security Audit
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
          {AUDIT_ITEMS.map((item) => (
            <div
              key={item.label}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0.5rem 0.75rem",
                borderRadius: "0.625rem",
                background: item.status === "pass" ? "#fafffe" : "#fffbeb",
                border: `1px solid ${item.status === "pass" ? "rgba(34,197,94,0.1)" : "rgba(245,158,11,0.15)"}`,
              }}
            >
              <span style={{ fontSize: "0.8rem", color: "#374151", fontWeight: 500 }}>{item.label}</span>
              {item.status === "pass" ? (
                <CheckCircle size={14} color="#22c55e" />
              ) : (
                <AlertCircle size={14} color="#f59e0b" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom metric row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.625rem" }}>
        {[
          { label: "Protected", sublabel: "Endpoints", icon: <Lock size={13} />, color: "#22c55e", bg: "#f0fdf4" },
          { label: "Audit", sublabel: "Ready", icon: <Eye size={13} />, color: "#3b82f6", bg: "#eff6ff" },
          { label: "JWT", sublabel: "Secured", icon: <Wifi size={13} />, color: "#8b5cf6", bg: "#faf5ff" },
        ].map((m) => (
          <div
            key={m.sublabel}
            style={{
              background: "#fff",
              border: "1px solid rgba(0,0,0,0.07)",
              borderRadius: "0.875rem",
              padding: "0.875rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.375rem",
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            }}
          >
            <span style={{ width: "28px", height: "28px", borderRadius: "0.5rem", background: m.bg, display: "flex", alignItems: "center", justifyContent: "center", color: m.color }}>
              {m.icon}
            </span>
            <div style={{ fontSize: "0.875rem", fontWeight: 750, color: "#0f1117", letterSpacing: "-0.025em" }}>{m.label}</div>
            <div style={{ fontSize: "0.6875rem", color: "#9ca3af", fontWeight: 500 }}>{m.sublabel}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Accordion expanded content ───────────────────────────────────────────────

interface ExpandedSection {
  title: string;
  items: string[];
}

interface ExpandedContent {
  heading: string;
  intro: string[];
  quote: string;
  sections: ExpandedSection[];
  techTags: { label: string; color?: string; bg?: string }[];
  relatedLinks?: { label: string; href: string }[];
}

function TechTag({ label, color = "#0f1117", bg = "#f3f4f6" }: { label: string; color?: string; bg?: string }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        fontSize: "0.75rem",
        fontWeight: 650,
        letterSpacing: "-0.01em",
        color,
        background: bg,
        border: `1px solid ${color}22`,
        padding: "0.35rem 0.875rem",
        borderRadius: "9999px",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </span>
  );
}

function ExpandedDetail({
  content,
  accentColor,
  accentBg,
}: {
  content: ExpandedContent;
  accentColor: string;
  accentBg: string;
}) {
  return (
    <motion.div
      key="expanded"
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
      style={{
        borderTop: `1px solid ${accentColor}18`,
        paddingTop: "2rem",
        marginTop: "0.5rem",
        display: "flex",
        flexDirection: "column",
        gap: "2rem",
      }}
    >
      {/* Intro text */}
      <div
        style={{
          background: accentBg,
          border: `1px solid ${accentColor}20`,
          borderRadius: "1rem",
          padding: "1.5rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.75rem",
        }}
      >
        <div
          style={{
            fontSize: "1rem",
            fontWeight: 750,
            color: "#0f1117",
            letterSpacing: "-0.03em",
            lineHeight: 1.3,
          }}
        >
          {content.heading}
        </div>
        {content.intro.map((line, i) => (
          <p key={i} style={{ fontSize: "0.9rem", color: "#4b5563", lineHeight: 1.7, margin: 0 }}>
            {line}
          </p>
        ))}
        {/* Pull quote */}
        <div
          style={{
            borderLeft: `3px solid ${accentColor}`,
            paddingLeft: "1rem",
            marginTop: "0.25rem",
          }}
        >
          <p
            style={{
              fontSize: "0.9375rem",
              fontWeight: 650,
              color: "#0f1117",
              letterSpacing: "-0.025em",
              lineHeight: 1.5,
              margin: 0,
              fontStyle: "italic",
            }}
          >
            {content.quote}
          </p>
        </div>
      </div>

      {/* Sections grid */}
      <div
        className="expanded-sections-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1rem",
        }}
      >
        {content.sections.map((section) => (
          <div
            key={section.title}
            style={{
              background: "#fff",
              border: "1px solid rgba(0,0,0,0.07)",
              borderRadius: "1rem",
              padding: "1.25rem",
              boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
            }}
          >
            <div
              style={{
                fontSize: "0.6875rem",
                fontWeight: 750,
                color: accentColor,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                marginBottom: "0.875rem",
              }}
            >
              {section.title}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem" }}>
              {section.items.map((item) => (
                <div key={item} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span
                    style={{
                      width: "16px",
                      height: "16px",
                      borderRadius: "50%",
                      background: accentBg,
                      border: `1.5px solid ${accentColor}40`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Check size={8} color={accentColor} strokeWidth={3} />
                  </span>
                  <span style={{ fontSize: "0.85rem", color: "#374151", fontWeight: 500, letterSpacing: "-0.01em" }}>
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Tech tags */}
      <div>
        <div
          style={{
            fontSize: "0.6875rem",
            fontWeight: 750,
            color: "#9ca3af",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            marginBottom: "0.75rem",
          }}
        >
          Technológiák
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem" }}>
          {content.techTags.map((t) => (
            <TechTag key={t.label} label={t.label} color={t.color} bg={t.bg} />
          ))}
        </div>
      </div>

      {content.relatedLinks?.length ? (
        <div>
          <div
            style={{
              fontSize: "0.6875rem",
              fontWeight: 750,
              color: "#9ca3af",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              marginBottom: "0.75rem",
            }}
          >
            Részletes szolgáltatások
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            {content.relatedLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  borderRadius: "9999px",
                  border: `1px solid ${accentColor}24`,
                  background: "#fff",
                  color: "#0f1117",
                  textDecoration: "none",
                  padding: "0.5rem 0.85rem",
                  fontSize: "0.8125rem",
                  fontWeight: 650,
                  letterSpacing: "-0.01em",
                }}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      ) : null}
    </motion.div>
  );
}

// ─── Capability card ──────────────────────────────────────────────────────

interface CapabilityCardProps {
  index: number;
  number: string;
  title: string;
  description: string;
  features: string[];
  badges: { label: string; color?: string; bg?: string }[];
  mockup: React.ReactNode;
  accentColor: string;
  accentBg: string;
  inView: boolean;
  expandButtonLabel: string;
  expandedContent: ExpandedContent;
}

function CapabilityCard({
  index,
  number,
  title,
  description,
  features,
  badges,
  mockup,
  accentColor,
  accentBg,
  inView,
  expandButtonLabel,
  expandedContent,
}: CapabilityCardProps) {
  const reversed = index % 2 === 1;
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
      style={{
        background: "#fff",
        border: expanded ? `1px solid ${accentColor}22` : "1px solid rgba(0,0,0,0.065)",
        borderRadius: CARD_RADIUS,
        padding: "clamp(2rem, 4vw, 3rem)",
        boxShadow: expanded
          ? `0 8px 40px ${accentColor}10, 0 2px 10px rgba(0,0,0,0.04)`
          : "0 4px 24px rgba(0,0,0,0.05), 0 1px 6px rgba(0,0,0,0.03)",
        transition: "border-color 0.25s, box-shadow 0.25s",
        display: "flex",
        flexDirection: "column",
        gap: 0,
      }}
      className="capability-card-outer"
    >
      {/* Top two-column layout */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "3rem",
          alignItems: "center",
          direction: reversed ? "rtl" : "ltr",
        }}
        className="capability-card"
      >
        {/* Text side */}
        <div style={{ direction: "ltr", display: "flex", flexDirection: "column", gap: "1.75rem" }}>
          {/* Number + title */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.875rem" }}>
              <span
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "0.625rem",
                  background: accentBg,
                  border: `1px solid ${accentColor}28`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.75rem",
                  fontWeight: 750,
                  color: accentColor,
                  letterSpacing: "-0.02em",
                  flexShrink: 0,
                }}
              >
                {number}
              </span>
              <span
                style={{
                  fontSize: "0.6875rem",
                  fontWeight: 700,
                  color: accentColor,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                Képesség
              </span>
            </div>
            <h3
              style={{
                fontSize: "clamp(1.375rem, 2.2vw, 1.875rem)",
                fontWeight: 800,
                letterSpacing: "-0.04em",
                lineHeight: 1.15,
                color: "#0f1117",
                margin: "0 0 0.75rem",
              }}
            >
              {title}
            </h3>
            <p style={{ fontSize: "0.9375rem", color: "#6e6e80", lineHeight: 1.7, margin: 0 }}>
              {description}
            </p>
          </div>

          {/* Features */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {features.map((f) => (
              <FeatureItem key={f} label={f} />
            ))}
          </div>

          {/* Tech badges */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem" }}>
            {badges.map((b) => (
              <Badge key={b.label} label={b.label} color={b.color ?? "#0f1117"} bg={b.bg ?? "#f3f4f6"} />
            ))}
          </div>

          {/* Expand button */}
          <div>
            <button
              onClick={() => setExpanded((v) => !v)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                background: expanded ? accentBg : "transparent",
                color: expanded ? accentColor : "#0f1117",
                border: expanded ? `1.5px solid ${accentColor}30` : "1.5px solid rgba(0,0,0,0.12)",
                borderRadius: "0.75rem",
                padding: "0.6875rem 1.25rem",
                fontSize: "0.875rem",
                fontWeight: 650,
                cursor: "pointer",
                letterSpacing: "-0.02em",
                transition: "all 0.18s",
              }}
              onMouseEnter={(e) => {
                if (!expanded) {
                  e.currentTarget.style.borderColor = accentColor;
                  e.currentTarget.style.color = accentColor;
                  e.currentTarget.style.background = accentBg;
                  e.currentTarget.style.transform = "translateY(-1px)";
                }
              }}
              onMouseLeave={(e) => {
                if (!expanded) {
                  e.currentTarget.style.borderColor = "rgba(0,0,0,0.12)";
                  e.currentTarget.style.color = "#0f1117";
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.transform = "translateY(0)";
                }
              }}
            >
              {expandButtonLabel}
              <motion.span
                animate={{ rotate: expanded ? 180 : 0 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                style={{ display: "flex", alignItems: "center" }}
              >
                <ChevronDown size={14} />
              </motion.span>
            </button>
          </div>
        </div>

        {/* Mockup side */}
        <div
          style={{
            direction: "ltr",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: index === 0 ? "#0f1117" : index === 1 ? "#0c0e14" : "#f9fafb",
            borderRadius: "1.25rem",
            padding: "1.75rem",
            minHeight: "320px",
          }}
        >
          {mockup}
        </div>
      </div>

      {/* Expandable detail */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="accordion-body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
            style={{ overflow: "hidden" }}
          >
            <ExpandedDetail
              content={expandedContent}
              accentColor={accentColor}
              accentBg={accentBg}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────

export function CapabilitiesSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const cards = [
    {
      number: "01",
      title: "Modern Webes Rendszerek",
      description: "Modern felhasználói élményre és üzleti célokra épített webes rendszerek.",
      features: ["Landing oldalak", "SaaS platformok", "Admin dashboardok", "API integrációk", "Mobil optimalizált UX"],
      badges: [
        { label: "Laravel", color: "#ef4444", bg: "#fef2f2" },
        { label: "Vue.js", color: "#22c55e", bg: "#f0fdf4" },
        { label: "React", color: "#3b82f6", bg: "#eff6ff" },
        { label: "TypeScript", color: "#0f1117", bg: "#f3f4f6" },
      ],
      mockup: <DashboardMockup />,
      accentColor: "#22c55e",
      accentBg: "#f0fdf4",
      expandButtonLabel: "Hogyan épül fel?",
      expandedContent: {
        heading: "Modern Webes Rendszerek",
        intro: [
          "Nem egyszerű weboldalakat készítek, hanem olyan rendszereket, amelyek üzleti célokat támogatnak és hosszú távon is stabilan működnek.",
          "Legyen szó landing oldalról, ügyfélportálról, előfizetéses platformról vagy egyedi admin rendszerről, a cél mindig ugyanaz:",
        ],
        quote: `„Gyors, átlátható és skálázható megoldás létrehozása.”`,
        sections: [
          {
            title: "Tipikus projektek",
            items: ["Landing oldalak", "SaaS platformok", "Admin felületek", "Ügyfélportálok", "Foglalási rendszerek", "Előfizetéses rendszerek", "API alapú alkalmazások"],
          },
          {
            title: "Minden projekt alapelve",
            items: ["Mobiloptimalizált felület", "Gyors betöltés", "SEO alapok", "Könnyű bővíthetőség", "Modern technológiai stack"],
          },
        ],
        techTags: [
          { label: "Laravel", color: "#ef4444", bg: "#fef2f2" },
          { label: "Vue", color: "#22c55e", bg: "#f0fdf4" },
          { label: "React", color: "#3b82f6", bg: "#eff6ff" },
          { label: "TypeScript", color: "#0f1117", bg: "#f3f4f6" },
          { label: "REST API", color: "#0f1117", bg: "#f3f4f6" },
          { label: "MySQL", color: "#0f1117", bg: "#f3f4f6" },
          { label: "PostgreSQL", color: "#3b82f6", bg: "#eff6ff" },
        ],
        relatedLinks: [
          { label: "Weboldal készítés", href: "/szolgaltatasok/weboldal-keszites" },
          { label: "Webshop készítés", href: "/szolgaltatasok/webshop-keszites" },
          { label: "Egyedi szoftverfejlesztés", href: "/szolgaltatasok/egyedi-szoftverfejlesztes" },
        ],
      },
    },
    {
      number: "02",
      title: "Infrastruktúra & Deployment",
      description: "Stabil és skálázható háttérrendszerek modern deployment folyamatokkal.",
      features: ["Docker containerization", "Linux szerverek", "Monitoring & alerting", "Backup rendszerek", "Cloud deployment"],
      badges: [
        { label: "Docker", color: "#2496ED", bg: "#eff8ff" },
        { label: "Linux", color: "#0f1117", bg: "#f3f4f6" },
        { label: "NGINX", color: "#22c55e", bg: "#f0fdf4" },
        { label: "AWS", color: "#FF9900", bg: "#fffbeb" },
      ],
      mockup: <InfraMockup />,
      accentColor: "#3b82f6",
      accentBg: "#eff6ff",
      expandButtonLabel: "Technikai háttér",
      expandedContent: {
        heading: "Infrastruktúra & Deployment",
        intro: [
          "A legtöbb probléma nem a kóddal kezdődik, hanem azzal, hogy nincs megfelelő háttérrendszer mögötte.",
          "Ezért nem csak a fejlesztéssel foglalkozom, hanem azzal is, hogy az elkészült rendszer stabilan, biztonságosan és kiszámíthatóan működjön.",
        ],
        quote: `„Kevesebb leállás, egyszerűbb üzemeltetés, nagyobb biztonság."`,
        sections: [
          {
            title: "Tipikus feladatok",
            items: ["Docker alapú környezetek", "Linux szerverek", "Reverse proxy konfigurációk", "CI/CD folyamatok", "Monitoring rendszerek", "Backup megoldások", "Cloud infrastruktúrák"],
          },
          {
            title: "Mit jelent ez az ügyfél számára?",
            items: ["Kevesebb leállás", "Egyszerűbb üzemeltetés", "Gyorsabb hibakeresés", "Nagyobb biztonság", "Skálázható működés"],
          },
        ],
        techTags: [
          { label: "Docker", color: "#2496ED", bg: "#eff8ff" },
          { label: "Linux", color: "#0f1117", bg: "#f3f4f6" },
          { label: "NGINX", color: "#22c55e", bg: "#f0fdf4" },
          { label: "Traefik", color: "#3b82f6", bg: "#eff6ff" },
          { label: "GitHub Actions", color: "#0f1117", bg: "#f3f4f6" },
          { label: "AWS", color: "#FF9900", bg: "#fffbeb" },
          { label: "DigitalOcean", color: "#3b82f6", bg: "#eff6ff" },
        ],
        relatedLinks: [
          { label: "Infrastruktúra és deployment", href: "/szolgaltatasok/infrastruktura-deployment" },
          { label: "n8n automatizáció", href: "/szolgaltatasok/automatizacio-rendszerintegracio" },
        ],
      },
    },
    {
      number: "03",
      title: "Security-first Development",
      description: "A biztonság nem utólag kerül bele a rendszerbe, hanem már a tervezés során alapkövetelmény.",
      features: ["Auth security", "API protection", "Security audit", "Server hardening", "Secure architecture"],
      badges: [
        { label: "JWT", color: "#8b5cf6", bg: "#faf5ff" },
        { label: "Security Audit", color: "#0f1117", bg: "#f3f4f6" },
        { label: "API Protection", color: "#22c55e", bg: "#f0fdf4" },
      ],
      mockup: <SecurityMockup />,
      accentColor: "#8b5cf6",
      accentBg: "#faf5ff",
      expandButtonLabel: "Biztonsági szemlélet",
      expandedContent: {
        heading: "Security-first Development",
        intro: [
          "A biztonságot nem utólag próbálom hozzáadni a projekthez.",
          "Már a tervezési szakaszban úgy építem fel a rendszert, hogy minimalizáljuk a leggyakoribb kockázatokat.",
          `A cél nem az, hogy egy projekt „biztonságosnak tűnjön”, hanem hogy valóban ellenállóbb legyen a valós támadásokkal szemben.`,
        ],
        quote: `„A biztonság alapkövetelmény, nem opcionális funkció."`,
        sections: [
          {
            title: "Mire figyelek?",
            items: ["Jogosultságkezelés", "API védelem", "Rate limiting", "Input validáció", "Biztonságos authentikáció", "Szerver hardening", "Naplózás és monitorozás"],
          },
          {
            title: "Mit nyer ezzel az ügyfél?",
            items: ["Kisebb biztonsági kockázat", "Stabilabb rendszer", "Védettebb adatok", "Könnyebb auditálhatóság", "Biztonságosabb működés"],
          },
        ],
        techTags: [
          { label: "JWT", color: "#8b5cf6", bg: "#faf5ff" },
          { label: "OAuth", color: "#0f1117", bg: "#f3f4f6" },
          { label: "MFA", color: "#0f1117", bg: "#f3f4f6" },
          { label: "API Protection", color: "#22c55e", bg: "#f0fdf4" },
          { label: "Security Audit", color: "#0f1117", bg: "#f3f4f6" },
          { label: "Monitoring", color: "#3b82f6", bg: "#eff6ff" },
        ],
        relatedLinks: [
          { label: "Egyedi szoftverfejlesztés", href: "/szolgaltatasok/egyedi-szoftverfejlesztes" },
          { label: "Infrastruktúra és deployment", href: "/szolgaltatasok/infrastruktura-deployment" },
        ],
      },
    },
  ];

  return (
    <section
      ref={ref}
      style={{ background: "#f9f9fb", padding: "7rem 1.5rem" }}
    >
      <div style={{ maxWidth: "72rem", margin: "0 auto" }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
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
            Technikai háttér a modern vállalkozások{" "}
            <span style={{ color: "#22c55e" }}>növekedéséhez</span>.
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
            Frontendtől az infrastruktúráig olyan rendszereket építek, amelyek gyorsak, biztonságosak és hosszú távon is stabilan működnek. A részletes szolgáltatásoldalakon külön bontva is megtalálod a weboldal készítés, webshop készítés, n8n automatizáció és egyedi szoftverfejlesztés fókuszait.
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem", flexWrap: "wrap", marginTop: "1.25rem" }}>
            {[
              { label: "Weboldal készítés", href: "/szolgaltatasok/weboldal-keszites" },
              { label: "Webshop készítés", href: "/szolgaltatasok/webshop-keszites" },
              { label: "n8n automatizáció", href: "/szolgaltatasok/automatizacio-rendszerintegracio" },
              { label: "Mobilalkalmazás-fejlesztés", href: "/szolgaltatasok/mobilalkalmazas-fejlesztes" },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  borderRadius: "9999px",
                  background: "#ffffff",
                  border: "1px solid rgba(0,0,0,0.08)",
                  color: "#0f1117",
                  padding: "0.45rem 0.85rem",
                  textDecoration: "none",
                  fontSize: "0.8125rem",
                  fontWeight: 650,
                }}
              >
                {link.label}
              </a>
            ))}
          </div>
        </motion.div>

        {/* Cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", marginBottom: "4rem" }}>
          {cards.map((card, i) => (
            <CapabilityCard
              key={card.number}
              index={i}
              inView={inView}
              {...card}
            />
          ))}
        </div>

        {/* Bottom statement */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
          style={{
            background: "#fff",
            border: "1px solid rgba(0,0,0,0.065)",
            borderRadius: "1.25rem",
            padding: "2rem 2.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "2rem",
            flexWrap: "wrap",
            boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
          }}
        >
          <p
            style={{
              fontSize: "1.0625rem",
              fontWeight: 650,
              color: "#0f1117",
              letterSpacing: "-0.025em",
              lineHeight: 1.5,
              margin: 0,
              maxWidth: "520px",
            }}
          >
            Nem különálló szolgáltatásokat adok.{" "}
            <span style={{ color: "#22c55e" }}>Egy stabil technikai rendszert</span>{" "}
            építek a vállalkozásod mögé.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            {["Üzleti fókusz", "Modern technológia", "Hosszú távra tervezve", "Skálázható megoldások"].map((label) => (
              <span
                key={label}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.375rem",
                  background: "#f0fdf4",
                  border: "1px solid #bbf7d0",
                  color: "#16a34a",
                  fontSize: "0.8125rem",
                  fontWeight: 600,
                  padding: "0.375rem 0.875rem",
                  borderRadius: "9999px",
                  letterSpacing: "-0.01em",
                }}
              >
                <Check size={12} strokeWidth={3} />
                {label}
              </span>
            ))}
          </div>
        </motion.div>
      </div>

      <style>{`
        @keyframes blinkCursor {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }

        @media (max-width: 900px) {
          .capability-card {
            grid-template-columns: 1fr !important;
            direction: ltr !important;
          }
          .expanded-sections-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
