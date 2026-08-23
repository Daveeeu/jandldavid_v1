import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "motion/react";
import { useNavigate } from "react-router-dom";
import { AreaChart, Area, XAxis, ResponsiveContainer, Tooltip } from "recharts";
import {
  ArrowLeft, ArrowRight, Check, Zap, Lock, Database, Server, Globe,
  Smartphone, Map, Users, Bell, Star, Shield, Cpu, Package, GitBranch,
  Activity, Layers, Code, ChevronRight, Radio, Wifi, Cloud,
} from "lucide-react";
import { scrollToContact } from "../utils/navigation";

// ─── Design tokens ─────────────────────────────────────────────────────────────
const C = {
  accent:    "#f97316",
  accentAlt: "#fb923c",
  accentDim: "rgba(249,115,22,0.12)",
  accentBorder: "rgba(249,115,22,0.22)",
  bg:        "#08090d",
  bgCard:    "#0e1016",
  bgGlass:   "rgba(255,255,255,0.04)",
  border:    "rgba(255,255,255,0.07)",
  borderAlt: "rgba(255,255,255,0.04)",
  text:      "#fff",
  textMid:   "rgba(255,255,255,0.55)",
  textDim:   "rgba(255,255,255,0.28)",
  goAccent:  "#00add8",
  goAlt:     "rgba(0,173,216,0.12)",
  goBorder:  "rgba(0,173,216,0.22)",
};

const KEYFRAMES = `
  @keyframes dashFlow { to { stroke-dashoffset: -14; } }
  @keyframes pulse { 0%,100%{opacity:0.6} 50%{opacity:1} }
  @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
  @keyframes orbFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
  * { -webkit-font-smoothing:antialiased; }
`;

// ─── Shared helpers ─────────────────────────────────────────────────────────────

function Reveal({ children, delay = 0, className, style }: { children: React.ReactNode; delay?: number; className?: string; style?: React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div ref={ref} className={className} style={style}
      initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}

function SectionLabel({ children, color = C.accent }: { children: React.ReactNode; color?: string }) {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: `${color}18`, border: `1px solid ${color}30`, borderRadius: "9999px", padding: "0.35rem 1rem", fontSize: "0.68rem", fontWeight: 700, color, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "1.25rem" }}>
      {children}
    </div>
  );
}

