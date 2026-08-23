/**
 * DataLayer Core
 *
 * Central push function that:
 * - Is SSR-safe (window guard)
 * - Enriches every event with BaseEventParams automatically
 * - Deduplicates scroll/section events in the same session
 * - Strips undefined values (GTM ignores them anyway, but keeps payloads clean)
 * - Batches rapid-fire events (200ms debounce for section views)
 *
 * Server-side tracking readiness:
 * - All events include a `client_id` for server-side GA4 Measurement Protocol
 * - Events are mirrored to a queue that a server route can drain
 */

import type { BaseEventParams, PageType, ConnectionType } from "./types";
import { SessionManager } from "./engagement";
import { getStoredConsent } from "./consent";

// ─── Client ID ────────────────────────────────────────────────────────────────

const CLIENT_ID_KEY = "kt_ga_cid";

function getOrCreateClientId(): string {
  if (typeof window === "undefined") return "server";
  try {
    let cid = localStorage.getItem(CLIENT_ID_KEY);
    if (!cid) {
      cid = `${Math.random().toString(36).slice(2)}.${Date.now()}`;
      localStorage.setItem(CLIENT_ID_KEY, cid);
    }
    return cid;
  } catch {
    return `mem.${Date.now()}`;
  }
}

// ─── Page context (updated on every route change) ─────────────────────────────

let currentPageContext: Pick<
  BaseEventParams,
  "page_path" | "page_title" | "page_type"
> = {
  page_path: "/",
  page_title: "Jandl Dávid",
  page_type: "homepage",
};

export function setPageContext(
  path: string,
  title: string,
  type: PageType
): void {
  currentPageContext = { page_path: path, page_title: title, page_type: type };
}

// ─── Dedup registry (session-scoped) ─────────────────────────────────────────

const firedScrollMilestones = new Set<string>();
const firedSections = new Set<string>();

export function clearDedup(): void {
  firedScrollMilestones.clear();
  firedSections.clear();
}

export function wasScrollFired(key: string): boolean {
  return firedScrollMilestones.has(key);
}

export function markScrollFired(key: string): void {
  firedScrollMilestones.add(key);
}

export function wasSectionFired(key: string): boolean {
  return firedSections.has(key);
}

export function markSectionFired(key: string): void {
  firedSections.add(key);
}

// ─── Device / connection enrichment ───────────────────────────────────────────

function getConnectionType(): ConnectionType {
  if (typeof navigator === "undefined") return "unknown";
  const conn = (
    navigator as Navigator & {
      connection?: { effectiveType?: string };
    }
  ).connection;
  const type = conn?.effectiveType;
  if (type === "4g" || type === "3g" || type === "2g" || type === "slow-2g") {
    return type;
  }
  return "unknown";
}

function getScrollDepth(): number {
  if (typeof window === "undefined") return 0;
  const el = document.documentElement;
  const scrollable = el.scrollHeight - el.clientHeight;
  if (scrollable <= 0) return 100;
  return Math.round((window.scrollY / scrollable) * 100);
}

// ─── UTM helpers ──────────────────────────────────────────────────────────────

function getUtmParam(key: string): string {
  if (typeof window === "undefined") return "";
  const sp = new URLSearchParams(window.location.search);
  return sp.get(key) || sessionStorage.getItem(`utm_${key}`) || "";
}

export function captureUtms(): void {
  if (typeof window === "undefined") return;
  const sp = new URLSearchParams(window.location.search);
  ["source", "medium", "campaign", "content", "term"].forEach((k) => {
    const val = sp.get(`utm_${k}`);
    if (val) sessionStorage.setItem(`utm_${k}`, val);
  });
}

// ─── Return visitor ───────────────────────────────────────────────────────────

const RETURN_VISITOR_KEY = "kt_rv";

export function markVisit(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(RETURN_VISITOR_KEY, "1");
  } catch {
    // ignore
  }
}

function isReturnVisitor(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(RETURN_VISITOR_KEY) === "1";
  } catch {
    return false;
  }
}

// ─── Base param builder ───────────────────────────────────────────────────────

function buildBaseParams(): BaseEventParams {
  return {
    ...currentPageContext,
    scroll_depth_pct: getScrollDepth(),
    time_on_page_ms: SessionManager.getActiveTime(),
    session_page_depth: SessionManager.getPageDepth(),
    is_return_visitor: isReturnVisitor(),
    viewport_width: typeof window !== "undefined" ? window.innerWidth : 0,
    connection_type: getConnectionType(),
    content_language: "hu",
  };
}

