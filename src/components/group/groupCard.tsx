import { Link } from "react-router-dom";
import { useState } from "react";
import { requestToJoinGroup } from "@/api/group";
import type { GroupResponse } from "@/types/models";

type GroupCardProps = {
  group: GroupResponse;
  isJoined?: boolean;
};

export default function GroupCard({ group, isJoined = false }: GroupCardProps) {
  const [pending, setPending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleJoin = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (pending || sent || isJoined) return;

    setPending(true);
    try {
      await requestToJoinGroup(group.id);
      setSent(true);
    } catch (err) {
      alert("Có lỗi xảy ra khi gửi yêu cầu");
    } finally {
      setPending(false);
    }
  };

  return (
    <Link
      to={`/groups/${group.id}`}
      style={{
        display: "block",
        textDecoration: "none",
        color: "inherit",
      }}
    >
      <div
        style={{
          background: "var(--card)",
          border: "1px solid var(--border)",
          borderRadius: 8,
          overflow: "hidden",
          transition: "all 0.2s",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.borderColor = "var(--accent)";
          (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
          (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
        }}
      >
        <div
          style={{
            height: 88,
            background: group.coverImageUrl
              ? `url(${group.coverImageUrl}) center/cover`
              : "var(--cover-placeholder)",
            position: "relative",
          }}
        />

        <div style={{ padding: "14px" }}>
          <div style={{ fontSize: 15.5, fontWeight: 700, marginBottom: 6 }}>
            {group.name}
          </div>

          {group.description && (
            <p
              style={{
                fontSize: 13,
                color: "var(--text-muted)",
                marginBottom: 10,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {group.description}
            </p>
          )}

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span style={{ fontSize: 12.5, color: "var(--text-muted)" }}>
              {group.memberCount} thành viên
            </span>

            {!isJoined && (
              <button
                onClick={handleJoin}
                disabled={pending || sent}
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  padding: "5px 14px",
                  borderRadius: 4,
                  background: sent ? "transparent" : "var(--accent)",
                  color: sent ? "var(--accent)" : "#fff",
                  border: sent ? "1px solid var(--accent)" : "none",
                  cursor: pending ? "wait" : "pointer",
                }}
              >
                {sent ? "✓ Đã gửi" : pending ? "..." : "Tham gia"}
              </button>
            )}

            {isJoined && (
              <span
                style={{
                  color: "var(--accent)",
                  fontWeight: 700,
                  fontSize: 12.5,
                }}
              >
                ✓ Đã tham gia
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
