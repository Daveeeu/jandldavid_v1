/**
 * Analytics Event Functions
 *
 * All trackable interactions in the application.
 * Each function:
 *  - Has a unique, typed signature
 *  - Calls pushEvent() with the correct GA4 event name
 *  - Enriches params via SessionManager
 *  - Never fires duplicate scroll/section events (dedup guards)
 *
 * Usage: import { track } from "@/analytics" and call track.ctaClicked(...)
 */

import { pushEvent, setUserProperties, wasScrollFired, markScrollFired, wasSectionFired, markSectionFired } from "./dataLayer";
import { SessionManager, getUserStats, updateUserStats, getDaysSinceFirstVisit } from "./engagement";
import { EVENT, FORM_ID, PROJECT_NAMES, SECTION_NAMES } from "./constants";
import type {
  CtaLocation,
  CtaType,
  FormFieldName,
  NavigationType,
  OutboundLinkType,
  ScrollMilestone,
  SocialPlatform,
  TimeMilestone,
} from "./types";

// ─── Navigation ───────────────────────────────────────────────────────────────

export function trackPageView(
  path: string,
  title: string,
  referrer: string = document.referrer
): void {
  const stats = getUserStats();
  pushEvent(EVENT.PAGE_VIEW, {
    page_path: path,
    page_title: title,
    referrer,
    utm_source: new URLSearchParams(window.location.search).get("utm_source") || "",
    utm_medium: new URLSearchParams(window.location.search).get("utm_medium") || "",
    utm_campaign: new URLSearchParams(window.location.search).get("utm_campaign") || "",
    utm_content: new URLSearchParams(window.location.search).get("utm_content") || "",
    utm_term: new URLSearchParams(window.location.search).get("utm_term") || "",
    session_project_views: SessionManager.getProjectViews(),
    total_sessions: stats.totalSessions,
    total_page_views: stats.totalPageViews,
    days_since_first_visit: getDaysSinceFirstVisit(),
  });
}

export function trackInternalNavigation(
  fromPath: string,
  toPath: string,
  triggerLabel: string,
  navigationType: NavigationType
): void {
  pushEvent(EVENT.INTERNAL_NAVIGATION, {
    from_path: fromPath,
    to_path: toPath,
    trigger_label: triggerLabel,
    navigation_type: navigationType,
  });
}

export function trackExitIntent(
  scrollDepthPct: number,
  timeOnPageMs: number,
  formStarted: boolean,
  formCompletionPct: number
): void {
  pushEvent(EVENT.PAGE_EXIT_INTENT, {
    scroll_depth_at_exit: scrollDepthPct,
    time_on_page_ms: timeOnPageMs,
    form_started: formStarted,
    form_completion_pct: formCompletionPct,
  });
}

// ─── CTA ──────────────────────────────────────────────────────────────────────

export function trackCtaClicked(
  ctaId: string,
  ctaLabel: string,
  ctaType: CtaType,
  ctaLocation: CtaLocation,
  ctaSection: string
): void {
  SessionManager.incrementEventCount();
  pushEvent(EVENT.CTA_CLICKED, {
    cta_id: ctaId,
    cta_label: ctaLabel,
    cta_type: ctaType,
    cta_location: ctaLocation,
    cta_section: ctaSection,
    session_event_count: SessionManager.getEventCount(),
    session_project_views: SessionManager.getProjectViews(),
    contact_section_reached: SessionManager.isContactReached(),
  });
}

// ─── Scroll depth ─────────────────────────────────────────────────────────────

export function trackScrollDepth(
  depthPct: ScrollMilestone,
  timeElapsedMs: number
): void {
  const key = `${window.location.pathname}:${depthPct}`;
  if (wasScrollFired(key)) return;
  markScrollFired(key);

  SessionManager.updateScrollMax(depthPct);

  pushEvent(EVENT.SCROLL_DEPTH, {
    depth_pct: depthPct,
    time_elapsed_ms: timeElapsedMs,
  });
}

// ─── Section view ─────────────────────────────────────────────────────────────

export function trackSectionInView(
  sectionId: string,
  sectionIndex: number,
  dwellMs: number = 0
): void {
  const key = `${window.location.pathname}:${sectionId}`;
  if (wasSectionFired(key)) return;
  markSectionFired(key);

  const sectionName = SECTION_NAMES[sectionId] || sectionId;

  // Track when contact section is first seen
  if (sectionId === "section-contact") {
    SessionManager.setContactReached();
  }

  pushEvent(EVENT.SECTION_IN_VIEW, {
    section_id: sectionId,
    section_name: sectionName,
    section_index: sectionIndex,
    viewport_dwell_ms: dwellMs,
  });
}

