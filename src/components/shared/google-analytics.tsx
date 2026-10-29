import Script from "next/script";

/**
 * Google Analytics 4.
 *
 * Loaded through `next/script` rather than a raw `<script>` tag. In the App
 * Router a bare script in `<head>` is not reliably executed or deduplicated
 * across navigations; `next/script` owns the loading order and guarantees it
 * runs once.
 *
 * `afterInteractive` is Google's own recommendation and the right trade-off
 * here: the tag does not block first paint, which matters on the landing page
 * we are trying to rank, but it still loads early enough to record the visit.
 *
 * **SPA navigations are covered without extra code.** GA4's enhanced
 * measurement listens to History API changes by default, so client-side route
 * changes register as page views. If that setting is ever switched off in the
 * GA property, this component would need a `useEffect` on the pathname to send
 * `page_view` manually.
 */

// Overridable per environment, with the real property as the default so a
// missing variable cannot silently disable analytics on production — a failure
// mode that stays invisible until someone asks why there is no data.
const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? "G-ERTDZZ6ERT";

export function GoogleAnalytics() {
  // Never in development. Local page loads would otherwise pollute the same
  // property the real traffic reports into, and "why did sessions spike on a
  // Tuesday" turns out to be someone running `npm run dev`.
  if (process.env.NODE_ENV !== "production" || !GA_ID) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}');
        `}
      </Script>
    </>
  );
}
