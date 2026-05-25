import { http } from "@/api/http";
import type { ApiResponse, NotificationResponse, Slice } from "@/types/models";

export async function fetchNotifications(
  userId: number,
  page: number,
  size: number,
): Promise<Slice<NotificationResponse>> {
  const { data } = await http.get<ApiResponse<Slice<NotificationResponse>>>(
    "/notifications",
    { params: { userId, page, size } },
  );
  if (!data.result) throw new Error("No notifications");
  return data.result;
}

export async function unreadCount(userId: number): Promise<number> {
  const { data } = await http.get<ApiResponse<number>>(
    "/notifications/unread-count",
    {
      params: { userId },
    },
  );
  return data.result ?? 0;
}

export async function markAllRead(userId: number): Promise<void> {
  await http.put("/notifications/mark-all-read", null, { params: { userId } });
}
