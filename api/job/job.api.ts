import { api } from "@/services/api";
import type { CreateJobPayload } from "./schemas";
import type {
  CreateJobResponse,
  JobsListResponse,
  JobActionResponse,
} from "./types";

export async function createJob(body: CreateJobPayload): Promise<CreateJobResponse> {
  const { data } = await api.post<CreateJobResponse>("/jobs/create-job", body);
  return data;
}

export async function getJobs(params: {
  page?: number;
  limit?: number;
  q?: string;
  jobType?: string;
  location?: string;
}): Promise<JobsListResponse> {
  const { data } = await api.get<JobsListResponse>("/jobs", {
    params: {
      page: params.page ?? 1,
      limit: params.limit ?? 10,
      ...(params.q?.trim() ? { q: params.q.trim() } : {}),
      ...(params.jobType?.trim() ? { jobType: params.jobType.trim() } : {}),
      ...(params.location?.trim()
        ? { location: params.location.trim() }
        : {}),
    },
  });
  return data;
}

export async function getRecruiterJobs(params: {
  page?: number;
  limit?: number;
}): Promise<JobsListResponse> {
  const { data } = await api.get<JobsListResponse>("/jobs/my", {
    params: {
      page: params.page ?? 1,
      limit: params.limit ?? 10,
    },
  });
  return data;
}

export async function closeJob(jobId: string): Promise<JobActionResponse> {
  const { data } = await api.patch<JobActionResponse>(`/jobs/${jobId}/close`);
  return data;
}

export async function deleteJob(jobId: string): Promise<JobActionResponse> {
  const { data } = await api.delete<JobActionResponse>(`/jobs/${jobId}`);
  return data;
}
