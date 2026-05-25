import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { commentPost, deletePost, fetchPost, reactPost } from "@/api/post";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import type { ReactionType, PostResponse } from "@/types/models";

const reactions: ReactionType[] = ["LIKE", "LOVE", "WOW"];

export function PostDetailPage() {
  const { postId } = useParams();
  const id = Number(postId);
  const qc = useQueryClient();
  const [text, setText] = useState("");

  const q = useQuery<PostResponse>({
    queryKey: ["post", id],
    queryFn: () => fetchPost(id),
    enabled: Number.isFinite(id),
  });

  const reactMut = useMutation({
    mutationFn: (type: ReactionType) => reactPost(id, { type }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["post", id] }),
  });

  const del = useMutation({
    mutationFn: () => deletePost(id),
    onSuccess: () => history.back(),
  });

  const cm = useMutation({
    mutationFn: (content: string) => commentPost(id, { content }),
    onSuccess: () => {
      setText("");
      qc.invalidateQueries({ queryKey: ["post", id] });
    },
  });

  if (!Number.isFinite(id)) return <p>Không tìm thấy bài viết</p>;
  if (q.isLoading) return <Skeleton className="mx-auto h-64 max-w-2xl" />;
  if (!q.data) return null;

  const post = q.data;

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      {/* POST CONTENT */}
      <Card className="space-y-4">
        <div className="flex justify-between text-sm text-slate-500">
          <span>
            User #{post.user.id} · {post.postType}
          </span>

          <Button size="sm" variant="danger" onClick={() => del.mutate()}>
            Xóa
          </Button>
        </div>

        <div className="flex items-center gap-2 text-sm font-medium">
          <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
            {post.user.fullName[0].toUpperCase()}
          </div>
          {post.user.fullName}
        </div>

        <p className="whitespace-pre-wrap text-lg">{post.content}</p>

        <div className="text-xs text-slate-400">
          {post.createdAt
            ? new Date(post.createdAt).toLocaleString("vi-VN")
            : ""}
        </div>

        {/* REACTIONS */}
        <div className="flex flex-wrap gap-2">
          {reactions.map((r) => (
            <Button
              key={r}
              size="sm"
              variant="outline"
              onClick={() => reactMut.mutate(r)}
              disabled={reactMut.isPending}
            >
              {r} ({post.reactions?.[r] ?? 0})
            </Button>
          ))}
        </div>
      </Card>

      {/* COMMENTS */}
      <Card className="space-y-3">
        <h2 className="font-medium">Bình luận</h2>

        <div className="flex gap-2">
          <Input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Bình luận…"
          />
          <Button
            disabled={!text.trim() || cm.isPending}
            onClick={() => cm.mutate(text.trim())}
          >
            Gửi
          </Button>
        </div>

        {(post.comments ?? []).map((c) => (
          <div key={c.id} className="rounded-xl border p-3 text-sm">
            <div className="text-xs text-slate-500">User #{c.userId}</div>
            <div>{c.content}</div>
          </div>
        ))}
      </Card>
    </div>
  );
}
