import type { MetadataRoute } from "next";

import { SITE } from "@/lib/seo";

/**
 * Crawl rules.
 *
 * Everything public is open, including to AI crawlers — the point of the SEO
 * and AEO work is to be quotable, so blocking GPTBot or PerplexityBot would
 * work against it.
 *
 * What is disallowed is everything behind a login and every URL that carries a
 * single-use token. `/verify/<number>` stays crawlable: a certificate
 * verification page is public by design and being indexable is a feature.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/dashboard",
          "/api/",
          // These carry verification and password-reset tokens in the query
          // string. Indexed, they would be both useless and a leak.
          "/verify-email",
          "/reset-password",
          "/forgot-password",
          "/login",
          "/register",
        ],
      },
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
