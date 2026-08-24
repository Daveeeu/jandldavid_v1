import { Suspense, lazy, useState, useEffect, useRef } from "react";
import { motion, useInView } from "motion/react";
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { AnalyticsProvider, track, CTA_ID } from "@/analytics";
import { CapabilitiesSection } from "./components/CapabilitiesSection";
import { ProcessSection } from "./components/ProcessSection";
import { ProjectsSection } from "./components/ProjectsSection";
import { TrustSection } from "./components/TrustSection";
import { ContactSection } from "./components/ContactSection";
import { FAQSection } from "./components/FAQSection";
import { Footer } from "./components/Footer";
import { CookieBanner } from "./components/CookieBanner";
import { SECTION_IDS, scrollToSection, scrollToContact, scrollToContactAndConsult } from "./utils/navigation";
import { ScrollManager } from "./components/ScrollManager";
import { ArrowRight, Shield, Layers, Server, Check, ExternalLink, Menu, X, XCircle, CheckCircle2, Zap, Lock, Cloud, TrendingUp, ArrowRightLeft } from "lucide-react";
import { FLOAT_KEYFRAMES, useReducedMotion } from "./utils/animations";
import { SeoManager } from "./seo";
import profileHero from "@/imports/profile-hero.jpg";

const AboutPage = lazy(() => import("./pages/AboutPage"));
const CaseStudyPage = lazy(() => import("./pages/CaseStudyPage"));
const PerformanceVDPage = lazy(() => import("./pages/PerformanceVDPage"));
const MotoCosmoPage = lazy(() => import("./pages/MotoCosmoPage"));
const PrivacyPolicyPage = lazy(() => import("./pages/PrivacyPolicyPage"));
const CookiePolicyPage = lazy(() => import("./pages/CookiePolicyPage"));

