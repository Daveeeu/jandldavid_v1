import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import siteContent from "../../resources/seo/site-content.json";

type SeoMeta = {
  title: string;
  description: string;
  canonicalPath: string;
  imagePath?: string;
  robots?: string;
  type?: "website" | "article";
  schema?: Record<string, unknown> | Array<Record<string, unknown>>;
};

const APP_NAME = "Jandl Dávid";
const DEFAULT_IMAGE_PATH = "/og-image.png";
const DEFAULT_ROBOTS = "index,follow";
type HomepageFaq = { question: string; answer: string };
type PageConfig = { title: string; description: string; type?: "website" | "article" };

function getSharedPageConfig(): Record<string, PageConfig> {
  return (window.__SEO_PAGES__ ?? siteContent.pages) as Record<string, PageConfig>;
}

function getHomepageFaqs(): HomepageFaq[] {
  return window.__SEO_HOMEPAGE_FAQS__ ?? siteContent.homepageFaqs;
}

function getBaseUrl(): string {
  const configuredUrl =
    document
      .querySelector('meta[name="app-url"]')
      ?.getAttribute("content")
      ?.trim() ||
    (typeof window !== "undefined" &&
    "__APP_URL__" in window &&
    typeof window.__APP_URL__ === "string"
      ? window.__APP_URL__
      : "");

  if (configuredUrl) {
    return configuredUrl.replace(/\/+$/, "");
  }

  return window.location.origin.replace(/\/+$/, "");
}

function buildUrl(baseUrl: string, path: string): string {
  return `${baseUrl}${path === "/" ? "/" : path}`;
}

function getPageMeta(pathname: string, baseUrl: string): SeoMeta {
  const sharedPages = getSharedPageConfig();

  if (pathname === "/") {
    const homepageFaqs = getHomepageFaqs();
    const homepageMeta = sharedPages["/"];

    return {
      title: homepageMeta.title,
      description: homepageMeta.description,
      canonicalPath: "/",
      schema: [
        {
          "@context": "https://schema.org",
          "@type": "Person",
          name: APP_NAME,
          jobTitle: "Full-stack webfejlesztő",
          url: buildUrl(baseUrl, "/"),
          knowsAbout: [
            "Laravel",
            "React",
            "Webfejlesztés",
            "Infrastruktúra",
            "Biztonságközpontú fejlesztés",
          ],
        },
        {
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: APP_NAME,
          url: buildUrl(baseUrl, "/"),
          inLanguage: "hu-HU",
        },
        {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: homepageFaqs.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: item.answer,
            },
          })),
        },
      ],
    };
  }

  if (pathname === "/about") {
    const aboutMeta = sharedPages["/about"];
    return {
      title: aboutMeta.title,
      description: aboutMeta.description,
      canonicalPath: "/about",
      schema: {
        "@context": "https://schema.org",
        "@type": "AboutPage",
        name: "Rólam",
        url: buildUrl(baseUrl, "/about"),
        inLanguage: "hu-HU",
      },
    };
  }

  if (pathname in sharedPages) {
    const meta = sharedPages[pathname];
    return {
      ...meta,
      canonicalPath: pathname,
      schema: [
        {
          "@context": "https://schema.org",
          "@type": "Article",
          name: meta.title.replace(" | Jandl Dávid", ""),
          description: meta.description,
          url: buildUrl(baseUrl, pathname),
          inLanguage: "hu-HU",
          author: {
            "@type": "Person",
            name: APP_NAME,
          },
        },
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Főoldal",
              item: buildUrl(baseUrl, "/"),
            },
            {
              "@type": "ListItem",
              position: 2,
              name: meta.title.replace(" | Jandl Dávid", ""),
              item: buildUrl(baseUrl, pathname),
            },
          ],
        },
      ],
    };
  }

  return {
    title: "Az oldal nem található | Jandl Dávid",
    description:
      "A keresett oldal nem érhető el. Térj vissza a főoldalra, és nézd meg az elérhető projekteket, szolgáltatásokat vagy a kapcsolatfelvételi lehetőségeket.",
    canonicalPath: pathname,
    robots: "noindex,follow",
    schema: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "404",
      url: buildUrl(baseUrl, pathname),
      inLanguage: "hu-HU",
    },
  };
}

