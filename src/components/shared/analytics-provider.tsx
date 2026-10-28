"use client";

import * as React from "react";
import { usePathname } from "next/navigation";

import { initAnalytics, trackPageView } from "@/lib/analytics";

/**
 * Boots Mixpanel once and reports a page view on every route change.
 *
 * Next's client-side router does not reload the page, so nothing fires
 * automatically — `usePathname` is what tells us a navigation happened.
 *
 * Renders nothing, and does nothing at all when no token is configured.
 */
export function AnalyticsProvider() {
  const pathname = usePathname();
  const started = React.useRef(false);

  React.useEffect(() => {
    let cancelled = false;

    initAnalytics().then(() => {
      if (cancelled) return;
      started.current = true;
      trackPageView(pathname);
    });

    return () => {
      cancelled = true;
    };
    // Deliberately once: initialisation is not a per-navigation concern.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    // The first view is reported by the effect above, once the SDK is up.
    // Skipping it here avoids a duplicate on the landing page.
    if (!started.current) return;
    trackPageView(pathname);
  }, [pathname]);

  return null;
}
