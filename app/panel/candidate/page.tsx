import Link from "next/link";
import { RolePanel } from "@/components/role-panel";
import { Button } from "@/components/ui/button";

export default function CandidatePanelPage() {
  return (
    <RolePanel role="candidate">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b pb-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Candidate</h1>
          <p className="text-sm text-muted-foreground">
            Your job search and applications live here.
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/">Back to home</Link>
        </Button>
      </header>
      <p className="text-sm text-muted-foreground">
        This is the candidate workspace. Hook up listings and applications next.
      </p>
    </RolePanel>
  );
}
