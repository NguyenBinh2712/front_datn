import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Bell } from "lucide-react";
import { useEffect } from "react";
import { fetchNotifications, markAllRead } from "@/api/notification";
import { getMe } from "@/api/user";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getUserIdFromToken } from "@/lib/jwt";
import { useAuthStore } from "@/stores/auth-store";
import { useStomp } from "@/ws/stomp-context";
import type { NotificationResponse } from "@/types/models";

const SIZE = 15;

export function NotificationsPage() {
  const token = useAuthStore((s) => s.token);
  const uid = token ? getUserIdFromToken(token) : null;
  const qc = useQueryClient();
  const me = useQuery({ queryKey: ["me"], queryFn: getMe });
  const userId = uid ?? me.data?.id;

  const list = useInfiniteQuery({
    queryKey: ["notifications", userId],
    enabled: !!userId,
    initialPageParam: 0,
    queryFn: ({ pageParam }) =>
      fetchNotifications(userId as number, pageParam as number, SIZE),
    getNextPageParam: (last, _p, param) =>
      last.last ? undefined : (param as number) + 1,
  });

  const clear = useMutation({
    mutationFn: () => markAllRead(userId as number),
    onSuccess: () =>
      void qc.invalidateQueries({ queryKey: ["notifications", userId] }),
  });

  const { subscribe } = useStomp();

  useEffect(() => {
    const unsub = subscribe("/user/queue/notifications", () => {
      void qc.invalidateQueries({ queryKey: ["notifications", userId] });
    });
    return unsub;
  }, [qc, subscribe, userId]);

  const rows =
    list.data?.pages.flatMap((p) => p.content) ??
    ([] as NotificationResponse[]);

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
            <Bell className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-slate-900 dark:text-white">
              Thông báo
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Cập nhật real-time với STOMP
            </p>
          </div>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={!userId || clear.isPending}
          onClick={() => clear.mutate()}
        >
          Đánh dấu đã đọc
        </Button>
      </div>

      {!userId ? <Skeleton className="h-24 w-full" /> : null}

      {rows.length > 0 ? (
        <div className="space-y-2">
          {rows.map((n) => (
            <motion.div
              key={n.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card
                className={`space-y-2 p-4 transition ${
                  n.isRead
                    ? "opacity-70 dark:opacity-60"
                    : "border-indigo-300 bg-indigo-50 dark:border-indigo-700 dark:bg-indigo-900/20"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="inline-block rounded-full bg-indigo-600 px-2 py-0.5 text-xs font-semibold text-white dark:bg-indigo-500">
                        {n.type}
                      </span>
                      {!n.isRead && (
                        <span className="inline-block h-2 w-2 rounded-full bg-indigo-600" />
                      )}
                    </div>
                    <p className="mt-1 text-sm text-slate-900 dark:text-white">
                      {n.content}
                    </p>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap pl-2">
                    {new Date(n.createAt).toLocaleString("vi-VN")}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                  <span className="inline-block px-2 py-1 rounded-full bg-slate-200/50 dark:bg-slate-700/50">
                    {n.targetType}
                  </span>
                  <span className="inline-block px-2 py-1 rounded-full bg-slate-200/50 dark:bg-slate-700/50">
                    #{n.targetId}
                  </span>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <Card className="flex flex-col items-center justify-center py-12 text-center">
          <Bell className="h-10 w-10 text-slate-300 dark:text-slate-700" />
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
            Bạn không có thông báo nào
          </p>
        </Card>
      )}

      {list.hasNextPage ? (
        <Button
          type="button"
          variant="outline"
          className="w-full"
          disabled={list.isFetchingNextPage}
          onClick={() => void list.fetchNextPage()}
        >
          {list.isFetchingNextPage ? "Đang tải..." : "Tải thêm"}
        </Button>
      ) : (
        <div className="text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Hết danh sách thông báo
          </p>
        </div>
      )}
    </div>
  );
}
