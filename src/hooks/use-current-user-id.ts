import { useQuery } from "@tanstack/react-query";
import { getMe } from "@/api/user";
import { getUserIdFromToken } from "@/lib/jwt";
import { useAuthStore } from "@/stores/auth-store";

export function useCurrentUserId() {
  const token = useAuthStore((s) => s.token);
  const storedUser = useAuthStore((s) => s.user);
  const fromToken = getUserIdFromToken(token);

  const me = useQuery({
    queryKey: ["me"],
    queryFn: getMe,
    enabled: !!token,
    staleTime: 5 * 60 * 1000,
  });

  const fromStore = storedUser?.id ? Number(storedUser.id) : null;
  const userId = Number(me.data?.id ?? fromToken ?? fromStore ?? 0) || 0;

  return {
    userId,
    isLoading: !!token && userId === 0 && me.isLoading,
  };
}
