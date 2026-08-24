import React, { useRef, useState, useEffect, useCallback } from "react";
import { motion, useInView, AnimatePresence } from "motion/react";
import {
  Check, Send, Zap, Lock, Handshake, Rocket, Sparkles,
  Bot, User, AlertCircle, RotateCcw,
} from "lucide-react";
import { track, FORM_ID } from "@/analytics";
import type { FormFieldName } from "@/analytics";
import { sendProjectAssistantMessage, submitProjectInquiry } from "../lib/api";

// ─── Types ────────────────────────────────────────────────────────────────────

type ChatRole = "user" | "assistant";
type MessageStatus = "sent" | "error";
type MessageType = "message" | "project_summary";
type ChatPhase = "demo" | "active" | "summary";

interface ProjectSummaryData {
  goal: string;
  audience: string;
  features: string[];
  existingSystem: string;
  technical: string;
  integrations: string;
  deadline: string;
  notes: string;
}

interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  timestamp: number;
  status: MessageStatus;
  type?: MessageType;
  summaryData?: ProjectSummaryData;
}

interface FormData {
  name: string;
  email: string;
  description: string;
  aiAssist: boolean;
  consultation: boolean;
  existingSystem: boolean;
  existingSystemUrl: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  description?: string;
  existingSystemUrl?: string;
}

interface ContactPayload {
  form: FormData;
  conversation: ChatMessage[];
  summary?: ProjectSummaryData;
  meta: { url: string; referrer: string; utmSource?: string; utmMedium?: string; utmCampaign?: string };
}

const AI_ASSISTANT_ENABLED = false;

let _msgCounter = 0;
function nextId() { return `msg_${Date.now()}_${++_msgCounter}`; }

// ─── Persistence ──────────────────────────────────────────────────────────────

const STORAGE_KEY = "kt_contact_v2";

function loadSaved(): { form?: Partial<FormData>; messages?: ChatMessage[]; phase?: ChatPhase } {
  try { return JSON.parse(sessionStorage.getItem(STORAGE_KEY) ?? "{}"); }
  catch { return {}; }
}

function persistState(form: FormData, messages: ChatMessage[], phase: ChatPhase) {
  try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ form, messages, phase })); }
  catch {}
}

function clearPersisted() {
  try { sessionStorage.removeItem(STORAGE_KEY); } catch {}
}

// ─── Analytics (no PII) ───────────────────────────────────────────────────────

function fireEvent(name: string) {
  try {
    const w = window as typeof window & { gtag?: (...a: unknown[]) => void };
    if (w.gtag) w.gtag("event", name);
  } catch {}
}

// ─── Validation ───────────────────────────────────────────────────────────────

function validateForm(form: FormData): FormErrors {
  const e: FormErrors = {};
  if (!form.name.trim()) e.name = "A neved megadása kötelező";
  if (!form.email.trim()) e.email = "Az email cím megadása kötelező";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Érvényes email cím szükséges";
  if (!form.description.trim()) e.description = "A projekt leírása kötelező";
  if (form.existingSystem && !form.existingSystemUrl.trim()) e.existingSystemUrl = "Add meg a rendszer URL-jét";
  return e;
}

// ─── UTM helpers ──────────────────────────────────────────────────────────────

function getUtm() {
  try {
    const p = new URLSearchParams(window.location.search);
    return {
      utmSource: p.get("utm_source") ?? undefined,
      utmMedium: p.get("utm_medium") ?? undefined,
      utmCampaign: p.get("utm_campaign") ?? undefined,
    };
  } catch { return {}; }
}

// ─── Style helpers ────────────────────────────────────────────────────────────

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "0.8125rem",
  fontWeight: 650,
  color: "#374151",
  marginBottom: "0.4rem",
  letterSpacing: "-0.01em",
};

const errorMsgStyle: React.CSSProperties = {
  fontSize: "0.75rem",
  color: "#ef4444",
  marginTop: "0.3rem",
  fontWeight: 500,
};

function fieldStyle(active: boolean, hasError?: boolean): React.CSSProperties {
  return {
    width: "100%",
    background: active ? "#ffffff" : "#fafafa",
    border: hasError ? "1.5px solid #ef4444" : active ? "1.5px solid #22c55e" : "1.5px solid rgba(0,0,0,0.1)",
    borderRadius: "0.75rem",
    padding: "0.8125rem 1rem",
    fontSize: "0.9375rem",
    color: "#0f1117",
    outline: "none",
    transition: "border-color 0.15s, background 0.15s, box-shadow 0.15s",
    boxShadow: active && !hasError ? "0 0 0 4px rgba(34,197,94,0.08)" : "none",
    boxSizing: "border-box" as const,
    fontFamily: "'Inter', -apple-system, sans-serif",
    resize: "none" as const,
  };
}

// ─── Chat demo script (onboarding) ────────────────────────────────────────────

const DEMO_SCRIPT = [
  { role: "user", text: "Szeretnék egy előfizetéses sportplatformot." },
  { role: "ai",   text: "Milyen célközönségnek készül a rendszer?" },
  { role: "user", text: "Sportolóknak és edzőknek." },
  { role: "ai",   text: "Szükség van online fizetésre és felhasználói fiókokra?" },
  { role: "user", text: "Igen, Stripe integrációval." },
  { role: "ai",   text: "Rendben. Már össze tudom állítani a projekt összefoglalóját." },
];

const DEMO_DELAYS = [800, 1900, 3200, 4400, 5600, 6700];

// ─── DemoBubble ───────────────────────────────────────────────────────────────

