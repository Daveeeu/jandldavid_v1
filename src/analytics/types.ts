/**
 * Analytics Type Definitions
 * GA4 + GTM + Consent Mode v2 + BigQuery-export ready
 *
 * Naming conventions follow GA4 recommended event schema:
 * https://developers.google.com/analytics/devguides/collection/ga4/reference/events
 */

// ─── Consent ──────────────────────────────────────────────────────────────────

export type ConsentState = "granted" | "denied";

export interface ConsentUpdate {
  analytics_storage: ConsentState;
  ad_storage: ConsentState;
  ad_user_data: ConsentState;
  ad_personalization: ConsentState;
  functionality_storage: ConsentState;
  personalization_storage: ConsentState;
  security_storage: ConsentState;
  wait_for_update?: number; // ms before firing tags anyway
}

// ─── DataLayer ────────────────────────────────────────────────────────────────

export interface DataLayerCommand {
  event?: string;
  [key: string]: unknown;
}

declare global {
  interface Window {
    dataLayer: DataLayerCommand[];
    gtag?: (...args: unknown[]) => void;
  }
}

// ─── Shared Parameters (sent with every event) ────────────────────────────────

export interface BaseEventParams {
  /** Current route path */
  page_path: string;
  /** Human-readable page title */
  page_title: string;
  /** Categorized page type for segmentation */
  page_type: PageType;
  /** Scroll % at the moment the event fires */
  scroll_depth_pct: number;
  /** Active (focused) milliseconds since page load */
  time_on_page_ms: number;
  /** Session-level page depth counter */
  session_page_depth: number;
  /** Whether user has visited before (cookie-based) */
  is_return_visitor: boolean;
  /** Browser viewport width for device segmentation */
  viewport_width: number;
  /** Navigator.connection.effectiveType */
  connection_type: ConnectionType;
  /** Content language */
  content_language: "hu" | "en";
}

// ─── Enums & Unions ───────────────────────────────────────────────────────────

export type PageType =
  | "homepage"
  | "project_case_study"
  | "about"
  | "legal"
  | "blog"
  | "not_found";

export type ConnectionType = "4g" | "3g" | "2g" | "slow-2g" | "unknown";

export type CtaType = "primary" | "secondary" | "ghost" | "inline_text" | "nav";

export type CtaLocation =
  | "hero"
  | "nav"
  | "capabilities_card"
  | "trust_section"
  | "faq_section"
  | "project_card"
  | "contact_section"
  | "footer"
  | "project_page_nav"
  | "project_page_hero"
  | "project_page_cta";

export type FormFieldName =
  | "name"
  | "email"
  | "message"
  | "check_ai_assist"
  | "check_consultation"
  | "check_existing_system";

export type SocialPlatform = "linkedin" | "github" | "twitter" | "email" | "phone";

export type OutboundLinkType = "text" | "button" | "image" | "social_icon" | "email_link" | "phone_link";

export type ScrollMilestone = 25 | 50 | 75 | 90 | 100;

export type TimeMilestone = 30 | 60 | 120 | 300;

export type EngagementTier = "bounced" | "low" | "evaluating" | "high_intent" | "ready_to_convert";

export type NavigationType =
  | "nav_menu"
  | "breadcrumb"
  | "cta_button"
  | "project_card"
  | "footer_link"
  | "next_project"
  | "back_button"
  | "browser_back";

// ─── Event Parameter Interfaces ───────────────────────────────────────────────

// NAV events
export interface PageViewParams extends BaseEventParams {
  referrer: string;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_content: string;
  utm_term: string;
}

export interface InternalNavigationParams extends BaseEventParams {
  from_path: string;
  to_path: string;
  trigger_label: string;
  navigation_type: NavigationType;
}

// CTA events
export interface CtaClickedParams extends BaseEventParams {
  cta_id: string;
  cta_label: string;
  cta_type: CtaType;
  cta_location: CtaLocation;
  cta_section: string;
  session_event_count: number;
}

// Scroll events
export interface ScrollDepthParams extends BaseEventParams {
  depth_pct: ScrollMilestone;
  time_elapsed_ms: number;
}

export interface SectionViewParams extends BaseEventParams {
  section_id: string;
  section_name: string;
  section_index: number;
  viewport_dwell_ms: number;
}

// Form events
export interface FormViewParams extends BaseEventParams {
  form_id: string;
}

export interface FormStartedParams extends BaseEventParams {
  form_id: string;
  first_field: FormFieldName;
  time_on_page_before_start_ms: number;
  session_project_views: number;
}

export interface FormFieldParams extends BaseEventParams {
  form_id: string;
  field_name: FormFieldName;
  field_index: number;
  completion_pct: number;
  time_on_field_ms?: number;
}

export interface FormFieldErrorParams extends BaseEventParams {
  form_id: string;
  field_name: FormFieldName;
  error_type: "required" | "invalid_email" | "too_short" | "too_long";
}

export interface FormAbandonedParams extends BaseEventParams {
  form_id: string;
  last_field_touched: FormFieldName | null;
  completion_pct: number;
  fields_completed_count: number;
  time_on_form_ms: number;
}

