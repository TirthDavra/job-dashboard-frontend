import { CandidateJobList } from "@/components/candidate-job-list";
import { getJobs } from "@/api/job/job.api";
import { getApiErrorMessage } from "@/lib/api-error";

function parsePositiveInt(value: string | undefined, fallback: number) {
  const n = Number.parseInt(String(value ?? ""), 10);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

type PageProps = {
  searchParams: Promise<{ page?: string; limit?: string }>;
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

  let jobs: Awaited<ReturnType<typeof getJobs>>["jobs"] = [];
  let total = 0;
  let totalPages = 0;
  let error: string | null = null;

  try {
    const data = await getJobs({ page, limit });
    jobs = data.jobs;
    total = data.total;
    totalPages = data.totalPages;
  } catch (err) {
    error = getApiErrorMessage(
      err,
      "Could not load jobs. Try again in a moment."
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Jobs</h1>
        <p className="text-sm text-muted-foreground">
          Open roles from employers on the platform.
        </p>
      </div>
      <CandidateJobList
        jobs={jobs}
        page={page}
        limit={limit}
        total={total}
        totalPages={totalPages}
        error={error}
      />
    </div>
  );
}
