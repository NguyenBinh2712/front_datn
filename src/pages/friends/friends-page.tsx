import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Check, UserMinus, UserPlus, X, Users, Heart } from "lucide-react";
import {
  acceptFriendRequest,
  listFriends,
  receivedRequests,
  recommendFriends,
  rejectFriendRequest,
  sendFriendRequest,
  unfriend,
} from "@/api/friend";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function FriendsPage() {
  const qc = useQueryClient();

  const friends = useQuery({ queryKey: ["friends"], queryFn: listFriends });
  const inbox = useQuery({
    queryKey: ["friends-in"],
    queryFn: receivedRequests,
  });
  const rec = useQuery({
    queryKey: ["friends-rec"],
    queryFn: () => recommendFriends(15),
  });

  const accept = useMutation({
    mutationFn: (id: number) => acceptFriendRequest(id),
    onSuccess: () => void qc.invalidateQueries({ queryKey: ["friends-in"] }),
  });
  const reject = useMutation({
    mutationFn: (id: number) => rejectFriendRequest(id),
    onSuccess: () => void qc.invalidateQueries({ queryKey: ["friends-in"] }),
  });
  const unfriendMut = useMutation({
    mutationFn: (targetUserId: number) => unfriend(targetUserId),
    onSuccess: () => void qc.invalidateQueries({ queryKey: ["friends"] }),
  });
  const send = useMutation({
    mutationFn: (targetUserId: number) => sendFriendRequest(targetUserId),
    onSuccess: () => void qc.invalidateQueries({ queryKey: ["friends-rec"] }),
  });

  const loading = friends.isLoading || inbox.isLoading || rec.isLoading;

  return (
    <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-3">
      <section className="space-y-4 lg:col-span-2">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
            <Users className="h-5 w-5" />
          </div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
            Bạn bè
          </h1>
        </div>

        <Card className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3 dark:border-slate-800">
            <h2 className="font-semibold text-slate-900 dark:text-white">
              Lời mời nhận được
            </h2>
            {inbox.data && inbox.data.length > 0 && (
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-xs font-semibold text-white">
                {inbox.data.length}
              </span>
            )}
          </div>
          {loading ? (
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : null}
          {(inbox.data ?? []).map((r, idx) => (
            <motion.div
              key={r.friendshipId}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="flex items-center justify-between rounded-xl border border-slate-200/50 p-3 transition hover:bg-slate-50 dark:border-slate-700/50 dark:hover:bg-slate-800/50"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 text-sm font-semibold text-white">
                  {r.fullName.charAt(0)}
                </div>
                <div>
                  <div className="font-medium text-slate-900 dark:text-white">
                    {r.fullName}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    ID: {r.userId}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  type="button"
                  onClick={() => accept.mutate(r.friendshipId)}
                  disabled={accept.isPending}
                >
                  <Check className="mr-1 h-3.5 w-3.5" />
                  Chấp nhận
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  type="button"
                  onClick={() => reject.mutate(r.friendshipId)}
                  disabled={reject.isPending}
                >
                  <X className="mr-1 h-3.5 w-3.5" />
                  Từ chối
                </Button>
              </div>
            </motion.div>
          ))}
          {!loading && !(inbox.data ?? []).length ? (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <Heart className="h-8 w-8 text-slate-300 dark:text-slate-700" />
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Không có lời mời nào.
              </p>
            </div>
          ) : null}
        </Card>

        <Card className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3 dark:border-slate-800">
            <h2 className="font-semibold text-slate-900 dark:text-white">
              Danh sách bạn
            </h2>
            {friends.data && friends.data.length > 0 && (
              <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                {friends.data.length} bạn
              </span>
            )}
          </div>
          {(friends.data ?? []).map((f, idx) => (
            <motion.div
              key={f.friendshipId}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="flex items-center justify-between rounded-xl border border-slate-200/50 p-3 transition hover:bg-slate-50 dark:border-slate-700/50 dark:hover:bg-slate-800/50"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-emerald-500 text-sm font-semibold text-white">
                  {f.fullName.charAt(0)}
                </div>
                <div>
                  <div className="font-medium text-slate-900 dark:text-white">
                    {f.fullName}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    Kết bạn từ {new Date(f.since).toLocaleDateString("vi-VN")}
                  </div>
                </div>
              </div>
              <Button
                size="sm"
                variant="danger"
                type="button"
                onClick={() => unfriendMut.mutate(f.userId)}
                disabled={unfriendMut.isPending}
              >
                <UserMinus className="mr-1 h-3.5 w-3.5" />
                Hủy kết bạn
              </Button>
            </motion.div>
          ))}
          {!loading && !(friends.data ?? []).length ? (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <Users className="h-8 w-8 text-slate-300 dark:text-slate-700" />
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Chưa có bạn — xem gợi ý bên phải.
              </p>
            </div>
          ) : null}
        </Card>
      </section>

      <aside className="space-y-4">
        <Card className="space-y-4">
          <div className="border-b border-slate-200 pb-3 dark:border-slate-800">
            <h2 className="font-semibold text-slate-900 dark:text-white">
              Gợi ý kết bạn
            </h2>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Những người có thể bạn biết
            </p>
          </div>
          {(rec.data ?? []).map((u, idx) => (
            <motion.div
              key={u.userId}
              layout
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="flex items-center justify-between rounded-xl border border-slate-200/50 p-3 text-sm transition hover:bg-slate-50 dark:border-slate-700/50 dark:hover:bg-slate-800/50"
            >
              <div className="flex items-center gap-2 flex-1">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 text-xs font-semibold text-white">
                  {u.email.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-slate-900 dark:text-white truncate">
                    {u.email}
                  </div>
                  {u.mutualFriendsCount ? (
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {u.mutualFriendsCount} bạn chung
                    </div>
                  ) : null}
                </div>
              </div>
              <Button
                size="sm"
                type="button"
                variant="outline"
                onClick={() => send.mutate(u.userId)}
                disabled={send.isPending}
              >
                <UserPlus className="h-3.5 w-3.5" />
              </Button>
            </motion.div>
          ))}
        </Card>
      </aside>
    </div>
  );
}
