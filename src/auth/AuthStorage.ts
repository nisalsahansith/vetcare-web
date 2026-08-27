import type { LoginResponse } from "../types/Auth";

const AUTH_KEY = "vetcare_auth";

export const saveAuth = (auth: LoginResponse): void => {
  localStorage.setItem(AUTH_KEY, JSON.stringify(auth));
};

export const getAuth = (): LoginResponse | null => {
  const storedAuth = localStorage.getItem(AUTH_KEY);

  if (!storedAuth) {
    return null;
  }

  try {
    return JSON.parse(storedAuth) as LoginResponse;
  } catch {
    localStorage.removeItem(AUTH_KEY);
    return null;
  }
};

export const getAccessToken = (): string | null => {
  const auth = getAuth();

  return auth?.accessToken ?? null;
};

export const clearAuth = (): void => {
  localStorage.removeItem(AUTH_KEY);
};