function Check14({ color = C.accent }: { color?: string }) {
  return (
    <span style={{ width: 18, height: 18, borderRadius: "50%", background: `${color}18`, border: `1.5px solid ${color}40`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <Check size={9} color={color} strokeWidth={3} />
    </span>
  );
}

// ─── Phone shell ────────────────────────────────────────────────────────────────

function PhoneShell({ children, accent = C.accent, width = 170, style: extraStyle }: {
  children: React.ReactNode; accent?: string; width?: number; style?: React.CSSProperties;
}) {
  return (
    <div style={{
      width,
      background: "linear-gradient(160deg, #111318 0%, #0b0d12 100%)",
      borderRadius: "2.5rem",
      border: `2px solid ${accent}30`,
      boxShadow: `0 32px 80px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,255,255,0.04), 0 6px 28px ${accent}20`,
      overflow: "hidden",
      flexShrink: 0,
      fontFamily: "'Inter', sans-serif",
      ...extraStyle,
    }}>
      {/* Notch */}
      <div style={{ display: "flex", justifyContent: "center", paddingTop: "0.5rem", paddingBottom: "0.25rem" }}>
        <div style={{ width: 44, height: 5, background: "rgba(255,255,255,0.07)", borderRadius: "9999px" }} />
      </div>
      {children}
      {/* Home bar */}
      <div style={{ display: "flex", justifyContent: "center", padding: "0.5rem 0 0.625rem" }}>
        <div style={{ width: 48, height: 4, background: "rgba(255,255,255,0.12)", borderRadius: "9999px" }} />
      </div>
    </div>
  );
}

// ─── Phone Screen: Community Feed ──────────────────────────────────────────────

function FeedScreen() {
  const POSTS = [
    { user: "riderPro92", initials: "RP", color: C.accent, time: "2 perce", text: "Balaton körüli túra holnap reggel 7-kor. Csatlakozzatok! 🏍️", likes: 47, comments: 12 },
    { user: "MotoHungary", initials: "MH", color: C.goAccent, time: "15 perce", text: "Új útvonal a Bükkben — 280 km, elképesztő kanyarok.", likes: 81, comments: 24 },
  ];
  return (
    <div style={{ padding: "0 0.5rem" }}>
      {/* App bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.375rem 0 0.5rem" }}>
        <span style={{ fontSize: "0.625rem", fontWeight: 800, color: "#fff", letterSpacing: "-0.03em" }}>MotoCosmos</span>
        <div style={{ display: "flex", gap: "0.375rem" }}>
          <Bell size={11} color="rgba(255,255,255,0.55)" />
          <div style={{ width: 18, height: 18, borderRadius: "50%", background: `${C.accent}30`, border: `1.5px solid ${C.accent}50`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: "0.45rem", fontWeight: 800, color: C.accent }}>JD</span>
          </div>
        </div>
      </div>
      {/* Story strip */}
      <div style={{ display: "flex", gap: "0.4rem", marginBottom: "0.5rem", overflowX: "hidden" }}>
        {["RP", "MH", "TK", "AB", "VS"].map((init, i) => (
          <div key={init} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.2rem", flexShrink: 0 }}>
            <div style={{ width: 26, height: 26, borderRadius: "50%", background: `${[C.accent, C.goAccent, "#8b5cf6", "#22c55e", "#f59e0b"][i]}22`, border: `1.5px solid ${[C.accent, C.goAccent, "#8b5cf6", "#22c55e", "#f59e0b"][i]}60`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: "0.45rem", fontWeight: 700, color: "#fff" }}>{init}</span>
            </div>
            <span style={{ fontSize: "0.38rem", color: "rgba(255,255,255,0.35)", fontWeight: 500 }}>túra</span>
          </div>
        ))}
      </div>
      {/* Feed posts */}
      {POSTS.map((p) => (
        <div key={p.user} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "0.75rem", padding: "0.5rem", marginBottom: "0.375rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", marginBottom: "0.3rem" }}>
            <div style={{ width: 16, height: 16, borderRadius: "50%", background: `${p.color}28`, border: `1px solid ${p.color}50`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <span style={{ fontSize: "0.35rem", fontWeight: 700, color: p.color }}>{p.initials}</span>
            </div>
            <span style={{ fontSize: "0.45rem", fontWeight: 700, color: "#fff" }}>{p.user}</span>
            <span style={{ fontSize: "0.38rem", color: "rgba(255,255,255,0.3)", marginLeft: "auto" }}>{p.time}</span>
          </div>
          {/* Moto image placeholder */}
          <div style={{ height: 36, background: `linear-gradient(135deg, ${p.color}18 0%, rgba(255,255,255,0.03) 100%)`, borderRadius: "0.5rem", marginBottom: "0.3rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: "0.85rem" }}>🏍️</span>
          </div>
          <p style={{ fontSize: "0.42rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.5, margin: "0 0 0.3rem" }}>{p.text}</p>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <span style={{ fontSize: "0.4rem", color: "rgba(255,255,255,0.3)", display: "flex", alignItems: "center", gap: "0.15rem" }}>❤️ {p.likes}</span>
            <span style={{ fontSize: "0.4rem", color: "rgba(255,255,255,0.3)", display: "flex", alignItems: "center", gap: "0.15rem" }}>💬 {p.comments}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Phone Screen: Tour Map ─────────────────────────────────────────────────────

function MapScreen() {
  const WAYPOINTS = [
    { x: 30, y: 65, label: "Budapest", active: true },
    { x: 55, y: 48, label: "Esztergom" },
    { x: 80, y: 55, label: "Győr" },
    { x: 95, y: 72, label: "Sopron" },
  ];
  const path = WAYPOINTS.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x * 1.4} ${p.y * 1.2}`).join(" ");

  return (
    <div style={{ padding: "0 0.5rem" }}>
      {/* App bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.375rem 0 0.375rem" }}>
        <span style={{ fontSize: "0.55rem", fontWeight: 700, color: "rgba(255,255,255,0.5)" }}>← Vissza</span>
        <span style={{ fontSize: "0.6rem", fontWeight: 800, color: "#fff" }}>Túra tervező</span>
        <div style={{ width: 18, height: 18, borderRadius: "0.375rem", background: `${C.accent}28`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontSize: "0.45rem", color: C.accent }}>+</span>
        </div>
      </div>
      {/* Map area */}
      <div style={{ height: 90, background: "linear-gradient(140deg, #0a1a2e 0%, #0d2040 50%, #091628 100%)", borderRadius: "0.875rem", position: "relative", overflow: "hidden", marginBottom: "0.5rem" }}>
        {/* Grid lines */}
        {[0,1,2,3].map(i => (
          <div key={i} style={{ position: "absolute", top: `${i * 33}%`, left: 0, right: 0, height: "1px", background: "rgba(255,255,255,0.04)" }} />
        ))}
        {[0,1,2,3,4].map(i => (
          <div key={i} style={{ position: "absolute", left: `${i * 25}%`, top: 0, bottom: 0, width: "1px", background: "rgba(255,255,255,0.04)" }} />
        ))}
        {/* Route SVG */}
        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} viewBox="0 0 140 110" preserveAspectRatio="none">
          <defs>
            <filter id="routeGlow">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>
          <path d={path} fill="none" stroke={`${C.accent}60`} strokeWidth="3" strokeLinecap="round" filter="url(#routeGlow)" />
          <path d={path} fill="none" stroke={C.accent} strokeWidth="1.5" strokeLinecap="round" strokeDasharray="4 3"
            style={{ animation: "dashFlow 1.2s linear infinite" }} />
          {WAYPOINTS.map((p) => (
            <g key={p.label}>
              <circle cx={p.x * 1.4} cy={p.y * 1.2} r={p.active ? 4 : 2.5} fill={p.active ? C.accent : "rgba(249,115,22,0.5)"} />
              {p.active && <circle cx={p.x * 1.4} cy={p.y * 1.2} r={7} fill="none" stroke={C.accent} strokeWidth="0.8" opacity="0.4" style={{ animation: "pulse 2s ease-in-out infinite" }} />}
            </g>
          ))}
        </svg>
        {/* Distance badge */}
        <div style={{ position: "absolute", top: 6, right: 6, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)", borderRadius: "0.5rem", padding: "0.2rem 0.45rem", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <span style={{ fontSize: "0.65rem", fontWeight: 800, color: C.accent, letterSpacing: "-0.04em" }}>324</span>
          <span style={{ fontSize: "0.35rem", color: "rgba(255,255,255,0.4)", fontWeight: 500 }}>km</span>
        </div>
      </div>
      {/* Waypoints list */}
      {WAYPOINTS.map((p, i) => (
        <div key={p.label} style={{ display: "flex", alignItems: "center", gap: "0.35rem", padding: "0.25rem 0", borderBottom: i < WAYPOINTS.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: p.active ? C.accent : `${C.accent}30`, border: `1px solid ${p.active ? C.accent : `${C.accent}60`}`, flexShrink: 0 }} />
          <span style={{ fontSize: "0.45rem", fontWeight: 600, color: p.active ? "#fff" : "rgba(255,255,255,0.5)" }}>{p.label}</span>
          {i < WAYPOINTS.length - 1 && <span style={{ fontSize: "0.38rem", color: "rgba(255,255,255,0.25)", marginLeft: "auto" }}>→ 68 km</span>}
        </div>
      ))}
    </div>
  );
}

// ─── Phone Screen: Event Details ────────────────────────────────────────────────

function EventScreen() {
  const ATTENDEES = ["RP", "MH", "TK", "AB", "+38"];
  return (
    <div style={{ padding: "0 0.5rem" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.25rem", padding: "0.375rem 0 0.5rem" }}>
        <span style={{ fontSize: "0.5rem", color: "rgba(255,255,255,0.4)" }}>←</span>
        <span style={{ fontSize: "0.6rem", fontWeight: 800, color: "#fff", flex: 1, textAlign: "center" }}>Esemény</span>
        <Star size={10} color={C.accent} fill={C.accent} />
      </div>
      {/* Event banner */}
      <div style={{ height: 52, background: `linear-gradient(135deg, ${C.accent}28 0%, rgba(239,68,68,0.2) 100%)`, borderRadius: "0.75rem", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "0.4rem", position: "relative", overflow: "hidden" }}>
        <span style={{ fontSize: "1.5rem" }}>🏁</span>
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "50%", background: "linear-gradient(to top, rgba(0,0,0,0.5), transparent)" }} />
        <div style={{ position: "absolute", bottom: 4, left: 6 }}>
          <span style={{ fontSize: "0.5rem", fontWeight: 700, color: "#fff" }}>Balatoni Túra 2025</span>
        </div>
      </div>
      {/* Meta */}
      {[
        { icon: "📅", label: "2025. aug. 15." },
        { icon: "📍", label: "Balatonfüred, Kikötő" },
        { icon: "🏍️", label: "Minden kategória" },
      ].map(m => (
        <div key={m.label} style={{ display: "flex", alignItems: "center", gap: "0.3rem", padding: "0.2rem 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <span style={{ fontSize: "0.5rem" }}>{m.icon}</span>
          <span style={{ fontSize: "0.42rem", color: "rgba(255,255,255,0.55)", fontWeight: 500 }}>{m.label}</span>
        </div>
      ))}
      {/* Attendees */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", marginTop: "0.4rem" }}>
        {ATTENDEES.map((a, i) => (
          <div key={a} style={{ width: 16, height: 16, borderRadius: "50%", background: i < 4 ? `${[C.accent, C.goAccent, "#8b5cf6", "#22c55e"][i]}30` : "rgba(255,255,255,0.1)", border: `1px solid rgba(255,255,255,0.15)`, display: "flex", alignItems: "center", justifyContent: "center", marginLeft: i > 0 ? "-4px" : 0, zIndex: 10 - i }}>
            <span style={{ fontSize: "0.38rem", color: "#fff", fontWeight: 700 }}>{a}</span>
          </div>
        ))}
        <span style={{ fontSize: "0.42rem", color: "rgba(255,255,255,0.4)", marginLeft: "0.25rem" }}>résztvevő</span>
      </div>
      {/* CTA */}
      <div style={{ marginTop: "0.5rem", background: `linear-gradient(90deg, ${C.accent}, #ef4444)`, borderRadius: "0.625rem", padding: "0.35rem", textAlign: "center" }}>
        <span style={{ fontSize: "0.5rem", fontWeight: 700, color: "#fff" }}>Csatlakozás</span>
      </div>
    </div>
  );
}

// ─── Phone Screen: Profile ──────────────────────────────────────────────────────

function ProfileScreen() {
  const BIKES = ["BMW R1250 GS", "Honda Africa Twin"];
  const STATS = [
    { v: "12", l: "Túra" },
    { v: "3.4k", l: "km" },
    { v: "48", l: "Követő" },
  ];
  return (
    <div style={{ padding: "0 0.5rem" }}>
      {/* Header */}
      <div style={{ textAlign: "center", padding: "0.375rem 0 0.5rem" }}>
        <div style={{ width: 36, height: 36, borderRadius: "50%", background: `linear-gradient(135deg, ${C.accent}40, rgba(239,68,68,0.3))`, border: `2px solid ${C.accent}60`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 0.25rem" }}>
          <span style={{ fontSize: "0.65rem", fontWeight: 800, color: "#fff" }}>JD</span>
        </div>
        <div style={{ fontSize: "0.55rem", fontWeight: 800, color: "#fff" }}>Jandl Dávid</div>
        <div style={{ fontSize: "0.42rem", color: "rgba(255,255,255,0.4)" }}>Budapest, HU</div>
      </div>
      {/* Stats */}
      <div style={{ display: "flex", justifyContent: "space-around", background: "rgba(255,255,255,0.04)", borderRadius: "0.625rem", padding: "0.4rem", marginBottom: "0.4rem" }}>
        {STATS.map(s => (
          <div key={s.l} style={{ textAlign: "center" }}>
            <div style={{ fontSize: "0.65rem", fontWeight: 800, color: C.accent, letterSpacing: "-0.04em" }}>{s.v}</div>
            <div style={{ fontSize: "0.38rem", color: "rgba(255,255,255,0.35)", fontWeight: 500 }}>{s.l}</div>
          </div>
        ))}
      </div>
      {/* Motorcycles */}
      <div style={{ fontSize: "0.42rem", color: "rgba(255,255,255,0.35)", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "0.25rem" }}>Motorok</div>
      {BIKES.map(b => (
        <div key={b} style={{ display: "flex", alignItems: "center", gap: "0.3rem", background: "rgba(255,255,255,0.04)", borderRadius: "0.5rem", padding: "0.3rem 0.45rem", marginBottom: "0.2rem" }}>
          <span style={{ fontSize: "0.6rem" }}>🏍️</span>
          <span style={{ fontSize: "0.42rem", color: "rgba(255,255,255,0.7)", fontWeight: 600 }}>{b}</span>
          <ChevronRight size={7} color="rgba(255,255,255,0.25)" style={{ marginLeft: "auto" }} />
        </div>
      ))}
      {/* Bottom nav */}
      <div style={{ display: "flex", justifyContent: "space-around", marginTop: "0.5rem", paddingTop: "0.4rem", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
        {[{ icon: "🏠", active: false }, { icon: "🗺️", active: false }, { icon: "📅", active: false }, { icon: "👤", active: true }].map((item, i) => (
          <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.15rem" }}>
            <span style={{ fontSize: "0.65rem", opacity: item.active ? 1 : 0.35 }}>{item.icon}</span>
            {item.active && <div style={{ width: 12, height: 2, background: C.accent, borderRadius: "9999px" }} />}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Architecture Diagram (SVG) ─────────────────────────────────────────────────

function ArchDiagram() {
  const LAYERS = [
    { id: "mobile",   label: "Flutter Mobile", sub: "iOS & Android", color: "#06b6d4", icon: "📱" },
    { id: "api",      label: "REST API Gateway", sub: "Versioned · Rate limited", color: C.accent, icon: "🔀" },
    { id: "backend",  label: "Go Backend", sub: "Service · Repository · DTO", color: C.goAccent, icon: "⚙️" },
    { id: "auth",     label: "JWT Auth", sub: "Authorization · Middleware", color: "#8b5cf6", icon: "🔐" },
    { id: "cache",    label: "Redis Cache", sub: "Fast-path · Session store", color: "#ef4444", icon: "⚡" },
    { id: "db",       label: "Database", sub: "Optimized queries", color: "#22c55e", icon: "🗄️" },
    { id: "grpc",     label: "gRPC-ready Layer", sub: "Protocol Buffers · Future", color: "#f59e0b", icon: "🔮" },
  ];

  return (
    <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", gap: "0", padding: "0.5rem 0" }}>
      {LAYERS.map((layer, i) => (
        <div key={layer.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-20px" }}
            transition={{ duration: 0.45, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            style={{
              background: `linear-gradient(135deg, ${layer.color}14 0%, rgba(255,255,255,0.03) 100%)`,
              border: `1px solid ${layer.color}28`,
              borderRadius: "1rem",
              padding: "0.875rem 1.5rem",
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              width: "100%",
              maxWidth: "480px",
              position: "relative",
            }}
          >
            <span style={{ fontSize: "1.25rem", flexShrink: 0 }}>{layer.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "0.875rem", fontWeight: 700, color: "#fff", letterSpacing: "-0.02em" }}>{layer.label}</div>
              <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.38)", fontWeight: 500 }}>{layer.sub}</div>
            </div>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: layer.color, boxShadow: `0 0 8px ${layer.color}` }} />
          </motion.div>
          {/* Connector arrow */}
          {i < LAYERS.length - 1 && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", height: "28px" }}>
              <svg width="20" height="28" viewBox="0 0 20 28">
                <line x1="10" y1="0" x2="10" y2="20" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" strokeDasharray="3 2" style={{ animation: "dashFlow 1.5s linear infinite" }} />
                <polygon points="5,18 15,18 10,26" fill="rgba(255,255,255,0.15)" />
              </svg>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Backend layer visualization ────────────────────────────────────────────────

function BackendLayers() {
  const LAYERS_GO = [
    { label: "Handler Layer",     desc: "HTTP handlers · Route mapping",         color: C.accent },
    { label: "Middleware Pipeline", desc: "Auth · Logging · Rate limit · CORS",   color: "#f59e0b" },
    { label: "Service Layer",     desc: "Business logic · Validation · DTOs",     color: C.goAccent },
    { label: "Repository Layer",  desc: "Data access · Query abstraction",        color: "#8b5cf6" },
    { label: "Cache Layer",       desc: "Redis · Fast-path · Session store",       color: "#ef4444" },
    { label: "Database",          desc: "Optimized queries · Indexing",           color: "#22c55e" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
      {LAYERS_GO.map((layer, i) => (
        <motion.div
          key={layer.label}
          initial={{ opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-10px" }}
          transition={{ duration: 0.4, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.875rem",
            padding: "0.75rem 1rem",
            background: `${layer.color}0e`,
            border: `1px solid ${layer.color}22`,
            borderLeft: `3px solid ${layer.color}`,
            borderRadius: "0.625rem",
          }}
        >
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "0.8125rem", fontWeight: 700, color: "#fff", letterSpacing: "-0.02em" }}>{layer.label}</div>
            <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.38)", fontWeight: 500 }}>{layer.desc}</div>
          </div>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: layer.color, flexShrink: 0 }} />
        </motion.div>
      ))}
    </div>
  );
}

// ─── Performance chart data ─────────────────────────────────────────────────────

const PERF_DATA = [
  { t: "00:00", api: 14, cache: 2 },
  { t: "04:00", api: 12, cache: 2 },
  { t: "08:00", api: 28, cache: 4 },
  { t: "12:00", api: 45, cache: 5 },
  { t: "16:00", api: 52, cache: 6 },
  { t: "20:00", api: 38, cache: 4 },
  { t: "24:00", api: 18, cache: 3 },
];

// ─── NAV ───────────────────────────────────────────────────────────────────────

function MCNav() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, height: "64px", background: scrolled ? "rgba(8,9,13,0.92)" : "rgba(8,9,13,0.6)", backdropFilter: "blur(24px)", borderBottom: `1px solid ${scrolled ? C.accentBorder : "transparent"}`, padding: "0 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", transition: "all 0.2s" }}>
      <button onClick={() => navigate(-1 as never)} style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "none", border: "none", cursor: "pointer", color: C.textMid, fontSize: "0.875rem", fontWeight: 600, padding: "0.5rem 0", transition: "color 0.15s" }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#fff"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = C.textMid; }}>
        <ArrowLeft size={15} /> Projektek
      </button>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", lineHeight: 1.1 }}>
        <span style={{ fontWeight: 800, fontSize: "0.875rem", letterSpacing: "-0.03em", color: "#fff" }}>Jandl Dávid</span>
        <span style={{ fontSize: "0.6rem", fontWeight: 600, color: C.accent, letterSpacing: "0.04em" }}>Technikai partner</span>
      </div>
      <button onClick={scrollToContact} style={{ background: `linear-gradient(90deg, ${C.accent}, #ef4444)`, color: "#fff", border: "none", borderRadius: "0.625rem", padding: "0.5rem 1.125rem", fontSize: "0.8125rem", fontWeight: 700, cursor: "pointer", boxShadow: `0 4px 16px ${C.accent}40` }}>
        Lépjünk kapcsolatba
      </button>
    </nav>
  );
}

// ─── MAIN PAGE ─────────────────────────────────────────────────────────────────

export default function MotoCosmoPage() {
  const navigate = useNavigate();

  return (
    <div style={{ fontFamily: "'Inter', -apple-system, sans-serif", background: C.bg, color: C.text, overflowX: "hidden" }}>
      <style>{KEYFRAMES}</style>
      <MCNav />

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* 1. HERO                                                               */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      <section style={{ background: `linear-gradient(160deg, #0b0c12 0%, #10090d 50%, #080a10 100%)`, paddingTop: "8rem", paddingBottom: "5rem", padding: "8rem 1.5rem 5rem", position: "relative", overflow: "hidden" }}>
        {/* Glow orbs */}
        <div style={{ position: "absolute", top: "-80px", left: "5%", width: "600px", height: "600px", borderRadius: "50%", background: `radial-gradient(circle, ${C.accent}08 0%, transparent 70%)`, pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "-100px", right: "8%", width: "500px", height: "500px", borderRadius: "50%", background: `radial-gradient(circle, ${C.goAccent}07 0%, transparent 70%)`, pointerEvents: "none" }} />

        <div style={{ maxWidth: "76rem", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1.1fr", gap: "4rem", alignItems: "center" }} className="mc-hero-grid">
          {/* Left */}
          <motion.div initial={{ opacity: 0, x: -28 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
            {/* Breadcrumb */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.5rem" }}>
              <button onClick={() => navigate("/")} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "0.75rem", color: C.textDim, fontWeight: 500, padding: 0 }}>Főoldal</button>
              <span style={{ color: C.textDim, fontSize: "0.7rem" }}>/</span>
              <button onClick={() => navigate(-1 as never)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "0.75rem", color: C.textDim, fontWeight: 500, padding: 0 }}>Projektek</button>
              <span style={{ color: C.textDim, fontSize: "0.7rem" }}>/</span>
              <span style={{ fontSize: "0.75rem", color: C.accent, fontWeight: 600 }}>MotoCosmos</span>
            </div>
            <SectionLabel color={C.accent}>Közösségi Motoros Platform</SectionLabel>
            <h1 style={{ fontSize: "clamp(3rem, 6vw, 5rem)", fontWeight: 900, letterSpacing: "-0.055em", lineHeight: 1.0, color: "#fff", margin: "0 0 1.25rem" }}>
              Moto
              <br />
              <span style={{ background: `linear-gradient(90deg, ${C.accent}, #ef4444, #fb923c)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Cosmos</span>
            </h1>
            <p style={{ fontSize: "1.0625rem", color: C.textMid, lineHeight: 1.8, margin: "0 0 2rem", maxWidth: "480px" }}>
              Teljes cross-platform mobil ökoszisztéma a motoros közösség számára — Flutter alkalmazás iOS-re és Androidra, Go backend Redis cache-sel, gRPC-ready architektúrával és enterprise-szintű skálázhatósággal.
            </p>
            {/* Badges */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "2.25rem" }}>
              {["Flutter · iOS & Android", "Go Backend", "Redis Cache", "JWT Auth", "gRPC-ready", "Material 3"].map((b) => (
                <span key={b} style={{ fontSize: "0.8rem", fontWeight: 600, color: `${C.accent}dd`, background: C.accentDim, border: `1px solid ${C.accentBorder}`, borderRadius: "9999px", padding: "0.3rem 0.8rem" }}>{b}</span>
              ))}
            </div>
            {/* CTAs */}
            <div style={{ display: "flex", gap: "0.875rem", flexWrap: "wrap" }}>
              <button onClick={scrollToContact} style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: `linear-gradient(90deg, ${C.accent}, #ef4444)`, color: "#fff", border: "none", borderRadius: "0.75rem", padding: "0.875rem 1.75rem", fontSize: "0.9375rem", fontWeight: 700, cursor: "pointer", boxShadow: `0 8px 28px ${C.accent}40` }}>
                Lépjünk kapcsolatba <ArrowRight size={16} />
              </button>
              <button onClick={() => navigate("/projektek/performancevd")} style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: C.bgGlass, color: C.textMid, border: `1px solid ${C.border}`, borderRadius: "0.75rem", padding: "0.875rem 1.5rem", fontSize: "0.9375rem", fontWeight: 600, cursor: "pointer" }}>
                Más projektek
              </button>
            </div>
          </motion.div>

          {/* Right — Phone trio */}
          <motion.div
            initial={{ opacity: 0, x: 32, y: 16 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            style={{ display: "flex", justifyContent: "center", alignItems: "flex-end", gap: "1rem", position: "relative" }}
          >
            {/* Glow under phones */}
            <div style={{ position: "absolute", bottom: "-30px", left: "50%", transform: "translateX(-50%)", width: "280px", height: "80px", background: `radial-gradient(ellipse, ${C.accent}25 0%, transparent 70%)`, filter: "blur(20px)", pointerEvents: "none" }} />

            <PhoneShell accent={C.accent} width={155} style={{ transform: "rotate(-5deg) translateY(16px)", opacity: 0.75, boxShadow: `0 28px 60px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.03)` }}>
              <EventScreen />
            </PhoneShell>
            <PhoneShell accent={C.accent} width={175} style={{ transform: "scale(1.04)", zIndex: 2, boxShadow: `0 40px 100px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.05), 0 8px 40px ${C.accent}28` }}>
              <FeedScreen />
            </PhoneShell>
            <PhoneShell accent={C.accent} width={155} style={{ transform: "rotate(5deg) translateY(16px)", opacity: 0.75, boxShadow: `0 28px 60px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.03)` }}>
              <MapScreen />
            </PhoneShell>
          </motion.div>
        </div>

        {/* Bottom stats bar */}
        <div style={{ maxWidth: "76rem", margin: "4rem auto 0" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1px", background: C.border, borderRadius: "1.25rem", overflow: "hidden", border: `1px solid ${C.border}` }} className="mc-stats-grid">
            {[
              { v: "100k+", l: "Felhasználói kapacitás", color: C.accent },
              { v: "~8ms", l: "Átlagos API válaszidő", color: C.goAccent },
              { v: "iOS + Android", l: "Közös Flutter kódbázis", color: "#06b6d4" },
              { v: "gRPC-ready", l: "Jövőbiztos architektúra", color: "#8b5cf6" },
            ].map((s) => (
              <div key={s.l} style={{ background: C.bgCard, padding: "1.5rem 1.75rem" }}>
                <div style={{ fontSize: "1.5rem", fontWeight: 800, color: s.color, letterSpacing: "-0.05em", lineHeight: 1 }}>{s.v}</div>
                <div style={{ fontSize: "0.8125rem", color: C.textDim, fontWeight: 500, marginTop: "0.375rem" }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* 2. FLUTTER MOBILE APP                                                 */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      <section style={{ padding: "6rem 1.5rem", background: C.bg }}>
        <div style={{ maxWidth: "76rem", margin: "0 auto" }}>
          <Reveal>
            <SectionLabel color="#06b6d4"><Smartphone size={10} /> Flutter Mobile App</SectionLabel>
            <h2 style={{ fontSize: "clamp(2rem, 3.5vw, 3rem)", fontWeight: 800, letterSpacing: "-0.045em", lineHeight: 1.15, color: "#fff", margin: "0 0 1rem", maxWidth: "600px" }}>
              Egyetlen kódbázis —{" "}
              <span style={{ color: "#06b6d4" }}>iOS és Android</span> egyszerre.
            </h2>
            <p style={{ fontSize: "1.0625rem", color: C.textMid, lineHeight: 1.75, maxWidth: "580px", margin: "0 0 3.5rem" }}>
              A Flutter biztosítja, hogy a natív teljesítmény és a Material 3 design rendszer mind a két platformon egységesen, egyetlen forráskódból működjön. Feature-first architektúra, Repository Pattern és dependency injection garantálja a karbantarthatóságot.
            </p>
          </Reveal>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.15fr", gap: "4rem", alignItems: "start" }} className="mc-two-col">
            {/* Feature grid */}
            <Reveal delay={0.08}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.875rem" }}>
                {[
                  { icon: <Users size={16} />, title: "Közösségi feed", desc: "Posztok, képek, like-ok, kommentek", color: C.accent },
                  { icon: <Map size={16} />, title: "GPS Túratérkép", desc: "Interaktív útvonaltervezés koordinátákkal", color: "#22c55e" },
                  { icon: <Bell size={16} />, title: "Értesítések", desc: "Push notifications eseményekre", color: "#f59e0b" },
                  { icon: <Lock size={16} />, title: "JWT Auth", desc: "Biztonságos regisztráció és bejelentkezés", color: "#8b5cf6" },
                  { icon: <Smartphone size={16} />, title: "Material 3", desc: "Modern Google design rendszer", color: "#06b6d4" },
                  { icon: <Cpu size={16} />, title: "Offline Cache", desc: "Repository Pattern alapú gyorsítótár", color: "#ef4444" },
                  { icon: <GitBranch size={16} />, title: "Dep. Injection", desc: "Getx / Injectable · Tesztelhetőség", color: C.accent },
                  { icon: <Code size={16} />, title: "Unit & Widget Tests", desc: "Teljes tesztelési lefedettség", color: C.goAccent },
                ].map((f) => (
                  <div key={f.title} style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: "1rem", padding: "1.125rem 1.25rem", transition: "border-color 0.15s" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = `${f.color}40`; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = C.border; }}>
                    <div style={{ width: 32, height: 32, borderRadius: "0.625rem", background: `${f.color}18`, display: "flex", alignItems: "center", justifyContent: "center", color: f.color, marginBottom: "0.625rem" }}>
                      {f.icon}
                    </div>
                    <div style={{ fontSize: "0.8125rem", fontWeight: 700, color: "#fff", letterSpacing: "-0.02em", marginBottom: "0.25rem" }}>{f.title}</div>
                    <div style={{ fontSize: "0.75rem", color: C.textDim, lineHeight: 1.5 }}>{f.desc}</div>
                  </div>
                ))}
              </div>
            </Reveal>

            {/* Phone + architecture column */}
            <Reveal delay={0.14}>
              <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                {/* Profile phone */}
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <PhoneShell accent="#06b6d4" width={200}>
                    <ProfileScreen />
                  </PhoneShell>
                </div>
                {/* Architecture pills */}
                <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: "1.25rem", padding: "1.5rem" }}>
                  <div style={{ fontSize: "0.7rem", fontWeight: 700, color: C.textDim, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "1rem" }}>Flutter Clean Architecture</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    {[
                      { label: "Presentation Layer", sub: "UI · Controllers · State", color: "#06b6d4" },
                      { label: "Domain Layer", sub: "Use Cases · Entities · Contracts", color: C.accent },
                      { label: "Data Layer", sub: "Repository · Data Sources · Cache", color: "#22c55e" },
                    ].map((l, i) => (
                      <div key={l.label} style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.625rem 0.875rem", background: `${l.color}0c`, border: `1px solid ${l.color}22`, borderRadius: "0.625rem" }}>
                        <div style={{ width: 3, height: "100%", minHeight: 32, background: l.color, borderRadius: "9999px", flexShrink: 0 }} />
                        <div>
                          <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "#fff" }}>{l.label}</div>
                          <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.35)" }}>{l.sub}</div>
                        </div>
                        <div style={{ marginLeft: "auto", fontSize: "0.65rem", fontWeight: 600, color: l.color, background: `${l.color}18`, padding: "0.2rem 0.5rem", borderRadius: "9999px" }}>Layer {i + 1}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* 3. GO BACKEND                                                          */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      <section style={{ padding: "6rem 1.5rem", background: "#0b0c10", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-60px", right: "10%", width: "400px", height: "400px", borderRadius: "50%", background: `radial-gradient(circle, ${C.goAccent}07 0%, transparent 70%)`, pointerEvents: "none" }} />
        <div style={{ maxWidth: "76rem", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "start" }} className="mc-two-col">

            {/* Left — text + features */}
            <Reveal>
              <SectionLabel color={C.goAccent}><Server size={10} /> Go Backend</SectionLabel>
              <h2 style={{ fontSize: "clamp(1.875rem, 3vw, 2.625rem)", fontWeight: 800, letterSpacing: "-0.045em", lineHeight: 1.18, color: "#fff", margin: "0 0 1.25rem" }}>
                Teljesítmény és skálázhatóság —{" "}
                <span style={{ color: C.goAccent }}>Go és Redis</span>.
              </h2>
              <p style={{ fontSize: "1rem", color: C.textMid, lineHeight: 1.75, margin: "0 0 2rem" }}>
                A backend teljes egészében Go-ban íródott, erős hangsúllyal a teljesítményre, modularitásra és skálázhatóságra. A REST API jelenleg termelési környezetben fut, belső architektúrája azonban már előkészítve a jövőbeli gRPC migrációra.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
                {[
                  "REST API · Versioned endpoints",
                  "gRPC-ready · Protocol Buffers tervezés",
                  "JWT Authentication & Authorization",
                  "Redis Cache · Fast-path adathozzáférés",
                  "Middleware Pipeline · Rate limiting",
                  "Unified API Response struktúra",
                  "Structured Error Handling",
                  "Repository & Service Layer szétválasztás",
                  "Strukturált logging · Monitoring support",
                  "Docker · Horizontal scalability",
                ].map((f) => (
                  <div key={f} style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
                    <Check14 color={C.goAccent} />
                    <span style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.65)", fontWeight: 500 }}>{f}</span>
                  </div>
                ))}
              </div>
            </Reveal>

            {/* Right — Backend layers */}
            <Reveal delay={0.1}>
              <div style={{ fontSize: "0.7rem", fontWeight: 700, color: C.textDim, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "1rem" }}>Go Service Architecture</div>
              <BackendLayers />

              {/* gRPC future badge */}
              <div style={{ marginTop: "1.25rem", background: `linear-gradient(135deg, rgba(249,115,22,0.12), rgba(239,68,68,0.08))`, border: `1px solid ${C.accentBorder}`, borderRadius: "1rem", padding: "1.125rem 1.25rem", display: "flex", alignItems: "center", gap: "0.875rem" }}>
                <div style={{ width: 36, height: 36, borderRadius: "0.75rem", background: C.accentDim, display: "flex", alignItems: "center", justifyContent: "center", color: C.accent, flexShrink: 0 }}>
                  <Radio size={16} />
                </div>
                <div>
                  <div style={{ fontSize: "0.875rem", fontWeight: 700, color: "#fff", marginBottom: "0.2rem" }}>gRPC Migration Path</div>
                  <div style={{ fontSize: "0.78rem", color: C.textDim, lineHeight: 1.5 }}>A belső architektúra már most Protocol Buffers kompatibilis. A jövőbeli gRPC migráció minimális módosítással elvégezhető.</div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* 4. ARCHITECTURE DIAGRAM                                                */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      <section style={{ padding: "6rem 1.5rem", background: C.bg }}>
        <div style={{ maxWidth: "76rem", margin: "0 auto" }}>
          <Reveal style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <SectionLabel color={C.accent}><Layers size={10} /> Rendszerarchitektúra</SectionLabel>
            <h2 style={{ fontSize: "clamp(1.875rem, 3vw, 2.625rem)", fontWeight: 800, letterSpacing: "-0.045em", lineHeight: 1.15, color: "#fff", margin: "0 0 1rem" }}>
              Az egész ökoszisztéma egy helyen.
            </h2>
            <p style={{ fontSize: "1rem", color: C.textMid, lineHeight: 1.75, maxWidth: "520px", margin: "0 auto" }}>
              Minden réteg célja, felelőssége és kapcsolata átlátható. Az architektúra hosszú távra tervezett, és minimális módosítással bővíthető.
            </p>
          </Reveal>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "start" }} className="mc-two-col">
            <Reveal delay={0.08}>
              <ArchDiagram />
            </Reveal>

            <Reveal delay={0.16}>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {[
                  { title: "Egyetlen forráskód — két platform", desc: "A Flutter kódbázis egyszerre fordítja le az iOS és Android alkalmazást, azonos UX-szel és natív teljesítménnyel.", color: "#06b6d4", icon: <Smartphone size={16} /> },
                  { title: "Magas rendelkezésre állás", desc: "Redis Cache és optimalizált adatbázis lekérdezések biztosítják a gyors válaszidőket akár nagy terhelés alatt is.", color: C.accent, icon: <Zap size={16} /> },
                  { title: "Zero-downtime horizontális skálázás", desc: "A Go backend állapot nélküli service architekúrája lehetővé teszi a vízszintes skálázást Docker konténerekkel.", color: "#22c55e", icon: <Cloud size={16} /> },
                  { title: "Jövőbiztos gRPC design", desc: "A jelenlegi REST API mögötti belső architektúra Protocol Buffers-kompatibilis, a gRPC migráció bármikor elvégezhető.", color: "#f59e0b", icon: <Radio size={16} /> },
                ].map((item) => (
                  <div key={item.title} style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: "1rem", padding: "1.25rem" }}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: "0.875rem" }}>
                      <div style={{ width: 34, height: 34, borderRadius: "0.625rem", background: `${item.color}18`, display: "flex", alignItems: "center", justifyContent: "center", color: item.color, flexShrink: 0 }}>
                        {item.icon}
                      </div>
                      <div>
                        <div style={{ fontSize: "0.875rem", fontWeight: 700, color: "#fff", letterSpacing: "-0.02em", marginBottom: "0.25rem" }}>{item.title}</div>
                        <div style={{ fontSize: "0.78rem", color: C.textDim, lineHeight: 1.6 }}>{item.desc}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* 5. PERFORMANCE                                                         */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      <section style={{ padding: "6rem 1.5rem", background: "#0a0b10" }}>
        <div style={{ maxWidth: "76rem", margin: "0 auto" }}>
          <Reveal style={{ marginBottom: "3rem" }}>
            <SectionLabel color={C.accent}><Activity size={10} /> Teljesítmény</SectionLabel>
            <h2 style={{ fontSize: "clamp(1.875rem, 3vw, 2.625rem)", fontWeight: 800, letterSpacing: "-0.045em", lineHeight: 1.15, color: "#fff", margin: "0 0 1rem", maxWidth: "540px" }}>
              Minden döntés mögött{" "}
              <span style={{ color: C.accent }}>sebesség és skálázhatóság</span> áll.
            </h2>
          </Reveal>

          {/* Metric cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", marginBottom: "2rem" }} className="mc-perf-grid">
            {[
              { v: "~8ms", l: "API válaszidő", sub: "Redis cache nélkül", color: C.goAccent },
              { v: "<2ms", l: "Cache hit idő", sub: "Redis fast-path", color: C.accent },
              { v: "100k+", l: "Felhasználói kapacitás", sub: "Horizontal scaling", color: "#22c55e" },
              { v: "99.9%", l: "Célzott uptime", sub: "Redundáns design", color: "#8b5cf6" },
            ].map((m, i) => (
              <Reveal key={m.l} delay={i * 0.07}>
                <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: "1.125rem", padding: "1.5rem 1.25rem" }}>
                  <div style={{ fontSize: "1.875rem", fontWeight: 800, color: m.color, letterSpacing: "-0.06em", lineHeight: 1, marginBottom: "0.5rem" }}>{m.v}</div>
                  <div style={{ fontSize: "0.8125rem", fontWeight: 700, color: "#fff", marginBottom: "0.2rem" }}>{m.l}</div>
                  <div style={{ fontSize: "0.72rem", color: C.textDim }}>{m.sub}</div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Chart */}
          <Reveal delay={0.12}>
            <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: "1.25rem", padding: "1.75rem", overflow: "hidden" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
                <div>
                  <div style={{ fontSize: "0.875rem", fontWeight: 700, color: "#fff", letterSpacing: "-0.02em" }}>API Response Time · 24h</div>
                  <div style={{ fontSize: "0.75rem", color: C.textDim }}>Milliseconds — REST vs Redis cache</div>
                </div>
                <div style={{ display: "flex", gap: "1rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.goAccent }} />
                    <span style={{ fontSize: "0.72rem", color: C.textDim }}>REST API</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.accent }} />
                    <span style={{ fontSize: "0.72rem", color: C.textDim }}>Redis cache</span>
                  </div>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={180}>
                <AreaChart data={PERF_DATA} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                  <defs>
                    <linearGradient id="apiGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={C.goAccent} stopOpacity={0.25} />
                      <stop offset="95%" stopColor={C.goAccent} stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="cacheGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={C.accent} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={C.accent} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="t" tick={{ fill: "rgba(255,255,255,0.2)", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: "#111418", border: `1px solid ${C.border}`, borderRadius: "0.625rem", fontSize: "0.75rem", color: "#fff" }} />
                  <Area type="monotone" dataKey="api" stroke={C.goAccent} strokeWidth={2} fill="url(#apiGrad)" dot={false} />
                  <Area type="monotone" dataKey="cache" stroke={C.accent} strokeWidth={2} fill="url(#cacheGrad)" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* 6. TECH STACK                                                          */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      <section style={{ padding: "6rem 1.5rem", background: C.bg }}>
        <div style={{ maxWidth: "76rem", margin: "0 auto" }}>
          <Reveal style={{ textAlign: "center", marginBottom: "3rem" }}>
            <SectionLabel color={C.accent}><Package size={10} /> Technológiai stack</SectionLabel>
            <h2 style={{ fontSize: "clamp(1.875rem, 3vw, 2.625rem)", fontWeight: 800, letterSpacing: "-0.045em", color: "#fff", margin: 0 }}>
              Modern technológiák — hosszú távú gondolkodással.
            </h2>
          </Reveal>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem" }} className="mc-stack-grid">
            {[
              {
                category: "Mobile",
                color: "#06b6d4",
                items: [
                  { name: "Flutter", desc: "Cross-platform framework" },
                  { name: "Dart", desc: "Typed language" },
                  { name: "Material 3", desc: "Google design system" },
                  { name: "Riverpod / GetX", desc: "State management" },
                  { name: "Dio", desc: "HTTP client" },
                  { name: "Hive", desc: "Offline cache" },
                ],
              },
              {
                category: "Backend",
                color: C.goAccent,
                items: [
                  { name: "Go", desc: "High-performance backend" },
                  { name: "REST API", desc: "Versioned endpoints" },
                  { name: "gRPC (planned)", desc: "Protocol Buffers ready" },
                  { name: "Redis", desc: "Cache & session store" },
                  { name: "JWT", desc: "Auth & authorization" },
                  { name: "Docker", desc: "Containerization" },
                ],
              },
              {
                category: "DevOps & QA",
                color: "#22c55e",
                items: [
                  { name: "Docker Compose", desc: "Orchestration" },
                  { name: "GitHub", desc: "Version control" },
                  { name: "CI/CD Pipeline", desc: "Automated deploy" },
                  { name: "Unit Testing", desc: "Go & Flutter" },
                  { name: "Widget Testing", desc: "Flutter UI tests" },
                  { name: "API Testing", desc: "Integration tests" },
                ],
              },
            ].map((cat) => (
              <Reveal key={cat.category}>
                <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: "1.25rem", overflow: "hidden" }}>
                  <div style={{ padding: "1.25rem 1.5rem", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: "0.625rem" }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: cat.color }} />
                    <span style={{ fontSize: "0.8125rem", fontWeight: 700, color: cat.color, letterSpacing: "0.04em", textTransform: "uppercase" }}>{cat.category}</span>
                  </div>
                  <div style={{ padding: "0.75rem 0" }}>
                    {cat.items.map((item) => (
                      <div key={item.name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.625rem 1.5rem", transition: "background 0.12s" }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)"; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
                        <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "#fff" }}>{item.name}</span>
                        <span style={{ fontSize: "0.75rem", color: C.textDim }}>{item.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* 7. PROJECT VISION                                                      */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      <section style={{ padding: "6rem 1.5rem", background: "#0b0c10" }}>
        <div style={{ maxWidth: "76rem", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "center" }} className="mc-two-col">
            <Reveal>
              <SectionLabel color={C.accent}><Globe size={10} /> Projekt jövőképe</SectionLabel>
              <h2 style={{ fontSize: "clamp(1.875rem, 3vw, 2.625rem)", fontWeight: 800, letterSpacing: "-0.045em", lineHeight: 1.18, color: "#fff", margin: "0 0 1.5rem" }}>
                Egy teljes digitális ökoszisztéma —{" "}
                <span style={{ color: C.accent }}>a motoros közösségnek.</span>
              </h2>
              <p style={{ fontSize: "1rem", color: C.textMid, lineHeight: 1.8, margin: "0 0 1.25rem" }}>
                A MotoCosmos célja, hogy a motoros közösség minden digitális szükségletét egyetlen alkalmazásba integrálja: közösségi hálózat, eseménykezelés, útvonaltervezés és kommunikáció — mindezt modern, skálázható platformon.
              </p>
              <p style={{ fontSize: "1rem", color: C.textMid, lineHeight: 1.8, margin: "0 0 2rem" }}>
                A backend architektúra kezdettől fogva bővítésre tervezett — az újabb microservice-ek és a gRPC alapú kommunikáció éles rendszer indítása nélkül bevezethető a jövőben.
              </p>
              <div style={{ display: "flex", gap: "0.875rem", flexWrap: "wrap" }}>
                <button onClick={scrollToContact} style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: `linear-gradient(90deg, ${C.accent}, #ef4444)`, color: "#fff", border: "none", borderRadius: "0.75rem", padding: "0.875rem 1.75rem", fontSize: "0.9375rem", fontWeight: 700, cursor: "pointer", boxShadow: `0 8px 28px ${C.accent}40` }}>
                  Kérj szakmai konzultációt <ArrowRight size={16} />
                </button>
              </div>
            </Reveal>

            {/* Map phone */}
            <Reveal delay={0.12}>
              <div style={{ display: "flex", justifyContent: "center", gap: "1.25rem", alignItems: "center" }}>
                <PhoneShell accent={C.accent} width={210} style={{ boxShadow: `0 40px 100px rgba(0,0,0,0.7), 0 8px 40px ${C.accent}25` }}>
                  <MapScreen />
                </PhoneShell>
                {/* Side info cards */}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  {[
                    { icon: "🏍️", v: "324 km", l: "Balatoni kör" },
                    { icon: "📍", v: "4 pont", l: "Útszakasz" },
                    { icon: "⏱️", v: "4h 20m", l: "Becsült idő" },
                    { icon: "👥", v: "12 fő", l: "Csatlakoztak" },
                  ].map((s) => (
                    <div key={s.l} style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: "0.875rem", padding: "0.75rem 1rem", minWidth: "110px" }}>
                      <div style={{ fontSize: "1rem", marginBottom: "0.2rem" }}>{s.icon}</div>
                      <div style={{ fontSize: "0.9rem", fontWeight: 800, color: "#fff", letterSpacing: "-0.04em" }}>{s.v}</div>
                      <div style={{ fontSize: "0.65rem", color: C.textDim }}>{s.l}</div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* 8. CTA                                                                 */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      <section style={{ padding: "6rem 1.5rem", background: C.bg }}>
        <div style={{ maxWidth: "56rem", margin: "0 auto", textAlign: "center" }}>
          <Reveal>
            <div style={{ background: `linear-gradient(135deg, #0f1018 0%, #13090d 100%)`, border: `1px solid ${C.border}`, borderRadius: "2rem", padding: "clamp(3rem, 6vw, 4.5rem)", position: "relative", overflow: "hidden" }}>
              {/* Glow */}
              <div style={{ position: "absolute", top: "-100px", left: "50%", transform: "translateX(-50%)", width: "500px", height: "500px", borderRadius: "50%", background: `radial-gradient(circle, ${C.accent}10 0%, transparent 70%)`, pointerEvents: "none" }} />
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: `linear-gradient(90deg, transparent, ${C.accent}50, transparent)` }} />

              <div style={{ position: "relative", zIndex: 1 }}>
                <SectionLabel color={C.accent}>Hasonló projektet tervez?</SectionLabel>
                <h2 style={{ fontSize: "clamp(1.875rem, 4vw, 3rem)", fontWeight: 800, letterSpacing: "-0.045em", lineHeight: 1.15, color: "#fff", margin: "0 0 1.25rem" }}>
                  Indítsuk el a fejlesztést —{" "}
                  <span style={{ background: `linear-gradient(90deg, ${C.accent}, #ef4444)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>együtt.</span>
                </h2>
                <p style={{ fontSize: "1.0625rem", color: C.textMid, lineHeight: 1.75, margin: "0 auto 2.5rem", maxWidth: "440px" }}>
                  Ha mobilalkalmazást, Go backendet, vagy egy hasonló skálázható rendszert tervez — egyeztetünk.
                </p>
                <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
                  <button onClick={scrollToContact} style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: `linear-gradient(90deg, ${C.accent}, #ef4444)`, color: "#fff", border: "none", borderRadius: "0.875rem", padding: "1rem 2rem", fontSize: "1rem", fontWeight: 700, cursor: "pointer", boxShadow: `0 8px 32px ${C.accent}45` }}>
                    Kérj szakmai konzultációt <ArrowRight size={18} />
                  </button>
                  <button onClick={() => navigate(-1 as never)} style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: C.bgGlass, color: C.textMid, border: `1px solid ${C.border}`, borderRadius: "0.875rem", padding: "1rem 1.75rem", fontSize: "1rem", fontWeight: 600, cursor: "pointer" }}>
                    <ArrowLeft size={16} /> Más projektek
                  </button>
                </div>
                {/* Trust row */}
                <div style={{ display: "flex", gap: "2rem", justifyContent: "center", flexWrap: "wrap", marginTop: "2rem" }}>
                  {["Ingyenes első egyeztetés", "24h válaszidő", "Nincs kötelezettség"].map((t) => (
                    <div key={t} style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                      <Check size={13} color={C.accent} strokeWidth={2.5} />
                      <span style={{ fontSize: "0.8125rem", color: C.textDim, fontWeight: 500 }}>{t}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <style>{`
        @media (max-width: 960px) {
          .mc-hero-grid { grid-template-columns: 1fr !important; }
          .mc-two-col { grid-template-columns: 1fr !important; gap: 2.5rem !important; }
          .mc-stack-grid { grid-template-columns: 1fr !important; }
          .mc-perf-grid { grid-template-columns: repeat(2,1fr) !important; }
          .mc-stats-grid { grid-template-columns: repeat(2,1fr) !important; }
        }
        @media (max-width: 540px) {
          .mc-perf-grid { grid-template-columns: 1fr !important; }
          .mc-stats-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
