import { useQuery } from "@tanstack/react-query";
import { fetchPendingJoinRequests } from "@/api/group";
import { isAxiosStatus } from "@/lib/http-errors";
import type { JoinRequestResponse } from "@/types/models";

type Options = {
  enabled?: boolean;
  /** Không toast khi 403 (vd. preview trên card nhóm không thuộc quyền) */
  skipErrorToast?: boolean;
  refetchInterval?: number | false;
};

export function useGroupPendingRequests(
  groupId: number,
  options: Options = {},
) {
  const {
    enabled = true,
    skipErrorToast = false,
    refetchInterval = 15_000,
  } = options;

  return useQuery<JoinRequestResponse[]>({
    queryKey: ["group-requests", groupId],
    queryFn: () => fetchPendingJoinRequests(groupId, { skipErrorToast }),
    enabled: Number.isFinite(groupId) && enabled,
    refetchInterval,
    retry: (failureCount, error) => {
      if (isAxiosStatus(error, 403)) return false;
      return failureCount < 1;
    },
  });
}
