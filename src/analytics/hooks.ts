/**
 * Analytics React Hooks
 *
 * Encapsulate all DOM-level tracking logic so components
 * stay clean — they just call `track.*` or use these hooks.
 *
 * Hooks:
 *   useScrollDepthTracking   — fires scroll milestones
 *   useTimeMilestones        — fires time-on-page milestones
 *   useSectionTracking       — IntersectionObserver for named sections
 *   useOutboundLinkTracking  — global click delegation for <a> tags
 *   useExitIntent            — mouseleave-top exit detection
 *   useFormTracking          — returns field-level tracking handlers
 *   useProjectSectionTracking— per-project-page section tracker
 */

import { useEffect, useRef, useCallback } from "react";
import {
  trackScrollDepth,
  trackTimeOnPage,
  trackSectionInView,
  trackOutboundLink,
  trackEmailClick,
  trackPhoneClick,
  trackSocialLink,
  trackExitIntent,
  trackFormView,
  trackFormStarted,
  trackFormFieldFocused,
  trackFormFieldCompleted,
  trackFormFieldErrored,
  trackEngagementScore,
  trackProjectSectionViewed,
  trackProjectCompleted,
  trackFormAbandoned,
} from "./events";
import { SessionManager } from "./engagement";
import { SCROLL_MILESTONES, TIME_MILESTONES } from "./constants";
import type { FormFieldName } from "./types";

// ─── Scroll depth ─────────────────────────────────────────────────────────────

export function useScrollDepthTracking(): void {
  useEffect(() => {
    const startTime = Date.now();

    function onScroll() {
      const el = document.documentElement;
      const scrollable = el.scrollHeight - el.clientHeight;
      if (scrollable <= 0) return;

      const pct = Math.round((window.scrollY / scrollable) * 100);
      SessionManager.updateScrollMax(pct);

      for (const milestone of SCROLL_MILESTONES) {
        if (pct >= milestone) {
          trackScrollDepth(milestone, Date.now() - startTime);
        }
      }
    }

    // Passive for performance, throttled to ~200ms
    let ticking = false;
    const throttled = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          onScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", throttled, { passive: true });
    return () => window.removeEventListener("scroll", throttled);
  }, []);
}

// ─── Time milestones ──────────────────────────────────────────────────────────

export function useTimeMilestones(): void {
  useEffect(() => {
    const timers = TIME_MILESTONES.map((seconds) =>
      setTimeout(() => trackTimeOnPage(seconds), seconds * 1000)
    );
    return () => timers.forEach(clearTimeout);
  }, []);
}

// ─── Named section tracking ───────────────────────────────────────────────────

interface SectionEntry {
  id: string;
  index: number;
}

export function useSectionTracking(sections: SectionEntry[]): void {
  const dwellTimers = useRef<Map<string, number>>(new Map());
  const entryTimes = useRef<Map<string, number>>(new Map());

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = entry.target.id;
          const section = sections.find((s) => s.id === id);
          if (!section) continue;

          if (entry.isIntersecting) {
            entryTimes.current.set(id, Date.now());

            // Require 800ms dwell before firing (avoids rapid scroll-through)
            const timer = window.setTimeout(() => {
              const enterAt = entryTimes.current.get(id) || Date.now();
              const dwell = Date.now() - enterAt;
              trackSectionInView(id, section.index, dwell);
            }, 800);

            dwellTimers.current.set(id, timer);
          } else {
            const timer = dwellTimers.current.get(id);
            if (timer) {
              clearTimeout(timer);
              dwellTimers.current.delete(id);
            }
          }
        }
      },
      { threshold: 0.35 } // 35% visible triggers the event
    );

    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sections]);
}

// ─── Outbound link tracking (global delegation) ───────────────────────────────

