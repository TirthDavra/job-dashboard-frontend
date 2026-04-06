import { RecruiterDashboardContent } from "@/components/recruiter-dashboard-content";
import { getRecruiterDashboard } from "@/api/recruiter/dashboard.api";
import { getApiErrorMessage } from "@/lib/api-error";

export const dynamic = "force-dynamic";

export default async function RecruiterDashboardPage() {
  let data = null;
  let error: string | null = null;

  try {
    data = await getRecruiterDashboard();
  } catch (err) {
    error = getApiErrorMessage(
      err,
      "Could not load dashboard. Try refreshing the page."
    );
  }

  return <RecruiterDashboardContent data={data} error={error} />;
}
