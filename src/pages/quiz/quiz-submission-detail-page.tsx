import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { submissionDetail, teacherFeedback } from '@/api/quiz'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'

export function QuizSubmissionDetailPage() {
  const { attemptId } = useParams()
  const id = Number(attemptId)
  const qc = useQueryClient()

  const q = useQuery({
    queryKey: ['submission', id],
    queryFn: () => submissionDetail(id),
    enabled: Number.isFinite(id),
  })

  const fb = useMutation({
    mutationFn: (body: { questionId?: string | null; content: string }) =>
      teacherFeedback(id, body),
    onSuccess: () => void qc.invalidateQueries({ queryKey: ['submission', id] }),
  })

  if (!Number.isFinite(id)) return null

  const att = q.data

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <h1 className="text-xl font-semibold">Chi tiết attempt #{id}</h1>
      {q.isLoading ? <p>Đang tải…</p> : null}
      {att ? (
        <>
          <Card className="space-y-2 p-4 text-sm">
            <div>
              HS: <b>{att.studentName}</b>
            </div>
            <div>Điểm: {att.score ?? '-'} · %: {att.scorePercent ?? '-'}</div>
          </Card>

          {(att.answers ?? []).map((a) => (
            <Card key={a.questionId} className="space-y-2 p-4">
              <div className="font-medium">{a.questionText}</div>
              <div className="text-xs text-slate-500">
                Đúng: {String(a.isCorrect)} · {a.pointsEarned}/{a.maxPoints}
              </div>
              <FeedbackInline
                attemptId={id}
                questionId={a.questionId}
                onSend={(content) => fb.mutate({ questionId: a.questionId, content })}
                pending={fb.isPending}
              />
            </Card>
          ))}

          <Card className="space-y-2 p-4">
            <div className="font-medium">Nhận xét chung</div>
            <FeedbackInline
              attemptId={id}
              questionId={null}
              onSend={(content) => fb.mutate({ questionId: null, content })}
              pending={fb.isPending}
            />
          </Card>

          <div className="text-xs text-slate-500">
            Đã có feedback: {(att.feedbacks ?? []).length}
          </div>
        </>
      ) : null}
    </div>
  )
}

function FeedbackInline({
  questionId,
  onSend,
  pending,
}: {
  attemptId: number
  questionId: string | null
  onSend: (c: string) => void
  pending: boolean
}) {
  const [text, setText] = useState('')
  return (
    <div className="space-y-2">
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={questionId ? 'Nhận xét theo câu…' : 'Nhận xét tổng thể…'}
      />
      <Button
        type="button"
        size="sm"
        disabled={!text.trim() || pending}
        onClick={() => {
          onSend(text.trim())
          setText('')
        }}
      >
        Gửi feedback
      </Button>
    </div>
  )
}
