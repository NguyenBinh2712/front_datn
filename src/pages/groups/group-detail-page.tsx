import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";

import {
  fetchGroupDetail,
  fetchGroupFeed,
  fetchGroupMembers,
  fetchPendingJoinRequests,
} from "@/api/group";

import type {
  GroupResponse,
  GroupMemberResponse,
  JoinRequestResponse,
} from "@/types/models";
import type { PostResponse } from "@/types/models";

import { useAuthStore } from "@/stores/auth-store";
import { useGroupActions } from "@/stores/useGroupActions";
import { css } from "@/lib/styles";

import PostCard from "@/components/group/postCard";
import MemberRow from "@/components/group/memberRow";
import RequestRow from "@/components/group/requestRow";
import EditGroupModal from "./edit-group-modal";
import { GhostBtn } from "@/components/ui/ghostBtn";
import { FeedSkeleton } from "@/components/ui/feedSkeleton";

const SIZE = 10;
type Tab = "feed" | "members" | "requests";

export default function GroupDetailPage() {
  const { groupId } = useParams();
  const gid = Number(groupId);
  const navigate = useNavigate();

  const currentUser = useAuthStore((s) => s.user);
  const currentUserId = currentUser ? Number(currentUser.id) : 0;

  const [tab, setTab] = useState<Tab>("feed");
  const [showEdit, setShowEdit] = useState(false);
  const [joinSent, setJoinSent] = useState(false);
  const [newPostContent, setNewPostContent] = useState("");

  const actions = useGroupActions(gid);

  const { data: group, isLoading: groupLoading } = useQuery<GroupResponse>({
    queryKey: ["group", gid],
    queryFn: () => fetchGroupDetail(gid),
    enabled: Number.isFinite(gid),
  });

  const feed = useInfiniteQuery({
    queryKey: ["group-feed", gid],
    initialPageParam: 0,
    queryFn: ({ pageParam }) => fetchGroupFeed(gid, pageParam as number, SIZE),
    getNextPageParam: (lastPage: any) =>
      lastPage.last ? undefined : lastPage.number + 1,
    enabled: Number.isFinite(gid) && tab === "feed",
  });

  const { data: members } = useQuery<GroupMemberResponse[]>({
    queryKey: ["group-members", gid],
    queryFn: () => fetchGroupMembers(gid),
    enabled: tab === "members",
  });

  const { data: requests } = useQuery<JoinRequestResponse[]>({
    queryKey: ["group-requests", gid],
    queryFn: () => fetchPendingJoinRequests(gid),
    enabled: tab === "requests",
  });

  const posts = feed.data?.pages.flatMap((p) => p.content) ?? [];

  const isOwner = group?.ownerId === currentUserId;
  const isMember = members?.some((m) => m.userId === currentUserId) ?? false;
  const isMod =
    members?.some(
      (m) => m.userId === currentUserId && m.role === "MODERATOR",
    ) ?? false;
  const canPin = isOwner || isMod;

  if (!Number.isFinite(gid)) return <div>Không tìm thấy nhóm</div>;

  const handleJoin = async () => await actions.joinGroup(setJoinSent);
  const handleCancelJoin = async () =>
    await actions.cancelJoinRequest(setJoinSent);
  const handleLeave = async () => {
    const ok = await actions.leaveGroup();
    if (ok) navigate("/groups");
  };
  const handleDelete = async () => {
    const ok = await actions.deleteGroup();
    if (ok) navigate("/groups");
  };

  const handleCreatePost = () => {
    if (!newPostContent.trim()) return;
    alert("✅ Bài viết đã được đăng (đang demo)\n\n" + newPostContent);
    setNewPostContent("");
    // Sau này thay bằng API thật
  };

  return (
    <>
      <style>{css}</style>

      {showEdit && group && (
        <EditGroupModal
          group={group}
          onClose={() => setShowEdit(false)}
          onSaved={() => {}}
        />
      )}

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "16px" }}>
        {/* COVER HEADER */}
        <div
          style={{
            height: 320,
            background: group?.coverImageUrl
              ? `url(${group.coverImageUrl}) center/cover`
              : "var(--cover-placeholder)",
            borderRadius: 12,
            position: "relative",
            marginBottom: 20,
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to bottom, transparent, rgba(0,0,0,0.75))",
              borderRadius: 12,
            }}
          />

          <Link
            to="/groups"
            style={{
              position: "absolute",
              top: 20,
              left: 24,
              color: "#fff",
              fontSize: 15,
              fontWeight: 600,
            }}
          >
            ← Trở về Nhóm
          </Link>

          <div
            style={{
              position: "absolute",
              bottom: 28,
              left: 28,
              right: 28,
              color: "#fff",
            }}
          >
            <h1 style={{ fontSize: 36, fontWeight: 900, margin: 0 }}>
              {group?.name}
            </h1>
            <p style={{ marginTop: 8, fontSize: 15, opacity: 0.95 }}>
              {group?.privacy === "PUBLIC" ? "Nhóm Công khai" : "Nhóm Riêng tư"}{" "}
              • {group?.memberCount} thành viên
            </p>
          </div>

          <div
            style={{
              position: "absolute",
              bottom: 28,
              right: 28,
              display: "flex",
              gap: 12,
            }}
          >
            {isOwner && (
              <>
                <GhostBtn white onClick={() => setShowEdit(true)}>
                  ✏️ Chỉnh sửa
                </GhostBtn>
                <GhostBtn white danger onClick={handleDelete}>
                  🗑 Xóa nhóm
                </GhostBtn>
              </>
            )}
            {isMember && !isOwner && (
              <GhostBtn white danger onClick={handleLeave}>
                Rời nhóm
              </GhostBtn>
            )}
            {!isMember && !joinSent && (
              <GhostBtn white onClick={handleJoin}>
                + Tham gia nhóm
              </GhostBtn>
            )}
            {joinSent && (
              <GhostBtn white onClick={handleCancelJoin}>
                Hủy yêu cầu
              </GhostBtn>
            )}
          </div>
        </div>

        {/* TABS */}
        <div
          style={{
            display: "flex",
            background: "var(--card)",
            borderRadius: 8,
            padding: 4,
            marginBottom: 20,
          }}
        >
          <button
            onClick={() => setTab("feed")}
            className={`tab ${tab === "feed" ? "active" : ""}`}
          >
            Thảo luận
          </button>
          <button
            onClick={() => setTab("members")}
            className={`tab ${tab === "members" ? "active" : ""}`}
          >
            Mọi người
          </button>
          {isOwner && (
            <button
              onClick={() => setTab("requests")}
              className={`tab ${tab === "requests" ? "active" : ""}`}
            >
              Duyệt yêu cầu{" "}
              {requests && requests.length > 0 && `(${requests.length})`}
            </button>
          )}
        </div>

        <div style={{ display: "flex", gap: 20 }}>
          {/* LEFT - MAIN FEED */}
          <div style={{ flex: 1 }}>
            {tab === "feed" && (
              <>
                {/* Post Creation Box */}
                {isMember && (
                  <div
                    style={{
                      background: "var(--card)",
                      padding: 16,
                      borderRadius: 12,
                      marginBottom: 20,
                    }}
                  >
                    <div style={{ display: "flex", gap: 12 }}>
                      <div
                        style={{
                          width: 48,
                          height: 48,
                          borderRadius: "50%",
                          background: "#555",
                          flexShrink: 0,
                        }}
                      />
                      <div style={{ flex: 1 }}>
                        <textarea
                          value={newPostContent}
                          onChange={(e) => setNewPostContent(e.target.value)}
                          placeholder="Bạn đang nghĩ gì cho nhóm này?"
                          style={{
                            width: "100%",
                            minHeight: 90,
                            padding: 14,
                            border: "1px solid var(--border)",
                            borderRadius: 10,
                            background: "var(--bg)",
                            fontSize: 15,
                            resize: "vertical",
                          }}
                        />
                        <div style={{ textAlign: "right", marginTop: 10 }}>
                          <button
                            onClick={handleCreatePost}
                            disabled={!newPostContent.trim()}
                            style={{
                              padding: "10px 24px",
                              background: "#0f62fe",
                              color: "white",
                              border: "none",
                              borderRadius: 8,
                              fontWeight: 600,
                            }}
                          >
                            Đăng bài
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {feed.isLoading && <FeedSkeleton />}
                {posts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    canPin={canPin}
                    onPin={actions.pinPost}
                    onUnpin={actions.unpinPost}
                  />
                ))}
              </>
            )}

            {tab === "members" && (
              <div
                style={{
                  background: "var(--card)",
                  borderRadius: 12,
                  padding: 16,
                }}
              >
                {members?.map((m) => (
                  <MemberRow
                    key={m.userId}
                    m={m}
                    isOwner={isOwner}
                    currentUserId={currentUserId}
                    onKick={actions.kickMember}
                    onChangeRole={actions.changeRole}
                    onTransferOwnership={
                      isOwner ? actions.transferOwnership : undefined
                    }
                  />
                ))}
              </div>
            )}

            {tab === "requests" && isOwner && (
              <div
                style={{
                  background: "var(--card)",
                  borderRadius: 12,
                  padding: 20,
                }}
              >
                <h2>Yêu cầu tham gia ({requests?.length || 0})</h2>
                {requests?.length === 0 ? (
                  <p
                    style={{
                      textAlign: "center",
                      padding: "80px 0",
                      color: "#888",
                    }}
                  >
                    Không có yêu cầu nào đang chờ.
                  </p>
                ) : (
                  requests?.map((req) => (
                    <RequestRow
                      key={req.id}
                      req={req}
                      onApprove={actions.approveRequest}
                      onReject={actions.rejectRequest}
                    />
                  ))
                )}
              </div>
            )}
          </div>

          {/* RIGHT SIDEBAR */}
          <div style={{ width: 340, flexShrink: 0 }}>
            <div
              style={{
                background: "var(--card)",
                padding: 20,
                borderRadius: 12,
                marginBottom: 16,
              }}
            >
              <h3 style={{ marginBottom: 12 }}>Giới thiệu</h3>
              <p style={{ color: "#aaa", lineHeight: 1.6 }}>
                {group?.description || "Chưa có mô tả."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
