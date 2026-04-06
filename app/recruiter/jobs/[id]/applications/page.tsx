import Link from "next/link";
import { JobApplicationsTable } from "@/components/job-applications-table";
import { getJobApplications } from "@/api/application/application.api";
import { getApiErrorMessage } from "@/lib/api-error";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function RecruiterJobApplicationsPage({
  params,
}: PageProps) {
  const { id: jobId } = await params;

  let applications: Awaited<
    ReturnType<typeof getJobApplications>
  >["applications"] = [];
  let loadError: string | null = null;

  try {
    const data = await getJobApplications(jobId);
    applications = data.applications;
  } catch (err) {
    loadError = getApiErrorMessage(
      err,
      "Could not load applications. Check that this job belongs to you."
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            Applications
          </h1>
          <p className="text-sm text-muted-foreground">
            Review candidates who applied to this job.
          </p>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href="/recruiter/jobs">Back to jobs</Link>
        </Button>
      </div>

      <JobApplicationsTable applications={applications} error={loadError} />
    </div>
  );
}
