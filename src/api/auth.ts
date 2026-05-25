import { http } from '@/api/http'
import type { ApiResponse, AuthResponse } from '@/types/models'

export type LoginBody = { email: string; password: string }

export async function login(body: LoginBody): Promise<string> {
  const { data } = await http.post<ApiResponse<AuthResponse>>('/auth/login', body, {
    skipAuth: true,
    skipRefresh: true,
  })
  const token = data.result?.token
  if (!token) throw new Error('Không nhận được token')
  return token
}

export async function logout(token: string): Promise<void> {
  await http.post('/auth/logout', { token })
}