const TECH_LOGOS = [
  {
    name: "Laravel",
    svg: (
      <svg viewBox="0 0 24 24" fill="none" style={{ width: "20px", height: "20px" }}>
        <path d="M23.642 5.43a.364.364 0 01.014.1v5.149c0 .135-.073.26-.189.326l-4.323 2.49v4.934a.378.378 0 01-.188.326L9.93 23.949a.316.316 0 01-.066.027c-.008.002-.016.008-.024.01a.348.348 0 01-.192 0c-.011-.002-.02-.008-.03-.012a.336.336 0 01-.057-.02L.497 18.755a.377.377 0 01-.189-.326V3.644a.35.35 0 01.014-.1c.003-.012.01-.02.014-.032a.366.366 0 01.037-.067c.01-.013.02-.023.03-.035.014-.012.027-.026.044-.036h.002L5.044.19a.378.378 0 01.378 0L10.02 2.98h.002c.018.01.03.023.044.035.01.012.02.022.03.035.014.02.026.042.037.067.004.012.012.02.014.032.01.032.014.066.014.1v9.652l3.76-2.164V5.53c0-.033.005-.067.014-.1.003-.012.01-.02.014-.032.011-.025.023-.047.037-.067.01-.013.02-.023.031-.035.013-.012.027-.026.043-.036h.002l4.595-2.742a.378.378 0 01.378 0l4.595 2.742h.002c.017.01.03.023.044.036.01.012.02.022.03.035.015.02.027.042.038.067.004.012.011.02.013.032zm-.74 5.032V6.179l-1.578.908-2.182 1.256v4.283l3.76-2.164zm-4.512 7.75v-4.287l-2.147 1.225-6.126 3.498v4.325l8.273-4.762zM1.064 4.078v14.29l8.273 4.763v-4.325l-4.32-2.453-.003-.002-.003-.002c-.017-.009-.03-.022-.043-.034-.012-.012-.021-.022-.031-.033-.014-.019-.026-.041-.036-.064-.005-.013-.012-.02-.015-.033-.009-.031-.013-.064-.013-.098V6.242L2.642 5.334l-1.578-.908v-.001-.347zm4.133-3.49L1.6 3.052 5.2 5.108l3.601-2.056-3.6-2.465-.004.001zm1.851 17.35l6.126-3.498 3.06-1.748-3.757-2.163-4.323 2.487-3.955 2.278 2.849 2.644zm9.75-13.208l-3.601 2.055 3.601 2.057 3.601-2.057-3.601-2.055z" fill="#FF2D20"/>
      </svg>
    ),
  },
  {
    name: "Vue.js",
    svg: (
      <svg viewBox="0 0 24 24" style={{ width: "20px", height: "20px" }}>
        <path d="M24,1.61H14.06L12,5.16,9.94,1.61H0L12,22.39ZM12,14.08,5.16,2.23H9.59L12,6.41l2.41-4.18h4.43Z" fill="#41B883"/>
        <path d="M12,14.08,5.16,2.23H9.59L12,6.41l2.41-4.18h4.43Z" fill="#34495E"/>
      </svg>
    ),
  },
  {
    name: "React",
    svg: (
      <svg viewBox="0 0 24 24" style={{ width: "20px", height: "20px" }}>
        <circle cx="12" cy="12" r="2.05" fill="#61DAFB"/>
        <ellipse cx="12" cy="12" rx="10" ry="4.2" fill="none" stroke="#61DAFB" strokeWidth="1.1"/>
        <ellipse cx="12" cy="12" rx="10" ry="4.2" fill="none" stroke="#61DAFB" strokeWidth="1.1" transform="rotate(60 12 12)"/>
        <ellipse cx="12" cy="12" rx="10" ry="4.2" fill="none" stroke="#61DAFB" strokeWidth="1.1" transform="rotate(120 12 12)"/>
      </svg>
    ),
  },
  {
    name: "Docker",
    svg: (
      <svg viewBox="0 0 24 24" style={{ width: "22px", height: "22px" }}>
        <path d="M13.983 11.078h2.119a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.119a.185.185 0 00-.185.185v1.888c0 .102.083.185.185.185m-2.954-5.43h2.118a.186.186 0 00.186-.186V3.574a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.185m0 2.716h2.118a.187.187 0 00.186-.186V6.29a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.887c0 .102.082.185.185.186m-2.93 0h2.12a.186.186 0 00.184-.186V6.29a.185.185 0 00-.185-.185H8.1a.185.185 0 00-.185.185v1.887c0 .102.083.185.185.186m-2.964 0h2.119a.186.186 0 00.185-.186V6.29a.185.185 0 00-.185-.185H5.136a.186.186 0 00-.186.185v1.887c0 .102.084.185.186.186m5.893 2.715h2.118a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.185m-2.93 0h2.12a.185.185 0 00.184-.185V9.006a.185.185 0 00-.184-.186h-2.12a.185.185 0 00-.184.185v1.888c0 .102.083.185.185.185m-2.964 0h2.119a.185.185 0 00.185-.185V9.006a.185.185 0 00-.184-.186h-2.12a.186.186 0 00-.186.186v1.887c0 .102.084.185.186.185m-2.92 0h2.12a.186.186 0 00.184-.185V9.006a.185.185 0 00-.184-.186h-2.12a.185.185 0 00-.185.186v1.887c0 .102.083.185.185.185M23.763 9.89c-.065-.051-.672-.51-1.954-.51-.338.001-.676.03-1.01.087-.248-1.7-1.653-2.53-1.716-2.566l-.344-.199-.226.327c-.284.438-.49.922-.612 1.43-.23.97-.09 1.882.403 2.661-.595.332-1.55.413-1.744.42H.751a.751.751 0 00-.75.748 11.376 11.376 0 00.692 4.062c.545 1.428 1.355 2.48 2.41 3.124 1.18.723 3.1 1.137 5.275 1.137.983.003 1.963-.086 2.93-.266a12.248 12.248 0 003.823-1.389c.98-.567 1.86-1.288 2.61-2.136 1.252-1.418 1.998-2.997 2.553-4.4h.221c1.372 0 2.215-.549 2.68-1.009.309-.293.55-.65.707-1.046l.098-.288z" fill="#2496ED"/>
      </svg>
    ),
  },
  {
    name: "Linux",
    svg: (
      <svg viewBox="0 0 24 24" style={{ width: "20px", height: "20px" }}>
        <path d="M12.504 0c-.155 0-.315.008-.48.021-4.226.333-3.105 4.807-3.17 6.298-.076 1.092-.3 1.953-1.05 3.02-.885 1.09-2.412 2.032-2.412 2.032s.072 1.304.968 1.304c.836 0 1.068-.608 1.068-.608s-.228 1.308.812 1.308c.608 0 1.04-.768 1.04-.768s.072 1.416.88 1.416c.748 0 1.48-1.14 1.48-1.14l.108.524c.06.288.156.528.276.72l.072.12c.012.024.024.048.048.072.252.396.684.672 1.14.74h.172c.48-.068.924-.36 1.18-.764.012-.024.024-.048.048-.072l.072-.12c.12-.192.216-.432.276-.72l.108-.524s.732 1.14 1.48 1.14c.808 0 .88-1.416.88-1.416s.432.768 1.04.768c1.04 0 .812-1.308.812-1.308s.232.608 1.068.608c.896 0 .968-1.304.968-1.304s-1.527-.942-2.412-2.032c-.75-1.067-.974-1.928-1.05-3.02-.065-1.491 1.056-5.965-3.17-6.298a6.956 6.956 0 00-.48-.021zm.504 5.508c.228 0 .408.168.408.396s-.18.396-.408.396a.398.398 0 01-.408-.396c0-.228.18-.396.408-.396zm-1.8.012c.228 0 .408.168.408.396s-.18.396-.408.396a.398.398 0 01-.408-.396c0-.228.18-.396.408-.396zM8.04 9.024c.6-.384 1.312-.576 2.1-.576.724 0 1.4.192 1.98.528.036.024.072.024.108 0a3.996 3.996 0 011.98-.528c.756 0 1.476.204 2.1.576.384.228.756.528 1.056.9.228.288.396.6.528.924-.132-.168-.288-.324-.456-.456-.636-.516-1.452-.828-2.34-.828-.804 0-1.56.252-2.184.672a.336.336 0 01-.36 0 3.97 3.97 0 00-2.184-.672c-.888 0-1.704.312-2.34.828-.168.132-.324.288-.456.456.132-.324.3-.636.528-.924.3-.372.672-.672 1.056-.9zm3.96 5.508c-1.104 0-2.004-.9-2.004-2.004 0-1.104.9-2.004 2.004-2.004 1.104 0 2.004.9 2.004 2.004 0 1.104-.9 2.004-2.004 2.004zm-5.376 2.892c.6 0 1.068-.468 1.068-1.068s-.468-1.068-1.068-1.068-1.068.468-1.068 1.068.468 1.068 1.068 1.068zm10.752 0c.6 0 1.068-.468 1.068-1.068s-.468-1.068-1.068-1.068-1.068.468-1.068 1.068.468 1.068 1.068 1.068zM9 21.348c-.504-.204-.84-.696-.84-1.248 0-.756.612-1.368 1.368-1.368.072 0 .144.012.204.024-.384.396-.612.936-.612 1.524 0 .396.096.768.276 1.092C9.264 21.36 9.132 21.348 9 21.348zm6.408 0a2.74 2.74 0 00.276-1.092c0-.588-.228-1.128-.612-1.524.06-.012.132-.024.204-.024.756 0 1.368.612 1.368 1.368 0 .552-.336 1.044-.84 1.248-.132 0-.264.012-.396.024zm-3.18 1.344c-1.32 0-2.496-.552-3.348-1.44.12 0 .24-.012.36-.012 1.104 0 2.052.576 2.592 1.44h.792c.54-.864 1.488-1.44 2.592-1.44.12 0 .24.012.36.012-.852.888-2.028 1.44-3.348 1.44z" fill="#FCC624"/>
      </svg>
    ),
  },
  {
    name: "AWS",
    svg: (
      <svg viewBox="0 0 24 24" style={{ width: "22px", height: "22px" }}>
        <path d="M6.763 10.036c0 .296.032.535.088.71.064.176.144.368.256.576a.347.347 0 01.056.184c0 .08-.048.16-.152.24l-.503.335a.383.383 0 01-.208.072c-.08 0-.16-.04-.239-.112a2.47 2.47 0 01-.287-.375 6.18 6.18 0 01-.248-.471c-.622.734-1.405 1.101-2.347 1.101-.67 0-1.205-.191-1.596-.574-.391-.384-.59-.894-.59-1.533 0-.678.239-1.23.726-1.644.487-.415 1.133-.623 1.955-.623.272 0 .551.024.846.064.296.04.6.104.918.176v-.583c0-.607-.127-1.03-.375-1.277-.255-.248-.686-.367-1.3-.367-.28 0-.568.031-.863.103-.295.072-.583.16-.862.272a2.287 2.287 0 01-.28.104.488.488 0 01-.127.023c-.112 0-.168-.08-.168-.247v-.391c0-.128.016-.224.056-.28a.597.597 0 01.224-.167c.28-.144.616-.264 1.005-.36a4.84 4.84 0 011.246-.151c.95 0 1.644.216 2.091.647.439.43.662 1.085.662 1.963v2.586zm-3.24 1.214c.263 0 .534-.048.822-.144.287-.096.543-.271.758-.51.128-.152.224-.32.272-.512.047-.191.08-.423.08-.694v-.335a6.66 6.66 0 00-.735-.136 6.02 6.02 0 00-.75-.048c-.535 0-.926.104-1.19.32-.263.215-.39.518-.39.917 0 .375.095.655.295.846.191.2.47.296.838.296zm6.41.862c-.144 0-.240-.024-.304-.08-.064-.048-.12-.16-.168-.311L7.586 5.55a1.398 1.398 0 01-.072-.32c0-.128.064-.2.191-.2h.783c.151 0 .255.025.31.08.065.048.113.16.16.312l1.342 5.284 1.245-5.284c.04-.16.088-.264.151-.312a.549.549 0 01.32-.08h.638c.152 0 .256.025.32.08.063.048.12.16.151.312l1.261 5.348 1.381-5.348c.048-.16.104-.264.16-.312a.52.52 0 01.311-.08h.743c.127 0 .2.065.2.2 0 .04-.009.08-.017.128a1.137 1.137 0 01-.056.2l-1.923 6.17c-.048.16-.104.263-.168.311a.51.51 0 01-.303.08h-.687c-.151 0-.255-.024-.32-.08-.063-.056-.119-.16-.15-.32l-1.238-5.148-1.23 5.14c-.04.16-.087.264-.15.32-.065.056-.177.08-.32.08zm10.256.215c-.415 0-.83-.048-1.229-.143-.399-.096-.71-.2-.918-.32-.128-.071-.215-.151-.247-.223a.563.563 0 01-.048-.224v-.407c0-.167.064-.247.183-.247.048 0 .096.008.144.024.048.016.12.048.2.08.271.12.566.215.878.279.319.064.63.096.95.096.502 0 .894-.088 1.165-.264a.86.86 0 00.415-.758.777.777 0 00-.215-.559c-.144-.151-.416-.287-.807-.415l-1.157-.36c-.583-.183-1.014-.454-1.277-.813a1.902 1.902 0 01-.4-1.158c0-.335.073-.63.216-.886.144-.255.335-.479.575-.654.24-.184.51-.32.83-.415.32-.096.655-.136 1.006-.136.175 0 .359.008.535.032.183.024.35.056.518.088.16.04.312.08.455.127.144.048.256.096.336.144a.69.69 0 01.24.2.43.43 0 01.071.263v.375c0 .168-.064.256-.184.256a.83.83 0 01-.303-.096 3.652 3.652 0 00-1.532-.311c-.455 0-.815.071-1.062.224-.248.152-.375.383-.375.71 0 .224.08.416.24.567.159.152.454.304.877.44l1.134.358c.574.184.99.44 1.237.767.247.327.367.702.367 1.117 0 .343-.072.655-.207.926-.144.272-.336.511-.583.703-.248.2-.543.343-.886.447-.36.111-.734.167-1.142.167z" fill="#FF9900"/>
        <path d="M20.16 17.112c-2.4 1.776-5.887 2.718-8.886 2.718-4.206 0-7.99-1.556-10.855-4.14-.224-.2-.024-.478.248-.32 3.09 1.8 6.907 2.88 10.855 2.88 2.662 0 5.59-.552 8.286-1.696.408-.175.751.271.351.558zm1.01-1.15c-.304-.391-2.024-.184-2.8-.096-.232.024-.272-.176-.056-.335 1.374-.968 3.625-.686 3.889-.365.264.33-.072 2.594-1.358 3.675-.2.167-.39.079-.302-.144.287-.727.934-2.334.63-2.734z" fill="#FF9900"/>
      </svg>
    ),
  },
];

