import { useMutation, useQuery } from "@tanstack/react-query";
import {
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
  Sparkles,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";
import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { aiReviewAttempt, myAttempts } from "@/api/quiz";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type {
  AiReviewResponse,
  AnswerResponse,
  AttemptResponse,
  FeedbackResponse,
} from "@/types/models";

//
// Helpers
//

function fmtDate(d?: string | null): string {
  if (!d) return "";
  try {
    return new Date(d).toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

//
// Score badge
//

function ScoreBadge({ percent }: { percent: number }) {
  if (percent >= 80)
    return (
      <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800 dark:bg-green-900/40 dark:text-green-300">
        Xuat sac
      </span>
    );
  if (percent >= 50)
    return (
      <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
        Dat yeu cau
      </span>
    );
  return (
    <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-800 dark:bg-red-900/40 dark:text-red-300">
      Chua dat
    </span>
  );
}

//
// Feedback bubble (nhan xet giao vien)
//

function FeedbackBubble({ fb }: { fb: FeedbackResponse }) {
  return (
    <div className="mt-2 rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 dark:border-blue-900/40 dark:bg-blue-950/40">
      <div className="mb-1 flex items-center gap-1.5 text-xs font-medium text-blue-700 dark:text-blue-300">
        <span>{fb.teacherName || "Giao vien"}</span>
        {fb.createdAt && (
          <>
            <span className="text-blue-300">·</span>
            <span className="font-normal text-blue-500">
              {fmtDate(fb.createdAt)}
            </span>
          </>
        )}
      </div>
      <p className="text-sm text-blue-800 dark:text-blue-200">{fb.content}</p>
    </div>
  );
}

//
// Answer card (chi tiet tung cau)
//

function AnswerCard({
  answer,
  index,
  feedbacks,
}: {
  answer: AnswerResponse & {
    isCorrect: boolean;
    pointsEarned: number;
    maxPoints: number;
  };
  index: number;
  feedbacks: FeedbackResponse[];
}) {
  const [open, setOpen] = useState(false);
  const isCorrect = answer.isCorrect ?? false;
  const hasExtra = !!(answer.explanation || feedbacks.length > 0);

  return (
    <div
      className={[
        "rounded-xl border bg-white px-4 py-3 dark:bg-slate-950",
        isCorrect
          ? "border-l-[3px] border-green-500 border-t-slate-100 border-r-slate-100 border-b-slate-100 dark:border-t-slate-800 dark:border-r-slate-800 dark:border-b-slate-800"
          : "border-l-[3px] border-red-500 border-t-slate-100 border-r-slate-100 border-b-slate-100 dark:border-t-slate-800 dark:border-r-slate-800 dark:border-b-slate-800",
      ].join(" ")}
    >
      {/* Header cau hoi */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2">
          {isCorrect ? (
            <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
          ) : (
            <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
          )}
          <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
            Cau {index}: {answer.questionText ?? `(ID: ${answer.questionId})`}
          </p>
        </div>
        <span
          className={[
            "shrink-0 rounded-full px-2 py-0.5 text-xs font-medium",
            isCorrect
              ? "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300"
              : "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
          ].join(" ")}
        >
          {answer.pointsEarned ?? 0}/{answer.maxPoints ?? 0}d
        </span>
      </div>

      {/* Cau tra loi da chon */}
      {answer.selectedOptionIndexes &&
        answer.selectedOptionIndexes.length > 0 && (
          <p className="mt-1.5 pl-6 text-xs text-slate-500">
            Da chon: {answer.selectedOptionIndexes.join(", ")}
          </p>
        )}
      {answer.textAnswer && (
        <p className="mt-1.5 pl-6 text-xs text-slate-500">
          Tra loi: {answer.textAnswer}
        </p>
      )}

      {/* Toggle giai thich + feedback */}
      {hasExtra && (
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="mt-2 flex items-center gap-1 pl-6 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
        >
          {open ? (
            <ChevronUp className="h-3 w-3" />
          ) : (
            <ChevronDown className="h-3 w-3" />
          )}
          {open
            ? "An bot"
            : `Xem giai thich${feedbacks.length > 0 ? ` + ${feedbacks.length} nhan xet GV` : ""}`}
        </button>
      )}

      {open && (
        <div className="mt-2 space-y-2 pl-6">
          {answer.explanation && (
            <div className="rounded-md border-l-2 border-slate-300 bg-slate-50 px-3 py-2 text-xs text-slate-600 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-400">
              {answer.explanation}
            </div>
          )}
          {feedbacks.map((fb) => (
            <FeedbackBubble key={fb.id} fb={fb} />
          ))}
        </div>
      )}
    </div>
  );
}

//
// AI Review panel
//

function AiReviewPanel({ data }: { data: AiReviewResponse }) {
  return (
    <Card className="space-y-4 p-5">
      <div className="flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-indigo-500" />
        <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
          Nhan xet tu AI
        </span>
      </div>

      {data.overallAnalysis && (
        <div>
          <p className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-400">
            Tong quan
          </p>
          <p className="text-sm text-slate-700 dark:text-slate-300">
            {data.overallAnalysis}
          </p>
        </div>
      )}

      {Array.isArray(data.weaknessAreas) && data.weaknessAreas.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-400">
            Diem can cai thien
          </p>
          <ul className="space-y-1">
            {data.weaknessAreas.map((w: string, i: number) => (
              <li
                key={i}
                className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300"
              >
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
                {w}
              </li>
            ))}
          </ul>
        </div>
      )}

      {Array.isArray(data.studyRoadmap) && data.studyRoadmap.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-400">
            Lo trinh on tap
          </p>
          <ol className="space-y-2">
            {data.studyRoadmap.map((s: string, i: number) => (
              <li
                key={i}
                className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300"
              >
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-medium text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">
                  {i + 1}
                </span>
                {s}
              </li>
            ))}
          </ol>
        </div>
      )}

      {Array.isArray(data.perQuestion) && data.perQuestion.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-400">
            Phan tich tung cau
          </p>
          <div className="space-y-3">
            {data.perQuestion?.map((pq, i) => {
              const questionIndex =
                typeof pq.questionIndex === "number" ? pq.questionIndex : i;
              const questionText =
                typeof pq.questionText === "string"
                  ? pq.questionText
                  : undefined;
              const analysis =
                typeof pq.analysis === "string" ? pq.analysis : undefined;
              const correctApproach =
                typeof pq.correctApproach === "string"
                  ? pq.correctApproach
                  : undefined;

              return (
                <div
                  key={i}
                  className="rounded-lg bg-slate-50 p-3 dark:bg-slate-900"
                >
                  <p className="mb-1 text-xs font-medium text-slate-700 dark:text-slate-300">
                    Cau {questionIndex + 1}
                    {questionText ? `: ${questionText}` : ""}
                  </p>
                  {analysis && (
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      {analysis}
                    </p>
                  )}
                  {correctApproach && (
                    <p className="mt-1 text-xs text-green-700 dark:text-green-400">
                      Cach lam dung: {correctApproach}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </Card>
  );
}

//
// Main page
//

export function QuizResultPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { quizId } = useParams<{ quizId: string }>();
  const qid = Number(quizId);

  // State truyen tu quiz-take-page sau khi nop bai
  const state = location.state as
    | {
        attempt?: AttemptResponse;
        quizTitle?: string;
        allowAiReview?: boolean;
      }
    | undefined;

  const freshAttempt = state?.attempt;
  const quizTitle = state?.quizTitle ?? "Quiz";
  const allowAiReview = state?.allowAiReview ?? false;

  // Load lich su toan bo lan lam
  const historyQ = useQuery({
    queryKey: ["my-attempts", qid],
    queryFn: () => myAttempts(qid),
    enabled: Number.isFinite(qid),
    staleTime: 0,
  });

  const allAttempts: AttemptResponse[] = historyQ.data ?? [];

  // Attempt dang xem: uu tien freshAttempt tu state, fallback lan cuoi cung
  const currentAttempt: AttemptResponse | undefined =
    freshAttempt ??
    (allAttempts.length > 0 ? allAttempts[allAttempts.length - 1] : undefined);

  const bestScore =
    allAttempts.length > 0
      ? Math.max(...allAttempts.map((a) => a.score ?? 0))
      : (currentAttempt?.score ?? 0);

  const usedAttempts = allAttempts.length || (freshAttempt ? 1 : 0);

  // AI review state
  const [aiData, setAiData] = useState<AiReviewResponse | null>(null);
  const [showAiConfirm, setShowAiConfirm] = useState(false);

  const aiMut = useMutation({
    mutationFn: () => aiReviewAttempt(currentAttempt!.attemptId),
    onSuccess: (data) => {
      setAiData(data);
      setShowAiConfirm(false);
    },
  });

  // ── Empty state ──
  if (!currentAttempt) {
    return (
      <Card className="mx-auto max-w-lg p-8 text-center">
        <p className="mb-4 text-slate-500">Khong co du lieu ket qua.</p>
        <Button type="button" onClick={() => navigate("/quiz")}>
          Ve danh sach quiz
        </Button>
      </Card>
    );
  }

  const answers: AnswerResponse[] = currentAttempt.answers ?? [];
  const feedbacks: FeedbackResponse[] = currentAttempt.feedbacks ?? [];
  const generalFeedbacks = feedbacks.filter((f) => !f.questionId);
  const correctCount = answers.filter((a) => a.isCorrect ?? false).length;
  const scorePercent = currentAttempt.scorePercent ?? 0;

  return (
    <div className="mx-auto max-w-2xl space-y-4 pb-12">
      {/* ══ 1. HEADER + DIEM ══ */}
      <Card className="p-5">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-xl font-medium text-slate-900 dark:text-slate-100">
              {quizTitle}
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Lan lam thu {currentAttempt.attemptNumber}
              {currentAttempt.submittedAt
                ? ` · Nop luc ${fmtDate(currentAttempt.submittedAt)}`
                : ""}
            </p>
          </div>
          <ScoreBadge percent={scorePercent} />
        </div>

        {/* Metric cards */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            {
              label: "Diem lan nay",
              value: currentAttempt.score?.toFixed(1) ?? "0",
              color:
                scorePercent >= 50
                  ? "text-green-700 dark:text-green-400"
                  : "text-red-600 dark:text-red-400",
            },
            {
              label: "Diem tot nhat",
              value: bestScore.toFixed(1),
              color: "text-slate-900 dark:text-slate-100",
            },
            {
              label: "Ti le dung",
              value: `${scorePercent.toFixed(0)}%`,
              color: "text-slate-900 dark:text-slate-100",
            },
            {
              label: "Da dung / Tong luot",
              value: `${usedAttempts} lan`,
              color: "text-slate-900 dark:text-slate-100",
            },
          ].map((m) => (
            <div
              key={m.label}
              className="rounded-lg bg-slate-50 p-3 text-center dark:bg-slate-900"
            >
              <p className="text-xs text-slate-500">{m.label}</p>
              <p className={`mt-1 text-xl font-medium ${m.color}`}>{m.value}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* ══ 2. LAM LAI / VE DANH SACH ══ */}
      <Card className="flex flex-wrap items-center justify-between gap-3 p-4">
        <div>
          {currentAttempt.canRetake ? (
            <>
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                Ban con luot lam lai
              </p>
              <p className="text-xs text-slate-500">
                Diem tot nhat se duoc luu lai
              </p>
            </>
          ) : (
            <>
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                Da het luot lam bai
              </p>
              <p className="text-xs text-slate-500">
                {currentAttempt.aiReview
                  ? "Da dung AI Review — khong the lam lai"
                  : "Da dat toi da so lan lam"}
              </p>
            </>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => navigate("/quiz")}
          >
            Ve danh sach
          </Button>
          {currentAttempt.canRetake && (
            <Button
              type="button"
              size="sm"
              onClick={() => navigate(`/quiz/${qid}/take`)}
            >
              <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
              Lam lai
            </Button>
          )}
        </div>
      </Card>

      {/* ══ 3. AI REVIEW ══ */}
      {allowAiReview && !currentAttempt.aiReview && !aiData && (
        <Card className="p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="space-y-1">
              <p className="flex items-center gap-1.5 text-sm font-medium text-slate-900 dark:text-slate-100">
                <Sparkles className="h-4 w-4 text-indigo-500" />
                AI Review
              </p>
              <p className="max-w-sm text-xs text-slate-500">
                Phan tich diem yeu va lo trinh on tap ca nhan.
              </p>
              {currentAttempt.canRetake && (
                <p className="flex items-center gap-1 text-xs font-medium text-red-600 dark:text-red-400">
                  <AlertTriangle className="h-3 w-3" />
                  Su dung AI Review se khoa luot lam lai con lai.
                </p>
              )}
            </div>

            {!showAiConfirm ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  currentAttempt.canRetake
                    ? setShowAiConfirm(true)
                    : aiMut.mutate()
                }
              >
                <Sparkles className="mr-1.5 h-3.5 w-3.5" />
                Yeu cau AI Review
              </Button>
            ) : (
              <div className="flex flex-col items-end gap-2">
                <p className="text-xs font-medium text-red-600">
                  Xac nhan? Ban se khong the lam lai sau khi dung.
                </p>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAiConfirm(false)}
                  >
                    Huy
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    disabled={aiMut.isPending}
                    onClick={() => aiMut.mutate()}
                  >
                    {aiMut.isPending ? "Dang xu ly..." : "Xac nhan"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Da dung AI Review truoc do — cho xem lai */}
      {currentAttempt.aiReview && !aiData && (
        <Card className="p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="flex items-center gap-1.5 text-sm text-slate-500">
              <Sparkles className="h-4 w-4 text-indigo-400" />
              Da dung AI Review cho lan lam nay.
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={aiMut.isPending}
              onClick={() => aiMut.mutate()}
            >
              {aiMut.isPending ? "Dang tai..." : "Xem lai nhan xet"}
            </Button>
          </div>
        </Card>
      )}

      {/* Hien thi ket qua AI */}
      {aiData && <AiReviewPanel data={aiData} />}

      {/* ══ 4. NHAN XET CHUNG GIAO VIEN ══ */}
      {generalFeedbacks.length > 0 && (
        <Card className="space-y-3 p-5">
          <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
            Nhan xet chung tu giao vien
          </p>
          {generalFeedbacks.map((fb) => (
            <FeedbackBubble key={fb.id} fb={fb} />
          ))}
        </Card>
      )}

      {/* ══ 5. CHI TIET BAI LAM ══ */}
      <Card className="space-y-3 p-5">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
            Chi tiet bai lam
          </p>
          <span className="text-xs text-slate-400">
            {correctCount}/{answers.length} cau dung
          </span>
        </div>

        {answers.length === 0 ? (
          <p className="text-sm text-slate-400">
            Khong co du lieu cau tra loi.
          </p>
        ) : (
          <div className="space-y-2">
            {answers.map((a, i) => (
              <AnswerCard
                key={a.questionId ?? i}
                answer={{
                  ...a,
                  isCorrect: a.isCorrect ?? false, // vẫn giữ fallback khi render
                  pointsEarned: a.pointsEarned ?? 0,
                  maxPoints: a.maxPoints ?? 0,
                }}
                index={i + 1}
                feedbacks={feedbacks.filter(
                  (f) => f.questionId === a.questionId,
                )}
              />
            ))}
          </div>
        )}
      </Card>

      {/* ══ 6. LICH SU CAC LAN LAM ══ */}
      {allAttempts.length > 1 && (
        <Card className="p-5">
          <p className="mb-3 text-sm font-medium text-slate-900 dark:text-slate-100">
            Lich su cac lan lam
          </p>
          <div className="space-y-2">
            {[...allAttempts].reverse().map((a) => {
              const isCurrent = a.attemptId === currentAttempt.attemptId;
              const isBest = a.score === bestScore;
              return (
                <div
                  key={a.attemptId}
                  className={[
                    "flex items-center justify-between rounded-lg px-3 py-2 text-sm",
                    isCurrent
                      ? "bg-indigo-50 dark:bg-indigo-950/40"
                      : "bg-slate-50 dark:bg-slate-900",
                  ].join(" ")}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">
                      Lan {a.attemptNumber}
                    </span>
                    {isCurrent && (
                      <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">
                        Vua lam
                      </span>
                    )}
                    {isBest && allAttempts.length > 1 && (
                      <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700 dark:bg-green-900/40 dark:text-green-300">
                        Tot nhat
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-slate-900 dark:text-slate-100">
                      {(a.score ?? 0).toFixed(1)}d (
                      {(a.scorePercent ?? 0).toFixed(0)}%)
                    </span>
                    <span className="text-xs text-slate-400">
                      {fmtDate(a.submittedAt)}
                    </span>
                    {!isCurrent && (
                      <button
                        type="button"
                        className="text-xs text-indigo-600 hover:underline dark:text-indigo-400"
                        onClick={() =>
                          navigate(`/quiz/${qid}/result`, {
                            state: {
                              attempt: a,
                              quizTitle,
                              allowAiReview,
                            },
                          })
                        }
                      >
                        Xem
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
}
