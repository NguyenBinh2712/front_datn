import { http } from '@/api/http'
import type {
  ApiResponse,
  MessageResponse,
  ReactionType,
  Slice,
} from '@/types/models'

export async function fetchMessages(
  convId: number,
  page: number,
  size: number,
): Promise<Slice<MessageResponse>> {
  const { data } = await http.get<ApiResponse<Slice<MessageResponse>>>(
    `/chat/messages/${convId}`,
    { params: { page, size } },
  )
  if (!data.result) throw new Error('No messages')
  return data.result
}

export async function sendMessageMultipart(
  request: { conversationId: number; content?: string; targetUserId?: number },
  files?: File[],
): Promise<MessageResponse> {
  const fd = new FormData()
  fd.append(
    'request',
    new Blob([JSON.stringify(request)], { type: 'application/json' }),
  )
  files?.forEach((f) => fd.append('files', f))
  const { data } = await http.post<ApiResponse<MessageResponse>>('/chat/messages', fd, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  if (!data.result) throw new Error('Send failed')
  return data.result
}

export async function markSeenRest(convId: number): Promise<void> {
  await http.put(`/chat/messages/${convId}/seen`)
}

export async function typingRest(convId: number): Promise<void> {
  await http.post(`/chat/messages/${convId}/typing`)
}

export async function reactMessageRest(body: {
  messageId: string
  type: ReactionType
}): Promise<void> {
  await http.post('/chat/messages/reaction', body)
}

export async function replyRest(body: {
  parentMessageId: string
  sendRequest: { conversationId: number; content?: string }
}): Promise<MessageResponse> {
  const { data } = await http.post<ApiResponse<MessageResponse>>('/chat/messages/reply', body)
  if (!data.result) throw new Error('Reply failed')
  return data.result
}

export async function editMessageRest(
  messageId: string,
  content: string,
): Promise<MessageResponse> {
  const { data } = await http.patch<ApiResponse<MessageResponse>>(
    `/chat/messages/${messageId}`,
    { content },
  )
  if (!data.result) throw new Error('Edit failed')
  return data.result
}

export async function deleteMessageRest(messageId: string): Promise<void> {
  await http.delete(`/chat/messages/${messageId}`)
}
