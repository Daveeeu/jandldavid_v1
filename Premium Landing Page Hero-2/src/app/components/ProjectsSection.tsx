import { useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { useNavigate } from "react-router";
import { track } from "@/analytics";
import {
  Check,
  ArrowRight,
  TrendingUp,
  Users,
  Activity,
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  Lock,
  Eye,
  Wifi,
  Cloud,
  BarChart3,
  Target,
  Zap,
  Layers,
  TrendingDown,
} from "lucide-react";

// ─── Shared ───────────────────────────────────────────────────────────────────

function TechBadge({ label, color = "#0f1117", bg = "#f3f4f6" }: { label: string; color?: string; bg?: string }) {
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
        padding: "0.3rem 0.75rem",
        borderRadius: "9999px",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </span>
  );
}

function MetricPill({ icon, label, emphasis }: { icon: string; label: string; emphasis?: boolean }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        background: emphasis ? "#f0fdf4" : "#fafafa",
        border: `1px solid ${emphasis ? "rgba(34,197,94,0.2)" : "rgba(0,0,0,0.07)"}`,
        borderRadius: "0.75rem",
        padding: "0.625rem 0.875rem",
      }}
    >
      <span style={{ fontSize: "0.875rem" }}>{icon}</span>
      <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: "#374151", letterSpacing: "-0.01em" }}>{label}</span>
    </div>
  );
}

