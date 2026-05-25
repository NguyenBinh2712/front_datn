import { http } from '@/api/http'
import type { ApiResponse, ConversationResponse, Slice } from '@/types/models'

export async function fetchMyConversations(
  page: number,
  size: number,
): Promise<Slice<ConversationResponse>> {
  const { data } = await http.get<ApiResponse<Slice<ConversationResponse>>>(
    '/conversations/myConversation',
    { params: { page, size } },
  )
  if (!data.result) throw new Error('No conversations')
  return data.result
}

export async function createOrGetDm(targetUserId: number): Promise<ConversationResponse> {
  const { data } = await http.post<ApiResponse<ConversationResponse>>(
    `/conversations/one-to-one/${targetUserId}`,
  )
  if (!data.result) throw new Error('Cannot open chat')
  return data.result
}

export async function createGroupChat(payload: {
  name: string
  memberId: number[]
}): Promise<ConversationResponse> {
  const { data } = await http.post<ApiResponse<ConversationResponse>>(
    '/conversations/group',
    payload,
  )
  if (!data.result) throw new Error('Cannot create group')
  return data.result
}
