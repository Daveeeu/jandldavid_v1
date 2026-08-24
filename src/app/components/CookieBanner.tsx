import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  grantAllConsent,
  grantAnalyticsOnly,
  hasConsentDecision,
  revokeAllConsent,
  subscribeToConsentChanges,
} from "@/analytics";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(!hasConsentDecision());

    return subscribeToConsentChanges((consent) => {
      setVisible(consent === null);
    });
  }, []);

  if (!visible) {
    return null;
  }

  const handleNecessaryOnly = () => {
    revokeAllConsent();
    setVisible(false);
  };

  const handleAnalytics = () => {
    grantAnalyticsOnly();
    setVisible(false);
  };

  const handleAll = () => {
    grantAllConsent();
    setVisible(false);
  };

  return (
    <aside
      style={{
        position: "fixed",
        right: "1rem",
        bottom: "1rem",
        zIndex: 60,
        width: "min(30rem, calc(100vw - 2rem))",
        padding: "1rem",
        borderRadius: "1rem",
        border: "1px solid rgba(34,197,94,0.18)",
        background: "rgba(10,12,16,0.96)",
        boxShadow: "0 18px 48px rgba(0,0,0,0.35)",
        backdropFilter: "blur(18px)",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
        <div>
          <p
            style={{
              margin: "0 0 0.375rem",
              fontSize: "0.8125rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#22c55e",
              fontWeight: 700,
            }}
          >
            Sütikezelés
          </p>
          <h2
            style={{
              margin: 0,
              color: "#fff",
              fontSize: "1.05rem",
              letterSpacing: "-0.03em",
            }}
          >
            Ez az oldal analitikai sütiket és helyi tárhelyet is használ.
          </h2>
        </div>

        <p
          style={{
            margin: 0,
            color: "rgba(255,255,255,0.72)",
            fontSize: "0.92rem",
            lineHeight: 1.6,
          }}
        >
          A működéshez szükséges technikai tárolás mellett analitikát is használok a
          látogatottság mérésére. A részleteket az{" "}
          <Link to="/adatvedelem" style={{ color: "#86efac" }}>
            adatkezelési tájékoztatóban
          </Link>{" "}
          és a{" "}
          <Link to="/sutik" style={{ color: "#86efac" }}>
            süti tájékoztatóban
          </Link>{" "}
          találod meg.
        </p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.625rem" }}>
          <button
            onClick={handleNecessaryOnly}
            style={{
              border: "1px solid rgba(255,255,255,0.16)",
              background: "transparent",
              color: "rgba(255,255,255,0.88)",
              padding: "0.75rem 1rem",
              borderRadius: "0.75rem",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Csak szükséges
          </button>
          <button
            onClick={handleAnalytics}
            style={{
              border: "1px solid rgba(34,197,94,0.28)",
              background: "rgba(34,197,94,0.12)",
              color: "#dcfce7",
              padding: "0.75rem 1rem",
              borderRadius: "0.75rem",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Analitika engedélyezése
          </button>
          <button
            onClick={handleAll}
            style={{
              border: "none",
              background: "#22c55e",
              color: "#04110a",
              padding: "0.75rem 1rem",
              borderRadius: "0.75rem",
              fontWeight: 800,
              cursor: "pointer",
            }}
          >
            Minden elfogadása
          </button>
        </div>
      </div>
    </aside>
  );
}
