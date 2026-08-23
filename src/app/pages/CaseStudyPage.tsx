import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "motion/react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  TrendingUp,
  Shield,
  Server,
  Activity,
  Lock,
  Eye,
  CheckCircle,
  AlertCircle,
  ShieldCheck,
  Cloud,
  Zap,
} from "lucide-react";
import { scrollToContact, scrollToContactAndConsult } from "../utils/navigation";

// ─── Shared reveal ────────────────────────────────────────────────────────────

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}

// ─── Mockup: Analytics Dashboard ─────────────────────────────────────────────

const SPARKLINE = [32, 48, 38, 62, 54, 78, 68, 88, 72, 95, 84, 100];

function AnalyticsMockup() {
  const max = Math.max(...SPARKLINE);
  const pts = SPARKLINE.map((v, i) => `${(i / (SPARKLINE.length - 1)) * 320},${60 - (v / max) * 56}`).join(" ");
  const area = `0,60 ${pts} 320,60`;

  return (
    <div style={{ background: "#0f1117", borderRadius: "1.25rem", overflow: "hidden", boxShadow: "0 24px 64px rgba(0,0,0,0.3)", fontFamily: "'Inter',sans-serif" }}>
      <div style={{ background: "#1a1d27", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "0.625rem 1rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
        {["#ef4444","#f59e0b","#22c55e"].map((c) => <span key={c} style={{ width: 9, height: 9, borderRadius: "50%", background: c, opacity: 0.65 }} />)}
        <span style={{ flex: 1, textAlign: "center", fontSize: "0.6875rem", color: "rgba(255,255,255,0.28)" }}>analytics.platform.app</span>
      </div>
      <div style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "0.5rem" }}>
          {[{l:"MRR",v:"€94.2K",d:"+18.4%",c:"#22c55e"},{l:"DAU",v:"12,480",d:"+9.2%",c:"#3b82f6"},{l:"Churn",v:"0.8%",d:"-0.3%",c:"#22c55e"}].map((k)=>(
            <div key={k.l} style={{ background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:"0.75rem",padding:"0.75rem" }}>
              <div style={{ fontSize:"0.575rem",color:"rgba(255,255,255,0.35)",letterSpacing:"0.07em",textTransform:"uppercase",marginBottom:"0.25rem" }}>{k.l}</div>
              <div style={{ fontSize:"1.0625rem",fontWeight:750,color:"#fff",letterSpacing:"-0.04em",marginBottom:"0.2rem" }}>{k.v}</div>
              <div style={{ fontSize:"0.6875rem",color:k.c,fontWeight:600 }}>{k.d}</div>
            </div>
          ))}
        </div>
        <div style={{ background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:"0.875rem",padding:"1rem" }}>
          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"0.75rem" }}>
            <div>
              <div style={{ fontSize:"0.6rem",color:"rgba(255,255,255,0.32)",letterSpacing:"0.06em",textTransform:"uppercase" }}>Revenue trend</div>
              <div style={{ fontSize:"1.125rem",fontWeight:750,color:"#fff",letterSpacing:"-0.04em" }}>€94,240</div>
            </div>
            <span style={{ fontSize:"0.7rem",background:"rgba(34,197,94,0.14)",color:"#22c55e",padding:"0.25rem 0.625rem",borderRadius:"9999px",fontWeight:650 }}>+18.4% ↑</span>
          </div>
          <svg width="100%" viewBox="0 0 320 64" preserveAspectRatio="none" style={{ display:"block" }}>
            <defs><linearGradient id="ag" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#22c55e" stopOpacity="0.28"/><stop offset="100%" stopColor="#22c55e" stopOpacity="0"/></linearGradient></defs>
            <polygon points={area} fill="url(#ag)"/>
            <polyline points={pts} fill="none" stroke="#22c55e" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round"/>
            <circle cx="320" cy={60-(SPARKLINE[SPARKLINE.length-1]/max)*56} r="3.5" fill="#22c55e"/>
          </svg>
        </div>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.5rem" }}>
          {[{l:"Active users",v:"247 online",c:"#22c55e"},{l:"API calls/min",v:"1,842",c:"#3b82f6"}].map((r)=>(
            <div key={r.l} style={{ background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:"0.75rem",padding:"0.75rem" }}>
              <div style={{ fontSize:"0.575rem",color:"rgba(255,255,255,0.32)",letterSpacing:"0.05em",textTransform:"uppercase" }}>{r.l}</div>
              <div style={{ fontSize:"0.875rem",fontWeight:700,color:r.c,letterSpacing:"-0.025em" }}>{r.v}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Mockup: Terminal ─────────────────────────────────────────────────────────

const DEPLOY_LOG = [
  {c:"rgba(255,255,255,0.55)",v:"$ git push origin main"},
  {c:"rgba(255,255,255,0.35)",v:"Triggering CI pipeline..."},
  {c:"#22c55e",v:"✓ Tests passed (48/48)"},
  {c:"#22c55e",v:"✓ Docker image built"},
  {c:"#22c55e",v:"✓ Pushed to registry"},
  {c:"rgba(255,255,255,0.55)",v:"$ deploying to production"},
  {c:"#22c55e",v:"✓ Health check passed"},
  {c:"#4ade80",v:"✓ Deployment successful 🚀"},
];

function TerminalMockup() {
  return (
    <div style={{ background:"#0c0e14",borderRadius:"1.125rem",overflow:"hidden",boxShadow:"0 16px 48px rgba(0,0,0,0.25)",border:"1px solid rgba(255,255,255,0.06)" }}>
      <div style={{ background:"#161820",borderBottom:"1px solid rgba(255,255,255,0.05)",padding:"0.575rem 1rem",display:"flex",alignItems:"center",gap:"0.4rem" }}>
        {["#ef4444","#f59e0b","#22c55e"].map((c)=><span key={c} style={{ width:8,height:8,borderRadius:"50%",background:c,opacity:0.65 }}/>)}
        <span style={{ marginLeft:"0.5rem",fontSize:"0.6875rem",color:"rgba(255,255,255,0.28)",fontFamily:"monospace" }}>CI/CD — deploy</span>
      </div>
      <div style={{ padding:"1rem 1.125rem",display:"flex",flexDirection:"column",gap:"0.3rem" }}>
        {DEPLOY_LOG.map((l,i)=><div key={i} style={{ fontFamily:"monospace",fontSize:"0.75rem",color:l.c,lineHeight:1.6 }}>{l.v}</div>)}
        <div style={{ display:"flex",alignItems:"center",gap:"0.25rem",marginTop:"0.1rem" }}>
          <span style={{ fontFamily:"monospace",fontSize:"0.75rem",color:"rgba(255,255,255,0.4)" }}>$ </span>
          <span style={{ width:"7px",height:"13px",background:"#22c55e",borderRadius:"1px",opacity:0.85,animation:"blinkCursor 1.1s steps(1) infinite" }}/>
        </div>
      </div>
    </div>
  );
}

// ─── Mockup: Security ─────────────────────────────────────────────────────────

const AUDIT_ITEMS = [
  {l:"SQL Injection",ok:true},{l:"XSS Protection",ok:true},
  {l:"CSRF Tokens",ok:true},{l:"Rate Limiting",ok:true},
  {l:"Auth Tokens",ok:true},{l:"HTTPS Enforced",ok:true},
];

function SecurityMockup() {
  const r=30, circ=2*Math.PI*r;
  return (
    <div style={{ display:"flex",flexDirection:"column",gap:"0.75rem" }}>
      <div style={{ background:"#fff",border:"1px solid rgba(0,0,0,0.07)",borderRadius:"1.125rem",padding:"1.25rem",boxShadow:"0 4px 16px rgba(0,0,0,0.05)",display:"flex",alignItems:"center",gap:"1.25rem" }}>
        <div style={{ position:"relative",flexShrink:0 }}>
          <svg width="80" height="80" viewBox="0 0 80 80">
            <circle cx="40" cy="40" r={r} fill="none" stroke="#f0fdf4" strokeWidth="8"/>
            <circle cx="40" cy="40" r={r} fill="none" stroke="#22c55e" strokeWidth="8" strokeLinecap="round" strokeDasharray={`${circ*0.98} ${circ}`} transform="rotate(-90 40 40)"/>
          </svg>
          <div style={{ position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center" }}>
            <span style={{ fontSize:"1.25rem",fontWeight:800,color:"#0f1117",letterSpacing:"-0.05em",lineHeight:1 }}>98</span>
            <span style={{ fontSize:"0.55rem",color:"#9ca3af",fontWeight:700 }}>SCORE</span>
          </div>
        </div>
        <div>
          <div style={{ fontSize:"0.875rem",fontWeight:700,color:"#0f1117",marginBottom:"0.25rem" }}>Security Score</div>
          <div style={{ fontSize:"0.8125rem",color:"#22c55e",fontWeight:650,marginBottom:"0.5rem" }}>98% — Kiváló</div>
          <div style={{ display:"flex",gap:"0.375rem" }}>
            {["Auth","API","Server"].map(t=><span key={t} style={{ fontSize:"0.6875rem",fontWeight:600,background:"#f0fdf4",color:"#16a34a",border:"1px solid #bbf7d0",borderRadius:"9999px",padding:"0.2rem 0.5rem" }}>✓ {t}</span>)}
          </div>
        </div>
      </div>
      <div style={{ background:"#fff",border:"1px solid rgba(0,0,0,0.07)",borderRadius:"1.125rem",padding:"1rem 1.125rem",boxShadow:"0 4px 16px rgba(0,0,0,0.05)" }}>
        <div style={{ fontSize:"0.75rem",fontWeight:700,color:"#0f1117",marginBottom:"0.625rem",display:"flex",alignItems:"center",gap:"0.375rem" }}>
          <ShieldCheck size={13} color="#22c55e"/> Security Audit
        </div>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.35rem" }}>
          {AUDIT_ITEMS.map(a=>(
            <div key={a.l} style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0.4rem 0.625rem",background:"#fafffe",border:"1px solid rgba(34,197,94,0.1)",borderRadius:"0.5rem" }}>
              <span style={{ fontSize:"0.7rem",color:"#374151",fontWeight:500 }}>{a.l}</span>
              <CheckCircle size={12} color="#22c55e"/>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Case study data ──────────────────────────────────────────────────────────

const CASE_STUDIES: Record<string, {
  slug: string;
  category: string;
  categoryColor: string;
  categoryBg: string;
  title: string;
  tagline: string;
  overview: string;
  challenge: string;
  approach: string;
  solution: string;
  results: { icon: React.ReactNode; value: string; label: string; color: string }[];
  features: string[];
  techStack: { label: string; color: string; bg: string }[];
  mockup: React.ReactNode;
  mockupBg: string;
  nextSlug: string;
  nextTitle: string;
  accentColor: string;
}> = {
  "saas-dashboard-platform": {
    slug: "saas-dashboard-platform",
    category: "SaaS Platform",
    categoryColor: "#22c55e",
    categoryBg: "#f0fdf4",
    title: "SaaS Dashboard Platform",
    tagline: "Admin dashboard és automatizált backend rendszer modern analitikával és skálázható architektúrával.",
    overview: "Az ügyfél egy növekvő B2B SaaS vállalkozás volt, amely manuális folyamatokkal, áttekinthetetlen adminisztrációval és lassú riportolással küzdött. A cél egy komplex, valós idejű adatokat megjelenítő admin felület volt, amely egységes képet ad az üzleti folyamatokról.",
    challenge: "Az ügyfélnek nem volt egységes back-office eszköze. Az adatok különböző táblázatokban szétszórva, az értesítések e-mailben, a számlázás manuálisan történt. A csapat naponta órákat töltött ismétlődő adminisztrációval ahelyett, hogy az üzletre fókuszálhatott volna.",
    approach: "Az első lépés a folyamatok feltérképezése volt: hol töltik a legtöbb időt, mi ismétlődik, mi automatizálható. Ezután következett az adatmodell tervezése, majd a moduláris architektúra felépítése, amely az egyes funkciók egymástól független fejlesztését tette lehetővé.",
    solution: "Laravel alapú REST API backend, Vue.js reaktív frontend, Docker-alapú deployment és automatizált riportgenerálás. A rendszer napi 12 000+ felhasználói műveletet kezel stabilan, a riportok automatikusan generálódnak és küldődnek ki.",
    results: [
      { icon: <TrendingUp size={18}/>, value: "38%", label: "Gyorsabb munkavégzés", color: "#22c55e" },
      { icon: <Activity size={18}/>, value: "< 2s", label: "Válaszidő", color: "#3b82f6" },
      { icon: <Server size={18}/>, value: "99.9%", label: "Rendelkezésre állás", color: "#8b5cf6" },
    ],
    features: [
      "Valós idejű analitika és KPI dashboard",
      "Felhasználókezelés és szerepkörök",
      "Automatizált riportgenerálás és e-mail küldés",
      "API integráció külső rendszerekkel",
      "Kétfaktoros autentikáció",
      "Mobil optimalizált felület",
    ],
    techStack: [
      { label: "Laravel", color: "#ef4444", bg: "#fef2f2" },
      { label: "Vue.js", color: "#22c55e", bg: "#f0fdf4" },
      { label: "Docker", color: "#2496ED", bg: "#eff8ff" },
      { label: "MySQL", color: "#0f1117", bg: "#f3f4f6" },
      { label: "TypeScript", color: "#0f1117", bg: "#f3f4f6" },
      { label: "REST API", color: "#0f1117", bg: "#f3f4f6" },
    ],
    mockup: <AnalyticsMockup />,
    mockupBg: "#0f1117",
    accentColor: "#22c55e",
    nextSlug: "performancevd",
    nextTitle: "PerformanceVD",
  },
  "infrastructure-deployment-system": {
    slug: "infrastructure-deployment-system",
    category: "Infrastruktúra",
    categoryColor: "#3b82f6",
    categoryBg: "#eff6ff",
    title: "Infrastructure & Deployment System",
    tagline: "Modern CI/CD pipeline és monitoring rendszer cloud infrastruktúrához.",
    overview: "Egy technológiai startup csapata manuálisan deployolt, nem volt monitoring, backup vagy rollback lehetőség. Minden élesítés kockázatos és időigényes volt. A cél egy automatizált, biztonságos és visszafordítható deployment rendszer kialakítása volt.",
    challenge: "A csapat FTP-vel töltötte fel a fájlokat, a szerver konfigurációja nem volt verziókezelt, leállások esetén manuálisan kellett visszaállítani. Nem volt egységes staging környezet, így minden élesítés produkciós kockázatot jelentett.",
    approach: "Infrastructure as Code szemlélettel közelítettem meg a feladatot. Először a jelenlegi infrastruktúrát térképeztem fel, azonosítottam a kritikus pontokat, majd fokozatosan migráltam az egyes komponenseket — leállás nélkül.",
    solution: "Docker Compose alapú konténerizált infrastruktúra, GitHub Actions CI/CD pipeline, NGINX reverse proxy és Grafana monitoring. Az automatizált health check és rollback mechanizmus perceken belül visszaállítja a rendszert hiba esetén.",
    results: [
      { icon: <Server size={18}/>, value: "99.9%", label: "Rendelkezésre állás", color: "#3b82f6" },
      { icon: <Zap size={18}/>, value: "< 3 perc", label: "Deployment idő", color: "#22c55e" },
      { icon: <Cloud size={18}/>, value: "Napi", label: "Automatikus backup", color: "#8b5cf6" },
    ],
    features: [
      "Docker Compose production konfiguráció",
      "GitHub Actions CI/CD pipeline",
      "Automatizált health check és rollback",
      "NGINX reverse proxy és SSL",
      "Napi backup automatikusan S3-ra",
      "Valós idejű monitoring és alerting",
    ],
    techStack: [
      { label: "Docker", color: "#2496ED", bg: "#eff8ff" },
      { label: "Linux", color: "#0f1117", bg: "#f3f4f6" },
      { label: "NGINX", color: "#22c55e", bg: "#f0fdf4" },
      { label: "GitHub Actions", color: "#0f1117", bg: "#f3f4f6" },
      { label: "AWS EC2", color: "#FF9900", bg: "#fffbeb" },
      { label: "Traefik", color: "#3b82f6", bg: "#eff6ff" },
    ],
    mockup: <TerminalMockup />,
    mockupBg: "#0c0e14",
    accentColor: "#3b82f6",
    nextSlug: "security-first-platform",
    nextTitle: "Security-first Platform",
  },
  "security-first-platform": {
    slug: "security-first-platform",
    category: "Security",
    categoryColor: "#8b5cf6",
    categoryBg: "#faf5ff",
    title: "Security-first Platform",
    tagline: "Biztonságközpontú autentikációs és API védelmi rendszer.",
    overview: "Egy meglévő platform biztonsági audit során kritikus sérülékenységeket tártunk fel: lejárat nélküli JWT tokeneket, ratelimiting hiányát és szerver-szintű keményítés teljes hiányát. A projekt célja a rendszer valódi biztonsági szintjének emelése volt — nem csak látszólag.",
    challenge: "A rendszer nem állt volna ki egy komoly biztonsági auditot: a tokenek nem jártak le, az API-k nem voltak rate-limitálva, az inputok nem voltak validálva. Adatszivárgás esetén az egész felhasználói adatbázis veszélybe kerülhetett volna.",
    approach: "Teljes biztonsági audit elvégzése az OWASP Top 10 alapján. Minden megtalált sérülékenységet priorizáltam kockázat szerint, majd rétegesen implementáltam a javításokat — úgy, hogy a production rendszer közben tovább működjön.",
    solution: "MFA implementáció, JWT access + refresh token rendszer, API rate limiting, input validáció és sanitizáció, server hardening, teljes audit log. A rendszer a javítások után 98%-os biztonsági pontszámot ért el.",
    results: [
      { icon: <Shield size={18}/>, value: "98%", label: "Biztonsági pontszám", color: "#8b5cf6" },
      { icon: <Lock size={18}/>, value: "0", label: "Nyitott sérülékenység", color: "#22c55e" },
      { icon: <Eye size={18}/>, value: "Audit", label: "Kész", color: "#3b82f6" },
    ],
    features: [
      "Kétfaktoros autentikáció (MFA)",
      "JWT access + refresh token rendszer",
      "API rate limiting és IP allowlist",
      "Input validáció és XSS védelem",
      "Server szintű hardening",
      "Teljes audit log és monitoring",
    ],
    techStack: [
      { label: "JWT + Refresh", color: "#8b5cf6", bg: "#faf5ff" },
      { label: "OAuth 2.0", color: "#0f1117", bg: "#f3f4f6" },
      { label: "MFA", color: "#0f1117", bg: "#f3f4f6" },
      { label: "Rate Limiting", color: "#22c55e", bg: "#f0fdf4" },
      { label: "Server Hardening", color: "#ef4444", bg: "#fef2f2" },
      { label: "Monitoring", color: "#3b82f6", bg: "#eff6ff" },
    ],
    mockup: <SecurityMockup />,
    mockupBg: "#f9fafb",
    accentColor: "#8b5cf6",
    nextSlug: "performancevd",
    nextTitle: "PerformanceVD",
  },
};

// ─── Page component ───────────────────────────────────────────────────────────

export default function CaseStudyPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const cs = slug ? CASE_STUDIES[slug] : null;

  if (!cs) {
    return (
      <div style={{ minHeight: "100vh", background: "#fff", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "'Inter', sans-serif", gap: "1rem" }}>
        <div style={{ fontSize: "3rem", fontWeight: 800, color: "#0f1117", letterSpacing: "-0.05em" }}>404</div>
        <p style={{ color: "#6e6e80" }}>Ez a projekt nem található.</p>
        <button onClick={() => navigate("/")} style={{ background: "#22c55e", color: "#fff", border: "none", borderRadius: "0.75rem", padding: "0.75rem 1.5rem", fontSize: "0.9375rem", fontWeight: 700, cursor: "pointer" }}>Vissza a főoldalra</button>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#fff", fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}>

      {/* ── Nav ────────────────────────────────────────────────────────────── */}
      <CaseStudyNav navigate={navigate} accentColor={cs.accentColor} />

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section style={{ background: `linear-gradient(160deg, ${cs.categoryBg} 0%, #ffffff 60%)`, padding: "5rem 1.5rem 4rem", borderBottom: "1px solid rgba(0,0,0,0.055)" }}>
        <div style={{ maxWidth: "72rem", margin: "0 auto" }}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Breadcrumb */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.75rem", flexWrap: "wrap" }}>
              <button onClick={() => navigate("/")} style={{ fontSize: "0.8125rem", color: "#9ca3af", background: "none", border: "none", cursor: "pointer", fontWeight: 500, padding: 0, transition: "color 0.15s" }} onMouseEnter={(e)=>(e.currentTarget.style.color="#0f1117")} onMouseLeave={(e)=>(e.currentTarget.style.color="#9ca3af")}>
                Főoldal
              </button>
              <span style={{ fontSize: "0.8125rem", color: "#d1d5db" }}>/</span>
              <button onClick={() => { navigate("/"); setTimeout(()=>{ const el=document.getElementById("section-projects"); if(el) el.scrollIntoView({behavior:"smooth"}); },120); }} style={{ fontSize: "0.8125rem", color: "#9ca3af", background: "none", border: "none", cursor: "pointer", fontWeight: 500, padding: 0, transition: "color 0.15s" }} onMouseEnter={(e)=>(e.currentTarget.style.color="#0f1117")} onMouseLeave={(e)=>(e.currentTarget.style.color="#9ca3af")}>
                Projektek
              </button>
              <span style={{ fontSize: "0.8125rem", color: "#d1d5db" }}>/</span>
              <span style={{ fontSize: "0.8125rem", color: "#374151", fontWeight: 500 }}>{cs.title}</span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "center" }} className="cs-hero-grid">
              {/* Text */}
              <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                <span style={{ display: "inline-flex", alignItems: "center", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase", color: cs.categoryColor, background: cs.categoryBg, border: `1px solid ${cs.categoryColor}28`, borderRadius: "9999px", padding: "0.3rem 0.875rem", width: "fit-content" }}>
                  {cs.category}
                </span>
                <h1 style={{ fontSize: "clamp(2rem, 3.5vw, 3rem)", fontWeight: 800, letterSpacing: "-0.045em", lineHeight: 1.12, color: "#0f1117", margin: 0 }}>
                  {cs.title}
                </h1>
                <p style={{ fontSize: "1.0625rem", color: "#6e6e80", lineHeight: 1.75, margin: 0 }}>{cs.tagline}</p>

                {/* Result pills */}
                <div style={{ display: "flex", gap: "0.875rem", flexWrap: "wrap" }}>
                  {cs.results.map((r) => (
                    <div key={r.label} style={{ display: "flex", flexDirection: "column", padding: "0.875rem 1.125rem", background: "#fff", border: "1px solid rgba(0,0,0,0.07)", borderRadius: "1rem", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", minWidth: "90px" }}>
                      <span style={{ fontSize: "1.375rem", fontWeight: 800, color: r.color, letterSpacing: "-0.05em", lineHeight: 1 }}>{r.value}</span>
                      <span style={{ fontSize: "0.75rem", color: "#9ca3af", fontWeight: 500, marginTop: "0.2rem" }}>{r.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mockup preview */}
              <div style={{ background: cs.mockupBg, borderRadius: "1.375rem", padding: "1.75rem", boxShadow: "0 8px 32px rgba(0,0,0,0.1)", minHeight: "280px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {cs.mockup}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Content ────────────────────────────────────────────────────────── */}
      <div style={{ maxWidth: "72rem", margin: "0 auto", padding: "5rem 1.5rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem" }} className="cs-content-grid">

          {/* Left col */}
          <div style={{ display: "flex", flexDirection: "column", gap: "3rem" }}>
            <Reveal>
              <ContentBlock title="Áttekintés" accentColor={cs.accentColor}>
                <p style={{ fontSize: "1.0625rem", color: "#374151", lineHeight: 1.78, margin: 0 }}>{cs.overview}</p>
              </ContentBlock>
            </Reveal>

            <Reveal delay={0.08}>
              <ContentBlock title="A kihívás" accentColor="#ef4444">
                <div style={{ padding: "1.125rem 1.375rem", background: "#fef2f2", border: "1px solid rgba(239,68,68,0.12)", borderRadius: "1rem", borderLeft: "3px solid #ef4444" }}>
                  <p style={{ fontSize: "1rem", color: "#374151", lineHeight: 1.72, margin: 0 }}>{cs.challenge}</p>
                </div>
              </ContentBlock>
            </Reveal>

            <Reveal delay={0.12}>
              <ContentBlock title="Megközelítés" accentColor={cs.accentColor}>
                <p style={{ fontSize: "1.0625rem", color: "#374151", lineHeight: 1.78, margin: 0 }}>{cs.approach}</p>
              </ContentBlock>
            </Reveal>

            <Reveal delay={0.16}>
              <ContentBlock title="Megoldás" accentColor={cs.accentColor}>
                <div style={{ padding: "1.125rem 1.375rem", background: `${cs.categoryBg}`, border: `1px solid ${cs.accentColor}18`, borderRadius: "1rem", borderLeft: `3px solid ${cs.accentColor}` }}>
                  <p style={{ fontSize: "1rem", color: "#374151", lineHeight: 1.72, margin: 0 }}>{cs.solution}</p>
                </div>
              </ContentBlock>
            </Reveal>
          </div>

          {/* Right col */}
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            <Reveal delay={0.05}>
              <div style={{ background: "#fafafa", border: "1px solid rgba(0,0,0,0.07)", borderRadius: "1.25rem", padding: "1.75rem", boxShadow: "0 4px 20px rgba(0,0,0,0.04)" }}>
                <div style={{ fontSize: "0.6875rem", fontWeight: 750, color: "#9ca3af", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "1.125rem" }}>Megvalósított funkciók</div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
                  {cs.features.map((f) => (
                    <div key={f} style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.75rem 1rem", background: "#fff", border: "1px solid rgba(0,0,0,0.06)", borderRadius: "0.875rem" }}>
                      <span style={{ width: "18px", height: "18px", borderRadius: "50%", background: "#f0fdf4", border: "1.5px solid #bbf7d0", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <Check size={9} color="#22c55e" strokeWidth={3} />
                      </span>
                      <span style={{ fontSize: "0.9rem", color: "#374151", fontWeight: 500 }}>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div style={{ background: "#fafafa", border: "1px solid rgba(0,0,0,0.07)", borderRadius: "1.25rem", padding: "1.75rem", boxShadow: "0 4px 20px rgba(0,0,0,0.04)" }}>
                <div style={{ fontSize: "0.6875rem", fontWeight: 750, color: "#9ca3af", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "1rem" }}>Technológiák</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem" }}>
                  {cs.techStack.map((t) => (
                    <span key={t.label} style={{ fontSize: "0.75rem", fontWeight: 650, color: t.color, background: t.bg, border: `1px solid ${t.color}22`, borderRadius: "9999px", padding: "0.35rem 0.875rem" }}>
                      {t.label}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>

            {/* Results deep-dive */}
            <Reveal delay={0.15}>
              <div style={{ background: "linear-gradient(145deg, #0f1117 0%, #1a1d27 100%)", borderRadius: "1.25rem", padding: "1.75rem", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", width: "200px", height: "200px", borderRadius: "50%", background: `radial-gradient(circle, ${cs.accentColor}14 0%, transparent 70%)`, top: "-60px", right: "-20px", pointerEvents: "none" }} />
                <div style={{ fontSize: "0.6875rem", fontWeight: 750, color: "rgba(255,255,255,0.35)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "1.25rem" }}>Eredmények</div>
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem", position: "relative", zIndex: 1 }}>
                  {cs.results.map((r) => (
                    <div key={r.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.875rem 1rem", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "0.875rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
                        <span style={{ color: r.color }}>{r.icon}</span>
                        <span style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.65)", fontWeight: 500 }}>{r.label}</span>
                      </div>
                      <span style={{ fontSize: "1.125rem", fontWeight: 800, color: r.color, letterSpacing: "-0.04em" }}>{r.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>

        {/* ── Next project ── */}
        <Reveal delay={0.1}>
          <div style={{ marginTop: "5rem", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1.5rem", padding: "2rem 2.5rem", background: "#f9f9fb", border: "1px solid rgba(0,0,0,0.065)", borderRadius: "1.375rem" }}>
            <div>
              <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#9ca3af", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "0.375rem" }}>Következő projekt</div>
              <div style={{ fontSize: "1.125rem", fontWeight: 750, color: "#0f1117", letterSpacing: "-0.03em" }}>{cs.nextTitle}</div>
            </div>
            <button
              onClick={() => navigate(`/projektek/${cs.nextSlug}`)}
              style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "#0f1117", color: "#fff", border: "none", borderRadius: "0.875rem", padding: "0.875rem 1.625rem", fontSize: "0.9375rem", fontWeight: 700, cursor: "pointer", letterSpacing: "-0.02em", transition: "all 0.15s", boxShadow: "0 4px 16px rgba(0,0,0,0.12)" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#22c55e"; e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(34,197,94,0.35)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "#0f1117"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.12)"; }}
            >
              Megnézem <ArrowRight size={15} />
            </button>
          </div>
        </Reveal>
      </div>

      {/* ── CTA ────────────────────────────────────────────────────────────── */}
      <section style={{ background: "#f9f9fb", borderTop: "1px solid rgba(0,0,0,0.055)", padding: "5rem 1.5rem" }}>
        <div style={{ maxWidth: "72rem", margin: "0 auto" }}>
          <Reveal>
            <div style={{
              background: "linear-gradient(135deg, #0f1117 0%, #1a1d27 100%)",
              borderRadius: "1.75rem",
              padding: "clamp(2.5rem,5vw,3.5rem)",
              display: "flex", alignItems: "center", justifyContent: "space-between",
              gap: "2rem", flexWrap: "wrap",
              position: "relative", overflow: "hidden",
              boxShadow: "0 24px 64px rgba(0,0,0,0.2)",
            }}>
              <div style={{ position: "absolute", width: "400px", height: "400px", borderRadius: "50%", background: "radial-gradient(circle, rgba(34,197,94,0.09) 0%, transparent 70%)", top: "-120px", right: "60px", pointerEvents: "none" }} />
              <div style={{ position: "absolute", top: "1.5rem", left: "2.25rem", fontSize: "5.5rem", lineHeight: 1, color: "rgba(34,197,94,0.07)", fontFamily: "Georgia,serif", fontWeight: 900, pointerEvents: "none", userSelect: "none" }}>"</div>

              <div style={{ maxWidth: "480px", position: "relative", zIndex: 1 }}>
                <p style={{ fontSize: "clamp(1.25rem,2.2vw,1.625rem)", fontWeight: 800, color: "#fff", letterSpacing: "-0.04em", lineHeight: 1.3, margin: "0 0 0.75rem" }}>
                  Hasonló megoldást keresel a{" "}
                  <span style={{ color: "#22c55e" }}>vállalkozásodhoz?</span>
                </p>
                <p style={{ fontSize: "1rem", color: "rgba(255,255,255,0.45)", lineHeight: 1.65, margin: 0 }}>
                  Találjuk meg együtt a legmegfelelőbb technikai megoldást.
                </p>
              </div>

              <div style={{ display: "flex", gap: "0.875rem", flexWrap: "wrap", position: "relative", zIndex: 1 }}>
                <button
                  onClick={() => { navigate("/"); setTimeout(scrollToContact, 120); }}
                  style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "#22c55e", color: "#fff", border: "none", borderRadius: "0.875rem", padding: "0.9375rem 1.75rem", fontSize: "0.9375rem", fontWeight: 700, cursor: "pointer", letterSpacing: "-0.025em", boxShadow: "0 4px 20px rgba(34,197,94,0.35)", transition: "all 0.15s" }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "#16a34a"; e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 6px 28px rgba(34,197,94,0.45)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "#22c55e"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(34,197,94,0.35)"; }}
                >
                  Indítsük el a fejlesztést <ArrowRight size={15} />
                </button>
                <button
                  onClick={() => { navigate("/"); setTimeout(scrollToContactAndConsult, 120); }}
                  style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "transparent", color: "rgba(255,255,255,0.6)", border: "1.5px solid rgba(255,255,255,0.15)", borderRadius: "0.875rem", padding: "0.9375rem 1.5rem", fontSize: "0.9375rem", fontWeight: 650, cursor: "pointer", letterSpacing: "-0.02em", transition: "all 0.15s" }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(34,197,94,0.5)"; e.currentTarget.style.color = "#22c55e"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"; e.currentTarget.style.color = "rgba(255,255,255,0.6)"; e.currentTarget.style.transform = "translateY(0)"; }}
                >
                  Kérj szakmai konzultációt
                </button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <style>{`
        @keyframes blinkCursor { 0%,100%{opacity:1}50%{opacity:0} }
        * { -webkit-font-smoothing:antialiased; }
        html { scrollbar-width:none; }
        html::-webkit-scrollbar { display:none; }
        @media(max-width:900px) {
          .cs-hero-grid { grid-template-columns:1fr !important; gap:2.5rem !important; }
          .cs-content-grid { grid-template-columns:1fr !important; gap:2.5rem !important; }
        }
      `}</style>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function CaseStudyNav({ navigate, accentColor }: { navigate: ReturnType<typeof useNavigate>; accentColor: string }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <nav style={{ position:"sticky",top:0,zIndex:50,background:scrolled?"rgba(255,255,255,0.88)":"transparent",backdropFilter:scrolled?"blur(20px)":"none",WebkitBackdropFilter:scrolled?"blur(20px)":"none",borderBottom:scrolled?"1px solid rgba(0,0,0,0.06)":"none",transition:"background 0.2s,border-color 0.2s" }}>
      <div style={{ maxWidth:"72rem",margin:"0 auto",padding:"0 1.5rem",height:"64px",display:"flex",alignItems:"center",justifyContent:"space-between" }}>
        <button onClick={()=>navigate("/")} style={{ background:"none",border:"none",cursor:"pointer",padding:0,textAlign:"left" }}>
          <div style={{ display:"flex",flexDirection:"column",lineHeight:1.1 }}>
            <span style={{ fontWeight:800,fontSize:"0.9375rem",letterSpacing:"-0.03em",color:"#0f1117" }}>Jandl Dávid</span>
            <span style={{ fontSize:"0.6875rem",fontWeight:600,color:"#22c55e",letterSpacing:"0.02em" }}>Technikai partner</span>
          </div>
        </button>
        <button
          onClick={()=>navigate(-1)}
          style={{ display:"flex",alignItems:"center",gap:"0.5rem",background:"none",border:"1.5px solid rgba(0,0,0,0.1)",borderRadius:"0.625rem",cursor:"pointer",color:"#6e6e80",fontSize:"0.875rem",fontWeight:600,padding:"0.4rem 0.875rem",transition:"all 0.15s" }}
          onMouseEnter={(e)=>{ e.currentTarget.style.borderColor=accentColor; e.currentTarget.style.color=accentColor; }}
          onMouseLeave={(e)=>{ e.currentTarget.style.borderColor="rgba(0,0,0,0.1)"; e.currentTarget.style.color="#6e6e80"; }}
        >
          <ArrowLeft size={14}/> Vissza a projektekhez
        </button>
        <button
          onClick={()=>{ navigate("/"); setTimeout(scrollToContact,120); }}
          style={{ fontSize:"0.875rem",fontWeight:650,color:"#fff",background:"#0f1117",padding:"0.5rem 1.25rem",borderRadius:"0.625rem",border:"none",cursor:"pointer",letterSpacing:"-0.01em",transition:"background 0.15s" }}
          onMouseEnter={(e)=>(e.currentTarget.style.background="#22c55e")}
          onMouseLeave={(e)=>(e.currentTarget.style.background="#0f1117")}
        >
          Lépjünk kapcsolatba
        </button>
      </div>
    </nav>
  );
}

function ContentBlock({ title, children, accentColor }: { title: string; children: React.ReactNode; accentColor: string }) {
  return (
    <div>
      <div style={{ display:"flex",alignItems:"center",gap:"0.625rem",marginBottom:"1rem" }}>
        <span style={{ width:"3px",height:"20px",background:accentColor,borderRadius:"9999px",display:"block" }}/>
        <span style={{ fontSize:"0.875rem",fontWeight:750,color:"#0f1117",letterSpacing:"-0.025em" }}>{title}</span>
      </div>
      {children}
    </div>
  );
}
