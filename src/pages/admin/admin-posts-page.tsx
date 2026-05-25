// src/pages/admin/admin-posts-page.tsx

import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  AlertTriangle,
  Eye,
  Loader2,
  MessageCircle,
  Heart,
  Trash2,
  CheckCircle2,
  XCircle,
} from "lucide-react";

import { useMemo, useState } from "react";

import {
  deletePost,
  fetchAdminPosts,
  fetchPost,
  getPendingReports,
  handleReport,
} from "@/api/post";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import type { PostResponse, ReportResponse } from "@/types/models";

export function AdminPostsPage() {
  const qc = useQueryClient();

  const [selectedPost, setSelectedPost] = useState<PostResponse | null>(null);

  // POSTS
  const posts = useInfiniteQuery({
    queryKey: ["admin-posts"],
    queryFn: ({ pageParam }) => fetchAdminPosts(pageParam, 20),
    initialPageParam: 0,
    getNextPageParam: (last, _all, page) => (last.last ? undefined : page + 1),
  });

  // REPORTS
  const reports = useQuery({
    queryKey: ["reports"],
    queryFn: getPendingReports,
  });

  // DETAIL (SAFE)
  const detail = useQuery({
    queryKey: ["admin-post-detail", selectedPost?.id],
    enabled: !!selectedPost?.id,
    queryFn: async () => {
      if (!selectedPost?.id) {
        throw new Error("No post selected");
      }
      return fetchPost(selectedPost.id);
    },
  });

  // DELETE POST
  const deleteMut = useMutation({
    mutationFn: async (postId: number) => {
      return deletePost(postId);
    },
    onSuccess: async () => {
      setSelectedPost(null);
      await qc.invalidateQueries({ queryKey: ["admin-posts"] });
      await qc.invalidateQueries({ queryKey: ["reports"] });
    },
  });

  // HANDLE REPORT
  const handleMut = useMutation({
    mutationFn: ({
      reportId,
      status,
    }: {
      reportId: number;
      status: "APPROVED" | "REJECTED";
    }) => handleReport(reportId, status),

    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["reports"] });
    },
  });

  const allPosts = posts.data?.pages.flatMap((p) => p.content) ?? [];

  const totalReaction = useMemo(() => {
    return Object.values(detail.data?.reactions ?? {}).reduce(
      (a, b) => a + (b ?? 0),
      0,
    );
  }, [detail.data]);

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
      {/* POSTS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Tất cả bài viết</h2>

          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium dark:bg-slate-800">
            {allPosts.length} posts
          </span>
        </div>

        <div className="space-y-3">
          {posts.isLoading && (
            <>
              <Skeleton className="h-28 w-full rounded-2xl" />
              <Skeleton className="h-28 w-full rounded-2xl" />
              <Skeleton className="h-28 w-full rounded-2xl" />
            </>
          )}

          {allPosts.map((post) => {
            const active = selectedPost?.id === post.id;

            return (
              <Card
                key={post.id}
                className={`cursor-pointer p-4 transition-all hover:shadow-md ${
                  active
                    ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/20"
                    : ""
                }`}
                onClick={() => setSelectedPost(post)}
              >
                <div className="flex items-center gap-3">
                  <img
                    src={
                      post.user?.urlAvatar ??
                      "https://ui-avatars.com/api/?name=User"
                    }
                    className="h-11 w-11 rounded-full object-cover"
                  />

                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">
                      {post.user?.fullName ?? `User #${post.user?.id ?? "?"}`}
                    </p>

                    <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                      <span>Post #{post.id}</span>
                      <span>•</span>
                      <span>{post.privacy}</span>
                    </div>
                  </div>
                </div>

                <p className="mt-3 line-clamp-2 text-sm text-slate-600 dark:text-slate-400">
                  {post.content || "Không có nội dung"}
                </p>
              </Card>
            );
          })}

          <Button
            className="w-full"
            variant="outline"
            disabled={!posts.hasNextPage || posts.isFetchingNextPage}
            onClick={() => void posts.fetchNextPage()}
          >
            {posts.isFetchingNextPage ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang tải...
              </>
            ) : posts.hasNextPage ? (
              "Tải thêm"
            ) : (
              "Hết dữ liệu"
            )}
          </Button>
        </div>
      </div>

      {/* DETAIL */}
      <div>
        <Card className="sticky top-4 p-5">
          {detail.isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-60 w-full" />
            </div>
          ) : detail.data ? (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={
                      detail.data.user?.urlAvatar ??
                      "https://ui-avatars.com/api/?name=User"
                    }
                    className="h-12 w-12 rounded-full object-cover"
                  />

                  <div>
                    <p className="font-semibold">
                      {detail.data.user?.fullName ??
                        `User #${detail.data.user?.id ?? "?"}`}
                    </p>
                    <p className="text-xs text-slate-500">
                      Post #{detail.data.id}
                    </p>
                  </div>
                </div>

                <Button
                  size="sm"
                  className="text-red-500 hover:text-red-600"
                  disabled={deleteMut.isPending}
                  onClick={() => {
                    if (confirm("Bạn có chắc muốn xóa bài viết này?")) {
                      deleteMut.mutate(detail.data.id);
                    }
                  }}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Xóa
                </Button>
              </div>

              <div>
                <p className="mb-2 text-sm font-medium text-slate-500">
                  Nội dung
                </p>
                <p className="whitespace-pre-wrap text-sm leading-relaxed">
                  {detail.data.content}
                </p>
              </div>

              {detail.data.medias?.length ? (
                <div className="grid grid-cols-2 gap-2">
                  {detail.data.medias.map((m, i) => (
                    <div
                      key={i}
                      className="overflow-hidden rounded-2xl border bg-black"
                    >
                      <img
                        src={m.url}
                        className="h-full max-h-[240px] w-full object-contain"
                      />
                    </div>
                  ))}
                </div>
              ) : null}

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl border p-4">
                  <div className="flex items-center gap-2 text-slate-500">
                    <Heart className="h-4 w-4" />
                    <span className="text-sm">Reactions</span>
                  </div>
                  <p className="mt-2 text-2xl font-semibold">{totalReaction}</p>
                </div>

                <div className="rounded-2xl border p-4">
                  <div className="flex items-center gap-2 text-slate-500">
                    <MessageCircle className="h-4 w-4" />
                    <span className="text-sm">Comments</span>
                  </div>
                  <p className="mt-2 text-2xl font-semibold">
                    {detail.data.commentCount ?? 0}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex min-h-[300px] flex-col items-center justify-center text-center text-slate-500">
              <Eye className="mb-3 h-10 w-10" />
              <p>Chọn bài viết để xem</p>
            </div>
          )}
        </Card>
      </div>

      {/* REPORTS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Báo cáo</h2>

          <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-700">
            {reports.data?.length ?? 0}
          </span>
        </div>

        <div className="space-y-3">
          {reports.data?.map((r: ReportResponse) => (
            <Card key={r.id} className="space-y-4 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-500" />
                  <div>
                    <p className="font-medium">Report #{r.id}</p>
                    <p className="text-xs text-slate-500">Post #{r.postId}</p>
                  </div>
                </div>

                <span className="text-xs font-medium">{r.status}</span>
              </div>

              <p className="text-sm">{r.reason}</p>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="flex-1"
                  onClick={() =>
                    handleMut.mutate({
                      reportId: r.id,
                      status: "APPROVED",
                    })
                  }
                >
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Duyệt
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={() =>
                    handleMut.mutate({
                      reportId: r.id,
                      status: "REJECTED",
                    })
                  }
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Từ chối
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
