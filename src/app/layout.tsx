import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ToastProvider } from "@/components/ui/toast";
import { QueryProvider } from "@/components/providers/query-provider";

export const metadata: Metadata = {
  metadataBase: new URL("https://academy.klstechsolutions.in"),
  title: {
    default: "KLS Academy — Verified Virtual Internships",
    template: "%s | KLS Academy",
  },
  description:
    "Structured virtual internships with real project work, admin-reviewed submissions and QR-verified certificates. Built by KLS Tech Solutions.",
  openGraph: {
    type: "website",
    siteName: "KLS Academy",
    url: "https://academy.klstechsolutions.in",
  },
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
      </head>
      <body className="antialiased">
        <QueryProvider>
          <ToastProvider>{children}</ToastProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
