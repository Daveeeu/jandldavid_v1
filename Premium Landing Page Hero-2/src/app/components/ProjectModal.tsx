import { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Check, TrendingUp, Shield, Server, ExternalLink } from "lucide-react";

export interface ProjectModalData {
  id: string;
  category: string;
  categoryColor: string;
  categoryBg: string;
  title: string;
  subtitle: string;
  challenge: string;
  solution: string;
  results: { icon: React.ReactNode; value: string; label: string }[];
  techStack: { label: string; color: string; bg: string }[];
  features: string[];
  accentColor: string;
}

const MODAL_DATA: Record<string, ProjectModalData> = {
  saas: {
    id: "saas",
    category: "SaaS Platform",
    categoryColor: "#22c55e",
    categoryBg: "#f0fdf4",
    title: "SaaS Dashboard Platform",
    subtitle: "Admin dashboard és automatizált backend rendszer modern analitikával",
    challenge: "Az ügyfélnek szüksége volt egy komplex admin felületre, amely valós idejű adatokat jelenít meg, felhasználókezelést és automatizált riportokat biztosít — mindezt skálázható architektúrán.",
    solution: "Laravel alapú backend API-val, Vue.js frontendszal és Docker deployment pipeline-nal egy teljesen automatizált SaaS platformot építettem, amely napi 12 000+ aktív felhasználót kezel stabilan.",
    results: [
      { icon: <TrendingUp size={16} />, value: "38%", label: "Gyorsabb workflow" },
      { icon: <Server size={16} />, value: "< 2s", label: "Response time" },
      { icon: <Shield size={16} />, value: "99.9%", label: "Uptime" },
    ],
    techStack: [
      { label: "Laravel", color: "#ef4444", bg: "#fef2f2" },
      { label: "Vue.js", color: "#22c55e", bg: "#f0fdf4" },
      { label: "Docker", color: "#2496ED", bg: "#eff8ff" },
      { label: "MySQL", color: "#0f1117", bg: "#f3f4f6" },
      { label: "REST API", color: "#0f1117", bg: "#f3f4f6" },
    ],
    features: ["Valós idejű analitika dashboard", "Felhasználókezelés és jogosultságrendszer", "Automatizált riport generálás", "API integráció külső rendszerekkel", "Mobil optimalizált felület", "Kétfaktoros autentikáció"],
    accentColor: "#22c55e",
  },
  infra: {
    id: "infra",
    category: "Infrastructure",
    categoryColor: "#3b82f6",
    categoryBg: "#eff6ff",
    title: "Infrastructure & Deployment System",
    subtitle: "Modern deployment pipeline és monitoring rendszer cloud infrastruktúrához",
    challenge: "A csapat manuális deployment folyamatokkal dolgozott, amelyek instabilitást és hosszú leállásokat okoztak. Nem volt monitoring, backup stratégia vagy automatizált rollback.",
    solution: "Docker-alapú konténerizált infrastruktúrát, GitHub Actions CI/CD pipeline-t, NGINX reverse proxy-t és Grafana monitoringot implementáltam, amely teljesen automatizált deployment-et és azonnali alerteket biztosít.",
    results: [
      { icon: <TrendingUp size={16} />, value: "99.9%", label: "Uptime" },
      { icon: <Server size={16} />, value: "< 3 perc", label: "Deploy idő" },
      { icon: <Shield size={16} />, value: "Daily", label: "Backup" },
    ],
    techStack: [
      { label: "Docker", color: "#2496ED", bg: "#eff8ff" },
      { label: "Linux", color: "#0f1117", bg: "#f3f4f6" },
      { label: "NGINX", color: "#22c55e", bg: "#f0fdf4" },
      { label: "GitHub Actions", color: "#0f1117", bg: "#f3f4f6" },
      { label: "AWS EC2", color: "#FF9900", bg: "#fffbeb" },
    ],
    features: ["Docker Compose production konfiguráció", "CI/CD pipeline GitHub Actions-szel", "Automatizált health check és rollback", "NGINX reverse proxy és SSL", "Napi backup S3-ra", "Valós idejű monitoring és alerting"],
    accentColor: "#3b82f6",
  },
  security: {
    id: "security",
    category: "Security Platform",
    categoryColor: "#8b5cf6",
    categoryBg: "#faf5ff",
    title: "Security-first Platform",
    subtitle: "Biztonságközpontú autentikációs és API védelmi rendszer",
    challenge: "Az ügyfél rendszere biztonsági auditot nem állt volna ki — JWT tokeneknél nem volt expiry, az API-k nincsenek rate limitálva, és server szinten sem volt hardening. Adatszivárgás kockázata magas volt.",
    solution: "Teljes biztonsági audit elvégzése után implementáltam a hiányzó védelmi rétegeket: MFA, JWT refresh flow, API rate limiting, input validáció, server hardening és naplózás. A rendszer 98%-os biztonsági score-t ért el.",
    results: [
      { icon: <Shield size={16} />, value: "98%", label: "Security score" },
      { icon: <Check size={16} />, value: "0", label: "Vulnerabilities" },
      { icon: <Server size={16} />, value: "Audit", label: "Ready" },
    ],
    techStack: [
      { label: "JWT + Refresh", color: "#8b5cf6", bg: "#faf5ff" },
      { label: "OAuth 2.0", color: "#0f1117", bg: "#f3f4f6" },
      { label: "MFA", color: "#0f1117", bg: "#f3f4f6" },
      { label: "Rate Limiting", color: "#22c55e", bg: "#f0fdf4" },
      { label: "Server Hardening", color: "#ef4444", bg: "#fef2f2" },
    ],
    features: ["Kétfaktoros autentikáció (MFA)", "JWT access + refresh token rendszer", "API rate limiting és IP allowlist", "Input validáció és XSS védelem", "Server szintű hardening", "Teljes audit log és monitoring"],
    accentColor: "#8b5cf6",
  },
};

