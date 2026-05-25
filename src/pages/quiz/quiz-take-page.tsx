import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { startQuiz, submitAttempt } from "@/api/quiz";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { parseJavaTime } from "@/lib/java-time";
import type {
  AnswerRequest,
  QuestionResponse,
  QuizDetailResponse,
  QuizStartResult,
} from "@/types/models";

export function QuizTakePage() {
  const { quizId } = useParams<{ quizId: string }>();
  const qid = Number(quizId);
  const navigate = useNavigate();
  const location = useLocation();

  const initial = location.state as QuizStartResult | undefined;

  const [session, setSession] = useState<QuizStartResult | null>(
    initial ?? null
  );
  const [deadlineMs, setDeadlineMs] = useState<number>(() =>
    initial?.serverDeadline != null
      ? parseJavaTime(initial.serverDeadline as unknown as string)
      : 0
  );
  const [now, setNow] = useState(Date.now());

  const bootstrap = useMutation({
    mutationFn: () => startQuiz(qid),
    onSuccess: (data) => {
      setSession(data);
      setDeadlineMs(
        parseJavaTime(data.serverDeadline as unknown as string)
      );
    },
  });

  useEffect(() => {
    if (!initial && Number.isFinite(qid)) bootstrap.mutate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initial, qid]);

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const quiz: QuizDetailResponse | undefined = session?.quiz;
  const attemptId = session?.attemptId;

  const [answers, setAnswers] = useState<Record<string, AnswerRequest>>({});

  useEffect(() => {
    if (!quiz) return;
    const init: Record<string, AnswerRequest> = {};
    quiz.questions.forEach((q) => {
      init[q.id] = {
        questionId: q.id,
        selectedOptionIndexes: [],
        textAnswer: "",
      };
    });
    setAnswers(init);
  }, [quiz]);

  const submit = useMutation({
    mutationFn: () =>
      submitAttempt(
        attemptId as number,
        Object.values(answers).filter(Boolean) as AnswerRequest[]
      ),
    onSuccess: (att) =>
      // ← Truyen allowAiReview va quizTitle vao state de QuizResultPage dung
      navigate(`/quiz/${qid}/result`, {
        replace: true,
        state: {
          attempt: att,
          quizTitle: quiz?.title ?? "Quiz",
          allowAiReview: quiz?.allowAiReview ?? false,
        },
      }),
  });

  if (!Number.isFinite(qid)) return <p>Sai quiz ID.</p>;
  if (bootstrap.isPending && !session) return <p>Dang khoi tao...</p>;
  if (!quiz || !attemptId)
    return (
      <p>
        Khong the mo de — co the dang co bai lam do hoac het luot.
      </p>
    );

  const remainSec = Math.max(
    0,
    Math.floor((deadlineMs - now) / 1000)
  );

  // Tu dong nop khi het gio
  useEffect(() => {
    if (remainSec === 0 && !submit.isPending && !submit.isSuccess) {
      submit.mutate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remainSec]);

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">{quiz.title}</h1>
          {quiz.description && (
            <p className="text-sm text-slate-500">{quiz.description}</p>
          )}
        </div>
        <Card className="px-4 py-2 text-center">
          <div className="text-xs text-slate-500">Thoi gian</div>
          <div
            className={`font-mono text-lg ${
              remainSec < 60 ? "text-red-600" : ""
            }`}
          >
            {Math.floor(remainSec / 60)}:
            {String(remainSec % 60).padStart(2, "0")}
          </div>
        </Card>
      </div>

      {/* Questions */}
      {quiz.questions.map((question, idx) => (
        <QuestionCard
          key={question.id}
          index={idx + 1}
          question={question}
          value={answers[question.id]}
          onChange={(next) =>
            setAnswers((prev) => ({ ...prev, [question.id]: next }))
          }
        />
      ))}

      {/* Submit */}
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          disabled={submit.isPending || remainSec <= 0}
          onClick={() => submit.mutate()}
        >
          {submit.isPending ? "Dang nop..." : "Nop bai"}
        </Button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Question card
// ─────────────────────────────────────────────────────────────

function QuestionCard({
  index,
  question,
  value,
  onChange,
}: {
  index: number;
  question: QuestionResponse;
  value: AnswerRequest | undefined;
  onChange: (v: AnswerRequest) => void;
}) {
  const opts = question.options ?? [];

  function toggleIdx(i: number, multi: boolean) {
    const cur = value?.selectedOptionIndexes ?? [];
    let next: number[];
    if (multi) {
      next = cur.includes(i) ? cur.filter((x) => x !== i) : [...cur, i];
    } else {
      next = cur[0] === i ? [] : [i];
    }
    onChange({
      questionId: question.id,
      selectedOptionIndexes: next,
      textAnswer: value?.textAnswer,
    });
  }

  return (
    <Card className="space-y-3 p-4">
      <div className="text-sm font-medium">
        Cau {index}: {question.questionText}{" "}
        <span className="text-xs text-slate-500">({question.type})</span>
      </div>

      {question.type === "SHORT_TEXT" ? (
        <Input
          value={value?.textAnswer ?? ""}
          onChange={(e) =>
            onChange({
              questionId: question.id,
              selectedOptionIndexes: [],
              textAnswer: e.target.value,
            })
          }
          placeholder="Nhap cau tra loi..."
        />
      ) : (
        <div className="space-y-2">
          {opts.map((o, i) => (
            <label
              key={i}
              className="flex cursor-pointer items-start gap-2 text-sm"
            >
              <input
                type={
                  question.type === "MULTIPLE_CHOICE" ? "checkbox" : "radio"
                }
                name={question.id}
                checked={(value?.selectedOptionIndexes ?? []).includes(i)}
                onChange={() =>
                  toggleIdx(i, question.type === "MULTIPLE_CHOICE")
                }
                className="mt-0.5"
              />
              <span>{o.text}</span>
            </label>
          ))}
        </div>
      )}
    </Card>
  );
}