const PROBLEMS = [
  { label: "Lassú weboldalak" },
  { label: "Instabil rendszerek" },
  { label: "Biztonsági hiányosságok" },
  { label: "Rossz felhasználói élmény" },
  { label: "Nem skálázható architektúra" },
  { label: "Túl sok különálló szolgáltató" },
];

const SOLUTIONS = [
  { label: "Gyors és modern rendszerek" },
  { label: "Security-first fejlesztés" },
  { label: "Stabil infrastruktúra" },
  { label: "Skálázható architektúra" },
  { label: "Üzleti célokra optimalizált UX" },
  { label: "Egy kézben kezelt technikai háttér" },
];

const TRUST_METRICS = [
  { icon: <Zap size={20} />, label: "Gyors működés", color: "#f59e0b", bg: "#fffbeb" },
  { icon: <Lock size={20} />, label: "Security-first", color: "#22c55e", bg: "#f0fdf4" },
  { icon: <Cloud size={20} />, label: "Cloud ready", color: "#3b82f6", bg: "#eff6ff" },
  { icon: <TrendingUp size={20} />, label: "Növekedésre tervezve", color: "#8b5cf6", bg: "#faf5ff" },
];

function ProblemSolutionSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      style={{
        background: "#ffffff",
        padding: "7rem 1.5rem",
      }}
    >
      <div style={{ maxWidth: "72rem", margin: "0 auto" }}>

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{ textAlign: "center", marginBottom: "4rem" }}
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
            A legtöbb webes rendszer nem a design miatt{" "}
            <span style={{ position: "relative", display: "inline-block" }}>
              <span style={{ color: "#ef4444" }}>bukik el</span>
              <span
                style={{
                  position: "absolute",
                  bottom: "-2px",
                  left: 0,
                  right: 0,
                  height: "3px",
                  background: "linear-gradient(90deg, #ef4444, #fca5a5)",
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
              maxWidth: "560px",
            }}
          >
            A gyenge infrastruktúra, a lassú működés és a rossz felhasználói élmény hosszú távon komoly üzleti veszteséget okozhat.
          </p>
        </motion.div>

        {/* Cards row */}
        <div
          className="problem-solution-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto 1fr",
            gap: "0",
            alignItems: "stretch",
            marginBottom: "3rem",
          }}
        >
          {/* Problem card */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            style={{
              background: "linear-gradient(145deg, #fff5f5 0%, #fff 60%)",
              border: "1px solid rgba(239,68,68,0.12)",
              borderRadius: "1.5rem",
              padding: "2.25rem",
              boxShadow: "0 4px 24px rgba(239,68,68,0.06), 0 1px 4px rgba(0,0,0,0.04)",
            }}
          >
            {/* Card header */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.75rem" }}>
              <span
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "0.75rem",
                  background: "#fef2f2",
                  border: "1px solid rgba(239,68,68,0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#ef4444",
                  flexShrink: 0,
                }}
              >
                <XCircle size={18} />
              </span>
              <span
                style={{
                  fontSize: "1rem",
                  fontWeight: 700,
                  color: "#0f1117",
                  letterSpacing: "-0.025em",
                }}
              >
                Gyakori problémák
              </span>
            </div>

            {/* Items */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {PROBLEMS.map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -12 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.25 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    padding: "0.75rem 1rem",
                    background: "rgba(255,255,255,0.7)",
                    borderRadius: "0.875rem",
                    border: "1px solid rgba(239,68,68,0.08)",
                  }}
                >
                  <span style={{ color: "#ef4444", display: "flex", flexShrink: 0 }}>
                    <XCircle size={16} strokeWidth={2} />
                  </span>
                  <span style={{ fontSize: "0.9rem", color: "#374151", fontWeight: 500, letterSpacing: "-0.01em" }}>
                    {item.label}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Connector */}
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="ps-connector"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "0 1.5rem",
              gap: "0.5rem",
            }}
          >
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #f0fdf4, #dcfce7)",
                border: "1.5px solid #bbf7d0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#22c55e",
                boxShadow: "0 4px 16px rgba(34,197,94,0.18)",
              }}
            >
              <ArrowRightLeft size={18} strokeWidth={2} />
            </div>
            <span
              style={{
                fontSize: "0.6875rem",
                fontWeight: 700,
                color: "#22c55e",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                textAlign: "center",
                lineHeight: 1.3,
                maxWidth: "52px",
              }}
            >
              vs
            </span>
          </motion.div>

          {/* Solution card */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            style={{
              background: "linear-gradient(145deg, #f0fdf4 0%, #fff 60%)",
              border: "1px solid rgba(34,197,94,0.14)",
              borderRadius: "1.5rem",
              padding: "2.25rem",
              boxShadow: "0 4px 24px rgba(34,197,94,0.07), 0 1px 4px rgba(0,0,0,0.04)",
            }}
          >
            {/* Card header */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.75rem" }}>
              <span
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "0.75rem",
                  background: "#f0fdf4",
                  border: "1px solid rgba(34,197,94,0.18)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#22c55e",
                  flexShrink: 0,
                }}
              >
                <CheckCircle2 size={18} />
              </span>
              <span
                style={{
                  fontSize: "1rem",
                  fontWeight: 700,
                  color: "#0f1117",
                  letterSpacing: "-0.025em",
                }}
              >
                Mit kínál egy technikai partner?
              </span>
            </div>

            {/* Items */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {SOLUTIONS.map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: 12 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.25 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    padding: "0.75rem 1rem",
                    background: "rgba(255,255,255,0.7)",
                    borderRadius: "0.875rem",
                    border: "1px solid rgba(34,197,94,0.1)",
                  }}
                >
                  <span style={{ color: "#22c55e", display: "flex", flexShrink: 0 }}>
                    <CheckCircle2 size={16} strokeWidth={2} />
                  </span>
                  <span style={{ fontSize: "0.9rem", color: "#374151", fontWeight: 500, letterSpacing: "-0.01em" }}>
                    {item.label}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Trust metrics bar */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="trust-metrics-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "1rem",
          }}
        >
          {TRUST_METRICS.map((m) => (
            <div
              key={m.label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.875rem",
                background: "#fafafa",
                border: "1px solid rgba(0,0,0,0.055)",
                borderRadius: "1.125rem",
                padding: "1.125rem 1.375rem",
                transition: "border-color 0.15s, box-shadow 0.15s, transform 0.12s",
                cursor: "default",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = m.color + "44";
                e.currentTarget.style.boxShadow = `0 4px 20px ${m.color}18`;
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
                  width: "38px",
                  height: "38px",
                  borderRadius: "0.75rem",
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
                  fontSize: "0.9rem",
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

      </div>
    </section>
  );
}

// ─── Root export — wraps everything in BrowserRouter ──────────────────────────
export default function App() {
  return (
    <BrowserRouter>
      <ScrollManager />
      <SeoManager />
      <AnalyticsProvider>
        <CookieBanner />
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/adatvedelem" element={<PrivacyPolicyPage />} />
            <Route path="/sutik" element={<CookiePolicyPage />} />
            <Route path="/projektek/performancevd" element={<PerformanceVDPage />} />
            <Route path="/projektek/motocosmos" element={<MotoCosmoPage />} />
            <Route path="/projektek/:slug" element={<CaseStudyPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </AnalyticsProvider>
    </BrowserRouter>
  );
}

function RouteFallback() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f9f9fb",
        color: "#0f1117",
        fontFamily: "'Inter', sans-serif",
        fontWeight: 600,
      }}
    >
      Betöltés...
    </div>
  );
}

function NotFoundPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        background: "#f9f9fb",
        color: "#0f1117",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <div style={{ maxWidth: "32rem", textAlign: "center" }}>
        <div style={{ fontSize: "3rem", fontWeight: 800, letterSpacing: "-0.05em", marginBottom: "0.75rem" }}>
          404
        </div>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 800, letterSpacing: "-0.04em", margin: "0 0 0.75rem" }}>
          Ez az oldal nem található.
        </h1>
        <p style={{ color: "#6e6e80", lineHeight: 1.7, margin: 0 }}>
          A keresett oldal jelenleg nem érhető el. A főoldalon megtalálod a projekteket, szolgáltatásokat és a kapcsolatfelvételi lehetőségeket.
        </p>
      </div>
    </div>
  );
}

// ─── Active-section detection ─────────────────────────────────────────────────
function useActiveSection() {
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const ids = Object.values(SECTION_IDS);
    const observers = ids.map((id) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(id); },
        { rootMargin: "-40% 0px -55% 0px" }
      );
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach((o) => o?.disconnect());
  }, []);

  return active;
}

// ─── Nav item config ──────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { label: "Projektek",      sectionId: SECTION_IDS.projects },
  { label: "Szolgáltatások", sectionId: SECTION_IDS.services },
  { label: "Folyamat",       sectionId: SECTION_IDS.process },
  { label: "Rólam",          href: "/about" },
] as const;

