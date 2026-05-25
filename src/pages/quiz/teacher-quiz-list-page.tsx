import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BookOpen, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { activateGroupQuiz, fetchMyQuizzes } from "@/api/quiz";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; className: string }> = {
    ACTIVE: { label: "Đang mở", className: "bg-green-100 text-green-800" },
    PENDING: { label: "Chờ admin", className: "bg-amber-100 text-amber-800" },
    REJECTED: { label: "Bị từ chối", className: "bg-red-100 text-red-800" },
    GROUP: { label: "Chờ kích hoạt", className: "bg-blue-100 text-blue-800" },
  };
  const cfg = map[status] ?? {
    label: status,
    className: "bg-slate-100 text-slate-600",
  };
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-xs font-medium ${cfg.className}`}
    >
      {cfg.label}
    </span>
  );
}

export function TeacherQuizListPage() {
  const qc = useQueryClient();

  const q = useQuery({
    queryKey: ["my-quizzes"],
    queryFn: fetchMyQuizzes,
  });

  const activate = useMutation({
    mutationFn: (id: number) => activateGroupQuiz(id),
    onSuccess: () => void qc.invalidateQueries({ queryKey: ["my-quizzes"] }),
    onError: () => alert("Không thể kích hoạt quiz."),
  });

  const quizzes = q.data ?? [];

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Quiz của tôi</h1>
          <p className="text-sm text-slate-500">
            Quản lý tất cả quiz bạn đã tạo.
          </p>
        </div>
        <Link to="/quiz/create">
          <Button type="button" size="sm">
            Tạo quiz mới
          </Button>
        </Link>
      </div>

      {q.isLoading && (
        <div className="flex justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
        </div>
      )}

      {quizzes.map((quiz) => (
        <Card
          key={quiz.id}
          className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white">
              <BookOpen className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold">{quiz.title}</span>
                <StatusBadge status={quiz.status as string} />
              </div>
              <div className="text-xs text-slate-500">
                {quiz.time} phút · tối đa {quiz.maxAttempts} lần
              </div>
              {/* Hiện note từ admin nếu bị từ chối */}
              {quiz.status === "REJECTED" &&
                (quiz as { note?: string }).note && (
                  <div className="rounded-lg bg-red-50 px-2 py-1 text-xs text-red-700 dark:bg-red-950 dark:text-red-300">
                    Lý do: {(quiz as { note?: string }).note}
                  </div>
                )}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {/* Quiz nhóm chưa active → cho activate */}
            {quiz.status === "GROUP" && (
              <Button
                type="button"
                size="sm"
                disabled={activate.isPending}
                onClick={() => activate.mutate(quiz.id)}
              >
                {activate.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Kích hoạt"
                )}
              </Button>
            )}

            <Link to={`/quiz/${quiz.id}/submissions`}>
              <Button type="button" size="sm" variant="outline">
                Bài nộp
              </Button>
            </Link>

            {/* Chỉ cho sửa khi chưa ACTIVE */}
            {quiz.status !== "ACTIVE" && (
              <Link to={`/quiz/${quiz.id}/edit`}>
                <Button type="button" size="sm" variant="ghost">
                  Sửa
                </Button>
              </Link>
            )}
          </div>
        </Card>
      ))}

      {!q.isLoading && quizzes.length === 0 && (
        <Card className="p-6 text-center text-slate-500">
          Bạn chưa tạo quiz nào.
        </Card>
      )}
    </div>
  );
}
