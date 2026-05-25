import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { recommendFriends } from '@/api/friend'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

export function UserLookupPage() {
  const navigate = useNavigate()
  const [id, setId] = useState('')
  const rec = useQuery({ queryKey: ['friends-rec-page'], queryFn: () => recommendFriends(20) })

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-semibold">Tìm người dùng</h1>
      <Card className="space-y-3">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Backend hiện có <code className="rounded bg-slate-100 px-1 dark:bg-slate-800">GET /user/{'{id}'}</code>.
          Nhập ID để xem hồ sơ công khai (đã đăng nhập).
        </p>
        <div className="flex gap-2">
          <Input
            placeholder="User ID (số)"
            value={id}
            onChange={(e) => setId(e.target.value)}
          />
          <Button
            type="button"
            onClick={() => {
              const n = Number(id)
              if (!Number.isFinite(n)) return
              navigate(`/users/${n}`)
            }}
          >
            Mở
          </Button>
        </div>
      </Card>

      <Card className="space-y-3">
        <h2 className="font-medium">Gợi ý kết bạn</h2>
        {(rec.data ?? []).map((u) => (
          <button
            key={u.userId}
            type="button"
            className="flex w-full items-center justify-between rounded-xl border border-slate-100 p-3 text-left hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900"
            onClick={() => navigate(`/users/${u.userId}`)}
          >
            <div>
              <div className="font-medium">{u.email}</div>
              <div className="text-xs text-slate-500">{u.reason ?? `ID: ${u.userId}`}</div>
            </div>
            <span className="text-indigo-600 text-sm">Xem →</span>
          </button>
        ))}
      </Card>
    </div>
  )
}
