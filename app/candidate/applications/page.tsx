import { CandidateApplicationsBoard } from "@/components/candidate-applications-board";
import { getMyApplicationsDetail } from "@/api/application/application.api";
import { getApiErrorMessage } from "@/lib/api-error";

export const dynamic = "force-dynamic";

export default async function CandidateApplicationsPage() {
  let applications: Awaited<
    ReturnType<typeof getMyApplicationsDetail>
  >["applications"] = [];
  let error: string | null = null;

  try {
    const res = await getMyApplicationsDetail();
    applications = res.applications;
  } catch (err) {
    error = getApiErrorMessage(
      err,
      "Could not load your applications. Try again later."
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          My applications
        </h1>
        <p className="text-sm text-muted-foreground">
          Status updates from recruiters appear here.
        </p>
      </div>
      <CandidateApplicationsBoard
        applications={applications}
        error={error}
      />
    </div>
  );
}
