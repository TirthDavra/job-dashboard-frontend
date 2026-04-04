import Link from "next/link";
import { RolePanel } from "@/components/role-panel";
import { Button } from "@/components/ui/button";

export default function AdminPanelPage() {
  return (
    <RolePanel role="admin">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b pb-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Admin</h1>
          <p className="text-sm text-muted-foreground">
            Platform administration and oversight.
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/">Back to home</Link>
        </Button>
      </header>
      <p className="text-sm text-muted-foreground">
        This is the admin workspace. Connect user management and settings here.
      </p>
    </RolePanel>
  );
}
