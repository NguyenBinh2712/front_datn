import { SmallBtn } from "../ui/smallBtn";
import type { GroupMemberResponse } from "@/types/models";

type Role = GroupMemberResponse["role"]; // OWNER | MODERATOR | MEMBER

function RoleBadge({ role }: { role: Role }) {
  const map: Record<Role, { label: string; color: string }> = {
    OWNER: { label: "Chủ nhóm", color: "#f59e0b" },
    MODERATOR: { label: "Quản trị viên", color: "#0f62fe" },
    MEMBER: { label: "Thành viên", color: "var(--text-muted)" },
  };

  const r = map[role];

  return (
    <span
      style={{
        fontSize: 10,
        fontWeight: 700,
        color: r.color,
        letterSpacing: "0.08em",
      }}
    >
      {r.label}
    </span>
  );
}

type MemberRowProps = {
  m: GroupMemberResponse;
  isOwner: boolean;
  currentUserId: number;
  onKick: (id: number) => void;
  onChangeRole: (id: number, role: "MEMBER" | "MODERATOR") => void;
  onTransferOwnership?: (id: number, name: string) => void;
};

export default function MemberRow({
  m,
  isOwner,
  currentUserId,
  onKick,
  onChangeRole,
  onTransferOwnership,
}: MemberRowProps) {
  const isSelf = m.userId === currentUserId;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 0",
        borderBottom: "1px solid var(--border)",
        gap: 12,
      }}
    >
      {/* LEFT */}
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <div
          style={{
            width: 42,
            height: 42,
            borderRadius: "50%",
            background: "var(--muted)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 16,
            fontWeight: 700,
            color: "var(--accent)",
          }}
        >
          {m.fullName?.[0]?.toUpperCase()}
        </div>

        <div>
          <div style={{ fontSize: 15, fontWeight: 600 }}>
            {m.fullName}{" "}
            {isSelf && (
              <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
                (bạn)
              </span>
            )}
          </div>

          <RoleBadge role={m.role} />
        </div>
      </div>

      {/* RIGHT ACTIONS */}
      {isOwner && !isSelf && m.role !== "OWNER" && (
        <div style={{ display: "flex", gap: 6 }}>
          {/* MODERATOR <-> MEMBER toggle (FIXED) */}
          <SmallBtn
            onClick={() =>
              onChangeRole(
                m.userId,
                m.role === "MODERATOR" ? "MEMBER" : "MODERATOR",
              )
            }
          >
            {m.role === "MODERATOR" ? "↓ Member" : "↑ Mod"}
          </SmallBtn>

          {/* TRANSFER OWNER */}
          {onTransferOwnership && (
            <SmallBtn onClick={() => onTransferOwnership(m.userId, m.fullName)}>
              👑 Owner
            </SmallBtn>
          )}

          {/* KICK */}
          <SmallBtn danger onClick={() => onKick(m.userId)}>
            Kick
          </SmallBtn>
        </div>
      )}
    </div>
  );
}
