import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { MessageCircle, UserPlus } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { createOrGetDm } from '@/api/conversation'
import { sendFriendRequest } from '@/api/friend'
import { getUserById } from '@/api/user'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function UserPublicProfilePage() {
  const { userId } = useParams()
  const id = Number(userId)
  const navigate = useNavigate()
  const qc = useQueryClient()

  const u = useQuery({
    queryKey: ['user', id],
    queryFn: () => getUserById(id),
    enabled: Number.isFinite(id),
  })

  const dm = useMutation({
    mutationFn: () => createOrGetDm(id),
    onSuccess: (conv) => navigate(`/chat/${conv.id}`),
  })

  const add = useMutation({
    mutationFn: () => sendFriendRequest(id),
    onSuccess: () => void qc.invalidateQueries({ queryKey: ['friends-rec'] }),
  })

  if (!Number.isFinite(id)) return <p>ID không hợp lệ</p>
  if (u.isLoading) return <Skeleton className="mx-auto h-48 max-w-lg" />

  return (
    <div className="mx-auto max-w-lg space-y-4">
      <Card className="space-y-4 p-6">
        <div className="flex gap-4">
          <img
            src={u.data?.profile?.avatarUrl || '/icons.svg'}
            alt=""
            className="h-20 w-20 rounded-full border object-cover"
          />
          <div>
            <h1 className="text-xl font-semibold">{u.data?.profile?.fullName ?? 'Người dùng'}</h1>
            <p className="text-sm text-slate-500">{u.data?.email}</p>
            <p className="mt-2 text-sm">{u.data?.profile?.bio}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" onClick={() => dm.mutate()} disabled={dm.isPending}>
            <MessageCircle className="mr-2 h-4 w-4" />
            Nhắn tin
          </Button>
          <Button type="button" onClick={() => add.mutate()} disabled={add.isPending}>
            <UserPlus className="mr-2 h-4 w-4" />
            Kết bạn
          </Button>
        </div>
      </Card>
    </div>
  )
}
