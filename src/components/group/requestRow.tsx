import { SmallBtn } from "../ui/smallBtn";
import type { JoinRequestResponse } from "@/types/models";

type RequestRowProps = {
  req: JoinRequestResponse;
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
};

export default function RequestRow({
  req,
  onApprove,
  onReject,
}: RequestRowProps) {
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
      <div>
        <div style={{ fontSize: 15, fontWeight: 600 }}>{req.userName}</div>
        {req.inviterName && (
          <div style={{ fontSize: 13, color: "var(--text-muted)" }}>
            Được mời bởi {req.inviterName}
          </div>
        )}
        <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
          {req.requestedAt
            ? new Date(req.requestedAt).toLocaleString("vi-VN")
            : ""}
        </div>
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <SmallBtn onClick={() => onApprove(req.id)}>✓ Duyệt</SmallBtn>
        <SmallBtn danger onClick={() => onReject(req.id)}>
          ✕ Từ chối
        </SmallBtn>
      </div>
    </div>
  );
}
