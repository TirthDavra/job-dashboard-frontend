import { api } from "@/services/api";
import type { LoginInput, RegisterInput, LoginResponse, RegisterResponse } from "./types";

export async function login(body: LoginInput): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>("/auth/login", body);
  return data;
}

export async function register(body: RegisterInput): Promise<RegisterResponse> {
  const { data } = await api.post<RegisterResponse>("/auth/register", body);
  return data;
}


export async function test() {
  const response = await api.get("http://localhost:5000/health");
  return response.data
}