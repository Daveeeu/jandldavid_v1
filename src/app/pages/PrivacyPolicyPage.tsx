import { LegalPageLayout } from "../components/LegalPageLayout";

const LAST_UPDATED = "2026. augusztus 24.";

export default function PrivacyPolicyPage() {
  return (
    <LegalPageLayout
      eyebrow="Adatvédelem"
      title="Adatkezelési tájékoztató"
      intro="Ez a tájékoztató összefoglalja, hogy a jandldavid.hu oldalon milyen személyes adatok kezelése történik, milyen célból, meddig, illetve milyen jogok illetik meg a látogatókat és az érdeklődőket."
      lastUpdated={LAST_UPDATED}
      sections={[
        {
          title: "1. Adatkezelő",
          body: (
            <>
              <p>Adatkezelő: Jandl Dávid</p>
              <p>E-mail: info@jandldavid.hu</p>
              <p>A weboldal egyéni kapcsolatfelvételi, portfólió- és szolgáltatásbemutató célokat szolgál.</p>
            </>
          ),
        },
        {
          title: "2. Kezelt adatok köre",
          body: (
            <>
              <p>
                Kapcsolatfelvétel esetén a rendszer kezeli a megadott nevet, e-mail-címet,
                projektleírást, a kiválasztott igényeket, a meglévő rendszer URL-jét, továbbá a
                kapcsolatfelvételhez kapcsolódó beszélgetési előzményt és összefoglalót.
              </p>
              <p>
                Technikai és analitikai célból a rendszer kezelheti az oldal URL-jét, a referrer
                adatot, UTM paramétereket, eseményadatokat, böngésző- és eszközinformációkat,
                valamint hozzájárulás esetén analitikai azonosítókat.
              </p>
            </>
          ),
        },
        {
          title: "3. Az adatkezelés célja és jogalapja",
          body: (
            <>
              <p>
                Kapcsolatfelvételi és ajánlatadási célból történő adatkezelés jogalapja az érintett
                kérésére történő, szerződéskötést megelőző lépések megtétele, illetve az érintett
                önkéntes adatszolgáltatása.
              </p>
              <p>
                Analitikai mérés és látogatottsági statisztika céljából történő adatkezelés
                jogalapja a hozzájárulás. A nem szükséges analitikai tárolás csak elfogadás után
                kerül aktiválásra.
              </p>
              <p>
                A szerveroldali naplózás és az oldal biztonságos működéséhez szükséges technikai
                műveletek jogalapja az adatkezelő jogos érdeke.
              </p>
            </>
          ),
        },
        {
          title: "4. Használt szolgáltatások és címzettek",
          body: (
            <>
              <p>
                A weboldal a látogatottság mérésére Google Tag Manager és/vagy Google Analytics 4
                szolgáltatást használhat. Ezek az eszközök az analitikai tagek és események
                kezelésében vesznek részt.
              </p>
              <p>
                A kapcsolatfelvételi űrlap beküldésekor az adatok a weboldal Laravel alapú
                szerveroldali rendszerébe kerülnek, majd a válaszadás és visszaigazolás céljából az
                aktuálisan konfigurált e-mail szolgáltatón keresztül továbbításra kerülhetnek.
              </p>
              <p>
                A visszaigazoló e-mail technikai megnyitásmérést is tartalmazhat, amely kizárólag
                azt rögzíti, hogy a visszaigazoló üzenet megnyitásra került-e.
              </p>
            </>
          ),
        },
        {
          title: "5. Adatmegőrzési idők",
          body: (
            <>
              <p>
                A kapcsolatfelvételi űrlapon megadott adatokat az adatkezelő legfeljebb az üzleti
                kapcsolat rendezéséhez szükséges ideig, illetve az ezzel összefüggő jogos igények
                elévülési idejének figyelembevételével őrzi meg.
              </p>
              <p>
                Az analitikai események és kapcsolódó technikai adatok rövidebb, statisztikai és
                rendszerüzemeltetési célú megőrzés alá esnek. A pontos időtartam az aktív
                szolgáltató beállításaitól is függhet.
              </p>
            </>
          ),
        },
        {
          title: "6. Érintetti jogok",
          body: (
            <>
              <p>
                Az érintett kérheti a rá vonatkozó személyes adatokhoz való hozzáférést, azok
                helyesbítését, törlését, kezelésének korlátozását, továbbá tiltakozhat a jogos
                érdeken alapuló adatkezelés ellen.
              </p>
              <p>
                Hozzájáruláson alapuló adatkezelés esetén a hozzájárulás bármikor visszavonható.
                Ez a visszavonás nem érinti a visszavonás előtti adatkezelés jogszerűségét.
              </p>
            </>
          ),
        },
        {
          title: "7. Jogorvoslat",
          body: (
            <>
              <p>
                Adatvédelmi kérdés vagy panasz esetén elsődlegesen az adatkezelő fenti
                elérhetőségén lehet kapcsolatba lépni.
              </p>
              <p>
                Az érintett panasszal fordulhat a Nemzeti Adatvédelmi és Információszabadság
                Hatósághoz, illetve bírósági jogorvoslattal is élhet.
              </p>
            </>
          ),
        },
      ]}
    />
  );
}
