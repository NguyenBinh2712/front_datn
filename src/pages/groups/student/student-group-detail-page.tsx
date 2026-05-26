import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import {
  fetchGroupDetail,
  fetchGroupFeed,
  fetchGroupMembers,
  hasPendingJoinRequest,
} from "@/api/group";
import type { GroupResponse, GroupMemberResponse } from "@/types/models";
import { useCurrentUserId } from "@/hooks/use-current-user-id";
import { useGroupActions } from "@/stores/useGroupActions";
import { removePendingJoinGroup } from "@/lib/pending-join-storage";
import { css } from "@/lib/styles";
import PostCard from "@/components/group/postCard";
import MemberRow from "@/components/group/memberRow";
import { GhostBtn } from "@/components/ui/ghostBtn";
import { FeedSkeleton } from "@/components/ui/feedSkeleton";

const SIZE = 10;
type Tab = "feed" | "members";

export default function StudentGroupDetailPage() {
  const { groupId } = useParams();
  const gid = Number(groupId);
  const navigate = useNavigate();

  const { userId: currentUserId } = useCurrentUserId();

  const [tab, setTab] = useState<Tab>("feed");
  const [joinSent, setJoinSent] = useState(false);
  const [newPostContent, setNewPostContent] = useState("");

  const actions = useGroupActions(gid);

  const { data: group } = useQuery<GroupResponse>({
    queryKey: ["group", gid],
    queryFn: () => fetchGroupDetail(gid),
    enabled: Number.isFinite(gid),
  });

  const feed = useInfiniteQuery({
    queryKey: ["group-feed", gid],
    initialPageParam: 0,
    queryFn: ({ pageParam }) => fetchGroupFeed(gid, pageParam as number, SIZE),
    getNextPageParam: (lastPage: { last: boolean; number: number }) =>
      lastPage.last ? undefined : lastPage.number + 1,
    enabled: Number.isFinite(gid) && tab === "feed",
  });

  const { data: members } = useQuery<GroupMemberResponse[]>({
    queryKey: ["group-members", gid],
    queryFn: () => fetchGroupMembers(gid),
    enabled: Number.isFinite(gid),
  });

  const joinStatus = useQuery({
    queryKey: ["my-join-request", gid],
    queryFn: () => hasPendingJoinRequest(gid),
    enabled: Number.isFinite(gid),
  });

  useEffect(() => {
    if (joinStatus.data) setJoinSent(true);
  }, [joinStatus.data]);

  const posts = feed.data?.pages.flatMap((p) => p.content) ?? [];
  const isMember =
    members?.some((m) => m.userId === currentUserId) ?? false;

  if (!Number.isFinite(gid)) return <div>Không tìm thấy nhóm</div>;

  const handleJoin = async () => await actions.joinGroup(setJoinSent);
  const handleCancelJoin = async () => {
    await actions.cancelJoinRequest(setJoinSent);
    removePendingJoinGroup(gid);
  };
  const handleLeave = async () => {
    const ok = await actions.leaveGroup();
    if (ok) navigate("/groups");
  };

  const handleCreatePost = () => {
    if (!newPostContent.trim()) return;
    alert("✅ Bài viết đã được đăng (đang demo)\n\n" + newPostContent);
    setNewPostContent("");
  };

  return (
    <>
      <style>{css}</style>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "16px" }}>
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
            {isMember && (
              <GhostBtn white danger onClick={handleLeave}>
                Rời nhóm
              </GhostBtn>
            )}
            {!isMember && !joinSent && (
              <GhostBtn white onClick={handleJoin}>
                + Tham gia nhóm
              </GhostBtn>
            )}
            {!isMember && joinSent && (
              <GhostBtn white onClick={handleCancelJoin}>
                Hủy yêu cầu
              </GhostBtn>
            )}
          </div>
        </div>

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
        </div>

        <div style={{ display: "flex", gap: 20 }}>
          <div style={{ flex: 1 }}>
            {tab === "feed" && (
              <>
                {isMember && (
                  <div
                    style={{
                      background: "var(--card)",
                      padding: 16,
                      borderRadius: 12,
                      marginBottom: 20,
                    }}
                  >
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
                )}

                {feed.isLoading && <FeedSkeleton />}
                {posts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    canPin={false}
                    onPin={() => {}}
                    onUnpin={() => {}}
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
                    isOwner={false}
                    groupOwnerId={group?.ownerId}
                    currentUserId={currentUserId}
                    onKick={() => {}}
                    onChangeRole={() => {}}
                  />
                ))}
              </div>
            )}
          </div>

          <div style={{ width: 340, flexShrink: 0 }}>
            <div
              style={{
                background: "var(--card)",
                padding: 20,
                borderRadius: 12,
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
