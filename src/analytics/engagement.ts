/**
 * Engagement Tracking
 *
 * Tracks:
 * - Active (visible, focused) time on page
 * - Session page depth
 * - Session project views
 * - Engagement score (0–100) with tier classification
 * - Idle detection
 *
 * All state is module-level (singleton) — safe for SPA use.
 * Resets per page view via reset() calls from AnalyticsProvider.
 */

import type { EngagementTier } from "./types";
import { ENGAGEMENT_TIERS, ENGAGEMENT_WEIGHTS } from "./constants";

// ─── Active time tracker ─────────────────────────────────────────────────────

class ActiveTimeTracker {
  private startedAt: number = Date.now();
  private accumulatedMs: number = 0;
  private isActive: boolean = true;
  private idleTimer: ReturnType<typeof setTimeout> | null = null;
  private readonly IDLE_THRESHOLD_MS = 90_000; // 90 seconds

  constructor() {
    if (typeof window !== "undefined") {
      this.attachListeners();
    }
  }

  private attachListeners(): void {
    const resetIdle = () => this.onActivity();
    const events = ["mousemove", "keydown", "scroll", "click", "touchstart"];
    events.forEach((e) => window.addEventListener(e, resetIdle, { passive: true }));

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        this.pause();
      } else {
        this.resume();
      }
    });

    window.addEventListener("blur", () => this.pause());
    window.addEventListener("focus", () => this.resume());
  }

  private onActivity(): void {
    if (!this.isActive) this.resume();
    this.resetIdleTimer();
  }

  private resetIdleTimer(): void {
    if (this.idleTimer) clearTimeout(this.idleTimer);
    this.idleTimer = setTimeout(() => this.pause(), this.IDLE_THRESHOLD_MS);
  }

  private pause(): void {
    if (!this.isActive) return;
    this.accumulatedMs += Date.now() - this.startedAt;
    this.isActive = false;
  }

  private resume(): void {
    if (this.isActive) return;
    this.startedAt = Date.now();
    this.isActive = true;
    this.resetIdleTimer();
  }

  getActiveMs(): number {
    if (this.isActive) {
      return this.accumulatedMs + (Date.now() - this.startedAt);
    }
    return this.accumulatedMs;
  }

  reset(): void {
    this.accumulatedMs = 0;
    this.startedAt = Date.now();
    this.isActive = true;
  }
}

// ─── Session state ────────────────────────────────────────────────────────────

class SessionManagerClass {
  private activeTimer = new ActiveTimeTracker();
  private pageDepth: number = 0;
  private projectViews: number = 0;
  private sessionEventCount: number = 0;
  private contactSectionReached: boolean = false;
  private formStarted: boolean = false;
  private formCompletionPct: number = 0;
  private scrollMaxPct: number = 0;
  private aiMessagesCount: number = 0;
  private firedTimeMilestones = new Set<number>();

  // ─── Page depth ────────────────────────────────────────────────────────

  incrementPageDepth(): void {
    this.pageDepth++;
  }

  getPageDepth(): number {
    return this.pageDepth;
  }

  // ─── Project views ─────────────────────────────────────────────────────

  incrementProjectViews(): void {
    this.projectViews++;
  }

  getProjectViews(): number {
    return this.projectViews;
  }

  // ─── Event count ───────────────────────────────────────────────────────

  incrementEventCount(): void {
    this.sessionEventCount++;
  }

  getEventCount(): number {
    return this.sessionEventCount;
  }

  // ─── Contact section ───────────────────────────────────────────────────

  setContactReached(): void {
    this.contactSectionReached = true;
  }

  isContactReached(): boolean {
    return this.contactSectionReached;
  }

  // ─── Form state ────────────────────────────────────────────────────────

  setFormStarted(): void {
    this.formStarted = true;
  }

  isFormStarted(): boolean {
    return this.formStarted;
  }

  setFormCompletionPct(pct: number): void {
    this.formCompletionPct = pct;
  }

  getFormCompletionPct(): number {
    return this.formCompletionPct;
  }

  // ─── Scroll max ────────────────────────────────────────────────────────

  updateScrollMax(pct: number): void {
    this.scrollMaxPct = Math.max(this.scrollMaxPct, pct);
  }

  getScrollMax(): number {
    return this.scrollMaxPct;
  }

  // ─── AI ────────────────────────────────────────────────────────────────

  incrementAiMessages(): void {
    this.aiMessagesCount++;
  }

  getAiMessages(): number {
    return this.aiMessagesCount;
  }

  // ─── Time milestones ───────────────────────────────────────────────────

  wasTimeMilestoneFired(seconds: number): boolean {
    return this.firedTimeMilestones.has(seconds);
  }

