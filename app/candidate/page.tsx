import { CandidateJobList } from "@/components/candidate-job-list";
import { CandidateJobFilters } from "@/components/candidate-job-filters";
import { getJobs } from "@/api/job/job.api";
import { getMyAppliedJobIds } from "@/api/application/application.api";
import { getApiErrorMessage } from "@/lib/api-error";

export const dynamic = "force-dynamic";

function param(v: string | string[] | undefined): string {
  if (v == null) return "";
  const s = Array.isArray(v) ? v[0] : v;
  return typeof s === "string" ? s : "";
}

function parsePositiveInt(
  value: string | string[] | undefined,
  fallback: number
) {
  const raw = param(value);
  const n = Number.parseInt(raw, 10);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

type PageProps = {
  searchParams: Promise<{
    page?: string | string[];
    limit?: string | string[];
    q?: string | string[];
    jobType?: string | string[];
    location?: string | string[];
  }>;
};

export default async function CandidateJobListingPage({
  searchParams,
}: PageProps) {
  const sp = await searchParams;
  const page = parsePositiveInt(sp.page, 1);
  const limit = Math.min(
    100,
    Math.max(1, parsePositiveInt(sp.limit, 12))
  );

  const filters = {
    q: param(sp.q),
    jobType: param(sp.jobType),
    location: param(sp.location),
  };

  let jobs: Awaited<ReturnType<typeof getJobs>>["jobs"] = [];
  let total = 0;
  let totalPages = 0;
  let error: string | null = null;
  let appliedJobIds: string[] = [];

  try {
    const data = await getJobs({
      page,
      limit,
      q: filters.q,
      jobType: filters.jobType,
      location: filters.location,
    });
    jobs = data.jobs;
    total = data.total;
    totalPages = data.totalPages;
  } catch (err) {
    error = getApiErrorMessage(
      err,
      "Could not load jobs. Try again in a moment."
    );
  }

  try {
    const applied = await getMyAppliedJobIds();
    appliedJobIds = applied.jobIds;
  } catch {
    appliedJobIds = [];
  }

  const filtersKey = [
    String(page),
    String(limit),
    filters.q,
    filters.jobType,
    filters.location,
  ].join("\u001f");

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Jobs</h1>
        <p className="text-sm text-muted-foreground">
          Open roles only. Search by keywords, narrow by job type and location.
        </p>
      </div>

      <CandidateJobFilters
        key={filtersKey}
        limit={limit}
        defaultQ={filters.q}
        defaultJobType={filters.jobType}
        defaultLocation={filters.location}
      />

      <CandidateJobList
        jobs={jobs}
        page={page}
        limit={limit}
        total={total}
        totalPages={totalPages}
        error={error}
        filters={filters}
        appliedJobIds={appliedJobIds}
      />
    </div>
  );
}
