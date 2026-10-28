import { DashboardProviders } from "@/components/providers/dashboard-providers";

export const metadata = { title: "Dashboard" };

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <DashboardProviders>{children}</DashboardProviders>;
}
