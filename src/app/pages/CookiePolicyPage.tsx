import { useEffect, useState } from "react";
import {
  getStoredConsent,
  grantAllConsent,
  grantAnalyticsOnly,
  revokeAllConsent,
  subscribeToConsentChanges,
  type StoredConsent,
} from "@/analytics";
import { LegalPageLayout } from "../components/LegalPageLayout";

const LAST_UPDATED = "2026. augusztus 24.";

function formatConsent(consent: StoredConsent | null): string {
  if (!consent) {
    return "Még nincs elmentett választás.";
  }

  if (consent.analytics && consent.marketing && consent.functionality) {
    return "Minden kategória engedélyezve.";
  }

  if (consent.analytics) {
    return "Csak analitikai hozzájárulás engedélyezve.";
  }

  return "Csak a szükséges technikai tárolás aktív.";
}

export default function CookiePolicyPage() {
  const [consent, setConsent] = useState<StoredConsent | null>(null);

  useEffect(() => {
    setConsent(getStoredConsent());

    return subscribeToConsentChanges((nextConsent) => {
      setConsent(nextConsent);
    });
  }, []);

  return (
    <LegalPageLayout
      eyebrow="Sütik"
      title="Süti tájékoztató"
      intro="Ez az oldal sütiket, localStorage-t és sessionStorage-t is használhat a weboldal működtetéséhez, a hozzájárulások megjegyzéséhez és az analitikai mérésekhez. Az alábbi összefoglaló a jelenlegi implementáció alapján készült."
      lastUpdated={LAST_UPDATED}
      sections={[
        {
          title: "1. Milyen technológiákat használ az oldal",
          body: (
            <>
              <p>
                Az oldal nemcsak klasszikus HTTP sütiket, hanem böngészőben tárolt helyi adatokat
                is használ. Ide tartozhat a localStorage és a sessionStorage.
              </p>
              <p>
                A hozzájárulási döntést a weboldal a <code>kt_consent_v2</code> kulcs alatt tárolja.
                Analitikai elfogadás esetén a rendszer analitikai azonosítókat és eseményadatokat is
                tárolhat helyi vagy munkamenet szintű tárolóban.
              </p>
            </>
          ),
        },
        {
          title: "2. Szükséges technikai tárolás",
          body: (
            <>
              <p>
                A szükséges technikai tárolás a weboldal alapműködéséhez, a hozzájárulási döntés
                megjegyzéséhez és a biztonságos működéshez kapcsolódik. Ezek nélkül az oldal egyes
                funkciói nem működnének megfelelően.
              </p>
              <p>
                Ide tartozhat például a hozzájárulási állapot rögzítése, illetve a Laravel alapú
                háttérrendszer által kezelt technikai munkamenet.
              </p>
            </>
          ),
        },
        {
          title: "3. Analitikai tárolás",
          body: (
            <>
              <p>
                Az oldal Google Tag Manager és/vagy Google Analytics 4 alapú mérési megoldást
                használhat a látogatottság, az űrlaphasználat és a főbb interakciók statisztikai
                elemzésére.
              </p>
              <p>
                Az analitikai adatok célja a tartalom, a felhasználói élmény és a kapcsolatfelvételi
                folyamat javítása. Az analitikai továbbítás hozzájárulás nélkül nem kerül
                szerveroldalon elküldésre.
              </p>
            </>
          ),
        },
        {
          title: "4. Jelenlegi választásod",
          body: (
            <>
              <p>{formatConsent(consent)}</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", marginTop: "1rem" }}>
                <button
                  onClick={() => revokeAllConsent()}
                  style={{
                    border: "1px solid rgba(255,255,255,0.16)",
                    background: "transparent",
                    color: "#fff",
                    padding: "0.75rem 1rem",
                    borderRadius: "0.75rem",
                    cursor: "pointer",
                    fontWeight: 600,
                  }}
                >
                  Csak szükséges
                </button>
                <button
                  onClick={() => grantAnalyticsOnly()}
                  style={{
                    border: "1px solid rgba(34,197,94,0.28)",
                    background: "rgba(34,197,94,0.12)",
                    color: "#dcfce7",
                    padding: "0.75rem 1rem",
                    borderRadius: "0.75rem",
                    cursor: "pointer",
                    fontWeight: 700,
                  }}
                >
                  Analitika engedélyezése
                </button>
                <button
                  onClick={() => grantAllConsent()}
                  style={{
                    border: "none",
                    background: "#22c55e",
                    color: "#04110a",
                    padding: "0.75rem 1rem",
                    borderRadius: "0.75rem",
                    cursor: "pointer",
                    fontWeight: 800,
                  }}
                >
                  Minden elfogadása
                </button>
              </div>
            </>
          ),
        },
        {
          title: "5. Hogyan módosítható a beállítás",
          body: (
            <>
              <p>
                A hozzájárulás bármikor módosítható ezen az oldalon. Emellett a böngészőben tárolt
                sütik és helyi adatok a böngésző beállításaiban is törölhetők.
              </p>
              <p>
                Ha a böngészőben minden sütit vagy helyi tárolást törölsz, akkor a weboldal újra
                meg fogja kérdezni a választásodat.
              </p>
            </>
          ),
        },
      ]}
    />
  );
}
