import { Link } from "react-router-dom";
import type { GroupResponse } from "@/types/models";
import GroupPendingRequests from "@/components/group/groupPendingRequests";
import { useGroupPendingRequests } from "@/hooks/use-group-pending-requests";

type TeacherGroupCardProps = {
  group: GroupResponse;
};

export default function TeacherGroupCard({ group }: TeacherGroupCardProps) {
  const { data: requests } = useGroupPendingRequests(group.id, {
    skipErrorToast: true,
    refetchInterval: 30_000,
  });
  const pendingCount = requests?.length ?? 0;

  return (
    <div
      style={{
        background: "var(--card)",
        border: "1px solid var(--border)",
        borderRadius: 8,
        overflow: "hidden",
        transition: "all 0.2s",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = "#059669";
        (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
        (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
      }}
    >
      <Link
        to={`/teacher/groups/${group.id}`}
        style={{
          display: "block",
          textDecoration: "none",
          color: "inherit",
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
            <span
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: "#059669",
              }}
            >
              Quản lý →
            </span>
          </div>
        </div>
      </Link>

      <div
        style={{
          borderTop: "1px solid var(--border)",
          padding: "12px 14px",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {pendingCount > 0 && (
          <span
            style={{
              display: "inline-block",
              marginBottom: 8,
              fontSize: 11,
              fontWeight: 700,
              color: "#fff",
              background: "#dc2626",
              borderRadius: 999,
              padding: "2px 8px",
            }}
          >
            {pendingCount} yêu cầu chờ duyệt
          </span>
        )}
        <GroupPendingRequests
          groupId={group.id}
          variant="compact"
          skipErrorToast={true}
        />
      </div>
    </div>
  );
}
