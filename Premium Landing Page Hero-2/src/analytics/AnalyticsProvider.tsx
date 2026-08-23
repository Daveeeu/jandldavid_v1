/**
 * AnalyticsProvider
 *
 * Root-level React component that:
 *  1. Initializes Consent Mode v2 defaults on mount
 *  2. Fires page_view on every SPA route change
 *  3. Resets per-page session state (scroll dedup, time milestones)
 *  4. Wires global scroll depth, time milestones, outbound links, exit intent
 *  5. Captures UTM params from URL on every navigation
 *  6. Updates user properties in GA4 on mount
 *  7. Patches window.onerror for JS error tracking
 *
 * Place this as the outermost wrapper inside <BrowserRouter>.
 */

import { useEffect, useRef } from "react";
import { useLocation } from "react-router";
import {
  useScrollDepthTracking,
  useTimeMilestones,
  useSectionTracking,
  useOutboundLinkTracking,
  useExitIntent,
} from "./hooks";
import {
  trackPageView,
  trackJsError,
  trackPerformanceMetric,
} from "./events";
import {
  setPageContext,
  captureUtms,
  clearDedup,
  markVisit,
} from "./dataLayer";
import {
  initConsentDefaults,
  isAnalyticsGranted,
} from "./consent";
import {
  SessionManager,
  getUserStats,
  updateUserStats,
  incrementSessionCount,
  incrementPageViewCount,
  getDaysSinceFirstVisit,
} from "./engagement";
import { setUserProperties } from "./dataLayer";
import { SECTION } from "./constants";

// ─── Page type resolver ───────────────────────────────────────────────────────

function resolvePageType(
  pathname: string
): import("./types").PageType {
  if (pathname === "/") return "homepage";
  if (pathname.startsWith("/projektek/")) return "project_case_study";
  if (pathname === "/about") return "about";
  if (pathname === "/blog") return "blog";
  return "not_found";
}

function resolvePageTitle(pathname: string): string {
  if (pathname === "/") return "Jandl Dávid — Technikai Partner";
  if (pathname === "/projektek/performancevd")
    return "PerformanceVD — Sport SaaS Ökoszisztéma";
  if (pathname === "/projektek/infrastructure-deployment-system")
    return "Infrastructure Deployment System";
  if (pathname === "/about") return "Rólam — Jandl Dávid";
  if (pathname === "/blog") return "Blog — Jandl Dávid";
  return "Jandl Dávid";
}

// ─── Homepage sections (for IntersectionObserver) ─────────────────────────────

const HOMEPAGE_SECTIONS = [
  { id: SECTION.HERO, index: 0 },
  { id: SECTION.SERVICES, index: 1 },
  { id: SECTION.PROJECTS, index: 2 },
  { id: SECTION.PROCESS, index: 3 },
  { id: SECTION.TRUST, index: 4 },
  { id: SECTION.FAQ, index: 5 },
  { id: SECTION.CONTACT, index: 6 },
];

// ─── Inner component (uses router hooks) ──────────────────────────────────────

