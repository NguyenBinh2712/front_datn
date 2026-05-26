import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { requestToJoinGroup } from "@/api/group";
import { isJoinRequestConflict } from "@/lib/http-errors";
import {
  addPendingJoinGroup,
} from "@/lib/pending-join-storage";
import type { GroupResponse } from "@/types/models";

type StudentGroupCardProps = {
  group: GroupResponse;
  isJoined?: boolean;
  requestPending?: boolean;
};

export default function StudentGroupCard({
  group,
  isJoined = false,
  requestPending = false,
}: StudentGroupCardProps) {
  const qc = useQueryClient();
  const [pending, setPending] = useState(false);
  const [sent, setSent] = useState(requestPending);

  useEffect(() => {
    if (requestPending) setSent(true);
  }, [requestPending]);

  const handleJoin = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (pending || sent || isJoined) return;

    setPending(true);
    try {
      await requestToJoinGroup(group.id);
      addPendingJoinGroup(group.id);
      setSent(true);
      void qc.invalidateQueries({ queryKey: ["my-pending-join-groups"] });
    } catch (err) {
      if (isJoinRequestConflict(err)) {
        addPendingJoinGroup(group.id);
        setSent(true);
        void qc.invalidateQueries({ queryKey: ["my-pending-join-groups"] });
      } else {
        alert("Có lỗi xảy ra khi gửi yêu cầu");
      }
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
                type="button"
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
                  cursor: pending ? "wait" : sent ? "default" : "pointer",
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