// ─── Time on page milestone ───────────────────────────────────────────────────

export function trackTimeOnPage(milestoneSeconds: TimeMilestone): void {
  if (SessionManager.wasTimeMilestoneFired(milestoneSeconds)) return;
  SessionManager.markTimeMilestoneFired(milestoneSeconds);

  pushEvent(EVENT.TIME_ON_PAGE_MILESTONE, {
    milestone_seconds: milestoneSeconds,
    scroll_depth_at_milestone: SessionManager.getScrollMax(),
    session_project_views: SessionManager.getProjectViews(),
  });
}

// ─── Engagement score (send on exit) ──────────────────────────────────────────

export function trackEngagementScore(): void {
  const result = SessionManager.computeEngagementScore();

  pushEvent(EVENT.ENGAGEMENT_SCORE, {
    engagement_score: result.score,
    engagement_tier: result.tier,
    scroll_component: result.scrollComponent,
    time_component: result.timeComponent,
    interaction_component: result.interactionComponent,
    project_views_component: result.projectViewsComponent,
  });

  // Update user property so it's available in GA4 user segments
  setUserProperties({ engagement_tier: result.tier });
}

// ─── Form events ──────────────────────────────────────────────────────────────

export function trackFormView(formId: string = FORM_ID.CONTACT): void {
  pushEvent(EVENT.FORM_VIEW, { form_id: formId });
}

export function trackFormStarted(
  firstField: FormFieldName,
  formId: string = FORM_ID.CONTACT
): void {
  SessionManager.setFormStarted();

  pushEvent(EVENT.FORM_STARTED, {
    form_id: formId,
    first_field: firstField,
    time_on_page_before_start_ms: SessionManager.getActiveTime(),
    session_project_views: SessionManager.getProjectViews(),
    contact_section_reached: SessionManager.isContactReached(),
  });
}

export function trackFormFieldFocused(
  fieldName: FormFieldName,
  fieldIndex: number,
  completionPct: number,
  formId: string = FORM_ID.CONTACT
): void {
  pushEvent(EVENT.FORM_FIELD_FOCUSED, {
    form_id: formId,
    field_name: fieldName,
    field_index: fieldIndex,
    completion_pct: completionPct,
  });
}

export function trackFormFieldCompleted(
  fieldName: FormFieldName,
  fieldIndex: number,
  completionPct: number,
  timeOnFieldMs: number,
  formId: string = FORM_ID.CONTACT
): void {
  SessionManager.setFormCompletionPct(completionPct);

  pushEvent(EVENT.FORM_FIELD_COMPLETED, {
    form_id: formId,
    field_name: fieldName,
    field_index: fieldIndex,
    completion_pct: completionPct,
    time_on_field_ms: timeOnFieldMs,
  });
}

export function trackFormFieldErrored(
  fieldName: FormFieldName,
  errorType: "required" | "invalid_email" | "too_short" | "too_long",
  formId: string = FORM_ID.CONTACT
): void {
  pushEvent(EVENT.FORM_FIELD_ERRORED, {
    form_id: formId,
    field_name: fieldName,
    error_type: errorType,
  });
}

export function trackFormAbandoned(
  lastField: FormFieldName | null,
  completionPct: number,
  fieldsCompleted: number,
  timeOnFormMs: number,
  formId: string = FORM_ID.CONTACT
): void {
  pushEvent(EVENT.FORM_ABANDONED, {
    form_id: formId,
    last_field_touched: lastField,
    completion_pct: completionPct,
    fields_completed_count: fieldsCompleted,
    time_on_form_ms: timeOnFormMs,
    session_project_views: SessionManager.getProjectViews(),
  });
}

export function trackFormSubmitted(
  completionTimeMs: number,
  messageLengthChars: number,
  checksSelected: string[],
  leadSource: string,
  formId: string = FORM_ID.CONTACT
): void {
  const stats = getUserStats();

  pushEvent(
    EVENT.FORM_SUBMITTED,
    {
      form_id: formId,
      completion_time_ms: completionTimeMs,
      message_length_chars: messageLengthChars,
      checks_selected: checksSelected.join(","),
      lead_source: leadSource,
      session_project_views: SessionManager.getProjectViews(),
      session_duration_ms: SessionManager.getActiveTime(),
      total_sessions: stats.totalSessions,
      // GA4 conversion value
      currency: "EUR",
      value: 500,
    },
    true // enqueue for server-side Measurement Protocol
  );

  // Update persistent user state
  updateUserStats({
    hasSubmittedForm: true,
    formSubmissionDate: new Date().toISOString().split("T")[0],
  });

  setUserProperties({
    has_submitted_form: true,
    form_submission_date: new Date().toISOString().split("T")[0],
  });
}

