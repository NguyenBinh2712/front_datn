import React from "react";
import type { GroupMemberResponse } from "@/types/models";

interface Props {
  m: GroupMemberResponse;
  isOwner: boolean;
  currentUserId: number;

  onKick?: (userId: number) => void;

  onChangeRole?: (userId: number, role: "MEMBER" | "MODERATOR") => void;

  onTransferOwnership?: (userId: number) => void;
}

export default function MemberRow({
  m,
  isOwner,
  currentUserId,
  onKick,
  onChangeRole,
  onTransferOwnership,
}: Props) {
  const isCurrentUser = m.userId === currentUserId;

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "16px 0",
        borderBottom: "1px solid var(--border)",
        gap: 16,
      }}
    >
      {/* LEFT */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
        }}
      >
        {/* Avatar */}
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            background: "#2563eb",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 700,
            fontSize: 18,
            flexShrink: 0,
          }}
        >
          {m.fullName.charAt(0).toUpperCase()}
        </div>

        {/* INFO */}
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              flexWrap: "wrap",
            }}
          >
            <h3
              style={{
                margin: 0,
                fontSize: 16,
                fontWeight: 700,
              }}
            >
              {m.fullName}
            </h3>

            {m.role === "OWNER" && <span style={ownerBadge}>OWNER</span>}

            {m.role === "MODERATOR" && <span style={modBadge}>MOD</span>}

            {isCurrentUser && <span style={youBadge}>YOU</span>}
          </div>

          <p
            style={{
              margin: "6px 0 0",
              fontSize: 13,
              color: "#888",
            }}
          >
            Joined: {new Date(m.joinedAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* ACTIONS */}
      {isOwner && !isCurrentUser && (
        <div
          style={{
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
          }}
        >
          {m.role !== "MODERATOR" && (
            <button
              style={btnStyle}
              onClick={() => onChangeRole?.(m.userId, "MODERATOR")}
            >
              Cấp MOD
            </button>
          )}

          {m.role === "MODERATOR" && (
            <button
              style={btnStyle}
              onClick={() => onChangeRole?.(m.userId, "MEMBER")}
            >
              Gỡ MOD
            </button>
          )}

          <button
            style={btnStyle}
            onClick={() => onTransferOwnership?.(m.userId)}
          >
            Transfer OWNER
          </button>

          <button
            style={{
              ...btnStyle,
              background: "#dc2626",
              color: "#fff",
            }}
            onClick={() => onKick?.(m.userId)}
          >
            Kick
          </button>
        </div>
      )}
    </div>
  );
}

const btnStyle: React.CSSProperties = {
  padding: "8px 12px",
  borderRadius: 8,
  border: "1px solid var(--border)",
  background: "var(--card)",
  cursor: "pointer",
  fontWeight: 600,
  fontSize: 13,
};

const ownerBadge: React.CSSProperties = {
  background: "#f59e0b",
  color: "#fff",
  padding: "2px 8px",
  borderRadius: 999,
  fontSize: 12,
  fontWeight: 700,
};

const modBadge: React.CSSProperties = {
  background: "#2563eb",
  color: "#fff",
  padding: "2px 8px",
  borderRadius: 999,
  fontSize: 12,
  fontWeight: 700,
};

const youBadge: React.CSSProperties = {
  background: "#10b981",
  color: "#fff",
  padding: "2px 8px",
  borderRadius: 999,
  fontSize: 12,
  fontWeight: 700,
};
