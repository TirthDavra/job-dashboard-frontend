import Link from "next/link";
import { RolePanel } from "@/components/role-panel";
import { Button } from "@/components/ui/button";

export default function RecruiterPanelPage() {
  return (
    <RolePanel role="recruiter">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b pb-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Recruiter</h1>
          <p className="text-sm text-muted-foreground">
            Post roles and review applicants from here.
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/">Back to home</Link>
        </Button>
      </header>
      <p className="text-sm text-muted-foreground">
        This is the recruiter workspace. Add job posts and pipelines when you are
        ready.
      </p>
    </RolePanel>
  );
}
