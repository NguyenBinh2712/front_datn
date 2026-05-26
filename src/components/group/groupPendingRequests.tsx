import RequestRow from "@/components/group/requestRow";
import { useGroupPendingRequests } from "@/hooks/use-group-pending-requests";
import { useGroupActions } from "@/stores/useGroupActions";

type Props = {
  groupId: number;
  /** full: tab/sidebar chi tiết; compact: trên card danh sách */
  variant?: "full" | "compact";
  skipErrorToast?: boolean;
  title?: string;
};

export default function GroupPendingRequests({
  groupId,
  variant = "full",
  skipErrorToast = false,
  title,
}: Props) {
  const actions = useGroupActions(groupId);
  const { data: requests, isLoading, isError, isFetching } =
    useGroupPendingRequests(groupId, {
      skipErrorToast,
      refetchInterval: variant === "compact" ? 30_000 : 15_000,
    });

  const pending = requests ?? [];
  const showLoading = isLoading || (isFetching && pending.length === 0);

  if (variant === "compact" && isError) return null;

  const heading =
    title ??
    (variant === "compact"
      ? `Yêu cầu tham gia (${pending.length})`
      : `Yêu cầu tham gia (${pending.length})`);

  const headingStyle =
    variant === "full"
      ? { marginBottom: 12, fontSize: 22, fontWeight: 800, marginTop: 0 }
      : {
          fontSize: title ? 15 : 12,
          fontWeight: 700,
          color: title ? "inherit" : "var(--text-muted)",
          marginBottom: 8,
          marginTop: 0,
        };

  return (
    <div>
      {variant === "full" ? (
        <h2 style={headingStyle}>{heading}</h2>
      ) : (
        <h3 style={headingStyle}>{heading}</h3>
      )}

      {showLoading ? (
        <p style={{ color: "#888", fontSize: 14, margin: 0 }}>
          Đang tải yêu cầu...
        </p>
      ) : isError ? (
        <p style={{ color: "#f87171", fontSize: 14, margin: 0 }}>
          Bạn không phải chủ nhóm hoặc không có quyền xem yêu cầu.
        </p>
      ) : pending.length === 0 ? (
        <p
          style={{
            color: "#888",
            fontSize: variant === "compact" ? 12 : 14,
            margin: 0,
            textAlign: variant === "full" ? "center" : "left",
            padding: variant === "full" ? "40px 0" : 0,
          }}
        >
          Chưa có yêu cầu nào đang chờ.
        </p>
      ) : (
        pending.map((req) => (
          <RequestRow
            key={req.id}
            req={req}
            onApprove={actions.approveRequest}
            onReject={actions.rejectRequest}
          />
        ))
      )}
    </div>
  );
}
