import { RoleDashboardShell } from "@/components/role-dashboard-shell";

export default function RecruiterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RoleDashboardShell role="recruiter">{children}</RoleDashboardShell>;
}
