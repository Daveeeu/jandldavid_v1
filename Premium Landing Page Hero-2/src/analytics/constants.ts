/**
 * Analytics Constants
 * Single source of truth for all event names, form IDs, section IDs.
 * Prevents typos from silently creating new events in GA4.
 *
 * GA4 naming rules:
 * - Lowercase with underscores
 * - Max 40 characters
 * - No spaces, no special characters except underscore
 * - No numbers at start
 * - Reserved names avoided (error, exception, etc.)
 */

// ─── Event Names ──────────────────────────────────────────────────────────────

export const EVENT = {
  // Navigation
  PAGE_VIEW: "page_view",
  INTERNAL_NAVIGATION: "internal_navigation",
  PAGE_EXIT_INTENT: "page_exit_intent",

  // CTA
  CTA_CLICKED: "cta_clicked",
  CTA_SEEN_NOT_CLICKED: "cta_seen_not_clicked",

  // Scroll & engagement
  SCROLL_DEPTH: "scroll_depth",
  SECTION_IN_VIEW: "section_in_view",
  TIME_ON_PAGE_MILESTONE: "time_on_page_milestone",
  ENGAGEMENT_SCORE: "engagement_score",

  // Form (contact)
  FORM_VIEW: "form_view",
  FORM_STARTED: "form_started",
  FORM_FIELD_FOCUSED: "form_field_focused",
  FORM_FIELD_COMPLETED: "form_field_completed",
  FORM_FIELD_ERRORED: "form_field_errored",
  FORM_ABANDONED: "form_abandoned",
  FORM_SUBMITTED: "form_submitted",
  FORM_SUBMISSION_FAILED: "form_submission_failed",

  // Portfolio — homepage
  PROJECT_CARD_CLICKED: "project_card_clicked",
  SERVICE_CARD_INTERACTED: "service_card_interacted",
  FAQ_INTERACTED: "faq_interacted",

  // Portfolio — project pages
  PROJECT_PAGE_ENTERED: "project_page_entered",
  PROJECT_SECTION_VIEWED: "project_section_viewed",
  PROJECT_COMPLETED: "project_completed",
  PROJECT_EXITED_NO_CTA: "project_exited_no_cta",
  NEXT_PROJECT_CLICKED: "next_project_clicked",

  // AI assistant
  AI_ASSISTANT_OPENED: "ai_assistant_opened",
  AI_ASSISTANT_CLOSED: "ai_assistant_closed",
  AI_MESSAGE_SENT: "ai_message_sent",
  AI_RESPONSE_RECEIVED: "ai_response_received",
  AI_CTA_SURFACED: "ai_cta_surfaced",
  AI_CTA_CLICKED: "ai_cta_clicked",
  AI_CONVERSATION_TO_FORM: "ai_conversation_to_form",

  // Outbound & contact links
  OUTBOUND_LINK_CLICKED: "outbound_link_clicked",
  EMAIL_LINK_CLICKED: "email_link_clicked",
  PHONE_LINK_CLICKED: "phone_link_clicked",
  SOCIAL_LINK_CLICKED: "social_link_clicked",

  // Downloads (future)
  FILE_DOWNLOAD: "file_download",

  // Errors
  JS_ERROR: "js_error",
  NETWORK_ERROR: "network_error",
  PERFORMANCE_METRIC: "performance_metric",
} as const;

export type EventName = (typeof EVENT)[keyof typeof EVENT];

// ─── GA4 Measurement ID placeholder ──────────────────────────────────────────
// Replace with import.meta.env.VITE_GA4_MEASUREMENT_ID in production

export const GA4_MEASUREMENT_ID =
  (import.meta.env?.VITE_GA4_MEASUREMENT_ID as string | undefined) || "G-XXXXXXXXXX";

export const GTM_CONTAINER_ID =
  (import.meta.env?.VITE_GTM_CONTAINER_ID as string | undefined) || "GTM-XXXXXXX";

// ─── Form IDs ─────────────────────────────────────────────────────────────────

export const FORM_ID = {
  CONTACT: "contact_form_main",
  NEWSLETTER: "newsletter_form", // future
} as const;

// ─── Section IDs (must match DOM ids in components) ───────────────────────────

