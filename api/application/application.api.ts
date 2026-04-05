import { api } from "@/services/api";
import type { AppliedJobIdsResponse, ApplyToJobResponse } from "./types";

export async function getMyAppliedJobIds(): Promise<AppliedJobIdsResponse> {
  const { data } = await api.get<AppliedJobIdsResponse>("/applications/me");
  return data;
}

export async function applyToJob(jobId: string): Promise<ApplyToJobResponse> {
  const { data } = await api.post<ApplyToJobResponse>("/applications", {
    jobId,
  });
  return data;
}
