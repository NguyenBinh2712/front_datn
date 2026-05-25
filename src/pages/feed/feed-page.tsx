import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { motion } from "framer-motion";

import {
  Heart,
  Loader2,
  MessageCircle,
  Send,
  Share2,
  Trash2,
  AlertTriangle,
  ImagePlus,
} from "lucide-react";

import { useMemo, useState } from "react";

import {
  commentPost,
  createPost,
  deleteComment,
  deletePost,
  fetchComments,
  fetchFeed,
  reactPost,
  reportPost,
  sharePost,
} from "@/api/post";

import { useAuthStore } from "@/stores/auth-store";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";

import type {
  CommentResponse,
  PostResponse,
  Privacy,
  ReactionType,
} from "@/types/models";

const PAGE_SIZE = 10;

const reactions: ReactionType[] = ["LIKE", "LOVE", "HAHA"];

export function FeedPage() {
  const qc = useQueryClient();

  const currentUser = useAuthStore((s) => s.user);

  const currentUserId = currentUser?.id ? Number(currentUser.id) : undefined;

  const [openCreate, setOpenCreate] = useState(false);

  const feed = useInfiniteQuery({
    queryKey: ["feed"],
    queryFn: ({ pageParam }) => fetchFeed(pageParam, PAGE_SIZE),
    initialPageParam: 0,
    getNextPageParam: (last, _all, lastPage) =>
      last.last ? undefined : lastPage + 1,
  });

  const posts = feed.data?.pages.flatMap((p) => p.content) ?? [];

  const refresh = async () => {
    await qc.invalidateQueries({ queryKey: ["feed"] });
  };

  if (feed.isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Bảng tin</h1>
          <p className="text-sm text-slate-500">
            Chia sẻ kiến thức và kết nối bạn bè
          </p>
        </div>

        <Button onClick={() => setOpenCreate(true)}>Tạo bài viết</Button>
      </div>

      {posts.map((post) => {
        const isMine =
          currentUserId != null && Number(post.user.id) === currentUserId;

        return (
          <PostCard
            key={post.id}
            post={post}
            isMine={isMine}
            currentUserId={currentUserId}
            onRefresh={refresh}
          />
        );
      })}

      <div className="flex justify-center">
        <Button
          variant="outline"
          disabled={!feed.hasNextPage || feed.isFetchingNextPage}
          onClick={() => void feed.fetchNextPage()}
        >
          {feed.isFetchingNextPage ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Đang tải...
            </>
          ) : feed.hasNextPage ? (
            "Tải thêm"
          ) : (
            "Hết bài viết"
          )}
        </Button>
      </div>

      {openCreate && (
        <CreatePostModal
          onClose={() => setOpenCreate(false)}
          onCreated={async () => {
            await refresh();
            setOpenCreate(false);
          }}
        />
      )}
    </div>
  );
}

function PostCard({
  post,
  isMine,
  currentUserId,
  onRefresh,
}: {
  post: PostResponse;
  isMine: boolean;
  currentUserId?: number;
  onRefresh: () => Promise<void>;
}) {
  const qc = useQueryClient();
  const [openComments, setOpenComments] = useState(false);

  const reactMut = useMutation({
    mutationFn: (type: ReactionType) => reactPost(post.id, { type }),
    onSuccess: onRefresh,
  });

  const shareMut = useMutation({
    mutationFn: () => sharePost(post.id),
    onSuccess: async () => {
      await onRefresh();
      alert("Đã chia sẻ bài viết");
    },
  });

  const deleteMut = useMutation({
    mutationFn: () => deletePost(post.id),
    onSuccess: async () => {
      await onRefresh();
      alert("Xóa bài viết thành công");
    },
    onError: () => alert("Xóa bài viết thất bại"),
  });

  const reportMut = useMutation({
    mutationFn: () =>
      reportPost(post.id, {
        reason: "OTHER",
        description: "Nội dung không phù hợp",
      }),
    onSuccess: () => alert("Đã báo cáo bài viết"),
  });

  const totalReaction = useMemo(() => {
    return Object.values(post.reactions ?? {}).reduce(
      (a, b) => a + (b ?? 0),
      0,
    );
  }, [post]);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="overflow-hidden p-5">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <img
              src={
                post.user.urlAvatar ?? "https://ui-avatars.com/api/?name=User"
              }
              className="h-11 w-11 rounded-full object-cover"
            />

            <div>
              <p className="font-semibold">
                {post.user.fullName ?? `User #${post.user.id}`}
              </p>

              <div className="text-xs text-slate-500">
                {post.privacy} •{" "}
                {post.createdAt
                  ? new Date(post.createdAt).toLocaleString("vi-VN")
                  : ""}
              </div>
            </div>
          </div>

          {isMine ? (
            <Button
              size="icon"
              variant="ghost"
              disabled={deleteMut.isPending}
              onClick={() => deleteMut.mutate()}
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          ) : (
            <Button
              size="icon"
              variant="ghost"
              disabled={reportMut.isPending}
              onClick={() => reportMut.mutate()}
            >
              <AlertTriangle className="h-4 w-4 text-orange-500" />
            </Button>
          )}
        </div>

        {!!post.content && (
          <p className="mt-4 whitespace-pre-wrap">{post.content}</p>
        )}

        <div className="mt-4 flex justify-between text-sm text-slate-500">
          <span>{totalReaction} lượt thích</span>
          <button onClick={() => setOpenComments((v) => !v)}>
            {post.commentCount ?? 0} bình luận
          </button>
        </div>

        <div className="mt-3 flex justify-between border-t pt-3">
          <div className="flex gap-2">
            {reactions.map((r) => (
              <Button
                key={r}
                size="sm"
                variant="outline"
                onClick={() => reactMut.mutate(r)}
              >
                <Heart className="mr-1 h-3 w-3" />
                {r}
              </Button>
            ))}
          </div>

          <div className="flex gap-2">
            <Button
              size="sm"
              variant={openComments ? "primary" : "ghost"}
              onClick={() => setOpenComments((v) => !v)}
            >
              <MessageCircle className="mr-1 h-4 w-4" />
              Bình luận
            </Button>

            <Button size="sm" variant="ghost" onClick={() => shareMut.mutate()}>
              <Share2 className="mr-1 h-4 w-4" />
              Share
            </Button>
          </div>
        </div>

        {openComments && (
          <CommentSection
            postId={post.id}
            currentUserId={currentUserId}
            onRefresh={async () => qc.invalidateQueries({ queryKey: ["feed"] })}
          />
        )}
      </Card>
    </motion.div>
  );
}