export function trackFormSubmissionFailed(
  errorCode: string,
  errorMsg: string,
  formId: string = FORM_ID.CONTACT
): void {
  pushEvent(EVENT.FORM_SUBMISSION_FAILED, {
    form_id: formId,
    error_code: errorCode,
    error_message_sanitized: errorMsg.slice(0, 100),
  });
}

// ─── Portfolio — homepage ─────────────────────────────────────────────────────

export function trackProjectCardClicked(
  projectName: string,
  projectSlug: string,
  cardPosition: number,
  triggerSection: string
): void {
  SessionManager.incrementProjectViews();

  pushEvent(EVENT.PROJECT_CARD_CLICKED, {
    project_name: projectName,
    project_slug: projectSlug,
    card_position: cardPosition,
    trigger_section: triggerSection,
    session_project_views: SessionManager.getProjectViews(),
  });
}

export function trackServiceCardInteracted(
  serviceName: string,
  serviceIndex: number,
  action: "expanded" | "collapsed" | "cta_clicked"
): void {
  pushEvent(EVENT.SERVICE_CARD_INTERACTED, {
    service_name: serviceName,
    service_index: serviceIndex,
    action,
  });
}

export function trackFaqInteracted(
  faqQuestion: string,
  faqIndex: number,
  action: "expanded" | "collapsed",
  dwellBeforeExpandMs: number
): void {
  pushEvent(EVENT.FAQ_INTERACTED, {
    faq_question: faqQuestion.slice(0, 80),
    faq_index: faqIndex,
    action,
    dwell_before_expand_ms: dwellBeforeExpandMs,
  });
}

// ─── Portfolio — project pages ────────────────────────────────────────────────

export function trackProjectPageEntered(
  projectSlug: string,
  referrerType: string,
  referrerProject: string = ""
): void {
  const projectName = PROJECT_NAMES[projectSlug] || projectSlug;
  SessionManager.incrementProjectViews();

  pushEvent(EVENT.PROJECT_PAGE_ENTERED, {
    project_name: projectName,
    project_slug: projectSlug,
    referrer_type: referrerType,
    referrer_project: referrerProject,
    session_project_views: SessionManager.getProjectViews(),
  });
}

export function trackProjectSectionViewed(
  projectSlug: string,
  sectionId: string,
  sectionName: string,
  sectionIndex: number,
  dwellMs: number
): void {
  const key = `${projectSlug}:${sectionId}`;
  if (wasSectionFired(key)) return;
  markSectionFired(key);

  const projectName = PROJECT_NAMES[projectSlug] || projectSlug;

  pushEvent(EVENT.PROJECT_SECTION_VIEWED, {
    project_name: projectName,
    project_slug: projectSlug,
    section_id: sectionId,
    section_name: sectionName,
    section_index: sectionIndex,
    dwell_ms: dwellMs,
  });
}

export function trackProjectCompleted(
  projectSlug: string,
  timeOnProjectMs: number,
  sectionsViewedCount: number,
  ctaSeen: boolean
): void {
  const projectName = PROJECT_NAMES[projectSlug] || projectSlug;

  pushEvent(EVENT.PROJECT_COMPLETED, {
    project_name: projectName,
    project_slug: projectSlug,
    time_on_project_ms: timeOnProjectMs,
    sections_viewed_count: sectionsViewedCount,
    cta_seen: ctaSeen,
  });
}

export function trackNextProjectClicked(
  currentProject: string,
  nextProject: string
): void {
  pushEvent(EVENT.NEXT_PROJECT_CLICKED, {
    current_project: currentProject,
    next_project: nextProject,
  });
}

// ─── AI assistant ─────────────────────────────────────────────────────────────

export function trackAiAssistantOpened(
  triggerMethod: "fab" | "inline" | "keyboard",
  sessionId: string
): void {
  pushEvent(EVENT.AI_ASSISTANT_OPENED, {
    trigger_method: triggerMethod,
    session_id: sessionId,
  });
}