function upsertMeta(
  selector: string,
  attributes: Record<string, string>,
  content: string,
) {
  let element = document.head.querySelector<HTMLMetaElement>(selector);

  if (!element) {
    element = document.createElement("meta");
    Object.entries(attributes).forEach(([key, value]) => {
      element?.setAttribute(key, value);
    });
    document.head.appendChild(element);
  }

  element.setAttribute("content", content);
}

function upsertLink(rel: string, href: string) {
  let element = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);

  if (!element) {
    element = document.createElement("link");
    element.setAttribute("rel", rel);
    document.head.appendChild(element);
  }

  element.setAttribute("href", href);
}

function upsertStructuredData(schema: SeoMeta["schema"]) {
  const scriptId = "seo-structured-data";
  const existing = document.getElementById(scriptId);

  if (!schema) {
    existing?.remove();
    return;
  }

  const script = existing ?? document.createElement("script");
  script.id = scriptId;
  script.setAttribute("type", "application/ld+json");
  script.textContent = JSON.stringify(schema);

  if (!existing) {
    document.head.appendChild(script);
  }
}

export function SeoManager() {
  const location = useLocation();

  useEffect(() => {
    const baseUrl = getBaseUrl();
    const meta = getPageMeta(location.pathname, baseUrl);
    const canonicalUrl = buildUrl(baseUrl, meta.canonicalPath);
    const imageUrl = buildUrl(baseUrl, meta.imagePath ?? DEFAULT_IMAGE_PATH);
    const robots = meta.robots ?? DEFAULT_ROBOTS;
    const type = meta.type ?? "website";

    document.title = meta.title;

    upsertMeta('meta[name="description"]', { name: "description" }, meta.description);
    upsertMeta('meta[name="robots"]', { name: "robots" }, robots);
    upsertMeta('meta[property="og:title"]', { property: "og:title" }, meta.title);
    upsertMeta('meta[property="og:description"]', { property: "og:description" }, meta.description);
    upsertMeta('meta[property="og:type"]', { property: "og:type" }, type);
    upsertMeta('meta[property="og:url"]', { property: "og:url" }, canonicalUrl);
    upsertMeta('meta[property="og:image"]', { property: "og:image" }, imageUrl);
    upsertMeta('meta[property="og:image:alt"]', { property: "og:image:alt" }, meta.title);
    upsertMeta('meta[property="og:image:type"]', { property: "og:image:type" }, "image/png");
    upsertMeta('meta[property="og:image:width"]', { property: "og:image:width" }, "1200");
    upsertMeta('meta[property="og:image:height"]', { property: "og:image:height" }, "630");
    upsertMeta('meta[property="og:locale"]', { property: "og:locale" }, "hu_HU");
    upsertMeta('meta[property="og:site_name"]', { property: "og:site_name" }, APP_NAME);
    upsertMeta('meta[name="twitter:card"]', { name: "twitter:card" }, "summary_large_image");
    upsertMeta('meta[name="twitter:title"]', { name: "twitter:title" }, meta.title);
    upsertMeta('meta[name="twitter:description"]', { name: "twitter:description" }, meta.description);
    upsertMeta('meta[name="twitter:image"]', { name: "twitter:image" }, imageUrl);
    upsertMeta('meta[name="twitter:image:alt"]', { name: "twitter:image:alt" }, meta.title);
    upsertLink("canonical", canonicalUrl);
    upsertStructuredData(meta.schema);
  }, [location.pathname]);

  return null;
}

declare global {
  interface Window {
    __APP_URL__?: string;
    __SEO_PAGES__?: Record<string, PageConfig>;
    __SEO_HOMEPAGE_FAQS__?: HomepageFaq[];
  }
}