function CommentSection({
  postId,
  currentUserId,
  onRefresh,
}: {
  postId: number;
  currentUserId?: number;
  onRefresh: () => Promise<void>;
}) {
  const [text, setText] = useState("");

  const commentsQuery = useQuery({
    queryKey: ["comments", postId],
    queryFn: () => fetchComments(postId),
  });

  const commentMut = useMutation({
    mutationFn: () => commentPost(postId, { content: text }),
    onSuccess: async () => {
      setText("");
      await commentsQuery.refetch();
      await onRefresh();
    },
  });

  const deleteMut = useMutation<void, Error, number>({
    mutationFn: (id: number) => deleteComment(postId, id),
    onSuccess: async () => {
      await commentsQuery.refetch();
      await onRefresh();
    },
  });

  const comments: CommentResponse[] = commentsQuery.data ?? [];

  return (
    <div className="mt-4 space-y-3 border-t pt-4">
      <div className="flex gap-2">
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Viết bình luận..."
        />
        <Button disabled={!text.trim()} onClick={() => commentMut.mutate()}>
          <Send className="h-4 w-4" />
        </Button>
      </div>

      {comments.map((c: any) => {
        const isMine = currentUserId === c.userId;

        return (
          <div key={c.id} className="border p-3 rounded-xl">
            <div className="flex justify-between">
              <div>
                <div className="font-medium">
                  {c.userFullName ?? `User #${c.userId}`}
                </div>
                <div className="text-sm">{c.content}</div>
              </div>

              {isMine && (
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => deleteMut.mutate(c.id)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              )}
            </div>
          </div>
        );
      })}

      {!comments.length && (
        <div className="text-sm text-center text-slate-500">
          Chưa có bình luận
        </div>
      )}
    </div>
  );
}

function CreatePostModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: () => void;
}) {
  const [content, setContent] = useState("");
  const [privacy, setPrivacy] = useState<Privacy>("PUBLIC");
  const [files, setFiles] = useState<File[]>([]);

  const mut = useMutation({
    mutationFn: () =>
      createPost({ content, privacy }, files.length ? files : undefined),
    onSuccess: onCreated,
  });

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg p-6">
        <div className="flex justify-between">
          <h2>Tạo bài viết</h2>
          <Button variant="ghost" onClick={onClose}>
            Đóng
          </Button>
        </div>

        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <select
          value={privacy}
          onChange={(e) => setPrivacy(e.target.value as Privacy)}
        >
          <option value="PUBLIC">PUBLIC</option>
          <option value="FRIENDS">FRIENDS</option>
          <option value="PRIVATE">PRIVATE</option>
        </select>

        <input
          type="file"
          multiple
          onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
        />

        <Button
          className="w-full mt-4"
          disabled={!content.trim()}
          onClick={() => mut.mutate()}
        >
          Đăng bài
        </Button>
      </Card>
    </div>
  );
}