export function useOutboundLinkTracking(): void {
  useEffect(() => {
    const currentDomain = window.location.hostname;

    function handleClick(e: MouseEvent) {
      const anchor = (e.target as Element).closest("a");
      if (!anchor) return;

      const href = anchor.href;
      if (!href) return;

      let url: URL;
      try {
        url = new URL(href);
      } catch {
        return;
      }

      // Email links
      if (href.startsWith("mailto:")) {
        const email = href.replace("mailto:", "").split("?")[0];
        const location =
          anchor.closest("[data-section]")?.getAttribute("data-section") ||
          "unknown";
        trackEmailClick(email, location);
        return;
      }

      // Phone links
      if (href.startsWith("tel:")) {
        const location =
          anchor.closest("[data-section]")?.getAttribute("data-section") ||
          "unknown";
        trackPhoneClick(location);
        return;
      }

      // Outbound (external) links
      if (url.hostname !== currentDomain && url.hostname !== "") {
        const label =
          anchor.textContent?.trim() ||
          anchor.getAttribute("aria-label") ||
          url.hostname;

        const linkType = anchor.querySelector("svg, img")
          ? "social_icon"
          : "text";

        const sectionEl = anchor.closest("[data-section]");
        const sectionName =
          sectionEl?.getAttribute("data-section") || "unknown";

        // Detect social platforms
        const host = url.hostname;
        if (host.includes("linkedin")) {
          trackSocialLink("linkedin", label, sectionName);
          return;
        }
        if (host.includes("github")) {
          trackSocialLink("github", label, sectionName);
          return;
        }
        if (host.includes("twitter") || host.includes("x.com")) {
          trackSocialLink("twitter", label, sectionName);
          return;
        }

        trackOutboundLink(href, label, linkType as "text" | "social_icon", sectionName);
      }
    }

    document.addEventListener("click", handleClick, { capture: true });
    return () =>
      document.removeEventListener("click", handleClick, { capture: true });
  }, []);
}

// ─── Exit intent ──────────────────────────────────────────────────────────────

export function useExitIntent(): void {
  const fired = useRef(false);

  useEffect(() => {
    function handleMouseLeave(e: MouseEvent) {
      if (e.clientY > 5) return; // only top-exit
      if (fired.current) return;
      fired.current = true;

      const el = document.documentElement;
      const scrollable = el.scrollHeight - el.clientHeight;
      const scrollPct =
        scrollable > 0 ? Math.round((window.scrollY / scrollable) * 100) : 100;

      trackExitIntent(
        scrollPct,
        SessionManager.getActiveTime(),
        SessionManager.isFormStarted(),
        SessionManager.getFormCompletionPct()
      );

      trackEngagementScore();
    }

    // Also fire engagement score on page hide (tab close, navigate away)
    function handleVisibilityHide() {
      if (document.visibilityState === "hidden") {
        trackEngagementScore();
      }
    }

    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("visibilitychange", handleVisibilityHide);

    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("visibilitychange", handleVisibilityHide);
    };
  }, []);
}

// ─── Form tracking (returns event handlers) ───────────────────────────────────

interface FormTrackingState {
  started: boolean;
  startedAt: number | null;
  fieldFocusedAt: number | null;
  lastFocusedField: FormFieldName | null;
  completedFields: Set<FormFieldName>;
}

interface FormTrackingHandlers {
  onFormView: () => void;
  onFieldFocus: (fieldName: FormFieldName, fieldIndex: number) => void;
  onFieldBlur: (
    fieldName: FormFieldName,
    fieldIndex: number,
    value: string,
    hasError: boolean,
    errorType?: "required" | "invalid_email" | "too_short" | "too_long"
  ) => void;
  onFormAbandoned: () => void;
}

