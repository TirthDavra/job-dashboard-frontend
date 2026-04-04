"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import {
  Briefcase,
  FileText,
  LayoutDashboard,
  ListChecks,
  LogOut,
  Plus,
  UserRound,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { RolePanel } from "@/components/role-panel";
import { useAuthStore, type UserRole } from "@/store/auth.store";

type NavItem = { href: string; label: string; icon: LucideIcon };

const RECRUITER_NAV: NavItem[] = [
  { href: "/recruiter", label: "Dashboard", icon: LayoutDashboard },
  { href: "/recruiter/jobs", label: "Manage jobs", icon: Briefcase },
  { href: "/recruiter/new", label: "Add job", icon: Plus },
  {
    href: "/recruiter/jobs/sample/applications",
    label: "Job applications",
    icon: FileText,
  },
];

const CANDIDATE_NAV: NavItem[] = [
  { href: "/candidate", label: "Job listing", icon: Briefcase },
  { href: "/candidate/applications", label: "Applied jobs", icon: ListChecks },
  { href: "/candidate/profile", label: "Profile", icon: UserRound },
];

const ADMIN_NAV: NavItem[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
];

const NAV_BY_ROLE: Record<UserRole, NavItem[]> = {
  recruiter: RECRUITER_NAV,
  candidate: CANDIDATE_NAV,
  admin: ADMIN_NAV,
};

const ROLE_LABEL: Record<UserRole, string> = {
  recruiter: "Recruiter",
  candidate: "Candidate",
  admin: "Admin",
};

function navItemActive(pathname: string, href: string) {
  const exactOnly = [
    "/recruiter",
    "/candidate",
    "/admin",
    "/recruiter/jobs",
    "/recruiter/new",
    "/candidate/applications",
    "/candidate/profile",
  ];
  if (exactOnly.includes(href)) {
    return pathname === href;
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function RoleDashboardShell({
  role,
  children,
}: {
  role: UserRole;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user);
  const items = NAV_BY_ROLE[role];

  function handleLogout() {
    logout();
    router.replace("/login");
  }

  return (
    <RolePanel role={role}>
      <SidebarProvider>
        <Sidebar collapsible="icon">
          <SidebarHeader className="border-b border-sidebar-border">
            <div className="flex flex-col gap-0.5 px-2 py-1 group-data-[collapsible=icon]:hidden">
              <span className="text-sm font-semibold">
                {ROLE_LABEL[role]}
              </span>
              <span className="truncate text-xs text-sidebar-foreground/70">
                {user?.email ?? ""}
              </span>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Menu</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {items.map((item) => (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        asChild
                        tooltip={item.label}
                        isActive={navItemActive(pathname, item.href)}
                      >
                        <Link href={item.href}>
                          <item.icon />
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarSeparator />
          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={handleLogout} tooltip="Log out">
                  <LogOut />
                  <span>Log out</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
          <SidebarRail />
        </Sidebar>
        <SidebarInset>
          <header className="flex h-12 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </RolePanel>
  );
}
