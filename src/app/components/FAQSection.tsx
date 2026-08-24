import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "motion/react";
import { Plus, Check, ArrowRight, MessageCircle } from "lucide-react";
import { track, CTA_ID } from "@/analytics";
import { scrollToContactAndConsult } from "../utils/navigation";
import siteContent from "../../../resources/seo/site-content.json";

const FAQS = siteContent.homepageFaqs.map((item) => ({
  q: item.question,
  a: item.answer,
}));

function FAQItem({
  item,
  index,
  open,
  onToggle,
  inView,
}: {
  item: { q: string; a: string };
  index: number;
  open: boolean;
  onToggle: () => void;
  inView: boolean;
}) {
  const answerId = `faq-answer-${index}`;
  const buttonId = `faq-trigger-${index}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.45, delay: 0.06 + index * 0.055, ease: [0.22, 1, 0.36, 1] }}
    >
      <div
        style={{
          background: open ? "#fafffe" : "#ffffff",
          border: open ? "1.5px solid rgba(34,197,94,0.22)" : "1.5px solid rgba(0,0,0,0.07)",
          borderRadius: "1rem",
          overflow: "hidden",
          boxShadow: open
            ? "0 4px 20px rgba(34,197,94,0.07), 0 1px 4px rgba(0,0,0,0.03)"
            : "0 2px 8px rgba(0,0,0,0.04)",
          cursor: "pointer",
          transition: "border-color 0.2s, box-shadow 0.2s, background 0.2s",
        }}
        onMouseEnter={(e) => {
          if (!open) {
            const el = e.currentTarget as HTMLDivElement;
            el.style.borderColor = "rgba(34,197,94,0.2)";
            el.style.boxShadow = "0 4px 16px rgba(34,197,94,0.06)";
          }
        }}
        onMouseLeave={(e) => {
          if (!open) {
            const el = e.currentTarget as HTMLDivElement;
            el.style.borderColor = "rgba(0,0,0,0.07)";
            el.style.boxShadow = "0 2px 8px rgba(0,0,0,0.04)";
          }
        }}
      >
        {/* Question row */}
        <button
          id={buttonId}
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          aria-controls={answerId}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "1rem",
            padding: "1.125rem 1.375rem",
            width: "100%",
            background: "transparent",
            border: "none",
            textAlign: "left",
            cursor: "pointer",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.875rem", flex: 1, minWidth: 0 }}>
            <span
              style={{
                width: "26px",
                height: "26px",
                borderRadius: "0.5rem",
                background: open ? "#f0fdf4" : "#f5f5f7",
                border: open ? "1px solid rgba(34,197,94,0.2)" : "1px solid rgba(0,0,0,0.07)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                fontSize: "0.6875rem",
                fontWeight: 700,
                color: open ? "#22c55e" : "#9ca3af",
                letterSpacing: "0.02em",
                transition: "all 0.2s",
              }}
            >
              {String(index + 1).padStart(2, "0")}
            </span>
            <span
              style={{
                fontSize: "0.9375rem",
                fontWeight: 650,
                color: open ? "#0f1117" : "#1f2937",
                letterSpacing: "-0.025em",
                lineHeight: 1.4,
                transition: "color 0.15s",
              }}
            >
              {item.q}
            </span>
          </div>

          <motion.span
            animate={{ rotate: open ? 45 : 0 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "50%",
              backgroundColor: open ? "#22c55e" : "#f5f5f7",
              border: open ? "none" : "1px solid rgba(0,0,0,0.08)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              color: open ? "#fff" : "#6e6e80",
              transition: "background-color 0.22s cubic-bezier(0.22,1,0.36,1), color 0.22s, border-color 0.22s",
            }}
          >
            <Plus size={13} strokeWidth={2.5} />
          </motion.span>
        </button>

        {/* Answer */}
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              id={answerId}
              role="region"
              aria-labelledby={buttonId}
              key="answer"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              style={{ overflow: "hidden" }}
            >
              <div
                style={{
                  padding: "0 1.375rem 1.25rem 4rem",
                  fontSize: "0.9rem",
                  color: "#6e6e80",
                  lineHeight: 1.72,
                  letterSpacing: "-0.01em",
                  borderTop: "1px solid rgba(34,197,94,0.1)",
                  paddingTop: "0.875rem",
                  marginTop: 0,
                }}
              >
                {item.a}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const bottomRef = useRef<HTMLDivElement>(null);
  const bottomInView = useInView(bottomRef, { once: true, margin: "-60px" });

  // Split into two columns
  const col1 = FAQS.filter((_, i) => i % 2 === 0);
  const col2 = FAQS.filter((_, i) => i % 2 === 1);

  const sectionOpenTime = useRef<number>(Date.now());

  const toggle = (globalIndex: number) => {
    const isOpening = openIndex !== globalIndex;
    const faq = FAQS[globalIndex];
    const dwellMs = Date.now() - sectionOpenTime.current;
    track.trackFaqInteracted(
      faq?.q || "",
      globalIndex,
      isOpening ? "expanded" : "collapsed",
      dwellMs
    );
    if (isOpening) sectionOpenTime.current = Date.now();
    setOpenIndex(isOpening ? globalIndex : null);
  };

  return (
    <section style={{ background: "#ffffff", padding: "7rem 1.5rem" }}>
      <div style={{ maxWidth: "72rem", margin: "0 auto" }}>

        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{ textAlign: "center", marginBottom: "4rem" }}
        >
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.5rem" }}>
            <span style={{
              display: "inline-flex", alignItems: "center", gap: "0.5rem",
              background: "#f0fdf4", border: "1px solid #bbf7d0",
              borderRadius: "9999px", padding: "0.375rem 1rem",
              fontSize: "0.8125rem", fontWeight: 650, color: "#16a34a", letterSpacing: "-0.01em",
            }}>
              <MessageCircle size={13} />
              Kérdések & Válaszok
            </span>
          </div>

          <h2 style={{
            fontSize: "clamp(1.875rem, 3.2vw, 2.875rem)",
            fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.15,
            color: "#0f1117", margin: "0 0 1.25rem",
          }}>
            Gyakran ismételt{" "}
            <span style={{ color: "#22c55e" }}>kérdések</span>
          </h2>

          <p style={{
            fontSize: "1.0625rem", lineHeight: 1.75, color: "#6e6e80",
            margin: "0 auto", maxWidth: "520px",
          }}>
            Ha maradt még kérdésed az együttműködéssel kapcsolatban, itt megtalálod a legfontosabb válaszokat.
          </p>
        </motion.div>

        {/* Two-column accordion grid */}
        <div
          className="faq-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "0.75rem 1.5rem",
            marginBottom: "3rem",
            alignItems: "start",
          }}
        >
          {/* Column 1 */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {col1.map((item) => {
              const globalIndex = FAQS.indexOf(item);
              return (
                <FAQItem
                  key={globalIndex}
                  item={item}
                  index={globalIndex}
                  open={openIndex === globalIndex}
                  onToggle={() => toggle(globalIndex)}
                  inView={inView}
                />
              );
            })}
          </div>

          {/* Column 2 */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {col2.map((item) => {
              const globalIndex = FAQS.indexOf(item);
              return (
                <FAQItem
                  key={globalIndex}
                  item={item}
                  index={globalIndex}
                  open={openIndex === globalIndex}
                  onToggle={() => toggle(globalIndex)}
                  inView={inView}
                />
              );
            })}
          </div>
        </div>

        {/* Bottom statement card */}
        <div ref={bottomRef}>
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={bottomInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            style={{
              background: "linear-gradient(145deg, #f0fdf4 0%, #fafffe 50%, #f0fdf4 100%)",
              border: "1.5px solid rgba(34,197,94,0.18)",
              borderRadius: "1.5rem",
              padding: "clamp(2rem, 4vw, 2.75rem)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "2.5rem",
              flexWrap: "wrap",
              boxShadow: "0 4px 24px rgba(34,197,94,0.07), 0 1px 6px rgba(0,0,0,0.03)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Decorative ring */}
            <div style={{
              position: "absolute", width: "300px", height: "300px", borderRadius: "50%",
              border: "1px solid rgba(34,197,94,0.1)",
              top: "-120px", right: "-80px", pointerEvents: "none",
            }} />
            <div style={{
              position: "absolute", width: "200px", height: "200px", borderRadius: "50%",
              border: "1px solid rgba(34,197,94,0.07)",
              top: "-60px", right: "-30px", pointerEvents: "none",
            }} />

            {/* Text */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", zIndex: 1, flex: 1 }}>
              <div>
                <h3 style={{
                  fontSize: "clamp(1.25rem, 2vw, 1.625rem)",
                  fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.2,
                  color: "#0f1117", margin: "0 0 0.625rem",
                }}>
                  Minden projekt más.
                </h3>
                <p style={{ fontSize: "1rem", color: "#4b5563", lineHeight: 1.65, margin: 0, maxWidth: "420px" }}>
                  Ezért a legjobb megoldások mindig egy valódi beszélgetéssel kezdődnek.
                </p>
              </div>

              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem 1.5rem" }}>
                {["Ingyenes első egyeztetés", "Nincs kötelezettség", "Átlátható folyamat"].map((l) => (
                  <div key={l} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span style={{
                      width: "17px", height: "17px", borderRadius: "50%",
                      background: "#fff", border: "1.5px solid #bbf7d0",
                      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                    }}>
                      <Check size={9} color="#22c55e" strokeWidth={3} />
                    </span>
                    <span style={{ fontSize: "0.875rem", color: "#4b5563", fontWeight: 550, letterSpacing: "-0.01em" }}>
                      {l}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <button
              onClick={() => {
                track.trackCtaClicked(CTA_ID.FAQ_BOTTOM, "Kérj szakmai konzultációt", "primary", "faq_section", "faq");
                scrollToContactAndConsult();
              }}
              style={{
                display: "inline-flex", alignItems: "center", gap: "0.5rem",
                background: "#0f1117", color: "#fff", border: "none",
                borderRadius: "0.875rem", padding: "0.9375rem 1.75rem",
                fontSize: "0.9375rem", fontWeight: 700, cursor: "pointer",
                letterSpacing: "-0.025em", whiteSpace: "nowrap", flexShrink: 0,
                boxShadow: "0 4px 16px rgba(0,0,0,0.14)",
                transition: "background 0.15s, transform 0.12s, box-shadow 0.15s",
                zIndex: 1,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#22c55e";
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.boxShadow = "0 6px 24px rgba(34,197,94,0.35)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#0f1117";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.14)";
              }}
            >
              Kérj szakmai konzultációt
              <ArrowRight size={15} />
            </button>
          </motion.div>
        </div>

      </div>

      <style>{`
        @media (max-width: 860px) {
          .faq-grid { grid-template-columns: 1fr !important; gap: 0.75rem !important; }
        }
      `}</style>
    </section>
  );
}