function DemoBubble({ msg, visible }: { msg: { role: string; text: string }; visible: boolean }) {
  const isAi = msg.role === "ai";
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 8, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          style={{ display: "flex", flexDirection: isAi ? "row" : "row-reverse", alignItems: "flex-end", gap: "0.5rem" }}
        >
          <span style={{ width: "26px", height: "26px", borderRadius: "50%", background: isAi ? "rgba(34,197,94,0.18)" : "rgba(255,255,255,0.1)", border: isAi ? "1px solid rgba(34,197,94,0.3)" : "1px solid rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: isAi ? "#22c55e" : "rgba(255,255,255,0.7)" }}>
            {isAi ? <Bot size={13} /> : <User size={13} />}
          </span>
          <div style={{ maxWidth: "82%", padding: "0.6rem 0.875rem", borderRadius: isAi ? "0.875rem 0.875rem 0.875rem 0.25rem" : "0.875rem 0.875rem 0.25rem 0.875rem", background: isAi ? "rgba(34,197,94,0.12)" : "rgba(255,255,255,0.08)", border: isAi ? "1px solid rgba(34,197,94,0.22)" : "1px solid rgba(255,255,255,0.1)", fontSize: "0.8125rem", color: isAi ? "#d1fae5" : "rgba(255,255,255,0.85)", lineHeight: 1.55, fontWeight: 450, letterSpacing: "-0.01em" }}>
            {msg.text}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── TypingDots ───────────────────────────────────────────────────────────────

function TypingDots() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ display: "flex", alignItems: "flex-end", gap: "0.5rem" }}>
      <span style={{ width: "26px", height: "26px", borderRadius: "50%", background: "rgba(34,197,94,0.18)", border: "1px solid rgba(34,197,94,0.3)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: "#22c55e" }}>
        <Bot size={13} />
      </span>
      <div style={{ padding: "0.6rem 0.875rem", borderRadius: "0.875rem 0.875rem 0.875rem 0.25rem", background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)", display: "flex", alignItems: "center", gap: "4px" }}>
        {[0, 1, 2].map((i) => (
          <motion.span key={i} style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#22c55e", display: "block" }} animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }} transition={{ duration: 0.9, delay: i * 0.18, repeat: Infinity }} />
        ))}
      </div>
    </motion.div>
  );
}

// ─── ProjectSummaryCard ────────────────────────────────────────────────────────

function ProjectSummaryCard({ data }: { data: ProjectSummaryData }) {
  const rows = [
    { label: "Projekt célja",       value: data.goal },
    { label: "Célközönség",          value: data.audience },
    { label: "Fő funkciók",          value: data.features.join(", ") },
    { label: "Meglévő rendszer",     value: data.existingSystem },
    { label: "Technikai igények",    value: data.technical },
    { label: "Integrációk",          value: data.integrations },
    { label: "Határidő",             value: data.deadline },
    ...(data.notes ? [{ label: "Megjegyzések", value: data.notes }] : []),
  ];

  return (
    <div style={{ maxWidth: "calc(100% - 2.25rem)", background: "rgba(10,12,18,0.7)", border: "1px solid rgba(34,197,94,0.28)", borderRadius: "1rem", overflow: "hidden", backdropFilter: "blur(12px)" }}>
      <div style={{ background: "rgba(34,197,94,0.1)", borderBottom: "1px solid rgba(34,197,94,0.18)", padding: "0.625rem 1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <Sparkles size={13} color="#22c55e" />
        <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#22c55e", letterSpacing: "-0.01em" }}>Projekt összefoglaló</span>
      </div>
      <div style={{ padding: "0.875rem 1rem", display: "flex", flexDirection: "column", gap: "0.625rem" }}>
        {rows.map((row) => (
          <div key={row.label}>
            <div style={{ fontSize: "0.5938rem", fontWeight: 700, color: "rgba(255,255,255,0.32)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "0.125rem" }}>{row.label}</div>
            <div style={{ fontSize: "0.8125rem", color: "rgba(255,255,255,0.75)", lineHeight: 1.45, letterSpacing: "-0.01em" }}>{row.value || "–"}</div>
          </div>
        ))}
      </div>
      <div style={{ padding: "0.625rem 1rem", borderTop: "1px solid rgba(34,197,94,0.12)", display: "flex", gap: "1rem" }}>
        {["Összefoglaló kész", "Küldésre kész"].map((l) => (
          <div key={l} style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
            <Check size={11} color="#22c55e" strokeWidth={3} />
            <span style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.5)", fontWeight: 500 }}>{l}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── ChatBubble ───────────────────────────────────────────────────────────────

function ChatBubble({ msg }: { msg: ChatMessage }) {
  const isAi = msg.role === "assistant";
  const isErr = msg.status === "error";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
      style={{ display: "flex", flexDirection: isAi ? "row" : "row-reverse", alignItems: "flex-end", gap: "0.5rem" }}
    >
      <span style={{ width: "26px", height: "26px", borderRadius: "50%", background: isAi ? "rgba(34,197,94,0.18)" : "rgba(255,255,255,0.1)", border: isAi ? "1px solid rgba(34,197,94,0.3)" : "1px solid rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: isAi ? "#22c55e" : "rgba(255,255,255,0.7)" }}>
        {isAi ? <Bot size={13} /> : <User size={13} />}
      </span>

      {msg.type === "project_summary" && msg.summaryData ? (
        <ProjectSummaryCard data={msg.summaryData} />
      ) : (
        <div style={{ maxWidth: "82%", padding: "0.6rem 0.875rem", borderRadius: isAi ? "0.875rem 0.875rem 0.875rem 0.25rem" : "0.875rem 0.875rem 0.25rem 0.875rem", background: isErr ? "rgba(239,68,68,0.12)" : isAi ? "rgba(34,197,94,0.12)" : "rgba(255,255,255,0.08)", border: isErr ? "1px solid rgba(239,68,68,0.25)" : isAi ? "1px solid rgba(34,197,94,0.22)" : "1px solid rgba(255,255,255,0.1)", fontSize: "0.8125rem", color: isErr ? "#fca5a5" : isAi ? "#d1fae5" : "rgba(255,255,255,0.85)", lineHeight: 1.55, fontWeight: 450, letterSpacing: "-0.01em" }}>
          {msg.content}
        </div>
      )}
    </motion.div>
  );
}

// ─── ChatInput ────────────────────────────────────────────────────────────────

function ChatInput({ onSend, disabled, loading }: { onSend: (t: string) => void; disabled: boolean; loading: boolean }) {
  const [value, setValue] = useState("");
  const taRef = useRef<HTMLTextAreaElement>(null);

  const doSend = () => {
    const t = value.trim();
    if (!t || disabled) return;
    onSend(t);
    setValue("");
    if (taRef.current) { taRef.current.style.height = "auto"; }
  };

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); doSend(); }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    const ta = e.target;
    ta.style.height = "auto";
    ta.style.height = `${Math.min(ta.scrollHeight, 100)}px`;
  };

  const canSend = !!value.trim() && !disabled;

  return (
    <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "0.75rem 1rem", display: "flex", gap: "0.5rem", alignItems: "flex-end", background: "rgba(0,0,0,0.18)", flexShrink: 0 }}>
      <textarea
        ref={taRef}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKey}
        placeholder={loading ? "Az asszisztens gondolkodik..." : "Írj üzenetet... (Enter = küldés, Shift+Enter = sortörés)"}
        disabled={disabled}
        rows={1}
        style={{ flex: 1, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: "0.625rem", padding: "0.5625rem 0.75rem", fontSize: "0.8125rem", color: "rgba(255,255,255,0.85)", outline: "none", resize: "none", fontFamily: "'Inter', sans-serif", lineHeight: 1.55, maxHeight: "100px", overflowY: "auto", opacity: disabled ? 0.5 : 1, cursor: disabled ? "not-allowed" : "text", transition: "border-color 0.15s" }}
        onFocus={(e) => { if (!disabled) e.target.style.borderColor = "rgba(34,197,94,0.38)"; }}
        onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.09)"; }}
      />
      <button
        onClick={doSend}
        disabled={!canSend}
        style={{ width: "34px", height: "34px", borderRadius: "0.5rem", background: canSend ? "#22c55e" : "rgba(255,255,255,0.07)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: canSend ? "pointer" : "not-allowed", flexShrink: 0, color: canSend ? "#fff" : "rgba(255,255,255,0.22)", transition: "background 0.15s, color 0.15s" }}
      >
        <Send size={14} />
      </button>
    </div>
  );
}

// ─── AI panel shell (shared header + wrapper) ─────────────────────────────────

function AIPanelShell({ isActive, children }: { isActive: boolean; children: React.ReactNode }) {
  return (
    <div style={{ background: "linear-gradient(145deg, #0f1117 0%, #141720 60%, #0f1117 100%)", borderRadius: "1.5rem", overflow: "hidden", border: "1px solid rgba(255,255,255,0.07)", boxShadow: "0 24px 64px rgba(0,0,0,0.25), 0 4px 16px rgba(0,0,0,0.18)", display: "flex", flexDirection: "column", height: "100%", minHeight: "520px", position: "relative" }}>
      <div style={{ position: "absolute", width: "280px", height: "280px", borderRadius: "50%", background: "radial-gradient(circle, rgba(34,197,94,0.07) 0%, transparent 70%)", top: "-60px", right: "-40px", pointerEvents: "none" }} />
      <div style={{ padding: "1.375rem 1.5rem", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: "0.875rem", position: "relative", zIndex: 1, flexShrink: 0 }}>
        <div style={{ width: "38px", height: "38px", borderRadius: "0.875rem", background: "rgba(34,197,94,0.14)", border: "1px solid rgba(34,197,94,0.25)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Sparkles size={18} color="#22c55e" />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: "0.9375rem", fontWeight: 700, color: "#fff", letterSpacing: "-0.025em", lineHeight: 1.2 }}>AI Projekt Asszisztens</div>
          <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.45)", marginTop: "0.15rem" }}>
            {AI_ASSISTANT_ENABLED ? "Segít összefoglalni az igényeket" : "Hamarosan elérhető"}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
          <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: isActive ? "#22c55e" : "rgba(255,255,255,0.2)", boxShadow: isActive ? "0 0 0 3px rgba(34,197,94,0.2)" : "none", animation: isActive ? "pulseGreen 2s ease-in-out infinite" : "none", transition: "background 0.3s" }} />
          <span style={{ fontSize: "0.75rem", fontWeight: 650, color: isActive ? "#22c55e" : "rgba(255,255,255,0.3)", transition: "color 0.3s" }}>
            {AI_ASSISTANT_ENABLED ? (isActive ? "Online" : "Készenléti mód") : "Hamarosan"}
          </span>
        </div>
      </div>
      {children}
    </div>
  );
}

// ─── AIDemoCard (onboarding animation) ────────────────────────────────────────

function AIDemoCard() {
  const [visibleCount, setVisibleCount] = useState(0);
  const [showTyping, setShowTyping] = useState(false);
  const [done, setDone] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);
  const cardInView = useInView(chatRef, { once: true, margin: "-40px" });
  const started = useRef(false);

  useEffect(() => {
    if (!cardInView || started.current) return;
    started.current = true;
    DEMO_DELAYS.forEach((delay, i) => {
      if (DEMO_SCRIPT[i].role === "ai") setTimeout(() => setShowTyping(true), delay - 700);
      setTimeout(() => {
        setShowTyping(false);
        setVisibleCount(i + 1);
        if (i === DEMO_SCRIPT.length - 1) setTimeout(() => setDone(true), 600);
        if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
      }, delay);
    });
  }, [cardInView]);

  return (
    <AIPanelShell isActive={false}>
      <div ref={chatRef} style={{ flex: 1, padding: "1.25rem 1.375rem", display: "flex", flexDirection: "column", gap: "0.75rem", overflowY: "auto", scrollbarWidth: "none", position: "relative", zIndex: 1 }}>
        <motion.div initial={{ opacity: 0, y: 8 }} animate={cardInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.4, delay: 0.2 }} style={{ display: "flex", justifyContent: "center" }}>
          <span style={{ fontSize: "0.6875rem", color: "rgba(255,255,255,0.28)", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "9999px", padding: "0.25rem 0.75rem", letterSpacing: "0.03em" }}>Ma, most</span>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 8 }} animate={cardInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.4, delay: 0.35 }} style={{ display: "flex", alignItems: "flex-end", gap: "0.5rem" }}>
          <span style={{ width: "26px", height: "26px", borderRadius: "50%", background: "rgba(34,197,94,0.18)", border: "1px solid rgba(34,197,94,0.3)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: "#22c55e" }}><Bot size={13} /></span>
          <div style={{ maxWidth: "85%", padding: "0.6rem 0.875rem", borderRadius: "0.875rem 0.875rem 0.875rem 0.25rem", background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.22)", fontSize: "0.8125rem", color: "#d1fae5", lineHeight: 1.55, letterSpacing: "-0.01em" }}>
            Szia! Mesélj a projektedről, és segítek összefoglalni az igényeket.
          </div>
        </motion.div>
        {DEMO_SCRIPT.map((msg, i) => <DemoBubble key={i} msg={msg} visible={i < visibleCount} />)}
        <AnimatePresence>{showTyping && <TypingDots />}</AnimatePresence>
      </div>
      <AnimatePresence>
        {done && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }} style={{ margin: "0 1.375rem 1.375rem", background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.22)", borderRadius: "1rem", padding: "1rem 1.125rem", position: "relative", zIndex: 1 }}>
            <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#22c55e", marginBottom: "0.5rem" }}>Összefoglaló kész</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
              {["Projekt összefoglaló kész", "Küldésre kész"].map((l) => (
                <div key={l} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <Check size={12} color="#22c55e" strokeWidth={3} />
                  <span style={{ fontSize: "0.8125rem", color: "rgba(255,255,255,0.65)", fontWeight: 500 }}>{l}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div style={{ padding: "0.875rem 1.375rem", borderTop: "1px solid rgba(255,255,255,0.05)", background: "rgba(0,0,0,0.15)", flexShrink: 0, position: "relative", zIndex: 1 }}>
        <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.28)", margin: 0, lineHeight: 1.5, letterSpacing: "-0.01em" }}>
          {AI_ASSISTANT_ENABLED
            ? "Engedélyezd az AI asszisztenst a jobb oldali formban, és valódi projektbeszélgetést indíthatsz."
            : "Az AI asszisztens fejlesztés alatt van, hamarosan itt is elérhető lesz."}
        </p>
      </div>
    </AIPanelShell>
  );
}

// ─── AIChatInteractive ────────────────────────────────────────────────────────

function AIChatInteractive({
  messages, isLoading, chatError, onSend, onRetry,
}: {
  messages: ChatMessage[];
  isLoading: boolean;
  chatError: string | null;
  onSend: (t: string) => void;
  onRetry: () => void;
}) {
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages, isLoading, chatError]);

  return (
    <AIPanelShell isActive>
      <div ref={chatRef} style={{ flex: 1, padding: "1.25rem 1.375rem", display: "flex", flexDirection: "column", gap: "0.75rem", overflowY: "auto", scrollbarWidth: "none", position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <span style={{ fontSize: "0.6875rem", color: "rgba(255,255,255,0.28)", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "9999px", padding: "0.25rem 0.75rem", letterSpacing: "0.03em" }}>Ma, most</span>
        </div>
        {messages.map((msg) => <ChatBubble key={msg.id} msg={msg} />)}
        <AnimatePresence>{isLoading && <TypingDots />}</AnimatePresence>
        <AnimatePresence>
          {chatError && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "0.875rem", padding: "0.75rem 1rem", display: "flex", alignItems: "flex-start", gap: "0.625rem" }}>
              <AlertCircle size={14} color="#f87171" style={{ flexShrink: 0, marginTop: "0.1rem" }} />
              <span style={{ fontSize: "0.8125rem", color: "#fca5a5", flex: 1, lineHeight: 1.5 }}>{chatError}</span>
              <button onClick={onRetry} style={{ background: "none", border: "none", cursor: "pointer", color: "#f87171", padding: 0, display: "flex", alignItems: "center", gap: "0.25rem", fontSize: "0.75rem", fontWeight: 600, flexShrink: 0 }}>
                <RotateCcw size={12} />
                Újra
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div style={{ position: "relative", zIndex: 1 }}>
        <ChatInput onSend={onSend} disabled={isLoading || !!chatError} loading={isLoading} />
      </div>
    </AIPanelShell>
  );
}

// ─── ExistingSystemField ──────────────────────────────────────────────────────

function ExistingSystemField({ show, value, onChange, error, focused, onFocus, onBlur }: { show: boolean; value: string; onChange: (v: string) => void; error?: string; focused: boolean; onFocus: () => void; onBlur: () => void }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }} style={{ overflow: "hidden" }}>
          <div style={{ paddingTop: "0.625rem" }}>
            <label style={{ ...labelStyle, color: "#6b7280" }}>Weboldal vagy rendszer címe</label>
            <input
              type="url"
              placeholder="https://pelda.hu"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onFocus={onFocus}
              onBlur={onBlur}
              style={fieldStyle(focused, !!error)}
            />
            {error && <p style={errorMsgStyle}>{error}</p>}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── SubmittedState ────────────────────────────────────────────────────────────

function SubmittedState({ onReset }: { onReset: () => void }) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }} style={{ background: "#fff", border: "1px solid rgba(0,0,0,0.07)", borderRadius: "1.5rem", padding: "3rem 2.5rem", boxShadow: "0 4px 24px rgba(0,0,0,0.06)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1.25rem", textAlign: "center", minHeight: "520px" }}>
      <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: "#f0fdf4", border: "2px solid #bbf7d0", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Check size={24} color="#22c55e" strokeWidth={2.5} />
      </div>
      <div>
        <div style={{ fontSize: "1.25rem", fontWeight: 750, color: "#0f1117", letterSpacing: "-0.035em", marginBottom: "0.5rem" }}>Köszönöm! Hamarosan felveszem veled a kapcsolatot.</div>
        <p style={{ fontSize: "0.9375rem", color: "#6e6e80", lineHeight: 1.65, margin: 0, maxWidth: "300px" }}>Általában 24 órán belül válaszolok. Addig is nézd meg a projektjeimet!</p>
      </div>
      <button onClick={onReset} style={{ fontSize: "0.875rem", color: "#22c55e", background: "none", border: "none", cursor: "pointer", fontWeight: 650, letterSpacing: "-0.01em" }}>Új üzenet küldése →</button>
    </motion.div>
  );
}

