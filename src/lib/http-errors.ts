import axios from "axios";
import type { ApiResponse } from "@/types/models";

export function isAxiosStatus(error: unknown, status: number): boolean {
  return axios.isAxiosError(error) && error.response?.status === status;
}

export function getApiErrorCode(error: unknown): number | null {
  if (!axios.isAxiosError(error)) return null;
  const data = error.response?.data as ApiResponse<unknown> | undefined;
  return typeof data?.code === "number" ? data.code : null;
}

/** Backend ErrorCode.JOIN_REQUEST_ALREADY_SENT = 4013 */
export function isJoinRequestAlreadySent(error: unknown): boolean {
  return getApiErrorCode(error) === 4013;
}

/** Backend ErrorCode.ALREADY_IN_GROUP = 4012 */
export function isAlreadyInGroup(error: unknown): boolean {
  return getApiErrorCode(error) === 4012;
}

/** Học sinh đã gửi yêu cầu tham gia (409 / code 4013). */
export function isJoinRequestConflict(error: unknown): boolean {
  if (isJoinRequestAlreadySent(error)) return true;
  return isAxiosStatus(error, 409);
}
