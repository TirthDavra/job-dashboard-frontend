import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { RecruiterDashboardResponse } from "@/api/recruiter/types";

function formatWhen(iso: string) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

type Props = {
  data: RecruiterDashboardResponse | null;
  error: string | null;
};

export function RecruiterDashboardContent({ data, error }: Props) {
  if (error) {
    return (
      <p className="rounded-lg border border-destructive/50 bg-destructive/5 px-4 py-3 text-sm text-destructive">
        {error}
      </p>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Snapshot of your open roles and who has applied.
          </p>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href="/recruiter/jobs">Manage jobs</Link>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Active jobs</CardDescription>
            <CardTitle className="text-3xl tabular-nums">
              {data.activeJobsCount}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Listings still marked as open.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total applicants</CardDescription>
            <CardTitle className="text-3xl tabular-nums">
              {data.totalApplicants}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Applications across all your jobs.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-3">
        <h2 className="text-lg font-medium">Recent activity</h2>
        <p className="text-sm text-muted-foreground">
          Latest applications to your postings.
        </p>
        <Card>
          <CardContent className="px-0 pt-4">
            {data.recentActivity.length === 0 ? (
              <p className="px-4 pb-4 text-sm text-muted-foreground">
                No applications yet. When candidates apply, they will show up
                here.
              </p>
            ) : (
              <ul className="divide-y">
                {data.recentActivity.map((row) => (
                  <li
                    key={row.id}
                    className="flex flex-col gap-0.5 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="text-sm font-medium">{row.candidateName}</p>
                      <p className="text-sm text-muted-foreground">
                        Applied to{" "}
                        <span className="text-foreground">{row.jobTitle}</span>
                      </p>
                    </div>
                    <p className="shrink-0 text-xs text-muted-foreground">
                      {formatWhen(row.at)}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      <Separator />
      <p className="text-center text-xs text-muted-foreground">
        <Link href="/recruiter/new" className="underline underline-offset-4">
          Post a new job
        </Link>
      </p>
    </div>
  );
}
