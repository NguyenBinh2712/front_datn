import type { GroupMemberResponse, GroupResponse } from "@/types/models";

export function isSameUserId(
  a?: number | null,
  b?: number | null,
): boolean {
  if (a == null || b == null) return false;
  return Number(a) === Number(b);
}

export function isGroupOwner(
  group: GroupResponse | undefined,
  members: GroupMemberResponse[] | undefined,
  userId: number,
): boolean {
  if (!userId || !group) return false;
  if (isSameUserId(group.ownerId, userId)) return true;
  return (
    members?.some(
      (m) => m.role === "OWNER" && isSameUserId(m.userId, userId),
    ) ?? false
  );
}

/** Chỉ 1 chủ nhóm — lấy theo ownerId từ API nhóm (chuẩn hơn role trong membership). */
export function isGroupOwnerMember(
  memberUserId: number,
  ownerId?: number | null,
): boolean {
  return isSameUserId(ownerId, memberUserId);
}
