import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "motion/react";
import { useNavigate } from "react-router-dom";
import {
  AreaChart, Area, XAxis, ResponsiveContainer,
} from "recharts";
import {
  ArrowLeft, ArrowRight, Check, Activity, Smartphone, ShoppingBag,
  Settings, BarChart3, CreditCard, Users, Video, Bell, TrendingUp,
  Server, Lock, Database, Cloud, Cpu, Package, Code, Globe, Shield,
  Zap, Mail, ChevronRight, Terminal, GitBranch, Layers,
} from "lucide-react";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import { scrollToContact } from "../utils/navigation";

// ─── Image imports ─────────────────────────────────────────────────────────────
import userpanelDashboard from "@/imports/userpanel_dashboard_oldal.png";
import workoutVideoList from "@/imports/workout_video_list.png";
import adminNewCsomag3 from "@/imports/admin_new_csomag_3.png";
import adminNewCsomag2 from "@/imports/admin_new_csomag_2.png";
import adminNewCsomag1 from "@/imports/admin_new_csomag_1.png";
import adminWorkoutCalendar from "@/imports/admin_workout_calendar.png";
import userpanelEdukacios from "@/imports/userpanel_edukacios_oldal.png";
import userpanelKaloria from "@/imports/userpanel_kaloriakalkulator_oldal.png";
import userpanelEdzesek from "@/imports/userpanel_edze_sek_oldal.png";

// ─── Keyframe styles ───────────────────────────────────────────────────────────
const KEYFRAMES = `
  @keyframes dashFlow { to { stroke-dashoffset: -10; } }
  @keyframes ripple { 0%{transform:scale(1);opacity:0.5} 100%{transform:scale(3);opacity:0} }
  @keyframes nodePulse { 0%,100%{opacity:0.65} 50%{opacity:1} }
`;

// ─── Helpers ───────────────────────────────────────────────────────────────────

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 22 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.56, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}

function SectionLabel({ children, color = "#3b82f6" }: { children: React.ReactNode; color?: string }) {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: `${color}14`, border: `1px solid ${color}30`, borderRadius: "9999px", padding: "0.375rem 1rem", fontSize: "0.7rem", fontWeight: 700, color, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "1.25rem" }}>
      {children}
    </div>
  );
}

