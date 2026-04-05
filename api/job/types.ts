export type JobDto = {
  _id: string;
  recruiterId: string;
  title: string;
  description: string;
  skills: string[];
  salaryMin?: number;
  salaryMax?: number;
  jobType: "full-time" | "part-time" | "contract";
  location: string;
  deadline?: string;
  isOpen: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type CreateJobResponse = {
  message: string;
  job: JobDto;
};

/** Paginated list from GET /jobs or GET /jobs/my */
export type JobsListResponse = {
  jobs: JobDto[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};
