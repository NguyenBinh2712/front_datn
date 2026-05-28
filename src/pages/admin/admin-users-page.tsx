import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Eye, Search, Trash2, Users, X } from "lucide-react";
import { useMemo, useState } from "react";
import { deleteUser, getAllUsers, getUserById } from "@/api/user";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import type { UserResponse } from "@/types/models";

const PAGE_SIZE = 20;

function formatDate(value?: string) {
  if (!value) return "—";
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? value : d.toLocaleDateString("vi-VN");
}

export function AdminUsersPage() {
  const qc = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [viewUserId, setViewUserId] = useState<number | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<UserResponse | null>(null);

  const users = useQuery({
    queryKey: ["admin-users", page],
    queryFn: () => getAllUsers(page, PAGE_SIZE),
  });

  const userDetail = useQuery({
    queryKey: ["admin-user-detail", viewUserId],
    queryFn: () => getUserById(viewUserId!),
    enabled: viewUserId != null,
  });

  const deleteMut = useMutation({
    mutationFn: (id: number) => deleteUser(id),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["admin-users"] });
      setDeleteTarget(null);
      if (viewUserId === deleteTarget?.id) {
        setViewUserId(null);
      }
    },
  });

  const filteredUsers = useMemo(() => {
    const list = users.data?.content ?? [];
    const q = searchTerm.trim().toLowerCase();
    if (!q) return list;
    return list.filter(
      (u) =>
        u.email.toLowerCase().includes(q) ||
        u.profile?.fullName?.toLowerCase().includes(q),
    );
  }, [users.data?.content, searchTerm]);

  const detail = userDetail.data;

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
                Quản lý người dùng
              </h1>
            </div>
          </div>
          <div className="rounded-full bg-indigo-100 px-3 py-1 text-sm font-semibold text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-200">
            Trang {page + 1} · {filteredUsers.length} user
          </div>
        </div>
      </div>

      <Card className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Tìm theo email hoặc tên..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      {users.isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : (
        <Card className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/50">
                <tr>
                  {["ID", "Người dùng", "Email", "Ngày tạo", "Trạng thái", "Thao tác"].map(
                    (h) => (
                      <th
                        key={h}
                        className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500"
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredUsers.map((user, idx) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.03 }}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/40"
                  >
                    <td className="px-4 py-3 text-slate-500">#{user.id}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 text-xs font-bold text-white">
                          {user.profile?.fullName?.charAt(0)?.toUpperCase() ?? "U"}
                        </div>
                        <span className="font-medium text-slate-900 dark:text-white">
                          {user.profile?.fullName || "—"}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                      {user.email}
                    </td>
                    <td className="px-4 py-3 text-slate-500">
                      {formatDate(user.createAt)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          user.status
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200"
                            : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200"
                        }`}
                      >
                        {user.status ? "Hoạt động" : "Bị khóa"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setViewUserId(user.id)}
                          title="Xem chi tiết"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => setDeleteTarget(user)}
                          title="Xóa"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <p className="p-8 text-center text-slate-500">
              {searchTerm ? "Không tìm thấy người dùng" : "Không có dữ liệu"}
            </p>
          )}
        </Card>
      )}

      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          disabled={page === 0 || users.isLoading}
          onClick={() => setPage((p) => Math.max(0, p - 1))}
        >
          ← Trang trước
        </Button>
        <span className="text-sm text-slate-500">Trang {page + 1}</span>
        <Button
          variant="outline"
          disabled={!users.data?.hasMore || users.isLoading}
          onClick={() => setPage((p) => p + 1)}
        >
          Trang sau →
        </Button>
      </div>

      {viewUserId != null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto p-6">
            <button
              type="button"
              onClick={() => setViewUserId(null)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600"
            >
              <X className="h-5 w-5" />
            </button>

            <h2 className="mb-4 text-xl font-bold text-slate-900 dark:text-white">
              Chi tiết người dùng
            </h2>

            {userDetail.isLoading ? (
              <Skeleton className="h-40 w-full" />
            ) : userDetail.isError ? (
              <p className="text-red-500">Không tải được thông tin user.</p>
            ) : detail ? (
              <div className="space-y-4">
                <div className="grid gap-3 text-sm">
                  <div>
                    <span className="text-slate-500">ID:</span>{" "}
                    <strong>{detail.id}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500">Email:</span>{" "}
                    <strong>{detail.email}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500">Trạng thái:</span>{" "}
                    <strong>{detail.status ? "Hoạt động" : "Bị khóa"}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500">Ngày tạo:</span>{" "}
                    {formatDate(detail.createAt)}
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
                  <p className="mb-2 text-xs font-semibold uppercase text-slate-400">
                    Hồ sơ
                  </p>
                  <p>
                    <span className="text-slate-500">Họ tên:</span>{" "}
                    {detail.profile?.fullName || "—"}
                  </p>
                  <p>
                    <span className="text-slate-500">Bio:</span>{" "}
                    {detail.profile?.bio || "—"}
                  </p>
                  <p>
                    <span className="text-slate-500">Ngày sinh:</span>{" "}
                    {formatDate(detail.profile?.birth)}
                  </p>
                  <p>
                    <span className="text-slate-500">Giới tính:</span>{" "}
                    {detail.profile?.gender ?? "—"}
                  </p>
                </div>
              </div>
            ) : null}
          </Card>
        </div>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="w-full max-w-md p-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Xóa người dùng?
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              Xóa <strong>{deleteTarget.email}</strong>? Hành động không thể
              hoàn tác.
            </p>
            <div className="mt-6 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDeleteTarget(null)}>
                Hủy
              </Button>
              <Button
                variant="danger"
                disabled={deleteMut.isPending}
                onClick={() => deleteMut.mutate(deleteTarget.id)}
              >
                {deleteMut.isPending ? "Đang xóa..." : "Xóa"}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
