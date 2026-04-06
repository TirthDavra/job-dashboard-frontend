import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type {
  ApplicationStatus,
  CandidateApplicationItem,
} from "@/api/application/types";

function labelStatus(s: ApplicationStatus) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function formatJobType(t: string) {
  if (!t) return "";
  return t.replace(/-/g, " ");
}

function formatApplied(iso?: string) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

type Props = {
  applications: CandidateApplicationItem[];
  error: string | null;
};

export function CandidateApplicationsBoard({
  applications,
  error,
}: Props) {
  if (error) {
    return (
      <p className="rounded-lg border border-destructive/50 bg-destructive/5 px-4 py-3 text-sm text-destructive">
        {error}
      </p>
    );
  }

  if (applications.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        You have not applied to any jobs yet. Browse openings on the job
        listing page.
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-4">
      {applications.map((row) => (
        <li key={row._id}>
          <Card>
            <CardHeader className="pb-2">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <CardTitle className="text-base">
                    {row.job?.title ?? "Job no longer listed"}
                  </CardTitle>
                  <CardDescription>
                    {row.job
                      ? `${row.job.location} · ${formatJobType(row.job.jobType)}`
                      : "This job may have been removed."}
                  </CardDescription>
                </div>
                <span
                  className={
                    row.status === "rejected"
                      ? "text-sm font-medium text-destructive"
                      : row.status === "hired"
                        ? "text-sm font-medium text-emerald-600 dark:text-emerald-400"
                        : "text-sm font-medium"
                  }
                >
                  {labelStatus(row.status)}
                </span>
              </div>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground">
              <p>Applied {formatApplied(row.createdAt)}</p>
              {row.job && !row.job.isOpen ? (
                <p className="mt-1">This job is now closed.</p>
              ) : null}
            </CardContent>
          </Card>
        </li>
      ))}
    </ul>
  );
}
