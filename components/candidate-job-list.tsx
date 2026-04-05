import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { JobDto } from "@/api/job/types";
import { JobApplyButton } from "@/components/job-apply-button";

export type JobListFilters = {
  q: string;
  jobType: string;
  location: string;
};

function listHref(
  page: number,
  limit: number,
  filters: JobListFilters
) {
  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("limit", String(limit));
  if (filters.q.trim()) params.set("q", filters.q.trim());
  if (filters.jobType.trim()) params.set("jobType", filters.jobType.trim());
  if (filters.location.trim()) {
    params.set("location", filters.location.trim());
  }
  return `/candidate?${params.toString()}`;
}

function formatSalary(job: JobDto): string {
  const { salaryMin, salaryMax } = job;
  if (salaryMin == null && salaryMax == null) return "Salary not listed";
  if (salaryMin != null && salaryMax != null) {
    return `${salaryMin.toLocaleString()} - ${salaryMax.toLocaleString()}`;
  }
  if (salaryMin != null) return `From ${salaryMin.toLocaleString()}`;
  return `Up to ${salaryMax!.toLocaleString()}`;
}

function formatJobType(t: JobDto["jobType"]) {
  return t.replace(/-/g, " ");
}

type Props = {
  jobs: JobDto[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  error: string | null;
  filters: JobListFilters;
  appliedJobIds: string[];
};

export function CandidateJobList({
  jobs,
  page,
  limit,
  total,
  totalPages,
  error,
  filters,
  appliedJobIds,
}: Props) {
  const canPrev = page > 1;
  const canNext = totalPages > 0 && page < totalPages;

  const hasActiveFilters =
    filters.q.trim().length > 0 ||
    filters.jobType.trim().length > 0 ||
    filters.location.trim().length > 0;

  const appliedSet = new Set(appliedJobIds);

  if (error) {
    return (
      <p className="rounded-lg border border-destructive/50 bg-destructive/5 px-4 py-3 text-sm text-destructive">
        {error}
      </p>
    );
  }

  if (jobs.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        {hasActiveFilters
          ? "No open jobs match your search or filters. Try changing them."
          : "No open jobs right now. Check back later."}
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {jobs.map((job) => (
          <li key={job._id}>
            <Card className="h-full">
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="line-clamp-2">{job.title}</CardTitle>
                  {!job.isOpen ? (
                    <span className="shrink-0 rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                      Closed
                    </span>
                  ) : null}
                </div>
                <CardDescription>
                  {job.location} · {formatJobType(job.jobType)}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-muted-foreground">{formatSalary(job)}</p>
                <p className="line-clamp-3 text-sm">{job.description}</p>
                {job.skills.length > 0 ? (
                  <p className="text-xs text-muted-foreground">
                    {job.skills.slice(0, 6).join(", ")}
                    {job.skills.length > 6 ? "…" : ""}
                  </p>
                ) : null}
              </CardContent>
              <CardFooter className="flex flex-wrap items-center justify-between gap-2 border-t text-xs text-muted-foreground">
                <span>
                  {job.deadline
                    ? `Apply by ${new Date(job.deadline).toLocaleDateString()}`
                    : "No deadline"}
                </span>
                <JobApplyButton
                  jobId={job._id}
                  isOpen={job.isOpen}
                  alreadyApplied={appliedSet.has(job._id)}
                />
              </CardFooter>
            </Card>
          </li>
        ))}
      </ul>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          {total === 0
            ? "0 jobs"
            : `Showing ${(page - 1) * limit + 1}-${Math.min(page * limit, total)} of ${total}`}
        </p>
        <div className="flex items-center gap-2">
          {canPrev ? (
            <Button variant="outline" size="sm" asChild>
              <Link
                href={listHref(page - 1, limit, filters)}
                prefetch
              >
                <ChevronLeft className="size-4" />
                Previous
              </Link>
            </Button>
          ) : (
            <Button variant="outline" size="sm" disabled>
              <ChevronLeft className="size-4" />
              Previous
            </Button>
          )}
          <span className="text-sm text-muted-foreground tabular-nums">
            Page {totalPages === 0 ? 1 : page}
            {totalPages > 0 ? ` / ${totalPages}` : ""}
          </span>
          {canNext ? (
            <Button variant="outline" size="sm" asChild>
              <Link
                href={listHref(page + 1, limit, filters)}
                prefetch
              >
                Next
                <ChevronRight className="size-4" />
              </Link>
            </Button>
          ) : (
            <Button variant="outline" size="sm" disabled>
              Next
              <ChevronRight className="size-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