function FeatureRow({ label }: { label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
      <span
        style={{
          width: "17px", height: "17px", borderRadius: "50%",
          background: "#f0fdf4", border: "1.5px solid #bbf7d0",
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}
      >
        <Check size={9} color="#22c55e" strokeWidth={3} />
      </span>
      <span style={{ fontSize: "0.875rem", color: "#4b5563", fontWeight: 500, letterSpacing: "-0.01em" }}>
        {label}
      </span>
    </div>
  );
}

// ─── Mockup 00: PerformanceVD ─────────────────────────────────────────────────

function PerformanceVDMockup() {
  const BARS = [{ l: "Speed", p: 82, c: "#3b82f6" }, { l: "Strength", p: 71, c: "#8b5cf6" }, { l: "Endurance", p: 90, c: "#22c55e" }];
  const W = [44, 68, 55, 80, 72, 91, 85];
  const max = Math.max(...W);
  const pts = W.map((v, i) => `${(i / (W.length - 1)) * 220},${40 - (v / max) * 36}`).join(" ");
  const area = `0,40 ${pts} 220,40`;

  return (
    <div style={{ background: "linear-gradient(160deg, #0d1117 0%, #0a0c14 100%)", borderRadius: "1.25rem", overflow: "hidden", boxShadow: "0 24px 64px rgba(0,0,0,0.35), 0 4px 20px rgba(59,130,246,0.15)", border: "1px solid rgba(59,130,246,0.1)", fontFamily: "'Inter',sans-serif", width: "100%" }}>
      <div style={{ background: "rgba(255,255,255,0.03)", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "0.625rem 1rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
        {["#ef4444", "#f59e0b", "#22c55e"].map((c) => <span key={c} style={{ width: 8, height: 8, borderRadius: "50%", background: c, opacity: 0.6, display: "inline-block" }} />)}
        <span style={{ flex: 1, textAlign: "center", fontSize: "0.6rem", color: "rgba(255,255,255,0.25)", letterSpacing: "0.08em" }}>PerformanceVD — Athlete Dashboard</span>
      </div>
      <div style={{ padding: "1.125rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.5rem" }}>
          {[{ l: "Athletes", v: "1,248", c: "#3b82f6" }, { l: "Subscriptions", v: "986", c: "#8b5cf6" }, { l: "Revenue", v: "€18.4K", c: "#22c55e" }].map((k) => (
            <div key={k.l} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "0.75rem", padding: "0.75rem" }}>
              <div style={{ fontSize: "0.55rem", color: "rgba(255,255,255,0.3)", letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: "0.2rem" }}>{k.l}</div>
              <div style={{ fontSize: "1rem", fontWeight: 750, color: "#fff", letterSpacing: "-0.04em" }}>{k.v}</div>
              <div style={{ fontSize: "0.6rem", color: k.c, fontWeight: 600, marginTop: "0.1rem" }}>↑ Active</div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
          {BARS.map((b) => (
            <div key={b.l}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.15rem" }}>
                <span style={{ fontSize: "0.55rem", color: "rgba(255,255,255,0.4)" }}>{b.l}</span>
                <span style={{ fontSize: "0.55rem", color: b.c, fontWeight: 600 }}>{b.p}%</span>
              </div>
              <div style={{ height: "3px", background: "rgba(255,255,255,0.07)", borderRadius: "9999px", overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${b.p}%`, background: b.c, borderRadius: "9999px" }} />
              </div>
            </div>
          ))}
        </div>
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "0.625rem", padding: "0.625rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.25rem" }}>
            <span style={{ fontSize: "0.55rem", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Weekly Score</span>
            <span style={{ fontSize: "0.7rem", fontWeight: 750, color: "#3b82f6" }}>91 pts</span>
          </div>
          <svg width="100%" viewBox="0 0 220 44" preserveAspectRatio="none" style={{ display: "block" }}>
            <defs><linearGradient id="pvdG" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25" /><stop offset="100%" stopColor="#3b82f6" stopOpacity="0" /></linearGradient></defs>
            <polygon points={area} fill="url(#pvdG)" />
            <polyline points={pts} fill="none" stroke="#3b82f6" strokeWidth="1.5" strokeLinejoin="round" />
            <circle cx="220" cy={40 - (W[W.length - 1] / max) * 36} r="2.5" fill="#3b82f6" />
          </svg>
        </div>
      </div>
    </div>
  );
}

// ─── Mockup 01: Analytics Dashboard ──────────────────────────────────────────

const SPARKLINE = [32, 48, 38, 62, 54, 78, 68, 88, 72, 95, 84, 100];

function AnalyticsMockup() {
  const max = Math.max(...SPARKLINE);
  const points = SPARKLINE.map((v, i) => {
    const x = (i / (SPARKLINE.length - 1)) * 280;
    const y = 60 - (v / max) * 56;
    return `${x},${y}`;
  }).join(" ");
  const area = `0,60 ${points} 280,60`;

  return (
    <div
      style={{
        background: "#0f1117",
        borderRadius: "1.25rem",
        overflow: "hidden",
        boxShadow: "0 24px 64px rgba(0,0,0,0.3), 0 4px 16px rgba(0,0,0,0.2)",
        width: "100%",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Window bar */}
      <div style={{ background: "#1a1d27", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "0.625rem 1rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
        <span style={{ width: 9, height: 9, borderRadius: "50%", background: "#ef4444", opacity: 0.65 }} />
        <span style={{ width: 9, height: 9, borderRadius: "50%", background: "#f59e0b", opacity: 0.65 }} />
        <span style={{ width: 9, height: 9, borderRadius: "50%", background: "#22c55e", opacity: 0.65 }} />
        <span style={{ flex: 1, textAlign: "center", fontSize: "0.6875rem", color: "rgba(255,255,255,0.28)", letterSpacing: "0.02em" }}>analytics.saas.app</span>
      </div>

      <div style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {/* KPI row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.5rem" }}>
          {[
            { label: "MRR", value: "€94.2K", delta: "+18.4%", up: true, c: "#22c55e" },
            { label: "DAU", value: "12,480", delta: "+9.2%", up: true, c: "#3b82f6" },
            { label: "Churn", value: "0.8%", delta: "-0.3%", up: false, c: "#22c55e" },
          ].map((k) => (
            <div key={k.label} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "0.75rem", padding: "0.75rem" }}>
              <div style={{ fontSize: "0.575rem", color: "rgba(255,255,255,0.35)", letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: "0.25rem" }}>{k.label}</div>
              <div style={{ fontSize: "1.0625rem", fontWeight: 750, color: "#fff", letterSpacing: "-0.04em", marginBottom: "0.2rem" }}>{k.value}</div>
              <div style={{ fontSize: "0.6875rem", color: k.c, fontWeight: 600, display: "flex", alignItems: "center", gap: "0.2rem" }}>
                {k.up ? <TrendingUp size={10} /> : <TrendingDown size={10} />}{k.delta}
              </div>
            </div>
          ))}
        </div>

        {/* Chart */}
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "0.875rem", padding: "1rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
            <div>
              <div style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.32)", letterSpacing: "0.06em", textTransform: "uppercase" }}>Revenue trend</div>
              <div style={{ fontSize: "1.125rem", fontWeight: 750, color: "#fff", letterSpacing: "-0.04em" }}>€94,240</div>
            </div>
            <span style={{ fontSize: "0.7rem", background: "rgba(34,197,94,0.14)", color: "#22c55e", padding: "0.25rem 0.625rem", borderRadius: "9999px", fontWeight: 650 }}>
              +18.4% ↑
            </span>
          </div>
          <svg width="100%" viewBox="0 0 280 64" preserveAspectRatio="none" style={{ display: "block" }}>
            <defs>
              <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22c55e" stopOpacity="0.28" />
                <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
              </linearGradient>
            </defs>
            <polygon points={area} fill="url(#areaGrad)" />
            <polyline points={points} fill="none" stroke="#22c55e" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
            {/* last point dot */}
            <circle cx="280" cy={60 - (SPARKLINE[SPARKLINE.length - 1] / max) * 56} r="3.5" fill="#22c55e" />
          </svg>
        </div>

        {/* Bottom 2-col */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
          {[
            { label: "Active users", value: "247 online", icon: <Users size={11} />, color: "#22c55e" },
            { label: "API calls / min", value: "1,842", icon: <Activity size={11} />, color: "#3b82f6" },
          ].map((r) => (
            <div key={r.label} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "0.75rem", padding: "0.75rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ color: r.color }}>{r.icon}</span>
              <div>
                <div style={{ fontSize: "0.575rem", color: "rgba(255,255,255,0.32)", letterSpacing: "0.05em", textTransform: "uppercase" }}>{r.label}</div>
                <div style={{ fontSize: "0.875rem", fontWeight: 700, color: "#fff", letterSpacing: "-0.025em" }}>{r.value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Mockup 02b: MotoCosmos ───────────────────────────────────────────────────

const MC_ACCENT = "#f97316";
const MC_GO = "#00add8";

function MotoCosmosMockup() {
  const POSTS = [
    { initials: "RP", color: MC_ACCENT, text: "Balatoni túra — csatlakozzatok! 🏍️", likes: 47 },
    { initials: "MH", color: MC_GO,    text: "Új útvonal a Bükkben, 280 km", likes: 81 },
  ];
  const WAYPOINTS = [
    { x: 18, y: 55 },
    { x: 42, y: 38 },
    { x: 70, y: 42 },
    { x: 92, y: 60 },
  ];
  const path = WAYPOINTS.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x * 2.4} ${p.y * 1.25}`).join(" ");

  return (
    <div style={{ display: "flex", gap: "1rem", width: "100%", fontFamily: "'Inter', sans-serif", alignItems: "flex-start" }}>

      {/* Phone: Community feed */}
      <div style={{ width: 148, background: "linear-gradient(160deg, #111318 0%, #0b0d12 100%)", borderRadius: "1.75rem", border: `2px solid ${MC_ACCENT}28`, boxShadow: `0 28px 64px rgba(0,0,0,0.6), 0 4px 24px ${MC_ACCENT}18`, overflow: "hidden", flexShrink: 0 }}>
        <div style={{ display: "flex", justifyContent: "center", padding: "0.375rem 0 0.2rem" }}>
          <div style={{ width: 36, height: 4, background: "rgba(255,255,255,0.07)", borderRadius: "9999px" }} />
        </div>
        <div style={{ padding: "0 0.5rem 0.5rem" }}>
          {/* Bar */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.25rem 0 0.4rem" }}>
            <span style={{ fontSize: "0.55rem", fontWeight: 800, color: "#fff", letterSpacing: "-0.03em" }}>MotoCosmos</span>
            <div style={{ width: 16, height: 16, borderRadius: "50%", background: `${MC_ACCENT}28`, border: `1px solid ${MC_ACCENT}50`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: "0.38rem", fontWeight: 800, color: MC_ACCENT }}>JD</span>
            </div>
          </div>
          {/* Stories */}
          <div style={{ display: "flex", gap: "0.3rem", marginBottom: "0.4rem" }}>
            {[MC_ACCENT, MC_GO, "#8b5cf6", "#22c55e"].map((c, i) => (
              <div key={i} style={{ width: 22, height: 22, borderRadius: "50%", background: `${c}22`, border: `1.5px solid ${c}60`, flexShrink: 0 }} />
            ))}
          </div>
          {/* Feed */}
          {POSTS.map((p) => (
            <div key={p.initials} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "0.625rem", padding: "0.4rem 0.45rem", marginBottom: "0.3rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.25rem", marginBottom: "0.25rem" }}>
                <div style={{ width: 13, height: 13, borderRadius: "50%", background: `${p.color}28`, border: `1px solid ${p.color}50`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ fontSize: "0.3rem", fontWeight: 700, color: p.color }}>{p.initials}</span>
                </div>
                <span style={{ fontSize: "0.38rem", fontWeight: 700, color: "#fff" }}>{p.initials}</span>
              </div>
              <div style={{ height: 28, background: `${p.color}16`, borderRadius: "0.4rem", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "0.2rem" }}>
                <span style={{ fontSize: "0.75rem" }}>🏍️</span>
              </div>
              <p style={{ fontSize: "0.35rem", color: "rgba(255,255,255,0.45)", margin: 0, lineHeight: 1.4 }}>{p.text}</p>
              <span style={{ fontSize: "0.33rem", color: "rgba(255,255,255,0.28)" }}>❤️ {p.likes}</span>
            </div>
          ))}
        </div>
        {/* Home bar */}
        <div style={{ display: "flex", justifyContent: "center", padding: "0.3rem 0 0.375rem" }}>
          <div style={{ width: 36, height: 3, background: "rgba(255,255,255,0.1)", borderRadius: "9999px" }} />
        </div>
      </div>

      {/* Right column: Map + Stats */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.75rem" }}>

        {/* Map card */}
        <div style={{ background: "#0a1a2e", borderRadius: "1rem", overflow: "hidden", border: `1px solid ${MC_ACCENT}25`, boxShadow: `0 8px 24px rgba(0,0,0,0.4)` }}>
          <div style={{ padding: "0.5rem 0.75rem 0.3rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: "0.6rem", fontWeight: 700, color: "#fff" }}>GPS Túratérkép</span>
            <span style={{ fontSize: "0.5rem", color: MC_ACCENT, fontWeight: 600 }}>324 km</span>
          </div>
          <div style={{ height: 60, background: "linear-gradient(140deg, #0a1a2e 0%, #0d2040 100%)", position: "relative", padding: "0 0.5rem" }}>
            <svg style={{ width: "100%", height: "100%" }} viewBox="0 0 230 70" preserveAspectRatio="xMidYMid meet">
              <path d={path} fill="none" stroke={`${MC_ACCENT}50`} strokeWidth="3" strokeLinecap="round" />
              <path d={path} fill="none" stroke={MC_ACCENT} strokeWidth="1.5" strokeDasharray="4 3" style={{ animation: "dashFlow 1.2s linear infinite" }} />
              {WAYPOINTS.map((p, i) => (
                <circle key={i} cx={p.x * 2.4} cy={p.y * 1.25} r={i === 0 ? 3.5 : 2} fill={i === 0 ? MC_ACCENT : `${MC_ACCENT}80`} />
              ))}
            </svg>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
          {[
            { v: "~8ms", l: "API válasz", color: MC_GO },
            { v: "<2ms", l: "Redis cache", color: MC_ACCENT },
            { v: "iOS+And", l: "Platform", color: "#06b6d4" },
            { v: "gRPC", l: "Jövőbiztos", color: "#8b5cf6" },
          ].map((s) => (
            <div key={s.l} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "0.625rem", padding: "0.5rem 0.625rem" }}>
              <div style={{ fontSize: "0.75rem", fontWeight: 800, color: s.color, letterSpacing: "-0.04em" }}>{s.v}</div>
              <div style={{ fontSize: "0.55rem", color: "rgba(255,255,255,0.35)", fontWeight: 500 }}>{s.l}</div>
            </div>
          ))}
        </div>

        {/* Tech strip */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem" }}>
          {["Flutter", "Go", "Redis", "JWT", "Docker"].map((t) => (
            <span key={t} style={{ fontSize: "0.55rem", fontWeight: 600, color: MC_ACCENT, background: `${MC_ACCENT}14`, border: `1px solid ${MC_ACCENT}28`, borderRadius: "9999px", padding: "0.15rem 0.5rem" }}>{t}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Mockup 03: Security Dashboard ────────────────────────────────────────────

const AUDIT_ROWS = [
  { label: "SQL Injection", pass: true },
  { label: "XSS Protection", pass: true },
  { label: "CSRF Tokens", pass: true },
  { label: "Rate Limiting", pass: true },
  { label: "Auth Tokens", pass: true },
  { label: "HTTPS Enforced", pass: true },
];

function SecurityMockup() {
  const score = 98;
  const r = 30;
  const circ = 2 * Math.PI * r;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", width: "100%", fontFamily: "'Inter', sans-serif" }}>
      {/* Score + login */}
      <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "0.75rem" }}>
        {/* Score ring */}
        <div style={{ background: "#fff", border: "1px solid rgba(0,0,0,0.07)", borderRadius: "1.125rem", padding: "1.25rem 1.125rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem", boxShadow: "0 4px 16px rgba(0,0,0,0.05)" }}>
          <div style={{ position: "relative", width: "80px", height: "80px" }}>
            <svg width="80" height="80" viewBox="0 0 80 80">
              <circle cx="40" cy="40" r={r} fill="none" stroke="#f0fdf4" strokeWidth="8" />
              <circle
                cx="40" cy="40" r={r}
                fill="none" stroke="#22c55e" strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${circ * (score / 100)} ${circ}`}
                transform="rotate(-90 40 40)"
              />
            </svg>
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: "1.25rem", fontWeight: 800, color: "#0f1117", letterSpacing: "-0.05em", lineHeight: 1 }}>{score}</span>
              <span style={{ fontSize: "0.55rem", color: "#9ca3af", fontWeight: 700, letterSpacing: "0.04em" }}>SCORE</span>
            </div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#0f1117", letterSpacing: "-0.02em" }}>Security</div>
            <div style={{ fontSize: "0.6875rem", color: "#22c55e", fontWeight: 650 }}>Kiváló</div>
          </div>
        </div>

        {/* Auth panel */}
        <div style={{ background: "#fff", border: "1px solid rgba(0,0,0,0.07)", borderRadius: "1.125rem", padding: "1rem 1.125rem", boxShadow: "0 4px 16px rgba(0,0,0,0.05)" }}>
          <div style={{ fontSize: "0.6875rem", fontWeight: 700, color: "#9ca3af", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "0.625rem", display: "flex", alignItems: "center", gap: "0.35rem" }}>
            <Lock size={11} /> Auth Layer
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
            {[
              { label: "JWT Token", ok: true },
              { label: "2FA Active", ok: true },
              { label: "Session expiry", ok: true },
            ].map((r) => (
              <div key={r.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.4rem 0.625rem", background: "#f9fafe", borderRadius: "0.5rem" }}>
                <span style={{ fontSize: "0.75rem", color: "#374151", fontWeight: 500 }}>{r.label}</span>
                <CheckCircle size={13} color="#22c55e" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Audit list */}
      <div style={{ background: "#fff", border: "1px solid rgba(0,0,0,0.07)", borderRadius: "1.125rem", padding: "1rem 1.125rem", boxShadow: "0 4px 16px rgba(0,0,0,0.05)" }}>
        <div style={{ fontSize: "0.6875rem", fontWeight: 700, color: "#0f1117", letterSpacing: "-0.01em", marginBottom: "0.625rem", display: "flex", alignItems: "center", gap: "0.375rem" }}>
          <ShieldCheck size={13} color="#22c55e" /> Security Audit Results
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.35rem" }}>
          {AUDIT_ROWS.map((a) => (
            <div key={a.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.4rem 0.625rem", background: "#fafffe", border: "1px solid rgba(34,197,94,0.1)", borderRadius: "0.5rem" }}>
              <span style={{ fontSize: "0.7rem", color: "#374151", fontWeight: 500 }}>{a.label}</span>
              <CheckCircle size={12} color="#22c55e" />
            </div>
          ))}
        </div>
      </div>

      {/* Metric chips */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.5rem" }}>
        {[
          { v: "98%", l: "Score", color: "#22c55e", bg: "#f0fdf4" },
          { v: "0", l: "Vulnerabilities", color: "#0f1117", bg: "#f3f4f6" },
          { v: "✓", l: "Audit ready", color: "#3b82f6", bg: "#eff6ff" },
        ].map((s) => (
          <div key={s.l} style={{ background: s.bg, border: `1px solid ${s.color}20`, borderRadius: "0.875rem", padding: "0.75rem", textAlign: "center" }}>
            <div style={{ fontSize: "1.0625rem", fontWeight: 800, color: s.color, letterSpacing: "-0.04em" }}>{s.v}</div>
            <div style={{ fontSize: "0.6875rem", color: "#9ca3af", fontWeight: 500 }}>{s.l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Projects data ─────────────────────────────────────────────────────────────

const PROJECTS = [
  {
    category: "Sport SaaS Ökoszisztéma",
    categoryColor: "#3b82f6",
    categoryBg: "#eff6ff",
    title: "PerformanceVD",
    description: "Teljes digitális sportoló-platform: előfizetéses SaaS, e-kereskedelem, mobil app, admin rendszer és REST API — egyetlen ökoszisztémaként.",
    features: ["Stripe előfizetések", "Flutter mobil app", "E-commerce + Webshippy", "Admin panel", "REST API · 100+ endpoint"],
    badges: [
      { label: "Laravel", color: "#ef4444", bg: "#fef2f2" },
      { label: "Flutter", color: "#06b6d4", bg: "rgba(6,182,212,0.08)" },
      { label: "React", color: "#61dafb", bg: "rgba(97,218,251,0.08)" },
      { label: "Stripe", color: "#8b5cf6", bg: "#faf5ff" },
      { label: "Docker", color: "#2496ED", bg: "#eff8ff" },
    ],
    metrics: [
      { icon: "📱", label: "100+ képernyő" },
      { icon: "⚡", label: "20+ fő modul" },
      { icon: "🌐", label: "7 összehangolt rendszer" },
    ],
    mockup: <PerformanceVDMockup />,
    mockupBg: "#0d1117",
    reversed: false,
    modalId: "performancevd",
    ctaLabel: "Teljes projekt megtekintése",
  },
  {
    category: "Közösségi Motoros Platform",
    categoryColor: "#f97316",
    categoryBg: "#fff7ed",
    title: "MotoCosmos",
    description: "Cross-platform Flutter mobilalkalmazás és Go backend — teljes motoros közösségi ökoszisztéma eseménykezeléssel, túratervezéssel és GPS-alapú interaktív térképekkel.",
    features: ["Flutter iOS & Android", "Go backend + Redis", "JWT auth & Authorization", "Közösségi feed · Posztok", "GPS interaktív túratérkép"],
    badges: [
      { label: "Flutter", color: "#06b6d4", bg: "rgba(6,182,212,0.08)" },
      { label: "Go", color: "#00add8", bg: "rgba(0,173,216,0.08)" },
      { label: "Redis", color: "#ef4444", bg: "#fef2f2" },
      { label: "Docker", color: "#2496ED", bg: "#eff8ff" },
      { label: "gRPC-ready", color: "#8b5cf6", bg: "#faf5ff" },
    ],
    metrics: [
      { icon: "📱", label: "iOS & Android" },
      { icon: "⚡", label: "~8ms API válaszidő" },
      { icon: "🗺️", label: "GPS túratérkép" },
    ],
    mockup: <MotoCosmosMockup />,
    mockupBg: "#090b0f",
    reversed: true,
    modalId: "motocosmos",
    ctaLabel: "Teljes projekt megtekintése",
  },
  {
    category: "Security Platform",
    categoryColor: "#8b5cf6",
    categoryBg: "#faf5ff",
    title: "Security-first Platform",
    description: "Biztonságközpontú autentikációs és API védelmi rendszer.",
    features: ["Auth security", "API protection", "Rate limiting", "Security audit", "Server hardening"],
    badges: [
      { label: "JWT", color: "#8b5cf6", bg: "#faf5ff" },
      { label: "Security Audit", color: "#0f1117", bg: "#f3f4f6" },
      { label: "API Protection", color: "#22c55e", bg: "#f0fdf4" },
    ],
    metrics: [
      { icon: "🟢", label: "98% security score" },
      { icon: "🔒", label: "Protected endpoints" },
      { icon: "✓", label: "Audit ready" },
    ],
    mockup: <SecurityMockup />,
    mockupBg: "#f9fafb",
    reversed: false,
    modalId: "security-first-platform",
    ctaLabel: "Projekt megtekintése",
  },
];

const TRUST_STRIP = [
  { icon: <Target size={16} />, label: "Üzleti fókusz", color: "#22c55e", bg: "#f0fdf4" },
  { icon: <Zap size={16} />, label: "Valódi eredmények", color: "#f59e0b", bg: "#fffbeb" },
  { icon: <Layers size={16} />, label: "Modern technológia", color: "#3b82f6", bg: "#eff6ff" },
  { icon: <TrendingUp size={16} />, label: "Skálázható megoldások", color: "#8b5cf6", bg: "#faf5ff" },
];

// ─── Main export ───────────────────────────────────────────────────────────────

export function ProjectsSection() {
  const navigate = useNavigate();
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-60px" });

  const bottomRef = useRef<HTMLDivElement>(null);
  const bottomInView = useInView(bottomRef, { once: true, margin: "-60px" });

  return (
    <section style={{ background: "#f9f9fb", padding: "7rem 1.5rem" }}>
      <div style={{ maxWidth: "72rem", margin: "0 auto" }}>

        {/* Section header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 20 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{ textAlign: "center", marginBottom: "5rem" }}
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
            <span style={{ position: "relative", display: "inline-block" }}>
              <span style={{ color: "#22c55e" }}>Valódi problémákra</span>
              <span
                style={{
                  position: "absolute",
                  bottom: "-2px",
                  left: 0,
                  right: 0,
                  height: "3px",
                  background: "linear-gradient(90deg, #22c55e, #86efac)",
                  borderRadius: "9999px",
                  opacity: 0.4,
                  display: "block",
                }}
              />
            </span>{" "}
            épített rendszerek.
          </h2>
          <p style={{ fontSize: "1.0625rem", lineHeight: 1.75, color: "#6e6e80", margin: "0 auto", maxWidth: "560px" }}>
            Minden projekt mögött üzleti célok, technikai kihívások és hosszú távon fenntartható megoldások állnak.
          </p>
        </motion.div>

        {/* Project cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem", marginBottom: "4rem" }}>
          {PROJECTS.map((project, i) => (
            <ProjectCard
              key={project.title}
              project={project}
              index={i}
              onNavigate={(slug) => {
                track.trackProjectCardClicked(project.title, slug, i, "projects_section");
                navigate(`/projektek/${slug}`);
              }}
            />
          ))}
        </div>

        {/* Bottom block */}
        <div ref={bottomRef}>
          {/* Quote bar */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={bottomInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            style={{
              background: "linear-gradient(135deg, #0f1117 0%, #1a1d27 100%)",
              borderRadius: "1.5rem",
              padding: "clamp(1.875rem, 4vw, 2.75rem)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "2rem",
              flexWrap: "wrap",
              marginBottom: "1.25rem",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                width: "320px",
                height: "320px",
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(34,197,94,0.1) 0%, transparent 70%)",
                top: "-100px",
                right: "60px",
                pointerEvents: "none",
              }}
            />
            <p
              style={{
                fontSize: "clamp(1.125rem, 2vw, 1.4375rem)",
                fontWeight: 700,
                color: "rgba(255,255,255,0.9)",
                letterSpacing: "-0.035em",
                lineHeight: 1.45,
                margin: 0,
                maxWidth: "540px",
                position: "relative",
                zIndex: 1,
              }}
            >
              Nem template rendszereket építek. Minden projekt{" "}
              <span style={{ color: "#22c55e" }}>üzleti problémára</span> készül.
            </p>
            <button
              onClick={() => { import("../utils/navigation").then(m => m.scrollToContact()); }}
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
                zIndex: 1,
                position: "relative",
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
              <ArrowRight size={15} />
            </button>
          </motion.div>

          {/* Trust strip */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={bottomInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
            className="projects-trust-grid"
            style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.875rem" }}
          >
            {TRUST_STRIP.map((t) => (
              <div
                key={t.label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  background: "#ffffff",
                  border: "1px solid rgba(0,0,0,0.06)",
                  borderRadius: "1rem",
                  padding: "1rem 1.25rem",
                  transition: "border-color 0.15s, box-shadow 0.15s, transform 0.12s",
                  cursor: "default",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = t.color + "44";
                  e.currentTarget.style.boxShadow = `0 4px 16px ${t.color}14`;
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(0,0,0,0.06)";
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <span style={{ width: "32px", height: "32px", borderRadius: "0.625rem", background: t.bg, display: "flex", alignItems: "center", justifyContent: "center", color: t.color, flexShrink: 0 }}>
                  {t.icon}
                </span>
                <span style={{ fontSize: "0.875rem", fontWeight: 650, color: "#0f1117", letterSpacing: "-0.02em", lineHeight: 1.3 }}>
                  {t.label}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>


      <style>{`
        @media (max-width: 900px) {
          .project-card-grid { grid-template-columns: 1fr !important; direction: ltr !important; }
          .projects-trust-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 540px) {
          .projects-trust-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

// ─── Individual project card (scroll-triggered) ────────────────────────────────

function ProjectCard({ project, index, onNavigate }: { project: typeof PROJECTS[0]; index: number; onNavigate: (slug: string) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      style={{
        background: "#ffffff",
        border: "1px solid rgba(0,0,0,0.065)",
        borderRadius: "1.75rem",
        overflow: "hidden",
        boxShadow: "0 4px 24px rgba(0,0,0,0.05), 0 1px 6px rgba(0,0,0,0.03)",
        transition: "box-shadow 0.22s, transform 0.18s, border-color 0.22s",
        cursor: "default",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.boxShadow = `0 12px 48px rgba(0,0,0,0.1), 0 4px 16px rgba(0,0,0,0.06)`;
        el.style.transform = "translateY(-3px)";
        el.style.borderColor = `${project.categoryColor}28`;
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.boxShadow = "0 4px 24px rgba(0,0,0,0.05), 0 1px 6px rgba(0,0,0,0.03)";
        el.style.transform = "translateY(0)";
        el.style.borderColor = "rgba(0,0,0,0.065)";
      }}
    >
      <div
        className="project-card-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          direction: project.reversed ? "rtl" : "ltr",
          minHeight: "460px",
        }}
      >
        {/* Text pane */}
        <div
          style={{
            direction: "ltr",
            padding: "clamp(2rem, 4vw, 3rem)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            gap: "2rem",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {/* Category + number */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  color: project.categoryColor,
                  background: project.categoryBg,
                  border: `1px solid ${project.categoryColor}28`,
                  padding: "0.3rem 0.75rem",
                  borderRadius: "9999px",
                }}
              >
                {project.category}
              </span>
              <span style={{ fontSize: "0.75rem", color: "#c4c4d0", fontWeight: 600, letterSpacing: "0.05em" }}>
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>

            {/* Title */}
            <h3
              style={{
                fontSize: "clamp(1.25rem, 2vw, 1.75rem)",
                fontWeight: 800,
                letterSpacing: "-0.04em",
                lineHeight: 1.2,
                color: "#0f1117",
                margin: 0,
              }}
            >
              {project.title}
            </h3>

            {/* Description */}
            <p style={{ fontSize: "0.9375rem", color: "#6e6e80", lineHeight: 1.7, margin: 0 }}>
              {project.description}
            </p>

            {/* Features */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem" }}>
              {project.features.map((f) => <FeatureRow key={f} label={f} />)}
            </div>

            {/* Tech badges */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem" }}>
              {project.badges.map((b) => (
                <TechBadge key={b.label} label={b.label} color={b.color} bg={b.bg} />
              ))}
            </div>
          </div>

          {/* Metrics + CTA */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {project.metrics.map((m, mi) => (
                <MetricPill key={m.label} icon={m.icon} label={m.label} emphasis={mi === 0} />
              ))}
            </div>
            <div>
              <button
                onClick={() => onNavigate(project.modalId)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.45rem",
                  background: project.categoryBg,
                  color: project.categoryColor,
                  border: `1.5px solid ${project.categoryColor}30`,
                  borderRadius: "0.75rem",
                  padding: "0.6875rem 1.25rem",
                  fontSize: "0.875rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  letterSpacing: "-0.02em",
                  transition: "all 0.15s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = project.categoryColor;
                  e.currentTarget.style.transform = "translateY(-1px)";
                  e.currentTarget.style.boxShadow = `0 4px 16px ${project.categoryColor}25`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = `${project.categoryColor}30`;
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                {project.ctaLabel}
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Mockup pane */}
        <div
          style={{
            direction: "ltr",
            background: project.mockupBg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem",
            borderLeft: project.reversed ? "none" : "1px solid rgba(0,0,0,0.05)",
            borderRight: project.reversed ? "1px solid rgba(0,0,0,0.05)" : "none",
          }}
        >
          {project.mockup}
        </div>
      </div>
    </motion.div>
  );
}