  markTimeMilestoneFired(seconds: number): void {
    this.firedTimeMilestones.add(seconds);
  }

  // ─── Active time ───────────────────────────────────────────────────────

  getActiveTime(): number {
    return this.activeTimer.getActiveMs();
  }

  // ─── Engagement score ──────────────────────────────────────────────────

  computeEngagementScore(): {
    score: number;
    tier: EngagementTier;
    scrollComponent: number;
    timeComponent: number;
    interactionComponent: number;
    projectViewsComponent: number;
  } {
    const scrollPts = Math.min(this.scrollMaxPct, 100) * ENGAGEMENT_WEIGHTS.scrollDepth;

    const activeSec = this.getActiveTime() / 1000;
    const timeRaw = activeSec <= 0 ? 0 : Math.log10(activeSec / 6 + 1) * 25;
    const timePts = Math.min(timeRaw, 25);

    const contactPts = this.contactSectionReached ? ENGAGEMENT_WEIGHTS.contactReached * 100 : 0;
    const formPts = this.formStarted ? ENGAGEMENT_WEIGHTS.formStarted * 100 : 0;
    const interactionPts = contactPts + formPts;

    const projectPts = Math.min(this.projectViews * 7, 20);

    const returnPts = 0; // set from outside

    const score = Math.round(
      scrollPts + timePts + interactionPts + projectPts + returnPts
    );

    const clampedScore = Math.min(100, Math.max(0, score));

    const tier = this.classifyTier(clampedScore);

    return {
      score: clampedScore,
      tier,
      scrollComponent: Math.round(scrollPts),
      timeComponent: Math.round(timePts),
      interactionComponent: Math.round(interactionPts),
      projectViewsComponent: Math.round(projectPts),
    };
  }

  private classifyTier(score: number): EngagementTier {
    if (score <= ENGAGEMENT_TIERS.BOUNCED[1]) return "bounced";
    if (score <= ENGAGEMENT_TIERS.LOW[1]) return "low";
    if (score <= ENGAGEMENT_TIERS.EVALUATING[1]) return "evaluating";
    if (score <= ENGAGEMENT_TIERS.HIGH_INTENT[1]) return "high_intent";
    return "ready_to_convert";
  }

  // ─── Per-page reset ────────────────────────────────────────────────────

  resetForPageView(): void {
    this.activeTimer.reset();
    this.firedTimeMilestones.clear();
    this.formStarted = false;
    this.formCompletionPct = 0;
    this.contactSectionReached = false;
    this.scrollMaxPct = 0;
  }
}

export const SessionManager = new SessionManagerClass();

// ─── Persistent user stats ────────────────────────────────────────────────────

const USER_STATS_KEY = "kt_user_stats";

interface UserStats {
  totalSessions: number;
  totalPageViews: number;
  firstVisitDate: string;
  firstTouchSource: string;
  firstTouchMedium: string;
  firstTouchCampaign: string;
  firstProjectViewed: string;
  hasSubmittedForm: boolean;
  formSubmissionDate: string;
  aiConversationsCount: number;
}

function getDefaultStats(): UserStats {
  return {
    totalSessions: 0,
    totalPageViews: 0,
    firstVisitDate: new Date().toISOString().split("T")[0],
    firstTouchSource: "",
    firstTouchMedium: "",
    firstTouchCampaign: "",
    firstProjectViewed: "",
    hasSubmittedForm: false,
    formSubmissionDate: "",
    aiConversationsCount: 0,
  };
}

export function getUserStats(): UserStats {
  if (typeof window === "undefined") return getDefaultStats();
  try {
    const raw = localStorage.getItem(USER_STATS_KEY);
    return raw ? { ...getDefaultStats(), ...JSON.parse(raw) } : getDefaultStats();
  } catch {
    return getDefaultStats();
  }
}

export function updateUserStats(partial: Partial<UserStats>): void {
  if (typeof window === "undefined") return;
  try {
    const current = getUserStats();
    const updated = { ...current, ...partial };
    localStorage.setItem(USER_STATS_KEY, JSON.stringify(updated));
  } catch {
    // ignore
  }
}

export function incrementSessionCount(): void {
  const stats = getUserStats();
  updateUserStats({ totalSessions: stats.totalSessions + 1 });
}

export function incrementPageViewCount(): void {
  const stats = getUserStats();
  updateUserStats({ totalPageViews: stats.totalPageViews + 1 });
}

export function getDaysSinceFirstVisit(): number {
  const stats = getUserStats();
  const first = new Date(stats.firstVisitDate).getTime();
  const now = Date.now();
  return Math.floor((now - first) / 86_400_000);
}