export function useFormTracking(
  formId: string,
  totalFields: number
): FormTrackingHandlers {
  const state = useRef<FormTrackingState>({
    started: false,
    startedAt: null,
    fieldFocusedAt: null,
    lastFocusedField: null,
    completedFields: new Set(),
  });

  const onFormView = useCallback(() => {
    trackFormView(formId);
  }, [formId]);

  const onFieldFocus = useCallback(
    (fieldName: FormFieldName, fieldIndex: number) => {
      const now = Date.now();

      if (!state.current.started) {
        state.current.started = true;
        state.current.startedAt = now;
        SessionManager.setFormStarted();
        trackFormStarted(fieldName, formId);
      }

      state.current.fieldFocusedAt = now;
      state.current.lastFocusedField = fieldName;

      const completionPct = Math.round(
        (state.current.completedFields.size / totalFields) * 100
      );
      trackFormFieldFocused(fieldName, fieldIndex, completionPct, formId);
    },
    [formId, totalFields]
  );

  const onFieldBlur = useCallback(
    (
      fieldName: FormFieldName,
      fieldIndex: number,
      value: string,
      hasError: boolean,
      errorType?: "required" | "invalid_email" | "too_short" | "too_long"
    ) => {
      const now = Date.now();
      const timeOnField = state.current.fieldFocusedAt
        ? now - state.current.fieldFocusedAt
        : 0;

      if (hasError && errorType) {
        trackFormFieldErrored(fieldName, errorType, formId);
        return;
      }

      if (value.trim()) {
        state.current.completedFields.add(fieldName);
        const completionPct = Math.round(
          (state.current.completedFields.size / totalFields) * 100
        );
        SessionManager.setFormCompletionPct(completionPct);
        trackFormFieldCompleted(
          fieldName,
          fieldIndex,
          completionPct,
          timeOnField,
          formId
        );
      }
    },
    [formId, totalFields]
  );

  const onFormAbandoned = useCallback(() => {
    if (!state.current.started) return;

    const timeOnForm = state.current.startedAt
      ? Date.now() - state.current.startedAt
      : 0;

    const completionPct = Math.round(
      (state.current.completedFields.size / totalFields) * 100
    );

    // Only report abandonment if form wasn't successfully submitted
    if (completionPct < 100) {
      trackFormAbandoned(
        state.current.lastFocusedField,
        completionPct,
        state.current.completedFields.size,
        timeOnForm,
        formId
      );
    }
  }, [formId, totalFields]);

  // Fire abandoned on page unload
  useEffect(() => {
    const handler = () => onFormAbandoned();
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [onFormAbandoned]);

  return { onFormView, onFieldFocus, onFieldBlur, onFormAbandoned };
}

// ─── Project page section tracking ───────────────────────────────────────────

interface ProjectSection {
  id: string;
  name: string;
  index: number;
}

export function useProjectSectionTracking(
  projectSlug: string,
  sections: ProjectSection[]
): void {
  const viewedSections = useRef(new Set<string>());
  const enteredAt = useRef<number>(Date.now());
  const dwellTimers = useRef<Map<string, number>>(new Map());
  const ctaSeen = useRef(false);

  useEffect(() => {
    enteredAt.current = Date.now();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = entry.target.id;
          const section = sections.find((s) => s.id === id);
          if (!section) continue;

          if (entry.isIntersecting) {
            if (id.includes("cta")) ctaSeen.current = true;

            const timer = window.setTimeout(() => {
              if (!viewedSections.current.has(id)) {
                viewedSections.current.add(id);
                trackProjectSectionViewed(
                  projectSlug,
                  id,
                  section.name,
                  section.index,
                  800
                );
              }
            }, 800);

            dwellTimers.current.set(id, timer);
          } else {
            const t = dwellTimers.current.get(id);
            if (t) {
              clearTimeout(t);
              dwellTimers.current.delete(id);
            }
          }
        }
      },
      { threshold: 0.3 }
    );

    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      observer.disconnect();
      dwellTimers.current.forEach(clearTimeout);
    };
  }, [projectSlug, sections]);

  // Track project completion on unmount
  useEffect(() => {
    return () => {
      const timeMs = Date.now() - enteredAt.current;
      const el = document.documentElement;
      const scrollable = el.scrollHeight - el.clientHeight;
      const scrollPct =
        scrollable > 0 ? Math.round((window.scrollY / scrollable) * 100) : 0;

      if (scrollPct >= 90) {
        trackProjectCompleted(
          projectSlug,
          timeMs,
          viewedSections.current.size,
          ctaSeen.current
        );
      }
    };
  }, [projectSlug]);
}
