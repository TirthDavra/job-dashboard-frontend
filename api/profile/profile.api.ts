import { api } from "@/services/api";
import type { GetProfileResponse, UpdateProfileResponse } from "./types";

export async function getMyProfile(): Promise<GetProfileResponse> {
  const { data } = await api.get<GetProfileResponse>("/profile/me");
  return data;
}

export async function updateMyProfile(body: {
  skills: string[];
  experience: number;
}): Promise<UpdateProfileResponse> {
  const { data } = await api.put<UpdateProfileResponse>("/profile/me", body);
  return data;
}
