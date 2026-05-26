import { http } from "@/api/http";
import { getPendingJoinGroupIds } from "@/lib/pending-join-storage";
import type {
  ApiResponse,
  GroupResponse,
  JoinRequestResponse,
  GroupMemberResponse,
  PostResponse,
  Slice,
} from "@/types/models";

export interface GroupCreateRequest {
  name: string;
  description?: string;
  coverImageUrl?: string;
  privacy?: "PUBLIC" | "PRIVATE";
}

export interface GroupUpdateRequest {
  name?: string;
  description?: string;
  coverImageUrl?: string;
  privacy?: "PUBLIC" | "PRIVATE";
}

export interface ChangeRoleRequest {
  newRole: "MEMBER" | "MODERATOR";
}

function formatDateTime(value: unknown): string {
  if (value == null) return "";
  if (typeof value === "string") return value;
  if (Array.isArray(value) && value.length >= 3) {
    const [y, m, d, h = 0, min = 0, s = 0] = value as number[];
    return new Date(y, m - 1, d, h, min, s).toISOString();
  }
  return String(value);
}

function normalizeJoinRequest(
  raw: Record<string, unknown>,
): JoinRequestResponse {
  const status = String(raw.status ?? "PENDING").toUpperCase();
  const inviterName = raw.inviterName;
  return {
    id: Number(raw.id),
    groupId: raw.groupId != null ? Number(raw.groupId) : undefined,
    userId: Number(raw.userId),
    userName: String(raw.userName ?? "Học sinh"),
    inviterId: raw.inviterId != null ? Number(raw.inviterId) : 0,
    inviterName:
      inviterName != null && String(inviterName) !== "null"
        ? String(inviterName)
        : "",
    status: status as JoinRequestResponse["status"],
    requestedAt: formatDateTime(raw.requestedAt),
    reviewedAt: raw.reviewedAt
      ? formatDateTime(raw.reviewedAt)
      : undefined,
  };
}

function normalizeJoinRequestList(raw: unknown): JoinRequestResponse[] {
  if (!raw) return [];
  if (Array.isArray(raw)) {
    return raw.map((item) =>
      normalizeJoinRequest(item as Record<string, unknown>),
    );
  }
  if (typeof raw === "object" && raw !== null && "content" in raw) {
    const content = (raw as { content: unknown }).content;
    if (Array.isArray(content)) {
      return content.map((item) =>
        normalizeJoinRequest(item as Record<string, unknown>),
      );
    }
  }
  return [];
}

//  1. Tạo nhóm mới

export async function createGroup(
  payload: GroupCreateRequest,
): Promise<GroupResponse> {
  const { data } = await http.post<ApiResponse<GroupResponse>>(
    "/groups",
    payload,
  );
  if (!data.result) throw new Error("Create group failed");
  return data.result;
}

//  2. Gửi yêu cầu tham gia nhóm

export async function requestToJoinGroup(groupId: number): Promise<void> {
  await http.post(`/groups/${groupId}/join-request`, null, {
    skipErrorToast: true,
  });
}

//  2b. Học sinh: đã gửi yêu cầu (lưu local sau POST thành công)

export async function hasPendingJoinRequest(groupId: number): Promise<boolean> {
  return getPendingJoinGroupIds().has(groupId);
}

export async function fetchMyPendingJoinGroupIds(): Promise<number[]> {
  return [...getPendingJoinGroupIds()];
}

export async function syncPendingJoinGroupIds(
  groupIds: number[],
): Promise<number[]> {
  const stored = getPendingJoinGroupIds();
  return groupIds.filter((id) => stored.has(id));
}

//  3. Hủy yêu cầu tham gia

export async function cancelJoinRequest(groupId: number): Promise<void> {
  await http.delete(`/groups/${groupId}/join-request`);
}

//  4. Duyệt yêu cầu tham gia (owner)

export async function approveJoinRequest(requestId: number): Promise<void> {
  await http.post(`/groups/requests/${requestId}/approve`);
}

//  5. Từ chối yêu cầu tham gia (owner)

export async function rejectJoinRequest(requestId: number): Promise<void> {
  await http.post(`/groups/requests/${requestId}/reject`);
}

//  6. Mời bạn bè tham gia nhóm

export async function inviteFriend(
  groupId: number,
  friendId: number,
): Promise<void> {
  await http.post(`/groups/${groupId}/invite/${friendId}`);
}

//  7. Chấp nhận lời mời

export async function acceptInvitation(requestId: number): Promise<void> {
  await http.post(`/groups/invitations/${requestId}/accept`);
}