export interface FormSubmittedParams extends BaseEventParams {
  form_id: string;
  completion_time_ms: number;
  message_length_chars: number;
  checks_selected: string; // comma-separated check labels
  session_project_views: number;
  session_duration_ms: number;
  lead_source: string;
  /** GA4 recommended conversion parameter */
  currency?: string;
  value?: number;
}

export interface FormSubmissionFailedParams extends BaseEventParams {
  form_id: string;
  error_code: string;
  error_message_sanitized: string;
}

// Portfolio / Project events
export interface ProjectCardClickedParams extends BaseEventParams {
  project_name: string;
  project_slug: string;
  card_position: number;
  trigger_section: string;
}

export interface ProjectPageParams extends BaseEventParams {
  project_name: string;
  project_slug: string;
  referrer_type: string;
  referrer_project: string;
}

export interface ProjectSectionViewedParams extends BaseEventParams {
  project_name: string;
  section_id: string;
  section_name: string;
  section_index: number;
  dwell_ms: number;
}

export interface ProjectCompletedParams extends BaseEventParams {
  project_name: string;
  time_on_project_ms: number;
  sections_viewed_count: number;
  cta_seen: boolean;
}

// Portfolio service card
export interface ServiceCardParams extends BaseEventParams {
  service_name: string;
  service_index: number;
  action: "expanded" | "collapsed" | "cta_clicked";
}

// FAQ events
export interface FaqInteractionParams extends BaseEventParams {
  faq_question: string;
  faq_index: number;
  action: "expanded" | "collapsed";
  dwell_before_expand_ms: number;
}

// AI assistant events
export interface AiAssistantParams extends BaseEventParams {
  session_id: string;
}

export interface AiMessageParams extends BaseEventParams {
  message_index: number;
  message_length_chars: number;
  topic_category: "pricing" | "timeline" | "tech" | "portfolio" | "general";
  session_id: string;
}

export interface AiResponseParams extends BaseEventParams {
  message_index: number;
  response_length_chars: number;
  response_time_ms: number;
  contains_cta: boolean;
  session_id: string;
}

// Outbound / social events
export interface OutboundLinkParams extends BaseEventParams {
  destination_url: string;
  destination_domain: string;
  link_label: string;
  link_type: OutboundLinkType;
  section_name: string;
}

export interface EmailClickParams extends BaseEventParams {
  /** SHA-256 hashed email — never send PII raw */
  email_address_hashed: string;
  link_location: string;
}

export interface PhoneClickParams extends BaseEventParams {
  link_location: string;
}

export interface SocialLinkParams extends BaseEventParams {
  platform: SocialPlatform;
  link_label: string;
  link_location: string;
}

// Engagement events
export interface TimeOnPageParams extends BaseEventParams {
  milestone_seconds: TimeMilestone;
  scroll_depth_at_milestone: number;
}

export interface ExitIntentParams extends BaseEventParams {
  scroll_depth_pct: number;
  time_on_page_ms: number;
  form_started: boolean;
  form_completion_pct: number;
}

export interface EngagementScoreParams extends BaseEventParams {
  score: number;
  tier: EngagementTier;
  scroll_component: number;
  time_component: number;
  interaction_component: number;
  project_views_component: number;
}

// Error events
export interface JsErrorParams extends BaseEventParams {
  error_message: string;
  error_source: string;
  error_line: number;
  component_name: string;
}

export interface PerformanceParams extends BaseEventParams {
  metric_name: "LCP" | "FID" | "CLS" | "FCP" | "TTFB" | "INP";
  metric_value: number;
  metric_rating: "good" | "needs-improvement" | "poor";
}

// ─── Custom Dimensions (GA4 event-scoped) ─────────────────────────────────────

/**
 * These must be registered in GA4 Admin → Custom definitions → Event-scoped dimensions.
 * BigQuery export: appear as event_params in the events table.
 */
export const EVENT_SCOPED_DIMENSIONS = [
  "page_type",
  "cta_location",
  "cta_type",
  "project_name",
  "project_slug",
  "section_name",
  "section_index",
  "form_id",
  "field_name",
  "engagement_tier",
  "navigation_type",
  "ai_topic_category",
  "scroll_depth_pct",
  "time_on_page_ms",
  "lead_source",
] as const;

// ─── User Properties ──────────────────────────────────────────────────────────

/**
 * Set via gtag('set', 'user_properties', {...}) or via dataLayer.
 * BigQuery: appear in user_properties repeated record.
 */
export interface UserProperties {
  first_touch_source: string;
  first_touch_medium: string;
  first_touch_campaign: string;
  first_project_viewed: string;
  total_sessions: number;
  total_page_views: number;
  days_since_first_visit: number;
  has_submitted_form: boolean;
  form_submission_date: string;
  ai_conversations_count: number;
  preferred_language: string;
  returning_visitor: boolean;
  engagement_tier: EngagementTier;
}

// ─── E-commerce (future-ready) ────────────────────────────────────────────────

/** Matches GA4 recommended e-commerce item schema for BigQuery */
export interface EcommerceItem {
  item_id: string;
  item_name: string;
  item_category: string;
  item_brand: string;
  price: number;
  currency: string;
  quantity: number;
}

export interface EcommerceParams {
  currency: string;
  value: number;
  items: EcommerceItem[];
}
