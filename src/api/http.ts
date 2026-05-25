import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { toast } from "sonner";
import { apiUrl } from "@/config/env";
import { useAuthStore } from "@/stores/auth-store";
import type { ApiResponse, AuthResponse } from "@/types/models";

declare module "axios" {
  export interface AxiosRequestConfig {
    /** Không gắn Bearer */
    skipAuth?: boolean;
    /** Không thử refresh khi 401 */
    skipRefresh?: boolean;
  }
}

const refreshClient = axios.create({
  baseURL: apiUrl,
  headers: { "Content-Type": "application/json" },
});

export const http = axios.create({
  baseURL: apiUrl,
  headers: { "Content-Type": "application/json" },
});

let refreshPromise: Promise<string | null> | null = null;

async function runRefresh(): Promise<string | null> {
  const token = useAuthStore.getState().token;
  if (!token) return null;
  const { data } = await refreshClient.post<ApiResponse<AuthResponse>>(
    "/auth/refresh",
    {
      token,
    },
  );
  const next = data.result?.token ?? null;
  if (next) useAuthStore.getState().setToken(next);
  return next;
}
// gan bearer token
http.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (!config.skipAuth && token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// refresh token
http.interceptors.response.use(
  (res) => res,
  async (error: AxiosError<ApiResponse<unknown>>) => {
    const original = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };
    const status = error.response?.status;
    const backendMsg = error.response?.data?.message;

    const shouldTryRefresh =
      status === 401 &&
      original &&
      !original.skipRefresh &&
      !original._retry &&
      original.url &&
      !original.url.includes("/auth/refresh") &&
      !original.url.includes("/auth/login");

    if (shouldTryRefresh) {
      original._retry = true;
      try {
        if (!refreshPromise) {
          refreshPromise = runRefresh().finally(() => {
            refreshPromise = null;
          });
        }
        const newTok = await refreshPromise;
        if (newTok) {
          original.headers.Authorization = `Bearer ${newTok}`;
          return http(original);
        }
      } catch {
        /* logout below */
      }
      useAuthStore.getState().clear();
      toast.error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
      window.dispatchEvent(new CustomEvent("datn:session-expired"));
    } else if (status && status >= 400) {
      toast.error(
        typeof backendMsg === "string" && backendMsg
          ? backendMsg
          : "Đã có lỗi xảy ra",
      );
    }

    return Promise.reject(error);
  },
);
