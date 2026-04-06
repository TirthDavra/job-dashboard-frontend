import { api } from "@/services/api";
import type {
  AppliedJobIdsResponse,
  ApplyToJobResponse,
  ApplicationStatus,
  JobApplicationsResponse,
  MyApplicationsDetailResponse,
  UpdateApplicationStatusResponse,
} from "./types";

export async function getMyAppliedJobIds(): Promise<AppliedJobIdsResponse> {
  const { data } = await api.get<AppliedJobIdsResponse>("/applications/me");
  return data;
}

export async function getMyApplicationsDetail(): Promise<MyApplicationsDetailResponse> {
  const { data } = await api.get<MyApplicationsDetailResponse>(
    "/applications/me/detail"
  );
  return data;
}

export async function applyToJob(jobId: string): Promise<ApplyToJobResponse> {
  const { data } = await api.post<ApplyToJobResponse>("/applications", {
    jobId,
  });
  return data;
}

export async function getJobApplications(
  jobId: string
): Promise<JobApplicationsResponse> {
  const { data } = await api.get<JobApplicationsResponse>(
    `/jobs/${jobId}/applications`
  );
  return data;
}

export async function updateApplicationStatus(
  applicationId: string,
  status: ApplicationStatus
): Promise<UpdateApplicationStatusResponse> {
  const { data } = await api.patch<UpdateApplicationStatusResponse>(
    `/applications/${applicationId}/status`,
    { status }
  );
  return data;
}
