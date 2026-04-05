import { RecruiterJobsDataTable } from "@/components/recruiter-jobs-data-table";
import { getRecruiterJobs } from "@/api/job/job.api";
import { getApiErrorMessage } from "@/lib/api-error";

export const dynamic = "force-dynamic";

function parsePositiveInt(value: string | undefined, fallback: number): number {
  const n = Number.parseInt(String(value ?? ""), 10);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

type PageProps = {
  searchParams: Promise<{ page?: string; limit?: string }>;
};

export default async function RecruiterJobsPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const page = parsePositiveInt(sp.page, 1);
  const limit = Math.min(
    100,
    Math.max(1, parsePositiveInt(sp.limit, 10))
  );

  let jobs: Awaited<ReturnType<typeof getRecruiterJobs>>["jobs"] = [];
  let total = 0;
  let totalPages = 0;
  let error: string | null = null;

  try {
    const data = await getRecruiterJobs({ page, limit });
    jobs = data.jobs;
    total = data.total;
    totalPages = data.totalPages;
  } catch (err) {
    error = getApiErrorMessage(err, "Could not load jobs. Try refreshing the page.");
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Manage jobs</h1>
        <p className="text-sm text-muted-foreground">
          Your published listings, newest first. Use Previous and Next to move
          between pages.
        </p>
      </div>
      <RecruiterJobsDataTable
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
