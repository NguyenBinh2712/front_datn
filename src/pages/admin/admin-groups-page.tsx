import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Users, Trash2, Eye, Lock } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { http } from "@/api/http";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { ApiResponse } from "@/types/models";

export type GroupResponse = {
  id: number;
  name: string;
  description?: string;
  avatarUrl?: string;
  membersCount?: number;
  createdAt?: string;
  ownerId?: number;
  privacy?: string;
};

// Admin group API functions
async function fetchAllGroups(
  page: number = 0,
  size: number = 15,
): Promise<{ content: GroupResponse[]; totalElements: number }> {
  try {
    const { data } = await http.get<
      ApiResponse<{ content: GroupResponse[]; totalElements: number }>
    >("/groups/admin/all", { params: { page, size } });
    return data.result ?? { content: [], totalElements: 0 };
  } catch {
    return { content: [], totalElements: 0 };
  }
}

async function deleteGroup(groupId: number): Promise<void> {
  await http.delete(`/groups/admin/${groupId}`);
}

async function getGroupDetail(groupId: number): Promise<GroupResponse> {
  const { data } = await http.get<ApiResponse<GroupResponse>>(
    `/groups/${groupId}`,
  );
  if (!data.result) throw new Error("Group not found");
  return data.result;
}

export function AdminGroupsPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [page, setPage] = useState(0);
  const [selectedGroup, setSelectedGroup] = useState<GroupResponse | null>(
    null,
  );
  const size = 15;

  const groups = useQuery({
    queryKey: ["admin-groups", page],
    queryFn: () => fetchAllGroups(page, size),
  });

  const groupDetail = useQuery({
    queryKey: ["admin-group-detail", selectedGroup?.id],
    queryFn: () => getGroupDetail(selectedGroup!.id),
    enabled: !!selectedGroup?.id,
  });

  const deleteGroupMut = useMutation({
    mutationFn: (groupId: number) => deleteGroup(groupId),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["admin-groups"] });
      setSelectedGroup(null);
    },
  });

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Header */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
                Quản lý nhóm học tập
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Quản lý và xóa các nhóm không phù hợp
              </p>
            </div>
          </div>
          <div className="rounded-full bg-purple-100 px-3 py-1 text-sm font-semibold text-purple-700 dark:bg-purple-900/30 dark:text-purple-200">
            Tổng: {groups.data?.totalElements ?? 0}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Groups List */}
        <div className="space-y-2 lg:col-span-2">
          {groups.isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          ) : null}

          {(groups.data?.content ?? []).map((group, idx) => (
            <motion.div
              key={group.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Card
                className={`cursor-pointer p-4 transition hover:shadow-md dark:hover:shadow-slate-900/50 ${
                  selectedGroup?.id === group.id
                    ? "border-purple-500 bg-purple-50 dark:border-purple-500 dark:bg-purple-900/20"
                    : ""
                }`}
                onClick={() => setSelectedGroup(group)}
                role="button"
                tabIndex={0}
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-400 to-purple-600 text-sm font-semibold text-white">
                    {group.name.charAt(0)}
                  </div>
                  <div className="flex-1 space-y-1">
                    <h3 className="font-semibold text-slate-900 dark:text-white">
                      {group.name}
                    </h3>
                    <p className="line-clamp-1 text-xs text-slate-600 dark:text-slate-300">
                      {group.description || "Không có mô tả"}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {group.membersCount || 0} thành viên
                      </span>
                      {group.privacy && (
                        <span className="flex items-center gap-1">
                          <Lock className="h-3 w-3" />
                          {group.privacy}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}

          {(groups.data?.content ?? []).length === 0 && !groups.isLoading ? (
            <Card className="p-8 text-center">
              <Users className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-700" />
              <p className="mt-3 text-slate-500 dark:text-slate-400">
                Không có nhóm nào
              </p>
            </Card>
          ) : null}

          {/* Pagination */}
          {groups.data && groups.data.totalElements > 0 ? (
            <Card className="flex items-center justify-between p-4">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Trang {page + 1} của{" "}
                {Math.ceil(groups.data.totalElements / size)}
              </p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  disabled={page === 0}
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                >
                  Trước
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={(page + 1) * size >= groups.data.totalElements}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Tiếp
                </Button>
              </div>
            </Card>
          ) : null}
        </div>

        {/* Group Detail */}
        <div>
          {selectedGroup ? (
            <Card className="sticky top-6 space-y-4 p-5">
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">
                  Chi tiết nhóm
                </h3>
              </div>

              {groupDetail.isLoading ? (
                <Skeleton className="h-32 w-full" />
              ) : (
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="mb-1 font-medium text-slate-700 dark:text-slate-300">
                      Tên nhóm:
                    </p>
                    <p className="text-slate-600 dark:text-slate-400">
                      {groupDetail.data?.name}
                    </p>
                  </div>

                  <div>
                    <p className="mb-1 font-medium text-slate-700 dark:text-slate-300">
                      Mô tả:
                    </p>
                    <p className="text-slate-600 dark:text-slate-400">
                      {groupDetail.data?.description || "Không có mô tả"}
                    </p>
                  </div>

                  <div>
                    <p className="mb-1 font-medium text-slate-700 dark:text-slate-300">
                      Thành viên:
                    </p>
                    <p className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      <Users className="h-3 w-3" />
                      {groupDetail.data?.membersCount || 0}
                    </p>
                  </div>

                  {groupDetail.data?.privacy ? (
                    <div>
                      <p className="mb-1 font-medium text-slate-700 dark:text-slate-300">
                        Chế độ:
                      </p>
                      <p className="inline-block rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                        {groupDetail.data.privacy}
                      </p>
                    </div>
                  ) : null}

                  <div>
                    <p className="mb-1 font-medium text-slate-700 dark:text-slate-300">
                      Ngày tạo:
                    </p>
                    <p className="text-slate-600 dark:text-slate-400">
                      {groupDetail.data?.createdAt
                        ? new Date(groupDetail.data.createdAt).toLocaleString(
                            "vi-VN",
                          )
                        : "-"}
                    </p>
                  </div>

                  <div>
                    <p className="mb-1 font-medium text-slate-700 dark:text-slate-300">
                      Chủ nhóm:
                    </p>
                    <p className="text-slate-600 dark:text-slate-400">
                      ID: {groupDetail.data?.ownerId || "-"}
                    </p>
                  </div>
                </div>
              )}

              <div className="space-y-2 border-t border-slate-200 pt-4 dark:border-slate-700">
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate(`/groups/${selectedGroup.id}`)}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  Xem nhóm
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  className="w-full"
                  onClick={() => {
                    if (confirm("Bạn có chắc muốn xóa nhóm này")) {
                      deleteGroupMut.mutate(selectedGroup.id);
                    }
                  }}
                  disabled={deleteGroupMut.isPending}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Xóa nhóm
                </Button>
              </div>
            </Card>
          ) : (
            <Card className="flex items-center justify-center p-8 text-center">
              <div>
                <Eye className="mx-auto h-8 w-8 text-slate-400" />
                <p className="mt-2 text-sm text-slate-500">
                  Chọn nhóm để xem chi tiết
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
