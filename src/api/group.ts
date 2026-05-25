import { http } from "@/api/http";
import type {
  ApiResponse,
  GroupResponse,
  JoinRequestResponse,
  GroupMemberResponse,
  PostResponse,
  Slice,
} from "@/types/models";

//  Types

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
  await http.post(`/groups/${groupId}/join-request`);
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

//  13. Lấy danh sách yêu cầu đang chờ (owner)

export async function fetchPendingJoinRequests(
  groupId: number,
): Promise<JoinRequestResponse[]> {
  const { data } = await http.get<ApiResponse<JoinRequestResponse[]>>(
    `/groups/${groupId}/pending-requests`,
  );
  return data.result ?? [];
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
