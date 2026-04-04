import { RoleDashboardShell } from "@/components/role-dashboard-shell";

export default function CandidateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RoleDashboardShell role="candidate">{children}</RoleDashboardShell>;
}
