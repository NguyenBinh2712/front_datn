import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Search, Shield, Trash2, Users } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { http } from "@/api/http";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import type { ApiResponse, UserResponse } from "@/types/models";

// Admin user API functions
async function fetchAllUsers(): Promise<UserResponse[]> {
  const { data } = await http.get<ApiResponse<UserResponse[]>>("/user");

  return data.result ?? [];
}

async function toggleUserStatus(
  userId: number,
  status: boolean,
): Promise<void> {
  await http.put(`/user/admin/${userId}/status`, null, { params: { status } });
}

export function AdminUsersPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const size = 20;

  const users = useQuery({
    queryKey: ["admin-users"],
    queryFn: fetchAllUsers,
  });

  const toggleStatus = useMutation({
    mutationFn: ({ userId, status }: { userId: number; status: boolean }) =>
      toggleUserStatus(userId, status),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["admin-users"] });
    },
  });

  const filteredUsers = (users.data ?? []).filter(
    (u) =>
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.profile?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Header */}
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
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Xem và quản lý tất cả tài khoản trong hệ thống
              </p>
            </div>
          </div>
          <div className="rounded-full bg-indigo-100 px-3 py-1 text-sm font-semibold text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-200">
            Tổng: {users.data?.length ?? 0}{" "}
          </div>
        </div>
      </div>

      {/* Search */}
      <Card className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Tìm kiếm theo email hoặc tên..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      {/* Users List */}
      {users.isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : null}

      {filteredUsers.length > 0 ? (
        <div className="space-y-2">
          {filteredUsers.map((user, idx) => (
            <motion.div
              key={user.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Card className="flex items-center justify-between p-4 hover:shadow-md dark:hover:shadow-slate-900/50">
                <div
                  className="flex-1 cursor-pointer"
                  onClick={() => navigate(`/users/${user.id}`)}
                  role="button"
                  tabIndex={0}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 text-sm font-semibold text-white">
                      {user.profile?.fullName?.charAt(0) ?? "U"}
                    </div>
                    <div>
                      <div className="font-medium text-slate-900 dark:text-white">
                        {user.profile?.fullName || "Người dùng"}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {user.email}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2">
                    {user.status ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-200">
                        <span className="h-1.5 w-1.5 rounded-full bg-green-600" />
                        Hoạt động
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900/30 dark:text-red-200">
                        <span className="h-1.5 w-1.5 rounded-full bg-red-600" />
                        Bị khóa
                      </span>
                    )}
                  </div>

                  <Button
                    size="sm"
                    variant={user.status ? "danger" : "outline"}
                    onClick={() =>
                      toggleStatus.mutate({
                        userId: user.id,
                        status: !user.status,
                      })
                    }
                    disabled={toggleStatus.isPending}
                  >
                    {user.status ? (
                      <>
                        <Trash2 className="mr-1 h-3.5 w-3.5" />
                        Khóa
                      </>
                    ) : (
                      <>
                        <Shield className="mr-1 h-3.5 w-3.5" />
                        Mở khóa
                      </>
                    )}
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <Card className="p-8 text-center">
          <Users className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-700" />
          <p className="mt-3 text-slate-500 dark:text-slate-400">
            {searchTerm
              ? "Không tìm thấy người dùng nào"
              : "Không có người dùng"}
          </p>
        </Card>
      )}

      {/* Pagination */}
    </div>
  );
}