// ─── Server-side event queue (Measurement Protocol readiness) ────────────────

interface QueuedEvent {
  event_name: string;
  params: Record<string, unknown>;
  client_id: string;
  timestamp: number;
}

const SERVER_QUEUE_KEY = "kt_event_queue";
const MAX_QUEUE_SIZE = 50;

function enqueueForServer(
  eventName: string,
  params: Record<string, unknown>
): void {
  if (typeof window === "undefined") return;
  try {
    const raw = sessionStorage.getItem(SERVER_QUEUE_KEY);
    const queue: QueuedEvent[] = raw ? JSON.parse(raw) : [];
    queue.push({
      event_name: eventName,
      params,
      client_id: getOrCreateClientId(),
      timestamp: Date.now(),
    });
    if (queue.length > MAX_QUEUE_SIZE) queue.shift();
    sessionStorage.setItem(SERVER_QUEUE_KEY, JSON.stringify(queue));
  } catch {
    // ignore storage errors
  }
}

/** Drain the server queue. Call from a /api/analytics endpoint. */
export function drainServerQueue(): QueuedEvent[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = sessionStorage.getItem(SERVER_QUEUE_KEY);
    sessionStorage.removeItem(SERVER_QUEUE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function readServerQueue(): QueuedEvent[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = sessionStorage.getItem(SERVER_QUEUE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function restoreServerQueue(events: QueuedEvent[]): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(SERVER_QUEUE_KEY, JSON.stringify(events.slice(-MAX_QUEUE_SIZE)));
  } catch {
    // ignore storage errors
  }
}

export async function flushServerQueue(): Promise<void> {
  if (typeof window === "undefined") return;

  const queue = readServerQueue();
  if (queue.length === 0) return;

  sessionStorage.removeItem(SERVER_QUEUE_KEY);

  const consent = getStoredConsent();
  if (consent?.analytics !== true) {
    return;
  }

  const payload = JSON.stringify({
    events: queue,
    context: {
      consent_analytics: consent?.analytics === true,
      page_url: window.location.href,
      user_agent: navigator.userAgent,
    },
  });

  try {
    if (navigator.sendBeacon) {
      const blob = new Blob([payload], { type: "application/json" });
      const ok = navigator.sendBeacon("/api/analytics/events", blob);
      if (!ok) {
        throw new Error("sendBeacon failed");
      }
      return;
    }

    const response = await fetch("/api/analytics/events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: payload,
      keepalive: true,
      credentials: "same-origin",
    });

    if (!response.ok) {
      throw new Error(`Analytics flush failed with status ${response.status}`);
    }
  } catch {
    restoreServerQueue([...queue, ...readServerQueue()]);
  }
}

// ─── Core push function ───────────────────────────────────────────────────────

type EventPayload = Record<string, unknown>;

/**
 * Primary analytics dispatch function.
 * All events in events.ts call this.
 *
 * @param eventName  - GA4 event name (use EVENT constants)
 * @param extraParams - Event-specific parameters (merged with base params)
 * @param serverQueue - Whether to also enqueue for server-side Measurement Protocol
 */
export function pushEvent(
  eventName: string,
  extraParams: EventPayload = {},
  serverQueue = true
): void {
  if (typeof window === "undefined") return;

  const base = buildBaseParams();

  // Strip undefined values for clean payloads
  const params: EventPayload = {};
  const merged = { ...base, ...extraParams };
  for (const [k, v] of Object.entries(merged)) {
    if (v !== undefined && v !== null && v !== "") {
      params[k] = v;
    }
  }

  const payload: EventPayload = {
    event: eventName,
    client_id: getOrCreateClientId(),
    ...params,
    // UTM params on every event for funnel attribution
    utm_source: getUtmParam("source"),
    utm_medium: getUtmParam("medium"),
    utm_campaign: getUtmParam("campaign"),
    utm_content: getUtmParam("content"),
    utm_term: getUtmParam("term"),
  };

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(payload);

  if (serverQueue) {
    enqueueForServer(eventName, params);
  }

  if (import.meta.env.DEV) {
    console.groupCollapsed(`📊 [Analytics] ${eventName}`);
    console.table(
      Object.entries(params).map(([key, value]) => ({ key, value }))
    );
    console.groupEnd();
  }
}

// ─── User properties push ────────────────────────────────────────────────────

export function setUserProperties(properties: Record<string, unknown>): void {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: "set_user_properties",
    user_properties: properties,
  });
}
