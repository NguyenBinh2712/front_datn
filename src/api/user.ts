import { http } from "@/api/http";

import type {
  ApiResponse,
  ChangePasswordRequest,
  ForgotPasswordRequest,
  OtpRequest,
  ProfileRequest,
  ResendOtpRequest,
  UserCreateRequest,
  UserResponse,
} from "@/types/models";

export async function registerUser(
  body: UserCreateRequest,
): Promise<UserResponse> {
  const { data } = await http.post<ApiResponse<UserResponse>>(
    "/user/register",
    body,
    {
      skipAuth: true,
      skipRefresh: true,
    },
  );

  if (!data.result) {
    throw new Error("Đăng ký thất bại");
  }

  return data.result;
}

export async function verifyOtp(body: OtpRequest): Promise<void> {
  await http.post("/user/register/verify", body, {
    skipAuth: true,
    skipRefresh: true,
  });
}

export async function resendOtp(body: ResendOtpRequest): Promise<void> {
  await http.post("/user/register/resend-otp", body, {
    skipAuth: true,
    skipRefresh: true,
  });
}

export async function requestForgotPasswordOtp(email: string): Promise<void> {
  await http.post("/user/forgot-password/request-otp", null, {
    params: { email },
    skipAuth: true,
    skipRefresh: true,
  });
}

export async function forgotPassword(
  body: ForgotPasswordRequest,
): Promise<void> {
  await http.put("/user/forgot-password", body, {
    skipAuth: true,
    skipRefresh: true,
  });
}

export async function getMe(): Promise<UserResponse> {
  const { data } = await http.get<ApiResponse<UserResponse>>("/user/me");

  if (!data.result) {
    throw new Error("Không lấy được thông tin người dùng");
  }

  return data.result;
}

export async function updateProfile(body: ProfileRequest): Promise<void> {
  await http.put("/user/me/profile", body);
}

export async function uploadAvatar(file: File): Promise<void> {
  const formData = new FormData();

  formData.append("file", file);

  await http.put("/user/me/avatar", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

export async function changePassword(
  body: ChangePasswordRequest,
): Promise<void> {
  await http.put("/user/me/change-password", body);
}

export async function getUserById(id: number): Promise<UserResponse> {
  const { data } = await http.get<ApiResponse<UserResponse>>(`/user/${id}`);

  if (!data.result) {
    throw new Error("Không tìm thấy người dùng");
  }

  return data.result;
}

/** GET /user?page=&size= — backend trả về List<UserResponse> (không phải Page) */
export async function getAllUsers(
  page = 0,
  size = 20,
): Promise<{
  content: UserResponse[];
  page: number;
  size: number;
  hasMore: boolean;
}> {
  const { data } = await http.get<ApiResponse<UserResponse[]>>("/user", {
    params: { page, size },
  });

  const content = data.result ?? [];

  return {
    content,
    page,
    size,
    hasMore: content.length >= size,
  };
}

export async function deleteUser(id: number): Promise<void> {
  await http.delete(`/user/${id}`);
}
