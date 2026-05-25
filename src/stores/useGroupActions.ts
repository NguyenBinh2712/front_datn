// src/pages/groups/hooks/useGroupActions.ts
import { useQueryClient } from "@tanstack/react-query";
import {
  requestToJoinGroup,
  cancelJoinRequest,
  leaveGroup,
  deleteGroup,
  removeMember,
  changeRole,
  pinPost,
  unpinPost,
  approveJoinRequest,
  rejectJoinRequest,
  transferOwnership,
} from "@/api/group";

export function useGroupActions(groupId: number) {
  const qc = useQueryClient();

  const invalidateAll = () => {
    qc.invalidateQueries({ queryKey: ["group", groupId] });
    qc.invalidateQueries({ queryKey: ["group-feed", groupId] });
    qc.invalidateQueries({ queryKey: ["group-members", groupId] });
    qc.invalidateQueries({ queryKey: ["group-requests", groupId] });
    qc.invalidateQueries({ queryKey: ["groups-mine"] });
  };

  return {
    joinGroup: async (setJoinSent: (value: boolean) => void) => {
      try {
        await requestToJoinGroup(groupId);
        setJoinSent(true);
        invalidateAll();
        alert("✅ Đã gửi yêu cầu tham gia nhóm!");
      } catch (error: any) {
        if (error.response?.status === 409) {
          alert(
            "Bạn đã gửi yêu cầu tham gia hoặc đã là thành viên của nhóm này.",
          );
          setJoinSent(true); // vẫn hiện trạng thái đã gửi
        } else {
          console.error(error);
          alert("Có lỗi xảy ra khi gửi yêu cầu.");
        }
      }
    },

    cancelJoinRequest: async (setJoinSent: (value: boolean) => void) => {
      try {
        await cancelJoinRequest(groupId);
        setJoinSent(false);
        invalidateAll();
        alert("Đã hủy yêu cầu tham gia.");
      } catch (error) {
        console.error(error);
        alert("Hủy yêu cầu thất bại.");
      }
    },

    leaveGroup: async () => {
      if (!confirm("Bạn có chắc chắn muốn rời khỏi nhóm này?")) return false;
      await leaveGroup(groupId);
      invalidateAll();
      return true;
    },

    deleteGroup: async () => {
      if (!confirm("XÓA NHÓM NÀY?\n\nHành động này không thể hoàn tác!"))
        return false;
      await deleteGroup(groupId);
      invalidateAll();
      return true;
    },

    kickMember: async (memberId: number) => {
      if (!confirm("Kick thành viên này?")) return;
      await removeMember(groupId, memberId);
      invalidateAll();
    },

    changeRole: async (memberId: number, newRole: "MEMBER" | "MODERATOR") => {
      await changeRole(groupId, memberId, newRole);
      invalidateAll();
    },

    pinPost: async (postId: number) => {
      await pinPost(groupId, postId);
      invalidateAll();
    },

    unpinPost: async (postId: number) => {
      await unpinPost(groupId, postId);
      invalidateAll();
    },

    approveRequest: async (requestId: number) => {
      await approveJoinRequest(requestId);
      invalidateAll();
    },

    rejectRequest: async (requestId: number) => {
      await rejectJoinRequest(requestId);
      invalidateAll();
    },

    transferOwnership: async (newOwnerId: number, newOwnerName: string) => {
      if (
        !confirm(
          `Chuyển quyền Chủ nhóm cho ${newOwnerName}?\n\nBạn sẽ mất quyền Owner.`,
        )
      )
        return;
      await transferOwnership(groupId, newOwnerId);
      invalidateAll();
      alert("✅ Chuyển quyền chủ nhóm thành công!");
    },
  };
}
