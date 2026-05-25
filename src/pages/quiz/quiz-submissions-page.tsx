import { useQuery } from '@tanstack/react-query'
import { Link, useParams } from 'react-router-dom'
import { teacherSubmissions } from '@/api/quiz'
import { Card } from '@/components/ui/card'

export function QuizSubmissionsPage() {
  const { quizId } = useParams()
  const qid = Number(quizId)

  const q = useQuery({
    queryKey: ['submissions', qid],
    queryFn: () => teacherSubmissions(qid, 0, 20),
    enabled: Number.isFinite(qid),
  })

  if (!Number.isFinite(qid)) return null

  return (
    <div className="mx-auto max-w-4xl space-y-4">
      <h1 className="text-xl font-semibold">Bài nộp quiz #{qid}</h1>
      {(q.data?.content ?? []).map((s) => (
        <Card key={s.attemptId} className="flex flex-wrap items-center justify-between gap-3 p-4">
          <div>
            <div className="font-medium">{s.studentName}</div>
            <div className="text-xs text-slate-500">
              Attempt #{s.attemptNumber} · {String(s.status)}
            </div>
          </div>
          <div className="text-sm">
            Điểm: <b>{s.score ?? '-'}</b>
          </div>
          <Link
            className="text-indigo-600 hover:underline dark:text-indigo-400"
            to={`/quiz/submissions/${s.attemptId}`}
          >
            Chi tiết / nhận xét
          </Link>
        </Card>
      ))}
    </div>
  )
}
