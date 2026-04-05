import { api } from "@/services/api";
import type { CreateJobPayload } from "./schemas";
import type { CreateJobResponse, JobsListResponse } from "./types";

export async function createJob(body: CreateJobPayload): Promise<CreateJobResponse> {
  const { data } = await api.post<CreateJobResponse>("/jobs/create-job", body);
  return data;
}

export async function getJobs(params: {
  page?: number;
  limit?: number;
}): Promise<JobsListResponse> {
  const { data } = await api.get<JobsListResponse>("/jobs", {
    params: {
      page: params.page ?? 1,
      limit: params.limit ?? 10,
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
