/**
 * Consent Mode v2 Implementation
 *
 * Implements Google Consent Mode v2 via dataLayer:
 * https://developers.google.com/tag-platform/security/guides/consent?hl=en&consentmode=advanced
 *
 * Flow:
 *   1. On load → set default (denied) before GTM fires any tag
 *   2. User grants consent → update consent state
 *   3. GTM reads consent state before firing GA4 / Ads tags
 *
 * Advanced Consent Mode: modeled hits are sent even when denied,
 * allowing GA4 to fill gaps in reporting without raw PII.
 */

import type { ConsentUpdate } from "./types";

// ─── Storage key ──────────────────────────────────────────────────────────────

const CONSENT_STORAGE_KEY = "kt_consent_v2";

export interface StoredConsent {
  analytics: boolean;
  marketing: boolean;
  functionality: boolean;
  timestamp: number;
  version: number;
}

const CONSENT_VERSION = 2;

// ─── DataLayer push (no import to avoid circular deps) ───────────────────────

function pushToDataLayer(command: Record<string, unknown>): void {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(command);
}

// ─── Default consent (called before GTM loads) ────────────────────────────────

/**
 * Must be called as early as possible — ideally before GTM script tag.
 * Sets conservative defaults: all denied except security_storage.
 * GTM will wait `wait_for_update` ms before firing tags.
 */
export function initConsentDefaults(): void {
  if (typeof window === "undefined") return;

  const stored = getStoredConsent();

  if (stored) {
    // User has already made a choice — honor it immediately
    applyConsent(stored.analytics, stored.marketing, stored.functionality);
    return;
  }

  // No prior consent — set denied defaults with wait_for_update
  // This allows consent banner to load and update before GA4 fires
  const defaults: ConsentUpdate = {
    analytics_storage: "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    functionality_storage: "denied",
    personalization_storage: "denied",
    security_storage: "granted", // always granted (no PII involved)
    wait_for_update: 500,
  };

  pushToDataLayer({ event: "consent", consentDefaultSet: true, ...defaults });
}

// ─── Update consent (user interaction) ───────────────────────────────────────

/**
 * Call when user accepts/denies cookies.
 * Persists choice to localStorage and pushes update to dataLayer.
 */
export function updateConsent(
  analytics: boolean,
  marketing: boolean,
  functionality: boolean
): void {
  const consent: StoredConsent = {
    analytics,
    marketing,
    functionality,
    timestamp: Date.now(),
    version: CONSENT_VERSION,
  };

  persistConsent(consent);
  applyConsent(analytics, marketing, functionality);

  pushToDataLayer({
    event: "consent_updated",
    consent_analytics: analytics,
    consent_marketing: marketing,
    consent_functionality: functionality,
  });
}

function applyConsent(
  analytics: boolean,
  marketing: boolean,
  functionality: boolean
): void {
  const update: ConsentUpdate = {
    analytics_storage: analytics ? "granted" : "denied",
    ad_storage: marketing ? "granted" : "denied",
    ad_user_data: marketing ? "granted" : "denied",
    ad_personalization: marketing ? "granted" : "denied",
    functionality_storage: functionality ? "granted" : "denied",
    personalization_storage: functionality ? "granted" : "denied",
    security_storage: "granted",
  };

  pushToDataLayer({ event: "consent", consentUpdate: true, ...update });
}

// ─── Grant all (opt-in) ───────────────────────────────────────────────────────

export function grantAllConsent(): void {
  updateConsent(true, true, true);
}

// ─── Minimal consent (analytics only, no ads) ────────────────────────────────

export function grantAnalyticsOnly(): void {
  updateConsent(true, false, false);
}

// ─── Revoke all ───────────────────────────────────────────────────────────────

export function revokeAllConsent(): void {
  updateConsent(false, false, false);
  clearStoredConsent();
}

// ─── Read stored consent ──────────────────────────────────────────────────────

export function getStoredConsent(): StoredConsent | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredConsent;
    if (parsed.version !== CONSENT_VERSION) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function hasConsentDecision(): boolean {
  return getStoredConsent() !== null;
}

export function isAnalyticsGranted(): boolean {
  const stored = getStoredConsent();
  return stored?.analytics === true;
}

// ─── Persistence ──────────────────────────────────────────────────────────────

function persistConsent(consent: StoredConsent): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(consent));
  } catch {
    // localStorage unavailable (private mode, etc.)
  }
}

function clearStoredConsent(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(CONSENT_STORAGE_KEY);
  } catch {
    // ignore
  }
}
