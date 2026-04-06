import { api } from "@/services/api";
import type { RecruiterDashboardResponse } from "./types";

export async function getRecruiterDashboard(): Promise<RecruiterDashboardResponse> {
  const { data } = await api.get<RecruiterDashboardResponse>(
    "/recruiter/dashboard"
  );
  return data;
}