// ─── ProjectForm ──────────────────────────────────────────────────────────────

function ProjectForm({
  form, setForm, errors, focused, setFocused,
  onFieldFocus, onFieldBlur, onSubmit, submitting, submissionError, chatPhase,
}: {
  form: FormData;
  setForm: (f: FormData) => void;
  errors: FormErrors;
  focused: string | null;
  setFocused: (f: string | null) => void;
  onFieldFocus: (name: string, index: number) => void;
  onFieldBlur: (name: string, index: number, val: string) => void;
  onSubmit: () => void;
  submitting: boolean;
  submissionError: string | null;
  chatPhase: ChatPhase;
}) {
  const LABELS = [
    "AI segítsen pontosítani az igényeket",
    "Szeretnék online konzultációt",
    "Már van meglévő rendszerem",
  ] as const;

  const toggleCheck = (i: number, label: string) => {
    if (i === 0 && !AI_ASSISTANT_ENABLED) return;
    const next: FormData = {
      ...form,
      aiAssist: i === 0 ? !form.aiAssist : form.aiAssist,
      consultation: i === 1 ? !form.consultation : form.consultation,
      existingSystem: i === 2 ? !form.existingSystem : form.existingSystem,
    };
    setForm(next);
    if (i === 0 && !form.aiAssist) fireEvent("project_ai_assistant_enabled");
    if (i === 1 && !form.consultation) fireEvent("consultation_selected");
    if (i === 2 && !form.existingSystem) fireEvent("project_existing_system_selected");
  };

  const checks = [form.aiAssist, form.consultation, form.existingSystem];

  const aiActive = form.aiAssist && chatPhase === "demo";
  const btnLabel = submitting
    ? "Küldés..."
    : aiActive
    ? "Pontosítsuk az igényeket →"
    : "Küldd el az üzenetet";

  return (
    <div style={{ background: "#fff", border: "1px solid rgba(0,0,0,0.07)", borderRadius: "1.5rem", padding: "clamp(1.75rem, 3vw, 2.25rem)", boxShadow: "0 4px 24px rgba(0,0,0,0.055), 0 1px 4px rgba(0,0,0,0.03)", display: "flex", flexDirection: "column", gap: "1.375rem" }}>
      <div>
        <div style={{ fontSize: "1.1875rem", fontWeight: 750, color: "#0f1117", letterSpacing: "-0.035em", marginBottom: "0.3rem" }}>Mesélj a projektedről</div>
        <div style={{ fontSize: "0.875rem", color: "#6e6e80", lineHeight: 1.55 }}>
          {AI_ASSISTANT_ENABLED && form.aiAssist ? "Az AI asszisztens segít pontosítani az igényeket." : "Írd le röviden az ötletedet — válaszolok."}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {/* Name + Email */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }} className="contact-name-email">
          <div>
            <label style={labelStyle}>Név</label>
            <input type="text" placeholder="Kovács János" value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              onFocus={() => onFieldFocus("name", 0)}
              onBlur={(e) => { setFocused(null); onFieldBlur("name", 0, e.target.value); }}
              style={fieldStyle(focused === "name", !!errors.name)}
            />
            {errors.name && <p style={errorMsgStyle}>{errors.name}</p>}
          </div>
          <div>
            <label style={labelStyle}>Email</label>
            <input type="email" placeholder="janos@ceg.hu" value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              onFocus={() => onFieldFocus("email", 1)}
              onBlur={(e) => { setFocused(null); onFieldBlur("email", 1, e.target.value); }}
              style={fieldStyle(focused === "email", !!errors.email)}
            />
            {errors.email && <p style={errorMsgStyle}>{errors.email}</p>}
          </div>
        </div>

        {/* Description */}
        <div>
          <label style={labelStyle}>Projekt rövid leírása</label>
          <textarea rows={5} placeholder="Írd le röviden az ötletedet vagy a problémát, amire megoldást keresel..." value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            onFocus={() => onFieldFocus("message", 2)}
            onBlur={(e) => { setFocused(null); onFieldBlur("message", 2, e.target.value); }}
            style={{ ...fieldStyle(focused === "message", !!errors.description), lineHeight: 1.65 }}
          />
          {errors.description && <p style={errorMsgStyle}>{errors.description}</p>}
        </div>
      </div>

      {/* Checkboxes */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
        {LABELS.map((label, i) => (
          <label key={label} style={{ display: "flex", alignItems: "center", gap: "0.625rem", cursor: i === 0 && !AI_ASSISTANT_ENABLED ? "not-allowed" : "pointer", userSelect: "none", opacity: i === 0 && !AI_ASSISTANT_ENABLED ? 0.6 : 1 }}>
            <span
              onClick={() => toggleCheck(i, label)}
              style={{ width: "18px", height: "18px", borderRadius: "0.375rem", border: checks[i] ? "2px solid #22c55e" : "1.5px solid rgba(0,0,0,0.18)", background: checks[i] ? "#22c55e" : "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.15s", cursor: i === 0 && !AI_ASSISTANT_ENABLED ? "not-allowed" : "pointer" }}
            >
              {checks[i] && <Check size={10} color="#fff" strokeWidth={3} />}
            </span>
            <span style={{ fontSize: "0.875rem", color: "#4b5563", fontWeight: 500, letterSpacing: "-0.01em" }}>{label}</span>
            {i === 0 && !AI_ASSISTANT_ENABLED && (
              <span style={{ fontSize: "0.6875rem", fontWeight: 700, color: "#b45309", background: "#fffbeb", border: "1px solid #fde68a", borderRadius: "9999px", padding: "0.18rem 0.5rem", letterSpacing: "-0.01em" }}>
                Hamarosan
              </span>
            )}
          </label>
        ))}

        {/* Existing system URL field */}
        <ExistingSystemField
          show={form.existingSystem}
          value={form.existingSystemUrl}
          onChange={(v) => setForm({ ...form, existingSystemUrl: v })}
          error={errors.existingSystemUrl}
          focused={focused === "sysUrl"}
          onFocus={() => { setFocused("sysUrl"); onFieldFocus("existingSystemUrl", 3); }}
          onBlur={() => { setFocused(null); onFieldBlur("existingSystemUrl", 3, form.existingSystemUrl); }}
        />
      </div>

      {/* Submit button */}
      <button
        disabled={submitting}
        onClick={onSubmit}
        style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", background: submitting ? "#86efac" : "#22c55e", color: "#fff", border: "none", borderRadius: "0.875rem", padding: "0.9375rem", fontSize: "1rem", fontWeight: 700, cursor: submitting ? "not-allowed" : "pointer", letterSpacing: "-0.025em", boxShadow: "0 4px 20px rgba(34,197,94,0.3)", transition: "background 0.15s, transform 0.12s, box-shadow 0.15s", width: "100%", opacity: submitting ? 0.85 : 1 }}
        onMouseEnter={(e) => { if (submitting) return; e.currentTarget.style.background = "#16a34a"; e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 6px 24px rgba(34,197,94,0.42)"; }}
        onMouseLeave={(e) => { if (submitting) return; e.currentTarget.style.background = "#22c55e"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(34,197,94,0.3)"; }}
      >
        {submitting ? (
          <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation: "spin 0.8s linear infinite" }}><path d="M21 12a9 9 0 11-6.219-8.56" /></svg>Küldés...</>
        ) : aiActive ? (
          <>{btnLabel}</>
        ) : (
          <><Send size={16} />{btnLabel}</>
        )}
      </button>

      {submissionError && (
        <div
          style={{
            display: "flex",
            gap: "0.625rem",
            alignItems: "flex-start",
            borderRadius: "0.875rem",
            border: "1px solid rgba(239,68,68,0.18)",
            background: "rgba(239,68,68,0.07)",
            color: "#b91c1c",
            padding: "0.875rem 1rem",
          }}
        >
          <AlertCircle size={16} style={{ flexShrink: 0, marginTop: "0.1rem" }} />
          <span style={{ fontSize: "0.875rem", lineHeight: 1.55 }}>{submissionError}</span>
        </div>
      )}

      {/* Trust strip */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.875rem", justifyContent: "center", paddingTop: "0.125rem" }}>
        {[
          { icon: <Zap size={13} />, label: "Általában 24 órán belül válaszolok", color: "#f59e0b" },
          { icon: <Lock size={13} />, label: "Az adatok bizalmasan kezelve", color: "#22c55e" },
          { icon: <Handshake size={13} />, label: "Nincs kötelezettség", color: "#6e6e80" },
        ].map((t) => (
          <div key={t.label} style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
            <span style={{ color: t.color, display: "flex" }}>{t.icon}</span>
            <span style={{ fontSize: "0.75rem", color: "#9ca3af", fontWeight: 500, letterSpacing: "-0.01em" }}>{t.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Bottom trust strip data ───────────────────────────────────────────────────

const BOTTOM_CARDS = [
  { icon: <Rocket size={18} />, label: "Modern technológia", color: "#22c55e", bg: "#f0fdf4" },
  { icon: <Lock size={18} />, label: "Security-first", color: "#8b5cf6", bg: "#faf5ff" },
  { icon: <Zap size={18} />, label: "Gyors válasz", color: "#f59e0b", bg: "#fffbeb" },
  { icon: <Handshake size={18} />, label: "Partneri szemlélet", color: "#3b82f6", bg: "#eff6ff" },
];

// ─── ContactSection (parent — all shared state lives here) ────────────────────

export function ContactSection() {
  // ── Form state (persisted) ──────────────────────────────────────────────────
  const [form, setFormRaw] = useState<FormData>(() => {
    const s = loadSaved();
    const baseForm: FormData = {
      name: "",
      email: "",
      description: "",
      aiAssist: false,
      consultation: false,
      existingSystem: false,
      existingSystemUrl: "",
      ...s.form,
    };
    return {
      ...baseForm,
      aiAssist: AI_ASSISTANT_ENABLED ? baseForm.aiAssist : false,
    };
  });

  // ── Chat state (persisted) ──────────────────────────────────────────────────
  const [messages, setMessages] = useState<ChatMessage[]>(() => loadSaved().messages ?? []);
  const [chatPhase, setChatPhase] = useState<ChatPhase>(() => loadSaved().phase ?? "demo");

  // ── UI state ────────────────────────────────────────────────────────────────
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [focused, setFocused] = useState<string | null>(null);

  // ── Analytics refs ──────────────────────────────────────────────────────────
  const formStartedRef = useRef(false);
  const formStartTimeRef = useRef<number>(0);
  const fieldFocusTimeRef = useRef<number>(0);
  const completedFieldsRef = useRef(new Set<string>());
  const getCompletionPct = useCallback(() => Math.round((completedFieldsRef.current.size / 5) * 100), []);

  // ── Persist on change ───────────────────────────────────────────────────────
  useEffect(() => { persistState(form, messages, chatPhase); }, [form, messages, chatPhase]);

  // ── Preselect consultation from external events ─────────────────────────────
  useEffect(() => {
    const h = () => setFormRaw((f) => ({ ...f, consultation: true }));
    window.addEventListener("kt:preselect-consultation", h);
    return () => window.removeEventListener("kt:preselect-consultation", h);
  }, []);

  // ── Wrapped setForm that also clears field error on change ──────────────────
  const setForm = useCallback((f: FormData) => {
    setFormRaw(f);
    setFormErrors((prev) => {
      if (!Object.keys(prev).length) return prev;
      return validateForm(f);
    });
  }, []);

  // ── Field analytics ─────────────────────────────────────────────────────────
  const handleFieldFocus = useCallback((fieldName: string, fieldIndex: number) => {
    setFocused(fieldName);
    fieldFocusTimeRef.current = Date.now();
    if (!formStartedRef.current) {
      formStartedRef.current = true;
      formStartTimeRef.current = Date.now();
      track.trackFormStarted(fieldName as FormFieldName, FORM_ID.CONTACT);
      fireEvent("project_form_start");
    }
    track.trackFormFieldFocused(fieldName as FormFieldName, fieldIndex, getCompletionPct(), FORM_ID.CONTACT);
  }, [getCompletionPct]);

  const handleFieldBlur = useCallback((fieldName: string, fieldIndex: number, value: string) => {
    setFocused(null);
    const timeOnField = fieldFocusTimeRef.current ? Date.now() - fieldFocusTimeRef.current : 0;
    if (value.trim()) {
      completedFieldsRef.current.add(fieldName);
      track.trackFormFieldCompleted(fieldName as FormFieldName, fieldIndex, getCompletionPct(), timeOnField, FORM_ID.CONTACT);
    }
  }, [getCompletionPct]);

  // ── Send message to AI ──────────────────────────────────────────────────────
  const sendToAI = useCallback(async (userText: string, currentMsgs: ChatMessage[]) => {
    const userMsg: ChatMessage = { id: nextId(), role: "user", content: userText, timestamp: Date.now(), status: "sent" };
    const withUser = [...currentMsgs, userMsg];
    setMessages(withUser);
    setIsAiLoading(true);
    setChatError(null);
    fireEvent("ai_message_sent");

    try {
      const resp = await sendProjectAssistantMessage({
        messages: withUser.map(({ role, content }) => ({ role, content })),
        project: form,
      });
      const aiMsg: ChatMessage = { id: nextId(), role: "assistant", content: resp.content, timestamp: Date.now(), status: "sent", type: resp.type ?? "message", summaryData: resp.summaryData };
      const final = [...withUser, aiMsg];
      setMessages(final);
      if (resp.type === "project_summary") { setChatPhase("summary"); fireEvent("ai_summary_generated"); }
    } catch (error) {
      setChatError(error instanceof Error ? error.message : "Most nem sikerült választ kérni az asszisztenstől. Próbáld újra néhány másodperc múlva.");
    } finally {
      setIsAiLoading(false);
    }
  }, [form]);

  // ── Retry last request ──────────────────────────────────────────────────────
  const retryLast = useCallback(async () => {
    setChatError(null);
    setIsAiLoading(true);
    fireEvent("ai_message_sent");
    try {
      const resp = await sendProjectAssistantMessage({
        messages: messages.map(({ role, content }) => ({ role, content })),
        project: form,
      });
      const aiMsg: ChatMessage = { id: nextId(), role: "assistant", content: resp.content, timestamp: Date.now(), status: "sent", type: resp.type ?? "message", summaryData: resp.summaryData };
      setMessages((m) => [...m, aiMsg]);
      if (resp.type === "project_summary") { setChatPhase("summary"); fireEvent("ai_summary_generated"); }
    } catch (error) {
      setChatError(error instanceof Error ? error.message : "Most nem sikerült választ kérni az asszisztenstől. Próbáld újra néhány másodperc múlva.");
    } finally {
      setIsAiLoading(false);
    }
  }, [form, messages]);

  // ── Start AI conversation from description ──────────────────────────────────
  const startAI = useCallback(async (currentForm: FormData) => {
    const greeting: ChatMessage = {
      id: nextId(),
      role: "assistant",
      content: `Szia${currentForm.name ? `, ${currentForm.name.split(" ")[0]}` : ""}! Elolvastam a projekt leírását. Néhány kérdéssel segítek pontosítani az igényeket.`,
      timestamp: Date.now(),
      status: "sent",
    };
    setChatPhase("active");
    fireEvent("ai_chat_started");
    await sendToAI(currentForm.description, [greeting]);
  }, [sendToAI]);

  // ── Handle user sending a chat message ──────────────────────────────────────
  const handleUserSend = useCallback((text: string) => {
    sendToAI(text, messages);
  }, [messages, sendToAI]);

  // ── Submit ──────────────────────────────────────────────────────────────────
  const handleSubmit = useCallback(async () => {
    const errors = validateForm(form);
    setFormErrors(errors);
    setSubmissionError(null);
    if (Object.keys(errors).length > 0) return;

    // Start AI if enabled and not yet started
    if (form.aiAssist && chatPhase === "demo") {
      fireEvent("project_ai_assistant_enabled");
      await startAI(form);
      return;
    }

    // Final submission
    setSubmitting(true);
    fireEvent("project_form_submit");

    const summary = messages.find((m) => m.type === "project_summary")?.summaryData;
    const completionTimeMs = formStartTimeRef.current ? Date.now() - formStartTimeRef.current : 0;
    const selectedChecks = [
      form.aiAssist && "AI segítség",
      form.consultation && "Online konzultáció",
      form.existingSystem && "Meglévő rendszer",
    ].filter(Boolean) as string[];

    try {
      await submitProjectInquiry({
        form, conversation: messages, summary,
        meta: { url: window.location.href, referrer: document.referrer, ...getUtm() },
      });
      track.trackFormSubmitted(completionTimeMs, form.description.length, selectedChecks, document.referrer ? "referral" : "direct", FORM_ID.CONTACT);
      fireEvent("project_form_success");
      clearPersisted();
      setSubmitted(true);
    } catch (error) {
      fireEvent("project_form_error");
      setSubmissionError(error instanceof Error ? error.message : "A beküldés most nem sikerült. Próbáld újra néhány perc múlva.");
    } finally {
      setSubmitting(false);
    }
  }, [form, chatPhase, messages, startAI]);

  // ── Reset after submission ──────────────────────────────────────────────────
  const handleReset = () => {
    setSubmitted(false);
    setFormRaw({ name: "", email: "", description: "", aiAssist: false, consultation: false, existingSystem: false, existingSystemUrl: "" });
    setMessages([]);
    setChatPhase("demo");
    setFormErrors({});
    setSubmissionError(null);
    formStartedRef.current = false;
    completedFieldsRef.current.clear();
  };

  // ── Section in-view refs ────────────────────────────────────────────────────
  const headerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(headerRef, { once: true, margin: "-60px" });
  const bottomRef = useRef<HTMLDivElement>(null);
  const bottomInView = useInView(bottomRef, { once: true, margin: "-60px" });

  return (
    <section style={{ background: "#f9f9fb", padding: "7rem 1.5rem" }}>
      <div style={{ maxWidth: "72rem", margin: "0 auto" }}>

        {/* Header */}
        <motion.div ref={headerRef} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} style={{ textAlign: "center", marginBottom: "4rem" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.5rem" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: AI_ASSISTANT_ENABLED ? "#f0fdf4" : "#fffbeb", border: AI_ASSISTANT_ENABLED ? "1px solid #bbf7d0" : "1px solid #fde68a", borderRadius: "9999px", padding: "0.375rem 1rem", fontSize: "0.8125rem", fontWeight: 650, color: AI_ASSISTANT_ENABLED ? "#16a34a" : "#b45309", letterSpacing: "-0.01em" }}>
              <Sparkles size={13} />
              {AI_ASSISTANT_ENABLED ? "AI-támogatott projekt felvétel" : "AI projekt asszisztens hamarosan"}
            </span>
          </div>
          <h2 style={{ fontSize: "clamp(1.875rem, 3.2vw, 2.875rem)", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.15, color: "#0f1117", margin: "0 0 1.25rem" }}>
            Készen állsz beszélni a{" "}
            <span style={{ position: "relative", display: "inline-block" }}>
              <span style={{ color: "#22c55e" }}>projektedről</span>
              <span style={{ position: "absolute", bottom: "-2px", left: 0, right: 0, height: "3px", background: "linear-gradient(90deg, #22c55e, #86efac)", borderRadius: "9999px", opacity: 0.45, display: "block" }} />
            </span>?
          </h2>
          <p style={{ fontSize: "1.0625rem", lineHeight: 1.75, color: "#6e6e80", margin: "0 auto", maxWidth: "560px" }}>
            {AI_ASSISTANT_ENABLED
              ? "Írd le röviden az ötletedet vagy problémádat, és az AI asszisztens segít pontosítani az igényeket, mielőtt elküldené nekem."
              : "Írd le röviden az ötletedet vagy problémádat. Az AI asszisztens ezen a felületen hamarosan érkezik."}
          </p>
        </motion.div>

        {/* Two-column grid */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.65, delay: 0.15, ease: [0.22, 1, 0.36, 1] }} className="contact-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", alignItems: "stretch", marginBottom: "3.5rem" }}>

          {/* Left: AI panel */}
          <AnimatePresence mode="wait">
            {chatPhase === "demo" ? (
              <motion.div key="demo" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                <AIDemoCard />
              </motion.div>
            ) : (
              <motion.div key="interactive" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}>
                <AIChatInteractive
                  messages={messages}
                  isLoading={isAiLoading}
                  chatError={chatError}
                  onSend={handleUserSend}
                  onRetry={retryLast}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Right: Form or success */}
          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div key="submitted" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                <SubmittedState onReset={handleReset} />
              </motion.div>
            ) : (
              <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                <ProjectForm
                  form={form}
                  setForm={setForm}
                  errors={formErrors}
                  focused={focused}
                  setFocused={setFocused}
                  onFieldFocus={handleFieldFocus}
                  onFieldBlur={handleFieldBlur}
                  onSubmit={handleSubmit}
                  submitting={submitting}
                  submissionError={submissionError}
                  chatPhase={chatPhase}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Bottom trust cards */}
        <div ref={bottomRef}>
          <motion.div initial={{ opacity: 0, y: 14 }} animate={bottomInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }} className="contact-trust-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.875rem", marginBottom: "1.25rem" }}>
            {BOTTOM_CARDS.map((c) => (
              <div key={c.label} style={{ display: "flex", alignItems: "center", gap: "0.75rem", background: "#fff", border: "1px solid rgba(0,0,0,0.06)", borderRadius: "1rem", padding: "1rem 1.25rem", transition: "border-color 0.15s, box-shadow 0.15s, transform 0.12s", cursor: "default" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = c.color + "44"; e.currentTarget.style.boxShadow = `0 4px 16px ${c.color}14`; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(0,0,0,0.06)"; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "translateY(0)"; }}
              >
                <span style={{ width: "36px", height: "36px", borderRadius: "0.75rem", background: c.bg, display: "flex", alignItems: "center", justifyContent: "center", color: c.color, flexShrink: 0 }}>{c.icon}</span>
                <span style={{ fontSize: "0.875rem", fontWeight: 650, color: "#0f1117", letterSpacing: "-0.02em", lineHeight: 1.3 }}>{c.label}</span>
              </div>
            ))}
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 14 }} animate={bottomInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }} style={{ background: "linear-gradient(135deg, #0f1117 0%, #1a1d27 100%)", borderRadius: "1.5rem", padding: "clamp(1.875rem, 3.5vw, 2.75rem) clamp(2rem, 4vw, 3rem)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "2rem", flexWrap: "wrap", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", width: "320px", height: "320px", borderRadius: "50%", background: "radial-gradient(circle, rgba(34,197,94,0.09) 0%, transparent 70%)", top: "-100px", right: "60px", pointerEvents: "none" }} />
            <div style={{ position: "absolute", top: "1.25rem", left: "2.25rem", fontSize: "5.5rem", lineHeight: 1, color: "rgba(34,197,94,0.08)", fontFamily: "Georgia, serif", fontWeight: 900, pointerEvents: "none", userSelect: "none" }}>"</div>
            <p style={{ fontSize: "clamp(1.0625rem, 2vw, 1.4375rem)", fontWeight: 700, color: "rgba(255,255,255,0.9)", letterSpacing: "-0.035em", lineHeight: 1.45, margin: 0, maxWidth: "520px", position: "relative", zIndex: 1 }}>
              A legjobb projektek egy{" "}<span style={{ color: "#22c55e" }}>jó beszélgetéssel</span>{" "}kezdődnek.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", position: "relative", zIndex: 1, flexShrink: 0 }}>
              {["Ingyenes egyeztetés", "Nincs kötelezettség"].map((l) => (
                <div key={l} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <Check size={13} color="#22c55e" strokeWidth={2.5} />
                  <span style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.6)", fontWeight: 500 }}>{l}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulseGreen {
          0%, 100% { box-shadow: 0 0 0 3px rgba(34,197,94,0.22); }
          50%       { box-shadow: 0 0 0 6px rgba(34,197,94,0.08); }
        }
        @media (max-width: 900px) {
          .contact-grid { grid-template-columns: 1fr !important; }
          .contact-trust-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .contact-name-email { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 540px) {
          .contact-trust-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
