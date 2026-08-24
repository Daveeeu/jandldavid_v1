/**
 * Analytics Public API
 *
 * Import from "@/analytics" — never import internal modules directly.
 *
 * Usage:
 *   import { track, AnalyticsProvider } from "@/analytics";
 *   track.ctaClicked("hero_cta_primary", "Projekt indítása", "primary", "hero", "hero");
 */

export { AnalyticsProvider } from "./AnalyticsProvider";

export * as track from "./events";

export {
  useScrollDepthTracking,
  useTimeMilestones,
  useSectionTracking,
  useOutboundLinkTracking,
  useExitIntent,
  useFormTracking,
  useProjectSectionTracking,
} from "./hooks";

export {
  updateConsent,
  grantAllConsent,
  grantAnalyticsOnly,
  revokeAllConsent,
  hasConsentDecision,
  isAnalyticsGranted,
  getStoredConsent,
  subscribeToConsentChanges,
} from "./consent";

export { drainServerQueue, flushServerQueue } from "./dataLayer";

export { SessionManager, getUserStats, updateUserStats } from "./engagement";

export type { StoredConsent } from "./consent";
export type { ConsentUpdate } from "./types";

export type {
  UserProperties,
  EngagementTier,
  PageType,
  CtaType,
  CtaLocation,
  FormFieldName,
  SocialPlatform,
  EcommerceItem,
  EcommerceParams,
} from "./types";

export { EVENT, FORM_ID, SECTION, CTA_ID, PROJECT_SLUG } from "./constants";