function AnalyticsInner({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const prevPath = useRef<string>("");
  const isFirstMount = useRef(true);
  const isHomepage = location.pathname === "/";

  // Global tracking hooks (active on every page)
  useScrollDepthTracking();
  useTimeMilestones();
  useOutboundLinkTracking();
  useExitIntent();

  // Section tracking only on homepage
  useSectionTracking(isHomepage ? HOMEPAGE_SECTIONS : []);

  // ─── Route change handler ─────────────────────────────────────────────

  useEffect(() => {
    const path = location.pathname;
    const title = resolvePageTitle(path);
    const pageType = resolvePageType(path);

    // Update page context for all subsequent events
    setPageContext(path, title, pageType);

    // Capture UTM params from URL
    captureUtms();

    // Reset per-page dedup + active time
    SessionManager.resetForPageView();
    clearDedup();

    // Track page view (skip on first mount — will fire below)
    if (!isFirstMount.current) {
      incrementPageViewCount();
      trackPageView(path, title, prevPath.current);
    }

    prevPath.current = path;
  }, [location.pathname]);

  // ─── First mount: init everything ────────────────────────────────────

  useEffect(() => {
    initConsentDefaults();
    markVisit(); // sets return visitor cookie for next session

    captureUtms();

    const path = location.pathname;
    const title = resolvePageTitle(path);
    const pageType = resolvePageType(path);

    setPageContext(path, title, pageType);

    // Increment session counter
    incrementSessionCount();
    incrementPageViewCount();

    // Fire initial page view
    trackPageView(path, title, document.referrer);

    // Push user properties
    const stats = getUserStats();
    const sp = new URLSearchParams(window.location.search);

    // Capture first touch UTMs on very first session
    if (stats.totalSessions <= 1) {
      updateUserStats({
        firstTouchSource: sp.get("utm_source") || document.referrer || "direct",
        firstTouchMedium: sp.get("utm_medium") || "",
        firstTouchCampaign: sp.get("utm_campaign") || "",
      });
    }

    const updatedStats = getUserStats();
    setUserProperties({
      first_touch_source: updatedStats.firstTouchSource,
      first_touch_medium: updatedStats.firstTouchMedium,
      first_touch_campaign: updatedStats.firstTouchCampaign,
      first_project_viewed: updatedStats.firstProjectViewed,
      total_sessions: updatedStats.totalSessions,
      total_page_views: updatedStats.totalPageViews,
      days_since_first_visit: getDaysSinceFirstVisit(),
      has_submitted_form: updatedStats.hasSubmittedForm,
      ai_conversations_count: updatedStats.aiConversationsCount,
      preferred_language: navigator.language?.split("-")[0] || "hu",
      returning_visitor: updatedStats.totalSessions > 1,
      content_language: "hu",
    });

    isFirstMount.current = false;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ─── JS error patching ────────────────────────────────────────────────

  useEffect(() => {
    const originalOnError = window.onerror;

    window.onerror = (message, source, lineno) => {
      trackJsError(
        String(message),
        String(source || ""),
        lineno || 0,
        "window"
      );
      return originalOnError ? originalOnError(message, source, lineno) : false;
    };

    const handleUnhandledRejection = (e: PromiseRejectionEvent) => {
      trackJsError(
        e.reason?.message || String(e.reason),
        "promise_rejection",
        0,
        "unknown"
      );
    };

    window.addEventListener("unhandledrejection", handleUnhandledRejection);

    return () => {
      window.onerror = originalOnError;
      window.removeEventListener(
        "unhandledrejection",
        handleUnhandledRejection
      );
    };
  }, []);

  // ─── Web Vitals via native PerformanceObserver ────────────────────────

  useEffect(() => {
    if (typeof PerformanceObserver === "undefined") return;

    function rating(name: string, value: number): "good" | "needs-improvement" | "poor" {
      const thresholds: Record<string, [number, number]> = {
        LCP:  [2500, 4000],
        FID:  [100,  300],
        INP:  [200,  500],
        CLS:  [0.1,  0.25],
        FCP:  [1800, 3000],
        TTFB: [800,  1800],
      };
      const [good, poor] = thresholds[name] ?? [0, 0];
      if (value <= good) return "good";
      if (value <= poor) return "needs-improvement";
      return "poor";
    }

    const observers: PerformanceObserver[] = [];

    function observe(type: string, cb: (entry: PerformanceEntry) => void) {
      try {
        const obs = new PerformanceObserver((list) => list.getEntries().forEach(cb));
        obs.observe({ type, buffered: true });
        observers.push(obs);
      } catch {
        // entry type not supported in this browser
      }
    }

    // LCP
    observe("largest-contentful-paint", (e) => {
      const v = Math.round((e as PerformanceEventTiming).startTime ?? e.duration);
      trackPerformanceMetric("LCP", v, rating("LCP", v));
    });

    // CLS — accumulate layout-shift scores
    let clsValue = 0;
    observe("layout-shift", (e) => {
      const entry = e as PerformanceEntry & { hadRecentInput?: boolean; value?: number };
      if (!entry.hadRecentInput) clsValue += entry.value ?? 0;
    });
    // Report CLS on page hide
    const reportCls = () => {
      const v = parseFloat(clsValue.toFixed(4));
      trackPerformanceMetric("CLS", v, rating("CLS", v));
    };
    document.addEventListener("visibilitychange", reportCls, { once: true });

    // FCP
    observe("paint", (e) => {
      if (e.name === "first-contentful-paint") {
        const v = Math.round(e.startTime);
        trackPerformanceMetric("FCP", v, rating("FCP", v));
      }
    });

    // INP / FID via event-timing
    observe("event", (e) => {
      const entry = e as PerformanceEventTiming;
      if (entry.processingStart && entry.startTime) {
        const fid = Math.round(entry.processingStart - entry.startTime);
        if (fid > 0) trackPerformanceMetric("FID", fid, rating("FID", fid));
      }
    });

    // TTFB via navigation timing
    try {
      const navEntries = performance.getEntriesByType("navigation");
      if (navEntries.length > 0) {
        const nav = navEntries[0] as PerformanceNavigationTiming;
        const ttfb = Math.round(nav.responseStart - nav.requestStart);
        trackPerformanceMetric("TTFB", ttfb, rating("TTFB", ttfb));
      }
    } catch {
      // ignore
    }

    return () => {
      observers.forEach((obs) => obs.disconnect());
      document.removeEventListener("visibilitychange", reportCls);
    };
  }, []);

  return <>{children}</>;
}

// ─── Public provider component ────────────────────────────────────────────────

interface AnalyticsProviderProps {
  children: React.ReactNode;
}

export function AnalyticsProvider({ children }: AnalyticsProviderProps) {
  return <AnalyticsInner>{children}</AnalyticsInner>;
}
