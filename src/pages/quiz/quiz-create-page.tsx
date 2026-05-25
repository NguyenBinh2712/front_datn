import { useMutation } from "@tanstack/react-query";
import { Plus, Trash2 } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { createQuizTeacher, type QuizCreatePayload } from "@/api/quiz";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type QuizCreateFormValues = Omit<QuizCreatePayload, "groupId"> & {
  groupId?: string;
};

export function QuizCreatePage() {
  const navigate = useNavigate();
  const { control, register, handleSubmit } = useForm<QuizCreateFormValues>({
    defaultValues: {
      title: "",
      description: "",
      time: 15,
      maxAttempt: 3,
      allowAiReview: false,
      groupId: "",
      questions: [
        {
          questionText: "2 + 2 = ?",
          type: "SINGLE_CHOICE",
          point: 1,
          order: 1,
          options: [
            { text: "3", isCorrect: false },
            { text: "4", isCorrect: true },
          ],
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "questions",
  });

  const mut = useMutation({
    mutationFn: (body: QuizCreatePayload) => createQuizTeacher(body),
    onSuccess: (q) => navigate(`/quiz/${q.id}/submissions`),
  });

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="text-2xl font-semibold">Tạo quiz (Teacher)</h1>
      <form
        className="space-y-4"
        onSubmit={handleSubmit((raw: QuizCreateFormValues) => {
          const gidRaw = raw.groupId;
          const gid =
            gidRaw === "" || gidRaw === undefined || gidRaw === null
              ? null
              : Number(gidRaw);
          const payload: QuizCreatePayload = {
            ...raw,
            groupId: gid !== null && Number.isFinite(gid) ? gid : null,
            questions: raw.questions.map((q, idx) => ({
              questionText: q.questionText,
              type: q.type,
              point: q.point,
              order: idx + 1,
              explanation: q.explanation,
              options: (q.options ?? [])
                .filter((o) => o?.text?.trim())
                .map((o) => ({
                  text: o.text!.trim(),
                  isCorrect: !!o.isCorrect,
                })),
            })),
          };
          mut.mutate(payload);
        })}
      >
        <Card className="space-y-3">
          <Input
            placeholder="Tiêu đề"
            {...register("title", { required: true })}
          />
          <Textarea placeholder="Mô tả" {...register("description")} />
          <div className="grid gap-3 sm:grid-cols-3">
            <label className="text-sm">
              Thời gian (phút)
              <Input
                type="number"
                {...register("time", { valueAsNumber: true })}
              />
            </label>
            <label className="text-sm">
              Max attempt
              <Input
                type="number"
                {...register("maxAttempt", { valueAsNumber: true })}
              />
            </label>
            <label className="flex items-center gap-2 pt-6 text-sm">
              <input type="checkbox" {...register("allowAiReview")} />
              Cho phép AI review
            </label>
          </div>
          <label className="text-sm">
            Group ID (tuỳ chọn — quiz gắn nhóm)
            <Input
              {...register("groupId")}
              placeholder="Để trống = quiz public pending"
            />
          </label>
        </Card>

        {fields.map((field, qi) => (
          <Card key={field.id} className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-medium">Câu {qi + 1}</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => remove(qi)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <Input
              placeholder="Nội dung câu hỏi"
              {...register(`questions.${qi}.questionText` as const)}
            />
            <label className="text-sm">
              Loại
              <select
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-2 py-2 dark:border-slate-700 dark:bg-slate-950"
                {...register(`questions.${qi}.type` as const)}
              >
                <option value="SINGLE_CHOICE">SINGLE_CHOICE</option>
                <option value="MULTIPLE_CHOICE">MULTIPLE_CHOICE</option>
                <option value="TRUE_FALSE">TRUE_FALSE</option>
                <option value="SHORT_TEXT">SHORT_TEXT</option>
              </select>
            </label>
            <label className="text-sm">
              Điểm
              <Input
                type="number"
                {...register(`questions.${qi}.point`, { valueAsNumber: true })}
              />
            </label>
            <label className="text-sm">
              Thứ tự
              <Input
                type="number"
                {...register(`questions.${qi}.order`, { valueAsNumber: true })}
              />
            </label>
            <div className="space-y-2">
              <div className="text-sm font-medium">Đáp án</div>
              {[0, 1, 2, 3].map((oi) => (
                <div key={oi} className="flex gap-2">
                  <Input
                    placeholder={`Lựa chọn ${oi + 1}`}
                    {...register(`questions.${qi}.options.${oi}.text` as const)}
                  />
                  <label className="flex items-center gap-1 whitespace-nowrap text-xs">
                    <input
                      type="checkbox"
                      {...register(
                        `questions.${qi}.options.${oi}.isCorrect` as const,
                      )}
                    />
                    đúng
                  </label>
                </div>
              ))}
            </div>
          </Card>
        ))}

        <Button
          type="button"
          variant="outline"
          onClick={() =>
            append({
              questionText: "",
              type: "SINGLE_CHOICE",
              point: 1,
              order: fields.length + 1,
              options: [
                { text: "", isCorrect: true },
                { text: "", isCorrect: false },
              ],
            })
          }
        >
          <Plus className="mr-2 h-4 w-4" />
          Thêm câu
        </Button>

        <Button type="submit" disabled={mut.isPending}>
          {mut.isPending ? "Đang tạo quiz…" : "Tạo quiz"}
        </Button>
      </form>
    </div>
  );
}
