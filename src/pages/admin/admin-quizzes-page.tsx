import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { adminReviewQuiz, pendingQuizzes } from "@/api/quiz";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export function AdminQuizzesPage() {
  const qc = useQueryClient();
  const [notes, setNotes] = useState<Record<number, string>>({});

  const q = useQuery({
    queryKey: ["admin-pending-quizzes"],
    queryFn: () => pendingQuizzes(0, 50),
  });

  const review = useMutation({
    mutationFn: ({
      id,
      ok,
      note,
    }: {
      id: number;
      ok: boolean;
      note?: string;
    }) => adminReviewQuiz(id, ok, note),
    onSuccess: () =>
      void qc.invalidateQueries({ queryKey: ["admin-pending-quizzes"] }),
    onError: () => alert("Thao tác thất bại, vui lòng thử lại."),
  });

  const handleReview = (id: number, ok: boolean) => {
    const note = notes[id]?.trim();
    if (!ok && !note) {
      alert("Vui lòng nhập lý do từ chối.");
      return;
    }
    review.mutate({ id, ok, note });
  };

  const quizzes = q.data?.content ?? [];

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Quiz chờ duyệt</h1>
            <p className="mt-1 text-sm text-slate-500">
              Duyệt hoặc từ chối quiz do giáo viên gửi lên.
            </p>
          </div>
          <div className="rounded-full bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-800 dark:bg-amber-900/40 dark:text-amber-200">
            {quizzes.length} quiz đang chờ
          </div>
        </div>
      </div>

      {/* Loading */}
      {q.isLoading && (
        <div className="flex justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
        </div>
      )}

      {/* Quiz cards */}
      {quizzes.map((quiz) => (
        <Card key={quiz.id} className="space-y-4 p-5">
          <div>
            <div className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              {quiz.title}
            </div>
            <div className="mt-1 flex flex-wrap gap-3 text-sm text-slate-500">
              <span>Tạo bởi: {quiz.creatorName}</span>
              <span>·</span>
              <span>{quiz.time} phút</span>
              <span>·</span>
              <span>Tối đa {quiz.maxAttempts} lần làm</span>
              {quiz.startAt && (
                <>
                  <span>·</span>
                  <span>
                    Từ:{" "}
                    {new Date(
                      quiz.startAt as unknown as string,
                    ).toLocaleDateString("vi-VN")}
                  </span>
                </>
              )}
              {quiz.endAt && (
                <>
                  <span>·</span>
                  <span>
                    Đến:{" "}
                    {new Date(
                      quiz.endAt as unknown as string,
                    ).toLocaleDateString("vi-VN")}
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="border-t border-slate-100 pt-3 dark:border-slate-800">
            <label className="mb-1 block text-xs text-slate-500">
              Ghi chú cho giáo viên{" "}
              <span className="text-slate-400">(bắt buộc khi từ chối)</span>
            </label>
            <textarea
              className="w-full resize-none rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              rows={2}
              placeholder="Nhập lý do duyệt hoặc từ chối..."
              value={notes[quiz.id] ?? ""}
              onChange={(e) =>
                setNotes((prev) => ({ ...prev, [quiz.id]: e.target.value }))
              }
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              size="sm"
              disabled={review.isPending}
              onClick={() => handleReview(quiz.id, true)}
            >
              {review.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "✓ Duyệt"
              )}
            </Button>
            <Button
              type="button"
              size="sm"
              variant="danger"
              disabled={review.isPending}
              onClick={() => handleReview(quiz.id, false)}
            >
              ✕ Từ chối
            </Button>
          </div>
        </Card>
      ))}

      {/* Empty */}
      {!q.isLoading && quizzes.length === 0 && (
        <Card className="p-6 text-center text-slate-500">
          Không có quiz nào đang chờ duyệt.
        </Card>
      )}
    </div>
  );
}
