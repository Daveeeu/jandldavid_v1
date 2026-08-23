/**
 * ScrollManager — production-quality scroll restoration for the SPA.
 *
 * Behavior:
 *  - PUSH / REPLACE navigation → scroll to top, move keyboard focus to first heading
 *  - POP navigation (back / forward) → restore the saved scroll position for that path
 *  - Continuously persists the current path's scroll position in sessionStorage
 *    so back-navigation always lands at the right spot, even after a hard refresh
 *    of the referencing page
 *
 * Must be rendered inside <BrowserRouter> (requires useLocation + useNavigationType).
 */

import { useEffect, useRef } from "react";
import { useLocation, useNavigationType } from "react-router";
import { saveScrollPosition, getScrollPosition } from "../utils/scrollRestoration";

export function ScrollManager() {
  const { pathname } = useLocation();
  const navType = useNavigationType();
  // Skip the very first render so we never forcibly scroll on initial page load
  const firstRender = useRef(true);

  // Tell the browser to leave scroll restoration to us
  useEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
  }, []);

  // Persist scroll position for the active path (passive, RAF-throttled)
  useEffect(() => {
    let rafId: number;
    const save = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => saveScrollPosition(pathname));
    };
    window.addEventListener("scroll", save, { passive: true });
    return () => {
      window.removeEventListener("scroll", save);
      cancelAnimationFrame(rafId);
    };
  }, [pathname]);

  // Handle scroll on route change
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    if (navType === "POP") {
      // Back / Forward — restore saved position instantly (no animation so it
      // doesn't fight with any content that's still mounting)
      const y = getScrollPosition(pathname);
      window.scrollTo({ top: y, behavior: "instant" as ScrollBehavior });
    } else {
      // New page (PUSH / REPLACE) — always start at the top
      window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });

      // Accessibility: move keyboard focus to the first h1 or the <main> element
      // so screen reader / keyboard users are immediately in context
      requestAnimationFrame(() => {
        const target =
          document.querySelector<HTMLElement>("h1") ??
          document.querySelector<HTMLElement>("main");
        if (!target) return;
        if (!target.getAttribute("tabindex")) {
          target.setAttribute("tabindex", "-1");
        }
        target.focus({ preventScroll: true });
      });
    }
    // navType is intentionally excluded from deps — it changes in sync with
    // pathname on every navigation, and we read it synchronously in the closure.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return null;
}
