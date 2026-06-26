import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import type { ApiError } from "../types";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/" || " http://0.0.0.0:8000⁠";

export const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

let accessToken: string | null = sessionStorage.getItem("access");
let refreshToken: string | null = sessionStorage.getItem("refresh");
let refreshPromise: Promise<string | null> | null = null;

export function getAccessToken() {
  return accessToken;
}

export function setTokens(access: string, refresh: string) {
  accessToken = access;
  refreshToken = refresh;
  sessionStorage.setItem("access", access);
  sessionStorage.setItem("refresh", refresh);
}

export function clearTokens() {
  accessToken = null;
  refreshToken = null;
  sessionStorage.removeItem("access");
  sessionStorage.removeItem("refresh");
}

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (accessToken && config.headers) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

async function refreshAccessToken(): Promise<string | null> {
  if (!refreshToken) return null;
  try {
    const { data } = await axios.post(`${API_URL}/api/auth/token/refresh/`, {
      refresh: refreshToken,
    });
    accessToken = data.access;
    sessionStorage.setItem("access", data.access);
    if (data.refresh) {
      refreshToken = data.refresh;
      sessionStorage.setItem("refresh", data.refresh);
    }
    return accessToken;
  } catch {
    clearTokens();
    return null;
  }
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiError>) => {
    const original = error.config;
    if (
      error.response?.status === 401 &&
      original &&
      !original.url?.includes("/token/refresh/") &&
      !original.url?.includes("/login/")
    ) {
      if (!refreshPromise) {
        refreshPromise = refreshAccessToken().finally(() => {
          refreshPromise = null;
        });
      }
      const newToken = await refreshPromise;
      if (newToken && original.headers) {
        original.headers.Authorization = `Bearer ${newToken}`;
        return api(original);
      }
      clearTokens();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError<ApiError>(error)) {
    const detail = error.response?.data?.detail;
    if (typeof detail === "string") return detail;
    if (typeof detail === "object" && detail !== null) {
      return Object.values(detail).flat().join(", ");
    }
    return error.message;
  }
  return "An unexpected error occurred.";
}
