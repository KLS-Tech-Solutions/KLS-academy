import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ToastProvider } from "@/components/ui/toast";
import { QueryProvider } from "@/components/providers/query-provider";
import { AnalyticsProvider } from "@/components/shared/analytics-provider";
import { OrganizationSchema } from "@/components/shared/structured-data";
import { SITE } from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "KLS Academy — Free Verified Virtual Internships",
    template: "%s | KLS Academy",
  },
  description:
    "Free virtual internships with real project work, engineer-reviewed submissions and QR-verified certificates. Open source, built by KLS Tech Solutions, Bangalore.",
  applicationName: SITE.name,
  keywords: [
    "virtual internship",
    "free internship India",
    "online internship with certificate",
    "backend development internship",
    "verified internship certificate",
    "KLS Tech Solutions",
  ],
  authors: [{ name: "KLS Tech Solutions", url: SITE.company }],
  creator: "KLS Tech Solutions",
  publisher: "KLS Tech Solutions",
  // The canonical for each page is set on that page; this is the fallback.
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: SITE.name,
    url: SITE.url,
    locale: "en_IN",
    title: "KLS Academy — Free Verified Virtual Internships",
    description:
      "Real project work, reviewed by engineers, ending in a certificate any employer can verify. Free and open source.",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "KLS Academy" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "KLS Academy — Free Verified Virtual Internships",
    description:
      "Real project work, reviewed by engineers, ending in a certificate any employer can verify.",
    images: ["/og.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  category: "education",
};

export const viewport: Viewport = {
  themeColor: "#0b3a5e",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        {/* Sitewide. Per-page schema is emitted by the page itself. */}
        <OrganizationSchema />
      </head>
      <body className="antialiased">
        <QueryProvider>
          <ToastProvider>{children}</ToastProvider>
        </QueryProvider>
        <AnalyticsProvider />
      </body>
    </html>
  );
}
