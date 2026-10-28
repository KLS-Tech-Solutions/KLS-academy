import type { MetadataRoute } from "next";

import { SITE } from "@/lib/seo";
import { listDomainsOnServer } from "@/services/catalogue.server";

/**
 * The sitemap, with one entry per published domain.
 *
 * Domain pages are fetched at build time rather than hardcoded — a new
 * internship added in the admin console appears here on the next deploy
 * without anyone remembering to edit a list.
 *
 * Only public pages. The dashboard, the auth screens and anything behind a
 * login are excluded: they are not indexable and listing them only tells a
 * crawler where to knock.
 */
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE.url, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE.url}/internships`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE.url}/verify`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE.url}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE.url}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE.url}/legal/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE.url}/legal/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE.url}/legal/refund`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

  // A sitemap that fails the build because the API was briefly unreachable is
  // worse than one missing its domain pages for an hour.
  let domainPages: MetadataRoute.Sitemap = [];
  try {
    const domains = await listDomainsOnServer();
    domainPages = domains.map((domain) => ({
      url: `${SITE.url}/internships/${domain.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));
  } catch {
    domainPages = [];
  }

  return [...staticPages, ...domainPages];
}