export function ProjectModal({ projectId, onClose }: { projectId: string | null; onClose: () => void }) {
  const data = projectId ? MODAL_DATA[projectId] : null;

  useEffect(() => {
    if (!data) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [data, onClose]);

  return (
    <AnimatePresence>
      {data && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            style={{
              position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)",
              backdropFilter: "blur(6px)", zIndex: 100,
            }}
          />

          {/* Panel */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, y: 32, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: "fixed",
              top: "50%", left: "50%",
              transform: "translate(-50%, -50%)",
              width: "min(680px, calc(100vw - 2rem))",
              maxHeight: "calc(100vh - 4rem)",
              overflowY: "auto",
              background: "#fff",
              borderRadius: "1.75rem",
              boxShadow: "0 32px 80px rgba(0,0,0,0.22), 0 8px 24px rgba(0,0,0,0.12)",
              zIndex: 101,
              scrollbarWidth: "none",
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: "1.875rem 1.875rem 0",
                position: "sticky", top: 0,
                background: "#fff",
                borderBottom: "1px solid rgba(0,0,0,0.06)",
                paddingBottom: "1.25rem",
                display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem",
              }}
            >
              <div>
                <span style={{ display: "inline-flex", alignItems: "center", fontSize: "0.75rem", fontWeight: 700, color: data.categoryColor, background: data.categoryBg, border: `1px solid ${data.categoryColor}22`, borderRadius: "9999px", padding: "0.25rem 0.75rem", marginBottom: "0.625rem" }}>
                  {data.category}
                </span>
                <h2 style={{ fontSize: "1.375rem", fontWeight: 800, letterSpacing: "-0.04em", color: "#0f1117", margin: 0, lineHeight: 1.25 }}>{data.title}</h2>
                <p style={{ fontSize: "0.875rem", color: "#6e6e80", margin: "0.375rem 0 0", lineHeight: 1.55 }}>{data.subtitle}</p>
              </div>
              <button
                onClick={onClose}
                style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#f3f4f6", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#6e6e80", flexShrink: 0, transition: "background 0.15s, color 0.15s" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#0f1117"; e.currentTarget.style.color = "#fff"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "#f3f4f6"; e.currentTarget.style.color = "#6e6e80"; }}
              >
                <X size={16} />
              </button>
            </div>

            <div style={{ padding: "1.875rem", display: "flex", flexDirection: "column", gap: "1.75rem" }}>

              {/* Results */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.75rem" }}>
                {data.results.map((r, i) => (
                  <div key={i} style={{ background: "#fafafa", border: "1px solid rgba(0,0,0,0.07)", borderRadius: "1rem", padding: "1rem", display: "flex", flexDirection: "column", gap: "0.375rem", alignItems: "center", textAlign: "center" }}>
                    <span style={{ color: data.accentColor }}>{r.icon}</span>
                    <div style={{ fontSize: "1.375rem", fontWeight: 800, color: data.accentColor, letterSpacing: "-0.05em" }}>{r.value}</div>
                    <div style={{ fontSize: "0.75rem", color: "#9ca3af", fontWeight: 500 }}>{r.label}</div>
                  </div>
                ))}
              </div>

              {/* Challenge */}
              <div>
                <div style={{ fontSize: "0.6875rem", fontWeight: 750, color: "#9ca3af", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "0.625rem" }}>Kihívás</div>
                <p style={{ fontSize: "0.9375rem", color: "#374151", lineHeight: 1.7, margin: 0, padding: "1rem 1.125rem", background: "#fef2f2", border: "1px solid rgba(239,68,68,0.1)", borderRadius: "0.875rem", borderLeft: "3px solid #ef4444" }}>
                  {data.challenge}
                </p>
              </div>

              {/* Solution */}
              <div>
                <div style={{ fontSize: "0.6875rem", fontWeight: 750, color: "#9ca3af", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "0.625rem" }}>Megoldás</div>
                <p style={{ fontSize: "0.9375rem", color: "#374151", lineHeight: 1.7, margin: 0, padding: "1rem 1.125rem", background: "#f0fdf4", border: "1px solid rgba(34,197,94,0.12)", borderRadius: "0.875rem", borderLeft: `3px solid ${data.accentColor}` }}>
                  {data.solution}
                </p>
              </div>

              {/* Features */}
              <div>
                <div style={{ fontSize: "0.6875rem", fontWeight: 750, color: "#9ca3af", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "0.75rem" }}>Megvalósított funkciók</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
                  {data.features.map((f) => (
                    <div key={f} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <span style={{ width: "16px", height: "16px", borderRadius: "50%", background: "#f0fdf4", border: "1.5px solid #bbf7d0", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <Check size={8} color="#22c55e" strokeWidth={3} />
                      </span>
                      <span style={{ fontSize: "0.875rem", color: "#374151", fontWeight: 500 }}>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tech stack */}
              <div>
                <div style={{ fontSize: "0.6875rem", fontWeight: 750, color: "#9ca3af", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "0.625rem" }}>Technológiák</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem" }}>
                  {data.techStack.map((t) => (
                    <span key={t.label} style={{ fontSize: "0.75rem", fontWeight: 650, color: t.color, background: t.bg, border: `1px solid ${t.color}22`, borderRadius: "9999px", padding: "0.3rem 0.75rem" }}>
                      {t.label}
                    </span>
                  ))}
                </div>
              </div>

              {/* Footer CTA */}
              <div style={{ display: "flex", gap: "0.75rem", paddingTop: "0.25rem", borderTop: "1px solid rgba(0,0,0,0.06)" }}>
                <button
                  onClick={onClose}
                  style={{ flex: 1, padding: "0.875rem", background: data.accentColor, color: "#fff", border: "none", borderRadius: "0.875rem", fontSize: "0.9375rem", fontWeight: 700, cursor: "pointer", letterSpacing: "-0.02em", boxShadow: `0 4px 16px ${data.accentColor}30`, transition: "all 0.15s", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = `0 6px 24px ${data.accentColor}45`; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = `0 4px 16px ${data.accentColor}30`; }}
                >
                  Hasonló projektet indítok
                  <ExternalLink size={14} />
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
