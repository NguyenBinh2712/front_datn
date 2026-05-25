import { http } from '@/api/http'
import type { ApiResponse, FriendResponse, RecommendUser } from '@/types/models'

export async function sendFriendRequest(targetUserId: number): Promise<void> {
  await http.post('/friend/request', { targetUserId })
}

export async function cancelFriendRequest(friendshipId: number): Promise<void> {
  await http.post(`/friend/cancel/${friendshipId}`)
}

export async function acceptFriendRequest(friendshipId: number): Promise<void> {
  await http.post(`/friend/accept/${friendshipId}`)
}

export async function rejectFriendRequest(friendshipId: number): Promise<void> {
  await http.post(`/friend/reject/${friendshipId}`)
}

export async function unfriend(targetUserId: number): Promise<void> {
  await http.post('/friend/unfriend', { targetUserId })
}

export async function listFriends(): Promise<FriendResponse[]> {
  const { data } = await http.get<ApiResponse<FriendResponse[]>>('/friend/list')
  return data.result ?? []
}

export async function receivedRequests(): Promise<FriendResponse[]> {
  const { data } = await http.get<ApiResponse<FriendResponse[]>>('/friend/received')
  return data.result ?? []
}

export async function sentRequests(): Promise<FriendResponse[]> {
  const { data } = await http.get<ApiResponse<FriendResponse[]>>('/friend/sent')
  return data.result ?? []
}

export async function recommendFriends(limit = 10): Promise<RecommendUser[]> {
  const { data } = await http.get<ApiResponse<RecommendUser[]>>('/friend/recommend', {
    params: { limit },
  })
  return data.result ?? []
}