function BrowserChrome({ title, accent = "#3b82f6" }: { title: string; accent?: string }) {
  return (
    <div style={{ background: "#161b27", borderBottom: "1px solid rgba(255,255,255,0.07)", padding: "0.5rem 0.875rem", display: "flex", alignItems: "center", gap: "0.375rem", flexShrink: 0 }}>
      {["#ef4444", "#f59e0b", "#22c55e"].map((c) => (
        <span key={c} style={{ width: 7, height: 7, borderRadius: "50%", background: c, opacity: 0.6, display: "inline-block" }} />
      ))}
      <span style={{ flex: 1, textAlign: "center", fontSize: "0.55rem", color: "rgba(255,255,255,0.2)", letterSpacing: "0.06em", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{title}</span>
      <div style={{ width: 36, height: 2.5, background: `${accent}44`, borderRadius: "9999px", flexShrink: 0 }} />
    </div>
  );
}

function PhoneShell({ children, rotation = 0, scale = 1 }: { children: React.ReactNode; rotation?: number; scale?: number }) {
  return (
    <div style={{ transform: `rotate(${rotation}deg) scale(${scale})`, width: 175, background: "linear-gradient(160deg, #0d1220 0%, #090b14 100%)", borderRadius: "2.25rem", border: "2px solid rgba(59,130,246,0.2)", boxShadow: "0 28px 72px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04), 0 4px 24px rgba(59,130,246,0.18)", overflow: "hidden", fontFamily: "'Inter',sans-serif", flexShrink: 0 }}>
      <div style={{ display: "flex", justifyContent: "center", paddingTop: "0.5rem" }}>
        <div style={{ width: 48, height: 5, background: "rgba(255,255,255,0.07)", borderRadius: "9999px" }} />
      </div>
      {children}
    </div>
  );
}

// ─── ECOSYSTEM DIAGRAM ─────────────────────────────────────────────────────────

function EcosystemDiagram() {
  const ECO_NODES = [
    { emoji: "🌐", label: "Marketing\nWeboldal", cx: 573, cy: 282, color: "#06b6d4" },
    { emoji: "📊", label: "Felhasználói\nPanel", cx: 548, cy: 375, color: "#22c55e" },
    { emoji: "📱", label: "Flutter\nMobil", cx: 482, cy: 444, color: "#3b82f6" },
    { emoji: "🛒", label: "Webshop", cx: 390, cy: 468, color: "#f59e0b" },
    { emoji: "🛠️", label: "Admin\nPanel", cx: 298, cy: 444, color: "#ef4444" },
    { emoji: "⚡", label: "REST\nAPI", cx: 232, cy: 375, color: "#22c55e" },
    { emoji: "💳", label: "Stripe\nFizetés", cx: 207, cy: 282, color: "#8b5cf6" },
    { emoji: "📦", label: "Webshippy", cx: 232, cy: 189, color: "#06b6d4" },
    { emoji: "📧", label: "E-mail\nSzolgáltatás", cx: 298, cy: 120, color: "#f59e0b" },
    { emoji: "🗄️", label: "MySQL\nRedis", cx: 390, cy: 96, color: "#3b82f6" },
    { emoji: "📈", label: "Analytics", cx: 482, cy: 120, color: "#22c55e" },
    { emoji: "☁️", label: "Cloud\nInfra", cx: 548, cy: 189, color: "#8b5cf6" },
  ];
  const CCX = 390, CCY = 282;

  return (
    <div style={{ position: "relative" }}>
      <svg viewBox="0 0 780 568" style={{ width: "100%", display: "block", maxHeight: "520px" }}>
        {ECO_NODES.map((n, i) => (
          <line key={`el${i}`} x1={CCX} y1={CCY} x2={n.cx} y2={n.cy}
            stroke={n.color} strokeWidth="1.2" strokeOpacity="0.3"
            strokeDasharray="5 5"
            style={{ animation: `dashFlow 2.4s linear infinite ${(i * 0.18).toFixed(2)}s` }}
          />
        ))}
        {[0, 1, 2].map((i) => (
          <circle key={`halo${i}`} cx={CCX} cy={CCY} r={52}
            fill="none" stroke="#3b82f6" strokeWidth="1.5" strokeOpacity="0.4"
            style={{ animation: `ripple 3s ease-out infinite ${i * 1}s`, transformBox: "fill-box", transformOrigin: "50% 50%" }}
          />
        ))}
        <circle cx={CCX} cy={CCY} r={185} fill="none" stroke="rgba(59,130,246,0.06)" strokeWidth="1" strokeDasharray="3 8" />
        <circle cx={CCX} cy={CCY} r={54} fill="rgba(59,130,246,0.08)" stroke="rgba(59,130,246,0.25)" strokeWidth="1.5" />
        <circle cx={CCX} cy={CCY} r={40} fill="#0a0c14" stroke="rgba(59,130,246,0.4)" strokeWidth="1.5" />
        <text x={CCX} y={CCY - 7} textAnchor="middle" fontSize="11" fontWeight="800" fill="#fff" fontFamily="Inter,sans-serif">PerformanceVD</text>
        <text x={CCX} y={CCY + 8} textAnchor="middle" fontSize="8.5" fill="#3b82f6" fontFamily="Inter,sans-serif" fontWeight="600">Fő platform</text>
        {ECO_NODES.map((n, i) => {
          const dx = n.cx - CCX;
          const dy = n.cy - CCY;
          const isDx = Math.abs(dx) > Math.abs(dy) * 1.3;
          const isRight = dx > 30;
          const isBottom = dy > 30;
          const anchor = isDx ? (isRight ? "start" : "end") : "middle";
          const lx = isDx ? (isRight ? n.cx + 32 : n.cx - 32) : n.cx;
          const ly = isDx ? n.cy : isBottom ? n.cy + 34 : n.cy - 26;
          const lines = n.label.split("\n");
          return (
            <g key={`enode${i}`} style={{ animation: `nodePulse 3.5s ease-in-out infinite ${(i * 0.28).toFixed(2)}s` }}>
              <circle cx={n.cx} cy={n.cy} r={22} fill="rgba(10,12,18,0.9)" stroke={n.color} strokeWidth="1.5" strokeOpacity="0.55" />
              <text x={n.cx} y={n.cy + 5.5} textAnchor="middle" fontSize="13" fontFamily="sans-serif">{n.emoji}</text>
              {lines.map((line, li) => (
                <text key={li} x={lx} y={ly + li * 11} textAnchor={anchor} fontSize="8.5" fontWeight="600" fill="rgba(255,255,255,0.55)" fontFamily="Inter,sans-serif">{line}</text>
              ))}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ─── STATS ─────────────────────────────────────────────────────────────────────

const GROWTH_DATA = [
  { m: "Jan", athletes: 120, subs: 80, api: 2100 },
  { m: "Feb", athletes: 195, subs: 140, api: 3800 },
  { m: "Már", athletes: 290, subs: 220, api: 5900 },
  { m: "Ápr", athletes: 410, subs: 330, api: 8700 },
  { m: "Máj", athletes: 560, subs: 460, api: 12200 },
  { m: "Jún", athletes: 720, subs: 610, api: 17400 },
  { m: "Júl", athletes: 870, subs: 740, api: 23100 },
  { m: "Aug", athletes: 1010, subs: 860, api: 29800 },
  { m: "Sze", athletes: 1130, subs: 940, api: 35200 },
  { m: "Okt", athletes: 1248, subs: 986, api: 41800 },
];

function ProgressCircle({ value, max, label, color, size = 80 }: { value: number; max: number; label: string; color: string; size?: number }) {
  const r = (size / 2) - 7;
  const circ = 2 * Math.PI * r;
  const pct = value / max;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="7" />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth="7" strokeLinecap="round"
          strokeDasharray={`${circ * pct} ${circ}`} transform={`rotate(-90 ${size / 2} ${size / 2})`} />
        <text x={size / 2} y={size / 2 + 5} textAnchor="middle" fontSize="13" fontWeight="800" fill="#fff" fontFamily="Inter,sans-serif">{value}%</text>
      </svg>
      <span style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.4)", fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase" }}>{label}</span>
    </div>
  );
}

// ─── MOBILE PHONES ─────────────────────────────────────────────────────────────

function PhoneDashboard() {
  return (
    <PhoneShell rotation={-7} scale={0.92}>
      <div style={{ padding: "0.625rem 0.875rem 1rem" }}>
        <div style={{ fontSize: "0.55rem", color: "rgba(255,255,255,0.35)", marginBottom: "0.125rem" }}>Üdvözlünk,</div>
        <div style={{ fontSize: "0.875rem", fontWeight: 800, color: "#fff", letterSpacing: "-0.03em", marginBottom: "0.875rem" }}>Kovács Ádám 👋</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.375rem", marginBottom: "0.75rem" }}>
          {[{ l: "Sorozat", v: "14 nap", c: "#f59e0b" }, { l: "Pontszám", v: "91 pt", c: "#3b82f6" }, { l: "Edzések", v: "48 db", c: "#22c55e" }, { l: "Kalória", v: "12,4K", c: "#8b5cf6" }].map((s) => (
            <div key={s.l} style={{ background: "rgba(255,255,255,0.05)", border: `1px solid ${s.c}22`, borderRadius: "0.625rem", padding: "0.5rem 0.625rem" }}>
              <div style={{ fontSize: "0.4rem", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.05em" }}>{s.l}</div>
              <div style={{ fontSize: "0.75rem", fontWeight: 800, color: s.c, letterSpacing: "-0.03em" }}>{s.v}</div>
            </div>
          ))}
        </div>
        <div style={{ background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)", borderRadius: "0.625rem", padding: "0.5rem 0.625rem" }}>
          <div style={{ fontSize: "0.45rem", color: "#60a5fa", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.2rem" }}>Mai edzés</div>
          <div style={{ fontSize: "0.625rem", fontWeight: 700, color: "#fff" }}>Speed Block A</div>
          <div style={{ fontSize: "0.425rem", color: "rgba(255,255,255,0.4)", marginBottom: "0.375rem" }}>4 gyakorlat · ~45 perc</div>
          <div style={{ background: "linear-gradient(90deg, #3b82f6, #2563eb)", borderRadius: "0.375rem", padding: "0.3rem", textAlign: "center" }}>
            <span style={{ fontSize: "0.5rem", color: "#fff", fontWeight: 700 }}>▶ Edzés megkezdése</span>
          </div>
        </div>
      </div>
    </PhoneShell>
  );
}

function PhoneWorkout() {
  return (
    <PhoneShell rotation={0} scale={1.05}>
      <div style={{ padding: "0.625rem 0.875rem 1rem" }}>
        <div style={{ fontSize: "0.5rem", color: "#3b82f6", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "0.125rem" }}>AKTÍV EDZÉS</div>
        <div style={{ fontSize: "0.875rem", fontWeight: 800, color: "#fff", letterSpacing: "-0.03em", marginBottom: "0.25rem" }}>Sprint 40m</div>
        <div style={{ fontSize: "0.45rem", color: "rgba(255,255,255,0.35)", marginBottom: "0.75rem" }}>6 sorozat · 2 perc pihenő</div>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "0.75rem" }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(59,130,246,0.1)", border: "2.5px solid #3b82f6", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 20px rgba(59,130,246,0.25)" }}>
            <span style={{ fontSize: "1.125rem", fontWeight: 900, color: "#3b82f6", letterSpacing: "-0.04em" }}>1:47</span>
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: "0.375rem", marginBottom: "0.625rem" }}>
          {[1,2,3,4,5,6].map((s) => (
            <div key={s} style={{ width: 22, height: 22, borderRadius: "0.375rem", background: s <= 3 ? "#3b82f6" : "rgba(255,255,255,0.08)", border: `1px solid ${s <= 3 ? "#3b82f6" : "rgba(255,255,255,0.12)"}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: "0.45rem", color: s <= 3 ? "#fff" : "rgba(255,255,255,0.3)", fontWeight: 700 }}>{s}</span>
            </div>
          ))}
        </div>
        <div style={{ background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: "0.5rem", padding: "0.4rem 0.5rem", marginBottom: "0.375rem" }}>
          <span style={{ fontSize: "0.5rem", color: "#4ade80", fontWeight: 700 }}>✓ Sorozat teljesítve</span>
        </div>
        <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: "0.5rem", padding: "0.4rem 0.5rem" }}>
          <span style={{ fontSize: "0.5rem", color: "rgba(255,255,255,0.5)", fontWeight: 600 }}>→ Következő: Jump Squats</span>
        </div>
      </div>
    </PhoneShell>
  );
}

function PhoneVideo() {
  return (
    <PhoneShell rotation={7} scale={0.92}>
      <div>
        <div style={{ height: "120px", background: "linear-gradient(160deg, #0a1628 0%, #060a14 100%)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(59,130,246,0.25)", border: "1.5px solid rgba(59,130,246,0.5)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: "0.875rem", marginLeft: "2px" }}>▶</span>
          </div>
          <div style={{ position: "absolute", bottom: "8px", left: "10px", right: "10px" }}>
            <div style={{ height: "2px", background: "rgba(255,255,255,0.12)", borderRadius: "9999px", overflow: "hidden" }}>
              <div style={{ height: "100%", width: "42%", background: "#3b82f6" }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.15rem" }}>
              <span style={{ fontSize: "0.35rem", color: "rgba(255,255,255,0.3)" }}>3:22</span>
              <span style={{ fontSize: "0.35rem", color: "rgba(255,255,255,0.3)" }}>7:58</span>
            </div>
          </div>
        </div>
        <div style={{ padding: "0.625rem 0.875rem 1rem" }}>
          <div style={{ fontSize: "0.5rem", color: "#3b82f6", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.125rem" }}>Sebességedzés</div>
          <div style={{ fontSize: "0.75rem", fontWeight: 800, color: "#fff", letterSpacing: "-0.03em", marginBottom: "0.5rem" }}>Csípőhajtás Mesterfokon</div>
          <div style={{ display: "flex", gap: "0.375rem", marginBottom: "0.5rem" }}>
            {["Haladó", "28 perc", "4.8 ★"].map((t) => (
              <span key={t} style={{ fontSize: "0.4rem", color: "rgba(255,255,255,0.45)", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "9999px", padding: "0.15rem 0.4rem", fontWeight: 600 }}>{t}</span>
            ))}
          </div>
          <div style={{ fontSize: "0.5rem", color: "rgba(255,255,255,0.3)", lineHeight: 1.6 }}>Ebben a leckében az erőteljes csípőhajtást dolgozod ki...</div>
        </div>
      </div>
    </PhoneShell>
  );
}

// ─── API SECTION DATA ──────────────────────────────────────────────────────────

const API_ENDPOINTS = [
  { method: "GET", path: "/api/v1/athletes", desc: "Sportolók listázása lapozással" },
  { method: "POST", path: "/api/v1/workouts", desc: "Új edzésfolyamat létrehozása" },
  { method: "GET", path: "/api/v1/subscriptions/{id}", desc: "Előfizetés részleteinek lekérése" },
  { method: "POST", path: "/api/v1/stripe/checkout", desc: "Stripe Checkout munkamenet létrehozása" },
  { method: "GET", path: "/api/v1/progress/{uid}", desc: "Felhasználói haladási adatok lekérése" },
  { method: "POST", path: "/api/v1/webhooks/stripe", desc: "Stripe webhook események kezelése" },
  { method: "GET", path: "/api/v1/videos", desc: "Edzésvideók listázása szűrőkkel" },
  { method: "POST", path: "/api/v1/orders", desc: "Új webshop rendelés létrehozása" },
];

const CODE_RESPONSE = `{
  "data": {
    "id": "ath_3nKq8mPx",
    "name": "Kovács Ádám",
    "subscription": {
      "plan": "elite",
      "status": "active",
      "renews_at": "2026-08-01",
      "stripe_id": "sub_1Q..."
    },
    "progress": {
      "speed_score": 82,
      "strength_score": 71,
      "current_week": 12,
      "streak_days": 14
    },
    "permissions": ["videos", "plans", "shop"]
  },
  "meta": {
    "api_version": "1.0",
    "response_time": "48ms"
  }
}`;

// ─── WEBSHOP MOCKUP ────────────────────────────────────────────────────────────

function WebshopMockup() {
  const PRODUCTS = [
    { name: "Sprint Ellenállás Szett", price: "€49,90", tag: "Bestseller", color: "#22c55e" },
    { name: "Regeneráló Foam Roller", price: "€29,90", tag: "Új termék", color: "#3b82f6" },
    { name: "Elite Edzésprogram PDF", price: "€14,90", tag: "Digitális", color: "#8b5cf6" },
    { name: "Sportoló Táplálkozási Terv", price: "€24,90", tag: "Digitális", color: "#f59e0b" },
  ];
  return (
    <div style={{ background: "#0d1117", borderRadius: "1.25rem", overflow: "hidden", boxShadow: "0 24px 64px rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.06)", fontFamily: "'Inter',sans-serif" }}>
      <BrowserChrome title="shop.performancevd.com — Termékek" accent="#f59e0b" />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 280px" }}>
        <div style={{ padding: "1.125rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.875rem" }}>
            <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#fff", letterSpacing: "-0.025em" }}>Termékek <span style={{ color: "rgba(255,255,255,0.3)", fontWeight: 400 }}>— 24 termék</span></div>
            <div style={{ display: "flex", gap: "0.375rem" }}>
              {["Összes", "Digitális", "Fizikai"].map((f, fi) => (
                <span key={f} style={{ fontSize: "0.45rem", color: fi === 0 ? "#fff" : "rgba(255,255,255,0.4)", background: fi === 0 ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.04)", border: `1px solid ${fi === 0 ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.06)"}`, borderRadius: "9999px", padding: "0.2rem 0.5rem", fontWeight: 600 }}>{f}</span>
              ))}
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.625rem" }}>
            {PRODUCTS.map((p) => (
              <div key={p.name} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "0.75rem", overflow: "hidden" }}>
                <div style={{ height: "72px", background: `linear-gradient(135deg, ${p.color}18 0%, rgba(0,0,0,0.5) 100%)`, display: "flex", alignItems: "flex-start", justifyContent: "flex-end", padding: "0.375rem" }}>
                  <span style={{ fontSize: "0.4rem", background: `${p.color}20`, color: p.color, border: `1px solid ${p.color}30`, borderRadius: "9999px", padding: "0.15rem 0.4rem", fontWeight: 700 }}>{p.tag}</span>
                </div>
                <div style={{ padding: "0.5rem 0.625rem" }}>
                  <div style={{ fontSize: "0.5rem", fontWeight: 700, color: "rgba(255,255,255,0.85)", lineHeight: 1.3, marginBottom: "0.25rem" }}>{p.name}</div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "0.625rem", fontWeight: 800, color: p.color, letterSpacing: "-0.02em" }}>{p.price}</span>
                    <button style={{ background: `${p.color}20`, border: `1px solid ${p.color}30`, borderRadius: "0.3rem", padding: "0.15rem 0.375rem", fontSize: "0.4rem", color: p.color, fontWeight: 700, cursor: "default" }}>Kosárba</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ background: "rgba(255,255,255,0.02)", borderLeft: "1px solid rgba(255,255,255,0.05)", padding: "1.125rem" }}>
          <div style={{ fontSize: "0.625rem", fontWeight: 700, color: "#fff", marginBottom: "0.875rem" }}>Kosár <span style={{ color: "#22c55e" }}>2 termék</span></div>
          {[{ name: "Sprint Ellenállás Szett", price: "€49,90" }, { name: "Elite Edzésprogram PDF", price: "€14,90" }].map((item) => (
            <div key={item.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.4rem 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <span style={{ fontSize: "0.475rem", color: "rgba(255,255,255,0.6)", fontWeight: 500, maxWidth: "140px", lineHeight: 1.3 }}>{item.name}</span>
              <span style={{ fontSize: "0.525rem", color: "#fff", fontWeight: 700 }}>{item.price}</span>
            </div>
          ))}
          <div style={{ marginTop: "0.625rem" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem", marginBottom: "0.5rem" }}>
              {[{ l: "Részösszeg", v: "€64,80" }, { l: "Szállítás", v: "€4,90" }, { l: "Kupon", v: "-€6,48" }].map((r) => (
                <div key={r.l} style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "0.45rem", color: "rgba(255,255,255,0.35)" }}>{r.l}</span>
                  <span style={{ fontSize: "0.45rem", color: r.v.startsWith("-") ? "#22c55e" : "rgba(255,255,255,0.6)", fontWeight: 600 }}>{r.v}</span>
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "0.375rem", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
                <span style={{ fontSize: "0.5rem", color: "#fff", fontWeight: 700 }}>Összesen</span>
                <span style={{ fontSize: "0.625rem", color: "#22c55e", fontWeight: 800 }}>€63,22</span>
              </div>
            </div>
            <div style={{ background: "linear-gradient(90deg, #22c55e, #16a34a)", borderRadius: "0.5rem", padding: "0.45rem", textAlign: "center" }}>
              <span style={{ fontSize: "0.5rem", color: "#fff", fontWeight: 700 }}>Fizetés · Stripe Checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── FEATURE MATRIX ────────────────────────────────────────────────────────────

const MATRIX_FEATURES = [
  "Edzésprogramok kezelése",
  "Előfizetéses számlázás",
  "Videó-tartalom",
  "Teljesítményelemzés",
  "Fizetési feldolgozás",
  "Kuponok és kedvezmények",
  "Felhasználókezelés",
  "REST API hozzáférés",
  "Push értesítések",
  "Mobil alkalmazás",
  "Bevételi riportok",
  "Cloud infrastruktúra",
];

const MATRIX_MODULES = [
  { name: "Marketing\nWeboldal", color: "#06b6d4" },
  { name: "Felhasználói\nPanel", color: "#22c55e" },
  { name: "Admin\nPanel", color: "#ef4444" },
  { name: "Mobil\nApp", color: "#3b82f6" },
  { name: "Backend\nAPI", color: "#8b5cf6" },
];

const MATRIX_DATA: boolean[][] = [
  [false, true,  true,  true,  true ],
  [false, true,  true,  false, true ],
  [false, true,  true,  true,  false],
  [false, true,  true,  true,  true ],
  [false, false, false, false, true ],
  [true,  true,  true,  false, true ],
  [false, false, true,  false, true ],
  [false, false, false, false, true ],
  [false, true,  true,  true,  true ],
  [false, true,  false, true,  false],
  [false, false, true,  false, true ],
  [false, false, false, false, true ],
];

// ─── STRIPE STEPS ──────────────────────────────────────────────────────────────

const STRIPE_STEPS = [
  { icon: "👤", step: "Felhasználó", desc: "Előfizetési csomagot választ", color: "#3b82f6" },
  { icon: "🛒", step: "Checkout", desc: "Stripe Checkout munkamenet jön létre", color: "#8b5cf6" },
  { icon: "💳", step: "Fizetés", desc: "Biztonságos bankkártyás tranzakció", color: "#22c55e" },
  { icon: "🔔", step: "Webhook", desc: "invoice.paid esemény érkezik", color: "#f59e0b" },
  { icon: "⚙️", step: "Laravel", desc: "WebhookController job-ot indít", color: "#ef4444" },
  { icon: "🗄️", step: "Adatbázis", desc: "Előfizetési rekord aktiválva", color: "#3b82f6" },
  { icon: "📄", step: "Számla", desc: "PDF számla generálva és tárolva", color: "#8b5cf6" },
  { icon: "📧", step: "E-mail", desc: "Visszaigazolás kiküldve a felhasználónak", color: "#22c55e" },
  { icon: "📊", step: "Dashboard", desc: "Felhasználói panel hozzáférés megadva", color: "#f59e0b" },
  { icon: "🛒", step: "Webshop", desc: "Termék jogosultságok frissítve", color: "#06b6d4" },
];

// ─── TECH STACK ────────────────────────────────────────────────────────────────

const TECH_CATS = [
  { cat: "Frontend", color: "#3b82f6", icon: <Globe size={16} />, techs: ["React 18", "TypeScript", "Tailwind CSS", "Vite", "Inertia.js"] },
  { cat: "Backend", color: "#22c55e", icon: <Server size={16} />, techs: ["Laravel 11", "PHP 8.3", "REST API", "JWT Auth", "Laravel Queues"] },
  { cat: "Mobil", color: "#8b5cf6", icon: <Smartphone size={16} />, techs: ["Flutter 3", "Dart", "Android SDK", "iOS / SwiftUI Bridge", "FCM Push"] },
  { cat: "Adatbázis", color: "#f59e0b", icon: <Database size={16} />, techs: ["MySQL 8", "Redis 7", "Laravel Migrations", "Eloquent ORM", "DB Backups"] },
  { cat: "Infrastruktúra", color: "#ef4444", icon: <Cpu size={16} />, techs: ["Docker Compose", "NGINX", "GitHub Actions CI/CD", "SSL / TLS", "Cloudflare"] },
  { cat: "Fizetés és integrációk", color: "#06b6d4", icon: <CreditCard size={16} />, techs: ["Stripe API", "Stripe Webhooks", "Webshippy", "SMTP Email", "Analytics"] },
];

// ─── DEV TIMELINE ──────────────────────────────────────────────────────────────

const DEV_TIMELINE = [
  { phase: "Kutatás és igényfelmérés", desc: "Piacelemzés, versenytárs-kutatás, felhasználói folyamatok feltérképezése", color: "#3b82f6" },
  { phase: "Rendszerarchitektúra", desc: "Adatbázis séma, API tervezés, modulok meghatározása, technológiai döntések", color: "#8b5cf6" },
  { phase: "UI/UX tervezés", desc: "Figma drótvázak mind a 7 rendszerhez, reszponzív minták, design rendszer", color: "#22c55e" },
  { phase: "Backend fejlesztés", desc: "Laravel API, Eloquent modellek, service réteg, autentikációs rendszer", color: "#f59e0b" },
  { phase: "Frontend fejlesztés", desc: "React sportoló dashboard, admin panel, marketing weboldal", color: "#ef4444" },
  { phase: "Mobil fejlesztés", desc: "Flutter alkalmazás iOS-re és Androidra, teljes API integrációval", color: "#06b6d4" },
  { phase: "Stripe integráció", desc: "Checkout folyamat, webhookok, ügyfélportál, előfizetési ütemezések, kuponok", color: "#a855f7" },
  { phase: "Webáruház fejlesztés", desc: "Webshop terméklapok, kosár, Webshippy kiszállítás, rendeléskezelés", color: "#22c55e" },
  { phase: "Tesztelés és minőségbiztosítás", desc: "Unit tesztek, integrációs tesztek, E2E folyamatok, biztonsági audit, terheléstesztelés", color: "#3b82f6" },
  { phase: "DevOps és élesítés", desc: "Docker, NGINX, CI/CD pipeline, monitorozás, éles indítás", color: "#f59e0b" },
  { phase: "Folyamatos fejlesztés", desc: "Új funkciók, teljesítményhangolás, AI integrációk fejlesztés alatt", color: "#8b5cf6" },
];

// ─── NAV ───────────────────────────────────────────────────────────────────────

function PVDNav() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, height: "64px", background: scrolled ? "rgba(8,10,16,0.92)" : "rgba(8,10,16,0.7)", backdropFilter: "blur(20px)", borderBottom: scrolled ? "1px solid rgba(59,130,246,0.14)" : "1px solid transparent", padding: "0 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", transition: "all 0.22s ease" }}>
      <button onClick={() => navigate("/")} style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.45)", fontSize: "0.875rem", fontWeight: 600, padding: "0.5rem 0", transition: "color 0.15s" }}
        onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.85)")}
        onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.45)")}>
        <ArrowLeft size={15} /> Projektek
      </button>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", lineHeight: 1.1 }}>
        <span style={{ fontWeight: 800, fontSize: "0.875rem", letterSpacing: "-0.03em", color: "#fff" }}>Jandl Dávid</span>
        <span style={{ fontSize: "0.6rem", fontWeight: 600, color: "#3b82f6", letterSpacing: "0.04em" }}>Technikai partner</span>
      </div>
      <button onClick={scrollToContact} style={{ background: "linear-gradient(90deg, #3b82f6, #2563eb)", color: "#fff", border: "none", borderRadius: "0.625rem", padding: "0.5rem 1.125rem", fontSize: "0.8125rem", fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 16px rgba(59,130,246,0.3)" }}>
        Lépjünk kapcsolatba
      </button>
    </nav>
  );
}

// ─── MAIN PAGE ─────────────────────────────────────────────────────────────────

export default function PerformanceVDPage() {
  const navigate = useNavigate();

  return (
    <div style={{ fontFamily: "'Inter', -apple-system, sans-serif", background: "#fff" }}>
      <style>{KEYFRAMES}</style>
      <PVDNav />

      {/* ══ 1. HERO ═══════════════════════════════════════════════════════════ */}
      <section style={{ background: "linear-gradient(160deg, #080a10 0%, #0d1220 55%, #080b14 100%)", paddingTop: "8rem", paddingBottom: "5rem", padding: "8rem 1.5rem 5rem", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-100px", left: "8%", width: "600px", height: "600px", borderRadius: "50%", background: "radial-gradient(circle, rgba(59,130,246,0.07) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "-120px", right: "5%", width: "500px", height: "500px", borderRadius: "50%", background: "radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div style={{ maxWidth: "76rem", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "3.5rem", alignItems: "center" }}>
          <motion.div initial={{ opacity: 0, x: -28 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.5rem" }}>
              <button onClick={() => navigate("/")} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "0.75rem", color: "rgba(255,255,255,0.25)", fontWeight: 500, padding: 0 }}>Főoldal</button>
              <span style={{ color: "rgba(255,255,255,0.15)", fontSize: "0.7rem" }}>/</span>
              <button onClick={() => navigate("/")} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "0.75rem", color: "rgba(255,255,255,0.25)", fontWeight: 500, padding: 0 }}>Projektek</button>
              <span style={{ color: "rgba(255,255,255,0.15)", fontSize: "0.7rem" }}>/</span>
              <span style={{ fontSize: "0.75rem", color: "#60a5fa", fontWeight: 600 }}>PerformanceVD</span>
            </div>
            <SectionLabel color="#3b82f6">Sport SaaS Ökoszisztéma</SectionLabel>
            <h1 style={{ fontSize: "clamp(2.75rem, 5.5vw, 4.5rem)", fontWeight: 900, letterSpacing: "-0.055em", lineHeight: 1.02, color: "#fff", margin: "0 0 1.25rem" }}>
              Performance<br />
              <span style={{ background: "linear-gradient(90deg, #3b82f6, #8b5cf6, #06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>VD</span>
            </h1>
            <p style={{ fontSize: "1.0625rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.8, margin: "0 0 2rem", maxWidth: "460px" }}>
              Teljes digitális sportoló-platform — SaaS ökoszisztéma előfizetéskezeléssel, e-kereskedelemmel, Flutter mobil alkalmazással, admin rendszerrel, REST API-val és automatizációs szolgáltatásokkal.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "2.25rem" }}>
              {["7 rendszer", "100+ képernyő", "20+ modul", "100+ API endpoint", "iOS & Android", "Cloud Native"].map((p) => (
                <span key={p} style={{ fontSize: "0.8rem", fontWeight: 600, color: "#93c5fd", background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)", borderRadius: "9999px", padding: "0.3rem 0.8rem" }}>{p}</span>
              ))}
            </div>
            <div style={{ display: "flex", gap: "0.875rem", flexWrap: "wrap" }}>
              <button onClick={scrollToContact} style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "linear-gradient(90deg, #3b82f6, #2563eb)", color: "#fff", border: "none", borderRadius: "0.75rem", padding: "0.875rem 1.5rem", fontSize: "0.9375rem", fontWeight: 700, cursor: "pointer", boxShadow: "0 8px 28px rgba(59,130,246,0.38)" }}>
                Lépjünk kapcsolatba <ArrowRight size={16} />
              </button>
              <button onClick={() => navigate("/projektek/motocosmos")} style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.65)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "0.75rem", padding: "0.875rem 1.5rem", fontSize: "0.9375rem", fontWeight: 600, cursor: "pointer" }}>
                Más projektek
              </button>
            </div>
          </motion.div>

          {/* Hero: valódi screenshot */}
          <motion.div initial={{ opacity: 0, x: 28, scale: 0.97 }} animate={{ opacity: 1, x: 0, scale: 1 }} transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}>
            <div style={{ borderRadius: "1.5rem", overflow: "hidden", boxShadow: "0 32px 80px rgba(0,0,0,0.55), 0 4px 24px rgba(59,130,246,0.18)", border: "1px solid rgba(59,130,246,0.15)" }}>
              <BrowserChrome title="app.performancevd.com — Sportoló Dashboard" />
              <ImageWithFallback src={userpanelDashboard} alt="PerformanceVD sportoló dashboard" style={{ width: "100%", display: "block" }} />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══ 2. STATS BAR ══════════════════════════════════════════════════════ */}
      <section style={{ background: "#080a10", padding: "0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ maxWidth: "76rem", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", borderLeft: "1px solid rgba(255,255,255,0.06)" }}>
          {[
            { v: "100+", l: "Képernyő", c: "#3b82f6" },
            { v: "20+", l: "Fő modul", c: "#8b5cf6" },
            { v: "100+", l: "REST endpoint", c: "#22c55e" },
            { v: "7", l: "Összehangolt rendszer", c: "#f59e0b" },
            { v: "4", l: "Alkalmazás", c: "#ef4444" },
            { v: "3", l: "Platform", c: "#06b6d4" },
            { v: "∞", l: "Skálázhatóság", c: "#a855f7" },
            { v: "1", l: "Közös backend", c: "#22c55e" },
          ].map((s) => (
            <div key={s.l} style={{ padding: "1.5rem 1.25rem", borderRight: "1px solid rgba(255,255,255,0.06)", textAlign: "center" }}>
              <div style={{ fontSize: "clamp(1.5rem, 2.5vw, 2rem)", fontWeight: 900, letterSpacing: "-0.05em", color: s.c, lineHeight: 1.1 }}>{s.v}</div>
              <div style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.35)", fontWeight: 500, marginTop: "0.25rem", lineHeight: 1.3 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ══ 3. ECOSYSTEM DIAGRAM ══════════════════════════════════════════════ */}
      <section style={{ background: "#0a0c12", padding: "6rem 1.5rem", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "800px", height: "800px", borderRadius: "50%", background: "radial-gradient(circle, rgba(59,130,246,0.04) 0%, transparent 60%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: "76rem", margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: "2rem" }}>
              <SectionLabel color="#3b82f6">Rendszer-ökoszisztéma</SectionLabel>
              <h2 style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)", fontWeight: 800, letterSpacing: "-0.048em", color: "#fff", margin: "0 0 0.875rem" }}>
                12 összehangolt rendszer.<br />
                <span style={{ background: "linear-gradient(90deg, #3b82f6, #8b5cf6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Egyetlen platform.</span>
              </h2>
              <p style={{ fontSize: "1rem", color: "rgba(255,255,255,0.4)", maxWidth: "500px", margin: "0 auto", lineHeight: 1.75 }}>
                Minden alkalmazás egy közös Laravel API maggal kommunikál — valós idejű adatszinkronizációval és konzisztens üzleti logikával.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(59,130,246,0.1)", borderRadius: "1.5rem", padding: "1rem 0.5rem" }}>
              <EcosystemDiagram />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══ 4. KPI & GROWTH ═══════════════════════════════════════════════════ */}
      <section style={{ background: "#0d1117", padding: "6rem 1.5rem", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        <div style={{ maxWidth: "76rem", margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
              <SectionLabel color="#22c55e">Platform statisztikák</SectionLabel>
              <h2 style={{ fontSize: "clamp(1.75rem, 3vw, 2.5rem)", fontWeight: 800, letterSpacing: "-0.045em", color: "#fff", margin: 0 }}>
                Valós adatok. Mérhető növekedés.
              </h2>
            </div>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "1.5rem" }}>
            <Reveal>
              <div style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "1.25rem", padding: "1.5rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                  <div>
                    <div style={{ fontSize: "0.625rem", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.25rem" }}>Felhasználói növekedés</div>
                    <div style={{ fontSize: "1.75rem", fontWeight: 900, color: "#fff", letterSpacing: "-0.05em" }}>1 248 <span style={{ fontSize: "0.75rem", fontWeight: 500, color: "rgba(255,255,255,0.3)" }}>felhasználó</span></div>
                  </div>
                  <span style={{ fontSize: "0.75rem", background: "rgba(34,197,94,0.15)", color: "#4ade80", border: "1px solid rgba(34,197,94,0.25)", borderRadius: "9999px", padding: "0.3rem 0.875rem", fontWeight: 700 }}>+940% ↑</span>
                </div>
                <ResponsiveContainer width="100%" height={120}>
                  <AreaChart data={GROWTH_DATA}>
                    <defs>
                      <linearGradient id="kpi1" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="m" tick={{ fontSize: 9, fill: "rgba(255,255,255,0.3)" }} axisLine={false} tickLine={false} />
                    <Area type="monotone" dataKey="athletes" stroke="#3b82f6" strokeWidth={2} fill="url(#kpi1)" dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "1.25rem", padding: "1.5rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                  <div>
                    <div style={{ fontSize: "0.625rem", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.25rem" }}>API hívás / nap</div>
                    <div style={{ fontSize: "1.75rem", fontWeight: 900, color: "#fff", letterSpacing: "-0.05em" }}>41 800 <span style={{ fontSize: "0.75rem", fontWeight: 500, color: "rgba(255,255,255,0.3)" }}>hívás</span></div>
                  </div>
                  <span style={{ fontSize: "0.75rem", background: "rgba(34,197,94,0.15)", color: "#4ade80", border: "1px solid rgba(34,197,94,0.25)", borderRadius: "9999px", padding: "0.3rem 0.875rem", fontWeight: 700 }}>+1 890% ↑</span>
                </div>
                <ResponsiveContainer width="100%" height={120}>
                  <AreaChart data={GROWTH_DATA}>
                    <defs>
                      <linearGradient id="kpi2" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="m" tick={{ fontSize: 9, fill: "rgba(255,255,255,0.3)" }} axisLine={false} tickLine={false} />
                    <Area type="monotone" dataKey="api" stroke="#22c55e" strokeWidth={2} fill="url(#kpi2)" dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Reveal>
          </div>
          <Reveal>
            <div style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "1.25rem", padding: "2rem", display: "flex", justifyContent: "space-around", flexWrap: "wrap", gap: "1.5rem" }}>
              <ProgressCircle value={99} max={100} label="Uptime" color="#22c55e" />
              <ProgressCircle value={98} max={100} label="Biztonsági értékelés" color="#8b5cf6" />
              <ProgressCircle value={79} max={100} label="Előfizetési arány" color="#3b82f6" />
              <ProgressCircle value={92} max={100} label="Tesztlefedettség" color="#f59e0b" />
              <ProgressCircle value={86} max={100} label="Teljesítmény" color="#ef4444" />
              <ProgressCircle value={95} max={100} label="Rendelkezésre állás" color="#06b6d4" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══ 5. UI SHOWCASE — valódi képernyőfotók ═════════════════════════════ */}
      <section style={{ background: "#f8f9fb", padding: "6rem 1.5rem" }}>
        <div style={{ maxWidth: "76rem", margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
              <SectionLabel color="#3b82f6">Felhasználói felületek</SectionLabel>
              <h2 style={{ fontSize: "clamp(1.75rem, 3vw, 2.5rem)", fontWeight: 800, letterSpacing: "-0.045em", color: "#0f1117", margin: "0 0 0.875rem" }}>
                100+ képernyő. Minden részletre kiterjedő UI.
              </h2>
              <p style={{ fontSize: "1rem", color: "#6e6e80", maxWidth: "480px", margin: "0 auto", lineHeight: 1.75 }}>
                Minden panel és minden funkció egyedi, gondosan megtervezett felhasználói felületet kapott.
              </p>
            </div>
          </Reveal>

          {/* 3-oszlopos galéria — valódi screenshotok */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>
            {[
              { title: "app.performancevd.com/dashboard", src: userpanelDashboard, alt: "Sportoló dashboard főoldal", accent: "#3b82f6" },
              { title: "app.performancevd.com/edzesnaptar", src: userpanelEdzesek, alt: "Edzésnaptár heti nézet", accent: "#22c55e" },
              { title: "app.performancevd.com/edzes/video", src: workoutVideoList, alt: "Videós edzéslejátszó", accent: "#8b5cf6" },
              { title: "app.performancevd.com/edukacio", src: userpanelEdukacios, alt: "Edukációs tartalmak", accent: "#06b6d4" },
              { title: "app.performancevd.com/kaloria", src: userpanelKaloria, alt: "Kalória és makró kalkulátor", accent: "#22c55e" },
              { title: "admin.performancevd.com/workout-templates", src: adminWorkoutCalendar, alt: "Admin workout naptár nézet", accent: "#ef4444" },
            ].map(({ title, src, alt, accent }, i) => (
              <Reveal key={title} delay={i * 0.06}>
                <div style={{ background: "#0d1117", borderRadius: "1rem", overflow: "hidden", boxShadow: "0 12px 36px rgba(0,0,0,0.25), 0 4px 12px rgba(0,0,0,0.15)", border: "1px solid rgba(255,255,255,0.06)", transition: "transform 0.18s, box-shadow 0.18s" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)"; (e.currentTarget as HTMLElement).style.boxShadow = `0 20px 56px rgba(0,0,0,0.35), 0 0 0 1px ${accent}28`; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 12px 36px rgba(0,0,0,0.25), 0 4px 12px rgba(0,0,0,0.15)"; }}>
                  <BrowserChrome title={title} accent={accent} />
                  <ImageWithFallback src={src} alt={alt} style={{ width: "100%", display: "block" }} />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 6. FLUTTER MOBILE ═════════════════════════════════════════════════ */}
      <section style={{ background: "#0a0c12", padding: "6rem 1.5rem" }}>
        <div style={{ maxWidth: "76rem", margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
              <SectionLabel color="#3b82f6">Flutter mobil alkalmazás</SectionLabel>
              <h2 style={{ fontSize: "clamp(1.75rem, 3vw, 2.5rem)", fontWeight: 800, letterSpacing: "-0.045em", color: "#fff", margin: "0 0 0.875rem" }}>
                iOS és Android. Natív teljesítmény.
              </h2>
              <p style={{ fontSize: "1rem", color: "rgba(255,255,255,0.4)", maxWidth: "480px", margin: "0 auto", lineHeight: 1.75 }}>
                A Flutter alkalmazás valós idejű szinkronizációval kapcsolódik a webes platformhoz — minden funkció, minden eszközön elérhetően.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-end", gap: "2rem", paddingBottom: "1rem" }}>
              <div style={{ transform: "translateY(20px)" }}><PhoneDashboard /></div>
              <PhoneWorkout />
              <div style={{ transform: "translateY(20px)" }}><PhoneVideo /></div>
            </div>
          </Reveal>
          <Reveal delay={0.12}>
            <p style={{ textAlign: "center", fontSize: "0.75rem", color: "rgba(255,255,255,0.2)", marginTop: "2rem", letterSpacing: "0.04em" }}>
              Valódi mobil képernyőfotók hamarosan érkeznek
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "0.875rem", marginTop: "2.5rem" }}>
              {[
                { icon: <Video size={16} />, l: "Videóalapú edzés", c: "#3b82f6" },
                { icon: <TrendingUp size={16} />, l: "Haladás követése", c: "#22c55e" },
                { icon: <CreditCard size={16} />, l: "Előfizetés mobilon", c: "#8b5cf6" },
                { icon: <Bell size={16} />, l: "Push értesítések", c: "#f59e0b" },
                { icon: <Cpu size={16} />, l: "Valós idejű szinkron", c: "#ef4444" },
                { icon: <Users size={16} />, l: "Profilkezelés", c: "#06b6d4" },
              ].map((f) => (
                <div key={f.l} style={{ display: "flex", alignItems: "center", gap: "0.625rem", background: "rgba(255,255,255,0.03)", border: `1px solid ${f.c}18`, borderRadius: "0.75rem", padding: "0.75rem 1rem" }}>
                  <span style={{ color: f.c }}>{f.icon}</span>
                  <span style={{ fontSize: "0.8125rem", color: "rgba(255,255,255,0.6)", fontWeight: 600 }}>{f.l}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══ 7. ADMIN PANEL — valódi képernyőfotók ════════════════════════════ */}
      <section style={{ background: "#f8f9fb", padding: "6rem 1.5rem" }}>
        <div style={{ maxWidth: "76rem", margin: "0 auto" }}>
          <Reveal>
            <div style={{ marginBottom: "3rem" }}>
              <SectionLabel color="#ef4444">Admin rendszer</SectionLabel>
              <h2 style={{ fontSize: "clamp(1.75rem, 3vw, 2.5rem)", fontWeight: 800, letterSpacing: "-0.045em", color: "#0f1117", margin: "0 0 0.875rem", lineHeight: 1.15 }}>
                A rendszer teljes adminisztrációja egy helyen.
              </h2>
              <p style={{ fontSize: "1rem", color: "#6e6e80", maxWidth: "520px", lineHeight: 1.75 }}>
                Felhasználók, előfizetések, tartalmak, workout sablonok és rendszerbeállítások valós időben kezelhetők — egyetlen gondosan megtervezett admin felületen.
              </p>
            </div>
          </Reveal>

          {/* Fő admin screenshot — workout naptár */}
          <Reveal delay={0.1}>
            <div style={{ background: "#0d1117", borderRadius: "1.25rem", overflow: "hidden", boxShadow: "0 32px 80px rgba(0,0,0,0.45), 0 0 0 1px rgba(239,68,68,0.12)", border: "1px solid rgba(255,255,255,0.06)", marginBottom: "1.25rem" }}>
              <BrowserChrome title="admin.performancevd.com — Workout Templates · Naptár Nézet" accent="#ef4444" />
              <ImageWithFallback src={adminWorkoutCalendar} alt="Admin workout naptár nézet" style={{ width: "100%", display: "block" }} />
            </div>
          </Reveal>

          {/* 3-lépéses csomag létrehozás flow */}
          <Reveal delay={0.15}>
            <div style={{ marginBottom: "1rem" }}>
              <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#6e6e80", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "0.75rem" }}>
                Csomag létrehozása — 3 lépéses varázsló
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>
              {[
                { src: adminNewCsomag1, alt: "Csomag létrehozás — alap információk és árazás", title: "admin.performancevd.com — Új csomag · 1. Alap információk", accent: "#3b82f6", step: "1. lépés · Alap információk és árazás" },
                { src: adminNewCsomag2, alt: "Csomag létrehozás — funkciók és jogosultságok", title: "admin.performancevd.com — Új csomag · 2. Funkciók", accent: "#8b5cf6", step: "2. lépés · Funkciók és menüpont jogosultságok" },
                { src: adminNewCsomag3, alt: "Csomag létrehozás — előnyök és láthatóság", title: "admin.performancevd.com — Új csomag · 3. Előnyök", accent: "#22c55e", step: "3. lépés · Előnyök, láthatóság és direct link" },
              ].map(({ src, alt, title, accent, step }, i) => (
                <div key={step} style={{ background: "#0d1117", borderRadius: "1rem", overflow: "hidden", boxShadow: "0 12px 36px rgba(0,0,0,0.28)", border: "1px solid rgba(255,255,255,0.06)", transition: "transform 0.18s, box-shadow 0.18s" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)"; (e.currentTarget as HTMLElement).style.boxShadow = `0 20px 56px rgba(0,0,0,0.35), 0 0 0 1px ${accent}28`; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 12px 36px rgba(0,0,0,0.28)"; }}>
                  <BrowserChrome title={title} accent={accent} />
                  <ImageWithFallback src={src} alt={alt} style={{ width: "100%", display: "block" }} />
                  <div style={{ padding: "0.625rem 0.875rem", background: "rgba(255,255,255,0.02)", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                    <span style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.3)", fontWeight: 600 }}>{step}</span>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══ 8. API SECTION ════════════════════════════════════════════════════ */}
      <section style={{ background: "#080a10", padding: "6rem 1.5rem" }}>
        <div style={{ maxWidth: "76rem", margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
              <SectionLabel color="#22c55e">REST API</SectionLabel>
              <h2 style={{ fontSize: "clamp(1.75rem, 3vw, 2.5rem)", fontWeight: 800, letterSpacing: "-0.045em", color: "#fff", margin: "0 0 0.875rem" }}>
                100+ endpoint. Teljesen dokumentált API.
              </h2>
              <p style={{ fontSize: "1rem", color: "rgba(255,255,255,0.4)", maxWidth: "460px", margin: "0 auto", lineHeight: 1.75 }}>
                Laravel-alapú REST API minden kliensalkalmazás számára — JWT autentikáció, rate limiting, verziókezelés és Stripe webhook integráció.
              </p>
            </div>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
            <Reveal>
              <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "1.25rem", overflow: "hidden" }}>
                <div style={{ background: "rgba(255,255,255,0.03)", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "0.875rem 1.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <Terminal size={14} color="#22c55e" />
                  <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "rgba(255,255,255,0.7)" }}>API végpontok</span>
                  <span style={{ marginLeft: "auto", fontSize: "0.6rem", background: "rgba(34,197,94,0.15)", color: "#4ade80", border: "1px solid rgba(34,197,94,0.25)", borderRadius: "9999px", padding: "0.15rem 0.5rem", fontWeight: 600 }}>v1.0</span>
                </div>
                <div style={{ padding: "0.625rem" }}>
                  {API_ENDPOINTS.map((ep) => (
                    <div key={ep.path} style={{ display: "flex", alignItems: "center", gap: "0.625rem", padding: "0.5rem 0.625rem", borderRadius: "0.5rem", marginBottom: "0.2rem", transition: "background 0.12s" }}
                      onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)")}
                      onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}>
                      <span style={{ fontSize: "0.55rem", fontWeight: 800, minWidth: "36px", textAlign: "center", borderRadius: "0.25rem", padding: "0.15rem 0.25rem", background: ep.method === "GET" ? "rgba(34,197,94,0.15)" : "rgba(59,130,246,0.15)", color: ep.method === "GET" ? "#4ade80" : "#93c5fd" }}>{ep.method}</span>
                      <code style={{ fontSize: "0.6rem", color: "#e2e8f0", fontFamily: "monospace", flex: 1 }}>{ep.path}</code>
                      <span style={{ fontSize: "0.5rem", color: "rgba(255,255,255,0.25)", maxWidth: "100px", lineHeight: 1.3 }}>{ep.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div style={{ background: "#0d1117", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "1.25rem", overflow: "hidden", fontFamily: "monospace" }}>
                <div style={{ background: "rgba(255,255,255,0.03)", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "0.875rem 1.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  {["#ef4444", "#f59e0b", "#22c55e"].map((c) => <span key={c} style={{ width: 8, height: 8, borderRadius: "50%", background: c, opacity: 0.6, display: "inline-block" }} />)}
                  <span style={{ fontSize: "0.625rem", color: "rgba(255,255,255,0.25)", marginLeft: "0.5rem" }}>GET /api/v1/athletes/ath_3nKq8mPx</span>
                  <span style={{ marginLeft: "auto", fontSize: "0.55rem", color: "#22c55e", fontWeight: 600 }}>200 OK · 48ms</span>
                </div>
                <pre style={{ margin: 0, padding: "1.125rem", fontSize: "0.6875rem", color: "#e2e8f0", lineHeight: 1.7, overflow: "auto", whiteSpace: "pre-wrap" }}>
                  <span style={{ color: "rgba(255,255,255,0.3)" }}>{`// JSON válasz\n`}</span>
                  {CODE_RESPONSE.split("\n").map((line, i) => {
                    const isKey = line.includes('"') && line.includes('":');
                    const isStr = line.includes('"') && !isKey && !line.includes('{') && !line.includes('}');
                    const isBool = line.includes("true") || line.includes("false");
                    const isNum = /:\s+[\d.]+,?$/.test(line);
                    let color: string = "rgba(255,255,255,0.75)";
                    if (isKey) color = "#93c5fd";
                    else if (isStr) color = "#86efac";
                    else if (isBool || isNum) color = "#fbbf24";
                    return <span key={i} style={{ color, display: "block" }}>{line}</span>;
                  })}
                </pre>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ══ 9. STRIPE FLOW ════════════════════════════════════════════════════ */}
      <section style={{ background: "#0d1117", padding: "6rem 1.5rem", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        <div style={{ maxWidth: "76rem", margin: "0 auto" }}>
          <Reveal>
            <div style={{ marginBottom: "3.5rem" }}>
              <SectionLabel color="#8b5cf6">Stripe automatizáció</SectionLabel>
              <h2 style={{ fontSize: "clamp(1.75rem, 3vw, 2.5rem)", fontWeight: 800, letterSpacing: "-0.045em", color: "#fff", margin: "0 0 0.875rem", lineHeight: 1.15 }}>
                Teljesen automatizált előfizetési folyamat.
              </h2>
              <p style={{ fontSize: "1rem", color: "rgba(255,255,255,0.4)", maxWidth: "520px", lineHeight: 1.75 }}>
                Stripe Checkout-tól a dashboard hozzáférés megadásáig — minden lépés webhook-alapú, automatikus és naplózott. Emberi beavatkozás nélkül.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "0" }}>
              {STRIPE_STEPS.map((s, i) => (
                <div key={s.step} style={{ display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}>
                  {i < STRIPE_STEPS.length - 1 && (
                    <div style={{ position: "absolute", top: "28px", left: "50%", right: "-50%", height: "1.5px", background: `linear-gradient(90deg, ${s.color}60, ${STRIPE_STEPS[i + 1].color}60)`, zIndex: 0 }} />
                  )}
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem", padding: "1.25rem 0.5rem", zIndex: 1 }}>
                    <div style={{ width: 56, height: 56, borderRadius: "50%", background: `${s.color}14`, border: `2px solid ${s.color}40`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.375rem", boxShadow: `0 0 24px ${s.color}20` }}>
                      {s.icon}
                    </div>
                    <div style={{ fontSize: "0.6875rem", fontWeight: 800, color: "#fff", letterSpacing: "-0.02em", textAlign: "center" }}>{s.step}</div>
                    <div style={{ fontSize: "0.5rem", color: "rgba(255,255,255,0.35)", textAlign: "center", lineHeight: 1.45, maxWidth: "90px" }}>{s.desc}</div>
                    <div style={{ width: 20, height: 20, borderRadius: "50%", background: `${s.color}20`, border: `1px solid ${s.color}35`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ fontSize: "0.5rem", color: s.color, fontWeight: 800 }}>{i + 1}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginTop: "3rem" }}>
              {[
                { t: "Havi és éves csomagok", d: "Rugalmas előfizetési időszakok automatikus megújítással", c: "#8b5cf6" },
                { t: "Próbaidőszak és kuponok", d: "Próbaidőszakok, kedvezménykódok, promóciós kampányok", c: "#3b82f6" },
                { t: "Ügyfélportál", d: "Önkiszolgáló előfizetés-kezelés közvetlenül a felhasználónak", c: "#22c55e" },
                { t: "Sikertelen fizetések kezelése", d: "Automatikus újrapróbálkozás és fizetési emlékeztetők", c: "#f59e0b" },
              ].map((item) => (
                <div key={item.t} style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "1rem", padding: "1.125rem" }}>
                  <div style={{ fontSize: "0.875rem", fontWeight: 700, color: item.c, marginBottom: "0.4rem" }}>{item.t}</div>
                  <div style={{ fontSize: "0.8125rem", color: "rgba(255,255,255,0.35)", lineHeight: 1.6 }}>{item.d}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══ 10. WEBSHOP ═══════════════════════════════════════════════════════ */}
      <section style={{ background: "#f8f9fb", padding: "6rem 1.5rem" }}>
        <div style={{ maxWidth: "76rem", margin: "0 auto" }}>
          <Reveal>
            <div style={{ marginBottom: "3rem" }}>
              <SectionLabel color="#f59e0b">Webáruház</SectionLabel>
              <h2 style={{ fontSize: "clamp(1.75rem, 3vw, 2.5rem)", fontWeight: 800, letterSpacing: "-0.045em", color: "#0f1117", margin: "0 0 0.875rem", lineHeight: 1.15 }}>
                Saját webáruház. Digitális és fizikai termékek.
              </h2>
              <p style={{ fontSize: "1rem", color: "#6e6e80", maxWidth: "520px", lineHeight: 1.75 }}>
                A PerformanceVD saját webáruháza Stripe fizetéssel, Webshippy integrációval, kuponkezeléssel és automatizált rendelési folyamatokkal működik — egyetlen összehangolt rendszerben.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <WebshopMockup />
          </Reveal>
        </div>
      </section>

      {/* ══ 11. FEATURE MATRIX ════════════════════════════════════════════════ */}
      <section style={{ background: "#0a0c12", padding: "6rem 1.5rem" }}>
        <div style={{ maxWidth: "76rem", margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: "3rem" }}>
              <SectionLabel color="#3b82f6">Funkciók áttekintése</SectionLabel>
              <h2 style={{ fontSize: "clamp(1.75rem, 3vw, 2.5rem)", fontWeight: 800, letterSpacing: "-0.045em", color: "#fff", margin: "0 0 0.875rem" }}>
                Mi van megvalósítva. Hol érhető el.
              </h2>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "1.25rem", overflow: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "'Inter',sans-serif" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                    <th style={{ padding: "1rem 1.25rem", textAlign: "left", fontSize: "0.7rem", color: "rgba(255,255,255,0.35)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", minWidth: "180px" }}>Funkció</th>
                    {MATRIX_MODULES.map((m) => (
                      <th key={m.name} style={{ padding: "1rem 0.75rem", textAlign: "center", fontSize: "0.65rem", color: m.color, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em", whiteSpace: "pre-line", lineHeight: 1.35 }}>{m.name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {MATRIX_FEATURES.map((feat, fi) => (
                    <tr key={feat} style={{ borderBottom: fi < MATRIX_FEATURES.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none", background: fi % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)" }}>
                      <td style={{ padding: "0.75rem 1.25rem", fontSize: "0.8125rem", color: "rgba(255,255,255,0.6)", fontWeight: 500 }}>{feat}</td>
                      {MATRIX_DATA[fi].map((has, mi) => (
                        <td key={mi} style={{ padding: "0.75rem", textAlign: "center" }}>
                          {has ? (
                            <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 22, height: 22, borderRadius: "50%", background: `${MATRIX_MODULES[mi].color}18`, border: `1px solid ${MATRIX_MODULES[mi].color}35` }}>
                              <Check size={11} color={MATRIX_MODULES[mi].color} strokeWidth={2.5} />
                            </span>
                          ) : (
                            <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 22, height: 22 }}>
                              <span style={{ width: 8, height: 1.5, background: "rgba(255,255,255,0.12)", borderRadius: "9999px" }} />
                            </span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══ 12. TECH STACK ════════════════════════════════════════════════════ */}
      <section style={{ background: "#0d1117", padding: "6rem 1.5rem", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        <div style={{ maxWidth: "76rem", margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
              <SectionLabel color="#f59e0b">Technológiai verem</SectionLabel>
              <h2 style={{ fontSize: "clamp(1.75rem, 3vw, 2.5rem)", fontWeight: 800, letterSpacing: "-0.045em", color: "#fff", margin: 0 }}>
                Modern eszközök. Gondosan kiválasztva.
              </h2>
            </div>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1rem" }}>
            {TECH_CATS.map((cat, i) => (
              <Reveal key={cat.cat} delay={i * 0.06}>
                <div style={{ background: "rgba(255,255,255,0.025)", border: `1px solid ${cat.color}20`, borderRadius: "1.125rem", padding: "1.375rem", height: "100%" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "1rem" }}>
                    <div style={{ width: 36, height: 36, borderRadius: "0.625rem", background: `${cat.color}14`, border: `1px solid ${cat.color}28`, display: "flex", alignItems: "center", justifyContent: "center", color: cat.color }}>
                      {cat.icon}
                    </div>
                    <span style={{ fontSize: "0.9375rem", fontWeight: 750, color: "#fff", letterSpacing: "-0.02em" }}>{cat.cat}</span>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem" }}>
                    {cat.techs.map((t) => (
                      <span key={t} style={{ fontSize: "0.7375rem", fontWeight: 600, color: cat.color, background: `${cat.color}12`, border: `1px solid ${cat.color}24`, borderRadius: "0.5rem", padding: "0.25rem 0.625rem" }}>{t}</span>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 13. DEV TIMELINE ══════════════════════════════════════════════════ */}
      <section style={{ background: "#fff", padding: "6rem 1.5rem" }}>
        <div style={{ maxWidth: "56rem", margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
              <SectionLabel color="#3b82f6">A fejlesztés folyamata</SectionLabel>
              <h2 style={{ fontSize: "clamp(1.75rem, 3vw, 2.5rem)", fontWeight: 800, letterSpacing: "-0.045em", color: "#0f1117", margin: "0 0 0.875rem" }}>
                Egy platform. Ezer fejlesztési óra.
              </h2>
              <p style={{ fontSize: "1rem", color: "#6e6e80", maxWidth: "440px", margin: "0 auto", lineHeight: 1.75 }}>
                Kutatástól az éles üzemeltetésig — minden fázis gondos tervezéssel, iteratív fejlesztéssel és alapos teszteléssel.
              </p>
            </div>
          </Reveal>
          <div style={{ position: "relative" }}>
            <div style={{ position: "absolute", left: "19px", top: "24px", bottom: "24px", width: "2px", background: "linear-gradient(180deg, #3b82f6, #8b5cf6, #22c55e, #f59e0b, #ef4444, #8b5cf6)", borderRadius: "9999px", opacity: 0.3 }} />
            {DEV_TIMELINE.map((step, i) => (
              <Reveal key={step.phase} delay={i * 0.04}>
                <div style={{ display: "flex", gap: "1.5rem", paddingBottom: i < DEV_TIMELINE.length - 1 ? "1.5rem" : 0, alignItems: "flex-start" }}>
                  <div style={{ flexShrink: 0, width: 40, height: 40, borderRadius: "50%", background: `${step.color}12`, border: `2px solid ${step.color}40`, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", zIndex: 1 }}>
                    <span style={{ fontSize: "0.65rem", fontWeight: 800, color: step.color }}>{i + 1}</span>
                  </div>
                  <div style={{ paddingTop: "0.625rem", flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "0.25rem" }}>
                      <span style={{ fontSize: "0.9375rem", fontWeight: 750, color: "#0f1117", letterSpacing: "-0.02em" }}>{step.phase}</span>
                      {i === DEV_TIMELINE.length - 1 && (
                        <span style={{ fontSize: "0.6rem", background: "#f0fdf4", color: "#22c55e", border: "1px solid #bbf7d0", borderRadius: "9999px", padding: "0.125rem 0.5rem", fontWeight: 700 }}>Folyamatban</span>
                      )}
                    </div>
                    <p style={{ fontSize: "0.875rem", color: "#6e6e80", margin: 0, lineHeight: 1.65 }}>{step.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 14. NEXT PROJECT ══════════════════════════════════════════════════ */}
      <section style={{ background: "#0d1117", padding: "2rem 1.5rem", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ maxWidth: "76rem", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <div style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.25)", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "0.25rem" }}>Következő projekt</div>
            <div style={{ fontSize: "1rem", fontWeight: 700, color: "#fff", letterSpacing: "-0.025em" }}>Infrastructure & Deployment System</div>
          </div>
          <button onClick={() => navigate("/projektek/motocosmos")} style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "rgba(255,255,255,0.06)", color: "#fff", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "0.75rem", padding: "0.75rem 1.25rem", fontSize: "0.875rem", fontWeight: 600, cursor: "pointer" }}>
            Megnézem <ArrowRight size={15} />
          </button>
        </div>
      </section>

      {/* ══ 15. CTA ═══════════════════════════════════════════════════════════ */}
      <section style={{ background: "linear-gradient(160deg, #080a10 0%, #0d1220 100%)", padding: "7rem 1.5rem", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "700px", height: "700px", borderRadius: "50%", background: "radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: "52rem", margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
          <Reveal>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.5rem" }}>
              <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "#60a5fa", background: "rgba(59,130,246,0.12)", border: "1px solid rgba(59,130,246,0.25)", borderRadius: "9999px", padding: "0.375rem 1rem", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                Hasonló projektet tervezel?
              </span>
            </div>
            <h2 style={{ fontSize: "clamp(2rem, 4.5vw, 3.75rem)", fontWeight: 900, letterSpacing: "-0.055em", lineHeight: 1.08, color: "#fff", margin: "0 0 1.25rem" }}>
              Építsük meg együtt a te platformodat.
            </h2>
            <p style={{ fontSize: "1.125rem", color: "rgba(255,255,255,0.45)", lineHeight: 1.8, margin: "0 auto 2.75rem", maxWidth: "480px" }}>
              Legyen szó SaaS-ről, előfizetéses platformról, mobil appról vagy összetett ökoszisztémáról — megtaláljuk a legjobb technikai megoldást, és végigviszük a megvalósítást.
            </p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              <button onClick={scrollToContact} style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "linear-gradient(90deg, #3b82f6, #2563eb)", color: "#fff", border: "none", borderRadius: "0.875rem", padding: "1rem 2rem", fontSize: "1rem", fontWeight: 700, cursor: "pointer", boxShadow: "0 8px 28px rgba(59,130,246,0.42)" }}>
                Kérj szakmai konzultációt <ArrowRight size={18} />
              </button>
              <button onClick={() => navigate("/")} style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.65)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "0.875rem", padding: "1rem 2rem", fontSize: "1rem", fontWeight: 600, cursor: "pointer" }}>
                Vissza a főoldalra
              </button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Footer */}
      <div style={{ background: "#060810", borderTop: "1px solid rgba(255,255,255,0.04)", padding: "1.5rem", textAlign: "center" }}>
        <span style={{ fontSize: "0.8125rem", color: "rgba(255,255,255,0.18)", fontWeight: 500 }}>© 2026 Jandl Dávid · Technikai partner</span>
      </div>
    </div>
  );
}
