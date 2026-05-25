import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import { BookOpen, CheckCircle, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { fetchPublicQuizzes, myAttempts, startQuiz } from "@/api/quiz";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuthStore } from "@/stores/auth-store";
import type { QuizResponse } from "@/types/models";
import { useState } from "react";

const SIZE = 10;

// Decode JWT — ho tro scope: "TEACHER STUDENT"
function getRoles(token: string | null): string[] {
  if (!token) return [];
  try {
    const payload = JSON.parse(atob(token.split(".")[1])) as Record<
      string,
      unknown
    >;
    const raw = payload.scope ?? payload.roles ?? payload.authorities ?? "";
    if (typeof raw === "string") {
      return raw
        .split(/[\s,]+/)
        .filter(Boolean)
        .map((r) => r.replace(/^ROLE_/, "").replace(/^SCOPE_/, ""));
    }
    if (Array.isArray(raw)) {
      return raw
        .map((r: unknown) =>
          String(r)
            .replace(/^ROLE_/, "")
            .replace(/^SCOPE_/, ""),
        )
        .filter(Boolean);
    }
    return [];
  } catch {
    return [];
  }
}

// Status badge

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    ACTIVE: {
      label: "Dang mo",
      cls: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
    },
    PENDING: {
      label: "Cho duyet",
      cls: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
    },
    REJECTED: {
      label: "Tu choi",
      cls: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
    },
    GROUP: {
      label: "Nhom",
      cls: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
    },
  };
  const cfg = map[status] ?? {
    label: status,
    cls: "bg-slate-100 text-slate-500",
  };
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${cfg.cls}`}>
      {cfg.label}
    </span>
  );
}

//
// Quiz progress: diem tot nhat + luot con lai
//

function QuizProgress({
  quizId,
  maxAttempts,
}: {
  quizId: number;
  maxAttempts: number;
}) {
  const q = useQuery({
    queryKey: ["my-attempts", quizId],
    queryFn: () => myAttempts(quizId),
    staleTime: 30_000,
  });

  const attempts = q.data ?? [];
  if (q.isLoading) return null;
  if (attempts.length === 0) return null;

  const best = Math.max(...attempts.map((a) => a.score ?? 0));
  const bestPct = Math.max(...attempts.map((a) => a.scorePercent ?? 0));
  const remaining = maxAttempts - attempts.length;
  const locked =
    (attempts[attempts.length - 1]?.aiReview ?? false) || remaining <= 0;

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-lg bg-slate-50 px-3 py-2 text-xs dark:bg-slate-900">
      <span className="flex items-center gap-1 text-green-700 dark:text-green-400">
        <CheckCircle className="h-3.5 w-3.5" />
        Diem tot nhat:{" "}
        <b>
          {best.toFixed(1)} ({bestPct.toFixed(0)}%)
        </b>
      </span>
      <span className="text-slate-300 dark:text-slate-600">·</span>
      <span
        className={locked ? "text-red-500 dark:text-red-400" : "text-slate-500"}
      >
        {locked ? "Het luot / khoa AI Review" : `Con ${remaining} luot lam lai`}
      </span>
    </div>
  );
}

//
// Quiz card
//

function QuizCard({
  quiz,
  activeRole,
}: {
  quiz: QuizResponse;
  activeRole: "TEACHER" | "STUDENT";
}) {
  const navigate = useNavigate();
  const isTeacher = activeRole === "TEACHER";
  const canTake = activeRole === "STUDENT" && quiz.status === "ACTIVE";

  const start = useMutation({
    mutationFn: () => startQuiz(quiz.id),
    onSuccess: (res) => navigate(`/quiz/${quiz.id}/take`, { state: res }),
    // loi da duoc xu ly boi http interceptor (toast)
  });

  return (
    <Card className="flex flex-col gap-3 p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        {/* Icon + info */}
        <div className="flex gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white">
            <BookOpen className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-medium text-slate-900 dark:text-slate-100">
                {quiz.title}
              </span>
              <StatusBadge status={quiz.status} />
            </div>
            <div className="text-xs text-slate-500">
              {quiz.creatorName} · {quiz.time} phut · toi da {quiz.maxAttempts}{" "}
              lan
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap gap-2">
          {isTeacher && (
            <Link to={`/quiz/${quiz.id}/submissions`}>
              <Button type="button" size="sm" variant="outline">
                Bai nop
              </Button>
            </Link>
          )}

          {canTake && (
            <Button
              type="button"
              size="sm"
              disabled={start.isPending}
              onClick={() => start.mutate()}
            >
              {start.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Lam bai"
              )}
            </Button>
          )}

          {/* Quiz chua active */}
          {activeRole === "STUDENT" && quiz.status !== "ACTIVE" && (
            <Button type="button" size="sm" variant="ghost" disabled>
              {quiz.status === "PENDING" ? "Cho duyet" : "Chua mo"}
            </Button>
          )}
        </div>
      </div>

      {/* Progress bar — chi show khi STUDENT va quiz dang mo */}
      {canTake && (
        <QuizProgress quizId={quiz.id} maxAttempts={quiz.maxAttempts ?? 0} />
      )}
    </Card>
  );
}

//
// Main page
//

export function QuizListPage() {
  const token = useAuthStore((s) => s.token);
  const roles = getRoles(token);

  const isTeacher = roles.includes("TEACHER");
  const isStudent = roles.includes("STUDENT");
  const hasBothRoles = isTeacher && isStudent;

  // Neu co ca 2 role, mac dinh STUDENT de co the lam bai
  const [activeRole, setActiveRole] = useState<"TEACHER" | "STUDENT">(
    isStudent ? "STUDENT" : "TEACHER",
  );

  const q = useInfiniteQuery({
    queryKey: ["quizzes-public"],
    initialPageParam: 0,
    queryFn: ({ pageParam }) => fetchPublicQuizzes(pageParam as number, SIZE),
    getNextPageParam: (last, _p, param) =>
      last.last ? undefined : (param as number) + 1,
  });

  const rows = q.data?.pages.flatMap((p) => p.content) ?? [];

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Quiz</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Kham pha va luyen tap kien thuc truc tuyen.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Role switcher — chi hien khi co ca 2 role */}
          {hasBothRoles && (
            <div className="flex rounded-lg border border-slate-200 p-0.5 dark:border-slate-700">
              <button
                type="button"
                onClick={() => setActiveRole("STUDENT")}
                className={[
                  "rounded-md px-3 py-1 text-xs font-medium transition-colors",
                  activeRole === "STUDENT"
                    ? "bg-indigo-600 text-white"
                    : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-100",
                ].join(" ")}
              >
                Hoc sinh
              </button>
              <button
                type="button"
                onClick={() => setActiveRole("TEACHER")}
                className={[
                  "rounded-md px-3 py-1 text-xs font-medium transition-colors",
                  activeRole === "TEACHER"
                    ? "bg-indigo-600 text-white"
                    : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-100",
                ].join(" ")}
              >
                Giao vien
              </button>
            </div>
          )}

          {/* Teacher buttons */}
          {isTeacher && activeRole === "TEACHER" && (
            <>
              <Link to="/quiz/my">
                <Button type="button" variant="outline" size="sm">
                  Quiz cua toi
                </Button>
              </Link>
              <Link to="/quiz/create">
                <Button type="button" size="sm">
                  Tao quiz moi
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Loading */}
      {q.isLoading && (
        <div className="flex justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
        </div>
      )}

      {/* Quiz list */}
      {rows.map((quiz) => (
        <QuizCard key={quiz.id} quiz={quiz} activeRole={activeRole} />
      ))}

      {/* Empty */}
      {!q.isLoading && rows.length === 0 && (
        <Card className="p-6 text-center text-slate-500">
          Chua co quiz nao.
        </Card>
      )}

      {/* Load more */}
      {q.hasNextPage && (
        <Button
          type="button"
          variant="outline"
          className="w-full"
          disabled={q.isFetchingNextPage}
          onClick={() => void q.fetchNextPage()}
        >
          {q.isFetchingNextPage ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : null}
          Tai them
        </Button>
      )}
    </div>
  );
}
