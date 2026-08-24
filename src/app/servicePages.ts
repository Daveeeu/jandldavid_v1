export type ServiceLink = {
  label: string;
  href: string;
};

export type ServiceSection = {
  title: string;
  body: string[];
  bullets?: string[];
};

export type ServicePageContent = {
  slug: string;
  path: string;
  eyebrow: string;
  h1: string;
  lead: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  searchIntent: string;
  introPoints: string[];
  sections: ServiceSection[];
  relatedLinks: ServiceLink[];
  ctaLabel: string;
};

export const SERVICE_PAGES: Record<string, ServicePageContent> = {
  "weboldal-keszites": {
    slug: "weboldal-keszites",
    path: "/szolgaltatasok/weboldal-keszites",
    eyebrow: "Webes szolgáltatás",
    h1: "Weboldal készítés és egyedi webfejlesztés",
    lead:
      "Olyan weboldal készítés projektekben segítek, ahol nem csak egy szép felületre, hanem üzleti célokat támogató, gyorsan működő és hosszú távon is bővíthető rendszerre van szükség.",
    primaryKeyword: "weboldal készítés",
    secondaryKeywords: [
      "weboldal fejlesztés",
      "egyedi webfejlesztés",
      "weboldal-karbantartás",
      "webfejlesztés",
    ],
    searchIntent: "Kereskedelmi, szolgáltatást kereső",
    introPoints: [
      "Landing oldalak, céges weboldalak és egyedi webes felületek tervezése és kivitelezése.",
      "Laravel- vagy React-alapú weboldal fejlesztés, ha a projekt egyszerű sablonoldalnál többet igényel.",
      "Folyamatos weboldal-karbantartás, hibajavítás és továbbfejlesztés a stabil működéshez.",
    ],
    sections: [
      {
        title: "Mikor jó választás",
        body: [
          "Akkor érdemes egyedi weboldal készítésben gondolkodni, ha a cégednek fontos a gyors betöltés, a jó mobilos élmény, az átgondolt SEO-alap és az, hogy a weboldal később továbbfejleszthető maradjon.",
          "Nem sablonokat próbálok erőltetni minden projektre. A technikai irány mindig az üzleti célhoz, a tartalomhoz és a későbbi üzemeltetési igényekhez igazodik.",
        ],
        bullets: [
          "céges weboldalak és landing oldalak",
          "egyedi webfejlesztés Laravel- vagy React-alapon",
          "technikai SEO-alapok és karbantartható kód",
          "weboldal-karbantartás és továbbfejlesztés",
        ],
      },
      {
        title: "Mit kapsz a kivitelezésben",
        body: [
          "A weboldal fejlesztés nem áll meg a dizájn átadásánál. A teljes folyamat része a technikai tervezés, az analitika, a teljesítményoptimalizálás, a kapcsolatfelvételi logika és a deployment is.",
        ],
        bullets: [
          "egyedi felület vagy komponensalapú frontend",
          "stabil backend és kapcsolatfelvételi logika",
          "canonical, meta, strukturált adat és sitemap alapok",
          "karbantartható kódbázis és bővíthető architektúra",
        ],
      },
      {
        title: "Karbantartás és továbbfejlesztés",
        body: [
          "Sok esetben nem új weboldalt kell nulláról építeni, hanem a meglévőt kell rendbe tenni. Ebben is tudok segíteni technikai adósság csökkentésével, weboldal-karbantartással, teljesítményjavításokkal és új funkciók fejlesztésével.",
        ],
      },
    ],
    relatedLinks: [
      { label: "Webshop készítés", href: "/szolgaltatasok/webshop-keszites" },
      { label: "Egyedi szoftverfejlesztés", href: "/szolgaltatasok/egyedi-szoftverfejlesztes" },
      { label: "Kapcsolatfelvétel", href: "/#section-contact" },
    ],
    ctaLabel: "Beszéljünk a weboldalról",
  },
  "webshop-keszites": {
    slug: "webshop-keszites",
    path: "/szolgaltatasok/webshop-keszites",
    eyebrow: "E-kereskedelmi szolgáltatás",
    h1: "Webshop készítés és egyedi webáruház fejlesztés",
    lead:
      "A webshop készítés akkor működik jól, ha a vásárlási folyamat gyors, a háttérrendszer átlátható, és a későbbi integrációk nem kényszermegoldásokkal kerülnek be a rendszerbe.",
    primaryKeyword: "webshop készítés",
    secondaryKeywords: [
      "webáruház készítés",
      "egyedi webshop fejlesztés",
      "rendszerintegráció",
    ],
    searchIntent: "Kereskedelmi, szolgáltatást kereső",
    introPoints: [
      "Egyedi webáruház készítés olyan projektekhez, ahol fontos a kontroll a folyamatok felett.",
      "Termékkezelés, rendelési logika, külső fizetési vagy számlázási integrációk.",
      "Nem csak frontend, hanem üzleti folyamatokra illesztett technikai háttér.",
    ],
    sections: [
      {
        title: "Miben más egy egyedi webshop",
        body: [
          "Egy egyszerű webshop sablon sokszor elég egy kezdő projektnek, de amikor egyedi árképzés, külön rendelési logika, külső rendszerkapcsolatok vagy több szerepkörös adminisztráció jelenik meg, már külön érték az egyedi fejlesztés.",
          "A webáruház készítésnél azt nézem meg, hogyan támogassa a rendszer a tényleges értékesítési folyamatot, ne csak a katalógust jelenítse meg.",
        ],
        bullets: [
          "egyedi kosár- és pénztárfunkciók",
          "külső számlázó, ERP vagy CRM kapcsolatok",
          "adminfelület a napi üzemeltetéshez",
          "mobiloptimalizált és gyors vásárlási élmény",
        ],
      },
      {
        title: "Technikai háttér",
        body: [
          "A webshop készítés mögött ugyanúgy ott kell lennie a stabil backendfejlesztésnek, az adatmodellnek, az automatizált folyamatoknak és a deploymentnek, mint bármelyik másik üzleti rendszer mögött.",
        ],
      },
      {
        title: "Hosszú távú szempontok",
        body: [
          "Olyan webáruház fejlesztésre fókuszálok, amelynél a későbbi bővítés, a kampánytámogatás, az analitika és a rendszerintegráció sem utólagos toldásként jelenik meg.",
        ],
      },
    ],
    relatedLinks: [
      { label: "Weboldal készítés", href: "/szolgaltatasok/weboldal-keszites" },
      { label: "n8n automatizáció", href: "/szolgaltatasok/automatizacio-rendszerintegracio" },
      { label: "Kapcsolatfelvétel", href: "/#section-contact" },
    ],
    ctaLabel: "Nézzük meg a webshopot",
  },
  "automatizacio-rendszerintegracio": {
    slug: "automatizacio-rendszerintegracio",
    path: "/szolgaltatasok/automatizacio-rendszerintegracio",
    eyebrow: "Automatizáció",
    h1: "n8n automatizáció és üzleti rendszerintegráció",
    lead:
      "Az n8n automatizáció és az üzleti automatizáció akkor értékes, ha a napi folyamatok tényleg egyszerűbbek, nem pedig csak több eszközt kötünk össze átláthatatlan módon.",
    primaryKeyword: "n8n automatizáció",
    secondaryKeywords: [
      "üzleti automatizáció",
      "rendszerintegráció",
      "backendfejlesztés",
    ],
    searchIntent: "Kereskedelmi, automatizációs megoldást kereső",
    introPoints: [
      "n8n workflow-k tervezése, kivitelezése és stabil üzemeltetése.",
      "Külső rendszerek, CRM-ek, értesítések, leadkezelés vagy admin folyamatok összekötése.",
      "Nem csak automatizmus, hanem átlátható és hibabiztos rendszerintegráció.",
    ],
    sections: [
      {
        title: "Mire jó az automatizáció",
        body: [
          "Az üzleti automatizáció különösen ott teremt értéket, ahol ugyanazokat a lépéseket kell újra és újra végrehajtani: érdeklődők rögzítésénél, adatfrissítésnél, ajánlatkezelésnél, riportoknál vagy külső szolgáltatások szinkronizálásánál.",
        ],
        bullets: [
          "leadkezelés és értesítési folyamatok",
          "adatmozgás külső rendszerek között",
          "adminisztráció és riportkészítés egyszerűsítése",
          "egyedi API-kapcsolatok és webhook folyamatok",
        ],
      },
      {
        title: "n8n és egyedi logika együtt",
        body: [
          "Nem minden feladat oldható meg tisztán drag-and-drop alapon. Ilyenkor jön jól, hogy az n8n automatizáció mellett backendfejlesztéssel, egyedi API-logikával és szerveroldali ellenőrzéssel is tudom támogatni a folyamatot.",
        ],
      },
      {
        title: "Stabilitás és felügyelet",
        body: [
          "A rendszerintegráció csak akkor hasznos, ha hiba esetén visszakövethető, monitorozható és javítható marad. Ezért a workflow-kat nem elszigetelten, hanem a teljes üzleti rendszer részeként kezelem.",
        ],
      },
    ],
    relatedLinks: [
      { label: "Egyedi szoftverfejlesztés", href: "/szolgaltatasok/egyedi-szoftverfejlesztes" },
      { label: "Infrastruktúra és deployment", href: "/szolgaltatasok/infrastruktura-deployment" },
      { label: "Kapcsolatfelvétel", href: "/#section-contact" },
    ],
    ctaLabel: "Beszéljünk az automatizációról",
  },
  "mobilalkalmazas-fejlesztes": {
    slug: "mobilalkalmazas-fejlesztes",
    path: "/szolgaltatasok/mobilalkalmazas-fejlesztes",
    eyebrow: "Mobilfejlesztés",
    h1: "Mobilalkalmazás-fejlesztés és app készítés",
    lead:
      "A mobilalkalmazás-fejlesztés akkor teremt üzleti értéket, ha az app készítés nem külön projektként lebeg, hanem kapcsolódik a teljes digitális rendszerhez, a backendhez és az üzemeltetéshez is.",
    primaryKeyword: "mobilalkalmazás-fejlesztés",
    secondaryKeywords: [
      "app készítés",
      "Flutter fejlesztés",
      "alkalmazásfejlesztés",
    ],
    searchIntent: "Kereskedelmi, alkalmazásfejlesztési megoldást kereső",
    introPoints: [
      "Üzleti célokra szabott alkalmazásfejlesztés iOS- és Android-fókuszú projektekhez.",
      "Flutter alapú app készítés, ha fontos a gyors fejlesztés és az egységes kódbázis.",
      "Backend, API és admin oldali támogatás a mobilalkalmazás mögött.",
    ],
    sections: [
      {
        title: "Milyen projektekhez ideális",
        body: [
          "A mobilalkalmazás-fejlesztés különösen ott hasznos, ahol rendszeres visszatérő használat, push kommunikáció, bejelentkezett felhasználói tér vagy gyors mobilos workflow szükséges.",
        ],
        bullets: [
          "ügyfélportál vagy tagsági alkalmazás",
          "foglalási vagy előfizetéses rendszer mobil kiterjesztése",
          "belső céges workflow-k és admin eszközök",
          "meglévő webes rendszerhez kapcsolódó app készítés",
        ],
      },
      {
        title: "Nem csak felület",
        body: [
          "Az app készítés sikere sokszor a háttérben dől el: API-tervezésben, adatkezelésben, autentikációban, hibakezelésben és deployment folyamatokban. Ezeket ugyanúgy a projekt részeként kezelem, mint a mobil UI-t.",
        ],
      },
      {
        title: "Kapcsolódás a teljes rendszerhez",
        body: [
          "Ha már van webes platformod vagy SaaS rendszered, a mobil alkalmazásfejlesztés akkor működik jól, ha ugyanabba a technikai gondolkodásba illeszkedik, nem külön szigetként épül fel.",
        ],
      },
    ],
    relatedLinks: [
      { label: "Egyedi szoftverfejlesztés", href: "/szolgaltatasok/egyedi-szoftverfejlesztes" },
      { label: "Weboldal készítés", href: "/szolgaltatasok/weboldal-keszites" },
      { label: "Kapcsolatfelvétel", href: "/#section-contact" },
    ],
    ctaLabel: "Beszéljünk az appról",
  },
  "egyedi-szoftverfejlesztes": {
    slug: "egyedi-szoftverfejlesztes",
    path: "/szolgaltatasok/egyedi-szoftverfejlesztes",
    eyebrow: "Egyedi rendszerek",
    h1: "Egyedi szoftverfejlesztés és backendfejlesztés",
    lead:
      "Az egyedi szoftverfejlesztés akkor jó befektetés, ha a céges folyamatokat nem sablonrendszerhez, hanem a valós működéshez kell igazítani. Ilyenkor a backendfejlesztés, az adatmodell és a rendszerintegráció kulcsfontosságú.",
    primaryKeyword: "egyedi szoftverfejlesztés",
    secondaryKeywords: [
      "backendfejlesztés",
      "Laravel fejlesztés",
      "rendszerintegráció",
      "digitális rendszerek",
    ],
    searchIntent: "Kereskedelmi, egyedi rendszermegoldást kereső",
    introPoints: [
      "Egyedi admin rendszerek, belső workflow-k és üzleti digitális rendszerek fejlesztése.",
      "Laravel alapú backendfejlesztés API-kkal, jogosultságkezeléssel és integrációkkal.",
      "A teljes rendszer üzleti logikájára szabott tervezés, nem csak funkciólista szerinti kivitelezés.",
    ],
    sections: [
      {
        title: "Mikor indokolt az egyedi fejlesztés",
        body: [
          "Ha a csapatod több külön eszközt próbál összerakni, sok a kézimunka, bonyolultak a jogosultságok vagy a folyamatok egyedi szabályok szerint működnek, akkor az egyedi szoftverfejlesztés sokszor hatékonyabb, mint újabb különálló szolgáltatásokat bevezetni.",
        ],
        bullets: [
          "egyedi admin felületek",
          "API-központú rendszerek",
          "szerepkör- és folyamatfüggő üzleti logika",
          "meglévő rendszerek modernizálása és újraépítése",
        ],
      },
      {
        title: "Backendfejlesztés Laravel alapon",
        body: [
          "A backendfejlesztésnél a stabil adatmodell, a biztonságos autentikáció, a jogosultságkezelés, az API dokumentálhatóság és a hosszú távú bővíthetőség ugyanolyan fontos, mint maga a funkcionalitás.",
        ],
      },
      {
        title: "Rendszerszemlélet",
        body: [
          "Az egyedi digitális rendszerek nem csak kódból állnak. A deployment, a monitorozás, az automatizáció és a rendszerintegráció ugyanúgy a projekt része, ha valódi üzleti eszközt építesz.",
        ],
      },
    ],
    relatedLinks: [
      { label: "n8n automatizáció", href: "/szolgaltatasok/automatizacio-rendszerintegracio" },
      { label: "Infrastruktúra és deployment", href: "/szolgaltatasok/infrastruktura-deployment" },
      { label: "Kapcsolatfelvétel", href: "/#section-contact" },
    ],
    ctaLabel: "Nézzük meg a rendszeredet",
  },
  "infrastruktura-deployment": {
    slug: "infrastruktura-deployment",
    path: "/szolgaltatasok/infrastruktura-deployment",
    eyebrow: "Technikai háttér",
    h1: "Infrastruktúra és deployment üzleti rendszerekhez",
    lead:
      "Az infrastruktúra és deployment sokszor csak akkor kap figyelmet, amikor már van hiba. Pedig a stabil szerverüzemeltetés, a rendszerfelügyelet és az átgondolt deployment alapfeltétel ahhoz, hogy a fejlesztés biztonságosan skálázható maradjon.",
    primaryKeyword: "infrastruktúra és deployment",
    secondaryKeywords: [
      "szerverüzemeltetés",
      "rendszerfelügyelet",
      "infrastruktúra",
      "deployment",
    ],
    searchIntent: "Kereskedelmi, technikai háttérmegoldást kereső",
    introPoints: [
      "Docker, Linux, reverse proxy, backup és monitoring alapokra épített technikai háttér.",
      "Szerverüzemeltetés és rendszerfelügyelet modern, dokumentálható folyamatokkal.",
      "Deployment folyamatok, amelyek nem csak működnek, hanem hibakeresésre és bővítésre is fel vannak készítve.",
    ],
    sections: [
      {
        title: "Mit jelent ez a gyakorlatban",
        body: [
          "Az infrastruktúra nem csak szerverbérlést jelent. Ide tartozik a környezetek kialakítása, a biztonsági beállítások, a mentések, a monitorozás, az automatizált telepítés és az is, hogy hiba esetén gyorsan lehessen reagálni.",
        ],
        bullets: [
          "Docker alapú futtatási környezet",
          "NGINX vagy reverse proxy konfiguráció",
          "CI/CD és deployment folyamatok",
          "monitoring, alerting és backup",
        ],
      },
      {
        title: "Mikor jön jól külön figyelmet fordítani rá",
        body: [
          "Ha egy rendszer már üzletileg fontos, akkor a szerverüzemeltetés és a rendszerfelügyelet nem maradhat ad hoc feladat. Ekkor szoktak előjönni a lassú release-ek, a nehezen követhető hibák vagy a túl sok manuális beavatkozás problémái.",
        ],
      },
      {
        title: "Kapcsolat a fejlesztéssel",
        body: [
          "A deployment szemlélet akkor a leghasznosabb, ha már a fejlesztés során figyelembe vesszük. Így a teljes rendszer könnyebben üzemeltethető, biztonságosabb és kiszámíthatóbb lesz.",
        ],
      },
    ],
    relatedLinks: [
      { label: "Egyedi szoftverfejlesztés", href: "/szolgaltatasok/egyedi-szoftverfejlesztes" },
      { label: "n8n automatizáció", href: "/szolgaltatasok/automatizacio-rendszerintegracio" },
      { label: "Kapcsolatfelvétel", href: "/#section-contact" },
    ],
    ctaLabel: "Beszéljünk a technikai háttérről",
  },
};

export const SERVICE_PAGE_ORDER = [
  "/szolgaltatasok/weboldal-keszites",
  "/szolgaltatasok/webshop-keszites",
  "/szolgaltatasok/automatizacio-rendszerintegracio",
  "/szolgaltatasok/mobilalkalmazas-fejlesztes",
  "/szolgaltatasok/egyedi-szoftverfejlesztes",
  "/szolgaltatasok/infrastruktura-deployment",
];
