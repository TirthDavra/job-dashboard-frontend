export type AppliedJobIdsResponse = {
  jobIds: string[];
};

export type ApplyToJobResponse = {
  message: string;
};

export const APPLICATION_STATUSES = [
  "applied",
  "shortlisted",
  "interviewed",
  "rejected",
  "hired",
] as const;

export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

export type JobApplicationCandidate = {
  _id: string;
  name: string;
  email: string;
};

export type JobApplicationRow = {
  _id: string;
  jobId: string;
  status: ApplicationStatus;
  createdAt?: string;
  candidateId: JobApplicationCandidate | null;
};

export type JobApplicationsResponse = {
  applications: JobApplicationRow[];
};

export type UpdateApplicationStatusResponse = {
  message: string;
  application: JobApplicationRow;
};

export type CandidateApplicationJob = {
  _id: string;
  title: string;
  location: string;
  jobType: string;
  isOpen: boolean;
  deadline?: string;
};

export type CandidateApplicationItem = {
  _id: string;
  status: ApplicationStatus;
  createdAt?: string;
  job: CandidateApplicationJob | null;
};

export type MyApplicationsDetailResponse = {
  applications: CandidateApplicationItem[];
};
