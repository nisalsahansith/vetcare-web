import api from "./axios";
import type { LoginRequest, LoginResponse, RegisterRequest } from "../types/Auth";

export const login = async (
  request: LoginRequest
): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>(
    "/auth/login",
    request
  );

  return response.data;
};

export const register = async (
  request: RegisterRequest
): Promise<void> => {
  await api.post(
    "/users/register",
    request
  );
};