// ─── Home page ────────────────────────────────────────────────────────────────
function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [parallax, setParallax] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLDivElement>(null);
  const isReducedMotion = useReducedMotion();
  const activeSection = useActiveSection();
  const navigate = useNavigate();
  const { pathname } = useLocation();

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

  function handleNavClick(item: typeof NAV_ITEMS[number]) {
    setMenuOpen(false);
    if ("href" in item) { navigate(item.href); return; }
    scrollToSection(item.sectionId);
  }

  function handleHeroMouseMove(e: React.MouseEvent<HTMLElement>) {
    if (isReducedMotion || window.innerWidth < 900) return;
    const rect = heroRef.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    setParallax({
      x: ((e.clientX - cx) / (rect.width / 2)) * 7,
      y: ((e.clientY - cy) / (rect.height / 2)) * 5,
    });
  }

  function handleHeroMouseLeave() {
    setParallax({ x: 0, y: 0 });
  }

  return (
    <div
      className="min-h-screen bg-white"
      style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}
    >
      {/* Nav */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: scrolled ? "rgba(255,255,255,0.88)" : "transparent",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(0,0,0,0.06)" : "none",
        }}
      >
        <div
          style={{
            maxWidth: "72rem",
            margin: "0 auto",
            padding: "0 1.5rem",
            height: "64px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.1 }}>
            <span style={{ fontWeight: 800, fontSize: "0.9375rem", letterSpacing: "-0.03em", color: "#0f1117" }}>Jandl Dávid</span>
            <span style={{ fontSize: "0.6875rem", fontWeight: 600, color: "#22c55e", letterSpacing: "0.02em" }}>Technikai partner</span>
          </div>
          <div className="hidden md:flex" style={{ alignItems: "center", gap: "1.75rem" }}>
            {NAV_ITEMS.map((item) => {
              const sectionId = "sectionId" in item ? item.sectionId : undefined;
              const href = "href" in item ? item.href : undefined;
              // Section items: active when that section is in the viewport
              // Href items: active when the current path matches (e.g. /about, /blog)
              const isActive =
                (!!sectionId && activeSection === sectionId) ||
                (!!href && pathname.startsWith(href)) ||
                (item.label === "Projektek" && pathname.startsWith("/projektek"));
              return (
                <button
                  key={item.label}
                  onClick={() => handleNavClick(item)}
                  style={{
                    fontSize: "0.875rem",
                    color: isActive ? "#22c55e" : "#6e6e80",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontWeight: isActive ? 650 : 500,
                    padding: "0.25rem 0",
                    letterSpacing: "-0.01em",
                    transition: "color 0.15s",
                    position: "relative",
                  }}
                  onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.color = "#0f1117"; }}
                  onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.color = "#6e6e80"; }}
                >
                  {item.label}
                  {isActive && (
                    <span style={{ position: "absolute", bottom: "-2px", left: 0, right: 0, height: "2px", background: "#22c55e", borderRadius: "9999px" }} />
                  )}
                </button>
              );
            })}
            <button
              onClick={() => {
                track.trackCtaClicked(CTA_ID.NAV_CONTACT, "Kapcsolat", "nav", "nav", "navigation");
                scrollToContact();
              }}
              style={{
                fontSize: "0.875rem",
                fontWeight: 650,
                color: "#fff",
                background: "#0f1117",
                padding: "0.5rem 1.25rem",
                borderRadius: "0.625rem",
                border: "none",
                cursor: "pointer",
                letterSpacing: "-0.01em",
                transition: "background 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#22c55e")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#0f1117")}
            >
              Kapcsolat
            </button>
          </div>
          <button
            className="md:hidden"
            style={{
              color: "#0f1117",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "0.5rem",
            }}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {menuOpen && (
          <div
            style={{
              background: "rgba(255,255,255,0.97)",
              backdropFilter: "blur(20px)",
              borderTop: "1px solid rgba(0,0,0,0.06)",
              padding: "1.5rem",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}
          >
            {NAV_ITEMS.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavClick(item)}
                style={{ fontSize: "1rem", color: "#0f1117", background: "none", border: "none", cursor: "pointer", fontWeight: 500, textAlign: "left", padding: "0.25rem 0" }}
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => { setMenuOpen(false); scrollToContact(); }}
              style={{ fontSize: "1rem", color: "#22c55e", background: "none", border: "none", cursor: "pointer", fontWeight: 700, textAlign: "left", padding: "0.25rem 0" }}
            >
              Kapcsolat →
            </button>
          </div>
        )}
      </nav>

      {/* Main content — used for keyboard focus after navigation */}
      <main id="main-content" tabIndex={-1} style={{ outline: "none" }}>

      {/* Hero */}
      <section
        ref={heroRef}
        onMouseMove={handleHeroMouseMove}
        onMouseLeave={handleHeroMouseLeave}
        style={{
          paddingTop: "7rem",
          paddingBottom: "5rem",
          background: "linear-gradient(160deg, #fafffc 0%, #f0fdf4 40%, #ffffff 100%)",
        }}
      >
        <div
          className="hero-grid"
          style={{
            maxWidth: "72rem",
            margin: "0 auto",
            padding: "0 1.5rem",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "4rem",
            alignItems: "center",
          }}
        >
          {/* Left column */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}
          >
            {/* Status badge */}
            <div>
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
                    width: "7px",
                    height: "7px",
                    borderRadius: "50%",
                    background: "#22c55e",
                    display: "inline-block",
                    flexShrink: 0,
                    animation: "pulseGreen 2s ease-in-out infinite",
                  }}
                />
                Elérhető új együttműködésekre
              </span>
            </div>

            {/* Headline */}
            <h1
              style={{
                fontSize: "clamp(2.2rem, 3.8vw, 3.4rem)",
                fontWeight: 800,
                lineHeight: 1.1,
                letterSpacing: "-0.04em",
                color: "#0f1117",
                margin: 0,
              }}
            >
              Megbízható technikai háttér a{" "}
              <span style={{ position: "relative", display: "inline" }}>
                <span style={{ color: "#22c55e" }}>vállalkozásod mögé</span>
                <span
                  style={{
                    position: "absolute",
                    bottom: "-2px",
                    left: 0,
                    right: 0,
                    height: "3px",
                    background: "linear-gradient(90deg, #22c55e, #86efac)",
                    borderRadius: "9999px",
                    opacity: 0.5,
                    display: "block",
                  }}
                />
              </span>
              .
            </h1>

            {/* Supporting copy */}
            <p
              style={{
                fontSize: "1.0625rem",
                lineHeight: 1.75,
                color: "#6e6e80",
                margin: 0,
                maxWidth: "460px",
              }}
            >
              Technikai partnerként segítem a vállalkozásokat az ötlettől az éles rendszerig — webes platformok, megbízható infrastruktúra és biztonságközpontú fejlesztés egyetlen kézben.
            </p>

            {/* CTAs */}
            <div style={{ display: "flex", gap: "0.875rem", flexWrap: "wrap", alignItems: "center" }}>
              <button
                onClick={() => {
                  track.trackCtaClicked(CTA_ID.HERO_PRIMARY, "Indítsük el a fejlesztést", "primary", "hero", "hero");
                  scrollToContact();
                }}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  background: "#0f1117",
                  color: "#fff",
                  border: "none",
                  borderRadius: "0.75rem",
                  padding: "0.8125rem 1.625rem",
                  fontSize: "0.9375rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  letterSpacing: "-0.02em",
                  transition: "background 0.15s, transform 0.12s, box-shadow 0.15s",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#22c55e";
                  e.currentTarget.style.transform = "translateY(-1px)";
                  e.currentTarget.style.boxShadow = "0 6px 20px rgba(34,197,94,0.35)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#0f1117";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.12)";
                }}
              >
                Indítsük el a fejlesztést
                <ArrowRight size={16} />
              </button>

              <button
                onClick={() => {
                  track.trackCtaClicked(CTA_ID.HERO_SECONDARY, "Kérj szakmai konzultációt", "secondary", "hero", "hero");
                  scrollToContactAndConsult();
                }}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  background: "transparent",
                  color: "#0f1117",
                  border: "1.5px solid rgba(0,0,0,0.12)",
                  borderRadius: "0.75rem",
                  padding: "0.8125rem 1.625rem",
                  fontSize: "0.9375rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  letterSpacing: "-0.02em",
                  transition: "border-color 0.15s, background 0.15s, transform 0.12s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#22c55e";
                  e.currentTarget.style.background = "#f0fdf4";
                  e.currentTarget.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(0,0,0,0.12)";
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                Kérj szakmai konzultációt
                <ExternalLink size={15} style={{ opacity: 0.55 }} />
              </button>
            </div>

            {/* Trust indicators */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {["Hosszú távú együttműködés", "Üzleti fókusz, nem csak kód", "Tervezéstől az üzemeltetésig"].map((item) => (
                <div key={item} style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
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
                  <span style={{ fontSize: "0.875rem", color: "#6e6e80", fontWeight: 500 }}>
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right column — portrait + glassmorphism cards */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="hero-portrait-col"
            style={{ position: "relative", display: "flex", justifyContent: "center" }}
          >
            {/* Parallax + float wrapper */}
            <div
              style={{
                position: "relative",
                width: "100%",
                display: "flex",
                justifyContent: "center",
                transform: !isReducedMotion ? `translate(${parallax.x}px, ${parallax.y}px)` : "none",
                transition: "transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)",
                willChange: "transform",
              }}
            >
              {/* Ambient glow */}
              <div
                style={{
                  position: "absolute",
                  width: "440px",
                  height: "440px",
                  borderRadius: "50%",
                  background: "radial-gradient(circle, rgba(34,197,94,0.14) 0%, transparent 70%)",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  pointerEvents: "none",
                  zIndex: 0,
                  animation: "subtleGlow 6s ease-in-out infinite",
                }}
              />

              {/* Portrait */}
              <div
                style={{
                  position: "relative",
                  zIndex: 1,
                  width: "320px",
                  height: "400px",
                  borderRadius: "2rem",
                  overflow: "hidden",
                  boxShadow:
                    "0 0 0 1px rgba(0,0,0,0.05), 0 24px 64px rgba(0,0,0,0.12), 0 8px 24px rgba(0,0,0,0.08)",
                  background: "#ecfdf5",
                  flexShrink: 0,
                }}
              >
                <img
                  src={profileHero}
                  alt="Jandl Dávid portréja hajón, szabadtéri környezetben"
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(to top, rgba(15,17,23,0.14) 0%, transparent 50%)",
                    pointerEvents: "none",
                  }}
                />
              </div>

              {/* Card: top-left */}
              <motion.div
                initial={{ opacity: 0, x: -16, y: -8 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ delay: 0.55, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                style={{ position: "absolute", top: "24px", left: "0px", zIndex: 2 }}
              >
                <div
                  className="anim-float-a"
                  style={{
                    background: "rgba(255,255,255,0.82)",
                    backdropFilter: "blur(24px)",
                    WebkitBackdropFilter: "blur(24px)",
                    border: "1px solid rgba(255,255,255,0.95)",
                    borderRadius: "1rem",
                    padding: "0.75rem 1.125rem",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.09), 0 2px 8px rgba(0,0,0,0.05)",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.625rem",
                    whiteSpace: "nowrap",
                  }}
                >
                  <span
                    style={{
                      width: "28px",
                      height: "28px",
                      borderRadius: "0.5rem",
                      background: "#f0fdf4",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#22c55e",
                      flexShrink: 0,
                    }}
                  >
                    <Layers size={15} />
                  </span>
                  <span style={{ fontSize: "0.8125rem", fontWeight: 650, color: "#0f1117", letterSpacing: "-0.02em" }}>
                    Full-stack fejlesztő
                  </span>
                </div>
              </motion.div>

              {/* Card: right-center */}
              <motion.div
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                style={{ position: "absolute", top: "50%", right: "-8px", zIndex: 2 }}
              >
                <div
                  className="anim-float-b"
                  style={{
                    background: "rgba(255,255,255,0.82)",
                    backdropFilter: "blur(24px)",
                    WebkitBackdropFilter: "blur(24px)",
                    border: "1px solid rgba(255,255,255,0.95)",
                    borderRadius: "1rem",
                    padding: "0.75rem 1.125rem",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.09), 0 2px 8px rgba(0,0,0,0.05)",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.625rem",
                    whiteSpace: "nowrap",
                    transform: "translateY(-50%)",
                  }}
                >
                  <span
                    style={{
                      width: "28px",
                      height: "28px",
                      borderRadius: "0.5rem",
                      background: "#eff6ff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#3b82f6",
                      flexShrink: 0,
                    }}
                  >
                    <Server size={15} />
                  </span>
                  <span style={{ fontSize: "0.8125rem", fontWeight: 650, color: "#0f1117", letterSpacing: "-0.02em" }}>
                    Infrastrukturális tervezés
                  </span>
                </div>
              </motion.div>

              {/* Card: bottom-left */}
              <motion.div
                initial={{ opacity: 0, x: -16, y: 16 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ delay: 0.85, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                style={{ position: "absolute", bottom: "32px", left: "8px", zIndex: 2 }}
              >
                <div
                  className="anim-float-c"
                  style={{
                    background: "rgba(255,255,255,0.82)",
                    backdropFilter: "blur(24px)",
                    WebkitBackdropFilter: "blur(24px)",
                    border: "1px solid rgba(255,255,255,0.95)",
                    borderRadius: "1rem",
                    padding: "0.75rem 1.125rem",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.09), 0 2px 8px rgba(0,0,0,0.05)",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.625rem",
                    whiteSpace: "nowrap",
                  }}
                >
                  <span
                    style={{
                      width: "28px",
                      height: "28px",
                      borderRadius: "0.5rem",
                      background: "#faf5ff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#8b5cf6",
                      flexShrink: 0,
                    }}
                  >
                    <Shield size={15} />
                  </span>
                  <span style={{ fontSize: "0.8125rem", fontWeight: 650, color: "#0f1117", letterSpacing: "-0.02em" }}>
                    Security szemlélet
                  </span>
                </div>
              </motion.div>
            </div>{/* end parallax wrapper */}
          </motion.div>
        </div>
      </section>

      {/* Technology trust bar */}
      <section
        style={{
          borderTop: "1px solid rgba(0,0,0,0.055)",
          background: "#f9f9fb",
          padding: "2.25rem 1.5rem",
        }}
      >
        <div style={{ maxWidth: "72rem", margin: "0 auto" }}>
          <p
            style={{
              textAlign: "center",
              fontSize: "0.6875rem",
              fontWeight: 700,
              color: "#b0b0be",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: "1.625rem",
            }}
          >
            Technológiák, amikkel dolgozom
          </p>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "2.5rem",
              flexWrap: "wrap",
            }}
          >
            {TECH_LOGOS.map(({ name, svg }) => (
              <div
                key={name}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  opacity: 0.5,
                  transition: "opacity 0.15s",
                  cursor: "default",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.5")}
              >
                {svg}
                <span
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: 650,
                    color: "#0f1117",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem / Solution section */}
      <ProblemSolutionSection />

      {/* Capabilities section */}
      <div id={SECTION_IDS.services} data-section="Szolgáltatások">
        <CapabilitiesSection />
      </div>

      {/* Process section */}
      <div id={SECTION_IDS.process} data-section="Folyamat">
        <ProcessSection onViewProjects={() => scrollToSection(SECTION_IDS.projects)} />
      </div>

      {/* Projects section */}
      <div id={SECTION_IDS.projects} data-section="Projektek">
        <ProjectsSection />
      </div>

      {/* Trust section */}
      <div id={SECTION_IDS.testimonials} data-section="Bizalom">
        <TrustSection onStartProject={scrollToContact} />
      </div>

      {/* Contact / conversion section */}
      <div id={SECTION_IDS.contact} data-section="Kapcsolat">
        <ContactSection />
      </div>

      {/* FAQ section */}
      <div id={SECTION_IDS.faq} data-section="GYIK">
        <FAQSection />
      </div>

      {/* Footer */}
      <Footer />

      </main>{/* end #main-content */}

      <style>{`
        @keyframes pulseGreen {
          0%, 100% { box-shadow: 0 0 0 3px rgba(34,197,94,0.22); }
          50%       { box-shadow: 0 0 0 6px rgba(34,197,94,0.08); }
        }
        ${FLOAT_KEYFRAMES}

        * { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }

        html { scrollbar-width: none; }
        html::-webkit-scrollbar { display: none; }

        @media (max-width: 900px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
            gap: 3rem !important;
          }
          .problem-solution-grid {
            grid-template-columns: 1fr !important;
            gap: 1.25rem !important;
          }
          .ps-connector {
            flex-direction: row !important;
            padding: 0 !important;
            justify-content: center !important;
          }
          .trust-metrics-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }

        @media (max-width: 640px) {
          .hero-portrait-col { display: none !important; }
          .trust-metrics-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