//  8. Từ chối lời mời

export async function rejectInvitation(requestId: number): Promise<void> {
  await http.post(`/groups/invitations/${requestId}/reject`);
}

//  9. Rời nhóm

export async function leaveGroup(groupId: number): Promise<void> {
  await http.delete(`/groups/${groupId}/leave`);
}

//  10. Kick thành viên (owner)

export async function removeMember(
  groupId: number,
  memberId: number,
): Promise<void> {
  await http.delete(`/groups/${groupId}/members/${memberId}`);
}

//  11. Thay đổi vai trò thành viên (owner)

export async function changeRole(
  groupId: number,
  targetUserId: number,
  newRole: ChangeRoleRequest["newRole"],
): Promise<void> {
  await http.put(`/groups/${groupId}/members/${targetUserId}/role`, {
    newRole,
  });
}

//  12. Chuyển quyền sở hữu nhóm

export async function transferOwnership(
  groupId: number,
  newOwnerId: number,
): Promise<void> {
  await http.put(`/groups/${groupId}/transfer-ownership/${newOwnerId}`);
}

//  13. GET /groups/{groupId}/pending-requests — danh sách học sinh chờ duyệt (chủ nhóm)

export async function fetchPendingJoinRequests(
  groupId: number,
  options?: { skipErrorToast?: boolean },
): Promise<JoinRequestResponse[]> {
  const { data } = await http.get<ApiResponse<JoinRequestResponse[]>>(
    `/groups/${groupId}/pending-requests`,
    { skipErrorToast: options?.skipErrorToast },
  );
  return normalizeJoinRequestList(data.result).filter(
    (r) => r.status === "PENDING" && Number.isFinite(r.id) && r.id > 0,
  );
}

//  14. Lấy danh sách thành viên

export async function fetchGroupMembers(
  groupId: number,
): Promise<GroupMemberResponse[]> {
  const { data } = await http.get<ApiResponse<GroupMemberResponse[]>>(
    `/groups/${groupId}/members`,
  );
  return data.result ?? [];
}

//  15. Lấy danh sách nhóm của tôi

export async function fetchMyGroups(): Promise<GroupResponse[]> {
  const { data } =
    await http.get<ApiResponse<GroupResponse[]>>("/groups/my-groups");
  return data.result ?? [];
}

//  16. Lấy chi tiết nhóm

export async function fetchGroupDetail(
  groupId: number,
): Promise<GroupResponse> {
  const { data } = await http.get<ApiResponse<GroupResponse>>(
    `/groups/${groupId}`,
  );
  if (!data.result) throw new Error("Group not found");
  return data.result;
}

//  17. Cập nhật thông tin nhóm (owner)

export async function updateGroupInfo(
  groupId: number,
  payload: GroupUpdateRequest,
): Promise<GroupResponse> {
  const { data } = await http.put<ApiResponse<GroupResponse>>(
    `/groups/${groupId}`,
    payload,
  );
  if (!data.result) throw new Error("Update failed");
  return data.result;
}

//  18. Xóa nhóm (owner)

export async function deleteGroup(groupId: number): Promise<void> {
  await http.delete(`/groups/${groupId}`);
}

//  19. Ghim bài viết (owner/mod)

export async function pinPost(groupId: number, postId: number): Promise<void> {
  await http.post(`/groups/${groupId}/posts/${postId}/pin`);
}

//  20. Bỏ ghim bài viết (owner/mod)

export async function unpinPost(
  groupId: number,
  postId: number,
): Promise<void> {
  await http.delete(`/groups/${groupId}/posts/${postId}/pin`);
}

//  21. Lấy feed của nhóm

export async function fetchGroupFeed(
  groupId: number,
  page: number,
  size: number,
): Promise<Slice<PostResponse>> {
  const { data } = await http.get<ApiResponse<Slice<PostResponse>>>(
    `/groups/${groupId}/feed`,
    { params: { page, size } },
  );
  if (!data.result) throw new Error("Empty feed");
  return data.result;
}

//  22. Tìm kiếm nhóm

export async function searchGroups(
  keyword: string,
  limit = 10,
): Promise<GroupResponse[]> {
  const { data } = await http.get<ApiResponse<GroupResponse[]>>(
    "/groups/search",
    {
      params: { keyword, limit },
      skipAuth: true,
    },
  );
  return data.result ?? [];
}

//  23. Gợi ý nhóm

export async function fetchSuggestedGroups(): Promise<GroupResponse[]> {
  const { data } =
    await http.get<ApiResponse<GroupResponse[]>>("/groups/suggest");
  return data.result ?? [];
}