export const SECTION = {
  HERO: "section-hero",
  SERVICES: "section-services",
  PROJECTS: "section-projects",
  PROCESS: "section-process",
  TRUST: "section-trust",
  FAQ: "section-faq",
  CONTACT: "section-contact",
} as const;

export const SECTION_NAMES: Record<string, string> = {
  [SECTION.HERO]: "Hero",
  [SECTION.SERVICES]: "Szolgáltatások",
  [SECTION.PROJECTS]: "Projektek",
  [SECTION.PROCESS]: "Folyamat",
  [SECTION.TRUST]: "Bizalom",
  [SECTION.FAQ]: "GYIK",
  [SECTION.CONTACT]: "Kapcsolat",
};

// ─── Project slugs ────────────────────────────────────────────────────────────

export const PROJECT_SLUG = {
  PERFORMANCE_VD: "performancevd",
  INFRASTRUCTURE: "infrastructure-deployment-system",
} as const;

export const PROJECT_NAMES: Record<string, string> = {
  [PROJECT_SLUG.PERFORMANCE_VD]: "PerformanceVD",
  [PROJECT_SLUG.INFRASTRUCTURE]: "Infrastructure Deployment System",
};

// ─── CTA IDs (for unambiguous attribution) ────────────────────────────────────

export const CTA_ID = {
  HERO_PRIMARY: "hero_cta_primary",
  HERO_SECONDARY: "hero_cta_secondary",
  NAV_CONTACT: "nav_contact_btn",
  CAPABILITIES_CARD: "capabilities_cta_{index}",
  TRUST_START_PROJECT: "trust_start_project",
  FAQ_BOTTOM: "faq_bottom_cta",
  FOOTER_CTA: "footer_cta",
  PROJECT_CARD: "project_card_cta_{slug}",
  PROJECT_PAGE_HERO: "project_hero_cta",
  PROJECT_PAGE_CTA: "project_bottom_cta",
  NEXT_PROJECT: "next_project_nav",
  AI_ASSISTANT: "ai_cta",
} as const;

// ─── Scroll milestones (%) ────────────────────────────────────────────────────

export const SCROLL_MILESTONES = [25, 50, 75, 90, 100] as const;

// ─── Time milestones (seconds) ────────────────────────────────────────────────

export const TIME_MILESTONES = [30, 60, 120, 300] as const;

// ─── Engagement score weights ─────────────────────────────────────────────────

export const ENGAGEMENT_WEIGHTS = {
  scrollDepth: 0.30,    // max 30 pts (0.3 per pct point)
  activeTime: 0.25,     // max 25 pts (log scale, 10 min = max)
  projectViews: 0.20,   // max 20 pts (7 pts each, cap at 3)
  contactReached: 0.10, // 10 pts (boolean)
  formStarted: 0.10,    // 10 pts (boolean)
  returnVisit: 0.05,    // 5 pts (boolean)
} as const;

export const ENGAGEMENT_TIERS = {
  BOUNCED: [0, 20],
  LOW: [21, 45],
  EVALUATING: [46, 70],
  HIGH_INTENT: [71, 89],
  READY_TO_CONVERT: [90, 100],
} as const;

// ─── BigQuery schema notes ─────────────────────────────────────────────────────
/**
 * BigQuery GA4 export table: `analytics_XXXXXXXX.events_YYYYMMDD`
 *
 * Key fields used by this implementation:
 *   event_name          → EVENT constants
 *   event_params[]      → BaseEventParams + event-specific params
 *   user_properties[]   → UserProperties interface
 *   user_pseudo_id      → GA4 auto-set
 *   session_id          → engagement.ts SessionManager
 *   traffic_source.*    → UTM params from PageViewParams
 *
 * Custom event-scoped dimensions registered in GA4 Admin:
 *   See EVENT_SCOPED_DIMENSIONS in types.ts
 *
 * To query lead conversion in BigQuery:
 *   SELECT user_pseudo_id, event_timestamp
 *   FROM `analytics_XXX.events_*`
 *   WHERE event_name = 'form_submitted'
 *   AND DATE(_PARTITIONTIME) >= DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY)
 */
