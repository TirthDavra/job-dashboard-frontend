export type RecruiterRecentActivityItem = {
  id: string;
  at: string;
  candidateName: string;
  jobTitle: string;
};

export type RecruiterDashboardResponse = {
  activeJobsCount: number;
  totalApplicants: number;
  recentActivity: RecruiterRecentActivityItem[];
};
