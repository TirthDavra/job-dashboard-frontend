export type CandidateProfileUser = {
  _id: string;
  name: string;
  email: string;
  role: string;
  skills?: string[];
  experience?: number;
  updatedAt?: string;
};

export type GetProfileResponse = {
  user: CandidateProfileUser;
};

export type UpdateProfileResponse = {
  message: string;
  user: CandidateProfileUser;
};