export function trackAiAssistantClosed(
  closeMethod: "x_button" | "outside_click" | "escape",
  messagesSent: number,
  sessionDurationMs: number,
  ctaShown: boolean,
  sessionId: string
): void {
  pushEvent(EVENT.AI_ASSISTANT_CLOSED, {
    close_method: closeMethod,
    messages_sent_count: messagesSent,
    session_duration_ms: sessionDurationMs,
    cta_shown: ctaShown,
    session_id: sessionId,
  });

  if (messagesSent > 0) {
    const stats = getUserStats();
    updateUserStats({ aiConversationsCount: stats.aiConversationsCount + 1 });
  }
}

export function trackAiMessageSent(
  messageIndex: number,
  messageLengthChars: number,
  topicCategory: "pricing" | "timeline" | "tech" | "portfolio" | "general",
  sessionId: string
): void {
  SessionManager.incrementAiMessages();

  pushEvent(EVENT.AI_MESSAGE_SENT, {
    message_index: messageIndex,
    message_length_chars: messageLengthChars,
    topic_category: topicCategory,
    session_id: sessionId,
    session_ai_messages: SessionManager.getAiMessages(),
  });
}

export function trackAiResponseReceived(
  messageIndex: number,
  responseLengthChars: number,
  responseTimeMs: number,
  containsCta: boolean,
  sessionId: string
): void {
  pushEvent(EVENT.AI_RESPONSE_RECEIVED, {
    message_index: messageIndex,
    response_length_chars: responseLengthChars,
    response_time_ms: responseTimeMs,
    contains_cta: containsCta,
    session_id: sessionId,
  });
}

export function trackAiCtaClicked(
  ctaType: string,
  messageIndexAtClick: number,
  sessionId: string
): void {
  pushEvent(EVENT.AI_CTA_CLICKED, {
    cta_type: ctaType,
    message_index_at_click: messageIndexAtClick,
    session_id: sessionId,
  });
}

// ─── Outbound & contact links ─────────────────────────────────────────────────

export function trackOutboundLink(
  destinationUrl: string,
  linkLabel: string,
  linkType: OutboundLinkType,
  sectionName: string
): void {
  let destinationDomain = "";
  try {
    destinationDomain = new URL(destinationUrl).hostname;
  } catch {
    destinationDomain = destinationUrl;
  }

  pushEvent(EVENT.OUTBOUND_LINK_CLICKED, {
    destination_url: destinationUrl,
    destination_domain: destinationDomain,
    link_label: linkLabel,
    link_type: linkType,
    section_name: sectionName,
  });
}

export function trackEmailClick(
  emailAddress: string,
  linkLocation: string
): void {
  // Hash the email — never send PII raw
  const hashed = hashString(emailAddress);

  pushEvent(EVENT.EMAIL_LINK_CLICKED, {
    email_address_hashed: hashed,
    link_location: linkLocation,
  });
}

export function trackPhoneClick(linkLocation: string): void {
  pushEvent(EVENT.PHONE_LINK_CLICKED, { link_location: linkLocation });
}

export function trackSocialLink(
  platform: SocialPlatform,
  linkLabel: string,
  linkLocation: string
): void {
  pushEvent(EVENT.SOCIAL_LINK_CLICKED, {
    platform,
    link_label: linkLabel,
    link_location: linkLocation,
  });
}

// ─── Errors ───────────────────────────────────────────────────────────────────

export function trackJsError(
  errorMessage: string,
  errorSource: string,
  errorLine: number,
  componentName: string = "unknown"
): void {
  pushEvent(EVENT.JS_ERROR, {
    error_message: errorMessage.slice(0, 200),
    error_source: errorSource,
    error_line: errorLine,
    component_name: componentName,
  });
}

export function trackNetworkError(
  urlPath: string,
  statusCode: number,
  errorType: string
): void {
  pushEvent(EVENT.NETWORK_ERROR, {
    url_path: urlPath,
    status_code: statusCode,
    error_type: errorType,
  });
}

export function trackPerformanceMetric(
  metricName: "LCP" | "FID" | "CLS" | "FCP" | "TTFB" | "INP",
  metricValue: number,
  metricRating: "good" | "needs-improvement" | "poor"
): void {
  pushEvent(EVENT.PERFORMANCE_METRIC, {
    metric_name: metricName,
    metric_value: Math.round(metricValue),
    metric_rating: metricRating,
  });
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function hashString(str: string): string {
  // Simple djb2 hash — not crypto-strength but sufficient for analytics anonymization
  // In production, use SubtleCrypto SHA-256
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 33) ^ str.charCodeAt(i);
  }
  return `h_${(hash >>> 0).toString(16)}`;
}
